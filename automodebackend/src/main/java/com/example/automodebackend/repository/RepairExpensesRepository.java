package com.example.automodebackend.repository;

import com.example.automodebackend.entity.RepairExpenses;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RepairExpensesRepository extends JpaRepository<RepairExpenses, Integer> {
    List<RepairExpenses> findByVehicle_Matricule(String matricule);
}
