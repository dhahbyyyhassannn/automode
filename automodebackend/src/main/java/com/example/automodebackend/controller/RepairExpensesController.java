package com.example.automodebackend.controller;

import com.example.automodebackend.entity.RepairExpenses;
import com.example.automodebackend.entity.Vehicles;
import com.example.automodebackend.repository.RepairExpensesRepository;
import com.example.automodebackend.repository.VehiclesRepository;
import com.example.automodebackend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins="http://localhost:3000")
public class RepairExpensesController {
    @Autowired
    private RepairExpensesRepository repairExpensesRepository;
    private VehiclesRepository vehiclesRepository;
    private JwtUtil jwtUtil;

    @Autowired
    @PostMapping("/vehicles/{matricule}/repairExpense")
    public ResponseEntity<?> ajouterRepairExpenses(@PathVariable String matricule,
                                                      @RequestBody RepairExpenses repairExpenses,
                                                      @RequestHeader("Authorization") String token) {

        String bearerToken = token.substring(7);
        int userId = jwtUtil.extractUserId(bearerToken);
        Vehicles vehicles = vehiclesRepository.findByMatricule(matricule);
        if(vehicles.getUser().getUserId() != userId ) {
            return ResponseEntity.status(403).body("not allowed");
        }
        repairExpenses.setVehicle(vehicles);
        repairExpensesRepository.save(repairExpenses);
        return ResponseEntity.ok("repair expenses saved");
    }
}
