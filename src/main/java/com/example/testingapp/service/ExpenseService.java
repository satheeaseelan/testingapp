package com.example.testingapp.service;

import com.example.testingapp.dto.ExpenseRequest;
import com.example.testingapp.dto.ExpenseResponse;
import com.example.testingapp.entity.AppUser;
import com.example.testingapp.entity.Expense;
import com.example.testingapp.entity.ExpenseCategory;
import com.example.testingapp.repository.AppUserRepository;
import com.example.testingapp.repository.ExpenseCategoryRepository;
import com.example.testingapp.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ExpenseService {
    
    private final ExpenseRepository expenseRepository;
    private final ExpenseCategoryRepository categoryRepository;
    private final AppUserRepository userRepository;
    
    @Autowired
    public ExpenseService(ExpenseRepository expenseRepository, 
                         ExpenseCategoryRepository categoryRepository,
                         AppUserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }
    
    // Create a new expense
    public ExpenseResponse createExpense(ExpenseRequest request, String username) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        ExpenseCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found: " + request.getCategoryId()));
        
        Expense expense = new Expense(
            request.getDescription(),
            request.getAmount(),
            request.getExpenseDate(),
            category,
            user
        );
        
        expense.setNotes(request.getNotes());
        expense.setPaymentMethod(request.getPaymentMethod());
        expense.setRecurring(request.isRecurring());
        expense.setRecurringFrequency(request.getRecurringFrequency());
        
        Expense savedExpense = expenseRepository.save(expense);
        return new ExpenseResponse(savedExpense);
    }
    
    // Get all expenses for user
    public List<ExpenseResponse> getAllExpensesForUser(String username) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        return expenseRepository.findByUserOrderByExpenseDateDesc(user)
                .stream()
                .map(ExpenseResponse::new)
                .collect(Collectors.toList());
    }
    
    // Get expenses for user with pagination
    public Page<ExpenseResponse> getExpensesForUser(String username, Pageable pageable) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        return expenseRepository.findByUserOrderByExpenseDateDesc(user, pageable)
                .map(ExpenseResponse::new);
    }
    
    // Get expense by ID (only if belongs to user)
    public Optional<ExpenseResponse> getExpenseById(Long id, String username) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        return expenseRepository.findById(id)
                .filter(expense -> expense.getUser().equals(user))
                .map(ExpenseResponse::new);
    }
    
    // Get expenses by date range
    public List<ExpenseResponse> getExpensesByDateRange(String username, LocalDate startDate, LocalDate endDate) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        return expenseRepository.findByUserAndExpenseDateBetweenOrderByExpenseDateDesc(user, startDate, endDate)
                .stream()
                .map(ExpenseResponse::new)
                .collect(Collectors.toList());
    }
    
    // Get expenses by category
    public List<ExpenseResponse> getExpensesByCategory(String username, Long categoryId) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        ExpenseCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found: " + categoryId));
        
        return expenseRepository.findByUserAndCategoryOrderByExpenseDateDesc(user, category)
                .stream()
                .map(ExpenseResponse::new)
                .collect(Collectors.toList());
    }
    
    // Search expenses by description
    public List<ExpenseResponse> searchExpenses(String username, String description) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        return expenseRepository.findByUserAndDescriptionContainingIgnoreCaseOrderByExpenseDateDesc(user, description)
                .stream()
                .map(ExpenseResponse::new)
                .collect(Collectors.toList());
    }
    
    // Update expense
    public Optional<ExpenseResponse> updateExpense(Long id, ExpenseRequest request, String username) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        return expenseRepository.findById(id)
                .filter(expense -> expense.getUser().equals(user))
                .map(expense -> {
                    ExpenseCategory category = categoryRepository.findById(request.getCategoryId())
                            .orElseThrow(() -> new RuntimeException("Category not found: " + request.getCategoryId()));
                    
                    expense.setDescription(request.getDescription());
                    expense.setAmount(request.getAmount());
                    expense.setExpenseDate(request.getExpenseDate());
                    expense.setCategory(category);
                    expense.setNotes(request.getNotes());
                    expense.setPaymentMethod(request.getPaymentMethod());
                    expense.setRecurring(request.isRecurring());
                    expense.setRecurringFrequency(request.getRecurringFrequency());
                    
                    Expense updatedExpense = expenseRepository.save(expense);
                    return new ExpenseResponse(updatedExpense);
                });
    }
    
    // Delete expense
    public boolean deleteExpense(Long id, String username) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        Optional<Expense> expense = expenseRepository.findById(id);
        if (expense.isPresent() && expense.get().getUser().equals(user)) {
            expenseRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    // Get total expenses for user
    public BigDecimal getTotalExpenses(String username) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        return expenseRepository.getTotalExpensesByUser(user);
    }
    
    // Get total expenses for user by date range
    public BigDecimal getTotalExpensesByDateRange(String username, LocalDate startDate, LocalDate endDate) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        return expenseRepository.getTotalExpensesByUserAndDateRange(user, startDate, endDate);
    }
    
    // Get recent expenses
    public List<ExpenseResponse> getRecentExpenses(String username) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        return expenseRepository.findTop10ByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(ExpenseResponse::new)
                .collect(Collectors.toList());
    }
    
    // Get expense count for user
    public long getExpenseCount(String username) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        return expenseRepository.countByUser(user);
    }
    
    // Get recurring expenses
    public List<ExpenseResponse> getRecurringExpenses(String username) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        return expenseRepository.findByUserAndIsRecurringTrueOrderByExpenseDateDesc(user)
                .stream()
                .map(ExpenseResponse::new)
                .collect(Collectors.toList());
    }
}
