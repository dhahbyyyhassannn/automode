package com.example.automodebackend.repository;

import com.example.automodebackend.entity.Vehicles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehiclesRepository extends JpaRepository<Vehicles, String> {
    @Query("SELECT v FROM Vehicles v WHERE " +
            "LOWER(v.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(v.model) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Vehicles> searchVehicles(@Param("keyword") String keyword);
    @Query(value = "SELECT * FROM vehicles ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<Vehicles> findRandomCars(@Param("limit") int limit);   
}
