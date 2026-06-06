package com.example.automodebackend.controller;

import com.example.automodebackend.entity.*;
import com.example.automodebackend.repository.FuelExpensesRepository;
import com.example.automodebackend.repository.OilChangeExpensesRepository;
import com.example.automodebackend.repository.RepairExpensesRepository;
import com.example.automodebackend.repository.VehiclesRepository;
import com.example.automodebackend.repository.UsersRepository;
import com.example.automodebackend.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins="http://localhost:3000")
public class VehiclesController {

    private final VehiclesRepository vehiclesRepository;
    private final UsersRepository usersRepository;
    private final JwtUtil jwtUtil;
    private final FuelExpensesRepository fuelExpensesRepository;
    private final OilChangeExpensesRepository oilChangeExpensesRepository;
    private final RepairExpensesRepository repairExpensesRepository;

    public VehiclesController(VehiclesRepository vehiclesRepository, 
                              UsersRepository usersRepository, 
                              JwtUtil jwtUtil,
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
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestHeader("Authorization") String token) {
        
        String bearerToken = token.substring(7);
        int userId = jwtUtil.extractUserId(bearerToken);
        
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
            
            if (image != null && !image.isEmpty()) {
                try {
                    vehicle.setImage(image.getBytes());
                } catch (IOException e) {
                    throw new RuntimeException("Error processing image", e);
                }
            }
            
            return vehiclesRepository.save(vehicle);
        }
        throw new RuntimeException("User not found");
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
        return vehiclesRepository.findByMatricule(matricule);
    }

    @GetMapping("/getUserVehicles")
    public ResponseEntity<List<Vehicles>> getUserCars(@RequestHeader("Authorization") String token) {
        String bearerToken = token.substring(7);
        int userId = jwtUtil.extractUserId(bearerToken);
        List<Vehicles> vehicles = vehiclesRepository.findByUser_UserId(userId);
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/vehicles/{matricule}/expenseSummary")
    public ResponseEntity<?> getExpenseSummary(@PathVariable("matricule") String matricule,
                                               @RequestHeader("Authorization") String token) {

        String bearerToken = token.substring(7);
        int userId = jwtUtil.extractUserId(bearerToken);

        Vehicles vehicle = vehiclesRepository.findByMatricule(matricule);

        if (vehicle == null) {
            return ResponseEntity.status(404).body("vehicle not found");
        }

        if (vehicle.getUser() == null || vehicle.getUser().getUserId() != userId) {
            return ResponseEntity.status(403).body("not allowed");
        }

        // Fuel expenses
        List<FuelExpenses> fuelExpenses =
                fuelExpensesRepository.findByVehicle_Matricule(matricule);

        double fuelTotal = fuelExpenses.stream()
                .mapToDouble(expense ->
                        expense.getCost() != null ? expense.getCost() : 0.0)
                .sum();

        // Oil expenses
        List<OilChangeExpenses> oilExpenses =
                oilChangeExpensesRepository.findByVehicle_Matricule(matricule);

        double oilTotal = oilExpenses.stream()
                .mapToDouble(expense ->
                        expense.getCost() != null ? expense.getCost() : 0.0)
                .sum();

        // Repair expenses
        List<RepairExpenses> repairExpenses =
                repairExpensesRepository.findByVehicle_Matricule(matricule);

        double repairTotal = repairExpenses.stream()
                .mapToDouble(expense ->
                        expense.getCost() != null ? expense.getCost() : 0.0)
                .sum();

        double totalExpenses = fuelTotal + oilTotal + repairTotal;

        // Find the FIRST recorded mileage
        Integer firstMileage = null;

        for (FuelExpenses expense : fuelExpenses) {
            if (expense.getMileageAtService() != null) {
                if (firstMileage == null ||
                        expense.getMileageAtService() < firstMileage) {
                    firstMileage = expense.getMileageAtService();
                }
            }
        }

        for (OilChangeExpenses expense : oilExpenses) {
            if (expense.getMileageAtService() != null) {
                if (firstMileage == null ||
                        expense.getMileageAtService() < firstMileage) {
                    firstMileage = expense.getMileageAtService();
                }
            }
        }

        for (RepairExpenses expense : repairExpenses) {
            if (expense.getMileageAtService() != null) {
                if (firstMileage == null ||
                        expense.getMileageAtService() < firstMileage) {
                    firstMileage = expense.getMileageAtService();
                }
            }
        }

        // Distance covered since first expense
        double drivenMiles = 0;

        if (firstMileage != null) {
            drivenMiles = vehicle.getCurrentMileage() - firstMileage;
        }

        double costPerMile = drivenMiles > 0
                ? totalExpenses / drivenMiles
                : 0;

        Map<String, Object> summary = new HashMap<>();

        summary.put("matricule", vehicle.getMatricule());
        summary.put("fuelTotal", fuelTotal);
        summary.put("oilTotal", oilTotal);
        summary.put("repairTotal", repairTotal);
        summary.put("totalExpenses", totalExpenses);
        summary.put("costPerMile", costPerMile);
        summary.put("currentMileage", vehicle.getCurrentMileage());
        summary.put("firstRecordedMileage", firstMileage);
        summary.put("drivenMiles", drivenMiles);

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/vehicles/{matricule}/expenseSummaryPublic")
    public ResponseEntity<?> getExpenseSummaryPublic(@PathVariable("matricule") String matricule) {
        Vehicles vehicle = vehiclesRepository.findByMatricule(matricule);

        if (vehicle == null) {
            return ResponseEntity.status(404).body("vehicle not found");
        }

        double fuelTotal = fuelExpensesRepository.findByVehicle_Matricule(matricule)
                .stream()
                .mapToDouble(expense -> expense.getCost() != null ? expense.getCost() : 0.0)
                .sum();
        double oilTotal = oilChangeExpensesRepository.findByVehicle_Matricule(matricule)
                .stream()
                .mapToDouble(expense -> expense.getCost() != null ? expense.getCost() : 0.0)
                .sum();
        double repairTotal = repairExpensesRepository.findByVehicle_Matricule(matricule)
                .stream()
                .mapToDouble(expense -> expense.getCost() != null ? expense.getCost() : 0.0)
                .sum();

        double totalExpenses = fuelTotal + oilTotal + repairTotal;
        double costPerMile = vehicle.getCurrentMileage() > 0 ? totalExpenses / vehicle.getCurrentMileage() : 0;

        Map<String, Object> summary = new HashMap<>();
        summary.put("matricule", vehicle.getMatricule());
        summary.put("totalExpenses", totalExpenses);
        summary.put("costPerMile", costPerMile);

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/vehicles/best")
    public ResponseEntity<?> getBestVehicle(@RequestHeader("Authorization") String token) {
        String bearerToken = token.substring(7);
        int userId = jwtUtil.extractUserId(bearerToken);
        
        List<Vehicles> vehicles = vehiclesRepository.findByUser_UserId(userId);
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
            minYear = Math.min(minYear, (double)vehicle.getYear());
            maxYear = Math.max(maxYear, (double)vehicle.getYear());
            minRepairs = Math.min(minRepairs, (double)repairCount);
            maxRepairs = Math.max(maxRepairs, (double)repairCount);
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
        vehiclesRepository.deleteById(matricule);
        return ResponseEntity.ok("vehicle deleted successfully");
    }
}
