package com.example.automodebackend.repository;
import com.example.automodebackend.entity.OilChangeExpenses;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OilChangeExpensesRepository extends JpaRepository<OilChangeExpenses, Integer> {
    List<OilChangeExpenses> findByVehicle_Matricule(String matricule);
}
