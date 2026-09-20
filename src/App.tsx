import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Accessibility, Eye, Home, Map, Route, Volume2, VolumeX } from 'lucide-react';
import { HomeScreen, LiveTracking, RouteDetails, TransportModeDock, AppScreen, Destination } from './components/ui/JourneyScreens';
import { TransitMode } from './types';
import { sound } from './utils/audio';

const Scene = lazy(() => import('./components/canvas/Scene').then((m) => ({ default: m.Scene })));

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

  const navItems: Array<{ id: AppScreen; label: string; icon: React.ElementType }> = [
    { id: 'home', label: 'Home / Search', icon: Home },
    { id: 'route', label: 'Route details', icon: Map },
    { id: 'tracking', label: 'Live tracking', icon: Eye },
  ];

  return (
    <main className={`app-shell ${highContrast ? 'high-contrast' : ''} ${modeSelected && screen === 'home' ? 'mode-selected' : ''}`}>
      <Suspense fallback={<div className="fixed inset-0 bg-[#071317]" />}>
        <Scene mode={currentMode} isMobile={isMobile} onCameraArrived={() => undefined} />
      </Suspense>
      <div className="scene-wash" />

      <TransportModeDock
        selectedMode={currentMode}
        modeSelected={modeSelected}
        onModeChange={handleSelectMode}
      />

      <header className="app-header">
        <motion.button
          className="brand-lockup"
          onClick={handleResetView}
          aria-label="Transportation 2100 home"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
        >
          <span className="brand-symbol"><Route aria-hidden="true" /></span>
          <span><strong>TRANSPORTATION <b>2100</b></strong><small>Human-first city movement</small></span>
        </motion.button>
        <div className="header-actions">
          <motion.button
            className={`accessibility-toggle ${highContrast ? 'is-active' : ''}`}
            onClick={() => setHighContrast((value) => !value)}
            aria-pressed={highContrast}
            title="Toggle high contrast and large text"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.94 }}
          >
            <Accessibility aria-hidden="true" />
            <span>Access mode</span>
          </motion.button>
          <motion.button
            className="icon-button"
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Mute audio' : 'Enable audio'}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
          >
            {soundEnabled ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
          </motion.button>
        </div>
      </header>

      <div className="content-frame">
        <AnimatePresence mode="wait">
          {screen === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <HomeScreen
                selectedMode={currentMode}
                modeSelected={modeSelected}
                onModeChange={handleSelectMode}
                onDestinationSelect={handleDestinationSelect}
                onResetMode={handleResetView}
              />
            </motion.div>
          )}
          {screen === 'route' && (
            <motion.div
              key="route"
              initial={{ opacity: 0, y: 16, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(3px)' }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <RouteDetails
                selectedMode={currentMode}
                onTrack={() => setScreen('tracking')}
                onBack={() => setScreen('home')}
              />
            </motion.div>
          )}
          {screen === 'tracking' && (
            <motion.div
              key="tracking"
              initial={{ opacity: 0, y: 16, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(3px)' }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <LiveTracking
                linear={linearTracking}
                onToggleLinear={() => setLinearTracking((value) => !value)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="bottom-navigation" aria-label="Main navigation">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = screen === id;
          return (
            <motion.button
              key={id}
              className={`bottom-nav-btn ${isActive ? 'is-active' : ''}`}
              onClick={() => {
                sound.playClick();
                setScreen(id);
              }}
              aria-current={isActive ? 'page' : undefined}
              whileTap={{ scale: 0.92 }}
              whileHover={{ y: -1 }}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="bottom-nav-indicator"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                />
              )}
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </motion.button>
          );
        })}
      </nav>
    </main>
  );
};

export default App;
