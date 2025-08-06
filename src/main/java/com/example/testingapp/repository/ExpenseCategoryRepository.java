package com.example.testingapp.repository;

import com.example.testingapp.entity.ExpenseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseCategoryRepository extends JpaRepository<ExpenseCategory, Long> {
    
    // Find active categories
    List<ExpenseCategory> findByIsActiveTrue();
    
    // Find category by name
    Optional<ExpenseCategory> findByName(String name);
    
    // Check if category name exists
    boolean existsByName(String name);
    
    // Find categories by name containing (case insensitive)
    List<ExpenseCategory> findByNameContainingIgnoreCase(String name);
    
    // Get categories with expense count
    @Query("SELECT c FROM ExpenseCategory c LEFT JOIN c.expenses e " +
           "GROUP BY c.id ORDER BY COUNT(e) DESC")
    List<ExpenseCategory> findCategoriesOrderByExpenseCount();
}
