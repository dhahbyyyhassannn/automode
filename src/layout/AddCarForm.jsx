import { useState } from 'react';
import layoutStyles from './layoutStyle.module.css';
import FuelExpenseForm from './FuelExpenseForm';
import OilChangeExpenseForm from './OilChangeExpenseForm';
import RepairExpenseForm from './RepairExpenseForm';
import { AddCar } from '../api/carAPI';
import Swal from 'sweetalert2';

export default function AddCarForm({ onSuccess }) {
    const steps = ['Vehicle', 'Fuel', 'Oil', 'Repair'];
    const [activeStep, setActiveStep] = useState('vehicle');
    const [savedMatricule, setSavedMatricule] = useState('');
    const [vehicle, setVehicle] = useState({
        matricule: '',
        brand: '',
        model: '',
        type: '',
        year: '',
        currentMileage: '',
        image: null
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setVehicle({
            ...vehicle,
            [name]: files ? files[0] : value
        });
    }

    const handleVehicleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            formData.append("matricule", vehicle.matricule);
            formData.append("brand", vehicle.brand);
            formData.append("model", vehicle.model);
            formData.append("type", vehicle.type);
            formData.append("year", vehicle.year);
            formData.append("currentMileage", vehicle.currentMileage);

            if (vehicle.image) {
                formData.append("image", vehicle.image);
            }
            const response = await AddCar(formData);
            setSavedMatricule(response.data?.matricule || vehicle.matricule);
            setActiveStep('fuel');
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Vehicle added. Add the first fuel expense next.',
            });
        
        } catch (error) {
            console.error("Error adding car:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add vehicle.',
            });
        }
        
    };

    const handleFinalSubmit = () => {
        setVehicle({
            matricule: '',
            brand: '',
            model: '',
            type: '',
            year: '',
            currentMileage: '',
            image: null
        });
        setSavedMatricule('');
        setActiveStep('vehicle');

        if (onSuccess) {
            onSuccess();
        }
    };

    const activeStepIndex = steps.findIndex((step) => step.toLowerCase() === activeStep);

    return (
        <div className={layoutStyles.setupShell}>
            <div className={layoutStyles.setupHeader}>
                <p className={layoutStyles.eyebrow}>Vehicle onboarding</p>
                <h2 className={layoutStyles.formTitle}>Add Vehicle</h2>
                <div className={layoutStyles.stepper}>
                    {steps.map((step, index) => (
                        <span
                            key={step}
                            className={`${layoutStyles.stepPill} ${index <= activeStepIndex ? layoutStyles.stepPillActive : ''}`}
                        >
                            {index + 1}. {step}
                        </span>
                    ))}
                </div>
            </div>

            {activeStep === 'vehicle' && (
                <div className={layoutStyles.signInContainer}>
            <h2 className={layoutStyles.formTitle}>Add Vehicle</h2>
            <form onSubmit={handleVehicleSubmit}>
                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Matricule:</label>
                    <input className={layoutStyles.input} type="text" placeholder="Vehicle registration number" name="matricule" onChange={handleChange} required />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Brand:</label>
                    <input className={layoutStyles.input} type="text" placeholder="BMW, Mercedes, Toyota" name="brand" onChange={handleChange} required />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Model:</label>
                    <input className={layoutStyles.input} type="text" placeholder="X5, G-Class, Camry" name="model" onChange={handleChange} required />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Type:</label>
                    <input className={layoutStyles.input} type="text" placeholder="SUV, Sedan, Truck" name="type" onChange={handleChange} required />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Year:</label>
                    <input className={layoutStyles.input} type="number" min="1900" max="2100" name="year" onChange={handleChange} required />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Current Mileage (km):</label>
                    <input className={layoutStyles.input} type="number" min="0" placeholder="50000" name="currentMileage" onChange={handleChange} required />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Vehicle Images:</label>
                    <input className={layoutStyles.input} type="file" name="image" accept="image/*" onChange={handleChange} />
                </div>

                <button type="submit" className={layoutStyles.btn }>Submit Vehicle</button>
            </form>
                </div>
            )}

            {activeStep === 'fuel' && (
                <FuelExpenseForm
                    matricule={savedMatricule}
                    onBack={() => setActiveStep('vehicle')}
                    onNext={() => setActiveStep('oil')}
                />
            )}

            {activeStep === 'oil' && (
                <OilChangeExpenseForm
                    matricule={savedMatricule}
                    onBack={() => setActiveStep('fuel')}
                    onNext={() => setActiveStep('repair')}
                />
            )}

            {activeStep === 'repair' && (
                <RepairExpenseForm
                    matricule={savedMatricule}
                    onBack={() => setActiveStep('oil')}
                    onSubmit={handleFinalSubmit}
                />
            )}
        </div>
    );
}
