// packages/ui/preview/App.tsx

import React from 'react';
import { Text, Card, Icon, Avatar } from '../src';

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
    </div>
  );
}

export default App;
