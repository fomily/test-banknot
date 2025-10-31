import React from 'react';
import styles from './LandingScreen.module.css';
import { Text } from '@packages/ui/components/Text';
import { Card } from '@packages/ui/components/Card';

export const LandingScreen: React.FC = () => {
  const handleNavigateToAuth = () => {
    window.location.hash = '/auth';
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Text variant="headingM" color="primary">Banknot</Text>
        <button className={styles.loginButton} onClick={handleNavigateToAuth}>
          Войти
        </button>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <Text variant="headingL" as="div" className={styles.heroTitle}>
          Кошелёк с прозрачными транзакциями и быстрым пополнением
        </Text>

        <button className={styles.ctaButton} onClick={handleNavigateToAuth}>
          Открыть кошелек
        </button>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefits}>
        <div className={styles.benefitsContainer}>
        <Text variant="headingM" as="div" className={styles.benefitsTitle}>
          Преимущества Banknot
        </Text>

        <div className={styles.benefitsGrid}>
          <Card className={styles.benefitCard}>
            <div className={styles.benefitIcon}>🔒</div>
            <Text variant="headingS" as="div" className={styles.benefitTitle}>
              Безопасно
            </Text>
            <Text variant="regularM" color="secondary" className={styles.benefitDescription}>
              Защита данных и средств на высоком уровне
            </Text>
          </Card>

          <Card className={styles.benefitCard}>
            <div className={styles.benefitIcon}>⚡</div>
            <Text variant="headingS" as="div" className={styles.benefitTitle}>
              Быстро
            </Text>
            <Text variant="regularM" color="secondary" className={styles.benefitDescription}>
              Мгновенные транзакции и пополнение
            </Text>
          </Card>

          <Card className={styles.benefitCard}>
            <div className={styles.benefitIcon}>👁️</div>
            <Text variant="headingS" as="div" className={styles.benefitTitle}>
              Прозрачно
            </Text>
            <Text variant="regularM" color="secondary" className={styles.benefitDescription}>
              Полная история операций и понятные условия
            </Text>
          </Card>

          <Card className={styles.benefitCard}>
            <div className={styles.benefitIcon}>🎁</div>
            <Text variant="headingS" as="div" className={styles.benefitTitle}>
              Выгодно
            </Text>
            <Text variant="regularM" color="secondary" className={styles.benefitDescription}>
              Система рейтинга с кешбэком и бонусами
            </Text>
          </Card>
        </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="#" className={styles.footerLink}>
            Политика конфиденциальности
          </a>
          <a href="#" className={styles.footerLink}>
            Оферта
          </a>
          <a href="#" className={styles.footerLink}>
            Контакты
          </a>
        </div>
        <Text variant="regularS" color="secondary" className={styles.footerCopyright}>
          © 2025 Banknot. Все права защищены.
        </Text>
      </footer>
    </div>
  );
};

