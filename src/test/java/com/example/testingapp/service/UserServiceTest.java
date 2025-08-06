package com.example.testingapp.service;

import com.example.testingapp.dto.UserCreateRequest;
import com.example.testingapp.dto.UserResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class UserServiceTest {
    
    @Autowired
    private UserService userService;
    
    @Test
    void testCreateUser() {
        UserCreateRequest request = new UserCreateRequest(
            "Test", "User", "test.user@example.com", "1234567890"
        );
        
        UserResponse response = userService.createUser(request);
        
        assertNotNull(response);
        assertEquals("Test", response.getFirstName());
        assertEquals("User", response.getLastName());
        assertEquals("test.user@example.com", response.getEmail());
        assertEquals("1234567890", response.getPhoneNumber());
        assertNotNull(response.getId());
        assertNotNull(response.getCreatedAt());
    }
    
    @Test
    void testGetAllUsers() {
        var users = userService.getAllUsers();
        assertNotNull(users);
        assertTrue(users.size() >= 5); // At least the 5 sample users from DataInitializer
    }
    
    @Test
    void contextLoads() {
        assertNotNull(userService);
    }
}
