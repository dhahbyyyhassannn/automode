import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import layoutStyles from './layoutStyle.module.css';
import { AddRepairExpenses } from '../api/repairExpensesAPI';
import Swal from 'sweetalert2';

const createRepairExpense = () => ({
    cost: '',
    mileageAtService: '',
    description: '',
    nextChangeMiles: '',
});

export default function RepairExpenseForm({ matricule, onBack, onSubmit }) {
    const location = useLocation();
    const navigate = useNavigate();
    const effectiveMatricule = matricule || location.state?.matricule;
    const [repairExpenses, setRepairExpenses] = useState([createRepairExpense()]);

    const addRepairExpense = () => {
        setRepairExpenses((currentExpenses) => [...currentExpenses, createRepairExpense()]);
    };

    const removeRepairExpense = (indexToRemove) => {
        setRepairExpenses((currentExpenses) => currentExpenses.filter((_, index) => index !== indexToRemove));
    };

    const updateRepairExpense = (indexToUpdate, field, value) => {
        setRepairExpenses((currentExpenses) =>
            currentExpenses.map((expense, index) =>
                index === indexToUpdate ? { ...expense, [field]: value } : expense
            )
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!effectiveMatricule) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Missing vehicle matricule.' });
            return;
        }

        try {
            await Promise.all(repairExpenses.map((expense) => {
                const expenseData = {
                    ...expense,
                    date: new Date().toISOString().split('T')[0]
                };
                return AddRepairExpenses(effectiveMatricule, expenseData);
            }));
            Swal.fire({ icon: 'success', title: 'Setup complete', text: 'Repair expense saved successfully!' });
            if (onSubmit) {
                onSubmit(repairExpenses);
            } else {
                navigate('/myCars');
            }
        } catch (error) {
            console.error('Error adding repair expenses:', error);
            const errorMessage = error.response?.data || error.message || 'Failed to add repair expenses.';
            Swal.fire({ icon: 'error', title: 'Error', text: errorMessage });
        }
    };

    return (
        <form className={layoutStyles.formCard} onSubmit={handleSubmit}>
            <div className={layoutStyles.sectionHeaderRow}>
                <h3 className={layoutStyles.sectionTitle}>Repair expense</h3>
                <button type="button" className={layoutStyles.secondaryBtn} onClick={addRepairExpense}>
                    Add another repair expense
                </button>
            </div>

            {repairExpenses.map((expense, index) => (
                <div key={index} className={layoutStyles.repeatableExpenseCard}>
                    <div className={layoutStyles.repeatableExpenseHeader}>
                        <span className={layoutStyles.repeatableExpenseIndex}>Repair #{index + 1}</span>
                        {repairExpenses.length > 1 && (
                            <button
                                type="button"
                                className={layoutStyles.linkBtn}
                                onClick={() => removeRepairExpense(index)}
                            >
                                Remove
                            </button>
                        )}
                    </div>

                    <div className={layoutStyles.formGrid}>
                        <div className={layoutStyles.formGroup}>
                            <label className={layoutStyles.Label}>Cost:</label>
                            <input
                                className={layoutStyles.input}
                                type="number"
                                step="0.01"
                                min="0"
                                name={`repairCost-${index}`}
                                value={expense.cost}
                                onChange={(event) => updateRepairExpense(index, 'cost', event.target.value)}
                                required
                            />
                        </div>

                        <div className={layoutStyles.formGroup}>
                            <label className={layoutStyles.Label}>Mileage at service:</label>
                            <input
                                className={layoutStyles.input}
                                type="number"
                                min="0"
                                name={`repairMileageAtService-${index}`}
                                value={expense.mileageAtService}
                                onChange={(event) => updateRepairExpense(index, 'mileageAtService', event.target.value)}
                                required
                            />
                        </div>

                        <div className={layoutStyles.formGroup}>
                            <label className={layoutStyles.Label}>Description:</label>
                            <input
                                className={layoutStyles.input}
                                type="text"
                                name={`repairDescription-${index}`}
                                value={expense.description}
                                onChange={(event) => updateRepairExpense(index, 'description', event.target.value)}
                                placeholder="Brake pads, battery, tires..."
                                required
                            />
                        </div>

                        <div className={layoutStyles.formGroup}>
                            <label className={layoutStyles.Label}>Next change miles:</label>
                            <input
                                className={layoutStyles.input}
                                type="number"
                                min="0"
                                name={`repairNextChangeMiles-${index}`}
                                value={expense.nextChangeMiles}
                                onChange={(event) => updateRepairExpense(index, 'nextChangeMiles', event.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>
            ))}
            <div className={layoutStyles.formActions}>
                <button type="button" className={layoutStyles.secondaryAction} onClick={onBack}>Back</button>
                <button type="submit" className={layoutStyles.btn}>Submit all</button>
            </div>
        </form>
    );
}
