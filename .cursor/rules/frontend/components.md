---
applyContext: frontend
---

# 🧱 Frontend: UI Компоненты

Этот файл описывает правила работы с UI компонентами из `@packages/ui`, их переиспользование и создание новых.

## Использование существующих компонентов

**КРИТИЧЕСКИ ВАЖНО:** ВСЕГДА используй существующие компоненты из `@packages/ui`!

```tsx
import { Text, Avatar, Badge, Card, Icon, IconButton, ListItem, Menu, ProductCard, Rating } from '@packages/ui'
```

### НЕ создавай новые компоненты без необходимости!

Перед созданием нового компонента:
1. Проверь доступные компоненты в `@packages/ui`
2. Можно ли использовать существующий с другими props?
3. Можно ли композировать из существующих?

## Доступные компоненты

### Text - Текстовые элементы

**НИКОГДА не создавай новые text стили!** Используй только варианты Text компонента.

```tsx
import { Text } from '@packages/ui'

// Варианты:
<Text variant="headingL">Крупный заголовок</Text>
<Text variant="headingM">Средний заголовок</Text>
<Text variant="headingS">Мелкий заголовок</Text>
<Text variant="bodyL">Крупный текст</Text>
<Text variant="bodyM">Обычный текст</Text>
<Text variant="bodyS">Мелкий текст</Text>
<Text variant="caption">Подпись</Text>

// Цвета:
<Text color="primary">Основной</Text>
<Text color="secondary">Вторичный</Text>
<Text color="tertiary">Третичный</Text>
<Text color="inverse">Инверсный</Text>
<Text color="error">Ошибка</Text>
<Text color="success">Успех</Text>

// Выравнивание:
<Text align="left">Слева</Text>
<Text align="center">По центру</Text>
<Text align="right">Справа</Text>

// Кастомный элемент:
<Text as="h1" variant="headingL">Заголовок H1</Text>
<Text as="p" variant="bodyM">Параграф</Text>
```

**Если нужен новый variant:**
1. Добавь его в `packages/ui/src/components/Text/Text.module.css`
2. Обнови типы в `Text.tsx`
3. НЕ создавай отдельный компонент!

### Avatar - Аватары пользователей

```tsx
import { Avatar } from '@packages/ui'

// По умолчанию 48x48px
<Avatar src="/avatars/user1.png" alt="User Name" />

// Кастомный размер
<Avatar src="/avatars/user1.png" size={64} />

// Placeholder (если нет src)
<Avatar alt="User Name" />
```

### Badge - Метки и бейджи

```tsx
import { Badge } from '@packages/ui'

<Badge variant="primary">Основной</Badge>
<Badge variant="secondary">Вторичный</Badge>
<Badge variant="success">Успех</Badge>
<Badge variant="error">Ошибка</Badge>
<Badge variant="warning">Предупреждение</Badge>

// С иконкой
<Badge icon="star">Избранное</Badge>
```

### Card - Карточки контента

```tsx
import { Card } from '@packages/ui'

<Card>
  <Text variant="headingM">Заголовок</Text>
  <Text variant="bodyM">Содержимое карточки</Text>
</Card>

// С onClick
<Card onClick={() => console.log('clicked')}>
  Кликабельная карточка
</Card>

// С кастомным className
<Card className={styles.customCard}>
  ...
</Card>
```

### Icon - Иконки

```tsx
import { Icon } from '@packages/ui'

// По умолчанию 36x36px
<Icon name="qr" />

// Кастомный размер
<Icon name="qr" size={24} />

// С цветом
<Icon name="qr" color="var(--color-primary)" />
```

**Доступные иконки:** проверь в `packages/ui/src/assets/icons/`

### IconButton - Кнопки с иконками

```tsx
import { IconButton } from '@packages/ui'

<IconButton icon="qr" onClick={handleClick}>
  Сканировать QR
</IconButton>

// Только иконка (без текста)
<IconButton icon="qr" onClick={handleClick} />

// Варианты:
<IconButton variant="primary" icon="qr">Основная</IconButton>
<IconButton variant="secondary" icon="qr">Вторичная</IconButton>
<IconButton variant="ghost" icon="qr">Призрачная</IconButton>
```

