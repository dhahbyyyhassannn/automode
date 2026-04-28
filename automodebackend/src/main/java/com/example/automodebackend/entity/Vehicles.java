package com.example.automodebackend.entity;


import jakarta.persistence.*;

@Entity
@Table(name = "vehicles")
public class Vehicles {
    @Id
    private String matricule;
    private String brand;
    private String model;
    private String type;
    private int year;
    private int currentMileage;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;
}
