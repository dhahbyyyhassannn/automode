import React, { useEffect, useState } from 'react';
import styles from './carCard.module.css';
import { getVehicleExpenseSummaryPublic } from '../../api/carAPI';

export default function CarCard({ brand, model, type, image, matricule, onClick }) {
  const [expensePerMile, setExpensePerMile] = useState(null);
  const title = `${brand || ''} ${model || ''}`.trim();
  const imageUrl = image && typeof image === 'string' && !image.startsWith('data:') 
    ? `data:image/jpeg;base64,${image}` 
    : image;

  useEffect(() => {
    if (matricule) {
      getVehicleExpenseSummaryPublic(matricule)
        .then(summary => {
          setExpensePerMile(summary.costPerMile);
        })
        .catch(err => console.error("Error fetching summary for card:", err));
    }
  }, [matricule]);

  return (
    <div className={styles.card} onClick={onClick} role="button">
      <div className={styles.imageWrapper}>
        {imageUrl ? (
          <img src={imageUrl} alt={title || 'vehicle image'} className={styles.image} />
        ) : (
          <div className={styles.placeholder}>No image</div>
        )}
      </div>
      <div className={styles.content}>
        <span className={styles.badge}>{type || 'Vehicle'}</span>
        <h3 className={styles.title}>{title}</h3>
        {expensePerMile !== null && (
          <p className={styles.expenseMetric}>
            <strong>{expensePerMile.toFixed(2)} €</strong> / mile
          </p>
        )}
        <p className={styles.meta}>View details</p>
      </div>
    </div>
  );
}
