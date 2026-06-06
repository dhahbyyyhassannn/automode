import axios from "axios";

export const getRepairExpenses = async (matricule) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`http://localhost:8090/vehicles/${encodeURIComponent(matricule)}/repairExpenses`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return res.data;
};

export const AddRepairExpenses = async (vehicleId, repairExpense) => {
    const token = localStorage.getItem("token");
    
    console.log("=== REPAIR EXPENSE DEBUG ===");
    console.log("Vehicle ID (Matricule):", vehicleId);
    console.log("Token present:", !!token);
    console.log("Expense data:", repairExpense);
    console.log("Endpoint:", `http://localhost:8090/vehicles/${encodeURIComponent(vehicleId)}/repairExpense`);
    
    try {
        const response = await axios.post(`http://localhost:8090/vehicles/${encodeURIComponent(vehicleId)}/repairExpense`, repairExpense, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        console.log("Repair response:", response);
        return response;
    } catch (error) {
        console.error("Repair error response:", error.response?.status, error.response?.data);
        throw error;
    }
}
