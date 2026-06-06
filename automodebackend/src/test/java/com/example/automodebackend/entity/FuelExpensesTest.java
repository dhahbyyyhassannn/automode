package com.example.automodebackend.entity;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class FuelExpensesTest {

    @Test
    public void testFuelExpensesFields() {
        FuelExpenses fuelExpenses = new FuelExpenses();
        fuelExpenses.setLiters(50.5);
        fuelExpenses.setPricePerLitre(1.5);
        fuelExpenses.setEstimatedMilesPerLiter(15.5);
        fuelExpenses.setCost(75.75);

        assertEquals(50.5, fuelExpenses.getLiters());
        assertEquals(1.5, fuelExpenses.getPricePerLitre());
        assertEquals(15.5, fuelExpenses.getEstimatedMilesPerLiter());
        assertEquals(75.75, fuelExpenses.getCost());
    }
}
