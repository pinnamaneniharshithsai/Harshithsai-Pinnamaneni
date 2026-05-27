import { useEffect, useState } from "react";

interface NetworkTrafficProps {
  primaryColor: string;
  activeChatting: boolean;
}

export default function NetworkTraffic({ primaryColor, activeChatting }: NetworkTrafficProps) {
  const [bars, setBars] = useState<number[]>(Array.from({ length: 15 }, () => Math.random() * 80 + 10));

  useEffect(() => {
    // Calibrate signal refresh speeds
    const interval = setInterval(() => {
      setBars(() =>
        Array.from({ length: 15 }, () => {
          // If chatting with J.A.R.V.I.S., spike bars to capture voice command peaks
          const peakRange = activeChatting ? Math.random() * 70 + 30 : Math.random() * 55 + 10;
          return peakRange;
        })
      );
    }, 200);

    return () => clearInterval(interval);
  }, [activeChatting]);

  return (
    <div className="glass-panel p-3 relative flex flex-col justify-between h-full group">
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="font-label-caps text-[9px] font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
            Neural Signal Link / Voice Wave
          </span>
          <span className="font-mono text-[8px] animate-pulse" style={{ color: primaryColor }}>
            ONLINE (98.4%)
          </span>
        </div>
        <p className="font-mono text-[7px] opacity-45 uppercase mb-2">Cognitive bandwidth feedback channels</p>
      </div>

      {/* Dynamic graphic frequency indicator bars */}
      <div className="flex items-end justify-between gap-[3px] h-14 bg-black/30 border border-white/5 p-1 rounded">
        {bars.map((height, idx) => (
          <div
            key={idx}
            style={{
              height: `${height}%`,
              backgroundColor: activeChatting ? `${primaryColor}` : `${primaryColor}60`,
              boxShadow: activeChatting ? `0 0 8px ${primaryColor}` : "none",
            }}
            className="flex-grow rounded-t-[1px] transition-all duration-150 hover:bg-white"
          />
        ))}
      </div>

      <div className="flex justify-between text-[8px] opacity-60 font-mono mt-1">
        <span>FRQ: 142.8 MHZ</span>
        <span>PEAK RESPONSE</span>
      </div>
    </div>
  );
}
