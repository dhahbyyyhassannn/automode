package com.example.automodebackend.controller;


import com.example.automodebackend.entity.Users;
import com.example.automodebackend.repository.UsersRepository;
import com.example.automodebackend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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
            throw new RuntimeException("Erreur:Cet email est déjà utilisé !");
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
        return jwtUtil.generateToken(user.getEmail());
    }
}
