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
import java.util.ArrayList;
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

    @GetMapping("/vehicles/best")
    public ResponseEntity<?> getBestVehicle(@RequestHeader("Authorization") String token) {
        String bearerToken = token.substring(7);
        int userId = extractUserIdFromToken(bearerToken);
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("user not found"));

        List<Vehicles> vehicles = vehiclesRepository.findByUser_UserId(user.getUserId());
        Map<String, Object> best = computeBestVehicle(vehicles);
        if (best == null) {
            return ResponseEntity.status(404).body("no vehicles found");
        }
        return ResponseEntity.ok(best);
    }

    @GetMapping("/vehicles/bestPublic")
    public ResponseEntity<?> getBestVehiclePublic() {
        List<Vehicles> vehicles = vehiclesRepository.findAll();
        Map<String, Object> best = computeBestVehicle(vehicles);
        if (best == null) {
            return ResponseEntity.status(404).body("no vehicles found");
        }
        return ResponseEntity.ok(best);
    }

    private Map<String, Object> computeBestVehicle(List<Vehicles> vehicles) {
        if (vehicles == null || vehicles.isEmpty()) {
            return null;
        }

        List<Map<String, Object>> stats = new ArrayList<>();
        double minTotal = Double.MAX_VALUE;
        double maxTotal = Double.MIN_VALUE;
        double minCostPerKm = Double.MAX_VALUE;
        double maxCostPerKm = Double.MIN_VALUE;
        double minMileage = Double.MAX_VALUE;
        double maxMileage = Double.MIN_VALUE;
        double minYear = Double.MAX_VALUE;
        double maxYear = Double.MIN_VALUE;
        double minRepairs = Double.MAX_VALUE;
        double maxRepairs = Double.MIN_VALUE;
        double minFuelCons = Double.MAX_VALUE;
        double maxFuelCons = Double.MIN_VALUE;

        for (Vehicles vehicle : vehicles) {
            String matricule = vehicle.getMatricule();
            double fuelTotal = fuelExpensesRepository.findByVehicle_Matricule(matricule)
                    .stream()
                    .mapToDouble(expense -> expense.getCost())
                    .sum();
            double fuelLiters = fuelExpensesRepository.findByVehicle_Matricule(matricule)
                    .stream()
                    .mapToDouble(expense -> expense.getLiters())
                    .sum();
            double oilTotal = oilChangeExpensesRepository.findByVehicle_Matricule(matricule)
                    .stream()
                    .mapToDouble(expense -> expense.getCost())
                    .sum();
            double repairTotal = repairExpensesRepository.findByVehicle_Matricule(matricule)
                    .stream()
                    .mapToDouble(expense -> expense.getCost())
                    .sum();
            int repairCount = repairExpensesRepository.findByVehicle_Matricule(matricule).size();

            double totalExpenses = fuelTotal + oilTotal + repairTotal;
            double mileage = vehicle.getCurrentMileage();
            double costPerKm = mileage > 0 ? totalExpenses / mileage : 0;
            double fuelConsumption = mileage > 0 ? (fuelLiters / mileage) * 100.0 : 0;

            Map<String, Object> s = new HashMap<>();
            s.put("vehicle", vehicle);
            s.put("totalExpenses", totalExpenses);
            s.put("costPerKm", costPerKm);
            s.put("mileage", mileage);
            s.put("year", vehicle.getYear());
            s.put("repairCount", repairCount);
            s.put("fuelConsumption", fuelConsumption);
            stats.add(s);

            minTotal = Math.min(minTotal, totalExpenses);
            maxTotal = Math.max(maxTotal, totalExpenses);
            minCostPerKm = Math.min(minCostPerKm, costPerKm);
            maxCostPerKm = Math.max(maxCostPerKm, costPerKm);
            minMileage = Math.min(minMileage, mileage);
            maxMileage = Math.max(maxMileage, mileage);
            minYear = Math.min(minYear, vehicle.getYear());
            maxYear = Math.max(maxYear, vehicle.getYear());
            minRepairs = Math.min(minRepairs, repairCount);
            maxRepairs = Math.max(maxRepairs, repairCount);
            minFuelCons = Math.min(minFuelCons, fuelConsumption);
            maxFuelCons = Math.max(maxFuelCons, fuelConsumption);
        }

        Map<String, Object> best = null;
        double bestScore = -1;

        for (Map<String, Object> s : stats) {
            double totalExpenses = (double) s.get("totalExpenses");
            double costPerKm = (double) s.get("costPerKm");
            double mileage = (double) s.get("mileage");
            double year = (int) s.get("year");
            double repairCount = (int) s.get("repairCount");
            double fuelConsumption = (double) s.get("fuelConsumption");

            double scoreTotal = normalizeLowerBetter(totalExpenses, minTotal, maxTotal);
            double scoreCostPerKm = normalizeLowerBetter(costPerKm, minCostPerKm, maxCostPerKm);
            double scoreMileage = normalizeLowerBetter(mileage, minMileage, maxMileage);
            double scoreYear = normalizeHigherBetter(year, minYear, maxYear);
            double scoreRepairs = normalizeLowerBetter(repairCount, minRepairs, maxRepairs);
            double scoreFuelCons = normalizeLowerBetter(fuelConsumption, minFuelCons, maxFuelCons);

            double score = (scoreTotal + scoreCostPerKm + scoreMileage + scoreYear + scoreRepairs + scoreFuelCons) / 6.0;
            s.put("score", score);

            if (score > bestScore) {
                bestScore = score;
                best = s;
            }
        }

        return best;
    }

    private double normalizeLowerBetter(double value, double min, double max) {
        if (Double.compare(max, min) == 0) {
            return 1.0;
        }
        return (max - value) / (max - min);
    }

    private double normalizeHigherBetter(double value, double min, double max) {
        if (Double.compare(max, min) == 0) {
            return 1.0;
        }
        return (value - min) / (max - min);
    }

    @DeleteMapping("deleteVehicle/{matricule}")
    public ResponseEntity<String> deleteCar(@PathVariable("matricule") String matricule) {
        // Ensure the repository deletes by the correct ID (matricule)
        vehiclesRepository.deleteById(matricule);
        return ResponseEntity.ok("vehicle deleted successfully");
    }
}
