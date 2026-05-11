package com.example.automodebackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="Expenses")
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
public class Expenses {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idExpense;
    private double cost;
    private int mileageAtService;
    @ManyToOne
    @JoinColumn(name = "matricule")
    private Vehicles vehicle;
}
