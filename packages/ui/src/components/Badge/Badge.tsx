import React from 'react';
import { Text, TextVariant } from '../Text';
import styles from './Badge.module.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Текст бейджа
   */
  children: React.ReactNode;
  /**
   * Вариант стиля текста
   * @default 'regularS'
   */
  variant?: TextVariant;
  /**
   * Цвет фона бейджа
   * @default '#CBFC05'
   */
  backgroundColor?: string;
  /**
   * Цвет текста
   * @default '#FFFFFF'
   */
  textColor?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'regularS',
  backgroundColor = '#CBFC05',
  textColor = '#FFFFFF',
  className,
  style,
  ...rest
}) => {
  return (
    <div
      className={`${styles.badge} ${className || ''}`}
      style={{
        backgroundColor,
        color: textColor,
        ...style
      }}
      {...rest}
    >
      <Text variant={variant} as="span" style={{ color: textColor }}>
        {children}
      </Text>
    </div>
  );
};
