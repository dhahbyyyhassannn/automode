import axios from "axios";

export const getRepairExpenses = async (matricule) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`http://localhost:8090/vehicles/${matricule}/repairExpenses`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return res.data;
};

export const AddRepairExpenses = async (vehicleId, repairExpense) => {

    const token = localStorage.getItem("token");

    return await axios.post(`http://localhost:8090/vehicles/${vehicleId}/repairExpense`, repairExpense, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}
