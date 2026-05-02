import { useState } from 'react'
import { createUser } from '../api/userAPI';
import Swal from 'sweetalert2';
import layoutStyles from './layoutStyle.module.css'

export default function BoxSignUp() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        verifyPassword: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createUser({
                name: user.name,
                email: user.email,
                password: user.password 
            });
            Swal.fire({
                title: "account created successfully",
                icon: "success",
                confirmButtonText: "OK"
            })
            setUser({name: '', email: '', password: '', verifyPassword: ''});
        }
        catch (error) {
            console.error('Error creating user:', error);
            Swal.fire({
                title: "Error creating account",
                text: error.message,
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    };

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }

    return (
        <div className={ layoutStyles.signInContainer }>
            <h2 className={ layoutStyles.formTitle }>Sign Up</h2>
            <form onSubmit={ handleSubmit }>
                <div className={ layoutStyles.formGroup }>
                    <label className={ layoutStyles.Label }>Name:</label>
                    <input className={ layoutStyles.input } type="text" placeholder="Your name" name="name" value={ user.name } onChange={ handleChange } required/>
                </div>
                <div className={ layoutStyles.formGroup }>
                    <label className={ layoutStyles.Label }>Email:</label>
                    <input className={ layoutStyles.input } type="email" placeholder="name@example.com" name="email" value={ user.email } onChange={ handleChange } required/>
                </div>
                <div className={ layoutStyles.formGroup }>
                    <label className={ layoutStyles.Label }>Password:</label>
                    <input className={ layoutStyles.input } type="password" placeholder="********" name="password" value={ user.password } onChange={ handleChange } required/>
                </div>
                <div className={ layoutStyles.formGroup }>
                    <label className={ layoutStyles.Label }>Verify Password:</label>
                    <input className={ layoutStyles.input } type="password" placeholder="********" name="verifyPassword" value={ user.verifyPassword } onChange={ handleChange } required/>
                </div>
                <button type="submit" className={ layoutStyles.btn }>Create Account</button>
                    <p className={ layoutStyles.loginSig }>
                        Already have an account? 
                        <a className={ layoutStyles.aloginSig } href="/signIn">
                            Login here
                        </a>
                    </p>
                </form>
        </div>
    )
}