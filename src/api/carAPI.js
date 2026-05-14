import axios from "axios";


const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
    };
};

export const AddCar = async (car) => {
    return await axios.post('http://localhost:8090/addVehicle', car, {
        headers: getAuthHeaders()
    })
}

export const searchCar = async (keyword) => {
    return await axios.get('http://localhost:8090/search', {
        params: { keyword }
    });
}

export const getCar = async (matricule) => {
    try {
        const response = await axios.get(`http://localhost:8090/getCar/${matricule}`, {
            headers: getAuthHeaders() 
        });
        return response.data;
    } catch (error) {
        console.error("Get car failed:", error.response?.data || error.message);
        throw error;
    }
};
export const getRandomCars = async (limit = 3) => {
    return await axios.get('http://localhost:8090/random', {
        params: { limit }
    });
}

export const getUserVehicles = async () => {
    try {
        const response = await axios.get('http://localhost:8090/getUserVehicles', {
            headers: getAuthHeaders()
        });
        return response.data || [];
    } catch (error) {
        console.error("Get user vehicles failed:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteVehicle = async (matricule) => {
    try {
        const response = await axios.delete(`http://localhost:8090/deleteVehicle/${matricule}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error("Delete vehicle failed:", error.response?.data || error.message);
        throw error;
    }
};