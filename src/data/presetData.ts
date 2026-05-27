import { GeolocationData, LogEntry } from "../types";

export const PRESET_LOCATIONS: GeolocationData[] = [
  {
    name: "STARK TOWER (NYC)",
    latitude: "40.7527° N",
    longitude: "-73.9772° W",
    altitude: 1430,
    speed: 0.002,
  },
  {
    name: "MALIBU RESIDENCE",
    latitude: "34.0259° N",
    longitude: "-118.7798° W",
    altitude: 120,
    speed: 0.0,
  },
  {
    name: "AVENGERS COMPEX",
    latitude: "41.3541° N",
    longitude: "-74.0012° W",
    altitude: 350,
    speed: 0.15,
  },
  {
    name: "SOKOVIA RUINS",
    latitude: "48.9135° N",
    longitude: "20.3129° E",
    altitude: 2100,
    speed: 0.85,
  },
  {
    name: "WAKANDA CITADEL",
    latitude: "2.3155° S",
    longitude: "30.1259° E",
    altitude: 3200,
    speed: 1.25,
  }
];

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: "log-1",
    timestamp: "06:54:11",
    subsystem: "CORE",
    message: "Stabilizer coils calibrated to 1.21 GW standards.",
    level: "INFO"
  },
  {
    id: "log-2",
    timestamp: "06:54:15",
    subsystem: "NEURAL",
    message: "Aegis Core handshake verified with secure user frame.",
    level: "INFO"
  },
  {
    id: "log-3",
    timestamp: "06:54:20",
    subsystem: "BIOMETRIC",
    message: "Retinal scan lock engaged. Authorizing Stark protocols.",
    level: "INFO"
  },
  {
    id: "log-4",
    timestamp: "06:54:25",
    subsystem: "SHIELD",
    message: "Armory bay shield fluctuating. Readjusting thermal grid.",
    level: "WARNING"
  }
];
