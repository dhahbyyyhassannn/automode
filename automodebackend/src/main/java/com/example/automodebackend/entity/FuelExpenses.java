package com.example.automodebackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "FuelExpenses")
@AllArgsConstructor
@NoArgsConstructor
public class FuelExpenses extends Expenses {
    private double liters;
    private double pricePerLitre;
}
