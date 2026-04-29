import { useState } from 'react'


import layoutStyles from './layoutStyle.module.css'

export default function BoxSignUp() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        verifyPassword: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }

    return (
        <div className={layoutStyles['signInContainer']}>
            <h2 className={layoutStyles['formTitle']}>Sign Up</h2>
            <form action={handleSubmit}>
                <div className={layoutStyles['formGroup']}>
                    <label className={layoutStyles['Label']}>Name:</label>
                    <input className={layoutStyles['input']} type="text" placeholder="Your name" name="name" value={user.name} onChange={handleChange} required/>
                </div>
                <div className={layoutStyles['formGroup']}>
                    <label className={layoutStyles['Label']}>Email:</label>
                    <input className={layoutStyles['input']} type="email" placeholder="name@example.com" name="email" value={user.email} onChange={handleChange} required/>
                </div>
                <div className={layoutStyles['formGroup']}>
                    <label className={layoutStyles['Label']}>Password:</label>
                    <input className={layoutStyles['input']} type="password" placeholder="••••••••" name="password" value={user.password} onChange={handleChange} required/>
                </div>
                <div className={layoutStyles['formGroup']}>
                    <label className={layoutStyles['Label']}>Verify Password:</label>
                    <input className={layoutStyles['input']} type="password" placeholder="••••••••" name="verifyPassword" value={user.verifyPassword} onChange={handleChange} required/>
                </div>
                <button type="submit" className={layoutStyles['btn']}>Create Account</button>
            </form>
        </div>
    )
}