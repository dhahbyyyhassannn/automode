package com.example.automodebackend.controller;

import com.example.automodebackend.entity.Vehicles;
import com.example.automodebackend.repository.VehiclesRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins="http://localhost:3000")
public class VehiclesController {

    private VehiclesRepository vehiclesRepository;

    public VehiclesController(VehiclesRepository vehiclesRepository) {
        this.vehiclesRepository = vehiclesRepository;
    }

    @PostMapping("/addVehicle")
    public Vehicles addVehicle(@RequestBody Vehicles vehicle) {
        return vehiclesRepository.save(vehicle);
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
}
