package com.example.automodebackend.controller;

import com.example.automodebackend.entity.Users;
import com.example.automodebackend.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
public class AuthController {
    @Autowired
    private UsersRepository usersRepository;
    @GetMapping("/me")
    public Users getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return usersRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("user not found"));
    }
}
