package com.example.automodebackend.controller;

import com.example.automodebackend.entity.RepairExpenses;
import com.example.automodebackend.entity.Vehicles;
import com.example.automodebackend.repository.RepairExpensesRepository;
import com.example.automodebackend.repository.VehiclesRepository;
import com.example.automodebackend.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins="http://localhost:3000")
public class RepairExpensesController {
    private final RepairExpensesRepository repairExpensesRepository;
    private final VehiclesRepository vehiclesRepository;
    private final JwtUtil jwtUtil;

    public RepairExpensesController(RepairExpensesRepository repairExpensesRepository, 
                                    VehiclesRepository vehiclesRepository, 
                                    JwtUtil jwtUtil) {
        this.repairExpensesRepository = repairExpensesRepository;
        this.vehiclesRepository = vehiclesRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/vehicles/{matricule}/repairExpenses")
    public ResponseEntity<?> getRepairExpenses(@PathVariable("matricule") String matricule,
                                               @RequestHeader("Authorization") String token) {

        String bearerToken = token.substring(7);
        int userId = jwtUtil.extractUserId(bearerToken);

        Vehicles vehicles = vehiclesRepository.findByMatricule(matricule);

        if (vehicles == null) {
            return ResponseEntity.status(404).body("Vehicle not found with matricule: " + matricule);
        }

        if (vehicles.getUser() == null) {
            return ResponseEntity.status(500).body("Internal error: This vehicle has no owner assigned.");
        }

        if (vehicles.getUser().getUserId() != userId) {
            return ResponseEntity.status(403).body("not allowed");
        }

        return ResponseEntity.ok(repairExpensesRepository.findByVehicle_Matricule(matricule));
    }

    @PostMapping("/vehicles/{matricule}/repairExpense")
    public ResponseEntity<?> ajouterRepairExpenses(@PathVariable("matricule") String matricule,
                                                      @RequestBody RepairExpenses repairExpenses,
                                                      @RequestHeader("Authorization") String token) {

        try {
            String bearerToken = token.substring(7);
            int userId = jwtUtil.extractUserId(bearerToken);
            Vehicles vehicles = vehiclesRepository.findByMatricule(matricule);

            if (vehicles == null) {
                System.out.println("DEBUG: Vehicle not found: " + matricule);
                return ResponseEntity.status(404).body("Vehicle not found with matricule: " + matricule);
            }

            if (vehicles.getUser() == null) {
                System.out.println("DEBUG: Vehicle has no owner: " + matricule);
                return ResponseEntity.status(500).body("Internal error: This vehicle has no owner assigned.");
            }

            if (vehicles.getUser().getUserId() != userId) {
                System.out.println("DEBUG: Ownership mismatch. Token UserID: " + userId + ", Vehicle OwnerID: " + vehicles.getUser().getUserId());
                return ResponseEntity.status(403).body("not allowed: you are not the owner of this vehicle");
            }

            if (repairExpenses.getDate() == null) {
                repairExpenses.setDate(java.time.LocalDate.now());
            }

            repairExpenses.setVehicle(vehicles);
            repairExpensesRepository.save(repairExpenses);
            System.out.println("DEBUG: Repair expense saved successfully for vehicle: " + matricule);
            return ResponseEntity.ok("repair expenses saved");
        } catch (Exception e) {
            System.err.println("DEBUG: Error adding repair expense: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(400).body("Error: " + e.getMessage());
        }
    }
}
