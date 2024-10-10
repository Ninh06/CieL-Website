package com.project.shopapp.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.shopapp.modules.Product;
import com.project.shopapp.dtos.ProductImageDTO;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductResponse {
    private Long id;
    private String name;
    private Float price;
    private String thumbnail;
    private String description;

    @JsonProperty("face_size")
    private float face_size;

    @JsonProperty("thickness")
    private float thickness;

    @JsonProperty("face_color")
    private String face_color;

    @JsonProperty("machine_type")
    private String machine_type;

    @JsonProperty("wire_size")
    private float wire_size;

    @JsonProperty("glass_surface")
    private String glass_surface;

    @JsonProperty("wire_material")
    private String wire_material;

    @JsonProperty("product_images")
    private List<ProductImageDTO> productImages = new ArrayList<>();

    @JsonProperty("category_id")
    private String categoryId;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;

    public static ProductResponse fromProduct(Product product) {
        ProductResponse productResponse = ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .thumbnail(product.getThumbnail())
                .description(product.getDescription())
                .face_size(product.getFace_size())
                .thickness(product.getThickness())
                .face_color(product.getFace_color())
                .machine_type(product.getMachine_type())
                .wire_size(product.getWire_size())
                .glass_surface(product.getGlass_surface())
                .wire_material(product.getWire_material())
                .categoryId(product.getCategory().getName())
                .productImages(product.getProductImages().stream()
                        .map(productImage -> new ProductImageDTO(productImage.getId(), productImage.getImageUrl()))
                        .collect(Collectors.toList()))
                .build();
        productResponse.setCreatedAt(product.getCreatedAt());
        productResponse.setUpdatedAt(product.getUpdatedAt());

        return productResponse;
    }
}
