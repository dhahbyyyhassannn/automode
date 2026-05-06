import layoutStyle from './layoutStyle.module.css';

export default function SearchResults({ cars }) {
    return (
        <div>
            <h2 className={layoutStyle.sectionTitle}>Résultats de recherche</h2>
            <div className={layoutStyle.cardGrid}>
                {cars.length > 0 ? (
                    cars.map((car) => (
                        <div key={car.matricule} className={layoutStyle.carCard}>
                            <div className={layoutStyle.carImageContainer}>
                                <span style={{ color: '#ccc' }}>Image</span>
                            </div>
                            <h3 className={layoutStyle.carTitle}>{car.brand} {car.model}</h3>
                            <p className={layoutStyle.carDetails}>{car.year} • {car.currentMileage} km</p>
                            <button className={layoutStyle.btn}>Voir détails</button>
                        </div>
                    ))
                ) : (
                    <p className={layoutStyle.noResults}>Aucun véhicule trouvé.</p>
                )}
            </div>
        </div>
    );
}