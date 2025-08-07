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
  // Данные для нижнего меню - мемоизируем, но зависят от onNavigate
  const menuItems: MenuItemProps[] = React.useMemo(() => [
    {
      icon: 'menuHome',
      children: 'главная',
      onClick: () => onNavigate('main')
    },
    {
      icon: 'menuProducts',
      children: 'продукты',
      isActive: true,
      onClick: () => onNavigate('products')
    },
    {
      icon: 'menuRating',
      children: 'рейтинг',
      onClick: () => onNavigate('rating')
    },
    {
      icon: 'profile',
      children: 'профиль',
      onClick: () => onNavigate('profile')
    }
  ], [onNavigate]);

  return (
    <div className={styles.products}>
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

        {/* Невидимый placeholder для компонента Rating чтобы высота header была как на странице рейтинга */}
        <div className={styles.ratingPlaceholder} />
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
              icon="overdraft"
              iconColor="var(--color-green-dark)"
              iconBackgroundColor="var(--color-green-light)"
              titleVariant="regularM"
              subtitleVariant="regularS"
              subtitleColor="secondary"
              onClick={() => console.log('Подключить овердрафт')}
              className={styles.productCard}
            />

            <ProductCard
              title="Потребительский кредит"
              subtitle="До 5 млн рублей на любые цели"
              icon="card"
              iconColor="var(--color-green-dark)"
              iconBackgroundColor="var(--color-green-light)"
              titleVariant="regularM"
              subtitleVariant="regularS"
              subtitleColor="secondary"
              onClick={() => console.log('Потребительский кредит')}
              className={styles.productCard}
            />

            <ProductCard
              title="Ипотека"
              subtitle="Чтобы открыть ипотеку необходимо повысить рейтинг кошелька"
              icon="lock"
              iconColor="var(--color-grey)"
              iconBackgroundColor="var(--color-grey-light)"
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
              icon="plus"
              iconColor="var(--color-green-dark)"
              iconBackgroundColor="var(--color-green-light)"
              titleVariant="regularM"
              subtitleVariant="regularS"
              subtitleColor="secondary"
              onClick={() => console.log('Открыть вклад')}
              className={styles.productCard}
            />

            <ProductCard
              title="Накопительный счёт"
              subtitle="До 14% годовых с возможностью снятия"
              icon="percent"
              iconColor="var(--color-green-dark)"
              iconBackgroundColor="var(--color-green-light)"
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
