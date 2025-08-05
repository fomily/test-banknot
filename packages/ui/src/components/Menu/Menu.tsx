import React from 'react';
import { Icon, IconName } from '../Icon';
import { Avatar } from '../Avatar';
import { Text } from '../Text';
import styles from './Menu.module.css';

export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Иконка пункта меню
   */
  icon: IconName;
  /**
   * Текст пункта меню
   */
  children: React.ReactNode;
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
  icon,
  children,
  isActive = false,
  className,
  ...props
}) => {
  const textColor = isActive ? 'white' : 'inactive';
  const iconColor = isActive ? '#FFFFFF' : '#A3A3A3';

  return (
    <button
      {...props}
      className={`${styles.menuItem} ${isActive ? styles.active : ''} ${className || ''}`}
    >
      <Icon
        name={icon}
        color={iconColor}
        className={styles.icon}
      />
      <Text
        variant="regularS"
        color={textColor}
        as="span"
      >
        {children}
      </Text>
    </button>
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
          const textColor = item.isActive ? 'white' : 'inactive';
          const { icon, ...itemProps } = item;
          return (
            <button
              key={index}
              {...itemProps}
              className={`${styles.menuItem} ${item.isActive ? styles.active : ''} ${itemProps.className || ''}`}
            >
              <Avatar
                src={avatarSrc}
                alt={avatarAlt}
                className={styles.avatar}
              />
              <Text
                variant="regularS"
                color={textColor}
                as="span"
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
