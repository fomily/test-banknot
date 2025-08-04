import React from 'react';
import {
  Text,
  Badge,
  IconButton,
  Avatar,
  ProductCard,
  Menu,
  MenuItemProps
} from '@packages/ui';
import styles from './Main.module.css';

export const Main: React.FC = () => {
  // Данные для секции "Избранное"
  const favoriteContacts = [
    { name: 'Вероника', avatar: 'https://i.pravatar.cc/48?img=1' },
    { name: 'Татьяна', avatar: 'https://i.pravatar.cc/48?img=2' },
    { name: 'Паша', avatar: 'https://i.pravatar.cc/48?img=3' },
    { name: 'Ира', avatar: 'https://i.pravatar.cc/48?img=4' },
    { name: 'Мяо Ли', avatar: 'https://i.pravatar.cc/48?img=5' },
    { name: 'Борис', avatar: 'https://i.pravatar.cc/48?img=6' },
  ];

  // Данные для секции "Мои продукты"
  const products = [
    {
      title: '30 500, 16 Р',
      subtitle: 'Накопительный счёт',
      icon: 'income' as const
    },
    {
      title: '10 234, 32 Р',
      subtitle: 'Накопительный счёт',
      icon: 'income' as const
    },
    {
      title: '3 421, 12 Р',
      subtitle: 'Накопительный счёт',
      icon: 'income' as const
    }
  ];

  // Данные для нижнего меню
  const menuItems: MenuItemProps[] = [
    {
      icon: 'home',
      children: 'главная',
      isActive: true,
      onClick: () => console.log('Главная')
    },
    {
      icon: 'chart',
      children: 'продукты',
      onClick: () => console.log('Продукты')
    },
    {
      icon: 'trending-up',
      children: 'рейтинг',
      onClick: () => console.log('Рейтинг')
    },
    {
      icon: 'profile',
      children: 'профиль',
      onClick: () => console.log('Профиль')
    }
  ];

  return (
    <div className={styles.main}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.ratingSection}>
          <Text variant="regularS" style={{ color: '#A0AEC0' }}>
            рейтинг:
          </Text>
          <Badge backgroundColor="#CBFC05" textColor="#000000">
            хороший
          </Badge>
        </div>

        <div className={styles.balanceSection}>
          <Text variant="headingL" style={{ color: '#FFFFFF' }}>
            60 000, <Text variant="headingL" as="span" style={{ color: '#A0AEC0' }}>34 Р</Text>
          </Text>
        </div>

        <div className={styles.actionButtons}>
          <IconButton
            icon="qr"
            iconColor="#FFFFFF"
            iconBackgroundColor="#3C3C3C"
            textColor="#FFFFFF"
            onClick={() => console.log('Сканировать')}
          >
            сканировать
          </IconButton>
          <IconButton
            icon="credit"
            iconColor="#FFFFFF"
            iconBackgroundColor="#3C3C3C"
            textColor="#FFFFFF"
            onClick={() => console.log('На карту')}
          >
            на карту
          </IconButton>
          <IconButton
            icon="income"
            iconColor="#FFFFFF"
            iconBackgroundColor="#3C3C3C"
            textColor="#FFFFFF"
            onClick={() => console.log('По телефону')}
          >
            по телефону
          </IconButton>
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        {/* Получить перевод Section */}
        <div className={styles.section}>
          <Text variant="regularM" color="secondary" className={styles.sectionTitle}>
            Получить перевод
          </Text>
          <div className={styles.transferGrid}>
            <ProductCard
              title="Показать QR-код"
              icon="qr"
              iconColor="#8E9094"
              iconBackgroundColor="#EFF1F3"
              titleVariant="regularS"
              onClick={() => console.log('Показать QR-код')}
              className={styles.transferCard}
            />

            <ProductCard
              title="Отправить ссылку"
              icon="link"
              iconColor="#8E9094"
              iconBackgroundColor="#EFF1F3"
              titleVariant="regularS"
              onClick={() => console.log('Отправить ссылку')}
              className={styles.transferCard}
            />

            <ProductCard
              title="Поделиться реквизитами"
              icon="card"
              iconColor="#8E9094"
              iconBackgroundColor="#EFF1F3"
              titleVariant="regularS"
              onClick={() => console.log('Поделиться реквизитами')}
              className={styles.transferCard}
            />

            <ProductCard
              title="Создать сбор"
              icon="gift"
              iconColor="#8E9094"
              iconBackgroundColor="#EFF1F3"
              titleVariant="regularS"
              onClick={() => console.log('Создать сбор')}
              className={styles.transferCard}
            />
          </div>
        </div>

        {/* Избранное Section */}
        <div className={styles.section}>
          <Text variant="regularM" color="secondary" className={styles.sectionTitle}>
            Избранное
          </Text>
          <div className={styles.favoritesContainer}>
            {favoriteContacts.map((contact, index) => (
              <div key={index} className={styles.favoriteItem}>
                <Avatar
                  src={contact.avatar}
                  alt={contact.name}
                  className={styles.favoriteAvatar}
                />
                <Text variant="regularS" style={{ textAlign: 'center', color: '#4A5568', fontWeight: 'var(--font-weight-medium)' }}>
                  {contact.name}
                </Text>
              </div>
            ))}
          </div>
        </div>

        {/* Мои продукты Section */}
        <div className={styles.section}>
          <Text variant="regularM" color="secondary" className={styles.sectionTitle}>
            Мои продукты
          </Text>
          <div className={styles.productsContainer}>
            {products.map((product, index) => (
              <ProductCard
                key={index}
                title={product.title}
                subtitle={product.subtitle}
                icon={product.icon}
                iconColor="white"
                iconBackgroundColor="#CBFC05"
                titleVariant="headingS"
                subtitleVariant="regularS"
                onClick={() => console.log(`Продукт ${index + 1}`)}
                className={styles.productCard}
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
