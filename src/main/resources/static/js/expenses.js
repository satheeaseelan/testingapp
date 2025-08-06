// Expense Management
class ExpenseManager {
    constructor() {
        this.baseUrl = '/api/expenses';
        this.categoriesUrl = '/api/expense-categories';
        this.expenses = [];
        this.categories = [];
        this.filteredExpenses = [];
        this.currentEditingExpense = null;
        this.init();
    }

    init() {
        if (window.authManager && window.authManager.isAuthenticated()) {
            this.loadData();
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.filterExpenses());
        }

        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterExpenses());
        }

        // Month filter
        const monthFilter = document.getElementById('monthFilter');
        if (monthFilter) {
            monthFilter.addEventListener('change', () => this.filterExpenses());
            // Set current month as default
            const now = new Date();
            monthFilter.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        }

        // Save expense button
        const saveExpenseBtn = document.getElementById('saveExpenseBtn');
        if (saveExpenseBtn) {
            saveExpenseBtn.addEventListener('click', () => this.saveExpense());
        }

        // Confirm delete button
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', () => this.confirmDelete());
        }

        // Recurring checkbox
        const isRecurringCheckbox = document.getElementById('isRecurring');
        if (isRecurringCheckbox) {
            isRecurringCheckbox.addEventListener('change', function() {
                const frequencyDiv = document.getElementById('recurringFrequencyDiv');
                if (frequencyDiv) {
                    frequencyDiv.style.display = this.checked ? 'block' : 'none';
                }
            });
        }

        // Expense form validation
        const expenseForm = document.getElementById('expenseForm');
        if (expenseForm) {
            expenseForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveExpense();
            });
        }
    }

    async loadData() {
        try {
            this.showLoading(true);
            
            await Promise.all([
                this.loadExpenses(),
                this.loadCategories()
            ]);

            this.populateCategoryFilters();
            this.filterExpenses();
            this.updateStatistics();

        } catch (error) {
            console.error('Error loading data:', error);
            this.showAlert('Error loading data', 'danger');
        } finally {
            this.showLoading(false);
        }
    }

    async loadExpenses() {
        const response = await window.authManager.makeAuthenticatedRequest(this.baseUrl);
        if (!response || !response.ok) {
            throw new Error('Failed to load expenses');
        }
        this.expenses = await response.json();
    }

    async loadCategories() {
        const response = await window.authManager.makeAuthenticatedRequest(this.categoriesUrl);
        if (!response || !response.ok) {
            throw new Error('Failed to load categories');
        }
        this.categories = await response.json();
    }

    populateCategoryFilters() {
        // Populate category filter dropdown
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.innerHTML = '<option value="">All Categories</option>';
            this.categories.forEach(category => {
                categoryFilter.innerHTML += `<option value="${category.id}">${category.name}</option>`;
            });
        }

        // Populate category select in modal
        const categorySelect = document.getElementById('categoryId');
        if (categorySelect) {
            categorySelect.innerHTML = '<option value="">Select Category</option>';
            this.categories.forEach(category => {
                categorySelect.innerHTML += `<option value="${category.id}">${category.name}</option>`;
            });
        }
    }

    filterExpenses() {
        const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const categoryId = document.getElementById('categoryFilter')?.value || '';
        const monthFilter = document.getElementById('monthFilter')?.value || '';

        this.filteredExpenses = this.expenses.filter(expense => {
            // Search filter
            const matchesSearch = !searchTerm || 
                expense.description.toLowerCase().includes(searchTerm) ||
                (expense.category && expense.category.name.toLowerCase().includes(searchTerm));

            // Category filter
            const matchesCategory = !categoryId || 
                (expense.category && expense.category.id.toString() === categoryId);

            // Month filter
            const matchesMonth = !monthFilter || 
                expense.expenseDate.startsWith(monthFilter);

            return matchesSearch && matchesCategory && matchesMonth;
        });

        this.renderExpenses();
    }

    renderExpenses() {
        const tbody = document.getElementById('expensesTableBody');
        const noExpensesMessage = document.getElementById('noExpensesMessage');
        
        if (!tbody) return;

        if (this.filteredExpenses.length === 0) {
            tbody.innerHTML = '';
            if (noExpensesMessage) {
                noExpensesMessage.classList.remove('d-none');
            }
            return;
        }

        if (noExpensesMessage) {
            noExpensesMessage.classList.add('d-none');
        }

        const expensesHtml = this.filteredExpenses.map(expense => `
            <tr>
                <td>
                    <div class="fw-bold">${this.formatDate(expense.expenseDate)}</div>
                    <small class="text-muted">${this.getRelativeTime(expense.expenseDate)}</small>
                </td>
                <td>
                    <div class="fw-bold">${expense.description}</div>
                    ${expense.notes ? `<small class="text-muted">${expense.notes}</small>` : ''}
                </td>
                <td>
                    <span class="badge" style="background-color: ${expense.category?.color || '#6c757d'};">
                        <i class="fas fa-${expense.category?.icon || 'tag'} me-1"></i>
                        ${expense.category?.name || 'No Category'}
                    </span>
                </td>
                <td>
                    <div class="fw-bold text-success">$${parseFloat(expense.amount).toFixed(2)}</div>
                    ${expense.isRecurring ? '<small class="text-info"><i class="fas fa-repeat me-1"></i>Recurring</small>' : ''}
                </td>
                <td>
                    <span class="badge bg-secondary">
                        <i class="fas fa-${this.getPaymentMethodIcon(expense.paymentMethod)} me-1"></i>
                        ${this.formatPaymentMethod(expense.paymentMethod)}
                    </span>
                </td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="expenseManager.editExpense(${expense.id})" 
                                title="Edit Expense">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="expenseManager.deleteExpense(${expense.id})" 
                                title="Delete Expense">
                            <i class="fas fa-trash"></i>
                        </button>
                        ${expense.receiptUrl ? `
                            <a href="${expense.receiptUrl}" target="_blank" class="btn btn-sm btn-outline-info" 
                               title="View Receipt">
                                <i class="fas fa-receipt"></i>
                            </a>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');

        tbody.innerHTML = expensesHtml;
    }

    updateStatistics() {
        // Total expense count
        const totalExpenseCountElement = document.getElementById('totalExpenseCount');
        if (totalExpenseCountElement) {
            totalExpenseCountElement.textContent = this.expenses.length;
        }

        // Total amount
        const totalAmount = this.expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        const totalAmountElement = document.getElementById('totalAmount');
        if (totalAmountElement) {
            totalAmountElement.textContent = `$${totalAmount.toFixed(2)}`;
        }

        // Monthly amount
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyExpenses = this.expenses.filter(expense => {
            const expenseDate = new Date(expense.expenseDate);
            return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
        });
        const monthlyAmount = monthlyExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        const monthlyAmountElement = document.getElementById('monthlyAmount');
        if (monthlyAmountElement) {
            monthlyAmountElement.textContent = `$${monthlyAmount.toFixed(2)}`;
        }

        // Category count
        const categoryCountElement = document.getElementById('categoryCount');
        if (categoryCountElement) {
            categoryCountElement.textContent = this.categories.length;
        }
    }

    openAddExpenseModal() {
        this.currentEditingExpense = null;
        this.resetForm();
        document.getElementById('modalTitle').textContent = 'Add New Expense';

        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('expenseDate').value = today;

        const modal = new bootstrap.Modal(document.getElementById('expenseModal'));

        // Add event listener for modal cleanup
        const modalElement = document.getElementById('expenseModal');
        modalElement.addEventListener('hidden.bs.modal', this.cleanupModal.bind(this), { once: true });

        modal.show();
    }

    editExpense(expenseId) {
        const expense = this.expenses.find(e => e.id === expenseId);
        if (!expense) return;

        this.currentEditingExpense = expense;
        this.populateForm(expense);
        document.getElementById('modalTitle').textContent = 'Edit Expense';

        const modal = new bootstrap.Modal(document.getElementById('expenseModal'));

        // Add event listener for modal cleanup
        const modalElement = document.getElementById('expenseModal');
        modalElement.addEventListener('hidden.bs.modal', this.cleanupModal.bind(this), { once: true });

        modal.show();
    }

    deleteExpense(expenseId) {
        const expense = this.expenses.find(e => e.id === expenseId);
        if (!expense) return;

        this.currentEditingExpense = expense;
        
        const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
    }

    async saveExpense() {
        const form = document.getElementById('expenseForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const expenseData = {
            description: document.getElementById('description').value.trim(),
            amount: parseFloat(document.getElementById('amount').value),
            categoryId: parseInt(document.getElementById('categoryId').value),
            expenseDate: document.getElementById('expenseDate').value,
            paymentMethod: document.getElementById('paymentMethod').value,
            receiptUrl: document.getElementById('receiptUrl').value.trim() || null,
            notes: document.getElementById('notes').value.trim() || null,
            isRecurring: document.getElementById('isRecurring').checked,
            recurringFrequency: document.getElementById('isRecurring').checked ? 
                document.getElementById('recurringFrequency').value : null
        };

        try {
            const saveBtn = document.getElementById('saveExpenseBtn');
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Saving...';

            let response;
            if (this.currentEditingExpense) {
                // Update existing expense
                response = await window.authManager.makeAuthenticatedRequest(
                    `${this.baseUrl}/${this.currentEditingExpense.id}`,
                    {
                        method: 'PUT',
                        body: JSON.stringify(expenseData)
                    }
                );
            } else {
                // Create new expense
                response = await window.authManager.makeAuthenticatedRequest(this.baseUrl, {
                    method: 'POST',
                    body: JSON.stringify(expenseData)
                });
            }

            if (response && response.ok) {
                const savedExpense = await response.json();
                
                if (this.currentEditingExpense) {
                    // Update existing expense in array
                    const index = this.expenses.findIndex(e => e.id === this.currentEditingExpense.id);
                    if (index !== -1) {
                        this.expenses[index] = savedExpense;
                    }
                    this.showAlert('Expense updated successfully!', 'success');
                } else {
                    // Add new expense to array
                    this.expenses.push(savedExpense);
                    this.showAlert('Expense created successfully!', 'success');
                }

                this.filterExpenses();
                this.updateStatistics();
                
                // Close modal properly
                this.closeModal('expenseModal');
                
            } else {
                const errorData = await response.json();
                this.showAlert(errorData.message || 'Error saving expense', 'danger');
            }

        } catch (error) {
            console.error('Error saving expense:', error);
            this.showAlert('Error saving expense', 'danger');
        } finally {
            const saveBtn = document.getElementById('saveExpenseBtn');
            saveBtn.disabled = false;
            saveBtn.innerHTML = '<i class="fas fa-save me-2"></i>Save Expense';
        }
    }

    async confirmDelete() {
        if (!this.currentEditingExpense) return;

        try {
            const deleteBtn = document.getElementById('confirmDeleteBtn');
            deleteBtn.disabled = true;
            deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Deleting...';

            const response = await window.authManager.makeAuthenticatedRequest(
                `${this.baseUrl}/${this.currentEditingExpense.id}`,
                { method: 'DELETE' }
            );

            if (response && response.ok) {
                // Remove expense from array
                this.expenses = this.expenses.filter(e => e.id !== this.currentEditingExpense.id);
                this.filterExpenses();
                this.updateStatistics();
                
                this.showAlert('Expense deleted successfully!', 'success');
                
                // Close modal properly
                this.closeModal('deleteModal');
                
            } else {
                this.showAlert('Error deleting expense', 'danger');
            }

        } catch (error) {
            console.error('Error deleting expense:', error);
            this.showAlert('Error deleting expense', 'danger');
        } finally {
            const deleteBtn = document.getElementById('confirmDeleteBtn');
            deleteBtn.disabled = false;
            deleteBtn.innerHTML = '<i class="fas fa-trash me-2"></i>Delete Expense';
        }
    }

    populateForm(expense) {
        document.getElementById('expenseId').value = expense.id;
        document.getElementById('description').value = expense.description;
        document.getElementById('amount').value = expense.amount;
        document.getElementById('categoryId').value = expense.category?.id || '';
        document.getElementById('expenseDate').value = expense.expenseDate;
        document.getElementById('paymentMethod').value = expense.paymentMethod || 'CASH';
        document.getElementById('receiptUrl').value = expense.receiptUrl || '';
        document.getElementById('notes').value = expense.notes || '';
        document.getElementById('isRecurring').checked = expense.isRecurring || false;
        document.getElementById('recurringFrequency').value = expense.recurringFrequency || 'MONTHLY';
        
        // Show/hide recurring frequency
        const frequencyDiv = document.getElementById('recurringFrequencyDiv');
        if (frequencyDiv) {
            frequencyDiv.style.display = expense.isRecurring ? 'block' : 'none';
        }
    }

    resetForm() {
        const form = document.getElementById('expenseForm');
        form.reset();
        form.classList.remove('was-validated');
        
        // Clear validation states
        const inputs = form.querySelectorAll('.form-control, .form-select');
        inputs.forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });

        // Hide recurring frequency
        const frequencyDiv = document.getElementById('recurringFrequencyDiv');
        if (frequencyDiv) {
            frequencyDiv.style.display = 'none';
        }
    }

    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.style.display = show ? 'block' : 'none';
        }
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    }

    getRelativeTime(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return 'Today';
        } else if (diffDays === 2) {
            return 'Yesterday';
        } else if (diffDays <= 7) {
            return `${diffDays - 1} days ago`;
        } else {
            return '';
        }
    }

    formatPaymentMethod(method) {
        const methods = {
            'CASH': 'Cash',
            'CREDIT_CARD': 'Credit Card',
            'DEBIT_CARD': 'Debit Card',
            'BANK_TRANSFER': 'Bank Transfer',
            'DIGITAL_WALLET': 'Digital Wallet',
            'CHECK': 'Check',
            'OTHER': 'Other'
        };
        return methods[method] || method;
    }

    getPaymentMethodIcon(method) {
        const icons = {
            'CASH': 'money-bill',
            'CREDIT_CARD': 'credit-card',
            'DEBIT_CARD': 'credit-card',
            'BANK_TRANSFER': 'university',
            'DIGITAL_WALLET': 'mobile-alt',
            'CHECK': 'money-check',
            'OTHER': 'question'
        };
        return icons[method] || 'question';
    }

    showAlert(message, type = 'info') {
        if (window.authManager) {
            window.authManager.showAlert(message, type);
        }
    }

    cleanupModal() {
        // Remove any remaining modal backdrops
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());

        // Remove modal-open class from body
        document.body.classList.remove('modal-open');

        // Reset body styles
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        console.log('Modal cleanup completed');
    }

    closeModal(modalId) {
        const modalElement = document.getElementById(modalId);
        const modal = bootstrap.Modal.getInstance(modalElement);

        if (modal) {
            modal.hide();
        }

        // Force cleanup after a short delay
        setTimeout(() => {
            this.cleanupModal();
        }, 300);
    }
}

// Global functions
function openAddExpenseModal() {
    if (window.expenseManager) {
        window.expenseManager.openAddExpenseModal();
    }
}

// Initialize expense manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for auth manager to be ready
    setTimeout(() => {
        window.expenseManager = new ExpenseManager();
    }, 100);
});
