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

export const HomeScreen: React.FC<HomeScreenProps> = ({ selectedMode, modeSelected, onModeChange, onDestinationSelect, onResetMode }) => (
  <>
    <section className="mode-dock" aria-label="Choose a transport mode">
      <div className="dock-heading"><span className="status-dot" /><span>Explore the city</span><small>{modeSelected ? 'Mode selected' : 'Select a layer to begin'}</small></div>
      <div className="dock-modes" role="group" aria-label="Transport modes">
        {modes.map(({ id, label, icon: Icon }) => {
          const selected = selectedMode === id && modeSelected;
          return <button key={id} className={`dock-mode ${selected ? 'is-selected' : ''}`} onClick={() => onModeChange(id)} aria-pressed={selected} title={`Explore ${label}`}>
            <Icon aria-hidden="true" /><span>{label}</span>{selected && <Check className="dock-check" aria-hidden="true" />}
          </button>;
        })}
      </div>
    </section>
    <AnimatePresence>
      {modeSelected && <motion.section
        className="search-drawer"
        aria-labelledby="home-heading"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 32 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="drawer-grab" aria-hidden="true" />
        <div className="drawer-header"><div><div className="eyebrow"><span className="status-dot" /> {modes.find((mode) => mode.id === selectedMode)?.label} layer ready</div><h2 id="home-heading">Where are you <span>going?</span></h2></div><button className="change-mode-button" onClick={onResetMode}><RefreshCw aria-hidden="true" /> Change mode</button></div>
        <div className="drawer-actions">
          <button className="search-field" type="button" aria-label="Search for a destination"><span className="search-copy"><MapPin aria-hidden="true" /><span>Search a destination</span></span><span className="search-shortcut">⌘ K</span></button>
          <button className="voice-button" type="button" aria-label="Start voice search"><Mic aria-hidden="true" /><span><strong>Speak your destination</strong><small>Hands-free search</small></span><ArrowRight aria-hidden="true" /></button>
        </div>
        <div className="section-heading drawer-section-heading"><div><span className="section-kicker">Quick destinations</span><h3>Go somewhere familiar</h3></div><button className="text-button" type="button">Saved places <ChevronRight aria-hidden="true" /></button></div>
        <div className="destination-grid">{destinations.map(({ id, label, note, eta, icon: Icon }) => <button key={id} className="destination-card" onClick={() => onDestinationSelect(id)}><span className="destination-icon"><Icon aria-hidden="true" /></span><span className="destination-text"><strong>{label}</strong><small>{note}</small></span><span className="destination-eta"><Clock3 aria-hidden="true" />{eta}</span><ChevronRight className="destination-arrow" aria-hidden="true" /></button>)}</div>
        <p className="helper-line"><Headphones aria-hidden="true" /> Select a destination and we will plan the route.</p>
      </motion.section>}
    </AnimatePresence>
  </>
);

export const RouteDetails: React.FC<{ onTrack: () => void; selectedMode: TransitMode; onBack?: () => void }> = ({ onTrack, selectedMode, onBack }) => (
  <section className="screen-panel route-screen" aria-labelledby="route-heading">
    <div className="route-topline"><button className="back-link" type="button" onClick={onBack}><ChevronRight className="back-chevron" aria-hidden="true" /> Edit search</button><span className="live-label"><span className="status-dot" /> Live route</span></div>
    <div className="route-title-row"><div><span className="section-kicker">Your journey · Today, 06:48</span><h2 id="route-heading">Home Node <span>to</span> KDU Campus</h2><p className="lede">Arrive by 07:06 · 18 min total</p></div><div className="route-score"><strong>96</strong><span>smooth<br />journey</span></div></div>
    <div className="critical-grid"><div className="critical-card delay"><span><Clock3 aria-hidden="true" /> On time</span><strong>18 min</strong><small>Arrives 07:06</small></div><div className="critical-card transfer"><span><RefreshCw aria-hidden="true" /> Transfer</span><strong>1 change</strong><small>Central Exchange</small></div><div className="critical-card good"><span><ShieldCheck aria-hidden="true" /> Safety</span><strong>Clear</strong><small>All systems normal</small></div></div>
    <div className="rebook-alert"><span className="alert-icon"><Wifi aria-hidden="true" /></span><div><strong>Smart rebook is ready</strong><p>If Rail 08 slows down, we will move you to Bus 12 automatically. No action needed.</p></div><button type="button" aria-label="View smart rebook options"><ChevronRight aria-hidden="true" /></button></div>
    <div className="timeline-wrap"><div className="section-heading"><div><span className="section-kicker">03 / Your route</span><h3>Three simple steps</h3></div><span className="route-id">AUR-204</span></div><div className="timeline">
      <TimelineItem icon={MapPin} time="06:48" title="Home Node" detail="Walk to pickup bay 2 · 2 min" state="complete" />
      <TimelineItem icon={TrainFront} time="06:50" title="Autonomous Rail 08" detail={`${selectedMode === 'air' ? 'Switch from air corridor' : 'Central line'} · 12 min`} state="active" />
      <TimelineItem icon={BusFront} time="07:02" title="KDU Campus" detail="Exit at Learning Gate · 4 min walk" state="upcoming" last />
    </div></div>
    <button className="primary-action" onClick={onTrack}><Navigation aria-hidden="true" /> Follow this journey <ArrowRight aria-hidden="true" /></button>
  </section>
);

