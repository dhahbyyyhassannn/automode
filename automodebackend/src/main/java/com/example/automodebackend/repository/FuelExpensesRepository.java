package com.example.automodebackend.repository;

import com.example.automodebackend.entity.FuelExpenses;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FuelExpensesRepository extends JpaRepository<FuelExpenses, Integer> {
    List<FuelExpenses> findByVehicle_Matricule(String matricule);
}
