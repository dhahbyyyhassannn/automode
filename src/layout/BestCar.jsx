import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authAPI from '../api/AuthAPI';
import { getBestVehicle, getBestVehiclePublic } from '../api/carAPI';
import styles from './bestCar.module.css';

export default function BestCar() {
  const user = authAPI();
  const navigate = useNavigate();
  const [bestCar, setBestCar] = useState(null);
  const [bestCarLoading, setBestCarLoading] = useState(false);
  const [bestCarError, setBestCarError] = useState(null);

  useEffect(() => {
    const loadBestCar = async () => {
      try {
        setBestCarLoading(true);
        setBestCarError(null);
        const data = user ? await getBestVehicle() : await getBestVehiclePublic();
        setBestCar(data);
      } catch (error) {
        setBestCar(null);
        setBestCarError('Unable to load the best vehicle.');
      } finally {
        setBestCarLoading(false);
      }
    };

    loadBestCar();
  }, [user]);

  const formatImage = (img) => {
    if (!img) return null;
    if (typeof img === 'string' && img.startsWith('data:')) return img;
    if (typeof img === 'string' && img.length > 0) return `data:image/jpeg;base64,${img}`;
    return null;
  };

  const bestVehicle = bestCar?.vehicle || null;
  const bestScore = typeof bestCar?.score === 'number' ? bestCar.score : null;

  return (
    <div className={styles.bestCarSection}>
      <h2 className={styles.bestCarTitle}>Best car for you</h2>
      {bestCarLoading && <p>Loading...</p>}
      {bestCarError && <p className={styles.bestCarError}>{bestCarError}</p>}
      {!bestCarLoading && !bestCarError && bestVehicle && (
        <div className={styles.bestCarCard}>
          {formatImage(bestVehicle.image) ? (
            <img
              src={formatImage(bestVehicle.image)}
              alt={`${bestVehicle.brand} ${bestVehicle.model}`}
              className={styles.bestCarImage}
            />
          ) : (
            <div className={styles.bestCarImagePlaceholder} />
          )}
          <div className={styles.bestCarBody}>
            <h3 className={styles.bestCarName}>
              {bestVehicle.brand} {bestVehicle.model}
            </h3>
            <p className={styles.bestCarType}>{bestVehicle.type}</p>
            <p className={styles.bestCarMeta}>License Plate: {bestVehicle.matricule}</p>
            <p className={styles.bestCarMetaRow}>Year: {bestVehicle.year} | Mileage: {bestVehicle.currentMileage}</p>
            {bestScore !== null && (
              <p className={styles.bestCarScore}>
                Score: {(bestScore * 100).toFixed(1)}%
              </p>
            )}
          </div>
          <button
            className={styles.bestCarButton}
            onClick={() => navigate(`/car/${encodeURIComponent(bestVehicle.matricule)}`)}
          >
            View details
          </button>
        </div>
      )}
      {!bestCarLoading && !bestCarError && !bestVehicle && (
        <p>No vehicles available.</p>
      )}
    </div>
  );
}
