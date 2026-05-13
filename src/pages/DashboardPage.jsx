import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authAPI from '../api/AuthAPI';
import styles from './page.module.css';
import UserProfileForm from '../layout/UserProfileForm';
import ManageVehicles from '../layout/ManageVehicles';
import ChangePassword from '../layout/ChangePassword';

export default function DashboardPage() {
    const user = authAPI();
    const [activeTab, setActiveTab] = useState('profile');
    const navigate = useNavigate();

    if (!user) {
        return <div className={styles.container}><h2>Veuillez vous connecter</h2></div>;
    }

    return (
        <div className={styles.dashboardPage}>
            <div className={styles.dashboardContainer}>
                <div className={styles.carDetails_backRow}>
                    <button className={styles.dashboardBackButton} onClick={() => navigate('/')}>
                        ← Retour à l'accueil
                    </button>
                </div>
                <div className={styles.dashboardHero}>
                    <p className={styles.dashboardEyebrow}>Espace personnel</p>
                    <h1>Tableau de Bord</h1>
                    <p>Bienvenue, {user.name}!</p>
                </div>

                <div className={styles.tabButtons}>
                    <button 
                        className={activeTab === 'profile' ? styles.activeTab : styles.tabButton}
                        onClick={() => setActiveTab('profile')}
                    >
                        Mon Profil
                    </button>
                    <button 
                        className={activeTab === 'vehicles' ? styles.activeTab : styles.tabButton}
                        onClick={() => setActiveTab('vehicles')}>
                        Mes Voitures
                    </button>
                    <button 
                        className={activeTab === 'password' ? styles.activeTab : styles.tabButton}
                        onClick={() => setActiveTab('password')}>
                        Changer le Mot de Passe
                    </button>
                </div>
                <div className={styles.tabContent}>
                    {activeTab === 'profile' && <UserProfileForm user={user} />}
                    {activeTab === 'vehicles' && <ManageVehicles user={user} />}
                    {activeTab === 'password' && <ChangePassword user={user} />}
                </div>
            </div>
        </div>
    );
}
