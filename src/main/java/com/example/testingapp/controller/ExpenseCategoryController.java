package com.example.testingapp.controller;

import com.example.testingapp.dto.ExpenseCategoryRequest;
import com.example.testingapp.dto.ExpenseCategoryResponse;
import com.example.testingapp.service.ExpenseCategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expense-categories")
public class ExpenseCategoryController {
    
    private final ExpenseCategoryService categoryService;
    
    @Autowired
    public ExpenseCategoryController(ExpenseCategoryService categoryService) {
        this.categoryService = categoryService;
    }
    
    // Create a new category (Admin only)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCategory(@Valid @RequestBody ExpenseCategoryRequest request) {
        try {
            ExpenseCategoryResponse category = categoryService.createCategory(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(category);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    // Get all categories
    @GetMapping
    public ResponseEntity<List<ExpenseCategoryResponse>> getAllCategories() {
        List<ExpenseCategoryResponse> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }
    
    // Get active categories only
    @GetMapping("/active")
    public ResponseEntity<List<ExpenseCategoryResponse>> getActiveCategories() {
        List<ExpenseCategoryResponse> categories = categoryService.getActiveCategories();
        return ResponseEntity.ok(categories);
    }
    
    // Get category by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable Long id) {
        return categoryService.getCategoryById(id)
                .<ResponseEntity<?>>map(category -> ResponseEntity.ok().body(category))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Category not found with id: " + id)));
    }
    
    // Get category by name
    @GetMapping("/name/{name}")
    public ResponseEntity<?> getCategoryByName(@PathVariable String name) {
        return categoryService.getCategoryByName(name)
                .<ResponseEntity<?>>map(category -> ResponseEntity.ok().body(category))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Category not found with name: " + name)));
    }
    
    // Search categories by name
    @GetMapping("/search")
    public ResponseEntity<List<ExpenseCategoryResponse>> searchCategories(@RequestParam String name) {
        List<ExpenseCategoryResponse> categories = categoryService.searchCategoriesByName(name);
        return ResponseEntity.ok(categories);
    }
    
    // Update category (Admin only)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, 
                                           @Valid @RequestBody ExpenseCategoryRequest request) {
        try {
            return categoryService.updateCategory(id, request)
                    .<ResponseEntity<?>>map(category -> ResponseEntity.ok().body(category))
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(Map.of("error", "Category not found with id: " + id)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    // Delete category (Admin only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        if (categoryService.deleteCategory(id)) {
            return ResponseEntity.ok().body(Map.of("message", "Category deleted successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Category not found with id: " + id));
        }
    }
    
    // Deactivate category (Admin only)
    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deactivateCategory(@PathVariable Long id) {
        return categoryService.deactivateCategory(id)
                .<ResponseEntity<?>>map(category -> ResponseEntity.ok().body(category))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Category not found with id: " + id)));
    }
    
    // Get category count
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getCategoryCount() {
        long count = categoryService.getCategoryCount();
        return ResponseEntity.ok(Map.of("count", count));
    }
    
    // Get active category count
    @GetMapping("/count/active")
    public ResponseEntity<Map<String, Long>> getActiveCategoryCount() {
        long count = categoryService.getActiveCategoryCount();
        return ResponseEntity.ok(Map.of("count", count));
    }
    
    // Check if category exists
    @GetMapping("/{id}/exists")
    public ResponseEntity<Map<String, Boolean>> categoryExists(@PathVariable Long id) {
        boolean exists = categoryService.categoryExists(id);
        return ResponseEntity.ok(Map.of("exists", exists));
    }
    
    // Get categories ordered by usage
    @GetMapping("/popular")
    public ResponseEntity<List<ExpenseCategoryResponse>> getPopularCategories() {
        List<ExpenseCategoryResponse> categories = categoryService.getCategoriesOrderedByUsage();
        return ResponseEntity.ok(categories);
    }
}
