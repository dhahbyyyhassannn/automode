import layoutStyle from './layoutStyle.module.css';
import CarCard from '../components/cards/CarCard';
import { useNavigate } from 'react-router-dom';

export default function RandomCars({ cars }) {
    const navigate = useNavigate();
    const formatImage = (img) => {
        if (!img) return null;
        if (typeof img === 'string') {
            return img.startsWith('data:') ? img : `data:image/jpeg;base64,${img}`;
        }
        return null;
    };

    return (
        <div>
            <h2 className={layoutStyle.sectionTitle}>Véhicules</h2>
            <div className={layoutStyle.cardGrid}>
                {cars.data == null ? (
                    <p className={layoutStyle.noResults}>Aucun véhicule trouvé.</p>
                ) : (
                    cars.data.map((car) => (
                        <CarCard
                            key={car.matricule}
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