import HeaderMenu from "../layout/HeaderMenu";
import AddCarForm from "../layout/AddCarForm";
import pageStyles from './page.module.css';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AddCarPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Accès refusé',
                text: "Vous ne pouvez pas ajouter une voiture sans créer un compte ou vous connecter.",
                confirmButtonText: 'Aller à la connexion'
            }).then(() => {
                navigate('/signin');
            });
        }
    }, [navigate]);

    if (!localStorage.getItem('token')) {
        return null;
    }

    return (
        <div>
            <HeaderMenu />
            <div className={pageStyles.pageWrapper}>
                <AddCarForm onSuccess={() => navigate('/myCars')} />
            </div>
        </div>
    )
}
