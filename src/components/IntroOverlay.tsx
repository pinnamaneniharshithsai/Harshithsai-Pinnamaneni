import { useEffect, useRef, useState } from "react";

interface IntroOverlayProps {
  onComplete: () => void;
  primaryColor: string;
}

export default function IntroOverlay({ onComplete, primaryColor }: IntroOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [initText, setInitText] = useState("SYSTEM INITIALIZATION...");
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle layout modeling nanoparticle assembly
    class Particle {
      x: number;
      y: number;
      size: number;
      targetX: number;
      targetY: number;
      speed: number;
      color: string;
      alpha: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        // Target is closer to the center title layout
        this.targetX = width / 2 + (Math.random() - 0.5) * 500;
        this.targetY = height / 2 + (Math.random() - 0.5) * 350;
        this.speed = Math.random() * 0.05 + 0.02;
        this.color = primaryColor;
        this.alpha = Math.random() * 0.7 + 0.3;
      }

      update(assembling: boolean) {
        if (assembling) {
          this.x += (this.targetX - this.x) * this.speed;
          this.y += (this.targetY - this.y) * this.speed;
        } else {
          this.x += (Math.random() - 0.5) * 2;
          this.y += (Math.random() - 0.5) * 2;
        }
      }

      draw(context: CanvasRenderingContext2D) {
        context.save();
        context.globalAlpha = this.alpha;
        context.fillStyle = this.color;
        context.shadowBlur = 8;
        context.shadowColor = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
    }

    const particles: Particle[] = Array.from({ length: 450 }, () => new Particle());
    let assembling = false;

    // Trigger state changes matching original timings
    const initTimer = setTimeout(() => {
      setInitText("NEURAL LINKS ESTABLISHED...");
      assembling = true;
    }, 1200);

    const readyTimer = setTimeout(() => {
      setInitText("MARK XLII ACCESS GRANTED");
    }, 2800);

    const fadeTimer = setTimeout(() => {
      setFade(true);
    }, 4200);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 5200);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const animate = () => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.15)";
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update(assembling);
        p.draw(ctx);
      });

      // Draw subtle connecting lines between close particles if assembling is active
      if (assembling) {
        ctx.strokeStyle = `${primaryColor}20`; // 20 hex opacity
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i += 8) {
          for (let j = i + 8; j < particles.length; j += 40) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 80) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      clearTimeout(initTimer);
      clearTimeout(readyTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [onComplete, primaryColor]);

  const colorClasses: Record<string, { titleGlow: string }> = {
    "#C5A059": { titleGlow: "rgba(197, 160, 89, 0.6)" },
    "#00f0ff": { titleGlow: "rgba(0, 240, 255, 0.6)" },
    "#f59e0b": { titleGlow: "rgba(245, 158, 11, 0.6)" },
    "#8b5cf6": { titleGlow: "rgba(139, 92, 246, 0.6)" },
  };

  const glowStyle = colorClasses[primaryColor]?.titleGlow || "rgba(197, 160, 89, 0.6)";

  return (
    <div
      style={{
        transition: "opacity 1000ms ease-out, visibility 1000ms",
        opacity: fade ? 0 : 1,
      }}
      className="fixed inset-0 bg-[#0A0A0A] z-[9999] flex flex-col items-center justify-center overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Decorative vertical scanline tracer */}
      <div className="absolute inset-x-0 h-[3px] bg-primary/30 shadow-[0_0_12px_rgba(197,160,89,0.7)] animate-[scan-tracer_3s_linear_infinite]" />

      <div className="relative text-center z-10 flex flex-col items-center pointer-events-none">
        {/* Large Cinematic Title */}
        <h1
          style={{ textShadow: `0 0 25px ${glowStyle}` }}
          className="text-4xl md:text-6xl font-extrabold tracking-[0.45em] select-none text-white scale-95 md:scale-100 transition-all duration-1000 uppercase font-display-lg"
        >
          J.A.R.V.I.S.
        </h1>

        {/* Dynamic micro-caps terminal readout */}
        <div
          style={{ color: primaryColor }}
          className="mt-8 text-xs font-mono font-medium tracking-[0.25em] h-6 flex items-center transition-all duration-300 animate-pulse font-label-caps"
        >
          {initText}
        </div>
      </div>

      {/* Touch-safe initialization override button */}
      <button
        id="btn-skip-intro"
        onClick={() => {
          setFade(true);
          setTimeout(onComplete, 800);
        }}
        style={{ borderColor: `${primaryColor}40`, color: primaryColor }}
        className="absolute bottom-8 z-20 px-4 py-1.5 border hover:bg-white/5 text-[10px] font-mono tracking-widest uppercase transition-all duration-150 cursor-pointer"
      >
        BYPASS INTRO
      </button>
    </div>
  );
}
