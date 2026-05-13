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
            setMessage('Profil mis à jour avec succès!');
        } catch (err) {
            setError('Erreur lors de la mise à jour: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            <h2>Mes Informations</h2>
            
            <div className={styles.formGroup}>
                <label htmlFor="name">Nom:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom"
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
                    placeholder="Votre email"
                />
            </div>
            {message && <p className={styles.successMessage}>{message}</p>}
            {error && <p className={styles.errorMessage}>{error}</p>}
            <button type="submit" disabled={loading} className={styles.submitButton}>
                {loading ? 'Mise à jour...' : 'Enregistrer les modifications'}
            </button>
        </form>
    );
}
