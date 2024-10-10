package com.project.shopapp.services;

import com.project.shopapp.dtos.ProductDTO;
import com.project.shopapp.dtos.ProductImageDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.exceptions.InvalidParamException;
import com.project.shopapp.modules.Product;
import com.project.shopapp.modules.ProductImage;
import com.project.shopapp.responses.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IProductService {
    Product createProduct(ProductDTO productDTO, List<MultipartFile> files) throws DataNotFoundException, InvalidParamException, IOException;
    Product getProductById(Long id) throws DataNotFoundException;

    List<Product> findProductsByIds(List<Long> productIds);
    Page<ProductResponse> getAllProduct(String keyword,Long categoryId,PageRequest pageRequest);
    Product updateProduct(Long id, ProductDTO productDTO, List<MultipartFile> files) throws DataNotFoundException, InvalidParamException, IOException;
    void deleteProduct(Long id);
    boolean existsByName(String name);
//     ProductImage createProductImage(Long productId, ProductImageDTO productImageDTO) throws Exception;

}
