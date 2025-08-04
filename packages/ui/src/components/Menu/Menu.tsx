import React from 'react';
import { IconButton, IconButtonProps } from '../IconButton';
import { Avatar } from '../Avatar';
import { Text } from '../Text';
import styles from './Menu.module.css';

export interface MenuItemProps extends Omit<IconButtonProps, 'direction'> {
  /**
   * Активность пункта меню
   * @default false
   */
  isActive?: boolean;
}

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Пункты меню
   */
  items: MenuItemProps[];
  /**
   * URL аватара пользователя (для последнего элемента)
   */
  avatarSrc?: string;
  /**
   * Alt текст для аватара
   */
  avatarAlt?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
  isActive = false,
  textColor,
  iconColor,
  ...props
}) => {
  const activeTextColor = isActive ? '#FFFFFF' : (textColor || '#A3A3A3');
  const activeIconColor = isActive ? '#FFFFFF' : (iconColor || '#A3A3A3');

  return (
    <IconButton
      {...props}
      textColor={activeTextColor}
      iconColor={activeIconColor}
      direction="column"
      className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
    />
  );
};

export const Menu: React.FC<MenuProps> = ({
  items,
  avatarSrc,
  avatarAlt,
  className,
  ...rest
}) => {
  return (
    <div
      className={`${styles.menu} ${className || ''}`}
      {...rest}
    >
      {items.map((item, index) => {
        // Последний элемент - профиль с аватаром
        if (index === items.length - 1) {
          const textColor = item.isActive ? '#FFFFFF' : '#A3A3A3';
          return (
            <button
              key={index}
              className={`${styles.menuItem} ${styles.profileItem} ${item.isActive ? styles.active : ''}`}
              onClick={item.onClick}
            >
              <Avatar
                src={avatarSrc}
                alt={avatarAlt}
                className={styles.avatar}
              />
              <Text
                variant="regularS"
                as="span"
                style={{ color: textColor, fontSize: 'var(--font-size-xs)', textAlign: 'center' }}
              >
                {item.children}
              </Text>
            </button>
          );
        }

        return <MenuItem key={index} {...item} />;
      })}
    </div>
  );
};