const TimelineItem: React.FC<{ icon: React.ElementType; time: string; title: string; detail: string; state: string; last?: boolean }> = ({ icon: Icon, time, title, detail, state, last }) => <div className={`timeline-item ${state} ${last ? 'last' : ''}`}><div className="timeline-rail"><span className="timeline-node"><Icon aria-hidden="true" /></span></div><div className="timeline-copy"><span className="timeline-time">{time}</span><strong>{title}</strong><small>{detail}</small></div><span className="timeline-state">{state === 'complete' ? 'Done' : state === 'active' ? 'Now' : 'Next'}</span></div>;

export const LiveTracking: React.FC<{ linear: boolean; onToggleLinear: () => void }> = ({ linear, onToggleLinear }) => (
  <section className="tracking-screen" aria-labelledby="tracking-heading">
    <div className="tracking-header"><div><span className="section-kicker">04 / Live tracking</span><h2 id="tracking-heading">Rail 08 is moving</h2><p className="lede">Central Exchange <span>→</span> KDU Campus</p></div><span className="tracking-live"><span className="status-dot" /> Live</span></div>
    <div className={`tracking-visual ${linear ? 'linear-mode' : ''}`}>
      {!linear ? <><div className="map-grid" /><div className="map-label label-a">CENTRAL EXCHANGE</div><div className="map-label label-b">KDU CAMPUS</div><div className="map-line"><span className="map-stop stop-a" /><span className="map-stop stop-b" /><span className="map-stop stop-c" /><span className="vehicle-pulse"><TrainFront aria-hidden="true" /></span></div><div className="map-compass">N<br /><span>+</span></div></> : <div className="linear-progress"><div className="progress-label"><strong>3 stops remaining</strong><span>Arriving in 4 min</span></div><div className="progress-track"><span /><i /><i /><i /></div><div className="progress-stops"><span>Central<br />Exchange</span><span>Park<br />Ring</span><span>Learning<br />Gate</span><span>KDU<br />Campus</span></div></div>}
      <button className="view-toggle" onClick={onToggleLinear} aria-pressed={linear}>{linear ? <Navigation aria-hidden="true" /> : <Route aria-hidden="true" />}<span>{linear ? 'Map view' : 'Linear / list mode'}</span></button>
    </div>
    <div className="status-sheet"><div className="sheet-handle" /><div className="status-sheet-heading"><div><span className="section-kicker">Simple live status</span><h3>Everything is on track.</h3></div><ShieldCheck className="safety-icon" aria-label="Safety status: clear" /></div><div className="live-metrics"><div><Gauge aria-hidden="true" /><span>Speed</span><strong>242 km/h</strong></div><div><MapPin aria-hidden="true" /><span>Current node</span><strong>Park Ring 03</strong></div><div><CloudSun aria-hidden="true" /><span>Conditions</span><strong>Clear and safe</strong></div></div><button className="secondary-action" type="button"><Headphones aria-hidden="true" /> Need help?</button></div>
  </section>
);
