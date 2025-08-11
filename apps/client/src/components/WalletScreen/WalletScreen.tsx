import React from 'react';
import { Text, IconButton, Icon } from '@packages/ui';
import styles from './WalletScreen.module.css';

export interface WalletScreenProps {
  onNavigate: (screen: string) => void;
  onGoBack?: () => void;
}

interface TransactionItem {
  id: string;
  merchant: string;
  category: string;
  amount: number; // отрицательные — списания, положительные — пополнения
  toName?: string; // для переводов указываем имя получателя
  fromName?: string; // для пополнений указываем отправителя
}

interface TransactionGroup {
  month: string;
  items: TransactionItem[];
}

export const WalletScreen: React.FC<WalletScreenProps> = ({ onNavigate }) => {
  const transactions: TransactionGroup[] = React.useMemo(() => [
    {
      month: 'Октябрь 2025',
      items: [
        { id: 't1', merchant: 'Uber', category: 'такси', amount: -654 },
        { id: 't2', merchant: 'Самокат', category: 'продукты', amount: -1390 },
        { id: 't3', merchant: 'Перевод', category: 'перевод', amount: -5000, toName: 'Иван Петров' },
        { id: 't4', merchant: 'Пополнение', category: 'перевод', amount: 10000, fromName: 'Алексей К.' },
      ],
    },
    {
      month: 'Сентябрь 2025',
      items: [
        { id: 't5', merchant: 'Яндекс.Еда', category: 'кафе и рестораны', amount: -890 },
        { id: 't6', merchant: 'Мосгортранс', category: 'транспорт', amount: -62 },
      ],
    },
    {
      month: 'Август 2025',
      items: [
        { id: 't7', merchant: 'Перевод', category: 'перевод', amount: -2500, toName: 'Мария С.' },
      ],
    },
  ], []);

  const formatAmount = (value: number) => {
    const sign = value < 0 ? '-' : '+';
    const abs = Math.abs(value);
    return `${sign}${abs} ₽`;
  };

  return (
    <div className={styles.walletScreen}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => onNavigate('back')} aria-label="назад">
          <Icon name="back" className={styles.backIcon} />
        </button>
        <div className={styles.topRow}>
          <Text variant="currency" color="white" currencyValue="60 000,34" />
        </div>

        <div className={styles.actionButtons}>
          <IconButton
            icon="plus"
            iconColor="var(--color-white)"
            iconBackgroundColor="var(--color-grey-dark)"
            textColor="var(--color-white)"
            onClick={() => console.log('Пополнить')}
          >
            пополнить
          </IconButton>
          <IconButton
            icon="card"
            iconColor="var(--color-white)"
            iconBackgroundColor="var(--color-grey-dark)"
            textColor="var(--color-white)"
            onClick={() => console.log('Перевести')}
          >
            перевести
          </IconButton>
        </div>
      </div>

      <div className={styles.content}>
        {transactions.map((group) => (
          <div key={group.month} className={styles.monthGroup}>
            <Text variant="regularM" color="secondary" className={styles.monthTitle}>
              {group.month}
            </Text>

            <div className={styles.transactionsList}>
              {group.items.map((item) => (
                <div key={item.id} className={styles.transactionRow}>
                  <div className={styles.transactionLeft}>
                    <div className={styles.iconContainer}>
                      <Icon name="card" className={styles.icon} />
                    </div>
                    <div className={styles.textContainer}>
                      <Text variant="regularM" color="primary" className={styles.title}>
                        {item.toName ? item.toName : item.fromName ? item.fromName : item.merchant}
                      </Text>
                      <Text variant="regularS" color="secondary" className={styles.subtitle}>
                        {(item.toName || item.fromName) ? 'перевод' : item.category}
                      </Text>
                    </div>
                  </div>

                  <Text
                    variant="regularM"
                    className={item.amount < 0 ? styles.amountNegative : styles.amountPositive}
                  >
                    {formatAmount(item.amount)}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

