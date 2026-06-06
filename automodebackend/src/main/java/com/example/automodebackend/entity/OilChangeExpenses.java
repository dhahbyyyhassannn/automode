package com.example.automodebackend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class OilChangeExpenses extends Expenses {
    private String oilType;
    private Integer nextChangeMiles;
}
