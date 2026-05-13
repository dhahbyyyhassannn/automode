import React from 'react';
import styles from './carCard.module.css';

export default function CarCard({ brand, model, type, image, onClick }) {
  const title = `${brand || ''} ${model || ''}`.trim();
  const imageUrl = image && typeof image === 'string' && !image.startsWith('data:') 
    ? `data:image/jpeg;base64,${image}` 
    : image;

  return (
    <div className={styles.card} onClick={onClick} role="button">
      <div className={styles.imageWrapper}>
        {imageUrl ? (
          <img src={imageUrl} alt={title || 'vehicle image'} className={styles.image} />
        ) : (
          <div className={styles.placeholder}>Pas d'image</div>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.meta}>{type}</p>
      </div>
    </div>
  );
}
