import { useState } from 'react';
import layoutStyles from './layoutStyle.module.css';

const createRepairExpense = () => ({
    description: '',
    nextChangeMiles: '',
});

export default function RepairExpenseForm({ onBack }) {
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

    return (
        <form className={layoutStyles.formCard} onSubmit={(event) => event.preventDefault()}>
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
                            <input className={layoutStyles.input} type="number" step="0.01" name={`repairCost-${index}`} required />
                        </div>

                        <div className={layoutStyles.formGroup}>
                            <label className={layoutStyles.Label}>Mileage at service:</label>
                            <input className={layoutStyles.input} type="number" name={`repairMileageAtService-${index}`} required />
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