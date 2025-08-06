package com.example.testingapp.service;

import com.example.testingapp.dto.UserCreateRequest;
import com.example.testingapp.dto.UserResponse;
import com.example.testingapp.dto.UserUpdateRequest;
import com.example.testingapp.entity.User;
import com.example.testingapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    // Create a new user
    public UserResponse createUser(UserCreateRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }
        
        User user = new User(
            request.getFirstName(),
            request.getLastName(),
            request.getEmail(),
            request.getPhoneNumber()
        );
        
        User savedUser = userRepository.save(user);
        return new UserResponse(savedUser);
    }
    
    // Get all users
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }
    
    // Get user by ID
    public Optional<UserResponse> getUserById(Long id) {
        return userRepository.findById(id)
                .map(UserResponse::new);
    }
    
    // Get user by email
    public Optional<UserResponse> getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(UserResponse::new);
    }
    
    // Search users by name
    public List<UserResponse> searchUsersByName(String name) {
        return userRepository.findByFirstNameOrLastNameContainingIgnoreCase(name)
                .stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }
    
    // Update user
    public Optional<UserResponse> updateUser(Long id, UserUpdateRequest request) {
        return userRepository.findById(id)
                .map(user -> {
                    // Check if email is being changed and if new email already exists
                    if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
                        if (userRepository.existsByEmail(request.getEmail())) {
                            throw new RuntimeException("Email already exists: " + request.getEmail());
                        }
                        user.setEmail(request.getEmail());
                    }
                    
                    // Update other fields if provided
                    if (request.getFirstName() != null) {
                        user.setFirstName(request.getFirstName());
                    }
                    if (request.getLastName() != null) {
                        user.setLastName(request.getLastName());
                    }
                    if (request.getPhoneNumber() != null) {
                        user.setPhoneNumber(request.getPhoneNumber());
                    }
                    
                    User updatedUser = userRepository.save(user);
                    return new UserResponse(updatedUser);
                });
    }
    
    // Delete user
    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    // Check if user exists
    public boolean userExists(Long id) {
        return userRepository.existsById(id);
    }
    
    // Get total user count
    public long getUserCount() {
        return userRepository.count();
    }
}
