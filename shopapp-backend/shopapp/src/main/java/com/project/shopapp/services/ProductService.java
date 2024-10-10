package com.project.shopapp.services;

import com.project.shopapp.dtos.ProductDTO;
import com.project.shopapp.dtos.ProductImageDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.exceptions.InvalidParamException;
import com.project.shopapp.modules.Category;
import com.project.shopapp.modules.Product;
import com.project.shopapp.modules.ProductImage;
import com.project.shopapp.repositories.CategoryRepository;
import com.project.shopapp.repositories.ProductImageRepository;
import com.project.shopapp.repositories.ProductRepository;
import com.project.shopapp.responses.ProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ProductService implements IProductService{
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;
    @Override
    public Product createProduct(ProductDTO productDTO, List<MultipartFile> files) throws DataNotFoundException, InvalidParamException, IOException {
        Category existingCategory = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() ->
                        new DataNotFoundException("Không tìm thấy danh mục có id: " + productDTO.getCategoryId()));

        Product newProduct = Product.builder()
                .name(productDTO.getName())
                .price(productDTO.getPrice())
                .description(productDTO.getDescription())
                .face_size(productDTO.getFace_size())
                .thickness(productDTO.getThickness())
                .face_color(productDTO.getFace_color())
                .machine_type(productDTO.getMachine_type())
                .wire_size(productDTO.getWire_size())
                .glass_surface(productDTO.getGlass_surface())
                .wire_material(productDTO.getWire_material())
                .category(existingCategory)
                .build();

        // Xử lý thumbnail
        if (productDTO.getThumbnail() != null && !productDTO.getThumbnail().isEmpty()) {
            String thumbnailFileName = storeFile(productDTO.getThumbnail());
            newProduct.setThumbnail(thumbnailFileName);
        }

        Product savedProduct = productRepository.save(newProduct);

        // Lưu các hình ảnh
        for (MultipartFile file : files) {
            String fileName = storeFile(file);
            ProductImage newProductImage = ProductImage.builder()
                    .product(savedProduct)
                    .imageUrl(fileName)
                    .build();

            // Kiểm tra số lượng ảnh không vượt quá giới hạn
            int size = productImageRepository.findByProductId(savedProduct.getId()).size();
            if (size >= ProductImage.MAXIMUM_IMAGES_PER_PRODUCT) {
                throw new InvalidParamException("Số lượng hình ảnh phải <= " +
                        ProductImage.MAXIMUM_IMAGES_PER_PRODUCT);
            }

            productImageRepository.save(newProductImage);
        }

        return savedProduct;
    }


    @Override
    public Product getProductById(Long id) throws DataNotFoundException {
        return productRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy sản phẩm có id: " + id));
    }

    @Override
    public List<Product> findProductsByIds(List<Long> productIds) {
        return productRepository.findProductsByIds(productIds);
    }


    @Override
    public Page<ProductResponse> getAllProduct(String keyword,Long categoryId,PageRequest pageRequest) {
        //Lấy danh sách sản phẩm theo trang(page) và giới hạn(limit) và categoryId (nếu có)
        Page<Product> productPage;
        productPage = productRepository.searchProducts(categoryId, keyword, pageRequest);
        return productPage.map(ProductResponse::fromProduct);
    }

    @Override
    @Transactional
    public Product updateProduct(Long id, ProductDTO productDTO, List<MultipartFile> files) throws DataNotFoundException, InvalidParamException, IOException {
        Product existingProduct = getProductById(id);
        if (existingProduct != null) {
            // Cập nhật các thuộc tính của sản phẩm
            Category existingCategory = categoryRepository.findById(productDTO.getCategoryId())
                    .orElseThrow(() -> new DataNotFoundException("Không tìm thấy danh mục có id: " + productDTO.getCategoryId()));
            existingProduct.setName(productDTO.getName());
            existingProduct.setCategory(existingCategory);
            existingProduct.setPrice(productDTO.getPrice());
            existingProduct.setDescription(productDTO.getDescription());

            if (productDTO.getThumbnail() != null && !productDTO.getThumbnail().isEmpty()) {
                String thumbnailFileName = storeFile(productDTO.getThumbnail());
                existingProduct.setThumbnail(thumbnailFileName);
            }
            // Xử lý thêm hình ảnh mới
            List<ProductImage> existingImages = productImageRepository.findByProductId(existingProduct.getId());
            int currentImageCount = existingImages.size();

            for (MultipartFile file : files) {
                if (currentImageCount >= ProductImage.MAXIMUM_IMAGES_PER_PRODUCT) {
                    throw new InvalidParamException("Số lượng hình ảnh phải <= " +
                            ProductImage.MAXIMUM_IMAGES_PER_PRODUCT);
                }
                String fileName = storeFile(file);
                ProductImage newProductImage = ProductImage.builder()
                        .product(existingProduct)
                        .imageUrl(fileName)
                        .build();
                productImageRepository.save(newProductImage);
                currentImageCount++;
            }

            // Xóa các hình ảnh đã được đánh dấu để xóa
            if (productDTO.getImagesToDelete() != null && !productDTO.getImagesToDelete().isEmpty()) {
                for (String imageUrl : productDTO.getImagesToDelete()) {
                    // Tìm hình ảnh cần xóa
                    Optional<ProductImage> imageToDelete = existingImages.stream()
                            .filter(img -> img.getImageUrl().equals(imageUrl))
                            .findFirst();

                    if (imageToDelete.isPresent()) {
                        // Xóa file ảnh khỏi hệ thống tệp
                        deleteFile(imageToDelete.get().getImageUrl());
                        // Xóa ảnh khỏi cơ sở dữ liệu
                        productImageRepository.delete(imageToDelete.get());
                        currentImageCount--;
                    }
                }
            }
            Product updatedProduct = productRepository.save(existingProduct);
            return updatedProduct;
        }

        throw new DataNotFoundException("Không tìm thấy sản phẩm có id: " + id);
    }



    @Override
    public void deleteProduct(Long id) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        optionalProduct.ifPresent(productRepository::delete);
    }

    @Override
    public boolean existsByName(String name) {
        return productRepository.existsByName(name);
    }

    public void updateThumbnail(Long productId, String thumbnailUrl) throws Exception {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy sản phẩm có id: " + productId));
        product.setThumbnail(thumbnailUrl);
        productRepository.save(product);
    }


    public boolean isImagesFile(MultipartFile file){
        String contentType = file.getContentType();
        return contentType != null && contentType.startsWith("image/");
    }

    public String storeFile(MultipartFile file) throws IOException {
        if(!isImagesFile(file) || file.getOriginalFilename() == null) {
            throw new IOException("Định dạng hình ảnh không hợp lệ");
        }
        String filename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        //Thêm UUID vào trước tên file để đảm bảo tên file là duy nhất
        String uniqueFileName = UUID.randomUUID().toString() + "_" + filename;
        //Đường dẫn đến thư mục mà bạn muốn lưu file
        Path uploadDir = Paths.get("uploads");
        //Kiểm tra và tạo thư mục nếu nó không tồn tại
        if(!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        };
        //Đường dẫn đầy đủ tên File
        Path destination = Paths.get(uploadDir.toString(), uniqueFileName);
        //Sao chép file vào thư mục đích
        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
        return uniqueFileName;
    }

    public void deleteFile(String filename) throws IOException {
        Path uploadDir = Paths.get("uploads");
        Path filePath = uploadDir.resolve(filename);

        if (Files.exists(filePath)) {
            Files.delete(filePath);
            System.out.println("File đã được xóa: " + filename);
        } else {
            throw new IOException("File không tồn tại: " + filename);
        }
    }


    @Transactional
    public void deleteAllImagesByProductId(Long productId) throws DataNotFoundException, IOException {
        // Tìm sản phẩm theo ID
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy sản phẩm có id: " + productId));

        // Lấy danh sách các hình ảnh của sản phẩm
        List<ProductImage> images = productImageRepository.findByProductId(productId);

        // Xóa các hình ảnh khỏi thư mục uploads
        for (ProductImage image : images) {
            deleteFile(image.getImageUrl());
        }

        // Xóa các bản ghi hình ảnh khỏi cơ sở dữ liệu
        productImageRepository.deleteAll(images);
    }

}
