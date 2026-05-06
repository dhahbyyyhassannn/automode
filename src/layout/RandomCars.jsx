import layoutStyle from './layoutStyle.module.css';

export default function RandomCars({ cars }) {
    return (
        <div>
            <h2 className={layoutStyle.sectionTitle}>Véhicules</h2>
            <div className={layoutStyle.cardGrid}>
                {cars.map((car) => (
                    <div key={car.matricule} className={layoutStyle.carCard}>
                        <div className={layoutStyle.carImageContainer}>
                            {/* Placeholder ou Image */}
                            <span style={{ color: '#ccc' }}>Image</span>
                        </div>
                        <h3 className={layoutStyle.carTitle}>{car.brand} {car.model}</h3>
                        <p className={layoutStyle.carDetails}>{car.year} • {car.currentMileage} km</p>
                    </div>
                ))}
            </div>
        </div>
    );
}