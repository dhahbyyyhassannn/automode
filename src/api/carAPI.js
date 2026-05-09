import axios from "axios";

export const AddCar = async (car) => {

    const token = localStorage.getItem("token");

    return await axios.post('http://localhost:8090/addVehicle', car, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}
