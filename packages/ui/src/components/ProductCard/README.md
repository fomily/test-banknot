# ProductCard

Составной компонент для отображения продуктовых карточек в мобильном приложении банка.

## Особенности

- 🏗️ **Гибкая композиция**: иконка + заголовок + подзаголовок в любых комбинациях
- 📱 **Адаптивный**: корректно отображается на экранах 320-500px
- 🎨 **Настраиваемый**: различные варианты текста и цвета иконок
- ♿ **Доступный**: поддержка состояний активности
- 🔧 **Grid layout**: современная CSS Grid разметка

## API

```typescript
interface ProductCardProps {
  // Контент
  title: string;                    // Основной заголовок
  subtitle?: string;                // Дополнительный подзаголовок
  icon?: IconName;                  // Иконка ('credit' | 'qr' | 'income')

  // Стилизация
  titleVariant?: TextVariant;       // Стиль заголовка
  subtitleVariant?: TextVariant;    // Стиль подзаголовка
  iconColor?: string;               // Цвет иконки

  // Состояние
  isActive?: boolean;               // Активность карточки
  backgroundColor?: string;         // Цвет фона

  // Обработчики
  onClick?: () => void;
}
```

## Варианты использования

### Финансовые продукты с суммами
```tsx
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

### Кредитные продукты
```tsx
<ProductCard
  icon="credit"
  iconColor="#6366F1"
  title="Потребительский кредит"
  subtitle="До 5 млн рублей на любые цели"
  titleVariant="regularM"
  subtitleVariant="regularS"
/>
```

### Неактивные продукты
```tsx
<ProductCard
  title="Ипотека"
  subtitle="Необходимо повысить рейтинг кошелька"
  isActive={false}
/>
```

### Только заголовок
```tsx
<ProductCard
  title="Отправить ссылку"
  titleVariant="regularM"
/>
```

### Платежные действия
```tsx
<ProductCard
  icon="qr"
  iconColor="#F59E0B"
  title="Показать QR-код"
  titleVariant="regularM"
/>
```

## CSS Grid Layout

Компонент использует CSS Grid для гибкого позиционирования:

- **С иконкой**: `grid-template-columns: auto 1fr`
- **Без иконки**: `grid-template-columns: 1fr`
- **Отступы**: `gap: 1rem` между иконкой и текстом, `gap: 0.25rem` между заголовком и подзаголовком

## Доступные иконки

- `credit` - иконка кредитной карты (синий #6366F1)
- `income` - стрелка вверх (зеленый #10B981)
- `qr` - QR код (оранжевый #F59E0B)

## Варианты текста

- `regularS` - мелкий текст
- `regularM` - обычный текст
- `headingS` - мелкий заголовок (серый)
- `headingM` - средний заголовок
- `headingL` - крупный заголовок

## Адаптивность

- Автоматически подстраивается под ширину контейнера
- На экранах < 360px уменьшаются отступы
- Использует relative единицы (rem, %)
- Flex-shrink для корректного поведения иконки
