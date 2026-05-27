import { GestureType } from "../types";
import { Hand, Eye, ZoomIn, Lock } from "lucide-react";

interface GestureControlProps {
  primaryColor: string;
  selectedGesture: GestureType;
  onSelectGesture: (gesture: GestureType) => void;
}

export default function GestureControl({ primaryColor, selectedGesture, onSelectGesture }: GestureControlProps) {
  const gesturesList: { type: GestureType; actionLabel: string; info: string; icon: any }[] = [
    {
      type: "PINCH",
      actionLabel: "MAP ZOOM [ZOOM-IN]",
      info: "Amplifies telemetry coordinate grid by factor of 4x",
      icon: ZoomIn
    },
    {
      type: "SWIPE",
      actionLabel: "ROTATE SPHERE [ROT-Z]",
      info: "Spins active holographic coordinates to adjacent sectors",
      icon: Eye
    },
    {
      type: "PALM",
      actionLabel: "FREEZE RENDERS [HALT-ST]",
      info: "Prevents immediate telemetry fluctuation on main feeds",
      icon: Hand
    },
    {
      type: "FIST",
      actionLabel: "LOCK RECTOR [LOCK-SAFE]",
      info: "Locks current energy grid into secondary safe load limits",
      icon: Lock
    }
  ];

  return (
    <div className="glass-panel p-4 h-full flex flex-col justify-between gesture-pulse relative">
      {/* Dynamic scan tracker header */}
      <div className="flex justify-between items-center mb-1">
        <span className="font-label-caps text-[9px] font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
          HAND GESTURE PROTOCOL
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }}></span>
          <span className="font-mono text-[8px]" style={{ color: primaryColor }}>
            ACTIVE (LINKED)
          </span>
        </div>
      </div>

      {/* Futuristic hand gesture visualizer */}
      <div className="flex items-center justify-center py-2 text-white relative">
        <div className="p-3 border border-dashed border-white/5 rounded-full relative bg-white/5">
          <Hand
            className="w-12 h-12 transition-transform duration-300"
            style={{
              color: primaryColor,
              transform:
                selectedGesture === "PINCH"
                  ? "scale(0.85) rotate(-15deg)"
                  : selectedGesture === "SWIPE"
                  ? "translateX(10px) rotate(10deg)"
                  : selectedGesture === "FIST"
                  ? "scale(1.05) rotate(0deg)"
                  : "scale(1)",
            }}
          />
        </div>
        <div className="absolute inset-0 border border-white/5 rounded-md pointer-events-none" />
      </div>

      {/* Interactive gesture controls */}
      <div className="space-y-1.5">
        <span className="font-mono text-[8px] opacity-40 block uppercase tracking-wider">CHOOSE GESTURE ACTION</span>
        <div className="grid grid-cols-2 gap-1.5">
          {gesturesList.map((g) => {
            const Icon = g.icon;
            const isSelected = selectedGesture === g.type;
            return (
              <button
                id={`btn-gesture-${g.type.toLowerCase()}`}
                key={g.type}
                onClick={() => onSelectGesture(g.type)}
                style={{
                  borderColor: isSelected ? primaryColor : "rgba(255,255,255,0.08)",
                  backgroundColor: isSelected ? `${primaryColor}15` : "rgba(18, 19, 24, 0.4)",
                  color: isSelected ? primaryColor : "rgba(185, 202, 203, 0.65)"
                }}
                className="flex items-center gap-1.5 px-2 py-1.5 border hover:bg-white/5 hover:text-white transition-all text-left text-[9px] font-mono leading-tight rounded cursor-pointer"
              >
                <Icon size={12} className="flex-shrink-0" />
                <span className="font-bold tracking-widest">{g.type}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected gesture descriptive explanation */}
      <div className="mt-2.5 pt-2 border-t border-white/5 font-mono text-[9px] space-y-0.5">
        <div className="flex justify-between text-white font-bold uppercase">
          <span>TARGET ACTION:</span>
          <span style={{ color: primaryColor }}>{selectedGesture}</span>
        </div>
        <p className="opacity-60 text-[8px] italic leading-tight">
          {gesturesList.find((g) => g.type === selectedGesture)?.info}
        </p>
      </div>
    </div>
  );
}
