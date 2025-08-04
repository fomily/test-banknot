# UI Package

Пакет UI компонентов с глобальной системой шрифтов.

## Глобальная система шрифтов

Этот пакет использует глобальную систему шрифтов с шрифтом Commissioner. Все компоненты автоматически используют глобальные настройки шрифтов.

### Подключение

Глобальные стили автоматически подключаются при импорте UI пакета:

```typescript
import '@ui'; // Подключает глобальные стили
```

### Использование в приложениях

В вашем приложении просто импортируйте UI пакет:

```typescript
// В main.tsx или index.ts
import '@ui';

// Или в компоненте
import { Text, Card } from '@ui';
```

## Компоненты

### Text
Компонент для отображения текста с предустановленными стилями:

```typescript
import { Text } from '@ui';

<Text variant="headingM">Заголовок</Text>
<Text variant="regularM">Обычный текст</Text>
```

### Card
Компонент карточки:

```typescript
import { Card } from '@ui';

<Card>
  <Text variant="headingM">Заголовок карточки</Text>
  <Text variant="regularM">Содержимое карточки</Text>
</Card>
```

### Icon
Компонент иконки:

```typescript
import { Icon } from '@ui';

<Icon name="credit" />
<Icon name="income" />
<Icon name="qr" />
```

### Avatar
Компонент аватара:

```typescript
import { Avatar } from '@ui';

<Avatar />
<Avatar src="https://example.com/avatar.jpg" alt="User Avatar" />
```

### ProductCard
Компонент карточки продукта:

```typescript
import { ProductCard } from '@ui';

<ProductCard
  icon="income"
  iconColor="#10B981"
  title="30 500,16 ₽"
  subtitle="Накопительный счёт"
  titleVariant="headingM"
  subtitleVariant="headingS"
  onClick={() => console.log('Clicked')}
/>
```

## Утилиты для работы с шрифтами

### CSS переменные
Все настройки шрифтов доступны через CSS переменные:

```css
.myComponent {
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
}
```

### JavaScript утилиты
Для работы с шрифтами в JavaScript:

```typescript
import { getFontStyles, textStyles } from '@ui';

// Создание стилей программно
const styles = getFontStyles({
  weight: 'medium',
  size: 'lg',
  lineHeight: 'relaxed'
});

// Использование предустановленных стилей
const headingStyle = textStyles.headingM;
```

## Разработка

### Запуск preview
```bash
npm run dev
```

### Сборка
```bash
npm run build
```

## Архитектура

- **Глобальные стили**: `src/styles/global.css`
- **Утилиты шрифтов**: `src/utils/fonts.ts`
- **Компоненты**: `src/components/`
- **Типы**: Экспортируются из каждого компонента

Все компоненты следуют принципам Clean Architecture и используют CSS модули для стилизации.
