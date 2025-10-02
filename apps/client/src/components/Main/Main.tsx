import React from 'react';
import {
  Text,
  Badge,
  IconButton,
  Avatar,
  ProductCard
} from '@packages/ui';
import styles from './Main.module.css';

interface MainProps {
  onNavigate: (screen: string) => void;
  balance?: number;
  ratingLevel?: number;
}

export const Main: React.FC<MainProps> = ({ onNavigate, balance = 0, ratingLevel = 3 }) => {
  // Форматирование баланса (копейки в рубли)
  const formattedBalance = React.useMemo(() => {
    if (balance === 0) return '0';
    const rubles = Math.floor(balance / 100);
    const kopecks = balance % 100;
    return `${rubles.toLocaleString('ru-RU')},${kopecks.toString().padStart(2, '0')}`;
  }, [balance]);

  // Маппинг уровня рейтинга на текст
  const getRatingText = (level: number) => {
    switch (level) {
      case 1: return 'очень низкий';
      case 2: return 'низкий';
      case 3: return 'хороший';
      case 4: return 'отличный';
      case 5: return 'превосходный';
      default: return 'хороший';
    }
  };

  const ratingText = React.useMemo(() => getRatingText(ratingLevel), [ratingLevel]);

  // Данные для секции "Избранное" - мемоизируем чтобы не пересоздавать
  const favoriteContacts = React.useMemo(() => [
    { name: 'Вероника', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=entropy&q=80' },
    { name: 'Татьяна', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=entropy&q=80' },
    { name: 'Паша', avatar: 'https://images.unsplash.com/photo-1587397845856-e6cf49176c70?w=96&h=96&fit=crop&crop=entropy&q=80' },
    { name: 'Ира', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&fit=crop&crop=entropy&q=80' },
    { name: 'Максим', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=96&h=96&fit=crop&crop=entropy&q=80' },
    { name: 'Борис', avatar: 'https://images.unsplash.com/photo-1468218457742-ee484fe2fe4c?w=96&h=96&fit=crop&crop=entropy&q=80' },
  ], []);

  // Данные для секции "Мои продукты" - мемоизируем
  const products = React.useMemo(() => [
    {
      title: '30 500, 16 ₽',
      subtitle: 'Накопительный счёт',
      icon: 'cardFilled' as const,
      iconColor: 'var(--color-green-primary)' as const
    },
    {
      title: '10 234, 32 ₽',
      subtitle: 'Накопительный счёт',
      icon: 'cardFilled' as const,
      iconColor: 'var(--color-green-primary)' as const
    },
    {
      title: '3 421, 12 ₽',
      subtitle: 'Накопительный счёт',
      icon: 'cardFilled' as const,
      iconColor: 'var(--color-green-primary)' as const
    }
  ], []);



  return (
    <div className={styles.main}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.ratingSection}>
          <Text variant="regularS" color="white">
            рейтинг:
          </Text>
          <Badge backgroundColor="var(--color-green-primary)" textColor="var(--color-black)">
            {ratingText}
          </Badge>
        </div>

        {/* Невидимый placeholder для компонента Rating чтобы высота header была как на странице рейтинга */}
        <div className={styles.ratingPlaceholder} />

        <div className={styles.balanceSection} onClick={() => onNavigate('wallet')}>
          <Text variant="currency" color="white" currencyValue={formattedBalance}>
          </Text>
        </div>

        <div className={styles.actionButtons}>
          <IconButton
            icon="qr"
            iconColor="var(--color-white)"
            iconBackgroundColor="var(--color-grey-dark)"
            textColor="var(--color-white)"
            onClick={() => console.log('Сканировать')}
          >
            сканировать
          </IconButton>
          <IconButton
            icon="card"
            iconColor="var(--color-white)"
            iconBackgroundColor="var(--color-grey-dark)"
            textColor="var(--color-white)"
            onClick={() => console.log('На карту')}
          >
            на карту
          </IconButton>
          <IconButton
            icon="phone"
            iconColor="var(--color-white)"
            iconBackgroundColor="var(--color-grey-dark)"
            textColor="var(--color-white)"
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
              iconColor="var(--color-grey)"
              iconBackgroundColor="var(--color-grey-light)"
              titleVariant="regularS"
              onClick={() => console.log('Показать QR-код')}
              className={styles.transferCard}
            />

            <ProductCard
              title="Отправить ссылку"
              icon="link"
              iconColor="var(--color-grey)"
              iconBackgroundColor="var(--color-grey-light)"
              titleVariant="regularS"
              onClick={() => console.log('Отправить ссылку')}
              className={styles.transferCard}
            />

            <ProductCard
              title="Поделиться реквизитами"
              icon="card"
              iconColor="var(--color-grey)"
              iconBackgroundColor="var(--color-grey-light)"
              titleVariant="regularS"
              onClick={() => console.log('Поделиться реквизитами')}
              className={styles.transferCard}
            />

            <ProductCard
              title="Создать сбор"
              icon="gift"
              iconColor="var(--color-grey)"
              iconBackgroundColor="var(--color-grey-light)"
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
                <Text variant="regularS">
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
                iconColor={product.iconColor}
                iconBackgroundColor="var(--color-green-primary)"
                titleVariant="BoldM"
                subtitleVariant="regularS"
                subtitleColor="secondary"
                onClick={() => console.log(`Продукт ${index + 1}`)}
                className={styles.productCard}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
