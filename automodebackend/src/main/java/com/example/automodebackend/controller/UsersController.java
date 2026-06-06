package com.example.automodebackend.controller;


import com.example.automodebackend.entity.Users;
import com.example.automodebackend.repository.UsersRepository;
import com.example.automodebackend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins="http://localhost:3000")

public class UsersController {
    private final UsersRepository repository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;
    public UsersController(UsersRepository repository) {
        this.repository = repository;
    }
    @PostMapping("/createUser")
    public Users createUser(@RequestBody Users user) {
        if (repository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Error: This email is already used!");
        }
        Users newUser = new Users();
        newUser.setName(user.getName());
        newUser.setEmail(user.getEmail());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        return repository.save(newUser);
    }
    @PostMapping("/signInUser")
    public String signInUser(@RequestBody Users user) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
        );
        Optional<Users> dbUser = repository.findByEmail(user.getEmail());
        if (dbUser.isPresent()) {
            return jwtUtil.generateToken(user.getEmail(), dbUser.get().getUserId());
        }
        throw new RuntimeException("User not found");
    }

    @PutMapping("/updateUser")
    public ResponseEntity<Users> updateUser(@RequestBody Users userData,
                                            @RequestHeader("Authorization") String token) {

        String bearerToken = token.substring(7);
        int userId = jwtUtil.extractUserId(bearerToken);
        Users user = repository.findById(userId).orElseThrow(() -> new RuntimeException());
        user.setName(userData.getName());
        user.setEmail(userData.getEmail());
        repository.save(user);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/changePassword")
    public ResponseEntity<String> changePassword(@RequestBody Map<String, String> passwordData,
                                                 @RequestHeader("Authorization") String token) {
        try {
            String bearerToken = token.substring(7);
            int userId = jwtUtil.extractUserId(bearerToken);
            Users user = repository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            
            String oldPassword = passwordData.get("oldPassword");
            String newPassword = passwordData.get("newPassword");
            
            if (oldPassword == null || newPassword == null) {
                return ResponseEntity.badRequest().body("Old and new passwords are required");
            }
            
            // Check that the old password is correct
            if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                return ResponseEntity.status(401).body("The old password is incorrect");
            }
            
            // Update the password
            user.setPassword(passwordEncoder.encode(newPassword));
            repository.save(user);
            
            return ResponseEntity.ok("Password changed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error changing password: " + e.getMessage());
        }
    }

}
