// packages/ui/preview/App.tsx

import React from 'react';
import { Text } from '../src/components/Text';

export const App = () => {
  return (
    <div style={{ padding: 16 }}>
      <Text variant="HeadingL">60 000,34 ₽</Text>
      <Text variant="HeadingM">Открыть вклад</Text>
      <Text variant="HeadingS">Получить перевод</Text>
      <Text variant="RegularM">До 14% годовых</Text>
      <Text variant="RegularS">Показать QR</Text>
    </div>
  );
};
