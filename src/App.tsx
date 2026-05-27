import { useState, useEffect, useRef } from "react";
import { HudTheme, SystemStatus, GeolocationData, LogEntry, GestureType } from "./types";
import { PRESET_LOCATIONS, INITIAL_LOGS } from "./data/presetData";

// Sub-components
import IntroOverlay from "./components/IntroOverlay";
import BiometricScanner from "./components/BiometricScanner";
import GestureControl from "./components/GestureControl";
import GpsTracker from "./components/GpsTracker";
import NetworkTraffic from "./components/NetworkTraffic";
import AegisCoreDiagnostics from "./components/AegisCoreDiagnostics";
import JarvisChatbot from "./components/JarvisChatbot";
import NanotechFingerprintAccess from "./components/NanotechFingerprintAccess";

// Icons
import {
  Activity,
  Fingerprint,
  Globe,
  Radio,
  Settings,
  Shield,
  History,
  Terminal,
  Zap,
  RefreshCw,
  Compass,
  Volume2,
  Lock,
  Layers,
  ChevronRight
} from "lucide-react";

export default function App() {
  const [introActive, setIntroActive] = useState(true);
  const [hudTheme, setHudTheme] = useState<HudTheme>("gold");
  const [userName, setUserName] = useState("TONY STARK");
  const [currentGesture, setCurrentGesture] = useState<GestureType>("SWIPE");
  const [currentLocation, setCurrentLocation] = useState<GeolocationData>(PRESET_LOCATIONS[0]);
  const [activeTab, setActiveTab] = useState<"DIAGNOSTICS" | "GPS" | "SYSTEM-CMD" | "LOGS">("DIAGNOSTICS");

  // System core status parameters
  const [system, setSystem] = useState<SystemStatus>({
    reactorPower: 1.21,
    coreTemp: 45,
    shieldStability: 98.4,
    cyberlinkStable: true,
    activeSector: "STARK-NY",
    armorStandby: false,
  });

  // Event stream diagnostics logs
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);

  // Chat conversation wave triggers
  const [chattingActive, setChattingActive] = useState(false);

  // Globe filter projection toggles
  const [globeFilter, setGlobeFilter] = useState<"standard" | "grid" | "heat">("standard");

  const matrixCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Hex codes corresponding to chosen HUD theme
  const themeColors: Record<HudTheme, string> = {
    gold: "#C5A059",
    cyan: "#00f0ff",
    orange: "#f59e0b",
    violet: "#8b5cf6"
  };

  const primaryColor = themeColors[hudTheme];

  // Dynamically record logs for interactive operations
  const appendLog = (
    msg: string,
    level: "INFO" | "WARNING" | "CRITICAL",
    subsystem: "CORE" | "NEURAL" | "SHIELD" | "BIOMETRIC" | "TECTONIC"
  ) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: timeStr,
      subsystem,
      message: msg,
      level
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 30));
  };

  // Switch presets and trigger cognitive logging
  const handleLocationChange = (loc: GeolocationData) => {
    setCurrentLocation(loc);
    appendLog(`Gps mapping synchronized with ${loc.name}. Sector triangulation lock engaged.`, "INFO", "TECTONIC");
  };

  const executeManualCommand = (commandType: string) => {
    if (commandType === "REACTOR_UPDATE") {
      appendLog("A.I. core linked to reactor thermals. Sync level: optimum.", "INFO", "CORE");
    } else if (commandType === "OVERRIDE_SECURITY") {
      setSystem(prev => ({ ...prev, shieldStability: 100 }));
      appendLog("Stark clearance level override recognized. Calibrating structural shields.", "WARNING", "SHIELD");
    }
  };

  // Matrix backdrop canvas loop
  useEffect(() => {
    if (introActive) return;
    const canvas = matrixCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const charStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=_()[]{}<>";
    const fontSize = 12;
    const columns = Math.floor(width / fontSize);
    const rainDrops: number[] = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(11, 12, 16, 0.08)";
      ctx.fillRect(0, 0, width, height);

      // Render trails with specific colors based on the chosen HUD theme
      ctx.fillStyle = `${primaryColor}22`; // Low contrast flow
      ctx.font = `${fontSize}px monospace`;

      rainDrops.forEach((y, x) => {
        const text = charStr.charAt(Math.floor(Math.random() * charStr.length));
        ctx.fillText(text, x * fontSize, y * fontSize);

        if (y * fontSize > height && Math.random() > 0.985) {
          rainDrops[x] = 0;
        }
        rainDrops[x]++;
      });
    };

    const interval = setInterval(draw, 33);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, [introActive, primaryColor]);

  // Handle pinch swipe scale modifier
  const gestureScales: Record<GestureType, number> = {
    PINCH: 1.85,
    SWIPE: 1.0,
    PALM: 1.0,
    FIST: 0.75
  };
  const activeScale = gestureScales[currentGesture];

  return (
    <div className="relative min-h-screen text-slate-100 overflow-x-hidden font-mono antialiased bg-[#0A0A0A]">
      {/* Nanotech assembly intro splash screen overlay */}
      {introActive ? (
        <IntroOverlay primaryColor={primaryColor} onComplete={() => setIntroActive(false)} />
      ) : (
        <>
          {/* Matrix background stream */}
          <canvas ref={matrixCanvasRef} id="matrix-canvas" className="opacity-[0.09]" />
          <div className="fixed inset-0 pointer-events-none nanotech-bg" />
          <div className="fixed inset-y-0 left-0 w-px bg-white/5 pointer-events-none" />

          {/* Top master Navigation status bar */}
          <header className="fixed top-0 left-0 w-full h-14 z-50 flex items-center justify-between px-6 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/10">
            <div className="flex items-center gap-3">
              <div
                className="w-2.5 h-2.5 rounded-full animate-ping"
                style={{ backgroundColor: primaryColor }}
              />
              <span className="font-bold tracking-[0.2em] text-[13px] text-white flex items-center gap-2 select-none uppercase">
                STITCH // NEURAL HUD TERMINAL
              </span>
            </div>

            {/* Micro readouts panel */}
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-3 px-4 py-1 border-x border-white/5 text-[10px]">
                <span className="opacity-55 tracking-wider uppercase text-white font-mono">NEURAL HEALTH:</span>
                <span className="font-bold tracking-widest text-[#10b981] animate-pulse">OPTIMAL [98.4%]</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  id="btn-re-sync"
                  onClick={() => appendLog("Network frequencies calibrated. Local system synced with mainframes.", "INFO", "NEURAL")}
                  className="hover:bg-white/5 p-1 rounded transition-colors text-slate-400 hover:text-white cursor-pointer"
                  title="Resync Sub-Grids"
                >
                  <RefreshCw size={14} />
                </button>
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
              </div>
            </div>
          </header>

          {/* Sidenav tactical cockpit sidebar */}
          <aside className="fixed left-0 top-0 h-full pt-16 pb-6 w-60 bg-[#161616]/95 backdrop-blur-xl border-r border-white/10 flex flex-col z-40 transition-transform duration-300">
            
            {/* User credentials placard widget */}
            <div className="px-4 mb-6">
              <div className="flex items-center gap-3 p-2.5 bg-white/5 border border-white/5 rounded-md">
                <div className="w-10 h-10 rounded-full border border-primary/40 relative overflow-hidden flex-shrink-0" style={{ borderColor: primaryColor }}>
                  <img
                    id="img-avatar"
                    alt="Stark core hologram"
                    className="w-full h-full object-cover filter brightness-95"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUeuvRaSTboRnRlpEetk0x5sxbVzVNbw79FdLWHkI6_0tcgu6JlcWgUA7qioaxDXhhgUsjJNZnG5u8eQ3UpzrHjLa1LS1mBqENwIDvQ_tE9-DMiDjgVMA1Wce7BT_72nwtmKc4ixgQ9-ADixewTwb7CU_bHrG-McWlLNEi1WbTohSqw965EW-s6_tehQ1iDZp8M0TMjwRknFbtcbiXg57YvJ6bR4PO5YN840IK6EjsPOHPbtx457YXz9ymdqgTUb3LB7S_oSpcoaY2"
                  />
                  <div className="absolute inset-0 bg-primary/10" style={{ backgroundColor: `${primaryColor}20` }} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[10.5px] text-white tracking-widest truncate">{userName.toUpperCase()}</p>
                  <p className="text-[7.5px] opacity-50 tracking-wider flex items-center gap-1">
                    <span>SECURITY CR: EX-4</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar selection tabs layout */}
            <div className="flex-grow space-y-1 px-2 text-left">
              <button
                id="tab-diagnostics"
                onClick={() => setActiveTab("DIAGNOSTICS")}
                style={{
                  borderLeftColor: activeTab === "DIAGNOSTICS" ? primaryColor : "transparent",
                  backgroundColor: activeTab === "DIAGNOSTICS" ? `${primaryColor}15` : "transparent",
                  color: activeTab === "DIAGNOSTICS" ? primaryColor : "rgba(227, 225, 233, 0.7)",
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold tracking-[0.165em] hover:bg-white/5 border-l-2 hover:text-white transition-all text-left uppercase cursor-pointer"
              >
                <Activity size={12} /> CORE DIAGNOSTICS
              </button>

              <button
                id="tab-gps"
                onClick={() => setActiveTab("GPS")}
                style={{
                  borderLeftColor: activeTab === "GPS" ? primaryColor : "transparent",
                  backgroundColor: activeTab === "GPS" ? `${primaryColor}15` : "transparent",
                  color: activeTab === "GPS" ? primaryColor : "rgba(227, 225, 233, 0.7)",
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold tracking-[0.165em] hover:bg-white/5 border-l-2 hover:text-white transition-all text-left uppercase cursor-pointer"
              >
                <Compass size={12} /> GPS-RADAR TRACK
              </button>

              <button
                id="tab-system-cmd"
                onClick={() => setActiveTab("SYSTEM-CMD")}
                style={{
                  borderLeftColor: activeTab === "SYSTEM-CMD" ? primaryColor : "transparent",
                  backgroundColor: activeTab === "SYSTEM-CMD" ? `${primaryColor}15` : "transparent",
                  color: activeTab === "SYSTEM-CMD" ? primaryColor : "rgba(227, 225, 233, 0.7)",
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold tracking-[0.165em] hover:bg-white/5 border-l-2 hover:text-white transition-all text-left uppercase cursor-pointer"
              >
                <Terminal size={12} /> SYSTEM-COMMAND
              </button>

              <button
                id="tab-logs"
                onClick={() => setActiveTab("LOGS")}
                style={{
                  borderLeftColor: activeTab === "LOGS" ? primaryColor : "transparent",
                  backgroundColor: activeTab === "LOGS" ? `${primaryColor}15` : "transparent",
                  color: activeTab === "LOGS" ? primaryColor : "rgba(227, 225, 233, 0.7)",
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold tracking-[0.165em] hover:bg-white/5 border-l-2 hover:text-white transition-all text-left uppercase cursor-pointer"
              >
                <History size={12} /> HUD EVENT FLOOD
              </button>
            </div>

            {/* Diagnostics override action footer */}
            <div className="mt-auto px-4 pt-4 border-t border-white/5">
              <button
                id="btn-safety-override"
                onClick={() => {
                  setSystem(prev => ({ ...prev, coreTemp: 45, reactorPower: 1.21, shieldStability: 100 }));
                  appendLog("Safety protocols engaged. System core elements cooled immediately.", "INFO", "CORE");
                }}
                style={{ borderColor: primaryColor, color: primaryColor }}
                className="w-full py-1.5 border hover:bg-white/5 active:scale-98 transition-all duration-150 text-[8.5px] font-bold tracking-widest uppercase cursor-pointer font-mono"
              >
                ENGAGE COOLDOWN OVERRIDE
              </button>
              <div className="flex justify-between items-center mt-3 text-[8px] opacity-40 uppercase tracking-widest font-mono">
                <span>STARK ENCRYPT</span>
                <span>SECURE L-4</span>
              </div>
            </div>
          </aside>

          {/* Primary View Area Content Canvas */}
          <main className="ml-0 md:ml-60 mt-14 p-6 min-h-[calc(100vh-56px)] grid grid-cols-1 md:grid-cols-12 md:grid-rows-6 gap-4 relative overflow-hidden">
            
            {/* Holographic central scanner overlay ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 z-0">
              <div className="w-[500px] h-[500px] border border-primary/30 rounded-full flex items-center justify-center animate-[spin_50s_linear_infinite]" />
              <div className="absolute w-[350px] h-[350px] border border-dashed border-primary/20 rounded-full animate-[spin_25s_linear_infinite_reverse]" />
              <div className="absolute w-px h-full bg-slate-100/5" />
              <div className="absolute w-full h-px bg-slate-100/5" />
            </div>

            {/* Left Rail Columns: 3D Holographic Globe viewport (Standard layout cols 1-4) */}
            <div className="md:col-span-4 md:row-span-4 relative flex flex-col items-center justify-center group z-10 p-4">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-[90px] pointer-events-none" style={{ backgroundColor: `${primaryColor}05` }} />
              
              {/* Globe control shelf */}
              <div className="absolute top-2 left-2 z-20 flex gap-1 bg-black/40 border border-white/10 p-0.5 rounded text-[7.5px] font-mono select-none">
                <button
                  id="btn-globe-std"
                  onClick={() => setGlobeFilter("standard")}
                  className={`px-1.5 py-0.5 transition-colors cursor-pointer ${
                    globeFilter === "standard" ? "bg-white/10 text-white font-bold" : "text-white/50"
                  }`}
                >
                  RGB
                </button>
                <button
                  id="btn-globe-grid"
                  onClick={() => setGlobeFilter("grid")}
                  className={`px-1.5 py-0.5 transition-colors cursor-pointer ${
                    globeFilter === "grid" ? "bg-white/10 text-white font-bold" : "text-white/50"
                  }`}
                >
                  RADAR
                </button>
                <button
                  id="btn-globe-heat"
                  onClick={() => setGlobeFilter("heat")}
                  className={`px-1.5 py-0.5 transition-colors cursor-pointer ${
                    globeFilter === "heat" ? "bg-white/10 text-white font-bold" : "text-white/50"
                  }`}
                >
                  HEAT
                </button>
              </div>

              {/* Spherical container representing Earth model with gesture active rotation speed */}
              <div
                className="w-full max-w-[280px] aspect-square relative flex items-center justify-center overflow-hidden pointer-events-none"
                style={{
                  transition: "transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
                  transform: `scale(${currentGesture === "SWIPE" ? 1.05 : 0.95})`,
                }}
              >
                <img
                  id="img-holographic-globe"
                  alt="3D floating world topography"
                  className={`w-full h-full object-contain select-none transition-all duration-300 ${
                    globeFilter === "heat"
                      ? "brightness-[1.2] sepia hue-rotate-[290deg] saturate-150"
                      : globeFilter === "grid"
                      ? "brightness-[1.3] saturate-0 opacity-40 hue-rotate-[180deg]"
                      : "brightness-105"
                  } ${
                    currentGesture === "SWIPE" ? "animate-[spin_12s_linear_infinite]" : "animate-[spin_32s_linear_infinite]"
                  }`}
                  src="https://lh3.googleusercontent.com/aida/ADBb0uiNvyl3KHMTm5DvOaIix-xos_6ITyBdPi-CLxahokBV4MXZ3F_Q2mCjooyAkzj67Kanp_7G5b1iJ5SvZ1w7AlMJiTYEVBgx0qqFLPkCTqUKi7WsqfVbSksptwxdsHHWusUm85zQ0XnTuUcGaw06UF-nUOcNG0N0wCHs_nvJzVATDyBPlhEkBxoAz-lEqZhTFkyAhX2TZlohqIZp4qCCvIA1eWUgR2fw5svb7A9dkwUggGakdZ_lcwUvf6ge"
                />

                {/* Satellite orbit trails overlay markers */}
                <div className="absolute inset-0 rounded-full border border-white/5 animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border border-dashed border-white/10 animate-[spin_18s_linear_infinite_reverse]" />
              </div>

              <div className="mt-4 text-center">
                <span className="font-label-caps text-[9px] tracking-[0.25em] uppercase font-bold" style={{ color: primaryColor }}>
                  TECTORIAL CORE RADAR
                </span>
                <p className="text-[7.5px] opacity-40 uppercase font-mono mt-0.5">Filter model Projection: {globeFilter}</p>
              </div>
            </div>

            {/* Inner dynamic content layouts spanning cols 5-8 */}
            <div className="md:col-span-4 md:row-span-4 relative flex flex-col justify-between items-center z-20 p-2">
              
              {/* ARC REACTOR SPINNING MODULE */}
              <div className="relative w-full max-w-[210px] aspect-square flex items-center justify-center arc-pulse my-auto">
                <img
                  id="img-arc-reactor"
                  alt="Futuristic pulsing electromagnetic core"
                  onClick={() => {
                    const tempOver = system.coreTemp > 90;
                    appendLog(
                      tempOver ? "Extreme power output core discharged." : "Diagnostic core discharge initialized.",
                      tempOver ? "WARNING" : "INFO",
                      "CORE"
                    );
                    setSystem((prev) => ({
                      ...prev,
                      reactorPower: tempOver ? 1.21 : 1.95,
                      coreTemp: tempOver ? 45 : 85,
                    }));
                  }}
                  className="w-full h-full object-contain cursor-pointer select-none"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnjdIemoCM1nB8WM35X0PoBuFYlo1NOpY3Rdopmo5FPakynXG3COII8vPZlKjqz6pDC-xzauPdDvXYIxCqRrGiLbZSEAGimLS6gtqXc2MzVDrA0R7K4keYn1pCEkL-eNpRcnHmx8DyY3RZJTz9t_E1qrtTSd74GS07_MR7zGeILcAYw29f3MRBLe3qK5bRDckzYb_wf1NLm593OIlYhnu3k1ujpuD7mXJTvxz9OKxTeJlJ8A7prDFW9yCUNa92jSp-gB4mxAZFcDmB"
                />
                
                {/* Glowing decorative revolving tracks */}
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_8s_linear_infinite]" style={{ borderColor: `${primaryColor}25` }} />
                <div className="absolute -inset-2 rounded-full border border-dotted border-primary/10 animate-[spin_15s_linear_infinite_reverse]" style={{ borderColor: `${primaryColor}15` }} />
              </div>

              <div className="text-center w-full">
                <h2 className="font-display-lg text-[13px] tracking-[0.3em] uppercase text-white font-bold">
                  Neural Reactor active
                </h2>
                <div className="text-[9px] text-white opacity-60 font-mono mt-1">
                  ENERGY REVENUE: <span className="font-bold text-white">{system.reactorPower.toFixed(2)} GW</span> | TEMP: <span className="font-bold text-white">{system.coreTemp}°C</span>
                </div>
              </div>
            </div>

            {/* Right Rail widgets (Grid layout col 9-12 rows 1-3) */}
            <div className="md:col-span-4 md:row-span-3 grid grid-cols-1 gap-4 z-20">
              {activeTab === "DIAGNOSTICS" ? (
                <AegisCoreDiagnostics
                  primaryColor={primaryColor}
                  system={system}
                  onChangeSystem={setSystem}
                  onAddLog={appendLog}
                />
              ) : activeTab === "GPS" ? (
                <GpsTracker
                  primaryColor={primaryColor}
                  activeLocation={currentLocation}
                  onSelectLocation={handleLocationChange}
                  scaleFactor={activeScale}
                />
              ) : activeTab === "SYSTEM-CMD" ? (
                <GestureControl
                  primaryColor={primaryColor}
                  selectedGesture={currentGesture}
                  onSelectGesture={(g) => {
                    setCurrentGesture(g);
                    appendLog(`Hand Gesture linked parameter toggled to: ${g}`, "INFO", "NEURAL");
                  }}
                />
              ) : (
                <div className="glass-panel p-4 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-label-caps text-[9px] font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                      HUD TELEMETRY FLOOD
                    </span>
                    <span className="text-[8px] font-mono opacity-50">LOM-ST</span>
                  </div>
                  <div className="flex-grow space-y-2 overflow-y-auto max-h-34 pr-1 text-left custom-scrollbar">
                    {logs.map((log) => (
                      <div key={log.id} className="border-b border-white/5 pb-1 text-[8.5px] font-mono leading-tight">
                        <div className="flex justify-between font-bold">
                          <span
                            className={
                              log.level === "CRITICAL"
                                ? "text-red-400"
                                : log.level === "WARNING"
                                ? "text-yellow-400"
                                : "text-emerald-400"
                            }
                          >
                            [{log.subsystem}]
                          </span>
                          <span className="opacity-40">{log.timestamp}</span>
                        </div>
                        <p className="text-white/80 mt-0.5">{log.message}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    id="btn-clear-logs"
                    onClick={() => setLogs([])}
                    className="w-full text-center py-1 mt-2 border border-white/10 hover:bg-white/5 text-[8.5px] font-mono uppercase tracking-widest cursor-pointer text-slate-400 hover:text-white"
                  >
                    CLEAR LOG DATA
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Row Layout (Rows 5-6) */}
            {/* Sector tracker widgets & Biometrics (cols 1-3) */}
            <div className="md:col-span-3 md:row-span-2 z-20">
              <BiometricScanner
                primaryColor={primaryColor}
                userName={userName}
                onNameChange={(newName) => {
                  setUserName(newName);
                  appendLog(`User registry identity modified: ${newName}`, "INFO", "BIOMETRIC");
                }}
              />
            </div>

            {/* Nanotech bio-locking nanoparticle introduction controls */}
            <div className="md:col-span-3 md:row-span-2 z-20">
              <NanotechFingerprintAccess
                primaryColor={primaryColor}
                onAddLog={appendLog}
              />
            </div>

            {/* Interactive spectra color controller (cols 6-8) */}
            <div className="md:col-span-2 md:row-span-2 z-20 flex flex-col justify-between glass-panel p-3">
              <div className="text-left">
                <span className="font-label-caps text-[8.5px] block font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                  HUD Spectrum
                </span>
                <p className="text-[7.5px] opacity-40 uppercase font-mono tracking-wide">Adjust core chromatics</p>
              </div>

              {/* Spectral color selector buttons */}
              <div className="grid grid-cols-4 gap-1.5 py-1">
                {(["gold", "cyan", "orange", "violet"] as HudTheme[]).map((theme) => (
                  <button
                    id={`btn-spectrum-${theme}`}
                    key={theme}
                    onClick={() => {
                      setHudTheme(theme);
                      appendLog(`HUD chromatic spectrum shifted to profile: ${theme.toUpperCase()}`, "INFO", "CORE");
                    }}
                    style={{
                      backgroundColor: themeColors[theme],
                      borderColor: hudTheme === theme ? "white" : "transparent"
                    }}
                    className={`aspect-square border-2 hover:scale-105 active:scale-95 transition-all rounded-sm cursor-pointer relative flex items-center justify-center`}
                    title={`Activate ${theme} spectra`}
                  >
                    {hudTheme === theme && (
                      <span className="w-1.5 h-1.5 bg-black rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              <div className="text-[7.5px] font-mono opacity-50 uppercase tracking-widest text-left">
                STATE: {hudTheme === "gold" ? "SOPHISTICATED DARK" : hudTheme === "cyan" ? "COGNITIVE STABLE" : hudTheme === "orange" ? "REACTOR OVERDRIVE" : "STEALTH ENGAGED"}
              </div>
            </div>

            {/* Dynamic frequency signal voice chart (cols 9) */}
            <div className="md:col-span-4 md:row-span-3 md:col-start-9 md:row-start-4 z-20">
              <JarvisChatbot
                primaryColor={primaryColor}
                userName={userName}
                onSetChattingActive={setChattingActive}
                onQuickCommand={executeManualCommand}
              />
            </div>

            {/* Extra responsive audio signal visualizer bars inside lower grids */}
            <div className="md:col-span-8 md:row-span-1 md:row-start-5 md:col-start-1 z-20">
              <NetworkTraffic primaryColor={primaryColor} activeChatting={chattingActive} />
            </div>

          </main>
        </>
      )}
    </div>
  );
}
