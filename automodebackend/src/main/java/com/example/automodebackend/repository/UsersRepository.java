package com.example.automodebackend.repository;

import com.example.automodebackend.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsersRepository extends JpaRepository<Users, Integer> {
    boolean existsByEmail(String email);
    Optional<Users> findByEmailAndPassword(String email, String password);
}