### ListItem - Элементы списка

```tsx
import { ListItem } from '@packages/ui'

<ListItem
  title="Заголовок"
  subtitle="Подзаголовок"
  icon="user"
  onClick={handleClick}
/>

// С правым контентом
<ListItem
  title="Настройки"
  icon="settings"
  rightContent={<Icon name="chevron-right" />}
/>

// С аватаром
<ListItem
  title="Иван Иванов"
  subtitle="ivan@example.com"
  avatar="/avatars/user1.png"
/>
```

### Menu - Навигационные меню

```tsx
import { Menu } from '@packages/ui'

const menuItems = [
  { id: 'main', label: 'Главная', icon: 'home' },
  { id: 'products', label: 'Продукты', icon: 'card' },
  { id: 'profile', label: 'Профиль', icon: 'user' }
]

<Menu
  items={menuItems}
  activeId="main"
  onItemClick={(id) => console.log(id)}
/>
```

### ProductCard - Карточки продуктов

```tsx
import { ProductCard } from '@packages/ui'

<ProductCard
  name="Накопительный счёт"
  description="До 10% годовых"
  icon="savings"
  isEnabled={true}
  onClick={handleOpenProduct}
/>

// Disabled продукт
<ProductCard
  name="Ипотека"
  description="Недоступно"
  icon="home"
  isEnabled={false}
/>
```

### Rating - Рейтинг пользователя

```tsx
import { Rating } from '@packages/ui'

// Уровень от 1 до 5
<Rating level={3} />
<Rating level={5} />

// С подписью
<Rating level={3} showLabel />
```

## Правила компонентов

### ✅ DO:

1. **Используй существующие компоненты** из `@packages/ui`
2. **Компоненты БЕЗ бизнес-логики** - только представление
3. **Props для конфигурации** - передавай данные через props
4. **Event forwarding** - пробрасывай события наверх
5. **Композиция** - собирай сложные UI из простых компонентов
6. **TypeScript** - строго типизируй props

### ❌ DON'T:

1. **НЕ создавай новые компоненты** без необходимости
2. **НЕ добавляй бизнес-логику** в UI компоненты
3. **НЕ делай API вызовы** внутри компонентов
4. **НЕ создавай новые text стили** - используй Text варианты
5. **НЕ создавай новые цвета** - используй глобальные CSS variables
6. **НЕ используй inline styles** - только CSS Modules

## Композиция компонентов

### Пример: Создание экрана из компонентов

```tsx
import { Text, Card, Avatar, Badge, ListItem } from '@packages/ui'
import styles from './ProfileScreen.module.css'

export const ProfileScreen = ({ user }) => (
  <div className={styles.container}>
    {/* Header */}
    <Card className={styles.header}>
      <Avatar src={user.avatar} size={64} />
      <div className={styles.userInfo}>
        <Text variant="headingM">{user.name}</Text>
        <Text variant="bodyS" color="secondary">{user.email}</Text>
        <Badge variant="success">Рейтинг {user.ratingLevel}</Badge>
      </div>
    </Card>

    {/* Menu */}
    <div className={styles.menu}>
      <ListItem
        title="Редактировать профиль"
        icon="edit"
        onClick={handleEdit}
        rightContent={<Icon name="chevron-right" />}
      />
      <ListItem
        title="Настройки"
        icon="settings"
        onClick={handleSettings}
        rightContent={<Icon name="chevron-right" />}
      />
      <ListItem
        title="Выйти"
        icon="logout"
        onClick={handleLogout}
      />
    </div>
  </div>
)
```

## Создание нового компонента (если необходимо)

### Когда можно создать новый компонент:

1. Компонент будет переиспользован в нескольких местах
2. Нельзя собрать из существующих компонентов
3. Согласовано с архитектором

### Структура нового компонента:

```
packages/ui/src/components/NewComponent/
├── NewComponent.tsx
├── NewComponent.module.css
├── index.ts
└── README.md (опционально)
```

### Пример:

