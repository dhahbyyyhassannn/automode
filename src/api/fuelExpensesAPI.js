import axios from "axios";

export const AddFuelExpenses = async (fuelExpense) => {

    const token = localStorage.getItem("token");

    return await axios.post('http://localhost:8090/addFuelExpenses', fuelExpense, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}