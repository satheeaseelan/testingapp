package com.example.testingapp.service;

import com.example.testingapp.dto.ExpenseCategoryRequest;
import com.example.testingapp.dto.ExpenseCategoryResponse;
import com.example.testingapp.entity.ExpenseCategory;
import com.example.testingapp.repository.ExpenseCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ExpenseCategoryService {
    
    private final ExpenseCategoryRepository categoryRepository;
    
    @Autowired
    public ExpenseCategoryService(ExpenseCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    
    // Create a new category
    public ExpenseCategoryResponse createCategory(ExpenseCategoryRequest request) {
        // Check if category name already exists
        if (categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Category name already exists: " + request.getName());
        }
        
        ExpenseCategory category = new ExpenseCategory(
            request.getName(),
            request.getDescription(),
            request.getColor(),
            request.getIcon()
        );
        category.setActive(request.isActive());
        
        ExpenseCategory savedCategory = categoryRepository.save(category);
        return new ExpenseCategoryResponse(savedCategory);
    }
    
    // Get all categories
    public List<ExpenseCategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(ExpenseCategoryResponse::new)
                .collect(Collectors.toList());
    }
    
    // Get active categories only
    public List<ExpenseCategoryResponse> getActiveCategories() {
        return categoryRepository.findByIsActiveTrue()
                .stream()
                .map(ExpenseCategoryResponse::new)
                .collect(Collectors.toList());
    }
    
    // Get category by ID
    public Optional<ExpenseCategoryResponse> getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .map(ExpenseCategoryResponse::new);
    }
    
    // Get category by name
    public Optional<ExpenseCategoryResponse> getCategoryByName(String name) {
        return categoryRepository.findByName(name)
                .map(ExpenseCategoryResponse::new);
    }
    
    // Search categories by name
    public List<ExpenseCategoryResponse> searchCategoriesByName(String name) {
        return categoryRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(ExpenseCategoryResponse::new)
                .collect(Collectors.toList());
    }
    
    // Update category
    public Optional<ExpenseCategoryResponse> updateCategory(Long id, ExpenseCategoryRequest request) {
        return categoryRepository.findById(id)
                .map(category -> {
                    // Check if new name already exists (excluding current category)
                    if (!category.getName().equals(request.getName()) && 
                        categoryRepository.existsByName(request.getName())) {
                        throw new RuntimeException("Category name already exists: " + request.getName());
                    }
                    
                    category.setName(request.getName());
                    category.setDescription(request.getDescription());
                    category.setColor(request.getColor());
                    category.setIcon(request.getIcon());
                    category.setActive(request.isActive());
                    
                    ExpenseCategory updatedCategory = categoryRepository.save(category);
                    return new ExpenseCategoryResponse(updatedCategory);
                });
    }
    
    // Delete category
    public boolean deleteCategory(Long id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    // Deactivate category (soft delete)
    public Optional<ExpenseCategoryResponse> deactivateCategory(Long id) {
        return categoryRepository.findById(id)
                .map(category -> {
                    category.setActive(false);
                    ExpenseCategory updatedCategory = categoryRepository.save(category);
                    return new ExpenseCategoryResponse(updatedCategory);
                });
    }
    
    // Check if category exists
    public boolean categoryExists(Long id) {
        return categoryRepository.existsById(id);
    }
    
    // Get total category count
    public long getCategoryCount() {
        return categoryRepository.count();
    }
    
    // Get active category count
    public long getActiveCategoryCount() {
        return categoryRepository.findByIsActiveTrue().size();
    }
    
    // Get categories ordered by expense count
    public List<ExpenseCategoryResponse> getCategoriesOrderedByUsage() {
        return categoryRepository.findCategoriesOrderByExpenseCount()
                .stream()
                .map(ExpenseCategoryResponse::new)
                .collect(Collectors.toList());
    }
}
