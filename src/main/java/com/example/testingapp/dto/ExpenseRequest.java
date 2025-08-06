package com.example.testingapp.dto;

import com.example.testingapp.entity.Expense;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ExpenseRequest {
    
    @NotBlank(message = "Description is required")
    @Size(min = 2, max = 255, message = "Description must be between 2 and 255 characters")
    private String description;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;
    
    @NotNull(message = "Expense date is required")
    private LocalDate expenseDate;
    
    @NotNull(message = "Category ID is required")
    private Long categoryId;
    
    @Size(max = 500, message = "Notes cannot exceed 500 characters")
    private String notes;
    
    private Expense.PaymentMethod paymentMethod = Expense.PaymentMethod.CASH;
    
    private boolean isRecurring = false;
    
    private Expense.RecurringFrequency recurringFrequency;
    
    // Constructors
    public ExpenseRequest() {}
    
    public ExpenseRequest(String description, BigDecimal amount, LocalDate expenseDate, Long categoryId) {
        this.description = description;
        this.amount = amount;
        this.expenseDate = expenseDate;
        this.categoryId = categoryId;
    }
    
    // Getters and Setters
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
    
    public Long getCategoryId() {
        return categoryId;
    }
    
    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
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
}
