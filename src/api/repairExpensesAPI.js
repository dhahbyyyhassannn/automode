import axios from "axios";

export const AddRepairExpenses = async (vehicleId, repairExpense) => {

    const token = localStorage.getItem("token");

    return await axios.post(`http://localhost:8090/vehicles/${vehicleId}/repairExpense`, repairExpense, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}
