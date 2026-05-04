"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  opacity: number;
  targetOpacity: number;
  color: string;
  life: number;
  maxLife: number;
}

const GOLD_COLORS = [
  "rgba(201,160,72,",   // gold
  "rgba(240,234,224,",  // pearl
  "rgba(142,110,40,",   // gold-dim
];

function spawn(vw: number, vh: number, mobile = false): Particle {
  const color = GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)];
  const maxLife = 180 + Math.random() * 220;
  return {
    x: Math.random() * vw,
    y: Math.random() * vh,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
    size: mobile
      ? 50 + Math.random() * 80
      : 120 + Math.random() * 200,
    opacity: 0,
    targetOpacity: 0.028 + Math.random() * 0.038,
    color,
    life: 0,
    maxLife,
  };
}

export default function AmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const N = isMobile ? 6 : 18;

    let vw = window.innerWidth;
    let vh = window.innerHeight;
    canvas.width  = vw;
    canvas.height = vh;

    const particles: Particle[] = Array.from({ length: N }, () =>
      spawn(vw, vh, isMobile)
    );

    let rafId: number;

    const draw = () => {
      ctx.clearRect(0, 0, vw, vh);

      for (const p of particles) {
        p.life++;
        const fadeIn  = Math.min(1, p.life / 60);
        const fadeOut = p.life > p.maxLife - 60
          ? Math.max(0, (p.maxLife - p.life) / 60)
          : 1;
        p.opacity = p.targetOpacity * fadeIn * fadeOut;

        p.x += p.vx;
        p.y += p.vy;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        grad.addColorStop(0,   `${p.color}${p.opacity.toFixed(3)})`);
        grad.addColorStop(0.5, `${p.color}${(p.opacity * 0.4).toFixed(3)})`);
        grad.addColorStop(1,   `${p.color}0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        if (p.life >= p.maxLife) Object.assign(p, spawn(vw, vh, isMobile));
      }

      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);

    const onResize = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      canvas.width  = vw;
      canvas.height = vh;
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
