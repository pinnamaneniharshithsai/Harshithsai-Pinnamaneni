import { useState, useEffect } from "react";
import { User, ShieldAlert, Fingerprint, Scan, RefreshCw } from "lucide-react";

interface BiometricScannerProps {
  primaryColor: string;
  userName: string;
  onNameChange: (newName: string) => void;
}

export default function BiometricScanner({ primaryColor, userName, onNameChange }: BiometricScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(100);
  const [identityVerified, setIdentityVerified] = useState(true);
  const [manualInput, setManualInput] = useState(false);

  const startScan = () => {
    if (scanning) return;
    setScanning(true);
    setProgress(0);
    setIdentityVerified(false);
  };

  useEffect(() => {
    if (!scanning) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          setIdentityVerified(true);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [scanning]);

  return (
    <div className="glass-panel p-4 relative overflow-hidden flex flex-col justify-between h-full group">
      {/* Sector tracker header */}
      <div className="flex justify-between items-start mb-2">
        <span className="font-label-caps text-[9px] font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
          Bio-Authentication System
        </span>
        <span className="text-[9px] font-mono opacity-50 font-label-caps">SEC-004</span>
      </div>

      {/* Main scan framing viewport with reactive colors */}
      <div className="relative aspect-video bg-black/60 border border-white/10 flex items-center justify-center overflow-hidden">
        {/* Holographic scanning target image */}
        <img
          id="img-biometric"
          alt="Biometric retinal framework"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-35 filter brightness-110"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCszWOdLLoQ9MbSCwp7wWufQ-u-4jVrtECvYqj0iZP0MLUHqStjvXj2obODu7be3NJctP3LrYCNiJEpohxU7MiaQ4bVbK5xlOqgUmKRJjKoUd1kMT0CugK7yzK1cmrjimPC3X-UKrstOOBjcPv9fC4UmBG-A_vMWau6UZ2TzXhttF2ciLKj2ELBBFLSotRk_bkqZfSQMWmsWGUj4aZgbnHmFoHHvp3kQeyUsSLZ0Vq-4P7FwSMYcAiGb-cBZHUh_xriCGrS1k44UEB0"
        />

        {/* Scan sweeping laser line */}
        {scanning && (
          <div
            style={{ backgroundColor: primaryColor }}
            className="absolute top-0 left-0 w-full h-[3px] shadow-[0_0_10px_2px_rgba(0,240,255,0.7)] animate-[scan-tracer_2.5s_linear_infinite]"
          />
        )}

        {/* Dynamic target tracking reticle overlay */}
        <div className="absolute inset-2 border-2 border-dashed border-white/5 pointer-events-none" />

        {progress < 100 && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <Scan className="w-8 h-8 animate-pulse mb-1" style={{ color: primaryColor }} />
            <span className="font-mono text-[10px] tracking-widest uppercase mb-1" style={{ color: primaryColor }}>
              SCANNING INDEX: {progress}%
            </span>
            <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full transition-all duration-100" style={{ width: `${progress}%`, backgroundColor: primaryColor }} />
            </div>
          </div>
        )}

        {identityVerified && progress === 100 && (
          <div className="absolute bottom-2 left-2 flex flex-col bg-black/60 px-2 py-1 border border-white/10">
            <span className="font-mono text-[9px] uppercase tracking-wider flex items-center gap-1" style={{ color: primaryColor }}>
              <User size={10} /> REGISTRY: {userName.toUpperCase()}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: primaryColor }}>
              SEC REGISTER: MATCH 100%
            </span>
          </div>
        )}
      </div>

      {/* Manual Input form and action buttons */}
      <div className="mt-3 space-y-2">
        {manualInput ? (
          <div className="flex gap-1 items-center">
            <input
              id="txt-username"
              type="text"
              value={userName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="ENTER ADMIN NAME..."
              className="bg-black/50 border border-white/20 px-2 py-1 text-[9px] focus:outline-none focus:ring-1 focus:ring-primary w-full tracking-widest text-white uppercase font-mono h-6"
            />
            <button
              id="btn-confirm-name"
              onClick={() => setManualInput(false)}
              className="px-2 border border-white/20 hover:bg-white/10 text-[9px] uppercase text-white font-mono h-6"
            >
              SET
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center text-[10px] font-mono">
            <div className="flex items-center gap-1.5 opacity-80 text-white">
              <Fingerprint className="w-3.5 h-3.5" style={{ color: primaryColor }} />
              <span>STARK REGISTRY MATCH</span>
            </div>
            <button
              id="btn-registry-edit"
              onClick={() => setManualInput(true)}
              style={{ color: primaryColor }}
              className="text-[9px] underline uppercase tracking-wider hover:opacity-100 cursor-pointer"
            >
              CONFIGURE ID
            </button>
          </div>
        )}

        <button
          id="btn-trigger-scan"
          disabled={scanning}
          onClick={startScan}
          style={{ borderColor: scanning ? `${primaryColor}20` : primaryColor }}
          className="w-full text-center py-1 border border-primary/40 hover:bg-white/5 active:scale-98 transition-all duration-150 rounded text-[9px] text-white font-mono tracking-widest uppercase flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={10} className={scanning ? "animate-spin" : ""} />
          {scanning ? "RE-CALIBRATING BIOMETRICS" : "RE-SCAN BIOMETRICS"}
        </button>
      </div>
    </div>
  );
}
