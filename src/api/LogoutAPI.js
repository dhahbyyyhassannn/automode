import axios from 'axios';

export const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common["Authorization"];
    window.location.href = '/signin';
};