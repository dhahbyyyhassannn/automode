package com.example.automodebackend.component;

import com.example.automodebackend.entity.*;
import com.example.automodebackend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsersRepository usersRepository;
    private final VehiclesRepository vehiclesRepository;
    private final FuelExpensesRepository fuelExpensesRepository;
    private final OilChangeExpensesRepository oilChangeExpensesRepository;
    private final RepairExpensesRepository repairExpensesRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UsersRepository usersRepository,
                           VehiclesRepository vehiclesRepository,
                           FuelExpensesRepository fuelExpensesRepository,
                           OilChangeExpensesRepository oilChangeExpensesRepository,
                           RepairExpensesRepository repairExpensesRepository,
                           PasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.vehiclesRepository = vehiclesRepository;
        this.fuelExpensesRepository = fuelExpensesRepository;
        this.oilChangeExpensesRepository = oilChangeExpensesRepository;
        this.repairExpensesRepository = repairExpensesRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (usersRepository.count() > 0) {
            System.out.println("Data already initialized. Skipping...");
            return;
        }

        System.out.println("Initializing sample data...");

        // 1. Create a Test User
        Users user = new Users();
        user.setName("John Doe");
        user.setEmail("test@example.com");
        user.setPassword(passwordEncoder.encode("password123"));
        usersRepository.save(user);

        // 2. Create Vehicles
        Vehicles car1 = new Vehicles();
        car1.setMatricule("222 TUN 2024");
        car1.setBrand("BMW");
        car1.setModel("M4 Competition");
        car1.setType("Coupe");
        car1.setYear(2024);
        car1.setCurrentMileage(15000);
        car1.setUser(user);
        vehiclesRepository.save(car1);

        Vehicles car2 = new Vehicles();
        car2.setMatricule("111 TUN 2023");
        car2.setBrand("Porsche");
        car2.setModel("Taycan Turbo S");
        car2.setType("Electric");
        car2.setYear(2023);
        car2.setCurrentMileage(8500);
        car2.setUser(user);
        vehiclesRepository.save(car2);

        // 3. Add Fuel Expenses for BMW
        FuelExpenses fuel1 = new FuelExpenses();
        fuel1.setVehicle(car1);
        fuel1.setCost(85.50);
        fuel1.setMileageAtService(5200);
        fuel1.setDate(LocalDate.now().minusMonths(2));
        fuel1.setLiters(45.0);
        fuel1.setPricePerLitre(1.9);
        fuel1.setEstimatedMilesPerLiter(12.5);
        fuelExpensesRepository.save(fuel1);

        FuelExpenses fuel2 = new FuelExpenses();
        fuel2.setVehicle(car1);
        fuel2.setCost(92.00);
        fuel2.setMileageAtService(10500);
        fuel2.setDate(LocalDate.now().minusMonths(1));
        fuel2.setLiters(48.5);
        fuel2.setPricePerLitre(1.89);
        fuel2.setEstimatedMilesPerLiter(12.0);
        fuelExpensesRepository.save(fuel2);

        // 4. Add Oil Change for BMW
        OilChangeExpenses oil1 = new OilChangeExpenses();
        oil1.setVehicle(car1);
        oil1.setCost(120.00);
        oil1.setMileageAtService(12000);
        oil1.setDate(LocalDate.now().minusDays(15));
        oil1.setOilType("5W-30 Synthetic");
        oil1.setNextChangeMiles(22000);
        oilChangeExpensesRepository.save(oil1);

        // 5. Add Repair for Porsche
        RepairExpenses repair1 = new RepairExpenses();
        repair1.setVehicle(car2);
        repair1.setCost(450.00);
        repair1.setMileageAtService(7200);
        repair1.setDate(LocalDate.now().minusMonths(1));
        repair1.setDescription("Tire alignment and software update");
        repair1.setNextChangeMiles(15000);
        repairExpensesRepository.save(repair1);

        System.out.println("Data initialization complete!");
        System.out.println("Test Credentials:");
        System.out.println("Email: test@example.com");
        System.out.println("Password: password123");
    }
}
