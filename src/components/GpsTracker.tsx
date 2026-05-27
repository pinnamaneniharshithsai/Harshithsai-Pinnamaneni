import { GeolocationData } from "../types";
import { PRESET_LOCATIONS } from "../data/presetData";
import { Compass, Orbit, AlertCircle } from "lucide-react";

interface GpsTrackerProps {
  primaryColor: string;
  activeLocation: GeolocationData;
  onSelectLocation: (location: GeolocationData) => void;
  scaleFactor: number; // Controlled by Pinch gesture zoom
}

export default function GpsTracker({ primaryColor, activeLocation, onSelectLocation, scaleFactor }: GpsTrackerProps) {
  return (
    <div className="glass-panel p-4 overflow-hidden flex flex-col justify-between h-full relative group">
      {/* Dynamic Header */}
      <div className="flex justify-between items-center mb-1">
        <div className="flex flex-col">
          <span className="font-label-caps text-[9px] font-bold uppercase tracking-wider animate-pulse font-bold" style={{ color: primaryColor }}>
            GPS SATELLITE TELEMETRY
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: primaryColor }} />
            <span className="font-mono text-[7.5px] opacity-60">SENSORS CONNECTED TO UPLINK</span>
          </div>
        </div>
        <Compass className="w-4 h-4 animate-[spin_12s_linear_infinite]" style={{ color: primaryColor }} />
      </div>

      {/* Grid Location dropdown switcher */}
      <div className="mt-1">
        <select
          id="select-coordinate-preset"
          value={activeLocation.name}
          onChange={(e) => {
            const selected = PRESET_LOCATIONS.find((loc) => loc.name === e.target.value);
            if (selected) onSelectLocation(selected);
          }}
          className="bg-black/60 text-white font-mono text-[9px] border border-white/20 w-full p-1 uppercase focus:ring-1 focus:ring-primary focus:outline-none tracking-widest cursor-pointer mb-2"
        >
          {PRESET_LOCATIONS.map((loc) => (
            <option key={loc.name} value={loc.name}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Futuristic central scanning viewport with React state scaling */}
      <div className="relative h-24 bg-black/60 rounded border border-white/10 overflow-hidden mb-2">
        {/* Hotlinked map viewport with dynamic scale interpolation */}
        <img
          id="img-coordinates-map"
          alt="Satellite radar grid"
          className="w-full h-full object-cover opacity-45 filter sepia hue-rotate-[180deg] transition-transform duration-500"
          style={{ transform: `scale(${scaleFactor})` }}
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6m6HyVyXC2HbicLCpNilesQnws9iQ84LyWyyHARASXCwVFCQa7_Jk0wExABHHn_vytseKGI-wPfVzuaiYV-VOM61OYMSRJfcbD-almYT2PAs-lzd8boh6a2iZvfrHbFvWKAAXH5TcSo7BBcJZqw9DrwioEHU6qOZnniBKmVnz_tIs2yycQNsdzMYwoPZAqFtX8SMWMUSYxlQ-4ImnGDs861CS4S-9RD3BIr3FE40to623HO_mWjZ2BazJEtLYagVMtuQwFreL3UxL"
        />

        {/* Tactical crosshair targeting reticle pulsing */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-6 h-6 border border-primary/40 rounded-full animate-ping" style={{ borderColor: primaryColor }} />
          <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
        </div>

        {/* Pinch scale label marker */}
        {scaleFactor > 1 && (
          <div className="absolute top-1 right-2 bg-black/80 border border-white/10 px-1 py-0.5 text-[7px] font-mono tracking-widest uppercase">
            PINCH MAG: {scaleFactor}x
          </div>
        )}
      </div>

      {/* Grid Coordinates numerical values */}
      <div className="grid grid-cols-2 gap-2 mt-auto">
        <div className="text-[9px] font-mono border-l-2 pl-2 space-y-0.5" style={{ borderColor: primaryColor }}>
          <p className="text-white/60">LAT: <span className="text-white font-bold">{activeLocation.latitude}</span></p>
          <p className="text-white/60">LON: <span className="text-white font-bold">{activeLocation.longitude}</span></p>
        </div>
        <div className="text-[9px] font-mono border-l-2 pl-2 space-y-0.5" style={{ borderColor: primaryColor }}>
          <p className="text-white/60">ALT: <span className="text-white font-bold">{activeLocation.altitude} FT</span></p>
          <p className="text-white/60">SPD: <span className="text-white font-bold">{activeLocation.speed} MACH</span></p>
        </div>
      </div>
    </div>
  );
}
