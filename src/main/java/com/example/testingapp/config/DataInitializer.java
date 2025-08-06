package com.example.testingapp.config;

import com.example.testingapp.entity.AppUser;
import com.example.testingapp.entity.ExpenseCategory;
import com.example.testingapp.entity.User;
import com.example.testingapp.repository.AppUserRepository;
import com.example.testingapp.repository.ExpenseCategoryRepository;
import com.example.testingapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AppUserRepository appUserRepository;
    private final ExpenseCategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(UserRepository userRepository,
                          AppUserRepository appUserRepository,
                          ExpenseCategoryRepository categoryRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.appUserRepository = appUserRepository;
        this.categoryRepository = categoryRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    public void run(String... args) throws Exception {
        // Initialize authentication users
        if (appUserRepository.count() == 0) {
            initializeAuthUsers();
        }

        // Initialize expense categories
        if (categoryRepository.count() == 0) {
            initializeExpenseCategories();
        }

        // Only initialize data if the database is empty
        if (userRepository.count() == 0) {
            initializeUsers();
        }
    }
    
    private void initializeUsers() {
        User user1 = new User("John", "Doe", "john.doe@example.com", "1234567890");
        User user2 = new User("Jane", "Smith", "jane.smith@example.com", "0987654321");
        User user3 = new User("Bob", "Johnson", "bob.johnson@example.com", "5555555555");
        User user4 = new User("Alice", "Brown", "alice.brown@example.com", "1111111111");
        User user5 = new User("Charlie", "Wilson", "charlie.wilson@example.com", "2222222222");
        
        userRepository.save(user1);
        userRepository.save(user2);
        userRepository.save(user3);
        userRepository.save(user4);
        userRepository.save(user5);
        
        System.out.println("Sample users have been initialized!");
    }

    private void initializeAuthUsers() {
        // Create admin user
        AppUser admin = new AppUser();
        admin.setUsername("admin");
        admin.setEmail("admin@example.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(AppUser.Role.ADMIN);
        appUserRepository.save(admin);

        // Create regular user
        AppUser user = new AppUser();
        user.setUsername("user");
        user.setEmail("user@example.com");
        user.setPassword(passwordEncoder.encode("user123"));
        user.setRole(AppUser.Role.USER);
        appUserRepository.save(user);

        System.out.println("Default authentication users have been initialized!");
        System.out.println("Admin: username=admin, password=admin123");
        System.out.println("User: username=user, password=user123");
    }

    private void initializeExpenseCategories() {
        // Create default expense categories
        ExpenseCategory food = new ExpenseCategory("Food & Dining", "Restaurants, groceries, and food delivery", "#FF6B6B", "fas fa-utensils");
        ExpenseCategory transport = new ExpenseCategory("Transportation", "Gas, public transport, rideshare, parking", "#4ECDC4", "fas fa-car");
        ExpenseCategory shopping = new ExpenseCategory("Shopping", "Clothing, electronics, and general shopping", "#45B7D1", "fas fa-shopping-bag");
        ExpenseCategory entertainment = new ExpenseCategory("Entertainment", "Movies, games, subscriptions, and fun activities", "#96CEB4", "fas fa-gamepad");
        ExpenseCategory utilities = new ExpenseCategory("Utilities", "Electricity, water, internet, phone bills", "#FFEAA7", "fas fa-bolt");
        ExpenseCategory healthcare = new ExpenseCategory("Healthcare", "Medical expenses, pharmacy, insurance", "#DDA0DD", "fas fa-heartbeat");
        ExpenseCategory education = new ExpenseCategory("Education", "Books, courses, tuition, and learning materials", "#98D8C8", "fas fa-graduation-cap");
        ExpenseCategory travel = new ExpenseCategory("Travel", "Flights, hotels, vacation expenses", "#F7DC6F", "fas fa-plane");
        ExpenseCategory other = new ExpenseCategory("Other", "Miscellaneous expenses", "#BDC3C7", "fas fa-question-circle");

        categoryRepository.save(food);
        categoryRepository.save(transport);
        categoryRepository.save(shopping);
        categoryRepository.save(entertainment);
        categoryRepository.save(utilities);
        categoryRepository.save(healthcare);
        categoryRepository.save(education);
        categoryRepository.save(travel);
        categoryRepository.save(other);

        System.out.println("Default expense categories have been initialized!");
    }
}
