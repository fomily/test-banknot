---
alwaysApply: true
---

# 📱 Frontend: Layout и адаптивная вёрстка

Этот файл описывает правила вёрстки для WebView приложения: responsive дизайн, CSS modules, и best practices.

## WebView Requirements

Приложение работает как **WebView** на iOS и Android.

### Поддерживаемые размеры экранов:

- **Минимальная ширина**: 320px
- **Максимальная ширина**: 500px
- **Ориентация**: portrait (вертикальная)

**КРИТИЧЕСКИ ВАЖНО:** Компоненты должны корректно отображаться на ВСЕХ размерах от 320px до 500px!

## Responsive Layout

### ✅ Используй:

1. **Flexbox** для layout
2. **Grid** для сложных макетов
3. **gap** для отступов между элементами
4. **width: 100%** для контейнеров

### ❌ Избегай:

1. **Фиксированные px** для размеров контейнеров
2. **Media queries** - не нужны (диапазон 320-500px)
3. **position: absolute** - только в крайнем случае
4. **:hover** и **:focus-visible** - не поддерживаются в mobile

## Единицы измерения

### Шрифты и отступы:

- **rem** или **%** для размеров текста
- **rem** для padding/margin
- **gap** для отступов между элементами flex/grid

### Фиксированные px (только для):

- **Иконки**: 36x36px (по умолчанию)
- **Аватары**: 48x48px (по умолчанию)

**Эти размеры можно переопределить через props, но дефолты фиксированы.**

## CSS Modules

**ВСЕГДА используй CSS Modules** для стилизации компонентов.

### ✅ Правильно:

```tsx
// Component.module.css
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  width: 100%;
}

.title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

// Component.tsx
import styles from './Component.module.css'

export const Component = () => (
  <div className={styles.container}>
    <h2 className={styles.title}>Title</h2>
  </div>
)
```

### ❌ Неправильно:

```tsx
// НЕ ДЕЛАТЬ ТАК! (inline styles)
<div style={{ display: 'flex', gap: '1rem' }}>
  <h2 style={{ fontSize: '1.5rem' }}>Title</h2>
</div>
```

## Layout Patterns

### Container (полная ширина):

```css
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1.5rem;
  gap: 1rem;
}
```

### Flexbox layout:

```css
.row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

### Grid layout:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}
```

### Центрирование:

```css
/* Flexbox */
.centered {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Grid */
.centeredGrid {
  display: grid;
  place-items: center;
}
```

## Typography

### НЕ создавай новые text styles!

Используй компонент **Text** из `@packages/ui` с готовыми вариантами:

```tsx
import { Text } from '@packages/ui'

<Text variant="headingL" color="primary">Заголовок</Text>
<Text variant="bodyM" color="secondary">Текст</Text>
<Text variant="caption" color="tertiary">Подпись</Text>
```

### Доступные варианты Text:

- `headingL` - крупный заголовок
- `headingM` - средний заголовок
- `headingS` - мелкий заголовок
- `bodyL` - крупный текст
- `bodyM` - обычный текст (по умолчанию)
- `bodyS` - мелкий текст
- `caption` - подпись

**Если нужен новый вариант** - добавь его в компонент Text в `@packages/ui`, НЕ создавай отдельный стиль!

## Commissioner Font

Шрифт **Commissioner** загружен глобально и доступен во всём приложении.

```css
/* Уже применён глобально, не нужно указывать */
body {
  font-family: 'Commissioner', sans-serif;
}
```

## Colors

### Используй только глобальные CSS переменные!

```css
.element {
  color: var(--color-text-primary);
  background-color: var(--color-bg-primary);
  border-color: var(--color-border);
}
```

### Доступные цвета (из packages/ui/src/styles/colors.css):

**Text:**
- `--color-text-primary`
- `--color-text-secondary`
- `--color-text-tertiary`
- `--color-text-inverse`

**Background:**
- `--color-bg-primary`
- `--color-bg-secondary`
- `--color-bg-tertiary`

**Border:**
- `--color-border`
- `--color-border-light`

**Brand:**
- `--color-primary`
- `--color-secondary`
- `--color-accent`

**Status:**
- `--color-success`
- `--color-error`
- `--color-warning`
- `--color-info`

**ВАЖНО:** Если нужен новый цвет - **спроси у разработчика** перед созданием!

