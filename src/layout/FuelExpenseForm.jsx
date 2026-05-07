import layoutStyles from './layoutStyle.module.css';

export default function FuelExpenseForm({ onBack, onNext }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onNext();
    };

    return (
        <form className={layoutStyles.formCard} onSubmit={handleSubmit}>
            <h3 className={layoutStyles.sectionTitle}>Fuel expense</h3>

            <div className={layoutStyles.formGrid}>
                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Cost:</label>
                    <input className={layoutStyles.input} type="number" step="0.01" name="fuelCost" required />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Mileage at service:</label>
                    <input className={layoutStyles.input} type="number" name="fuelMileageAtService" required />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Liters:</label>
                    <input className={layoutStyles.input} type="number" step="0.01" name="liters" required />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Price per litre:</label>
                    <input className={layoutStyles.input} type="number" step="0.01" name="pricePerLitre" required />
                </div>
            </div>

            <div className={layoutStyles.formActions}>
                <button type="button" className={layoutStyles.secondaryAction} onClick={onBack}>Back</button>
                <button type="submit" className={layoutStyles.btn}>Next: Oil change</button>
            </div>
        </form>
    );
}