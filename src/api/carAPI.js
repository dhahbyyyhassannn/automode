import axios from "axios";


const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`
    };
};

export const AddCar = async (car) => {
    // Don't set Content-Type header - let axios handle it with FormData
    return await axios.post('http://localhost:8090/addVehicle', car, {
        headers: {
            Authorization: localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : undefined
        }
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

export const getVehicleExpenseSummary = async (matricule) => {
    try {
        const response = await axios.get(`http://localhost:8090/vehicles/${matricule}/expenseSummary`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error("Get vehicle expense summary failed:", error.response?.data || error.message);
        throw error;
    }
};

// Image-related endpoints
export const getVehicleImage = async (matricule) => {
    try {
        const response = await axios.get(`http://localhost:8090/api/images/vehicle/${matricule}`, {
            responseType: 'blob'
        });
        // Convert blob to base64
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result); // base64 data URL
            };
            reader.onerror = reject;
            reader.readAsDataURL(response.data);
        });
    } catch (error) {
        console.error("Get vehicle image failed:", error.response?.data || error.message);
        return null; // Return null if image not found
    }
};

export const getVehicleWithImage = async (matricule) => {
    try {
        const response = await axios.get(`http://localhost:8090/api/images/vehicle-with-image/${matricule}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error("Get vehicle with image failed:", error.response?.data || error.message);
        throw error;
    }
};
