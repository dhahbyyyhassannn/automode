package com.example.automodebackend.entity;


import jakarta.persistence.Entity;
import lombok.Data;

@Entity
@Data
public class RepairExpenses extends Expenses {
    private String description;
    private Integer nextChangeMiles;
}
