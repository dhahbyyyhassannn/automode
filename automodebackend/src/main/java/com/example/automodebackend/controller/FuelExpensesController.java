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

    private final FuelExpensesRepository fuelExpensesRepository;
    private final VehiclesRepository vehiclesRepository;
    private final JwtUtil jwtUtil;

    public FuelExpensesController(FuelExpensesRepository fuelExpensesRepository, 
                                  VehiclesRepository vehiclesRepository, 
                                  JwtUtil jwtUtil) {
        this.fuelExpensesRepository = fuelExpensesRepository;
        this.vehiclesRepository = vehiclesRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/vehicles/{matricule}/fuelExpenses")
    public ResponseEntity<?> getFuelExpenses(@PathVariable("matricule") String matricule,
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
            return ResponseEntity.status(403).body("not allowed: you are not the owner of this vehicle");
        }

        return ResponseEntity.ok(fuelExpensesRepository.findByVehicle_Matricule(matricule));
    }

    @PostMapping("/vehicles/{matricule}/addFuelExpense")
    public ResponseEntity<?> ajouterFuelExpenses(@PathVariable("matricule") String matricule,
                                                 @RequestBody FuelExpenses fuelExpenses,
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

            if (fuelExpenses.getDate() == null) {
                fuelExpenses.setDate(java.time.LocalDate.now());
            }

            fuelExpenses.setVehicle(vehicles);
            fuelExpensesRepository.save(fuelExpenses);
            System.out.println("DEBUG: Fuel expense saved successfully for vehicle: " + matricule);
            return ResponseEntity.ok("fuelExpenses saved");
        } catch (Exception e) {
            System.err.println("DEBUG: Error adding fuel expense: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(400).body("Error: " + e.getMessage());
        }
    }
}
