package com.example.automodebackend.controller;


import com.example.automodebackend.entity.Users;
import com.example.automodebackend.repository.UsersRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin(origins="http://localhost:3000")
public class UsersController {
    private final UsersRepository repository;

    public UsersController(UsersRepository repository) {
        this.repository = repository;
    }
    @PostMapping("/createUser")
    public Users createUser(@RequestBody Users user) {
        if (repository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Erreur:Cet email est déjà utilisé !");
        }
        return repository.save(user);
    }
    @PostMapping("/signInUser")
    public Users signInUser(@RequestBody Users user) {
        Optional<Users> userFound = repository.findByEmailAndPassword(user.getEmail(), user.getPassword());
        if (userFound.isEmpty()) {
            throw new RuntimeException("Erreur:Email ou mot de passe incorrect");
        }
        return userFound.get();
    }
}
