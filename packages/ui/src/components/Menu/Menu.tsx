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

const MenuItem: React.FC<MenuItemProps> = React.memo(({
  icon,
  children,
  isActive = false,
  className,
  ...props
}) => {
  const textColor = isActive ? 'white' : 'grey';
  const iconColor = isActive ? '#FFFFFF' : '#8E9094';

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
});

// Мемоизированный компонент ProfileButton для стабильности аватарки
const ProfileButton: React.FC<{
  item: MenuItemProps;
  avatarSrc?: string;
  avatarAlt?: string;
}> = React.memo(({ item, avatarSrc, avatarAlt }) => {
  const textColor = item.isActive ? 'white' : 'grey';
  const { icon, isActive, className, ...itemProps } = item;

  return (
    <button
      {...itemProps}
      className={`${styles.menuItem} ${isActive ? styles.active : ''} ${className || ''}`}
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
});

export const Menu: React.FC<MenuProps> = React.memo(({
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
        // Создаем стабильный ключ на основе icon или children
        const stableKey = `${item.icon}-${typeof item.children === 'string' ? item.children : index}`;

        // Последний элемент - профиль с аватаром
        if (index === items.length - 1) {
          return (
            <ProfileButton
              key="profile-button"
              item={item}
              avatarSrc={avatarSrc}
              avatarAlt={avatarAlt}
            />
          );
        }

        return <MenuItem key={stableKey} {...item} />;
      })}
    </div>
  );
});
