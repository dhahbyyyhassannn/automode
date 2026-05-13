import axios from "axios";

export const createUser = async (user) => {
    return await axios.post('http://localhost:8090/createUser', user)
}

export const signInUser = async (info) => {
    try {
        const response = await axios.post('http://localhost:8090/signInUser', info);
        const token = response.data;
        localStorage.setItem('token', token);
        return response.data;
    } catch (error) {
        console.error("Authentication failed:", error.response?.data || error.message);
        throw error;
    }
}

export const updateUser = async (userData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put('http://localhost:8090/updateUser', userData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Update user failed:", error.response?.data || error.message);
        throw error;
    }
}

export const changePassword = async (passwordData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put('http://localhost:8090/changePassword', passwordData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Change password failed:", error.response?.data || error.message);
        throw error;
    }
}