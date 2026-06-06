package com.example.automodebackend.controller;

import com.example.automodebackend.entity.Vehicles;
import com.example.automodebackend.repository.VehiclesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/api/images")
public class ImageController {

    @Autowired
    private VehiclesRepository vehiclesRepository;

    /**
     * Get image for a vehicle by matricule
     * Returns the image as binary JPEG data
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
            
            // Return as JPEG image with proper headers
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_JPEG_VALUE)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + matricule + ".jpg\"")
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                    .body(image);
                    
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving image: " + e.getMessage());
        }
    }

    /**
     * Get image as base64 data URL
     * Returns JSON with base64-encoded image for frontend convenience
     */
    @GetMapping("/vehicle-base64/{matricule}")
    public ResponseEntity<?> getVehicleImageBase64(@PathVariable String matricule) {
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
            
            // Convert to base64 data URL
            String base64Image = Base64.getEncoder().encodeToString(image);
            String dataUrl = "data:image/jpeg;base64," + base64Image;
            
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"imageUrl\": \"" + dataUrl + "\", \"matricule\": \"" + matricule + "\"}");
                    
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
