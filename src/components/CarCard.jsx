import React from 'react';
import styles from './carCard.module.css';

export default function CarCard({ brand, model, type, image, onClick }) {
  const title = `${brand || ''} ${model || ''}`.trim();

  return (
    <div className={styles.card} onClick={onClick} role="button">
      <div className={styles.imageWrapper}>
        {image ? (
          <img src={image} alt={title || 'vehicle image'} className={styles.image} />
        ) : (
          <div className={styles.placeholder}>No image</div>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.meta}>{type}</p>
      </div>
    </div>
  );
}
