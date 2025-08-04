import React from 'react';
import { Icon, IconName } from '../Icon';
import { Text, TextVariant } from '../Text';
import styles from './IconButton.module.css';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Иконка кнопки
   */
  icon: IconName;
  /**
   * Текст под иконкой
   */
  children: React.ReactNode;
  /**
   * Вариант стиля текста
   * @default 'regularS'
   */
  textVariant?: TextVariant;
  /**
   * Цвет иконки
   * @default 'currentColor'
   */
  iconColor?: string;
  /**
   * Цвет фона иконки
   * @default 'transparent'
   */
  iconBackgroundColor?: string;
  /**
   * Цвет текста
   * @default 'currentColor'
   */
  textColor?: string;
  /**
   * Направление компоновки
   * @default 'column'
   */
  direction?: 'column' | 'row';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  children,
  textVariant = 'regularS',
  iconColor = 'currentColor',
  iconBackgroundColor = 'transparent',
  textColor = 'currentColor',
  direction = 'column',
  className,
  ...rest
}) => {
  const buttonClasses = [
    styles.iconButton,
    styles[`direction-${direction}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      {...rest}
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
      <Text
        variant={textVariant}
        as="span"
        style={{ color: textColor }}
        className={styles.text}
      >
        {children}
      </Text>
    </button>
  );
};
