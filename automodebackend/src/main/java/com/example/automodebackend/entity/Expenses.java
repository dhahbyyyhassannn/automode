package com.example.automodebackend.entity;

import jakarta.persistence.*;

@Entity
@Table(name="Expenses")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Expenses {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idExpense;
    private double cost;
    private int mileageAtService;
    @ManyToOne
    @JoinColumn(name = "matricule")
    private Vehicles vehicle;
}
