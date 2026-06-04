
import { useLocation } from 'react-router-dom';
import FuelExpenseForm from "../layout/FuelExpenseForm";
import HeaderMenu from "../layout/HeaderMenu";
import pageStyles from './page.module.css';
export default function AddFuelExpensesPage() {
    const location = useLocation();
    const matricule = location.state?.matricule;

    return (
        <div>
            <HeaderMenu />
            <div className={ pageStyles.pageWrapper }>
                {!matricule ? (
                    <div>Matricule manquant. Veuillez démarrer depuis l'ajout du véhicule.</div>
                ) : (
                    <FuelExpenseForm matricule={matricule} />
                )}
            </div>
            
        </div>
    )
}