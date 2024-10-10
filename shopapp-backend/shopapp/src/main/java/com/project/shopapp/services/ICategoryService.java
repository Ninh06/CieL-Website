package com.project.shopapp.services;

import com.project.shopapp.dtos.CategoryDTO;
import com.project.shopapp.modules.Category;
import com.project.shopapp.responses.CategoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface ICategoryService {
    Category createCategory(CategoryDTO categoryDTO);
    Category getCategory(Long id);
    List<Category> getAllCategory();
    Page<Category> getAllCategories(String keyword, PageRequest pageRequest);
    Category updateCategory(Long categoryId,CategoryDTO categoryDTO);
    void deleteCategory(Long id);


}
