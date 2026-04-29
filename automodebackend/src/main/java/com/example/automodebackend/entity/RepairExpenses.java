package com.example.automodebackend.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "RepairExpenses")
public class RepairExpenses extends Expenses {
    private String description;
    private int nextChangeMiles;
}
