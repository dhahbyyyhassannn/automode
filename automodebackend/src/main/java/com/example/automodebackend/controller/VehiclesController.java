package com.example.automodebackend.controller;

import com.example.automodebackend.entity.Vehicles;
import com.example.automodebackend.entity.Users;
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
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins="http://localhost:3000")
public class VehiclesController {

    @Autowired
    private VehiclesRepository vehiclesRepository;
    private UsersRepository usersRepository;
    private JwtUtil jwtUtil;
    
    @Value("${jwt.secret}")
    private String SECRET_KEY;

    public VehiclesController(VehiclesRepository vehiclesRepository, UsersRepository usersRepository, JwtUtil jwtUtil) {
        this.vehiclesRepository = vehiclesRepository;
        this.usersRepository = usersRepository;
        this.jwtUtil = jwtUtil;
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

    @GetMapping("/getVehicle/{matricule}")
    public Vehicles getCar(@PathVariable String matricule) {
        Vehicles vehicles = vehiclesRepository.findByMatricule(matricule);
        return vehicles;
    }

    @GetMapping("/getUserVehciles")
    public ResponseEntity<List<Vehicles>> getUserCars(Authentication auth) {
        String username = auth.getName();
        Users user = usersRepository.findByName(username).orElseThrow();
        List<Vehicles> vehicles = vehiclesRepository.findByUser_UserId(user.getUserId());
        return ResponseEntity.ok(vehicles);
    }

    @DeleteMapping("deleteVehicle/vehicleId")
    public ResponseEntity<String> deleteCar(@PathVariable String matricule) {
        vehiclesRepository.deleteById(matricule);
        return ResponseEntity.ok("vehicle deleted successfully");
    }

}
