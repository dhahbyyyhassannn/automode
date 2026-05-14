import { useState } from 'react';
import layoutStyles from './layoutStyle.module.css';
import { useNavigate } from 'react-router-dom';
import { AddFuelExpenses } from "../api/fuelExpensesAPI";
import Swal from 'sweetalert2';


export default function FuelExpenseForm({ matricule, onBack, onNext }) {
    console.log("=== DÉBOGAGE FORMULAIRE ===");
    console.log("Valeur de matricule reçue :", matricule);
    const navigation = useNavigate();
    const [fuelExpenses, setFuelExpenses] = useState({
        cost: '',
        MileageAtService: '',
        liters: '',
        pricePerLitre: ''
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFuelExpenses({
            ...fuelExpenses,
            [name]: value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
             await AddFuelExpenses(matricule, fuelExpenses);
            navigation('/oilChange');
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Fuel expenses added successfully!"
            });
        }
        catch (error) {
            console.error("Error adding fuel expenses:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to add fuel expenses."
            });
        }
    };

    return (
        <form className={layoutStyles.formCard} onSubmit={handleSubmit}>
            <h3 className={layoutStyles.sectionTitle}>Fuel expense</h3>

            <div className={layoutStyles.formGrid}>
                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Cost:</label>
                    <input className={layoutStyles.input} type="number" step="0.01" name="cost" onChange={handleChange} required />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Mileage at service:</label>
                    <input className={layoutStyles.input} type="number" name="MileageAtService" onChange={handleChange} required />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Liters:</label>
                    <input className={layoutStyles.input} type="number" step="0.01" name="liters" onChange={handleChange} required />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Price per litre:</label>
                    <input className={layoutStyles.input} type="number" step="0.01" name="pricePerLitre" onChange={handleChange} required />
                </div>
            </div>

            <div className={layoutStyles.formActions}>
                <button type="button" className={layoutStyles.secondaryAction} onClick={() => navigation(-1)}>Back</button>
                <button type="submit" className={layoutStyles.btn}>Next: Oil change</button>
            </div>
        </form>
    );
}