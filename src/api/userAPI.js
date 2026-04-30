import axios from "axios";

export const createUser = async (user) => {
    return await axios.post('http://localhost:8090/createUser', user)
}
export const signInUser = async (info) => {
    return await axios.post('http://localhost:8090/signInUser', info)
}