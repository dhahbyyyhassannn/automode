package com.example.automodebackend.controller;

import com.example.automodebackend.entity.FuelExpenses;
import com.example.automodebackend.entity.Vehicles;
import com.example.automodebackend.repository.FuelExpensesRepository;
import com.example.automodebackend.repository.VehiclesRepository;
import com.example.automodebackend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins="http://localhost:3000")
public class FuelExpensesController {

    @Autowired
    private FuelExpensesRepository fuelExpensesRepository;
    @Autowired
    private VehiclesRepository vehiclesRepository;
    @Autowired
    private JwtUtil jwtUtil;
    @PostMapping("/vehicles/{matricule}/addFuelExpense")
    public ResponseEntity<?> ajouterFuelExpenses(@PathVariable("matricule") String matricule,
                                                      @RequestBody FuelExpenses fuelExpenses,
                                                      @RequestHeader("Authorization") String token) {

        String bearerToken = token.substring(7);
        int userId = jwtUtil.extractUserId(bearerToken);
        Vehicles vehicles = vehiclesRepository.findByMatricule(matricule);
        if(vehicles.getUser().getUserId() != userId ) {
            return ResponseEntity.status(403).body("not allowed");
        }
        fuelExpenses.setVehicle(vehicles);
        fuelExpensesRepository.save(fuelExpenses);
        return ResponseEntity.ok("fuelExpenses saved");
    }
}
