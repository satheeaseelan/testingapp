// Authentication and Authorization Management
class AuthManager {
    constructor() {
        this.baseUrl = '/api/auth';
        this.token = localStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
        this.init();
    }

    init() {
        // Check if user is authenticated on protected pages
        if (this.isProtectedPage() && !this.isAuthenticated()) {
            this.redirectToLogin();
            return;
        }

        // Update UI with current user info
        if (this.isAuthenticated()) {
            this.updateUserInfo();
        }

        // Setup login form if on login page
        if (window.location.pathname.includes('login.html')) {
            this.setupLoginForm();
        }

        // Setup register form if on register page
        if (window.location.pathname.includes('register.html')) {
            this.setupRegisterForm();
        }
    }

    isProtectedPage() {
        const protectedPages = ['dashboard.html', 'users.html', 'expenses.html'];
        return protectedPages.some(page => window.location.pathname.includes(page)) ||
               window.location.pathname === '/' || window.location.pathname === '/index.html';
    }

    isAuthenticated() {
        return this.token && this.user;
    }

    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }

    setupRegisterForm() {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Show/hide recurring frequency based on checkbox
        const isRecurringCheckbox = document.getElementById('isRecurring');
        if (isRecurringCheckbox) {
            isRecurringCheckbox.addEventListener('change', function() {
                const frequencyDiv = document.getElementById('recurringFrequencyDiv');
                if (frequencyDiv) {
                    frequencyDiv.style.display = this.checked ? 'block' : 'none';
                }
            });
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const loginBtn = document.getElementById('loginBtn');
        const loginBtnText = document.getElementById('loginBtnText');
        const loginSpinner = document.getElementById('loginSpinner');
        
        // Get form data
        const formData = new FormData(event.target);
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        // Validate form
        if (!credentials.username || !credentials.password) {
            this.showAlert('Please fill in all required fields', 'danger');
            return;
        }

        // Show loading state
        loginBtn.disabled = true;
        loginBtnText.textContent = 'Signing In...';
        loginSpinner.classList.remove('d-none');

        try {
            const response = await fetch(`${this.baseUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful, received data:', data);

                // Store authentication data
                this.token = data.token;
                this.user = {
                    username: data.username,
                    email: data.email,
                    role: data.role
                };

                localStorage.setItem('authToken', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));

                console.log('Stored token:', this.token);
                console.log('Stored user:', this.user);

                this.showAlert('Login successful! Redirecting...', 'success');

                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);

            } else {
                console.log('Login failed with status:', response.status);
                console.log('Error data:', data);
                this.showAlert(data.message || 'Login failed. Please check your credentials.', 'danger');
            }

        } catch (error) {
            console.error('Login error:', error);
            this.showAlert('Network error. Please try again.', 'danger');
        } finally {
            // Reset button state
            loginBtn.disabled = false;
            loginBtnText.textContent = 'Sign In';
            loginSpinner.classList.add('d-none');
        }
    }

    async handleRegister(event) {
        event.preventDefault();
        
        const registerBtn = document.getElementById('registerBtn');
        const registerBtnText = document.getElementById('registerBtnText');
        const registerSpinner = document.getElementById('registerSpinner');
        
        // Get form data
        const formData = new FormData(event.target);
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phoneNumber: formData.get('phoneNumber'),
            username: formData.get('username'),
            password: formData.get('password')
        };

        // Validate passwords match
        const confirmPassword = formData.get('confirmPassword');
        if (userData.password !== confirmPassword) {
            this.showAlert('Passwords do not match', 'danger');
            return;
        }

        // Show loading state
        registerBtn.disabled = true;
        registerBtnText.textContent = 'Creating Account...';
        registerSpinner.classList.remove('d-none');

        try {
            const response = await fetch(`${this.baseUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                this.showAlert('Account created successfully! Please login.', 'success');
                
                // Redirect to login page
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);

            } else {
                this.showAlert(data.message || 'Registration failed. Please try again.', 'danger');
            }

        } catch (error) {
            console.error('Registration error:', error);
            this.showAlert('Network error. Please try again.', 'danger');
        } finally {
            // Reset button state
            registerBtn.disabled = false;
            registerBtnText.textContent = 'Create Account';
            registerSpinner.classList.add('d-none');
        }
    }

    logout() {
        // Clear stored data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        this.token = null;
        this.user = null;

        // Redirect to login
        window.location.href = 'login.html';
    }

    updateUserInfo() {
        const currentUserElements = document.querySelectorAll('#currentUser');
        currentUserElements.forEach(element => {
            if (this.user) {
                element.textContent = this.user.username;
            }
        });
    }

    redirectToLogin() {
        window.location.href = 'login.html';
    }

    getAuthHeaders() {
        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        };
    }

    async makeAuthenticatedRequest(url, options = {}) {
        console.log('Making authenticated request to:', url);
        console.log('Current token:', this.token);
        console.log('Current user:', this.user);

        if (!this.isAuthenticated()) {
            console.log('Not authenticated, redirecting to login');
            this.redirectToLogin();
            return null;
        }

        const defaultOptions = {
            headers: this.getAuthHeaders()
        };

        const mergedOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };

        console.log('Request options:', mergedOptions);

        try {
            const response = await fetch(url, mergedOptions);
            console.log('Response status:', response.status);

            if (response.status === 401) {
                console.log('401 Unauthorized - token expired or invalid');
                // Token expired or invalid
                this.logout();
                return null;
            }

            if (response.status === 403) {
                console.log('403 Forbidden - insufficient permissions');
                this.showAlert('You do not have permission to access this resource', 'danger');
                return null;
            }

            return response;
        } catch (error) {
            console.error('Request error:', error);
            this.showAlert('Network error: ' + error.message, 'danger');
            throw error;
        }
    }

    showAlert(message, type = 'info') {
        const alertContainer = document.getElementById('alertContainer');
        if (!alertContainer) return;

        const alertId = 'alert-' + Date.now();
        const alertHtml = `
            <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert">
                <i class="fas fa-${this.getAlertIcon(type)} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

        alertContainer.innerHTML = alertHtml;

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            const alertElement = document.getElementById(alertId);
            if (alertElement) {
                const bsAlert = new bootstrap.Alert(alertElement);
                bsAlert.close();
            }
        }, 5000);
    }

    getAlertIcon(type) {
        const icons = {
            success: 'check-circle',
            danger: 'exclamation-triangle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Global functions for easy access
function logout() {
    if (window.authManager) {
        window.authManager.logout();
    }
}

// Global modal cleanup function
window.cleanupAllModals = function() {
    // Remove all modal backdrops
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());

    // Remove modal-open class from body
    document.body.classList.remove('modal-open');

    // Reset body styles
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    // Hide all modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
            modalInstance.hide();
        }
        modal.style.display = 'none';
        modal.classList.remove('show');
    });

    console.log('All modals cleaned up');
};

// Add global event listener for ESC key to cleanup modals
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        setTimeout(() => {
            window.cleanupAllModals();
        }, 100);
    }
});

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.authManager = new AuthManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
