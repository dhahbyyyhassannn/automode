import layoutStyle from './layoutStyle.module.css';
import CarCard from '../components/cards/CarCard';
import { useNavigate } from 'react-router-dom';

export default function RandomCars({ cars }) {
    const navigate = useNavigate();
    const carList = Array.isArray(cars) ? cars : cars?.data || [];

    const formatImage = (img) => {
        if (!img) return null;
        // If it's already a data URL, return it as is
        if (typeof img === 'string' && img.startsWith('data:')) {
            return img;
        }
        // If it's a base64 string, add the data URL prefix
        if (typeof img === 'string' && img.length > 0) {
            return `data:image/jpeg;base64,${img}`;
        }
        return null;
    };

    return (
        <div>
            <h2 className={layoutStyle.sectionTitle}>Vehicles</h2>
            <div className={layoutStyle.cardGrid}>
                {carList.length === 0 ? (
                    <p className={layoutStyle.noResults}>No vehicles found.</p>
                ) : (
                    carList.map((car) => (
                        <CarCard
                            key={car.matricule}
                            matricule={car.matricule}
                            brand={car.brand}
                            model={car.model}
                            type={car.type}
                            image={formatImage(car.image)}
                            onClick={() => navigate(`/car/${encodeURIComponent(car.matricule)}`)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
