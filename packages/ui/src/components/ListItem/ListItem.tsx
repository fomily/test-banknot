import React from 'react';
import { Text, TextVariant, TextColor } from '../Text';
import { Icon, IconName } from '../Icon';
import styles from './ListItem.module.css';

export interface ListItemProps {
  /**
   * Основной текст элемента списка
   */
  title: string;
  /**
   * Дополнительный подзаголовок (опционально)
   */
  subtitle?: string;
  /**
   * Иконка слева от текста
   */
  icon: IconName;
  /**
   * Вариант стиля для заголовка
   * @default 'regularM'
   */
  titleVariant?: TextVariant;
  /**
   * Вариант стиля для подзаголовка
   * @default 'regularS'
   */
  subtitleVariant?: TextVariant;
  /**
   * Цвет заголовка
   * @default 'primary'
   */
  titleColor?: TextColor;
  /**
   * Цвет подзаголовка
   * @default 'muted'
   */
  subtitleColor?: TextColor;
  /**
   * Цвет иконки
   * @default 'currentColor'
   */
  iconColor?: string;
  /**
   * Цвет фона иконки
   * @default '#e5f6e3'
   */
  iconBackgroundColor?: string;
  /**
   * Обработчик клика по элементу
   */
  onClick?: () => void;
  /**
   * Дополнительные CSS классы
   */
  className?: string;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  icon,
  titleVariant = 'regularM',
  subtitleVariant = 'regularS',
  titleColor = 'primary',
  subtitleColor = 'muted',
  iconColor = 'currentColor',
  iconBackgroundColor = 'var(--color-green-light)',
  onClick,
  className
}) => {
  const itemClasses = [
    styles.listItem,
    onClick ? styles.clickable : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={itemClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
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
    </div>
  );
};
