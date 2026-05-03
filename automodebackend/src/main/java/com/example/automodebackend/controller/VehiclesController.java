package com.example.automodebackend.controller;

import com.example.automodebackend.entity.Vehicles;
import com.example.automodebackend.repository.VehiclesRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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


}
