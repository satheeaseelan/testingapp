package com.example.testingapp.repository;

import com.example.testingapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Find user by email
    Optional<User> findByEmail(String email);
    
    // Check if email exists
    boolean existsByEmail(String email);
    
    // Find users by first name (case insensitive)
    List<User> findByFirstNameContainingIgnoreCase(String firstName);
    
    // Find users by last name (case insensitive)
    List<User> findByLastNameContainingIgnoreCase(String lastName);
    
    // Find users by first name or last name (case insensitive)
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :name, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<User> findByFirstNameOrLastNameContainingIgnoreCase(@Param("name") String name);
    
    // Find users by phone number
    Optional<User> findByPhoneNumber(String phoneNumber);
}
