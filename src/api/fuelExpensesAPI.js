import axios from "axios";

export const getFuelExpenses = async (matricule) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`http://localhost:8090/vehicles/${matricule}/fuelExpenses`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return res.data;
};

export const AddFuelExpenses = async (matricule, fuelExpense) => {

    const token = localStorage.getItem("token");

    return await axios.post(`http://localhost:8090/vehicles/${matricule}/addFuelExpense`, fuelExpense, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}