import axios from "axios";

export const getFuelExpenses = async (matricule) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`http://localhost:8090/vehicles/${encodeURIComponent(matricule)}/fuelExpenses`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return res.data;
};

export const AddFuelExpenses = async (matricule, fuelExpense) => {
    const token = localStorage.getItem("token");

    console.log("=== FUEL EXPENSE DEBUG ===");
    console.log("Vehicle ID (Matricule):", matricule);
    console.log("Token present:", !!token);
    console.log("Expense data:", fuelExpense);
    console.log("Endpoint:", `http://localhost:8090/vehicles/${encodeURIComponent(matricule)}/addFuelExpense`);

    try {
        const response = await axios.post(`http://localhost:8090/vehicles/${encodeURIComponent(matricule)}/addFuelExpense`, fuelExpense, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        console.log("Fuel response:", response);
        return response;
    } catch (error) {
        console.error("Fuel error response:", error.response?.status, error.response?.data);
        throw error;
    }
}