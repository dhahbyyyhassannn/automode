package com.example.automodebackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@MappedSuperclass
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class Expenses {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idExpense;
    private double cost;
    private int mileageAtService;
    @ManyToOne
    @JoinColumn(name = "matricule")
    @JsonIgnore
    private Vehicles vehicle;
}
