import React from 'react';
import styles from './Text.module.css';

export type TextVariant =
  | 'regularS'
  | 'regularM'
  | 'headingS'
  | 'headingM'
  | 'headingL'
  | 'BoldM'
  | 'currency';

export type TextColor =
  | 'primary'
  | 'secondary'
  | 'grey'
  | 'white';

export interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TextVariant;
  color?: TextColor;
  as?: 'span' | 'p' | 'div';
  children?: React.ReactNode;
  currencyValue?: string; // Для форматирования валюты
}

export const Text: React.FC<TextProps> = ({
  variant = 'regularM',
  color,
  as = 'div',
  className,
  children,
  currencyValue,
  ...rest
}) => {
  const Component = as;
  const variantClass = styles[variant];
  const colorClass = color ? styles[`color${color.charAt(0).toUpperCase() + color.slice(1)}`] : '';

  // Специальная обработка для валюты
  if (variant === 'currency' && currencyValue) {
    const parts = currencyValue.split(',');
    const rubles = parts[0];
    const kopecks = parts[1] || '';

    return (
      <Component
        className={`${styles.text} ${variantClass} ${colorClass} ${className || ''}`}
        {...rest}
      >
        {rubles}
        {kopecks && (
          <span className={styles.currencyFraction}>, {kopecks}</span>
        )}
        <span className={styles.currencySymbol}> ₽</span>
      </Component>
    );
  }

  return (
    <Component
      className={`${styles.text} ${variantClass} ${colorClass} ${className || ''}`}
      {...rest}
    >
      {children}
    </Component>
  );
};
