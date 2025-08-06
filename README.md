# 🚀 Spring Boot Management System

A comprehensive, modern management system built with **Spring Boot** and featuring a professional web interface. This full-stack application provides user management, expense tracking, and real-time analytics with a beautiful, responsive UI.

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen)
![Java](https://img.shields.io/badge/Java-17+-orange)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎯 **Backend Capabilities**
- **🔐 JWT Authentication** - Secure token-based authentication system
- **👥 User Management** - Complete CRUD operations with role-based access
- **💰 Expense Tracking** - Categorized expense management with payment methods
- **📊 Real-time Analytics** - Dashboard with statistics and insights
- **🛡️ Security** - Spring Security with password encryption
- **🗄️ Database Integration** - MySQL with JPA/Hibernate
- **🔄 RESTful APIs** - Complete REST API with proper HTTP status codes
- **⚠️ Error Handling** - Global exception handling with meaningful messages

### 🎨 **Frontend Experience**
- **📱 Responsive Design** - Mobile-first Bootstrap 5.3 implementation
- **🎭 Modern UI** - Professional interface with smooth animations
- **🔐 Authentication Flow** - Login/Register with form validation
- **📈 Interactive Dashboard** - Real-time statistics and recent activity
- **👤 User Management** - Search, filter, add, edit, delete users
- **💸 Expense Management** - Add expenses with categories and payment methods
- **🔧 Modal Management** - Fixed overlay issues with proper cleanup
- **🌙 Professional Styling** - Custom CSS with modern design patterns

## 🛠️ Technology Stack

| Category | Technologies |
|----------|-------------|
| **Backend** | Spring Boot 3.2.0, Spring Security, Spring Data JPA |
| **Database** | MySQL 8.0 with automated schema creation |
| **Frontend** | HTML5, CSS3, JavaScript ES6+, Bootstrap 5.3 |
| **Security** | JWT tokens, BCrypt password hashing |
| **Build** | Maven 3.6+, Java 17+ |
| **Styling** | Font Awesome 6.4, Google Fonts (Inter) |

## 🚀 Quick Start

### 📋 Prerequisites
- ☕ **Java 17+** - Required for Spring Boot 3.x
- 🗄️ **MySQL 8.0+** - Database server
- 🔧 **Maven 3.6+** - Build tool

### 🔧 Installation

**1. Clone & Navigate**
```bash
git clone https://github.com/satheeaseelan/testingapp.git
cd testingapp
```

**2. Database Setup**
```sql
-- Create database and user
CREATE DATABASE testingapp_db;
CREATE USER 'testingapp_user'@'localhost' IDENTIFIED BY 'testingapp_password';
GRANT ALL PRIVILEGES ON testingapp_db.* TO 'testingapp_user'@'localhost';
FLUSH PRIVILEGES;
```

**3. Configure Application**
Update `src/main/resources/application.properties`:
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/testingapp_db
spring.datasource.username=testingapp_user
spring.datasource.password=testingapp_password

# JPA Configuration
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# JWT Configuration
jwt.secret=mySecretKey
jwt.expiration=86400000
```

**4. Run Application**
```bash
# Start the application
mvn spring-boot:run

# Or build and run JAR
mvn clean package
java -jar target/testingapp-0.0.1-SNAPSHOT.jar
```

**5. Access Application**
- 🌐 **URL**: `http://localhost:8080`
- 🔑 **Admin**: `admin` / `admin123`
- 👤 **User**: `user` / `user123`

## 📱 Application Pages

| Page | URL | Description |
|------|-----|-------------|
| 🏠 **Landing** | `/` | Welcome page with features overview |
| 🔐 **Login** | `/login.html` | Authentication with demo credentials |
| 📝 **Register** | `/register.html` | User registration form |
| 📊 **Dashboard** | `/dashboard.html` | Statistics and recent activity |
| 👥 **Users** | `/users.html` | User management interface |
| 💰 **Expenses** | `/expenses.html` | Expense tracking and management |
| 🔧 **Debug** | `/debug.html` | Authentication debugging tool |

## 🔌 API Endpoints

### 🔐 **Authentication**
```http
POST /api/auth/login      # User login
POST /api/auth/register   # User registration
```

### 👥 **User Management**
```http
GET    /api/users         # Get all users
POST   /api/users         # Create user
PUT    /api/users/{id}    # Update user
DELETE /api/users/{id}    # Delete user
```

### 💰 **Expense Management**
```http
GET    /api/expenses      # Get all expenses
POST   /api/expenses      # Create expense
PUT    /api/expenses/{id} # Update expense
DELETE /api/expenses/{id} # Delete expense
```

### 📂 **Categories**
```http
GET /api/expense-categories # Get all categories
```

## 🎯 Demo Credentials

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| 👑 **Admin** | `admin` | `admin123` | Full system access |
| 👤 **User** | `user` | `user123` | Standard user access |
## 📁 Project Structure

```
📦 testingapp/
├── 📂 src/main/java/com/example/testingapp/
│   ├── 📂 config/          # 🔧 Configuration classes
│   │   ├── DataInitializer.java    # Sample data loader
│   │   ├── SecurityConfig.java     # Security configuration
│   │   └── WebConfig.java          # Web configuration
│   ├── 📂 controller/      # 🎮 REST Controllers
│   │   ├── AuthController.java     # Authentication endpoints
│   │   ├── UserController.java     # User management
│   │   ├── ExpenseController.java  # Expense management
│   │   └── ExpenseCategoryController.java
│   ├── 📂 dto/            # 📋 Data Transfer Objects
│   ├── 📂 entity/         # 🗄️ JPA Entities
│   ├── 📂 repository/     # 🔍 Data Repositories
│   ├── 📂 security/       # 🛡️ Security Components
│   │   ├── JwtUtil.java           # JWT token utility
│   │   └── JwtAuthenticationFilter.java
│   └── 📂 service/        # 💼 Business Logic
├── 📂 src/main/resources/
│   ├── 📂 static/         # 🌐 Frontend Files
│   │   ├── 📂 css/        # 🎨 Stylesheets
│   │   ├── 📂 js/         # ⚡ JavaScript
│   │   └── 📄 *.html      # 📄 HTML Pages
│   └── application.properties     # ⚙️ Configuration
└── 📂 src/test/           # 🧪 Unit Tests
```

## 🎨 UI Features

### 🏠 **Landing Page**
- ✨ Hero section with feature highlights
- 📋 Feature cards with icons and descriptions
- 🔑 Demo credentials display
- 📱 Fully responsive design

### 🔐 **Authentication**
- 🎭 Split-screen modern design
- ✅ Form validation with real-time feedback
- 👁️ Password visibility toggle
- 🔄 Loading states and error handling

### 📊 **Dashboard**
- 📈 Real-time statistics cards
- 📋 Recent users and expenses lists
- 🔄 Refresh and export functionality
- 📱 Mobile-optimized layout

### 👥 **User Management**
- 🔍 Real-time search and filtering
- ➕ Add/Edit users with modal forms
- 🗑️ Delete confirmation dialogs
- 📊 User statistics display

### 💰 **Expense Management**
- 🏷️ Category-based organization
- 💳 Payment method tracking
- 📅 Date filtering options
- 🔄 Recurring expense support
- 🧾 Receipt URL storage

## 🔧 Development

### 🧪 **Running Tests**
```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=UserServiceTest

# Run with coverage
mvn test jacoco:report
```

### 🏗️ **Building for Production**
```bash
# Clean and package
mvn clean package

# Run production JAR
java -jar target/testingapp-0.0.1-SNAPSHOT.jar

# With custom profile
java -jar target/testingapp-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

### 🗄️ **Database Management**
- **Auto Schema Creation**: Enabled in development
- **Sample Data Loading**: Automatic on startup
- **Migration Support**: Ready for Flyway integration

## 🎯 Key Features Implemented

### ✅ **Completed Features**
- ✅ **JWT Authentication** - Secure login/logout system
- ✅ **User CRUD Operations** - Complete user management
- ✅ **Expense Tracking** - Full expense management system
- ✅ **Responsive UI** - Mobile-first design
- ✅ **Modal Management** - Fixed overlay cleanup issues
- ✅ **Real-time Dashboard** - Statistics and analytics
- ✅ **Search & Filtering** - Advanced data filtering
- ✅ **Form Validation** - Client and server-side validation
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Sample Data** - Pre-loaded demo data

### 🔄 **Recent Updates**
- 🔧 **Modal Fix** - Resolved overlay cleanup issues
- 🎨 **UI Polish** - Enhanced styling and animations
- 🔐 **Security Enhancement** - Improved JWT handling
- 📱 **Mobile Optimization** - Better responsive design
- 🐛 **Bug Fixes** - Various UI and backend improvements

## 🤝 Contributing

1. 🍴 **Fork** the repository
2. 🌿 **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. ✨ **Make** your changes
4. 🧪 **Add** tests for new functionality
5. 💾 **Commit** your changes (`git commit -m 'Add amazing feature'`)
6. 📤 **Push** to the branch (`git push origin feature/amazing-feature`)
7. 🔄 **Open** a Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 **Email**: satheesh.manoharan@gmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/satheeaseelan/testingapp/issues)
- 📖 **Documentation**: Check the code comments and this README

## 🙏 Acknowledgments

- 🍃 **Spring Boot Team** - For the amazing framework
- 🎨 **Bootstrap Team** - For the responsive CSS framework
- 🔧 **Font Awesome** - For the beautiful icons
- 🗄️ **MySQL Team** - For the reliable database system

---

**⭐ If you find this project helpful, please give it a star!**
