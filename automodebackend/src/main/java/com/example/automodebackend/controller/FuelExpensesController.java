package com.example.automodebackend.controller;

import com.example.automodebackend.entity.FuelExpenses;
import com.example.automodebackend.repository.FuelExpensesRepository;
import com.example.automodebackend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins="http://localhost:3000")
public class FuelExpensesController {

    @Autowired
    private FuelExpensesRepository fuelExpensesRepository;

    @PostMapping("/addFuelExpenses")
    public FuelExpenses ajouterFuelExpenses(@RequestBody FuelExpenses fuelExpenses) {
        return fuelExpensesRepository.save(fuelExpenses);
    }
}
