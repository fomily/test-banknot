import React from 'react';
import styles from './Text.module.css';

export type TextVariant =
  | 'regularS'
  | 'regularM'
  | 'headingS'
  | 'headingM'
  | 'headingL';

export type TextColor =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TextVariant;
  color?: TextColor;
  as?: 'span' | 'p' | 'div';
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'regularM',
  color,
  as = 'div',
  className,
  children,
  ...rest
}) => {
  const Component = as;
  const variantClass = styles[variant];
  const colorClass = color ? styles[`color${color.charAt(0).toUpperCase() + color.slice(1)}`] : '';

  return (
    <Component
      className={`${styles.text} ${variantClass} ${colorClass} ${className || ''}`}
      {...rest}
    >
      {children}
    </Component>
  );
};
