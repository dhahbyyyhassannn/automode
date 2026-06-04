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
    @Autowired
    private VehiclesRepository vehiclesRepository;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/vehicles/{matricule}/repairExpense")
    public ResponseEntity<?> ajouterRepairExpenses(@PathVariable("matricule") String matricule,
                                                      @RequestBody RepairExpenses repairExpenses,
                                                      @RequestHeader("Authorization") String token) {

        String bearerToken = token.substring(7);
        int userId = jwtUtil.extractUserId(bearerToken);
        Vehicles vehicles = vehiclesRepository.findByMatricule(matricule);
        
        // Ajouter une vérification null pour le véhicule
        if (vehicles == null) {
            return ResponseEntity.status(404).body("Véhicule non trouvé avec le matricule : " + matricule);
        }
        
        if (vehicles.getUser() == null) {
            return ResponseEntity.status(500).body("Erreur interne : Ce véhicule n'a pas de propriétaire assigné.");
        }
        
        if(vehicles.getUser().getUserId() != userId ) {
            return ResponseEntity.status(403).body("not allowed");
        }
        repairExpenses.setVehicle(vehicles);
        repairExpensesRepository.save(repairExpenses);
        return ResponseEntity.ok("repair expenses saved");
    }
}
