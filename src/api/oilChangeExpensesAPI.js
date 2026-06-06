import axios from "axios";

export const getOilChangeExpenses = async (matricule) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`http://localhost:8090/vehicles/${encodeURIComponent(matricule)}/oilChangeExpenses`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return res.data;
};

export const AddOilChangeExpenses = async (vehicleId, oilChangeExpense) => {
    const token = localStorage.getItem("token");
    
    console.log("=== OIL CHANGE EXPENSE DEBUG ===");
    console.log("Vehicle ID (Matricule):", vehicleId);
    console.log("Token present:", !!token);
    console.log("Expense data:", oilChangeExpense);
    console.log("Endpoint:", `http://localhost:8090/vehicles/${encodeURIComponent(vehicleId)}/addOilChangeExpense`);
    
    try {
        const response = await axios.post(`http://localhost:8090/vehicles/${encodeURIComponent(vehicleId)}/addOilChangeExpense`, oilChangeExpense, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        console.log("Oil change response:", response);
        return response;
    } catch (error) {
        console.error("Oil change error response:", error.response?.status, error.response?.data);
        throw error;
    }
}