# Icon Component

Базовый UI-компонент для отображения SVG-иконок.

## Особенности

- Фиксированный размер 36×36 пикселей
- Поддержка `currentColor` для наследования цвета от родителя
- Типизированные имена иконок
- Оптимизированные SVG-файлы

## Использование

```tsx
import { Icon } from '@ui';

// Базовое использование
<Icon name="credit" />

// С кастомным цветом
<Icon name="qr" style={{ color: '#4CAF50' }} />

// В контексте с текстом
<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
  <Icon name="income" style={{ color: '#FF9800' }} />
  <Text variant="HeadingM">Доходы</Text>
</div>
```

## Доступные иконки

- `credit` - иконка кредитной карты
- `qr` - иконка QR-кода
- `income` - иконка дохода/прибыли

## Добавление новых иконок

1. Создайте SVG-файл в `packages/ui/src/assets/icons/`
2. Используйте `currentColor` для цвета
3. Установите размер 36×36 в viewBox
4. Добавьте импорт в `Icon.tsx`
5. Обновите тип `IconName`

## Требования к SVG

- Размер: 36×36 пикселей
- Цвет: используйте `currentColor` для stroke/fill
- Стиль: единообразный (stroke или fill)
- Оптимизация: удалите ненужные атрибуты 