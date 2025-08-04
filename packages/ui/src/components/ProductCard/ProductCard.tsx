import React from 'react';
import { Card, CardProps } from '../Card';
import { Text, TextVariant } from '../Text';
import { Icon, IconName } from '../Icon';
import styles from './ProductCard.module.css';

export interface ProductCardProps extends Omit<CardProps, 'children'> {
  /**
   * Основной заголовок карточки
   */
  title: string;
  /**
   * Дополнительный подзаголовок (опционально)
   */
  subtitle?: string;
  /**
   * Иконка слева от текста (опционально)
   */
  icon?: IconName;
  /**
   * Вариант стиля для заголовка
   * @default 'regularM'
   */
  titleVariant?: TextVariant;
  /**
   * Вариант стиля для подзаголовка
   * @default 'headingS'
   */
  subtitleVariant?: TextVariant;
  /**
   * Цвет иконки
   * @default 'currentColor'
   */
  iconColor?: string;
  /**
   * Обработчик клика по карточке
   */
  onClick?: () => void;
}

// Функция для получения светлого фона на основе цвета иконки
const getIconBackgroundColor = (iconColor: string): string => {
  const colorMap: Record<string, string> = {
    '#10B981': '#DCFCE7', // зеленый -> светло-зеленый
    '#6366F1': '#E0E7FF', // синий -> светло-синий
    '#F59E0B': '#FEF3C7', // оранжевый -> светло-оранжевый
    '#EF4444': '#FEE2E2', // красный -> светло-красный
    '#8B5CF6': '#F3E8FF', // фиолетовый -> светло-фиолетовый
  };

  return colorMap[iconColor] || '#F3F4F6'; // серый по умолчанию
};

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  subtitle,
  icon,
  titleVariant = 'regularM',
  subtitleVariant = 'headingS',
  iconColor = 'currentColor',
  onClick,
  className,
  ...cardProps
}) => {
  const contentClasses = [
    styles.content,
    icon ? styles.contentWithIcon : styles.contentWithoutIcon,
    className
  ].filter(Boolean).join(' ');

  return (
    <Card
      className={contentClasses}
      onClick={onClick}
      {...cardProps}
    >
            {icon && (
        <div
          className={styles.iconContainer}
          style={{ backgroundColor: getIconBackgroundColor(iconColor) }}
        >
          <Icon
            name={icon}
            style={{ color: iconColor }}
          />
        </div>
      )}

      <div className={styles.textContainer}>
        <Text
          variant={titleVariant}
          className={styles.title}
        >
          {title}
        </Text>

        {subtitle && (
          <Text
            variant={subtitleVariant}
            className={styles.subtitle}
          >
            {subtitle}
          </Text>
        )}
      </div>
    </Card>
  );
};
