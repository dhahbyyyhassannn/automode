import axios from "axios";

export const AddCarForm = async (car) => {
    return await axios.post('http://localhost:8090/AddCarForm', car)
}
export const searchCar = async (keyword) => {
    return await axios.get(`http://localhost:8090/search`, { params: { keyword } });
};
export const getRandomCars = async () => {
    return await axios.get(`http://localhost:8090/random`);
};

