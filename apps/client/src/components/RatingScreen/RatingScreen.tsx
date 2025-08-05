import React from 'react';
import {
  Text,
  Badge,
  Rating,
  ProductCard,
  ListItem,
  Menu,
  MenuItemProps
} from '@packages/ui';
import styles from './RatingScreen.module.css';

interface RatingScreenProps {
  onNavigate: (screen: string) => void;
}

export const RatingScreen: React.FC<RatingScreenProps> = ({ onNavigate }) => {
  // Данные для нижнего меню
  const menuItems: MenuItemProps[] = React.useMemo(() => [
    {
      icon: 'home',
      children: 'главная',
      onClick: () => onNavigate('main')
    },
    {
      icon: 'chart',
      children: 'продукты',
      onClick: () => onNavigate('products')
    },
    {
      icon: 'trending-up',
      children: 'рейтинг',
      isActive: true,
      onClick: () => onNavigate('rating')
    },
    {
      icon: 'profile',
      children: 'профиль',
      onClick: () => onNavigate('profile')
    }
  ], [onNavigate]);

  // Данные для следующего уровня рейтинга
  const nextLevelProducts = React.useMemo(() => [
    {
      title: 'Ипотека',
      subtitle: 'От 20% годовых'
    },
    {
      title: 'Повысить процент на остаток',
      subtitle: '10% → 12% годовых'
    }
  ], []);

  // Данные для действий по улучшению рейтинга
  const ratingActions = React.useMemo(() => [
    {
      title: 'Укажи источник дохода',
      icon: 'plus' as const,
      iconBackgroundColor: 'var(--color-green-light)',
      iconColor: 'var(--color-green-dark)'
    },
    {
      title: 'Привяжи госуслуги',
      icon: 'link' as const,
      iconBackgroundColor: 'var(--color-green-light)',
      iconColor: 'var(--color-green-dark)'
    },
    {
      title: 'Регулярно совершай покупки по карте',
      icon: 'card' as const,
      iconBackgroundColor: 'var(--color-green-light)',
      iconColor: 'var(--color-green-dark)'
    }
  ], []);

  return (
    <div className={styles.ratingScreen}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.ratingSection}>
          <Text variant="regularS" color="white">
            рейтинг:
          </Text>
          <Badge backgroundColor="var(--color-green-primary)" textColor="var(--color-black)">
            хороший
          </Badge>
        </div>

        <div className={styles.ratingScale}>
          <Rating
            level={3}
            className={styles.rating}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        {/* Next Level Section */}
        <div className={styles.section}>
          <Text variant="BoldM" color="primary" className={styles.sectionTitle}>
            На следующем уровне рейтинга
          </Text>
          <div className={styles.productsContainer}>
            {nextLevelProducts.map((product, index) => (
              <ProductCard
                key={index}
                title={product.title}
                subtitle={product.subtitle}
                titleVariant="regularM"
                subtitleVariant="regularM"
                titleColor="primary"
                subtitleColor="secondary"
                backgroundColor="var(--color-background-secondary)"
                className={styles.productCard}
              />
            ))}
          </div>
        </div>

        {/* Actions Section */}
        <div className={styles.section}>
          <Text variant="BoldM" color="primary" className={styles.sectionTitle}>
            Как набрать рейтинг?
          </Text>
          <div className={styles.actionsContainer}>
            {ratingActions.map((action, index) => (
              <ListItem
                key={index}
                title={action.title}
                icon={action.icon}
                iconBackgroundColor={action.iconBackgroundColor}
                iconColor={action.iconColor}
                onClick={() => console.log(`Действие: ${action.title}`)}
                className={styles.actionItem}
              />
            ))}
          </div>
        </div>

        {/* Отступ для нижнего меню */}
        <div className={styles.menuSpacer} />
      </div>

      {/* Bottom Menu */}
      <Menu
        items={menuItems}
        avatarSrc="https://i.pravatar.cc/32?img=7"
        avatarAlt="Профиль"
      />
    </div>
  );
};
