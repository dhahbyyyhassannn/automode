package com.example.automodebackend.entity;

import jakarta.persistence.*;

@Entity
public class OilChangeExpenses extends Expenses {
    private String oilType;
    private int nextChangeMiles;
}
