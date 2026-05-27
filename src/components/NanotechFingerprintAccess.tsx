import React, { useState, useEffect, useRef } from "react";
import { Fingerprint, Unlock, Lock, Zap, Cpu, Atom, AlertTriangle, ShieldAlert } from "lucide-react";

interface NanotechProps {
  primaryColor: string;
  onAddLog: (msg: string, level: "INFO" | "WARNING" | "CRITICAL", subsystem: "CORE" | "NEURAL" | "SHIELD" | "BIOMETRIC" | "TECTONIC") => void;
}

export default function NanotechFingerprintAccess({ primaryColor, onAddLog }: NanotechProps) {
  const [fingerprintPressed, setFingerprintPressed] = useState(false);
  const [authProgress, setAuthProgress] = useState(0);
  const [freeLockEnabled, setFreeLockEnabled] = useState(false);
  const [nanoDensity, setNanoDensity] = useState(42);
  const [latticeStatus, setLatticeStatus] = useState<"IDLE" | "INJECTING" | "STABLE" | "OVERCHARGED">("STABLE");
  const [tempBypass, setTempBypass] = useState(false);

  const authTimer = useRef<NodeJS.Timeout | null>(null);

  // Free-lock audio-visual feedback simulator
  const handleFingerprintDown = () => {
    if (freeLockEnabled) {
      // Toggle off if already authenticated
      setFreeLockEnabled(false);
      setNanoDensity(20);
      setLatticeStatus("IDLE");
      onAddLog("Biometric Free Lock disengaged. Standard Stark firewall protocol restored.", "INFO", "BIOMETRIC");
      return;
    }

    setFingerprintPressed(true);
    setAuthProgress(0);
    onAddLog("Initiating Biometric Free-Lock Fingerprint query...", "INFO", "BIOMETRIC");
  };

  const handleFingerprintUp = () => {
    if (!freeLockEnabled && fingerprintPressed) {
      setFingerprintPressed(false);
      setAuthProgress(0);
      onAddLog("Biometric fingerprint hold released prematurely. Uplink voided.", "WARNING", "BIOMETRIC");
    }
  };

  useEffect(() => {
    if (fingerprintPressed && authProgress < 100) {
      const interval = setInterval(() => {
        setAuthProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setFingerprintPressed(false);
            setFreeLockEnabled(true);
            setNanoDensity(95);
            setLatticeStatus("STABLE");
            onAddLog("BIOMETRIC FREE-LOCK GRANTED: Fingerprint authenticated. Master firewall bypassed.", "INFO", "BIOMETRIC");
            onAddLog("Nanoparticle assembly array synchronized to 95% capacity.", "INFO", "CORE");
            return 100;
          }
          return prev + 10;
        });
      }, 120);

      return () => clearInterval(interval);
    }
  }, [fingerprintPressed, authProgress]);

  // Handle manual nanoparticle dispersion
  const injectNanoparticles = () => {
    if (latticeStatus === "INJECTING") return;
    
    setLatticeStatus("INJECTING");
    onAddLog("Directing liquid nanoparticle dispersion stream into the vascular armor...", "INFO", "NEURAL");

    let current = nanoDensity;
    const interval = setInterval(() => {
      current += 6;
      if (current >= 120) {
        clearInterval(interval);
        setNanoDensity(120);
        setLatticeStatus("OVERCHARGED");
        onAddLog("WARNING: Nanoparticle volume optimized to 120%. Silicon carbide crystalline structure superheated.", "WARNING", "SHIELD");
      } else if (current >= 100) {
        clearInterval(interval);
        setNanoDensity(100);
        setLatticeStatus("STABLE");
        onAddLog("Nanoparticle synthesis finalized. Exoskeleton plating structural integrity locked at 100%.", "INFO", "SHIELD");
      } else {
        setNanoDensity(current);
      }
    }, 150);
  };

  const purgeNanoparticles = () => {
    setNanoDensity(12);
    setLatticeStatus("IDLE");
    onAddLog("Nanoparticle assembly purge command executed. Plating dissolved.", "WARNING", "CORE");
  };

  return (
    <div className="glass-panel p-4 h-full flex flex-col justify-between select-none relative overflow-hidden">
      
      {/* Top Banner with indicators */}
      <div className="flex justify-between items-center mb-1 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <Atom className="w-4 h-4 animate-spin text-amber-500" style={{ color: primaryColor }} />
          <span className="font-label-caps text-[9px] font-bold uppercase tracking-widest text-white">
            Nanoparticle Deployment Control
          </span>
        </div>
        <span className="text-[7.5px] font-mono opacity-50 uppercase tracking-widest">
          SYS-NANO // XL-42
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3.5 my-auto items-center">
        {/* Left column: Biometric Free-Lock Fingerprint access trigger */}
        <div className="flex flex-col items-center justify-center border-r border-white/5 pr-2.5">
          <p className="text-[7.5px] text-white/50 font-mono uppercase tracking-widest mb-2 text-center">
            FREE LOCK ACCESS
          </p>
          
          <button
            id="fingerprint-scan-pad"
            onMouseDown={handleFingerprintDown}
            onMouseUp={handleFingerprintUp}
            onTouchStart={handleFingerprintDown}
            onTouchEnd={handleFingerprintUp}
            style={{
              borderColor: freeLockEnabled ? primaryColor : "rgba(255,255,255,0.1)",
              boxShadow: fingerprintPressed ? `0 0 15px ${primaryColor}` : "none"
            }}
            className={`w-16 h-16 rounded-full border-2 flex flex-col items-center justify-center bg-black/40 hover:bg-white/5 transition-all cursor-pointer relative active:scale-95 group overflow-hidden`}
          >
            {/* Pulsing ring during press holding */}
            {fingerprintPressed && (
              <div 
                className="absolute inset-0 rounded-full border border-dashed animate-spin opacity-40"
                style={{ borderColor: primaryColor }}
              />
            )}

            <Fingerprint 
              className={`w-8 h-8 transition-transform duration-300 ${fingerprintPressed ? "scale-110" : ""}`} 
              style={{ color: freeLockEnabled ? primaryColor : fingerprintPressed ? "#FFF" : "rgba(255,255,255,0.4)" }} 
            />

            {fingerprintPressed && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <span className="text-[8px] tracking-wider font-bold" style={{ color: primaryColor }}>
                  {authProgress}%
                </span>
              </div>
            )}
          </button>
          
          <p className="text-[7px] text-center font-mono uppercase mt-2 select-none tracking-widest text-white/60">
            {freeLockEnabled ? (
              <span className="flex items-center gap-1 font-bold" style={{ color: primaryColor }}>
                <Unlock size={8} /> FREE-LOCK ENGAGED
              </span>
            ) : fingerprintPressed ? (
              <span className="animate-pulse" style={{ color: primaryColor }}>SCANNING HOLD...</span>
            ) : (
              <span className="text-white/40 flex items-center gap-1">
                <Lock size={8} /> HOLD TO FREE-LOCK
              </span>
            )}
          </p>
        </div>

        {/* Right column: Nanoparticle introduction dynamic metrics */}
        <div className="space-y-2 text-left">
          <div>
            <div className="flex justify-between items-baseline mb-0.5">
              <span className="text-[7.5px] text-white/50 uppercase tracking-wide">NANO-MATRIX DENSITY</span>
              <span className="text-[10px] font-bold" style={{ color: primaryColor }}>{nanoDensity}%</span>
            </div>
            
            {/* Visual horizontal nanoparticle bar representation */}
            <div className="w-full h-1.5 bg-black/60 rounded border border-white/5 overflow-hidden relative">
              <div 
                className="h-full transition-all duration-300 relative"
                style={{ 
                  width: `${Math.min(nanoDensity, 100)}%`, 
                  backgroundColor: primaryColor,
                  boxShadow: `0 0 8px ${primaryColor}`
                }} 
              >
                {/* Glowing fluid simulation flow effect inside the progress bar */}
                {latticeStatus === "INJECTING" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_1s_infinite]" />
                )}
              </div>
            </div>
          </div>

          <div className="text-[7.5px] font-mono text-white/60 space-y-1">
            <div className="flex justify-between">
              <span>LATTICE MATRIX:</span>
              <span className={`font-bold ${
                latticeStatus === "OVERCHARGED" ? "text-red-400" :
                latticeStatus === "INJECTING" ? "text-amber-400 animate-pulse" :
                latticeStatus === "STABLE" ? "text-emerald-400" : "text-white/40"
              }`}>
                {latticeStatus}
              </span>
            </div>
            <div className="flex justify-between">
              <span>CRYSTALLINE:</span>
              <span className="text-white font-bold">{freeLockEnabled ? "SILICON-CARBIDE" : "STANDARD COBALT"}</span>
            </div>
            <div className="flex justify-between">
              <span>AUTO-HEAL RT:</span>
              <span className="text-white font-bold">{freeLockEnabled ? "8.4 nm/s" : "0.5 nm/s"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dispersion Interaction Controls */}
      <div className="grid grid-cols-2 gap-1.5 border-t border-white/5 pt-2 flex-shrink-0">
        <button
          id="btn-nano-inject"
          onClick={injectNanoparticles}
          disabled={latticeStatus === "INJECTING"}
          style={{ borderColor: primaryColor, color: primaryColor }}
          className="py-1 border hover:bg-white/5 text-[8.5px] font-mono uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95 disabled:opacity-50"
        >
          <Zap size={9} /> INJECT MATRIX
        </button>
        <button
          id="btn-nano-purge"
          onClick={purgeNanoparticles}
          className="py-1 border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 text-white/70 hover:text-red-400 text-[8.5px] font-mono uppercase tracking-widest transition-all cursor-pointer active:scale-95"
        >
          PURGE NANO
        </button>
      </div>

    </div>
  );
}
