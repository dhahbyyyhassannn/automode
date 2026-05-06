import { useState } from 'react';
import layoutStyles from './layoutStyle.module.css';
import FuelExpenseForm from './FuelExpenseForm';
import OilChangeExpenseForm from './OilChangeExpenseForm';
import RepairExpenseForm from './RepairExpenseForm';

export default function AddCarForm() {
    const [step, setStep] = useState(0);

    const handleVehicleSubmit = (event) => {
        event.preventDefault();
        setStep(1);
    };

    return (
        <div className={layoutStyles.signInContainer}>
            <h2 className={layoutStyles.formTitle}>Add Vehicle</h2>
            <div className={layoutStyles.stepIndicator}>Step {step + 1} of 4</div>

            {step === 0 && (
                <form onSubmit={handleVehicleSubmit}>
                    <div className={layoutStyles.formGroup}>
                        <label className={layoutStyles.Label}>Matricule:</label>
                        <input className={layoutStyles.input} type="text" placeholder="Vehicle registration number" name="matricule" required />
                    </div>

                    <div className={layoutStyles.formGroup}>
                        <label className={layoutStyles.Label}>Brand:</label>
                        <input className={layoutStyles.input} type="text" placeholder="BMW, Mercedes, Toyota" name="brand" required />
                    </div>

                    <div className={layoutStyles.formGroup}>
                        <label className={layoutStyles.Label}>Model:</label>
                        <input className={layoutStyles.input} type="text" placeholder="X5, G-Class, Camry" name="model" required />
                    </div>

                    <div className={layoutStyles.formGroup}>
                        <label className={layoutStyles.Label}>Type:</label>
                        <input className={layoutStyles.input} type="text" placeholder="SUV, Sedan, Truck" name="type" required />
                    </div>

                    <div className={layoutStyles.formGroup}>
                        <label className={layoutStyles.Label}>Year:</label>
                        <input className={layoutStyles.input} type="number" name="year" required />
                    </div>

                    <div className={layoutStyles.formGroup}>
                        <label className={layoutStyles.Label}>Current Mileage (km):</label>
                        <input className={layoutStyles.input} type="number" placeholder="50000" name="currentMileage" required />
                    </div>

                    <div className={layoutStyles.formGroup}>
                        <label className={layoutStyles.Label}>Vehicle Images:</label>
                        <input className={layoutStyles.input} type="file" name="images" accept="image/*" />
                    </div>

                    <button type="submit" className={layoutStyles.btn}>Next: Fuel expense</button>
                </form>
            )}

            {step === 1 && <FuelExpenseForm onBack={() => setStep(0)} onNext={() => setStep(2)} />}
            {step === 2 && <OilChangeExpenseForm onBack={() => setStep(1)} onNext={() => setStep(3)} />}
            {step === 3 && <RepairExpenseForm onBack={() => setStep(2)} />}
        </div>
    );
}
