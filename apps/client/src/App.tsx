import React, { useState } from 'react';
import { Main } from './components/Main';
import { Products } from './components/Products';
import '@packages/ui/styles';

type Screen = 'main' | 'products' | 'rating' | 'profile';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('main');

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'main':
        return <Main onNavigate={handleNavigate} />;
      case 'products':
        return <Products onNavigate={handleNavigate} />;
      case 'rating':
        // TODO: Implement Rating screen
        return <div>Рейтинг - в разработке</div>;
      case 'profile':
        // TODO: Implement Profile screen
        return <div>Профиль - в разработке</div>;
      default:
        return <Main onNavigate={handleNavigate} />;
    }
  };

  return renderScreen();
}

export default App;
