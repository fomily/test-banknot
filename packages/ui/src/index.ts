// Global styles
import './styles';

export { Text } from './components/Text';
export type { TextProps, TextVariant } from './components/Text';

export { Card } from './components/Card';
export type { CardProps } from './components/Card';

export { Icon } from './components/Icon';
export type { IconName, IconProps } from './components/Icon';

export { Avatar } from './components/Avatar';
export type { AvatarProps } from './components/Avatar';

export { ProductCard } from './components/ProductCard';
export type { ProductCardProps } from './components/ProductCard';

// Font utilities
export {
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  getFontStyles,
  textStyles,
} from './utils/fonts';
