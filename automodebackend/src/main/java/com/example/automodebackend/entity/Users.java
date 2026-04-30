package com.example.automodebackend.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Table(name = "Users")

public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;
    private String name;
    @Getter
    private String email;
    @Getter
    private String password;
}
