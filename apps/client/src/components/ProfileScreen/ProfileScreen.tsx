import React from 'react';
import {
  Text,
  Avatar,
  Badge,
  ProductCard
} from '@packages/ui';
import styles from './ProfileScreen.module.css';

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
  displayName?: string;
  email?: string;
  avatarUrl?: string;
  ratingLevel?: number;
  onLogout?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onNavigate,
  displayName,
  email,
  avatarUrl,
  ratingLevel = 3,
  onLogout
}) => {
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

  // Данные пользователя - мемоизируем
  const userData = React.useMemo(() => ({
    name: displayName || email || 'Пользователь',
    avatar: avatarUrl as string | undefined,
    rating: getRatingText(ratingLevel),
    ratingColor: 'var(--color-green-primary)'
  }), [displayName, email, avatarUrl, ratingLevel]);

  // Список действий профиля - мемоизируем
  const profileActions = React.useMemo(() => [
    {
      title: 'Редактировать паспортные данные',
      subtitle: 'Изменить личную информацию',
      icon: 'edit' as const,
      onClick: () => console.log('Редактировать паспортные данные')
    },
    {
      title: 'Привязать профиль Госуслуги',
      subtitle: 'Упростить процесс идентификации',
      icon: 'link' as const,
      onClick: () => console.log('Привязать Госуслуги')
    },
    {
      title: 'Настройки',
      subtitle: 'Управление аккаунтом и безопасность',
      icon: 'settings' as const,
      onClick: () => console.log('Настройки')
    },
    {
      title: 'Формирование справок',
      subtitle: 'Заказать документы и справки',
      icon: 'document' as const,
      onClick: () => console.log('Формирование справок')
    },
    {
      title: 'Чат с банком',
      subtitle: 'Онлайн поддержка и консультации',
      icon: 'chat' as const,
      onClick: () => console.log('Чат с банком')
    },
    {
      title: 'Выйти',
      subtitle: 'Завершить текущий сеанс',
      icon: 'logout' as const,
      onClick: () => onLogout?.()
    }
  ], [onLogout]);

  return (
    <div className={styles.profileScreen}>
      {/* Header Section */}
      <div className={styles.header}>
        {/* Информация о пользователе */}
        <div className={styles.userInfo}>
          <Avatar
            src={userData.avatar}
            alt={userData.name}
            className={styles.userAvatar}
          />
          <div className={styles.userDetails}>
            <Text variant="headingM" color="white" className={styles.userName}>
              {userData.name}
            </Text>
            <div className={styles.ratingContainer}>
              <Text variant="regularS" color="white">
                рейтинг:
              </Text>
              <Badge backgroundColor="var(--color-green-primary)" textColor="var(--color-black)">
                {userData.rating}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        {/* Управление профилем */}
        <div className={styles.section}>
          <Text variant="regularM" color="secondary" className={styles.sectionTitle}>
            Управление профилем
          </Text>
          <div className={styles.actionsList}>
            {profileActions.map((action, index) => (
              <ProductCard
                key={index}
                title={action.title}
                subtitle={action.subtitle}
                icon={action.icon}
                iconColor="var(--color-green-dark)"
                iconBackgroundColor="var(--color-green-light)"
                titleVariant="regularM"
                subtitleVariant="regularS"
                subtitleColor="secondary"
                onClick={action.onClick}
                className={styles.actionCard}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
