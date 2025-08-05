import React from 'react';
import { Card, CardProps } from '../Card';
import { Text, TextVariant, TextColor } from '../Text';
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
   * Цвет заголовка
   */
  titleColor?: TextColor;
  /**
   * Цвет подзаголовка
   */
  subtitleColor?: TextColor;
  /**
   * Цвет иконки
   * @default 'currentColor'
   */
  iconColor?: string;
  /**
   * Цвет фона иконки
   * @default '#F3F4F6'
   */
  iconBackgroundColor?: string;
  /**
   * Обработчик клика по карточке
   */
  onClick?: () => void;
}


export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  subtitle,
  icon,
  titleVariant = 'regularM',
  subtitleVariant = 'headingS',
  titleColor,
  subtitleColor,
  iconColor = 'currentColor',
  iconBackgroundColor = '#F3F4F6',
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
          style={{ backgroundColor: iconBackgroundColor }}
        >
          <Icon
            name={icon}
            style={{ color: iconColor }}
            className={styles.icon}
          />
        </div>
      )}

      <div className={styles.textContainer}>
        <Text
          variant={titleVariant}
          color={titleColor}
          className={styles.title}
        >
          {title}
        </Text>

        {subtitle && (
          <Text
            variant={subtitleVariant}
            color={subtitleColor}
            className={styles.subtitle}
          >
            {subtitle}
          </Text>
        )}
      </div>
    </Card>
  );
};
