// Dashboard Management
class DashboardManager {
    constructor() {
        this.baseUrl = '/api';
        this.init();
    }

    init() {
        if (window.authManager && window.authManager.isAuthenticated()) {
            this.loadDashboardData();
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        // Refresh dashboard button
        const refreshBtn = document.querySelector('[onclick="refreshDashboard()"]');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshDashboard());
        }

        // Export data button
        const exportBtn = document.querySelector('[onclick="exportData()"]');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }
    }

    async loadDashboardData() {
        try {
            await Promise.all([
                this.loadStatistics(),
                this.loadRecentUsers(),
                this.loadRecentExpenses()
            ]);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showAlert('Error loading dashboard data', 'danger');
        }
    }

    async loadStatistics() {
        try {
            // Load user statistics
            const usersResponse = await window.authManager.makeAuthenticatedRequest(`${this.baseUrl}/users`);
            if (usersResponse && usersResponse.ok) {
                const users = await usersResponse.json();
                document.getElementById('totalUsers').textContent = users.length;
            }

            // Load expense statistics
            const expensesResponse = await window.authManager.makeAuthenticatedRequest(`${this.baseUrl}/expenses`);
            if (expensesResponse && expensesResponse.ok) {
                const expenses = await expensesResponse.json();
                
                const totalAmount = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
                document.getElementById('totalExpenses').textContent = `$${totalAmount.toFixed(2)}`;

                // Calculate monthly expenses
                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();
                const monthlyExpenses = expenses.filter(expense => {
                    const expenseDate = new Date(expense.expenseDate);
                    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
                });
                const monthlyAmount = monthlyExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
                document.getElementById('monthlyExpenses').textContent = `$${monthlyAmount.toFixed(2)}`;
            }

            // Load categories
            const categoriesResponse = await window.authManager.makeAuthenticatedRequest(`${this.baseUrl}/expense-categories`);
            if (categoriesResponse && categoriesResponse.ok) {
                const categories = await categoriesResponse.json();
                document.getElementById('totalCategories').textContent = categories.length;
            }

        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    }

    async loadRecentUsers() {
        try {
            const response = await window.authManager.makeAuthenticatedRequest(`${this.baseUrl}/users`);
            if (!response || !response.ok) return;

            const users = await response.json();
            const recentUsers = users.slice(0, 5); // Get last 5 users

            const container = document.getElementById('recentUsersContainer');
            if (!container) return;

            if (recentUsers.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-3">
                        <i class="fas fa-users fa-2x text-muted mb-2"></i>
                        <p class="text-muted mb-0">No users found</p>
                    </div>
                `;
                return;
            }

            const usersHtml = recentUsers.map(user => `
                <div class="d-flex align-items-center mb-3 p-2 border-bottom">
                    <div class="flex-shrink-0">
                        <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                             style="width: 40px; height: 40px;">
                            <i class="fas fa-user"></i>
                        </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                        <h6 class="mb-0">${user.firstName} ${user.lastName}</h6>
                        <small class="text-muted">${user.email}</small>
                    </div>
                    <div class="flex-shrink-0">
                        <small class="text-muted">${this.formatDate(user.createdAt)}</small>
                    </div>
                </div>
            `).join('');

            container.innerHTML = usersHtml;

        } catch (error) {
            console.error('Error loading recent users:', error);
        }
    }

    async loadRecentExpenses() {
        try {
            const response = await window.authManager.makeAuthenticatedRequest(`${this.baseUrl}/expenses`);
            if (!response || !response.ok) return;

            const expenses = await response.json();
            const recentExpenses = expenses.slice(0, 5); // Get last 5 expenses

            const container = document.getElementById('recentExpensesContainer');
            if (!container) return;

            if (recentExpenses.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-3">
                        <i class="fas fa-wallet fa-2x text-muted mb-2"></i>
                        <p class="text-muted mb-0">No expenses found</p>
                    </div>
                `;
                return;
            }

            const expensesHtml = recentExpenses.map(expense => `
                <div class="d-flex align-items-center mb-3 p-2 border-bottom">
                    <div class="flex-shrink-0">
                        <div class="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" 
                             style="width: 40px; height: 40px;">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                        <h6 class="mb-0">${expense.description}</h6>
                        <small class="text-muted">${expense.category ? expense.category.name : 'No Category'}</small>
                    </div>
                    <div class="flex-shrink-0 text-end">
                        <div class="fw-bold text-success">$${parseFloat(expense.amount).toFixed(2)}</div>
                        <small class="text-muted">${this.formatDate(expense.expenseDate)}</small>
                    </div>
                </div>
            `).join('');

            container.innerHTML = expensesHtml;

        } catch (error) {
            console.error('Error loading recent expenses:', error);
        }
    }

    async refreshDashboard() {
        this.showAlert('Refreshing dashboard data...', 'info');
        await this.loadDashboardData();
        this.showAlert('Dashboard data refreshed successfully!', 'success');
    }

    async exportData() {
        try {
            this.showAlert('Preparing data export...', 'info');

            // Get all data
            const [usersResponse, expensesResponse, categoriesResponse] = await Promise.all([
                window.authManager.makeAuthenticatedRequest(`${this.baseUrl}/users`),
                window.authManager.makeAuthenticatedRequest(`${this.baseUrl}/expenses`),
                window.authManager.makeAuthenticatedRequest(`${this.baseUrl}/expense-categories`)
            ]);

            const users = usersResponse.ok ? await usersResponse.json() : [];
            const expenses = expensesResponse.ok ? await expensesResponse.json() : [];
            const categories = categoriesResponse.ok ? await categoriesResponse.json() : [];

            // Create export data
            const exportData = {
                exportDate: new Date().toISOString(),
                summary: {
                    totalUsers: users.length,
                    totalExpenses: expenses.length,
                    totalCategories: categories.length,
                    totalAmount: expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0)
                },
                users: users,
                expenses: expenses,
                categories: categories
            };

            // Create and download file
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `management-system-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            this.showAlert('Data exported successfully!', 'success');

        } catch (error) {
            console.error('Error exporting data:', error);
            this.showAlert('Error exporting data', 'danger');
        }
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        
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
            return date.toLocaleDateString();
        }
    }

    showAlert(message, type = 'info') {
        if (window.authManager) {
            window.authManager.showAlert(message, type);
        }
    }
}

// Global functions
function refreshDashboard() {
    if (window.dashboardManager) {
        window.dashboardManager.refreshDashboard();
    }
}

function exportData() {
    if (window.dashboardManager) {
        window.dashboardManager.exportData();
    }
}

// Initialize dashboard manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for auth manager to be ready
    setTimeout(() => {
        window.dashboardManager = new DashboardManager();
    }, 100);
});
