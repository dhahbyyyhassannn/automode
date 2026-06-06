import { useState } from 'react';
import layoutStyles from './layoutStyle.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { AddFuelExpenses } from "../api/fuelExpensesAPI";
import Swal from 'sweetalert2';


export default function FuelExpenseForm({ matricule, onBack, onNext }) {
    const location = useLocation();
    const effectiveMatricule = matricule || location.state?.matricule;
    console.log("=== FORM DEBUG ===");
    console.log("Received license plate value:", effectiveMatricule);
    const navigation = useNavigate();
    const [fuelExpenses, setFuelExpenses] = useState({
        cost: '',
        mileageAtService: '',
        liters: '',
        pricePerLitre: '',
        estimatedMilesPerLiter: ''
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
        if (!effectiveMatricule) {
            console.error("Missing license plate for fuel expense submission.");
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "License plate missing for recording."
            });
            return;
        }
        try {
            const expenseData = {
                ...fuelExpenses,
                date: new Date().toISOString().split('T')[0] // Format YYYY-MM-DD
            };
            await AddFuelExpenses(effectiveMatricule, expenseData);
            if (onNext) {
                onNext();
            } else {
                navigation('/oilChange', { state: { matricule: effectiveMatricule } });
            }
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Fuel expenses added successfully!"
            });
        }
        catch (error) {
            console.error("Error adding fuel expenses:", error);
            const errorMessage = error.response?.data || error.message || 'Failed to add fuel expenses.';
            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMessage
            });
        }
    };

    return (
        <form className={layoutStyles.formCard} onSubmit={handleSubmit}>
            <h3 className={layoutStyles.sectionTitle}>Fuel expense</h3>

            <div className={layoutStyles.formGrid}>
                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Cost:</label>
                    <input className={layoutStyles.input} type="number" step="0.01" min="0" name="cost" onChange={handleChange} required />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Mileage at service:</label>
                    <input className={layoutStyles.input} type="number" min="0" name="mileageAtService" onChange={handleChange} required />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Liters:</label>
                    <input className={layoutStyles.input} type="number" step="0.01" min="0" name="liters" onChange={handleChange} required />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Price per litre:</label>
                    <input className={layoutStyles.input} type="number" step="0.01" min="0" name="pricePerLitre" onChange={handleChange} required />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Est. Miles per Liter:</label>
                    <input className={layoutStyles.input} type="number" step="0.01" min="0" name="estimatedMilesPerLiter" onChange={handleChange} required />
                </div>
            </div>


            <div className={layoutStyles.formActions}>
                <button type="button" className={layoutStyles.secondaryAction} onClick={onBack || (() => navigation(-1))}>Back</button>
                <button type="submit" className={layoutStyles.btn}>Next: Oil change</button>
            </div>
        </form>
    );
}
