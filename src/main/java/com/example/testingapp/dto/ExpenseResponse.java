package com.example.testingapp.dto;

import com.example.testingapp.entity.Expense;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ExpenseResponse {
    
    private Long id;
    private String description;
    private BigDecimal amount;
    private LocalDate expenseDate;
    private ExpenseCategoryResponse category;
    private String notes;
    private Expense.PaymentMethod paymentMethod;
    private boolean isRecurring;
    private Expense.RecurringFrequency recurringFrequency;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public ExpenseResponse() {}
    
    public ExpenseResponse(Expense expense) {
        this.id = expense.getId();
        this.description = expense.getDescription();
        this.amount = expense.getAmount();
        this.expenseDate = expense.getExpenseDate();
        this.category = new ExpenseCategoryResponse(expense.getCategory());
        this.notes = expense.getNotes();
        this.paymentMethod = expense.getPaymentMethod();
        this.isRecurring = expense.isRecurring();
        this.recurringFrequency = expense.getRecurringFrequency();
        this.createdAt = expense.getCreatedAt();
        this.updatedAt = expense.getUpdatedAt();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    public LocalDate getExpenseDate() {
        return expenseDate;
    }
    
    public void setExpenseDate(LocalDate expenseDate) {
        this.expenseDate = expenseDate;
    }
    
    public ExpenseCategoryResponse getCategory() {
        return category;
    }
    
    public void setCategory(ExpenseCategoryResponse category) {
        this.category = category;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public Expense.PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(Expense.PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public boolean isRecurring() {
        return isRecurring;
    }
    
    public void setRecurring(boolean recurring) {
        isRecurring = recurring;
    }
    
    public Expense.RecurringFrequency getRecurringFrequency() {
        return recurringFrequency;
    }
    
    public void setRecurringFrequency(Expense.RecurringFrequency recurringFrequency) {
        this.recurringFrequency = recurringFrequency;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
