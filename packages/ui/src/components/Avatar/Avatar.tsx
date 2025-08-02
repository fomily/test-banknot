import React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  style,
  className,
  ...rest
}) => {
  return (
    <div
      style={{
        width: '3rem', // 48px
        height: '3rem', // 48px
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5', // Светло-серый фон для заглушки
        border: '1px solid #E0E0E0', // Тонкая граница
        flexShrink: 0,
        ...style,
      }}
      className={className}
      {...rest}
    >
      {src ? (
        <img
          src={src}
          alt={alt || 'User avatar'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
          onError={(e) => {
            // При ошибке загрузки скрываем изображение, показывается фон
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        // Заглушка при отсутствии изображения
        <svg
          width="24"
          height="24"
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