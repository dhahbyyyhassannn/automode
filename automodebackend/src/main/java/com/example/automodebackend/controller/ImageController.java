package com.example.automodebackend.controller;

import com.example.automodebackend.entity.Vehicles;
import com.example.automodebackend.repository.VehiclesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/images")
public class ImageController {

    @Autowired
    private VehiclesRepository vehiclesRepository;

    /**
     * Get image for a vehicle by matricule
     * Returns the image as base64 encoded string for easy display in frontend
     */
    @GetMapping("/vehicle/{matricule}")
    public ResponseEntity<?> getVehicleImage(@PathVariable String matricule) {
        try {
            Vehicles vehicle = vehiclesRepository.findByMatricule(matricule);
            
            if (vehicle == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Vehicle not found");
            }
            
            byte[] image = vehicle.getImage();
            if (image == null || image.length == 0) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No image found for this vehicle");
            }
            
            // Return as octet-stream for binary data
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + matricule + ".jpg\"")
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(image);
                    
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving image: " + e.getMessage());
        }
    }

    /**
     * Get vehicle details with image included as base64
     * Useful when you need the full vehicle object with image
     */
    @GetMapping("/vehicle-with-image/{matricule}")
    public ResponseEntity<?> getVehicleWithImage(@PathVariable String matricule) {
        try {
            Vehicles vehicle = vehiclesRepository.findByMatricule(matricule);
            
            if (vehicle == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Vehicle not found");
            }
            
            return ResponseEntity.ok(vehicle);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving vehicle: " + e.getMessage());
        }
    }
}
