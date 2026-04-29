package com.example.automodebackend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "OilChangeExpenses")
public class OilChangeExpenses extends Expenses {
    private String oilType;
    private int nextChangeMiles;
}
