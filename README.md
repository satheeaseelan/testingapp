# User Management System

A full-stack Spring Boot application with a modern web UI for managing users.

## Features

### Backend (Spring Boot)
- **Complete CRUD Operations** for user management
- **Expense Management System** with categories and tracking
- **JWT-based Authentication & Authorization**
- **Role-based Access Control** (USER, ADMIN)
- **RESTful API** with proper HTTP status codes
- **Input Validation** with detailed error messages
- **H2 In-Memory Database** with JPA/Hibernate
- **Global Exception Handling**
- **Sample Data Initialization**

### Frontend (Web UI)
- **Modern Responsive Design** using Bootstrap 5
- **Authentication UI** with login/register pages
- **JWT Token Management** with automatic refresh
- **Role-based UI Elements** (admin-only features)
- **Real-time User Management** with AJAX calls
- **Expense Management Interface** with dashboard and tracking
- **Form Validation** with visual feedback
- **Search & Filter Functionality** by name, category, date
- **Modal Dialogs** for add/edit/delete operations
- **Success/Error Notifications**
- **Mobile-Friendly Interface**

## Quick Start

1. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```

2. **Access the UI:**
   - Open your browser and go to: `http://localhost:8080`
   - You'll be redirected to the login page

3. **Login with demo accounts:**
   - **Admin:** username=`admin`, password=`admin123`
   - **User:** username=`user`, password=`user123`

4. **Access the API:**
   - Authentication API: `http://localhost:8080/api/auth`
   - User Management API: `http://localhost:8080/api/users` (Admin only)
   - H2 Console: `http://localhost:8080/h2-console`

## API Endpoints

### Authentication Endpoints (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new account |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user info |
| POST | `/api/auth/logout` | Logout (client-side) |

### User Management Endpoints (Admin Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| POST | `/api/users` | Create new user |
| GET | `/api/users/{id}` | Get user by ID |
| PUT | `/api/users/{id}` | Update user |
| PATCH | `/api/users/{id}` | Partial update user |
| DELETE | `/api/users/{id}` | Delete user |
| GET | `/api/users/search?name={name}` | Search users by name |
| GET | `/api/users/email/{email}` | Get user by email |
| GET | `/api/users/count` | Get total user count |
| GET | `/api/users/{id}/exists` | Check if user exists |

## UI Features

### User List
- View all users in a responsive table
- Real-time user count display
- Search users by first name or last name
- Edit and delete actions for each user

### Add/Edit User
- Modal form with validation
- Required fields: First Name, Last Name, Email
- Optional field: Phone Number
- Real-time validation feedback
- Duplicate email detection

### Search
- Live search as you type
- Searches both first name and last name
- Clear search functionality

### Notifications
- Success messages for operations
- Error messages with details
- Auto-dismissing alerts

## Technology Stack

### Backend
- **Spring Boot 3.2.0**
- **Spring Security 6** with JWT authentication
- **Spring Data JPA**
- **H2 Database**
- **Spring Validation**
- **JJWT 0.11.5** for JWT token handling
- **BCrypt** for password hashing
- **Maven**

### Frontend
- **HTML5**
- **CSS3** with custom styling
- **JavaScript (ES6+)**
- **Bootstrap 5.3.0**
- **Font Awesome 6.4.0**

## Database

The application uses H2 in-memory database with the following configuration:
- **URL:** `jdbc:h2:mem:testdb`
- **Username:** `sa`
- **Password:** `password`
- **Console:** Available at `/h2-console`

## Sample Data

### Authentication Users
The application automatically creates default authentication accounts:
- **Admin Account:** username=`admin`, password=`admin123`, role=`ADMIN`
- **User Account:** username=`user`, password=`user123`, role=`USER`

### Sample Users (for management)
The application also initializes with 5 sample users for demonstration:
1. John Doe (john.doe@example.com)
2. Jane Smith (jane.smith@example.com)
3. Bob Johnson (bob.johnson@example.com)
4. Alice Brown (alice.brown@example.com)
5. Charlie Wilson (charlie.wilson@example.com)

## Development

### Project Structure
```
src/
├── main/
│   ├── java/com/example/testingapp/
│   │   ├── controller/     # REST controllers
│   │   ├── service/        # Business logic
│   │   ├── repository/     # Data access
│   │   ├── entity/         # JPA entities
│   │   ├── dto/            # Data transfer objects
│   │   ├── config/         # Configuration classes
│   │   └── exception/      # Exception handlers
│   └── resources/
│       ├── static/         # Web UI files
│       │   ├── css/        # Stylesheets
│       │   ├── js/         # JavaScript files
│       │   └── index.html  # Main UI page
│       └── application.properties
└── test/                   # Unit tests
```

### Running Tests
```bash
mvn test
```

### Building for Production
```bash
mvn clean package
java -jar target/testingapp-0.0.1-SNAPSHOT.jar
```

## Browser Support

The UI is compatible with:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is for demonstration purposes.
