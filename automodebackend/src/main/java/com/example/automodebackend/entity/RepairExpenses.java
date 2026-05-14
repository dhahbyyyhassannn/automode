package com.example.automodebackend.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
public class RepairExpenses extends Expenses {
    private String description;
    private int nextChangeMiles;
}
