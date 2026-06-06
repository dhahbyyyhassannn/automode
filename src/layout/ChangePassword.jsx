import { useState } from 'react';
import { changePassword } from '../api/userAPI';
import styles from './layoutStyle.module.css';

export default function ChangePassword({ user }) {
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        // Validation,
        if (!passwords.oldPassword) {
            setError('Please enter your old password');
            return;
        }
        if (!passwords.newPassword) {
            setError('Please enter a new password');
            return;
        }
        if (passwords.newPassword.length < 6) {
            setError('New password must be at least 6 characters long');
            return;
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await changePassword({
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword,
                email: user.email
            });
            setMessage('Password changed successfully!');
            setPasswords({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            setError('Error: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            <h2>Change Password</h2>
            
            <div className={styles.formGroup}>
                <label htmlFor="oldPassword">Old Password:</label>
                <input
                    type="password"
                    id="oldPassword"
                    name="oldPassword"
                    value={passwords.oldPassword}
                    onChange={handleChange}
                    placeholder="Your old password"
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="newPassword">New Password:</label>
                <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handleChange}
                    placeholder="Your new password"
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                />
            </div>

            {message && <p className={styles.successMessage}>{message}</p>}
            {error && <p className={styles.errorMessage}>{error}</p>}

            <button type="submit" disabled={loading} className={styles.submitButton}>
                {loading ? 'Changing...' : 'Change Password'}
            </button>
        </form>
    );
}