## Icons и Avatars

### Иконки (по умолчанию 36x36px):

```tsx
import { Icon } from '@packages/ui'

<Icon name="qr" />                      // 36x36px
<Icon name="qr" size={24} />           // Кастомный размер
```

### Аватары (по умолчанию 48x48px):

```tsx
import { Avatar } from '@packages/ui'

<Avatar src="/avatars/user.png" />     // 48x48px
<Avatar src="/avatars/user.png" size={64} /> // Кастомный размер
```

## Position: Absolute

**Избегай position: absolute** везде, где возможно!

### ✅ Используй flex/grid:

```css
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

### ⚠️ Используй absolute только если:

- Оверлеи (модальные окна)
- Бейджи на иконках
- Позиционирование поверх контента (с пониманием последствий)

```css
.badge {
  position: absolute;
  top: -4px;
  right: -4px;
}
```

## Mobile-specific Rules

### ❌ НЕ используй:

1. **:hover** - не работает на touch устройствах
2. **:focus-visible** - избыточно для mobile
3. **cursor: pointer** - не нужно (touch events)

### ✅ Используй:

1. **Active states** через `:active`
2. **Touch-friendly** размеры кнопок (минимум 44x44px)
3. **Visual feedback** при нажатии

```css
.button {
  min-height: 44px;
  min-width: 44px;
}

.button:active {
  opacity: 0.7;
  transform: scale(0.98);
}
```

## Spacing System

Используй rem для отступов (базовый размер = 16px):

- `0.25rem` = 4px
- `0.5rem` = 8px
- `0.75rem` = 12px
- `1rem` = 16px
- `1.5rem` = 24px
- `2rem` = 32px
- `3rem` = 48px

```css
.container {
  padding: 1.5rem;      /* 24px */
  gap: 1rem;            /* 16px */
  margin-bottom: 2rem;  /* 32px */
}
```

## Component Structure

### Структура файлов компонента:

```
ComponentName/
├── ComponentName.tsx           # React компонент
├── ComponentName.module.css    # Стили CSS Module
├── index.ts                    # Экспорт
└── README.md                   # Документация (опционально)
```

### Пример компонента:

```tsx
// Card.tsx
import styles from './Card.module.css'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export const Card = ({ children, className }: CardProps) => (
  <div className={`${styles.card} ${className || ''}`}>
    {children}
  </div>
)
```

```css
/* Card.module.css */
.card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  background-color: var(--color-bg-secondary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

## Best Practices

### ✅ DO:

1. Используй flex/grid для layout
2. Используй rem/% для размеров
3. Используй CSS Modules для стилей
4. Используй глобальные CSS переменные для цветов
5. Используй компонент Text для текста
6. Тестируй на ширине от 320px до 500px
7. Используй gap вместо margin между элементами
8. Делай touch-friendly интерфейсы (минимум 44px для кликабельных элементов)

### ❌ DON'T:

1. НЕ используй inline styles
2. НЕ создавай новые text стили (используй Text component)
3. НЕ создавай новые цвета без согласования
4. НЕ используй position: absolute без необходимости
5. НЕ используй :hover/:focus-visible
6. НЕ используй фиксированные px для контейнеров
7. НЕ используй media queries (не нужны)
8. НЕ используй heavy UI libraries (только кастомные компоненты)

## Examples

### Responsive card grid:

```tsx
import styles from './ProductsScreen.module.css'
import { ProductCard } from '@packages/ui'

export const ProductsScreen = ({ products }) => (
  <div className={styles.container}>
    <div className={styles.grid}>
      {products.map(product => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  </div>
)
```

```css
/* ProductsScreen.module.css */
.container {
  padding: 1.5rem;
  width: 100%;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}
```

### Flex layout with proper spacing:

```tsx
import styles from './Header.module.css'
import { Avatar, Text } from '@packages/ui'

export const Header = ({ user }) => (
  <header className={styles.header}>
    <Avatar src={user.avatar} />
    <div className={styles.info}>
      <Text variant="headingM">{user.name}</Text>
      <Text variant="bodyS" color="secondary">{user.email}</Text>
    </div>
  </header>
)
```

```css
/* Header.module.css */
.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  width: 100%;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}
```

---

**Следуй этим правилам для консистентной и адаптивной вёрстки!**

