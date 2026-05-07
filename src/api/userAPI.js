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