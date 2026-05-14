import axios from "axios";

export const AddFuelExpenses = async (matricule, fuelExpense) => {

    const token = localStorage.getItem("token");

    return await axios.post(`http://localhost:8090/vehicles/${matricule}/addFuelExpense`, fuelExpense, {
        headers: {
            Authorization: `Bearer ${token}`,   
        }
    })
}