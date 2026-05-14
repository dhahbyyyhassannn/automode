package com.example.automodebackend.controller;

import com.example.automodebackend.entity.OilChangeExpenses;
import com.example.automodebackend.entity.Vehicles;
import com.example.automodebackend.repository.OilChangeExpensesRepository;
import com.example.automodebackend.repository.VehiclesRepository;
import com.example.automodebackend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins="http://localhost:3000")
public class OilChangeExpensesController {
    @Autowired
    private OilChangeExpensesRepository oilChangeExpensesRepository;
    @Autowired
    private VehiclesRepository vehiclesRepository;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/vehicles/{matricule}/addOilChangeExpense")
    public ResponseEntity<?> ajouterOilChangeExpenses(@PathVariable("matricule") String matricule,
                                                 @RequestBody OilChangeExpenses oilChangeExpenses,
                                                 @RequestHeader("Authorization") String token) {

        String bearerToken = token.substring(7);
        int userId = jwtUtil.extractUserId(bearerToken);
        Vehicles vehicles = vehiclesRepository.findByMatricule(matricule);
        if(vehicles.getUser().getUserId() != userId ) {
            return ResponseEntity.status(403).body("not allowed");
        }
        oilChangeExpenses.setVehicle(vehicles);
        oilChangeExpensesRepository.save(oilChangeExpenses);
        return ResponseEntity.ok("oil change expenses saved");
    }
}
