import axios from "axios";

export const getOilChangeExpenses = async (matricule) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`http://localhost:8090/vehicles/${matricule}/oilChangeExpenses`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return res.data;
};

export const AddOilChangeExpenses = async (vehicleId, oilChangeExpense) => {

    const token = localStorage.getItem("token");

    return await axios.post(`http://localhost:8090/vehicles/${vehicleId}/addOilChangeExpense`, oilChangeExpense, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}