import axios from "axios";

export const AddFuelExpenses = async (vehicleId, fuelExpense) => {

    const token = localStorage.getItem("token");

    return await axios.post(`http://localhost:8090/vehicles/${vehicleId}/addFuelExpense`, fuelExpense, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}