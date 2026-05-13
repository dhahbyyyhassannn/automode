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

        // Validation
        if (!passwords.oldPassword) {
            setError('Veuillez entrer votre ancien mot de passe');
            return;
        }
        if (!passwords.newPassword) {
            setError('Veuillez entrer un nouveau mot de passe');
            return;
        }
        if (passwords.newPassword.length < 6) {
            setError('Le nouveau mot de passe doit contenir au moins 6 caractères');
            return;
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        setLoading(true);

        try {
            await changePassword({
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword,
                email: user.email
            });
            setMessage('Mot de passe changé avec succès!');
            setPasswords({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            setError('Erreur: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            <h2>Changer le Mot de Passe</h2>
            
            <div className={styles.formGroup}>
                <label htmlFor="oldPassword">Ancien mot de passe:</label>
                <input
                    type="password"
                    id="oldPassword"
                    name="oldPassword"
                    value={passwords.oldPassword}
                    onChange={handleChange}
                    placeholder="Votre ancien mot de passe"
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="newPassword">Nouveau mot de passe:</label>
                <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handleChange}
                    placeholder="Votre nouveau mot de passe"
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirmer le mot de passe:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirmez votre mot de passe"
                />
            </div>

            {message && <p className={styles.successMessage}>{message}</p>}
            {error && <p className={styles.errorMessage}>{error}</p>}

            <button type="submit" disabled={loading} className={styles.submitButton}>
                {loading ? 'Changement en cours...' : 'Changer le mot de passe'}
            </button>
        </form>
    );
}
