import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Кастомный цвет фона карточки
   */
  backgroundColor?: string;
  /**
   * Состояние активности карточки
   * @default true
   */
  isActive?: boolean;
  /**
   * Содержимое карточки
   */
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  backgroundColor = '#FFFFFF',
  isActive = true,
  style,
  children,
  ...rest
}) => {
  const cardStyles: React.CSSProperties = {
    backgroundColor,
    borderRadius: '1rem', // 16px в rem - более точное соответствие макету
    padding: '1.25rem', // 20px в rem
    boxShadow: '0 0.25rem 1rem rgba(0, 0, 0, 0.1)', // Более выраженная тень как в макете
    opacity: isActive ? 1 : 0.6,
    transition: 'opacity 0.2s ease',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box', // Добавляю чтобы padding не увеличивал ширину
    ...style,
  };

  return (
    <div style={cardStyles} {...rest}>
      {children}
    </div>
  );
}; 