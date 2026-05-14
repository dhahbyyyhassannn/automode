import axios from "axios";

export const AddOilChangeExpenses = async (vehicleId, oilChangeExpense) => {

    const token = localStorage.getItem("token");

    return await axios.post(`http://localhost:8090/vehicles/${vehicleId}/addOilChangeExpense`, oilChangeExpense, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}