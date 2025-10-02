import React from 'react';
import { Menu, MenuItemProps } from '@packages/ui';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
  currentScreen: string;
  onNavigate: (screen: string) => void;
  userAvatarUrl?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentScreen,
  onNavigate,
  userAvatarUrl
}) => {
  // Общие данные для меню - мемоизируем для стабильности
  const menuItems: MenuItemProps[] = React.useMemo(() => [
    {
      icon: 'menuHome',
      children: 'главная',
      isActive: currentScreen === 'main',
      onClick: () => onNavigate('main')
    },
    {
      icon: 'menuProducts',
      children: 'продукты',
      isActive: currentScreen === 'products',
      onClick: () => onNavigate('products')
    },
    {
      icon: 'menuRating',
      children: 'рейтинг',
      isActive: currentScreen === 'rating',
      onClick: () => onNavigate('rating')
    },
    {
      icon: 'profile',
      children: 'профиль',
      isActive: currentScreen === 'profile',
      onClick: () => onNavigate('profile')
    }
  ], [currentScreen, onNavigate]);

  return (
    <div className={styles.layout}>
      {/* Основной контент */}
      <div className={styles.content}>
        {children}
      </div>

      {/* Общее меню */}
      <Menu
        items={menuItems}
        avatarSrc={userAvatarUrl}
        avatarAlt="Профиль"
      />
    </div>
  );
};
