import { useState } from 'react';
import layoutStyles from './layoutStyle.module.css';
import FuelExpenseForm from './FuelExpenseForm';
import OilChangeExpenseForm from './OilChangeExpenseForm';
import RepairExpenseForm from './RepairExpenseForm';
import { AddCar } from '../api/carAPI';
import Swal from 'sweetalert2';
import { useNavigate, useNavigation } from 'react-router-dom';

export default function AddCarForm() {
    const navigation = useNavigate();
    const [step, setStep] = useState(0);
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
            await AddCar(formData);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Vehicle added successfully!',
            });
            navigation("/fuelForm");
        } catch (error) {
            console.error("Error adding car:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add vehicle.',
            });
        }
        
    };

    const handleFinalSubmit = async () => {
        Swal.fire({
            icon: 'success',
            title: 'Done',
            text: 'All expenses submitted successfully!',
        });
        setStep(0);
        setVehicle({
            matricule: '',
            brand: '',
            model: '',
            type: '',
            year: '',
            currentMileage: '',
            image: null
        });
    };

    return (
        <div className={layoutStyles.signInContainer}>
            <h2 className={layoutStyles.formTitle}>Add Vehicle</h2>
            <div className={layoutStyles.stepIndicator}>Step {step + 1} of 4</div>

            {step === 0 && (
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
                        <input className={layoutStyles.input} type="number" name="year" onChange={handleChange} required />
                    </div>

                    <div className={layoutStyles.formGroup}>
                        <label className={layoutStyles.Label}>Current Mileage (km):</label>
                        <input className={layoutStyles.input} type="number" placeholder="50000" name="currentMileage" onChange={handleChange} required />
                    </div>

                    <div className={layoutStyles.formGroup}>
                        <label className={layoutStyles.Label}>Vehicle Images:</label>
                        <input className={layoutStyles.input} type="file" name="images" accept="image/*" onChange={handleChange} />
                    </div>

                    <button type="submit" className={layoutStyles.btn }>Next: Fuel expense</button>
                </form>
            )}

            {step === 1 && <FuelExpenseForm onBack={() => setStep(0)} onNext={() => setStep(2)} />}
            {step === 2 && <OilChangeExpenseForm onBack={() => setStep(1)} onNext={() => setStep(3)} />}
            {step === 3 && <RepairExpenseForm onBack={() => setStep(2)} onSubmit={handleFinalSubmit} />}
        </div>
    );
}
