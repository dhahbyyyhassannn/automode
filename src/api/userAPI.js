import axios from "axios";

export const createUser = async (user) => {
    axios.post('http://localhost:8090/createUser', user)
}
export const signInUser = async (info) => {
    axios.post('http://localhost:8090/signInUser', info)
}