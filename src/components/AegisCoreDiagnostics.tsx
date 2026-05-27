import { useState } from "react";
import { Zap, AlertTriangle, ShieldCheck, Cpu } from "lucide-react";
import { SystemStatus } from "../types";

interface AegisCoreDiagnosticsProps {
  primaryColor: string;
  system: SystemStatus;
  onChangeSystem: (updated: SystemStatus) => void;
  onAddLog: (msg: string, level: "INFO" | "WARNING" | "CRITICAL", subsystem: "CORE" | "NEURAL" | "SHIELD" | "BIOMETRIC" | "TECTONIC") => void;
}

export default function AegisCoreDiagnostics({ primaryColor, system, onChangeSystem, onAddLog }: AegisCoreDiagnosticsProps) {
  const [overdrive, setOverdrive] = useState(false);

  const toggleOverdrive = () => {
    const isNowOverdrive = !overdrive;
    setOverdrive(isNowOverdrive);

    if (isNowOverdrive) {
      onChangeSystem({
        ...system,
        reactorPower: 2.84,
        coreTemp: 115,
        shieldStability: 42,
      });
      onAddLog("REACTOR CORES OVERCLOCKED: OVERDRIVE DETECTED", "CRITICAL", "CORE");
    } else {
      onChangeSystem({
        ...system,
        reactorPower: 1.21,
        coreTemp: 45,
        shieldStability: 96,
      });
      onAddLog("Reactor thermals cooled to baseline limits (optimal standard).", "INFO", "CORE");
    }
  };

  const toggleStandby = () => {
    const newStandby = !system.armorStandby;
    onChangeSystem({ ...system, armorStandby: newStandby });
    onAddLog(
      newStandby ? "Combat modules initialized. Suit configured to active STANDBY." : "Failsafe codes engaged. System in diagnostic standby.",
      newStandby ? "WARNING" : "INFO",
      "CORE"
    );
  };

  return (
    <div className="glass-panel p-4 h-full flex flex-col justify-between relative group">
      {/* Widget Header bar */}
      <div className="flex justify-between items-start">
        <span className="font-label-caps text-[9px] font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
          Reactor Core Diagnostics
        </span>
        <span className="text-[9px] font-mono opacity-50 font-label-caps">STARK-M42</span>
      </div>

      {/* Numerical status gauges readout */}
      <div className="grid grid-cols-3 gap-2 my-2 text-center">
        {/* Core Output Gauge */}
        <div className="bg-black/40 border border-white/5 p-1.5 rounded relative">
          <Zap className="w-3.5 h-3.5 mx-auto mb-0.5" style={{ color: overdrive ? "#f87171" : primaryColor }} />
          <p className="font-mono text-[11px] font-bold text-white">{system.reactorPower.toFixed(2)} GW</p>
          <span className="font-mono text-[7px] text-white/50 uppercase tracking-widest block">Core Load</span>
        </div>

        {/* Thermals Gauge */}
        <div className="bg-black/40 border border-white/5 p-1.5 rounded relative">
          <Cpu className="w-3.5 h-3.5 mx-auto mb-0.5" style={{ color: system.coreTemp > 90 ? "#ef4444" : primaryColor }} />
          <p className="font-mono text-[11px] font-bold text-white" style={{ color: system.coreTemp > 90 ? "#f87171" : "#fff" }}>
            {system.coreTemp}°C
          </p>
          <span className="font-mono text-[7px] text-white/50 uppercase tracking-widest block">Heat Grid</span>
        </div>

        {/* Shield stability gauge */}
        <div className="bg-black/40 border border-white/5 p-1.5 rounded relative">
          <ShieldCheck className="w-3.5 h-3.5 mx-auto mb-0.5" style={{ color: overdrive ? "#f59e0b" : primaryColor }} />
          <p className="font-mono text-[11px] font-bold text-white">{system.shieldStability}%</p>
          <span className="font-mono text-[7px] text-white/50 uppercase tracking-widest block">Deflector</span>
        </div>
      </div>

      {/* Warning Flash alerts */}
      {overdrive && (
        <div className="bg-red-950/40 border border-red-500/30 p-1.5 flex items-center gap-2 mb-2 animate-pulse rounded text-left">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-[8.5px] font-mono text-red-300 leading-tight">
            CORE EXCEEDS SAFE LEVEL STANDARDS. DISCHARGE THERMAL GRID COILS IMMEDIATELY!
          </span>
        </div>
      )}

      {/* Override actions sliders */}
      <div className="space-y-1.5">
        <button
          id="btn-toggle-overdrive"
          onClick={toggleOverdrive}
          style={{
            borderColor: overdrive ? "#f87171" : primaryColor,
            backgroundColor: overdrive ? "rgba(239, 68, 68, 0.15)" : "transparent",
            color: overdrive ? "#f87171" : primaryColor,
          }}
          className="w-full text-center py-1.5 border hover:bg-white/5 hover:text-white transition-all text-[9.5px] font-mono font-bold tracking-widest uppercase rounded cursor-pointer"
        >
          {overdrive ? "DISCHARGE CORE OVERCLOCK" : "INITIATE CORES OVERCLOCK"}
        </button>

        <button
          id="btn-toggle-armor-standby"
          onClick={toggleStandby}
          style={{
            borderColor: system.armorStandby ? "#f59e0b" : "rgba(255,255,255,0.15)",
            backgroundColor: system.armorStandby ? "rgba(245, 158, 11, 0.15)" : "transparent",
            color: system.armorStandby ? "#f59e0b" : "rgba(255,255,255,0.7)",
          }}
          className="w-full text-center py-1.5 border hover:bg-white/5 transition-all text-[9.5px] font-mono font-bold tracking-widest uppercase rounded cursor-pointer"
        >
          {system.armorStandby ? "ARMOR ENGAGED [ACTIVE STANDBY]" : "DEPLOY MARK XLII ARMOR"}
        </button>
      </div>
    </div>
  );
}
