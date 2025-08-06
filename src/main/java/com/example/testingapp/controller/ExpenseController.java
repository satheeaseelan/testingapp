package com.example.testingapp.controller;

import com.example.testingapp.dto.ExpenseRequest;
import com.example.testingapp.dto.ExpenseResponse;
import com.example.testingapp.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    
    private final ExpenseService expenseService;
    
    @Autowired
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }
    
    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
    
    // Create a new expense
    @PostMapping
    public ResponseEntity<?> createExpense(@Valid @RequestBody ExpenseRequest request) {
        try {
            ExpenseResponse expense = expenseService.createExpense(request, getCurrentUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body(expense);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    // Get all expenses for current user
    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getAllExpenses() {
        List<ExpenseResponse> expenses = expenseService.getAllExpensesForUser(getCurrentUsername());
        return ResponseEntity.ok(expenses);
    }
    
    // Get expenses with pagination
    @GetMapping("/paginated")
    public ResponseEntity<Page<ExpenseResponse>> getExpensesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ExpenseResponse> expenses = expenseService.getExpensesForUser(getCurrentUsername(), pageable);
        return ResponseEntity.ok(expenses);
    }
    
    // Get expense by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getExpenseById(@PathVariable Long id) {
        return expenseService.getExpenseById(id, getCurrentUsername())
                .<ResponseEntity<?>>map(expense -> ResponseEntity.ok().body(expense))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Expense not found with id: " + id)));
    }
    
    // Get expenses by date range
    @GetMapping("/date-range")
    public ResponseEntity<List<ExpenseResponse>> getExpensesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<ExpenseResponse> expenses = expenseService.getExpensesByDateRange(
                getCurrentUsername(), startDate, endDate);
        return ResponseEntity.ok(expenses);
    }
    
    // Get expenses by category
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<?> getExpensesByCategory(@PathVariable Long categoryId) {
        try {
            List<ExpenseResponse> expenses = expenseService.getExpensesByCategory(
                    getCurrentUsername(), categoryId);
            return ResponseEntity.ok(expenses);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    // Search expenses by description
    @GetMapping("/search")
    public ResponseEntity<List<ExpenseResponse>> searchExpenses(@RequestParam String description) {
        List<ExpenseResponse> expenses = expenseService.searchExpenses(getCurrentUsername(), description);
        return ResponseEntity.ok(expenses);
    }
    
    // Update expense
    @PutMapping("/{id}")
    public ResponseEntity<?> updateExpense(@PathVariable Long id, 
                                          @Valid @RequestBody ExpenseRequest request) {
        try {
            return expenseService.updateExpense(id, request, getCurrentUsername())
                    .<ResponseEntity<?>>map(expense -> ResponseEntity.ok().body(expense))
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(Map.of("error", "Expense not found with id: " + id)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    // Delete expense
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        if (expenseService.deleteExpense(id, getCurrentUsername())) {
            return ResponseEntity.ok().body(Map.of("message", "Expense deleted successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Expense not found with id: " + id));
        }
    }
    
    // Get total expenses
    @GetMapping("/total")
    public ResponseEntity<Map<String, BigDecimal>> getTotalExpenses() {
        BigDecimal total = expenseService.getTotalExpenses(getCurrentUsername());
        return ResponseEntity.ok(Map.of("total", total));
    }
    
    // Get total expenses by date range
    @GetMapping("/total/date-range")
    public ResponseEntity<Map<String, BigDecimal>> getTotalExpensesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        BigDecimal total = expenseService.getTotalExpensesByDateRange(
                getCurrentUsername(), startDate, endDate);
        return ResponseEntity.ok(Map.of("total", total));
    }
    
    // Get recent expenses
    @GetMapping("/recent")
    public ResponseEntity<List<ExpenseResponse>> getRecentExpenses() {
        List<ExpenseResponse> expenses = expenseService.getRecentExpenses(getCurrentUsername());
        return ResponseEntity.ok(expenses);
    }
    
    // Get expense count
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getExpenseCount() {
        long count = expenseService.getExpenseCount(getCurrentUsername());
        return ResponseEntity.ok(Map.of("count", count));
    }
    
    // Get recurring expenses
    @GetMapping("/recurring")
    public ResponseEntity<List<ExpenseResponse>> getRecurringExpenses() {
        List<ExpenseResponse> expenses = expenseService.getRecurringExpenses(getCurrentUsername());
        return ResponseEntity.ok(expenses);
    }
}
