package com.example.automodebackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fuel_expenses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FuelExpenses extends Expenses {
    private Double liters;
    private Double pricePerLitre;
    private Double estimatedMilesPerLiter;
}
