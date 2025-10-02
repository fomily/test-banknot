import React from 'react';
import styles from './Avatar.module.css';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  className,
  ...rest
}) => {
  return (
    <div
      className={`${styles.avatar} ${className || ''}`}
      {...rest}
    >
      {src ? (
        <img
          src={src}
          alt={alt || 'User avatar'}
          className={styles.avatarImage}
          onError={(e) => {
            // При ошибке загрузки скрываем изображение, показывается фон
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        // Заглушка при отсутствии изображения - иконка профиля в стиле проекта
        <svg
          className={styles.avatarPlaceholder}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M6 21C6 17 8.5 14 12 14C15.5 14 18 17 18 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )}
    </div>
  );
};
