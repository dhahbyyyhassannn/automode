package com.example.automodebackend.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Vehicles")
@Getter
@Setter
public class Vehicles {
    @Id
    private String matricule;
    private String brand;
    private String model;
    private String type;
    private int year;
    private int currentMileage;
    @Column(columnDefinition = "BYTEA")
    private byte[] image;
    @ManyToOne
    @JoinColumn(name = "userId")
    private Users user;
}
