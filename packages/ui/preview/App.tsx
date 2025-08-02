// packages/ui/preview/App.tsx

import React from 'react';
import { Text } from '../src/components/Text';
import { Card } from '../src/components/Card';
import { Icon } from '../src/components/Icon';

export const App = () => {
  return (
    <div style={{ 
      padding: '1rem', 
      backgroundColor: '#F8F9FA', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      {/* Базовый Card */}
      <Card>
        <Text variant="HeadingM">Базовый Card</Text>
        <Text variant="RegularM">Содержимое карточки</Text>
      </Card>

      {/* Card с кастомным цветом */}
      <Card backgroundColor="#E3F2FD">
        <Text variant="HeadingM">Card с кастомным цветом</Text>
        <Text variant="RegularS">Голубой фон</Text>
      </Card>

      {/* Неактивный Card */}
      <Card isActive={false}>
        <Text variant="HeadingM">Неактивный Card</Text>
        <Text variant="RegularS">Reduced opacity</Text>
      </Card>

      {/* Примеры Icon компонента */}
      <Card>
        <Text variant="HeadingM">Icon компоненты</Text>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          alignItems: 'center',
          marginTop: '0.5rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Icon name="credit" style={{ color: '#2196F3' }} />
            <Text variant="RegularS">Credit</Text>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Icon name="qr" style={{ color: '#4CAF50' }} />
            <Text variant="RegularS">QR</Text>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Icon name="income" style={{ color: '#FF9800' }} />
            <Text variant="RegularS">Income</Text>
          </div>
        </div>
      </Card>

      {/* Icon в контексте */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Icon name="credit" style={{ color: '#1976D2' }} />
          <div>
            <Text variant="HeadingM">Кредитная карта</Text>
            <Text variant="RegularS">Основная карта для платежей</Text>
          </div>
        </div>
      </Card>
    </div>
  );
};
