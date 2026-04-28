package com.example.automodebackend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Users")

public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int user_id;
    private String name;
    private String email;
    private String password;
}
