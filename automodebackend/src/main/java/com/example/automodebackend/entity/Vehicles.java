package com.example.automodebackend.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;


@Entity
@Table(name = "Vehicles")
@Data
public class Vehicles {
    @Id private String matricule;
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
