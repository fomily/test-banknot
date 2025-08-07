import React, { useState } from 'react';
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
