import React from 'react';
import styles from './Card.module.css';

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
  className,
  children,
  ...rest
}) => {
  const cardClasses = [
    styles.card,
    !isActive && styles.cardInactive,
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClasses}
      style={{ backgroundColor, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
};
