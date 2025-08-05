import React from 'react';
import {
  Text,
  Badge,
  ProductCard,
  Menu,
  MenuItemProps
} from '@packages/ui';
import styles from './Products.module.css';

interface ProductsProps {
  onNavigate: (screen: string) => void;
}

export const Products: React.FC<ProductsProps> = ({ onNavigate }) => {
  // Данные для нижнего меню
  const menuItems: MenuItemProps[] = [
    {
      icon: 'home',
      children: 'главная',
      onClick: () => onNavigate('main')
    },
    {
      icon: 'chart',
      children: 'продукты',
      isActive: true,
      onClick: () => onNavigate('products')
    },
    {
      icon: 'trending-up',
      children: 'рейтинг',
      onClick: () => onNavigate('rating')
    },
    {
      icon: 'profile',
      children: 'профиль',
      onClick: () => onNavigate('profile')
    }
  ];

  return (
    <div className={styles.products}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.ratingSection}>
          <Text variant="regularS" color="muted">
            рейтинг:
          </Text>
          <Badge backgroundColor="#CBFC05" textColor="#000000">
            хороший
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        {/* Взять кредит Section */}
        <div className={styles.section}>
          <Text variant="regularM" color="secondary" className={styles.sectionTitle}>
            Взять кредит
          </Text>
          <div className={styles.creditProducts}>
            <ProductCard
              title="Подключить овердрафт"
              subtitle="Для непредвиденных трат"
              icon="credit"
              iconColor="#FFFFFF"
              iconBackgroundColor="#CBFC05"
              titleVariant="regularM"
              subtitleVariant="regularS"
              subtitleColor="secondary"
              onClick={() => console.log('Подключить овердрафт')}
              className={styles.productCard}
            />
            
            <ProductCard
              title="Потребительский кредит"
              subtitle="До 5 млн рублей на любые цели"
              icon="credit"
              iconColor="#FFFFFF"
              iconBackgroundColor="#CBFC05"
              titleVariant="regularM"
              subtitleVariant="regularS"
              subtitleColor="secondary"
              onClick={() => console.log('Потребительский кредит')}
              className={styles.productCard}
            />
            
            <ProductCard
              title="Ипотека"
              subtitle="Чтобы открыть ипотеку необходимо повысить рейтинг кошелька"
              icon="home"
              iconColor="#8E9094"
              iconBackgroundColor="#EFF1F3"
              titleVariant="regularM"
              subtitleVariant="regularS"
              subtitleColor="secondary"
              onClick={() => console.log('Ипотека')}
              className={`${styles.productCard} ${styles.disabledCard}`}
            />
          </div>
        </div>

        {/* Копить Section */}
        <div className={styles.section}>
          <Text variant="regularM" color="secondary" className={styles.sectionTitle}>
            Копить
          </Text>
          <div className={styles.savingProducts}>
            <ProductCard
              title="Открыть вклад"
              subtitle="От 18% годовых"
              icon="income"
              iconColor="#FFFFFF"
              iconBackgroundColor="#CBFC05"
              titleVariant="regularM"
              subtitleVariant="regularS"
              subtitleColor="secondary"
              onClick={() => console.log('Открыть вклад')}
              className={styles.productCard}
            />
            
            <ProductCard
              title="Накопительный счёт"
              subtitle="До 14% годовых с возможностью снятия"
              icon="star"
              iconColor="#FFFFFF"
              iconBackgroundColor="#CBFC05"
              titleVariant="regularM"
              subtitleVariant="regularS"
              subtitleColor="secondary"
              onClick={() => console.log('Накопительный счёт')}
              className={styles.productCard}
            />
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