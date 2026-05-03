import axios from "axios";

export const AddCarForm = async (car) => {
    return await axios.post('http://localhost:8090/AddCarForm', car)
}
