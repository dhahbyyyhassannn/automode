import layoutStyles from './layoutStyle.module.css'
import { useState } from 'react';
import { signInUser } from '../api/userAPI';
import Swal from 'sweetalert2';

export default function BoxSignIn() {
    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInUser(user);
            Swal.fire({
                title: "Signed in successfully",
                icon: "success",
                confirmButtonText: "OK"
            });
        } catch (error) {
            console.error('Error signing in user:', error);
            Swal.fire({
                title: "Error signing in",
                text: error.message,
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    };

    return (

        <div className={layoutStyles['signInContainer']}>
            <h2 className={layoutStyles['formTitle']}>Sign In</h2>
            <form>
                <div className={layoutStyles['formGroup']}>
                    <label className={layoutStyles['Label']}>Email:</label>
                    <input className={layoutStyles['input']} type="email" placeholder="name@example.com" name="email" value={user.email} onChange={handleChange} required/>
                </div>
                <div className={layoutStyles['formGroup']}>
                    <label className={layoutStyles['Label']}>Password:</label>
                    <input className={layoutStyles['input']} type="password" placeholder="••••••••" name="password" value={user.password} onChange={handleChange} required/>
                </div>
                <button type="submit" className={layoutStyles['btn']}>Sign In</button>
                <p className={layoutStyles['loginSig']}>Don’t have an account? <a className={layoutStyles['aloginSig']} href="/signUp"> Sign up here</a></p>


            </form>
        </div>
    )
}