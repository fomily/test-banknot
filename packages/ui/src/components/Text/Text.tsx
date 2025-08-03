import React from 'react';
import styles from './Text.module.css';

export type TextVariant =
  | 'regularS'
  | 'regularM'
  | 'headingS'
  | 'headingM'
  | 'headingL';

export interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TextVariant;
  as?: 'span' | 'p' | 'div';
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'regularM',
  as = 'div',
  className,
  children,
  ...rest
}) => {
  const Component = as;
  const variantClass = styles[variant];

  return (
    <Component
      className={`${styles.text} ${variantClass} ${className || ''}`}
      {...rest}
    >
      {children}
    </Component>
  );
};
