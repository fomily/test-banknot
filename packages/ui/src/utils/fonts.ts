/**
 * Font utilities for consistent typography across the application
 */

export const fontFamily = {
  primary: 'var(--font-family-primary)',
} as const;

export const fontWeight = {
  regular: 'var(--font-weight-regular)',
  medium: 'var(--font-weight-medium)',
  semibold: 'var(--font-weight-semibold)',
} as const;

export const fontSize = {
  xs: 'var(--font-size-xs)',
  sm: 'var(--font-size-sm)',
  base: 'var(--font-size-base)',
  lg: 'var(--font-size-lg)',
  xl: 'var(--font-size-xl)',
  '2xl': 'var(--font-size-2xl)',
  '3xl': 'var(--font-size-3xl)',
  '4xl': 'var(--font-size-4xl)',
} as const;

export const lineHeight = {
  tight: 'var(--line-height-tight)',
  normal: 'var(--line-height-normal)',
  relaxed: 'var(--line-height-relaxed)',
  loose: 'var(--line-height-loose)',
} as const;

/**
 * Get font styles object for inline styles
 */
export const getFontStyles = (options: {
  family?: keyof typeof fontFamily;
  weight?: keyof typeof fontWeight;
  size?: keyof typeof fontSize;
  lineHeight?: keyof typeof lineHeight;
}) => {
  return {
    fontFamily: options.family ? fontFamily[options.family] : undefined,
    fontWeight: options.weight ? fontWeight[options.weight] : undefined,
    fontSize: options.size ? fontSize[options.size] : undefined,
    lineHeight: options.lineHeight ? lineHeight[options.lineHeight] : undefined,
  };
};

/**
 * Predefined text styles for common use cases
 */
export const textStyles = {
  regularS: getFontStyles({
    weight: 'regular',
    size: 'xs',
    lineHeight: 'normal',
  }),
  regularM: getFontStyles({
    weight: 'regular',
    size: 'base',
    lineHeight: 'relaxed',
  }),
  headingS: getFontStyles({
    weight: 'regular',
    size: 'base',
    lineHeight: 'relaxed',
  }),
  headingM: getFontStyles({
    weight: 'medium',
    size: 'lg',
    lineHeight: 'relaxed',
  }),
  headingL: getFontStyles({
    weight: 'semibold',
    size: '4xl',
    lineHeight: 'tight',
  }),
} as const;
