import axios from 'axios';
import { useState, useEffect } from 'react';


export default function AuthAPI() {
    const auth_URL = 'http://localhost:8090/me';

    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(auth_URL, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            setUser(res.data);
        })
    }, []);

    return user;
}