package com.example.automodebackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class Expenses {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idExpense;
    private Double cost;
    private Integer mileageAtService;
    private LocalDate date;
    @ManyToOne
    @JoinColumn(name = "matricule")
    @JsonIgnore
    private Vehicles vehicle;
}
