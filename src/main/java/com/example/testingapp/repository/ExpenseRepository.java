package com.example.testingapp.repository;

import com.example.testingapp.entity.AppUser;
import com.example.testingapp.entity.Expense;
import com.example.testingapp.entity.ExpenseCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    
    // Find expenses by user
    List<Expense> findByUserOrderByExpenseDateDesc(AppUser user);
    
    // Find expenses by user with pagination
    Page<Expense> findByUserOrderByExpenseDateDesc(AppUser user, Pageable pageable);
    
    // Find expenses by user and date range
    List<Expense> findByUserAndExpenseDateBetweenOrderByExpenseDateDesc(
        AppUser user, LocalDate startDate, LocalDate endDate);
    
    // Find expenses by user and category
    List<Expense> findByUserAndCategoryOrderByExpenseDateDesc(AppUser user, ExpenseCategory category);
    
    // Find expenses by user and description containing
    List<Expense> findByUserAndDescriptionContainingIgnoreCaseOrderByExpenseDateDesc(
        AppUser user, String description);
    
    // Get total expenses by user
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user = :user")
    BigDecimal getTotalExpensesByUser(@Param("user") AppUser user);
    
    // Get total expenses by user and date range
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user = :user " +
           "AND e.expenseDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalExpensesByUserAndDateRange(@Param("user") AppUser user, 
                                                 @Param("startDate") LocalDate startDate, 
                                                 @Param("endDate") LocalDate endDate);
    
    // Get expenses by category for user
    @Query("SELECT e.category.name, COALESCE(SUM(e.amount), 0) FROM Expense e " +
           "WHERE e.user = :user GROUP BY e.category.name ORDER BY SUM(e.amount) DESC")
    List<Object[]> getExpensesByCategoryForUser(@Param("user") AppUser user);
    
    // Get monthly expenses for user
    @Query("SELECT YEAR(e.expenseDate), MONTH(e.expenseDate), COALESCE(SUM(e.amount), 0) " +
           "FROM Expense e WHERE e.user = :user " +
           "GROUP BY YEAR(e.expenseDate), MONTH(e.expenseDate) " +
           "ORDER BY YEAR(e.expenseDate) DESC, MONTH(e.expenseDate) DESC")
    List<Object[]> getMonthlyExpensesForUser(@Param("user") AppUser user);
    
    // Get recent expenses for user
    List<Expense> findTop10ByUserOrderByCreatedAtDesc(AppUser user);
    
    // Count expenses by user
    long countByUser(AppUser user);
    
    // Find recurring expenses
    List<Expense> findByUserAndIsRecurringTrueOrderByExpenseDateDesc(AppUser user);
}
