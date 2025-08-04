// packages/ui/preview/App.tsx

import React from 'react';
import { Text, Card, Icon, Avatar, ProductCard } from '../src';

function App() {
  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h1>UI Components Test</h1>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Text Component</h2>
        <Text variant="regularS">Regular Small Text</Text>
        <Text variant="regularM">Regular Medium Text</Text>
        <Text variant="headingS">Heading Small Text</Text>
        <Text variant="headingM">Heading Medium Text</Text>
        <Text variant="headingL">Heading Large Text</Text>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Card Component</h2>
        <Card style={{ marginBottom: '1rem' }}>
          <Text variant="headingM">Active Card</Text>
          <Text variant="regularM">This is an active card with content.</Text>
        </Card>
        <Card isActive={false} style={{ marginBottom: '1rem' }}>
          <Text variant="headingM">Inactive Card</Text>
          <Text variant="regularM">This is an inactive card with content.</Text>
        </Card>
        <Card backgroundColor="#f0f8ff" style={{ marginBottom: '1rem' }}>
          <Text variant="headingM">Custom Background Card</Text>
          <Text variant="regularM">This card has a custom background color.</Text>
        </Card>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Icon Component</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Icon name="credit" />
          <Icon name="qr" />
          <Icon name="income" />
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Avatar Component</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Avatar />
          <Avatar src="https://via.placeholder.com/48" alt="Test Avatar" />
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>ProductCard Component</h2>

        <h3>Финансовые продукты</h3>
        <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
          <ProductCard
            icon="income"
            iconColor="#10B981"
            title="30 500,16 ₽"
            subtitle="Накопительный счёт"
            titleVariant="headingM"
            subtitleVariant="headingS"
            onClick={() => console.log('Накопительный счёт clicked')}
          />

          <ProductCard
            icon="income"
            iconColor="#10B981"
            title="10 234,32 ₽"
            subtitle="Накопительный счёт"
            titleVariant="headingM"
            subtitleVariant="headingS"
            onClick={() => console.log('Второй счёт clicked')}
          />
        </div>

        <h3>Кредитные продукты</h3>
        <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
          <ProductCard
            icon="credit"
            iconColor="#6366F1"
            title="Подключить овердрафт"
            subtitle="Для непредвиденных трат"
            titleVariant="regularM"
            subtitleVariant="regularS"
            onClick={() => console.log('Овердрафт clicked')}
          />

          <ProductCard
            icon="credit"
            iconColor="#6366F1"
            title="Потребительский кредит"
            subtitle="До 5 млн рублей на любые цели"
            titleVariant="regularM"
            subtitleVariant="regularS"
            onClick={() => console.log('Кредит clicked')}
          />

          <ProductCard
            icon="credit"
            iconColor="#6366F1"
            title="Ипотечный кредит"
            subtitle="До 30 млн рублей на покупку жилья"
            titleVariant="regularM"
            subtitleVariant="regularS"
            onClick={() => console.log('Ипотека clicked')}
          />
        </div>

        <h3>Дополнительные услуги</h3>
        <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
          <ProductCard
            icon="qr"
            iconColor="#8B5CF6"
            title="QR-код для оплаты"
            subtitle="Быстрая оплата без карты"
            titleVariant="regularM"
            subtitleVariant="regularS"
            onClick={() => console.log('QR-код clicked')}
          />

          <ProductCard
            icon="qr"
            iconColor="#8B5CF6"
            title="Мобильный банк"
            subtitle="Управление счетами в приложении"
            titleVariant="regularM"
            subtitleVariant="regularS"
            onClick={() => console.log('Мобильный банк clicked')}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