```tsx
// NewComponent.tsx
import styles from './NewComponent.module.css'

export interface NewComponentProps {
  title: string
  children: React.ReactNode
  onClick?: () => void
}

export const NewComponent = ({ title, children, onClick }: NewComponentProps) => (
  <div className={styles.container} onClick={onClick}>
    <h3 className={styles.title}>{title}</h3>
    <div className={styles.content}>{children}</div>
  </div>
)
```

```css
/* NewComponent.module.css */
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background-color: var(--color-bg-secondary);
  border-radius: 12px;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.content {
  color: var(--color-text-secondary);
}
```

```tsx
// index.ts
export { NewComponent } from './NewComponent'
export type { NewComponentProps } from './NewComponent'
```

**И добавь в `packages/ui/src/index.ts`:**

```tsx
export { NewComponent } from './components/NewComponent'
export type { NewComponentProps } from './components/NewComponent'
```

## Props Patterns

### Базовые props:

```tsx
interface ComponentProps {
  // Обязательные
  title: string

  // Опциональные
  subtitle?: string
  icon?: string

  // Callbacks
  onClick?: () => void
  onClose?: () => void

  // Style overrides
  className?: string

  // Children
  children?: React.ReactNode
}
```

### Variant props:

```tsx
type Variant = 'primary' | 'secondary' | 'success' | 'error'

interface ComponentProps {
  variant?: Variant
}
```

### Size props:

```tsx
type Size = 'small' | 'medium' | 'large'

interface ComponentProps {
  size?: Size
}
```

## Event Forwarding

Компоненты должны пробрасывать события, а НЕ обрабатывать их:

```tsx
// ✅ ХОРОШО: Проброс события
export const Card = ({ onClick }) => (
  <div onClick={onClick}>...</div>
)

// Использование:
<Card onClick={() => navigate('/details')} />

// ❌ ПЛОХО: Обработка внутри компонента
export const Card = ({ id }) => {
  const navigate = useNavigate()
  return (
    <div onClick={() => navigate(`/details/${id}`)}>...</div>
  )
}
```

## State Management

### Компоненты НЕ должны содержать состояние приложения!

```tsx
// ✅ ХОРОШО: Stateless component
export const ProductCard = ({ product, onSelect }) => (
  <Card onClick={() => onSelect(product.id)}>
    <Text>{product.name}</Text>
  </Card>
)

// ❌ ПЛОХО: State внутри компонента
export const ProductCard = ({ productId }) => {
  const [product, setProduct] = useState(null)

  useEffect(() => {
    // API вызов - НЕ ДЕЛАТЬ ТАК!
    fetch(`/products/${productId}`)
      .then(res => res.json())
      .then(setProduct)
  }, [productId])

  return <Card>...</Card>
}
```

### Локальный UI state допустим:

```tsx
// ✅ OK: Локальный UI state (открыт/закрыт)
export const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>{title}</button>
      {isOpen && <div>{children}</div>}
    </div>
  )
}
```

## TypeScript для компонентов

### Строгая типизация props:

```tsx
export interface ProductCardProps {
  id: string
  name: string
  description: string
  icon: string
  isEnabled: boolean
  onClick: (id: string) => void
}

export const ProductCard = ({
  id,
  name,
  description,
  icon,
  isEnabled,
  onClick
}: ProductCardProps) => {
  // ...
}
```

### Экспорт типов:

```tsx
// index.ts
export { ProductCard } from './ProductCard'
export type { ProductCardProps } from './ProductCard'
```

## Документация компонентов

Для сложных компонентов создавай README.md:

```markdown
# ProductCard

Карточка банковского продукта.

## Props

- `name` (string) - Название продукта
- `description` (string) - Описание продукта
- `icon` (string) - Иконка продукта
- `isEnabled` (boolean) - Доступен ли продукт
- `onClick` (function) - Callback при клике

## Example

\`\`\`tsx
<ProductCard
  name="Накопительный счёт"
  description="До 10% годовых"
  icon="savings"
  isEnabled={true}
  onClick={handleOpenProduct}
/>
\`\`\`
```

---

**Следуй этим правилам для консистентных и переиспользуемых компонентов!**
