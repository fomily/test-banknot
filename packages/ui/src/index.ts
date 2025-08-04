// Global styles
import './styles';

export { Text } from './components/Text';
export type { TextProps, TextVariant, TextColor } from './components/Text';

export { Card } from './components/Card';
export type { CardProps } from './components/Card';

export { Icon } from './components/Icon';
export type { IconName, IconProps } from './components/Icon';

export { Avatar } from './components/Avatar';
export type { AvatarProps } from './components/Avatar';

export { ProductCard } from './components/ProductCard';
export type { ProductCardProps } from './components/ProductCard';

export { Badge } from './components/Badge';
export type { BadgeProps } from './components/Badge';

export { IconButton } from './components/IconButton';
export type { IconButtonProps } from './components/IconButton';

export { Menu } from './components/Menu';
export type { MenuProps, MenuItemProps } from './components/Menu';

// Font utilities
export {
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  getFontStyles,
  textStyles,
} from './utils/fonts';
