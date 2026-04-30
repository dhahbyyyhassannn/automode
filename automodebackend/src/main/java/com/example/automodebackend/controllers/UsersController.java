package com.example.automodebackend.controllers;


import com.example.automodebackend.entity.Users;
import com.example.automodebackend.repository.UsersRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;


@RestController
@RequestMapping("/users")
public class UsersController {
    private final UsersRepository repository;

    public UsersController(UsersRepository repository) {
        this.repository = repository;
    }
    @PostMapping("/signup")
    public Users createUser(@RequestBody Users user) {
        if (repository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Erreur:Cet email est déjà utilisé !");
        }
        return repository.save(user);
    }
    @PostMapping("/signin")
    public Users signIn(@RequestBody Users user) {
        Optional<Users> userFound = repository.findByEmailAndPassword(user.getEmail(), user.getPassword());
        if (userFound.isEmpty()) {
            throw new RuntimeException("Erreur:Email ou mot de passe incorrect");
        }
        return userFound.get();
    }
}
