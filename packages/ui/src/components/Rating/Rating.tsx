import React from 'react';
import styles from './Rating.module.css';

export interface RatingProps {
  /**
   * Текущий уровень рейтинга (1-5)
   */
  level: 1 | 2 | 3 | 4 | 5;
  /**
   * Дополнительные CSS классы
   */
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  level,
  className
}) => {
  return (
    <div className={`${styles.rating} ${className || ''}`}>
      <div className={styles.scale}>
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className={`${styles.segment} ${
              index >= level ? styles.inactive : ''
            }`}
          />
        ))}
      </div>
    </div>
  );
};
