import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import layoutStyles from './layoutStyle.module.css';
import { AddOilChangeExpenses } from '../api/oilChangeExpensesAPI';
import Swal from 'sweetalert2';

export default function OilChangeExpenseForm({ matricule, onBack, onNext }) {
    const location = useLocation();
    const navigate = useNavigate();
    const effectiveMatricule = matricule || location.state?.matricule;
    const [oilChangeExpense, setOilChangeExpense] = useState({
        cost: '',
        mileageAtService: '',
        oilType: '',
        nextChangeMiles: '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setOilChangeExpense((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!effectiveMatricule) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Missing vehicle matricule.' });
            return;
        }

        try {
            await AddOilChangeExpenses(effectiveMatricule, oilChangeExpense);
            Swal.fire({ icon: 'success', title: 'Success', text: 'Oil change expense added successfully!' });
            if (onNext) {
                onNext();
            } else {
                navigate('/repairform', { state: { matricule: effectiveMatricule } });
            }
        } catch (error) {
            console.error('Error adding oil change expense:', error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to add oil change expense.' });
        }
    };

    return (
        <form className={layoutStyles.formCard} onSubmit={handleSubmit}>
            <h3 className={layoutStyles.sectionTitle}>Oil change expense</h3>

            <div className={layoutStyles.formGrid}>
                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Cost:</label>
                    <input className={layoutStyles.input} type="number" step="0.01" name="cost" value={oilChangeExpense.cost} onChange={handleChange} required />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Mileage at service:</label>
                    <input className={layoutStyles.input} type="number" name="mileageAtService" value={oilChangeExpense.mileageAtService} onChange={handleChange} required />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Oil type:</label>
                    <input className={layoutStyles.input} type="text" name="oilType" value={oilChangeExpense.oilType} onChange={handleChange} placeholder="5W-30, 10W-40" required />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Next change miles:</label>
                    <input className={layoutStyles.input} type="number" name="nextChangeMiles" value={oilChangeExpense.nextChangeMiles} onChange={handleChange} required />
                </div>
            </div>

            <div className={layoutStyles.formActions}>
                <button type="button" className={layoutStyles.secondaryAction} onClick={onBack || (() => navigate(-1))}>Back</button>
                <button type="submit" className={layoutStyles.btn}>Next: Repair expense</button>
            </div>
        </form>
    );
}
