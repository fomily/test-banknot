// packages/ui/preview/App.tsx

import React from 'react';
import { Text } from '../src/components/Text';
import { Card } from '../src/components/Card';
import { Icon } from '../src/components/Icon';
import { Avatar } from '../src/components/Avatar';

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

      {/* Avatar компоненты */}
      <Card>
        <Text variant="HeadingM">Avatar компоненты</Text>
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          marginTop: '0.5rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Avatar />
            <Text variant="RegularS">Без изображения</Text>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Avatar src="https://via.placeholder.com/48x48/2196F3/FFFFFF?text=U" alt="User" />
            <Text variant="RegularS">С изображением</Text>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Avatar src="https://invalid-url.com/avatar.jpg" alt="Invalid" />
            <Text variant="RegularS">Ошибка загрузки</Text>
          </div>
        </div>
      </Card>

      {/* Avatar в контексте */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Avatar src="https://via.placeholder.com/48x48/4CAF50/FFFFFF?text=И" alt="Иван" />
          <div>
            <Text variant="HeadingM">Иван Петров</Text>
            <Text variant="RegularS">+7 (999) 123-45-67</Text>
          </div>
        </div>
      </Card>

      {/* Список аватаров (как в избранном) */}
      <Card>
        <Text variant="HeadingM">Избранные контакты</Text>
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          marginTop: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', minWidth: 'fit-content' }}>
            <Avatar src="https://via.placeholder.com/48x48/FF5722/FFFFFF?text=В" alt="Вероника" />
            <Text variant="RegularS">Вероника</Text>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', minWidth: 'fit-content' }}>
            <Avatar src="https://via.placeholder.com/48x48/9C27B0/FFFFFF?text=Т" alt="Татьяна" />
            <Text variant="RegularS">Татьяна</Text>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', minWidth: 'fit-content' }}>
            <Avatar src="https://via.placeholder.com/48x48/607D8B/FFFFFF?text=П" alt="Паша" />
            <Text variant="RegularS">Паша</Text>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', minWidth: 'fit-content' }}>
            <Avatar src="https://via.placeholder.com/48x48/795548/FFFFFF?text=И" alt="Ира" />
            <Text variant="RegularS">Ира</Text>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', minWidth: 'fit-content' }}>
            <Avatar src="https://via.placeholder.com/48x48/3F51B5/FFFFFF?text=М" alt="Мяо Ли" />
            <Text variant="RegularS">Мяо Ли</Text>
          </div>
        </div>
      </Card>
    </div>
  );
};
