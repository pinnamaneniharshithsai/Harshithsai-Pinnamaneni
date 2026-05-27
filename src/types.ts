export type HudTheme = "gold" | "cyan" | "orange" | "violet";

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface SystemStatus {
  reactorPower: number; // in GW (e.g., 1.21)
  coreTemp: number; // in Celsius (e.g., 45)
  shieldStability: number; // in %
  cyberlinkStable: boolean;
  activeSector: string;
  armorStandby: boolean;
}

export interface GeolocationData {
  name: string;
  latitude: string;
  longitude: string;
  altitude: number;
  speed: number; // Mach
}

export type GestureType = "PALM" | "SWIPE" | "PINCH" | "FIST";

export interface LogEntry {
  id: string;
  timestamp: string;
  subsystem: "CORE" | "NEURAL" | "SHIELD" | "BIOMETRIC" | "TECTONIC";
  message: string;
  level: "INFO" | "WARNING" | "CRITICAL";
}
