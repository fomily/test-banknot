---
applyContext: frontend
---

# 📱 Frontend: Layout и адаптивная вёрстка

Этот файл описывает правила адаптивной вёрстки для веб-приложения (desktop) с учетом будущего WebView (iOS/Android): responsive дизайн, media queries, CSS modules, и best practices.

## Платформы и размеры экранов

Приложение работает как **веб-приложение** с поддержкой:
- **Десктоп** (текущая версия)
- **WebView на iOS/Android** (будущая версия)

### Поддерживаемые размеры экранов:

- **Минимальная ширина**: 320px (mobile)
- **Максимальная ширина контента**: 1200px (desktop)
- **Breakpoints**:
  - Mobile: 320px - 767px
  - Tablet: 768px - 1023px
  - Desktop: 1024px+

**КРИТИЧЕСКИ ВАЖНО:** Компоненты должны корректно отображаться на ВСЕХ размерах от 320px до 1920px+!

## Responsive Layout

### ✅ Используй:

1. **Flexbox** для layout
2. **Grid** для сложных макетов
3. **gap** для отступов между элементами
4. **max-width** для ограничения контента на больших экранах
5. **Media queries** для адаптации под разные размеры

### ❌ Избегай:

1. **Фиксированные px** для размеров контейнеров (используй %)
2. **Только desktop-first** или **только mobile-first** подход
3. **position: absolute** - только в крайнем случае
4. **Фиксированные breakpoints** без гибкости

## Breakpoints

**Используй единые breakpoints во всём приложении:**

```css
/* Mobile: базовые стили (mobile-first) */
/* 320px - 767px */

/* Tablet */
@media (min-width: 768px) {
  /* Стили для планшетов */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Стили для десктопа */
}

/* Large Desktop (опционально) */
@media (min-width: 1440px) {
  /* Стили для больших экранов */
}
```

### Рекомендуемые значения:

- **Mobile**: базовые стили (без media query)
- **Tablet**: `@media (min-width: 768px)`
- **Desktop**: `@media (min-width: 1024px)`
- **Large**: `@media (min-width: 1440px)` (опционально)

### Max-width для контента:

- **Mobile**: 100% (без ограничения)
- **Desktop**: 1200px (рекомендуется)
- **Large Desktop**: 1400px (опционально)

## Единицы измерения

### Шрифты и отступы:

- **rem** или **%** для размеров текста
- **rem** для padding/margin
- **gap** для отступов между элементами flex/grid

### Фиксированные px (только для):

- **Иконки**: 36x36px (по умолчанию)
- **Аватары**: 48x48px (по умолчанию)
- **Минимальные touch-targets**: 44x44px

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

### Адаптивная типографика (опционально):

Если нужны разные размеры текста на разных экранах, используй media queries в CSS Module:

```css
.title {
  font-size: 1.5rem; /* Mobile */
}

@media (min-width: 1024px) {
  .title {
    font-size: 2rem; /* Desktop */
  }
}
```

**Но в большинстве случаев достаточно стандартных вариантов Text компонента!**

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

## Media Queries

**Используй Mobile-First подход** для лучшей производительности и поддержки будущего WebView.

### Базовый подход:

```css
/* Mobile-first: сначала стили для мобильных */
.container {
  padding: 1rem;
  width: 100%;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 1.5rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### Ограничение контента на больших экранах:

```css
.contentWrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* На мобильных - меньше padding */
@media (max-width: 767px) {
  .contentWrapper {
    padding: 0 1rem;
  }
}
```

### Адаптивные Grid/Flex:

```css
.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr; /* Mobile: 1 колонка */
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr); /* Tablet: 2 колонки */
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr); /* Desktop: 3 колонки */
    gap: 1.5rem;
  }
}
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

## Платформо-зависимые стили

### Desktop и Mobile совместимость:

**Поддерживай ОБЕИХ платформы одновременно:**

