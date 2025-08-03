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
        // Заглушка при отсутствии изображения
        <svg
          className={styles.avatarPlaceholder}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="8" r="4" fill="#9E9E9E"/>
          <path
            d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21"
            stroke="#9E9E9E"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
};
