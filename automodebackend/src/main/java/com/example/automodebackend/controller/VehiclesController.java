package com.example.automodebackend.controller;

import com.example.automodebackend.entity.Vehicles;
import com.example.automodebackend.entity.Users;
import com.example.automodebackend.repository.FuelExpensesRepository;
import com.example.automodebackend.repository.OilChangeExpensesRepository;
import com.example.automodebackend.repository.RepairExpensesRepository;
import com.example.automodebackend.repository.VehiclesRepository;
import com.example.automodebackend.repository.UsersRepository;
import com.example.automodebackend.security.JwtUtil;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins="http://localhost:3000")
public class VehiclesController {

    @Autowired
    private VehiclesRepository vehiclesRepository;
    private UsersRepository usersRepository;
    private JwtUtil jwtUtil;
    private FuelExpensesRepository fuelExpensesRepository;
    private OilChangeExpensesRepository oilChangeExpensesRepository;
    private RepairExpensesRepository repairExpensesRepository;
    
    @Value("${jwt.secret}")
    private String SECRET_KEY;

    public VehiclesController(VehiclesRepository vehiclesRepository, UsersRepository usersRepository, JwtUtil jwtUtil,
                              FuelExpensesRepository fuelExpensesRepository,
                              OilChangeExpensesRepository oilChangeExpensesRepository,
                              RepairExpensesRepository repairExpensesRepository) {
        this.vehiclesRepository = vehiclesRepository;
        this.usersRepository = usersRepository;
        this.jwtUtil = jwtUtil;
        this.fuelExpensesRepository = fuelExpensesRepository;
        this.oilChangeExpensesRepository = oilChangeExpensesRepository;
        this.repairExpensesRepository = repairExpensesRepository;
    }

    @PostMapping("/addVehicle")
    public Vehicles addVehicle(
            @RequestParam("matricule") String matricule,
            @RequestParam("brand") String brand,
            @RequestParam("model") String model,
            @RequestParam("type") String type,
            @RequestParam("year") int year,
            @RequestParam("currentMileage") int currentMileage,
            @RequestParam(value = "image", required = false) org.springframework.web.multipart.MultipartFile image,
            @RequestHeader("Authorization") String token) {
        
        // Extraire le token bearer
        String bearerToken = token.substring(7); // Remove "Bearer "
        
        // Extraire l'ID utilisateur du token
        int userId = extractUserIdFromToken(bearerToken);
        
        // Récupérer l'utilisateur depuis la base de données
        Optional<Users> user = usersRepository.findById(userId);
        if (user.isPresent()) {
            Vehicles vehicle = new Vehicles();
            vehicle.setMatricule(matricule);
            vehicle.setBrand(brand);
            vehicle.setModel(model);
            vehicle.setType(type);
            vehicle.setYear(year);
            vehicle.setCurrentMileage(currentMileage);
            vehicle.setUser(user.get());
            
            // Gérer l'image si présente
            if (image != null && !image.isEmpty()) {
                try {
                    vehicle.setImage(image.getBytes());
                } catch (IOException e) {
                    throw new RuntimeException("Erreur lors du traitement de l'image", e);
                }
            }
            
            return vehiclesRepository.save(vehicle);
        }
        throw new RuntimeException("Utilisateur non trouvé");
    }
    
    private int extractUserIdFromToken(String token) {
        try {
            return ((Number) Jwts.parser()
                    .setSigningKey(SECRET_KEY.getBytes())
                    .parseClaimsJws(token)
                    .getBody()
                    .get("userId")).intValue();
        } catch (Exception e) {
            throw new RuntimeException("Token invalide", e);
        }
    }

    @GetMapping("/search")
    public List<Vehicles> searchVehicles(@RequestParam("keyword") String keyword) {
        if (keyword == null || keyword.isEmpty()) {
            return vehiclesRepository.findAll();
        } else {
            return vehiclesRepository.searchVehicles(keyword);
        }
    }
    @GetMapping("/random")
    public List<Vehicles> getRandomCars(@RequestParam(defaultValue = "3") int limit) {
        return vehiclesRepository.findRandomCars(limit);
    }

    @GetMapping("/getCar/{matricule}")
    public Vehicles getCar(@PathVariable String matricule) {
        Vehicles vehicles = vehiclesRepository.findByMatricule(matricule);
        return vehicles;
    }

    @GetMapping("/getUserVehicles")
    public ResponseEntity<List<Vehicles>> getUserCars(@RequestHeader("Authorization") String token) {
        String bearerToken = token.substring(7);
        int UserId = extractUserIdFromToken(bearerToken);
        Users user = usersRepository.findById(UserId).orElseThrow(() -> new RuntimeException("user not found: "));
        List<Vehicles> vehicles = vehiclesRepository.findByUser_UserId(user.getUserId());
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/vehicles/{matricule}/expenseSummary")
    public ResponseEntity<?> getExpenseSummary(@PathVariable("matricule") String matricule,
                                               @RequestHeader("Authorization") String token) {
        String bearerToken = token.substring(7);
        int userId = extractUserIdFromToken(bearerToken);
        Vehicles vehicle = vehiclesRepository.findByMatricule(matricule);

        if (vehicle == null) {
            return ResponseEntity.status(404).body("vehicle not found");
        }

        if (vehicle.getUser() == null || vehicle.getUser().getUserId() != userId) {
            return ResponseEntity.status(403).body("not allowed");
        }

        double fuelTotal = fuelExpensesRepository.findByVehicle_Matricule(matricule)
                .stream()
                .mapToDouble(expense -> expense.getCost())
                .sum();
        double oilTotal = oilChangeExpensesRepository.findByVehicle_Matricule(matricule)
                .stream()
                .mapToDouble(expense -> expense.getCost())
                .sum();
        double repairTotal = repairExpensesRepository.findByVehicle_Matricule(matricule)
                .stream()
                .mapToDouble(expense -> expense.getCost())
                .sum();

        double totalExpenses = fuelTotal + oilTotal + repairTotal;
        double costPerMile = vehicle.getCurrentMileage() > 0 ? totalExpenses / vehicle.getCurrentMileage() : 0;

        Map<String, Object> summary = new HashMap<>();
        summary.put("matricule", vehicle.getMatricule());
        summary.put("fuelTotal", fuelTotal);
        summary.put("oilTotal", oilTotal);
        summary.put("repairTotal", repairTotal);
        summary.put("totalExpenses", totalExpenses);
        summary.put("costPerMile", costPerMile);
        summary.put("currentMileage", vehicle.getCurrentMileage());

        return ResponseEntity.ok(summary);
    }

    @DeleteMapping("deleteVehicle/{matricule}")
    public ResponseEntity<String> deleteCar(@PathVariable("matricule") String matricule) {
        // Ensure the repository deletes by the correct ID (matricule)
        vehiclesRepository.deleteById(matricule);
        return ResponseEntity.ok("vehicle deleted successfully");
    }
}
