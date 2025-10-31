<!-- 56770734-5e6a-4909-95da-85b5c45b7a88 42975962-2c1e-435a-b972-e68a0596e6e5 -->
# Landing Page for Unauthorized Users

## Overview

Create a landing page that unauthorized users see when they visit the app. The landing includes a hero section, benefits showcase, and footer with legal links. The existing AuthScreen becomes a separate route accessed via "Войти" button.

## Implementation Steps

### 1. Create LandingScreen Component

**File**: `apps/client/src/components/LandingScreen/LandingScreen.tsx`

New component with:

- Hero section with headline "Кошелёк с прозрачными транзакциями и быстрым пополнением"
- Placeholder illustration/screenshot area
- CTA button "Открыть кошелек"
- Benefits section with 3-4 Card components from `@packages/ui`
- Footer with legal links (non-functional placeholders for now)

Use existing components:

- `Text` for all text elements (headingL, headingM, bodyM variants)
- `Card` for benefit cards
- CSS Modules for styling

**File**: `apps/client/src/components/LandingScreen/LandingScreen.module.css`

Responsive styles:

- Mobile-first approach (base styles for 320px+)
- `@media (min-width: 768px)` for tablet
- `@media (min-width: 1024px)` for desktop with max-width: 1200px centering
- Grid layout for benefits: 1 column mobile, 2 columns tablet, 3-4 columns desktop
- Touch-friendly CTA button (min-height: 44px)
- Desktop hover states with `@media (hover: hover)`

**File**: `apps/client/src/components/LandingScreen/index.ts`

Standard export barrel file.

### 2. Update App.tsx Routing Logic

**File**: `apps/client/src/App.tsx`

Changes needed:

- Add new state: `authMode: 'landing' | 'auth' | null` to track which screen to show
- When `!isAuthed && !bootChecked`: show nothing (loading)
- When `!isAuthed && bootChecked && authMode === null`: show LandingScreen
- When `!isAuthed && bootChecked && authMode === 'auth'`: show AuthScreen
- Pass `onShowAuth={() => setAuthMode('auth')}` to LandingScreen
- Pass `onBack={() => setAuthMode(null)}` to AuthScreen
- When authenticated, reset authMode to null

Update logic around line 186-189:

```tsx
if (!bootChecked) return null;
if (!isAuthed) {
  if (authMode === 'auth') {
    return <AuthScreen onAuthenticated={...} onBack={...} />;
  }
  return <LandingScreen onShowAuth={() => setAuthMode('auth')} />;
}
```

### 3. Update AuthScreen with Back Button

**File**: `apps/client/src/components/AuthScreen/AuthScreen.tsx`

Add:

- New prop: `onBack?: () => void`
- Back button/link at top to return to landing (only shown if onBack provided)
- Use Text component for back link with appropriate styling

### 4. SEO and Performance

**File**: `apps/client/index.html`

Update meta tags:

- `<title>Banknot - Кошелёк с прозрачными транзакциями</title>`
- `<meta name="description" content="...">`
- OpenGraph tags for social sharing

## Component Structure

### LandingScreen Layout:

```tsx
<div className={styles.container}>
  {/* Header */}
  <header className={styles.header}>
    <Text variant="headingM">Banknot</Text>
    <button onClick={onShowAuth}>Войти</button>
  </header>

  {/* Hero */}
  <section className={styles.hero}>
    <Text variant="headingL" as="h1">Кошелёк с прозрачными транзакциями и быстрым пополнением</Text>
    <div className={styles.illustration}>{/* Placeholder */}</div>
    <button className={styles.cta} onClick={onShowAuth}>Открыть кошелек</button>
  </section>

  {/* Benefits */}
  <section className={styles.benefits}>
    <div className={styles.benefitsGrid}>
      <Card>
        <Text variant="headingS">Безопасно</Text>
        <Text variant="bodyM" color="secondary">Защита данных и средств</Text>
      </Card>
      {/* 2-3 more benefit cards */}
    </div>
  </section>

  {/* Footer */}
  <footer className={styles.footer}>
    <a href="#">Политика конфиденциальности</a>
    <a href="#">Оферта</a>
    <Text variant="caption" color="tertiary">Контакты</Text>
  </footer>
</div>
```

## Responsive Requirements

- Minimum width: 320px
- Maximum content width: 1200px (desktop)
- Hero CTA button: prominent, min-height 44px
- Benefits grid: 1 col (mobile) → 2 col (tablet) → 3-4 col (desktop)
- All interactive elements: touch-friendly (44x44px minimum)
- Fast initial render (<2s)

## Files to Create/Modify

**Create:**

- `apps/client/src/components/LandingScreen/LandingScreen.tsx`
- `apps/client/src/components/LandingScreen/LandingScreen.module.css`
- `apps/client/src/components/LandingScreen/index.ts`

**Modify:**

- `apps/client/src/App.tsx` (routing logic)
- `apps/client/src/components/AuthScreen/AuthScreen.tsx` (add back button)
- `apps/client/src/components/AuthScreen/AuthScreen.module.css` (back button styles)
- `apps/client/index.html` (SEO meta tags)

## Verification

After implementation:

1. Visit `http://localhost:5173/` unauthorized → should show Landing
2. Click "Войти" → should show AuthScreen
3. Click back on AuthScreen → should return to Landing
4. Click "Открыть кошелек" → should show AuthScreen
5. Complete auth → should show main app (Layout with screens)
6. Logout → should return to Landing (not AuthScreen)
7. Test responsive: resize browser 320px → 1920px
8. Test touch targets on mobile simulator
9. Verify SEO meta tags in page source

### To-dos

- [ ] Create LandingScreen component with hero, benefits, and footer sections using existing UI components
- [ ] Update App.tsx to handle landing/auth/authenticated states with proper navigation flow
- [ ] Add optional back button to AuthScreen to return to landing page
- [ ] Implement mobile-first responsive CSS with breakpoints for tablet and desktop
- [ ] Update index.html with SEO meta tags and OpenGraph for landing page
- [ ] Test complete user flow: landing → auth → app → logout → landing on all screen sizes