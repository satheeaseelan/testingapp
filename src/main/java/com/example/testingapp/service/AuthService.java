package com.example.testingapp.service;

import com.example.testingapp.dto.AuthResponse;
import com.example.testingapp.dto.LoginRequest;
import com.example.testingapp.dto.RegisterRequest;
import com.example.testingapp.entity.AppUser;
import com.example.testingapp.repository.AppUserRepository;
import com.example.testingapp.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {
    
    @Autowired
    private AppUserRepository appUserRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    public AuthResponse register(RegisterRequest request) {
        // Check if username already exists
        if (appUserRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        // Check if email already exists
        if (appUserRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        // Create new user
        AppUser appUser = new AppUser();
        appUser.setUsername(request.getUsername());
        appUser.setEmail(request.getEmail());
        appUser.setPassword(passwordEncoder.encode(request.getPassword()));
        appUser.setRole(AppUser.Role.USER); // Default role
        
        AppUser savedUser = appUserRepository.save(appUser);
        
        // Generate JWT token
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", savedUser.getRole().name());
        extraClaims.put("email", savedUser.getEmail());
        
        String token = jwtUtil.generateToken(savedUser, extraClaims);
        
        return new AuthResponse(token, savedUser.getUsername(), 
                               savedUser.getEmail(), savedUser.getRole().name());
    }
    
    public AuthResponse login(LoginRequest request) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        AppUser appUser = appUserRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Generate JWT token
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", appUser.getRole().name());
        extraClaims.put("email", appUser.getEmail());
        
        String token = jwtUtil.generateToken(userDetails, extraClaims);
        
        return new AuthResponse(token, appUser.getUsername(), 
                               appUser.getEmail(), appUser.getRole().name());
    }
    
    public AppUser getCurrentUser(String username) {
        return appUserRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
