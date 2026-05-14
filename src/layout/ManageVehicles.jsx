import { useState, useEffect } from 'react';
import { getUserVehicles, deleteVehicle } from '../api/carAPI';
import AddCarForm from './AddCarForm';
import styles from './layoutStyle.module.css';

export default function ManageVehicles({ user }) {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const data = await getUserVehicles();
            setVehicles(Array.isArray(data) ? data : []);
            setError('');
        } catch (err) {
            setError('Erreur lors du chargement des voitures: ' + (err.response?.data?.message || err.message));
            setVehicles([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSuccess = () => {
        setMessage('Voiture ajoutée avec succès!');
        setShowForm(false);
        setTimeout(() => {
            fetchVehicles();
            setMessage('');
        }, 500);
    };

    const handleDelete = async (vehicleMatricule) => {
        // Use the matricule for the confirmation message to be sure
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la voiture avec matricule: ${vehicleMatricule}?`)) {
            return;
        }

        try {
            await deleteVehicle(vehicleMatricule);
            setMessage('Voiture supprimée avec succès!');
            fetchVehicles();
        } catch (err) {
            setError('Erreur lors de la suppression: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className={styles.vehiclesContainer}>
            <h2>Mes Voitures</h2>

            {message && <p className={styles.successMessage}>{message}</p>}
            {error && <p className={styles.errorMessage}>{error}</p>}

            <button 
                onClick={() => setShowForm(!showForm)}
                className={styles.submitButton}
                style={{ marginBottom: '20px' }}
            >
                {showForm ? 'Annuler' : 'Ajouter une voiture'}
            </button>

            {showForm && (
                <AddCarForm 
                    onSuccess={handleAddSuccess}
                    isDashboard={true}
                />
            )}

            {loading ? (
                <p>Chargement des voitures...</p>
            ) : vehicles.length === 0 ? (
                <p>Vous n'avez pas encore de voiture.</p>
            ) : (
                <div className={styles.vehiclesList}>
                    {Array.isArray(vehicles) && vehicles.map((vehicle) => (
                        <div key={vehicle.matricule} className={styles.vehicleCard}>
                            <h3>{vehicle.brand} {vehicle.model}</h3>
                            <p><strong>Matricule:</strong> {vehicle.matricule}</p>
                            <p><strong>Année:</strong> {vehicle.year}</p>
                            <p><strong>Couleur:</strong> {vehicle.color}</p>
                            <div className={styles.vehicleActions}>
                                <button 
                                    onClick={() => handleDelete(vehicle.matricule)}
                                    className={styles.deleteButton}
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}