import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import pageStyles from './page.module.css';
import { getCar } from '../api/carAPI';
import ExpenseDetails from './ExpenseDetails';
import HeaderMenu from '../layout/HeaderMenu';

export default function CarDetails() {
  const { matricule } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);

  useEffect(() => {
    if (!matricule) return;

    const load = async () => {
      try {
        const res = await getCar(matricule);
        setCar(res);
      } catch (e) {
        console.error('Failed to load car', e);
        setCar(null);
      }
    };

    load();
  }, [matricule]);

  if (!car) {
    return (
      <>
        <HeaderMenu />
        <div className={pageStyles.pageWrapper}>
          <div className={pageStyles.carDetails_notFound}>
            <h2>Vehicle not found</h2>
            <button className={pageStyles.btn} onClick={() => navigate(-1)}>Back</button>
          </div>
        </div>
      </>
    );
  }

  const image = car.image && typeof car.image === 'string' && !car.image.startsWith('data:')
    ? `data:image/jpeg;base64,${car.image}`
    : car.image;

  return (
    <>
      <HeaderMenu />
      <div className={pageStyles.carDetails_container}>
        <div className={pageStyles.carDetails_backRow}>
          <button className={pageStyles.btn} onClick={() => navigate(-1)}>Back</button>
        </div>

        <div className={pageStyles.carDetails_hero}>
          {image ? (
            <img src={image} alt={`${car.brand} ${car.model}`} className={pageStyles.carDetails_heroImage} />
          ) : (
            <div className={pageStyles.carDetails_heroPlaceholder}>No image</div>
          )}
        </div>

        <div className={pageStyles.carDetails_detailsCard}>
          <h1 className={pageStyles.carDetails_title}>{car.brand} {car.model}</h1>
          <p className={pageStyles.carDetails_type}>{car.type}</p>

          <div className={pageStyles.carDetails_infoGrid}>
            <div className={pageStyles.carDetails_infoItem}>
              <span className={pageStyles.carDetails_infoLabel}>Matricule</span>
              <span className={pageStyles.carDetails_infoValue}>{car.matricule}</span>
            </div>
            <div className={pageStyles.carDetails_infoItem}>
              <span className={pageStyles.carDetails_infoLabel}>Year</span>
              <span className={pageStyles.carDetails_infoValue}>{car.year}</span>
            </div>
            <div className={pageStyles.carDetails_infoItem}>
              <span className={pageStyles.carDetails_infoLabel}>Mileage</span>
              <span className={pageStyles.carDetails_infoValue}>{car.currentMileage} km</span>
            </div>
            <div className={pageStyles.carDetails_infoItem}>
              <span className={pageStyles.carDetails_infoLabel}>Owner</span>
              <span className={pageStyles.carDetails_infoValue}>{car.user?.name || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className={pageStyles.carDetailsExpensePanel}>
          <ExpenseDetails matricule={matricule} />
        </div>
      </div>
    </>
  );
}
