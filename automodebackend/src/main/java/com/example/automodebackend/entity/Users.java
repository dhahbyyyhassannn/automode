package com.example.automodebackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@Entity
@NoArgsConstructor
@Table(name = "Users")

public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;
    private String name;
    private String email;
    private String password;
    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Vehicles> vehicles;

}
