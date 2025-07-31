import React from 'react';

export type TextVariant =
  | 'RegularS'
  | 'RegularM'
  | 'HeadingS'
  | 'HeadingM'
  | 'HeadingL';

const variantStyles: Record<TextVariant, React.CSSProperties> = {
  RegularS: {
    fontFamily: 'Commissioner, sans-serif',
    fontWeight: 400,
    fontSize: '0.75rem', // 12px
    lineHeight: '1.2',
  },
  RegularM: {
    fontFamily: 'Commissioner, sans-serif',
    fontWeight: 400,
    fontSize: '1rem', // 16px
    lineHeight: '1.4',
  },
  HeadingS: {
    fontFamily: 'Commissioner, sans-serif',
    fontWeight: 400,
    fontSize: '1rem', // 16px
    lineHeight: '1.4',
    color: '#8B8B8B', // Серый, можно заменить на переменную, если есть
  },
  HeadingM: {
    fontFamily: 'Commissioner, sans-serif',
    fontWeight: 500,
    fontSize: '1.125rem', // 18px
    lineHeight: '1.3',
  },
  HeadingL: {
    fontFamily: 'Commissioner, sans-serif',
    fontWeight: 600,
    fontSize: '2.25rem', // 36px
    lineHeight: '1.1',
  },
};

export interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TextVariant;
  as?: 'span' | 'p';
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'RegularM',
  as = 'span',
  style,
  children,
  ...rest
}) => {
  const Component = as;
  return (
    <Component
      style={{ ...variantStyles[variant], ...style }}
      {...rest}
    >
      {children}
    </Component>
  );
};