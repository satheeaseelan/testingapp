// User Management
class UserManager {
    constructor() {
        this.baseUrl = '/api/users';
        this.users = [];
        this.filteredUsers = [];
        this.currentEditingUser = null;
        this.init();
    }

    init() {
        if (window.authManager && window.authManager.isAuthenticated()) {
            this.loadUsers();
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.filterUsers(e.target.value));
        }

        // Clear search
        const clearSearch = document.getElementById('clearSearch');
        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                searchInput.value = '';
                this.filterUsers('');
            });
        }

        // Save user button
        const saveUserBtn = document.getElementById('saveUserBtn');
        if (saveUserBtn) {
            saveUserBtn.addEventListener('click', () => this.saveUser());
        }

        // Confirm delete button
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', () => this.confirmDelete());
        }

        // User form validation
        const userForm = document.getElementById('userForm');
        if (userForm) {
            userForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveUser();
            });
        }
    }

    async loadUsers() {
        try {
            this.showLoading(true);
            
            const response = await window.authManager.makeAuthenticatedRequest(this.baseUrl);
            if (!response || !response.ok) {
                throw new Error('Failed to load users');
            }

            this.users = await response.json();
            this.filteredUsers = [...this.users];
            this.renderUsers();
            this.updateStatistics();

        } catch (error) {
            console.error('Error loading users:', error);
            this.showAlert('Error loading users', 'danger');
        } finally {
            this.showLoading(false);
        }
    }

    renderUsers() {
        const tbody = document.getElementById('usersTableBody');
        const noUsersMessage = document.getElementById('noUsersMessage');
        
        if (!tbody) return;

        if (this.filteredUsers.length === 0) {
            tbody.innerHTML = '';
            if (noUsersMessage) {
                noUsersMessage.classList.remove('d-none');
            }
            return;
        }

        if (noUsersMessage) {
            noUsersMessage.classList.add('d-none');
        }

        const usersHtml = this.filteredUsers.map(user => `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                             style="width: 35px; height: 35px; font-size: 0.8rem;">
                            ${user.firstName.charAt(0)}${user.lastName.charAt(0)}
                        </div>
                        <div>
                            <div class="fw-bold">${user.firstName} ${user.lastName}</div>
                            <small class="text-muted">ID: ${user.id}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <div>${user.email}</div>
                    <small class="text-muted">
                        <i class="fas fa-envelope me-1"></i>Email
                    </small>
                </td>
                <td>
                    <div>${user.phoneNumber || 'N/A'}</div>
                    <small class="text-muted">
                        <i class="fas fa-phone me-1"></i>Phone
                    </small>
                </td>
                <td>
                    <div>${this.formatDate(user.createdAt)}</div>
                    <small class="text-muted">${this.getRelativeTime(user.createdAt)}</small>
                </td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="userManager.editUser(${user.id})" 
                                title="Edit User">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="userManager.deleteUser(${user.id})" 
                                title="Delete User">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        tbody.innerHTML = usersHtml;
    }

    filterUsers(searchTerm) {
        if (!searchTerm.trim()) {
            this.filteredUsers = [...this.users];
        } else {
            const term = searchTerm.toLowerCase();
            this.filteredUsers = this.users.filter(user => 
                user.firstName.toLowerCase().includes(term) ||
                user.lastName.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term) ||
                (user.phoneNumber && user.phoneNumber.includes(term))
            );
        }
        this.renderUsers();
    }

    updateStatistics() {
        // Update user count
        const userCountElement = document.getElementById('userCount');
        if (userCountElement) {
            userCountElement.textContent = this.users.length;
        }

        // Update active count (assuming all users are active for now)
        const activeCountElement = document.getElementById('activeCount');
        if (activeCountElement) {
            activeCountElement.textContent = this.users.length;
        }

        // Update new users this month
        const newCountElement = document.getElementById('newCount');
        if (newCountElement) {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const newUsersThisMonth = this.users.filter(user => {
                const createdDate = new Date(user.createdAt);
                return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
            }).length;
            newCountElement.textContent = newUsersThisMonth;
        }
    }

    openAddUserModal() {
        this.currentEditingUser = null;
        this.resetForm();
        document.getElementById('modalTitle').textContent = 'Add New User';

        const modal = new bootstrap.Modal(document.getElementById('userModal'));

        // Add event listener for modal cleanup
        const modalElement = document.getElementById('userModal');
        modalElement.addEventListener('hidden.bs.modal', this.cleanupModal.bind(this), { once: true });

        modal.show();
    }

    editUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        this.currentEditingUser = user;
        this.populateForm(user);
        document.getElementById('modalTitle').textContent = 'Edit User';

        const modal = new bootstrap.Modal(document.getElementById('userModal'));

        // Add event listener for modal cleanup
        const modalElement = document.getElementById('userModal');
        modalElement.addEventListener('hidden.bs.modal', this.cleanupModal.bind(this), { once: true });

        modal.show();
    }

    deleteUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        this.currentEditingUser = user;
        
        const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
    }

    async saveUser() {
        const form = document.getElementById('userForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const userData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phoneNumber: document.getElementById('phoneNumber').value.trim() || null
        };

        try {
            const saveBtn = document.getElementById('saveUserBtn');
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Saving...';

            let response;
            if (this.currentEditingUser) {
                // Update existing user
                response = await window.authManager.makeAuthenticatedRequest(
                    `${this.baseUrl}/${this.currentEditingUser.id}`,
                    {
                        method: 'PUT',
                        body: JSON.stringify(userData)
                    }
                );
            } else {
                // Create new user
                response = await window.authManager.makeAuthenticatedRequest(this.baseUrl, {
                    method: 'POST',
                    body: JSON.stringify(userData)
                });
            }

            if (response && response.ok) {
                const savedUser = await response.json();
                
                if (this.currentEditingUser) {
                    // Update existing user in array
                    const index = this.users.findIndex(u => u.id === this.currentEditingUser.id);
                    if (index !== -1) {
                        this.users[index] = savedUser;
                    }
                    this.showAlert('User updated successfully!', 'success');
                } else {
                    // Add new user to array
                    this.users.push(savedUser);
                    this.showAlert('User created successfully!', 'success');
                }

                this.filteredUsers = [...this.users];
                this.renderUsers();
                this.updateStatistics();
                
                // Close modal properly
                this.closeModal('userModal');
                
            } else {
                const errorData = await response.json();
                this.showAlert(errorData.message || 'Error saving user', 'danger');
            }

        } catch (error) {
            console.error('Error saving user:', error);
            this.showAlert('Error saving user', 'danger');
        } finally {
            const saveBtn = document.getElementById('saveUserBtn');
            saveBtn.disabled = false;
            saveBtn.innerHTML = '<i class="fas fa-save me-2"></i>Save User';
        }
    }

    async confirmDelete() {
        if (!this.currentEditingUser) return;

        try {
            const deleteBtn = document.getElementById('confirmDeleteBtn');
            deleteBtn.disabled = true;
            deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Deleting...';

            const response = await window.authManager.makeAuthenticatedRequest(
                `${this.baseUrl}/${this.currentEditingUser.id}`,
                { method: 'DELETE' }
            );

            if (response && response.ok) {
                // Remove user from array
                this.users = this.users.filter(u => u.id !== this.currentEditingUser.id);
                this.filteredUsers = [...this.users];
                this.renderUsers();
                this.updateStatistics();
                
                this.showAlert('User deleted successfully!', 'success');
                
                // Close modal properly
                this.closeModal('deleteModal');
                
            } else {
                this.showAlert('Error deleting user', 'danger');
            }

        } catch (error) {
            console.error('Error deleting user:', error);
            this.showAlert('Error deleting user', 'danger');
        } finally {
            const deleteBtn = document.getElementById('confirmDeleteBtn');
            deleteBtn.disabled = false;
            deleteBtn.innerHTML = '<i class="fas fa-trash me-2"></i>Delete User';
        }
    }

    populateForm(user) {
        document.getElementById('userId').value = user.id;
        document.getElementById('firstName').value = user.firstName;
        document.getElementById('lastName').value = user.lastName;
        document.getElementById('email').value = user.email;
        document.getElementById('phoneNumber').value = user.phoneNumber || '';
    }

    resetForm() {
        const form = document.getElementById('userForm');
        form.reset();
        form.classList.remove('was-validated');
        
        // Clear validation states
        const inputs = form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });
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
function openAddUserModal() {
    if (window.userManager) {
        window.userManager.openAddUserModal();
    }
}

// Initialize user manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for auth manager to be ready
    setTimeout(() => {
        window.userManager = new UserManager();
    }, 100);
});
