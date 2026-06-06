import { useState } from 'react';
import { updateUser } from '../api/userAPI';
import styles from './layoutStyle.module.css';

export default function UserProfileForm({ user }) {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
        await updateUser(formData);
            setMessage('Profile updated successfully!');
        } catch (err) {
            setError('Error updating profile: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            <h2>My Information</h2>
            
            <div className={styles.formGroup}>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email"
                />
            </div>
            {message && <p className={styles.successMessage}>{message}</p>}
            {error && <p className={styles.errorMessage}>{error}</p>}
            <button type="submit" disabled={loading} className={styles.submitButton}>
                {loading ? 'Updating...' : 'Save Changes'}
            </button>
        </form>
    );
}
