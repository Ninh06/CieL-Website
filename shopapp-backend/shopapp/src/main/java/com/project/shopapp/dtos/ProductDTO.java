package com.project.shopapp.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductDTO {
    @NotBlank(message = "Title is required")
    @Size(min = 3, max =  200, message = "Title not enough length")
    private String name;

    @Min(value = 0, message = "Price must be greater than or equal to 0")
    @Max(value = 10000000, message = "Price must be less than or equal to 10,000,000")
    private Float price;
    private MultipartFile thumbnail;
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

    @JsonProperty("category_id")
    private Long categoryId;

    @JsonProperty("product_images")
    private List<ProductImageDTO> productImages = new ArrayList<>();

    @JsonProperty("images_to_delete")
    private List<String> imagesToDelete = new ArrayList<>();

}