```css
.button {
  /* Touch-friendly размеры для mobile */
  min-height: 44px;
  min-width: 44px;

  /* Desktop hover (не влияет на mobile) */
  transition: opacity 0.2s, transform 0.1s;
  cursor: pointer;
}

/* Desktop hover */
@media (hover: hover) and (pointer: fine) {
  .button:hover {
    opacity: 0.8;
  }
}

/* Mobile/Touch active state */
.button:active {
  opacity: 0.7;
  transform: scale(0.98);
}
```

### Media queries для определения возможностей:

```css
/* Только для устройств с hover (desktop) */
@media (hover: hover) and (pointer: fine) {
  .card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

/* Для touch-устройств */
@media (hover: none) and (pointer: coarse) {
  .card:active {
    opacity: 0.9;
  }
}
```

### ✅ DO:

1. **Используй :hover** с media query `@media (hover: hover)`
2. **Используй :active** для touch feedback
3. **Используй cursor: pointer** (игнорируется на mobile)
4. **Touch-friendly размеры** (минимум 44x44px для кликабельных)
5. **Тестируй на mobile И desktop**

### ❌ DON'T:

1. **НЕ забывай про touch-устройства** при добавлении hover
2. **НЕ делай hover единственным способом** доступа к функциям
3. **НЕ используй слишком мелкие кликабельные элементы** (<44px)

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

1. Используй **Mobile-First** подход с media queries
2. Используй **flex/grid** для layout
3. Используй **rem/%** для размеров
4. Используй **CSS Modules** для стилей
5. Используй **глобальные CSS переменные** для цветов
6. Используй **компонент Text** для текста
7. **Ограничивай контент** на больших экранах (max-width: 1200px)
8. Тестируй на ширине от **320px до 1920px+**
9. Используй **gap** вместо margin между элементами
10. Используй **@media (hover: hover)** для desktop hover states
11. Делай **touch-friendly** интерфейсы (минимум 44px для кликабельных)
12. Центрируй контент на desktop через **margin: 0 auto**

### ❌ DON'T:

1. НЕ используй **inline styles**
2. НЕ создавай **новые text стили** (используй Text component)
3. НЕ создавай **новые цвета** без согласования
4. НЕ используй **position: absolute** без необходимости
5. НЕ используй **:hover без @media (hover: hover)**
6. НЕ используй **фиксированные px для контейнеров**
7. НЕ забывай про **адаптивность** - тестируй на всех размерах
8. НЕ используй **heavy UI libraries** (только кастомные компоненты)
9. НЕ делай **hover единственным способом** взаимодействия

## Examples

### Адаптивный container с центрированием:

```css
/* Screen.module.css */
.container {
  /* Mobile-first: базовые стили */
  width: 100%;
  padding: 1rem;
}

/* Desktop: центрирование и ограничение ширины */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
}
```

### Адаптивная grid с разным количеством колонок:

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
  width: 100%;
  padding: 1rem;
}

.grid {
  display: grid;
  gap: 1rem;
  /* Mobile: 1 колонка */
  grid-template-columns: 1fr;
}

/* Tablet: 2 колонки */
@media (min-width: 768px) {
  .container {
    padding: 1.5rem;
  }

  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 3 колонки + центрирование */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}
```

### Flex layout с hover states для desktop:

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
  padding: 1rem;
  width: 100%;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

/* Desktop */
@media (min-width: 1024px) {
  .header {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.5rem;
  }
}
```

### Кнопка с поддержкой desktop и mobile:

```css
.button {
  /* Базовые стили для всех платформ */
  min-height: 44px;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  background-color: var(--color-primary);
  color: white;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}

/* Desktop hover */
@media (hover: hover) and (pointer: fine) {
  .button:hover {
    opacity: 0.9;
  }
}

/* Mobile/Touch active */
.button:active {
  opacity: 0.7;
  transform: scale(0.98);
}

/* Desktop: можно увеличить */
@media (min-width: 1024px) {
  .button {
    min-height: 48px;
    padding: 1rem 2rem;
  }
}
```

---

**Следуй этим правилам для консистентной и адаптивной вёрстки!**

