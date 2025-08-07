import React, { useState, useEffect } from 'react';
import { Main } from './components/Main';
import { Products } from './components/Products';
import { RatingScreen } from './components/RatingScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { Layout } from './components/Layout';
import '@packages/ui/styles';

type Screen = 'main' | 'products' | 'rating' | 'profile';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('main');

  const handleNavigate = React.useCallback((screen: string) => {
    setCurrentScreen(screen as Screen);
  }, []);

  // Сброс скролла при изменении экрана
  useEffect(() => {
    // Более надежный способ для WebView
    const scrollToTop = () => {
      // Пробуем несколько способов для максимальной совместимости
      if (window.scrollTo) {
        window.scrollTo(0, 0);
      }

      // Также сбрасываем скролл для body и html
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;

      // Для WebView на iOS
      if (document.body.scrollIntoView) {
        document.body.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    // Небольшая задержка для гарантии, что DOM обновился
    const timeoutId = setTimeout(scrollToTop, 0);

    return () => clearTimeout(timeoutId);
  }, [currentScreen]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'main':
        return <Main onNavigate={handleNavigate} />;
      case 'products':
        return <Products onNavigate={handleNavigate} />;
      case 'rating':
        return <RatingScreen onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfileScreen onNavigate={handleNavigate} />;
      default:
        return <Main onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout currentScreen={currentScreen} onNavigate={handleNavigate}>
      {renderScreen()}
    </Layout>
  );
}

export default App;
