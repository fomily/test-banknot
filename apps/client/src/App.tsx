import React, { useState, useEffect, useRef } from 'react';
import { Main } from './components/Main';
import { Products } from './components/Products';
import { RatingScreen } from './components/RatingScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { Layout } from './components/Layout';
import { WalletScreen } from './components/WalletScreen';
import '@packages/ui/styles';

type Screen = 'main' | 'products' | 'rating' | 'profile' | 'wallet';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('main');
  const historyRef = useRef<Screen[]>(['main']);

  const handleNavigate = React.useCallback((screen: string) => {
    if (screen === 'back') {
      if (historyRef.current.length > 1) {
        const nextHistory = historyRef.current.slice(0, -1);
        const prev = nextHistory[nextHistory.length - 1];
        historyRef.current = nextHistory;
        setCurrentScreen(prev);
      }
      return;
    }
    const s = screen as Screen;
    setCurrentScreen(s);
    historyRef.current = [...historyRef.current, s];
  }, []);

  const handleGoBack = React.useCallback(() => {
    if (historyRef.current.length > 1) {
      const nextHistory = historyRef.current.slice(0, -1);
      const prev = nextHistory[nextHistory.length - 1];
      historyRef.current = nextHistory;
      setCurrentScreen(prev);
    }
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
      case 'wallet':
        return <WalletScreen onNavigate={handleNavigate} />;
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
