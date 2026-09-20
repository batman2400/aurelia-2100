import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BusFront,
  Check,
  ChevronRight,
  Clock3,
  CloudSun,
  Gauge,
  Headphones,
  MapPin,
  Mic,
  Navigation,
  Plane,
  RefreshCw,
  Route,
  ShieldCheck,
  TrainFront,
  TramFront,
  Wifi,
} from 'lucide-react';
import { TransitMode } from '../../types';

export type AppScreen = 'home' | 'route' | 'tracking';
export type Destination = 'home' | 'campus' | 'sky-hub';

interface HomeScreenProps {
  selectedMode: TransitMode;
  modeSelected: boolean;
  onModeChange: (mode: TransitMode) => void;
  onDestinationSelect: (destination: Destination) => void;
  onResetMode: () => void;
}

const modes: Array<{ id: TransitMode; label: string; detail: string; icon: React.ElementType }> = [
  { id: 'air', label: 'Air transport', detail: 'Pods above the city', icon: Plane },
  { id: 'subrail', label: 'Autonomous train', detail: 'Fast underground links', icon: TrainFront },
  { id: 'city', label: 'Autonomous bus', detail: 'Quiet local service', icon: BusFront },
  { id: 'roads', label: 'Smart roads', detail: 'Adaptive road pods', icon: Route },
];

const destinations: Array<{ id: Destination; label: string; note: string; eta: string; icon: React.ElementType }> = [
  { id: 'home', label: 'Home Node', note: 'Residential sector 04', eta: '12 min', icon: MapPin },
  { id: 'campus', label: 'KDU Campus', note: 'Learning district', eta: '18 min', icon: TramFront },
  { id: 'sky-hub', label: 'Central Sky Hub', note: 'Intercity terminal', eta: '26 min', icon: Plane },
];

const containerStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const itemFadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  },
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ selectedMode, modeSelected, onDestinationSelect, onResetMode }) => (
  <>
    <AnimatePresence>
      {modeSelected && (
        <motion.section
          className="search-drawer"
          aria-labelledby="home-heading"
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 32, scale: 0.97 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="drawer-grab" aria-hidden="true" />
          <div className="drawer-header">
            <div>
              <div className="eyebrow">
                <span className="status-dot" /> {modes.find((mode) => mode.id === selectedMode)?.label} layer ready
              </div>
              <h2 id="home-heading">Where are you <span>going?</span></h2>
            </div>
            <motion.button
              className="change-mode-button"
              onClick={onResetMode}
              whileHover={{ y: -1, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw aria-hidden="true" /> Change mode
            </motion.button>
          </div>

          <div className="drawer-actions">
            <motion.button
              className="search-field"
              type="button"
              aria-label="Search for a destination"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span className="search-copy">
                <MapPin aria-hidden="true" />
                <span>Search a destination</span>
              </span>
              <span className="search-shortcut">⌘ K</span>
            </motion.button>
            <motion.button
              className="voice-button"
              type="button"
              aria-label="Start voice search"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <Mic aria-hidden="true" />
              <span>
                <strong>Speak your destination</strong>
                <small>Hands-free search</small>
              </span>
              <ArrowRight aria-hidden="true" />
            </motion.button>
          </div>

          <div className="section-heading drawer-section-heading">
            <div>
              <span className="section-kicker">Quick destinations</span>
              <h3>Go somewhere familiar</h3>
            </div>
            <motion.button
              className="text-button"
              type="button"
              whileHover={{ x: 2 }}
            >
              Saved places <ChevronRight aria-hidden="true" />
            </motion.button>
          </div>

          <motion.div
            className="destination-grid"
            variants={containerStagger}
            initial="hidden"
            animate="show"
          >
            {destinations.map(({ id, label, note, eta, icon: Icon }) => (
              <motion.button
                key={id}
                className="destination-card"
                onClick={() => onDestinationSelect(id)}
                variants={itemFadeUp}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <span className="destination-icon">
                  <Icon aria-hidden="true" />
                </span>
                <span className="destination-text">
                  <strong>{label}</strong>
                  <small>{note}</small>
                </span>
                <span className="destination-eta">
                  <Clock3 aria-hidden="true" />{eta}
                </span>
                <ChevronRight className="destination-arrow" aria-hidden="true" />
              </motion.button>
            ))}
          </motion.div>

          <p className="helper-line">
            <Headphones aria-hidden="true" /> Select a destination and we will plan the route.
          </p>
        </motion.section>
      )}
    </AnimatePresence>
  </>
);

export const TransportModeDock: React.FC<Pick<HomeScreenProps, 'selectedMode' | 'modeSelected' | 'onModeChange'>> = ({ selectedMode, modeSelected, onModeChange }) => (
  <motion.section
    className="mode-dock"
    aria-label="Choose a transport mode"
    initial={{ opacity: 0, y: 20, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
  >
    <div className="dock-heading">
      <span className="status-dot" />
      <span>Explore the city</span>
      <small>{modeSelected ? 'Mode selected' : 'Select a layer to begin'}</small>
    </div>
    <div className="dock-modes" role="group" aria-label="Transport modes">
      {modes.map(({ id, label, icon: Icon }) => {
        const selected = selectedMode === id && modeSelected;
        return (
          <motion.button
            key={id}
            className={`dock-mode ${selected ? 'is-selected' : ''}`}
            onClick={() => onModeChange(id)}
            aria-pressed={selected}
            title={`Explore ${label}`}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
          >
            <Icon aria-hidden="true" />
            <span>{label}</span>
            {selected && <Check className="dock-check" aria-hidden="true" />}
          </motion.button>
        );
      })}
    </div>
  </motion.section>
);

export const RouteDetails: React.FC<{ onTrack: () => void; selectedMode: TransitMode; onBack?: () => void }> = ({ onTrack, selectedMode, onBack }) => (
  <motion.section
    className="screen-panel route-screen"
    aria-labelledby="route-heading"
    variants={containerStagger}
    initial="hidden"
    animate="show"
  >
    <motion.div className="route-topline" variants={itemFadeUp}>
      <motion.button
        className="back-link"
        type="button"
        onClick={onBack}
        whileHover={{ x: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronRight className="back-chevron" aria-hidden="true" /> Edit search
      </motion.button>
      <span className="live-label">
        <span className="status-dot" /> Live route
      </span>
    </motion.div>

    <motion.div className="route-title-row" variants={itemFadeUp}>
      <div>
        <span className="section-kicker">Your journey · Today, 06:48</span>
        <h2 id="route-heading">Home Node <span>to</span> KDU Campus</h2>
        <p className="lede">Arrive by 07:06 · 18 min total</p>
      </div>
      <motion.div
        className="route-score"
        whileHover={{ scale: 1.06 }}
        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      >
        <strong>96</strong>
        <span>smooth<br />journey</span>
      </motion.div>
    </motion.div>

    <motion.div className="critical-grid" variants={itemFadeUp}>
      <motion.div
        className="critical-card delay"
        whileHover={{ y: -2, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <span><Clock3 aria-hidden="true" /> On time</span>
        <strong>18 min</strong>
        <small>Arrives 07:06</small>
      </motion.div>
      <motion.div
        className="critical-card transfer"
        whileHover={{ y: -2, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <span><RefreshCw aria-hidden="true" /> Transfer</span>
        <strong>1 change</strong>
        <small>Central Exchange</small>
      </motion.div>
      <motion.div
        className="critical-card good"
        whileHover={{ y: -2, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <span><ShieldCheck aria-hidden="true" /> Safety</span>
        <strong>Clear</strong>
        <small>All systems normal</small>
      </motion.div>
    </motion.div>

    <motion.div
      className="rebook-alert"
      variants={itemFadeUp}
      whileHover={{ y: -1 }}
    >
      <span className="alert-icon"><Wifi aria-hidden="true" /></span>
      <div>
        <strong>Smart rebook is ready</strong>
        <p>If Rail 08 slows down, we will move you to Bus 12 automatically. No action needed.</p>
      </div>
      <motion.button
        type="button"
        aria-label="View smart rebook options"
        whileHover={{ x: 3 }}
      >
        <ChevronRight aria-hidden="true" />
      </motion.button>
    </motion.div>

    <motion.div className="timeline-wrap" variants={itemFadeUp}>
      <div className="section-heading">
        <div>
          <span className="section-kicker">03 / Your route</span>
          <h3>Three simple steps</h3>
        </div>
        <span className="route-id">AUR-204</span>
      </div>
      <div className="timeline">
        <TimelineItem icon={MapPin} time="06:48" title="Home Node" detail="Walk to pickup bay 2 · 2 min" state="complete" delay={0.1} />
        <TimelineItem icon={TrainFront} time="06:50" title="Autonomous Rail 08" detail={`${selectedMode === 'air' ? 'Switch from air corridor' : 'Central line'} · 12 min`} state="active" delay={0.18} />
        <TimelineItem icon={BusFront} time="07:02" title="KDU Campus" detail="Exit at Learning Gate · 4 min walk" state="upcoming" delay={0.26} last />
      </div>
    </motion.div>

    <motion.button
      className="primary-action"
      onClick={onTrack}
      variants={itemFadeUp}
      whileHover={{ y: -2, scale: 1.015 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Navigation aria-hidden="true" /> Follow this journey <ArrowRight aria-hidden="true" />
    </motion.button>
  </motion.section>
);

const TimelineItem: React.FC<{ icon: React.ElementType; time: string; title: string; detail: string; state: string; delay?: number; last?: boolean }> = ({ icon: Icon, time, title, detail, state, delay = 0, last }) => (
  <motion.div
    className={`timeline-item ${state} ${last ? 'last' : ''}`}
    initial={{ opacity: 0, x: -14 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    <div className="timeline-rail">
      <span className="timeline-node">
        <Icon aria-hidden="true" />
      </span>
    </div>
    <div className="timeline-copy">
      <span className="timeline-time">{time}</span>
      <strong>{title}</strong>
      <small>{detail}</small>
    </div>
    <span className="timeline-state">
      {state === 'complete' ? 'Done' : state === 'active' ? 'Now' : 'Next'}
    </span>
  </motion.div>
);

export const LiveTracking: React.FC<{ linear: boolean; onToggleLinear: () => void }> = ({ linear, onToggleLinear }) => (
  <motion.section
    className="tracking-screen"
    aria-labelledby="tracking-heading"
    variants={containerStagger}
    initial="hidden"
    animate="show"
  >
    <motion.div className="tracking-header" variants={itemFadeUp}>
      <div>
        <span className="section-kicker">04 / Live tracking</span>
        <h2 id="tracking-heading">Rail 08 is moving</h2>
        <p className="lede">Central Exchange <span>→</span> KDU Campus</p>
      </div>
      <span className="tracking-live">
        <span className="status-dot" /> Live
      </span>
    </motion.div>

    <motion.div className={`tracking-visual ${linear ? 'linear-mode' : ''}`} variants={itemFadeUp}>
      <AnimatePresence mode="wait">
        {!linear ? (
          <motion.div
            key="map-view"
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="map-grid" />
            <div className="map-label label-a">CENTRAL EXCHANGE</div>
            <div className="map-label label-b">KDU CAMPUS</div>
            <div className="map-line">
              <span className="map-stop stop-a" />
              <span className="map-stop stop-b" />
              <span className="map-stop stop-c" />
              <div className="vehicle-pulse" title="Rail 08 Active Pod">
                <TrainFront aria-hidden="true" />
              </div>
            </div>
            <div className="map-compass">
              N<br /><span>+</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="linear-view"
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="linear-progress">
              <div className="progress-label">
                <strong>3 stops remaining</strong>
                <span>Arriving in 4 min</span>
              </div>
              <div className="progress-track">
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: '55%' }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                />
                <i /><i /><i />
              </div>
              <div className="progress-stops">
                <span>Central<br />Exchange</span>
                <span>Park<br />Ring</span>
                <span>Learning<br />Gate</span>
                <span>KDU<br />Campus</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="view-toggle"
        onClick={onToggleLinear}
        aria-pressed={linear}
        whileHover={{ y: -1, scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      >
        {linear ? <Navigation aria-hidden="true" /> : <Route aria-hidden="true" />}
        <span>{linear ? 'Map view' : 'Linear / list mode'}</span>
      </motion.button>
    </motion.div>

    <motion.div className="status-sheet" variants={itemFadeUp}>
      <div className="sheet-handle" />
      <div className="status-sheet-heading">
        <div>
          <span className="section-kicker">Simple live status</span>
          <h3>Everything is on track.</h3>
        </div>
        <ShieldCheck className="safety-icon" aria-label="Safety status: clear" />
      </div>

      <div className="live-metrics">
        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
          <Gauge aria-hidden="true" />
          <span>Speed</span>
          <strong>242 km/h</strong>
        </motion.div>
        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
          <MapPin aria-hidden="true" />
          <span>Current node</span>
          <strong>Park Ring 03</strong>
        </motion.div>
        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
          <CloudSun aria-hidden="true" />
          <span>Conditions</span>
          <strong>Clear and safe</strong>
        </motion.div>
      </div>

      <motion.button
        className="secondary-action"
        type="button"
        whileHover={{ y: -1, scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
      >
        <Headphones aria-hidden="true" /> Need help?
      </motion.button>
    </motion.div>
  </motion.section>
);
