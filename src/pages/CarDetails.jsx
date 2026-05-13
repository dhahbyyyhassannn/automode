import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import layoutStyle from './page.module.css';
import { getCar } from '../api/carAPI';

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
      <div className={layoutStyle.pageWrapper}>
        <div className={layoutStyle.carDetails_notFound}>
          <h2>Véhicule introuvable</h2>
          <button className={layoutStyle.btn} onClick={() => navigate(-1)}>Retour</button>
        </div>
      </div>
    );
  }

  const image = car.image && typeof car.image === 'string' && !car.image.startsWith('data:')
    ? `data:image/jpeg;base64,${car.image}`
    : car.image;

  return (
    <div className={layoutStyle.carDetails_container}>
      <div className={layoutStyle.carDetails_backRow}>
        <button className={layoutStyle.btn} onClick={() => navigate(-1)}>← Retour</button>
      </div>

      <div className={layoutStyle.carDetails_hero}>
        {image ? (
          <img src={image} alt={`${car.brand} ${car.model}`} className={layoutStyle.carDetails_heroImage} />
        ) : (
          <div className={layoutStyle.carDetails_heroPlaceholder}>Aucune image</div>
        )}
      </div>

      <div className={layoutStyle.carDetails_detailsCard}>
        <h1 className={layoutStyle.carDetails_title}>{car.brand} {car.model}</h1>
        <p className={layoutStyle.carDetails_type}>{car.type}</p>

        <div className={layoutStyle.carDetails_infoGrid}>
          <div className={layoutStyle.carDetails_infoItem}><span className={layoutStyle.carDetails_infoLabel}>Matricule</span><span className={layoutStyle.carDetails_infoValue}>{car.matricule}</span></div>
          <div className={layoutStyle.carDetails_infoItem}><span className={layoutStyle.carDetails_infoLabel}>Année</span><span className={layoutStyle.carDetails_infoValue}>{car.year}</span></div>
          <div className={layoutStyle.carDetails_infoItem}><span className={layoutStyle.carDetails_infoLabel}>Kilométrage</span><span className={layoutStyle.carDetails_infoValue}>{car.currentMileage} km</span></div>
          <div className={layoutStyle.carDetails_infoItem}><span className={layoutStyle.carDetails_infoLabel}>Propriétaire</span><span className={layoutStyle.carDetails_infoValue}>{car.user?.name || '—'}</span></div>
        </div>
      </div>
    </div>
  );
}
