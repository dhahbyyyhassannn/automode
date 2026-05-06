import layoutStyles from './layoutStyle.module.css';

export default function OilChangeExpenseForm({ onBack, onNext }) {
    const handleSubmit = (event) => {
        event.preventDefault();
        onNext();
    };

    return (
        <form className={layoutStyles.formCard} onSubmit={handleSubmit}>
            <h3 className={layoutStyles.sectionTitle}>Oil change expense</h3>

            <div className={layoutStyles.formGrid}>
                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Cost:</label>
                    <input className={layoutStyles.input} type="number" step="0.01" name="oilCost" required />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Mileage at service:</label>
                    <input className={layoutStyles.input} type="number" name="oilMileageAtService" required />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Oil type:</label>
                    <input className={layoutStyles.input} type="text" name="oilType" placeholder="5W-30, 10W-40" required />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Next change miles:</label>
                    <input className={layoutStyles.input} type="number" name="oilNextChangeMiles" required />
                </div>
            </div>

            <div className={layoutStyles.formActions}>
                <button type="button" className={layoutStyles.secondaryAction} onClick={onBack}>Back</button>
                <button type="submit" className={layoutStyles.btn}>Next: Repair expense</button>
            </div>
        </form>
    );
}