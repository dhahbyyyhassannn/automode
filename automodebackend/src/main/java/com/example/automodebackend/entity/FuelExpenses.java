package com.example.automodebackend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "FuelExpenses")
public class FuelExpenses extends Expenses {
    private double liters;
    private double pricePerLitre;
}
