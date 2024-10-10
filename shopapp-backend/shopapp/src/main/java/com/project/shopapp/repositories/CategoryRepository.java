package com.project.shopapp.repositories;

import com.project.shopapp.modules.Category;
import com.project.shopapp.modules.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Query("SELECT c FROM Category c WHERE " +
            "(:keyword IS NULL OR :keyword = '' OR c.name LIKE %:keyword%)")
    Page<Category> searchCategories(@Param("keyword") String keyword, Pageable pageable);
}
