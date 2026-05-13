import axios from "axios";

export const AddCar = async (car) => {

    const token = localStorage.getItem("token");

    return await axios.post('http://localhost:8090/addVehicle', car, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}

export const searchCar = async (keyword) => {
    return await axios.get('http://localhost:8090/search', {
        params: { keyword }
    });
}

export const getRandomCars = async (limit = 3) => {
    return await axios.get('http://localhost:8090/random', {
        params: { limit }
    });
}
