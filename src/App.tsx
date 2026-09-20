import React, { useState, useEffect, useCallback } from 'react';
import { Scene } from './components/canvas/Scene';
import { Accessibility, Eye, Home, Map, Route, Volume2, VolumeX } from 'lucide-react';
import { HomeScreen, LiveTracking, RouteDetails, AppScreen, Destination } from './components/ui/JourneyScreens';
import { TransitMode } from './types';
import { sound } from './utils/audio';

/** Detect if we're on a narrow / touch screen */
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
};

export const App: React.FC = () => {
  const isMobile = useIsMobile();
  const [screen, setScreen] = useState<AppScreen>('home');
  const [currentMode, setCurrentMode] = useState<TransitMode>('city');
  const [modeSelected, setModeSelected] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [linearTracking, setLinearTracking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sound.enabled);

  const handleSelectMode = useCallback((mode: TransitMode) => {
    sound.playTransition(mode);
    setCurrentMode(mode);
    setModeSelected(true);
  }, []);

  const handleResetView = useCallback(() => {
    setCurrentMode('city');
    setModeSelected(false);
    setScreen('home');
  }, []);

  const handleDestinationSelect = useCallback((_destination: Destination) => {
    sound.playClick();
    setScreen('route');
  }, []);

  const toggleSound = () => {
    sound.enabled = !soundEnabled;
    setSoundEnabled((value) => !value);
    if (!soundEnabled) sound.playClick();
  };

  // Keyboard nav (desktop)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const map: Record<string, () => void> = {
        '1': () => handleSelectMode('air'),
        '2': () => handleSelectMode('roads'),
        '3': () => handleSelectMode('subrail'),
        'Escape': () => { sound.playClick(); handleResetView(); },
        '0':      () => { sound.playClick(); handleResetView(); },
      };
      map[e.key]?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleSelectMode, handleResetView]);

  return (
    <main className={`app-shell ${highContrast ? 'high-contrast' : ''} ${modeSelected && screen === 'home' ? 'mode-selected' : ''}`}>
      <Scene mode={currentMode} isMobile={isMobile} onCameraArrived={() => undefined} />
      <div className="scene-wash" />

      <header className="app-header">
        <button className="brand-lockup" onClick={handleResetView} aria-label="Transportation 2100 home">
          <span className="brand-symbol"><Route aria-hidden="true" /></span><span><strong>TRANSPORTATION <b>2100</b></strong><small>Human-first city movement</small></span>
        </button>
        <div className="header-actions">
          <button className={`accessibility-toggle ${highContrast ? 'is-active' : ''}`} onClick={() => setHighContrast((value) => !value)} aria-pressed={highContrast} title="Toggle high contrast and large text"><Accessibility aria-hidden="true" /><span>Access mode</span></button>
          <button className="icon-button" onClick={toggleSound} aria-label={soundEnabled ? 'Mute audio' : 'Enable audio'}>{soundEnabled ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}</button>
        </div>
      </header>

      <div className="content-frame">
        {screen === 'home' && <HomeScreen selectedMode={currentMode} modeSelected={modeSelected} onModeChange={handleSelectMode} onDestinationSelect={handleDestinationSelect} onResetMode={handleResetView} />}
        {screen === 'route' && <RouteDetails selectedMode={currentMode} onTrack={() => setScreen('tracking')} onBack={() => setScreen('home')} />}
        {screen === 'tracking' && <LiveTracking linear={linearTracking} onToggleLinear={() => setLinearTracking((value) => !value)} />}
      </div>

      <nav className="bottom-navigation" aria-label="Main navigation">
        <button className={screen === 'home' ? 'is-active' : ''} onClick={() => setScreen('home')} aria-current={screen === 'home' ? 'page' : undefined}><Home aria-hidden="true" /><span>Home / Search</span></button>
        <button className={screen === 'route' ? 'is-active' : ''} onClick={() => setScreen('route')} aria-current={screen === 'route' ? 'page' : undefined}><Map aria-hidden="true" /><span>Route details</span></button>
        <button className={screen === 'tracking' ? 'is-active' : ''} onClick={() => setScreen('tracking')} aria-current={screen === 'tracking' ? 'page' : undefined}><Eye aria-hidden="true" /><span>Live tracking</span></button>
      </nav>
    </main>
  );
};

export default App;
