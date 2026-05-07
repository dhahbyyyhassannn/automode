import axios from "axios";

export const AddCar = async (car) => {

    const token = localStorage.getItem("token");

    return await axios.post('http://localhost:8090/AddVehicle', car, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}
