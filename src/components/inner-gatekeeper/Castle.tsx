"use client";

import React, { useMemo } from "react";
import { ChamberType } from "./GameState";

interface CastleProps {
  health: number;
  weather: string;
  gatekeeperMood?: string;
  isEmotionActive: boolean;
  emotionColor?: string;
  chamber?: ChamberType;
  resolvedGlow?: boolean;
}

export function Castle({
  health,
  weather,
  isEmotionActive,
  emotionColor,
  chamber = 'gate',
  resolvedGlow = false
}: CastleProps) {

  // ─── Atmospheric palette based on weather + mood ───
  const atmo = useMemo(() => {
    if (weather === 'stormy') {
      return {
        sky0: '#04020a', sky1: '#090518', sky2: '#120a26', horizon: '#1a0d36',
        fog: '#140a2a', cloud: '#170c30',
        windowGlow: '#c084fc', windowCore: '#f3e8ff', torchGlow: '#f43f5e',
        ambientLight: '#818cf8',
        ground0: '#0c061a', ground1: '#05020c',
        water0: '#0f0822', water1: '#070310'
      };
    }
    if (weather === 'rainy') {
      return {
        sky0: '#040816', sky1: '#0a1228', sky2: '#101c3e', horizon: '#182854',
        fog: '#0e1a38', cloud: '#142246',
        windowGlow: '#67e8f9', windowCore: '#cffafe', torchGlow: '#fb923c',
        ambientLight: '#38bdf8',
        ground0: '#0b1424', ground1: '#050a14',
        water0: '#0e1a30', water1: '#070d1c'
      };
    }
    if (weather === 'cloudy') {
      return {
        sky0: '#0c071d', sky1: '#170e34', sky2: '#24164a', horizon: '#351f62',
        fog: '#221440', cloud: '#28174a',
        windowGlow: '#fcd34d', windowCore: '#fef9c3', torchGlow: '#f97316',
        ambientLight: '#c084fc',
        ground0: '#130c26', ground1: '#080512',
        water0: '#160e2c', water1: '#0a0618'
      };
    }
    // Twilight sanctuary default (warm twilight purple fantasy)
    return {
      sky0: '#09041a', sky1: '#140832', sky2: '#230c4c', horizon: '#3f1568',
      fog: '#280d4e', cloud: '#34105e',
      windowGlow: '#fbbf24', windowCore: '#fffbeb', torchGlow: '#ffedd5',
      ambientLight: '#f59e0b',
      ground0: '#140a28', ground1: '#080312',
      water0: '#1a0d34', water1: '#090416'
    };
  }, [weather]);

  // Castle integrity colors based on health (Purple/Lavender Palette)
  const integrity = Math.max(0.35, health / 100);
  const wallBase = `rgb(${Math.round(112 * integrity + 26)}, ${Math.round(96 * integrity + 22)}, ${Math.round(148 * integrity + 32)})`;
  const wallDark = `rgb(${Math.round(68 * integrity + 16)}, ${Math.round(52 * integrity + 12)}, ${Math.round(92 * integrity + 18)})`;
  const wallLight = `rgb(${Math.round(156 * integrity + 36)}, ${Math.round(138 * integrity + 32)}, ${Math.round(200 * integrity + 46)})`;
  const roofColor = health >= 60 ? '#634b9f' : health >= 35 ? '#4b357d' : '#332258';
  const roofDark = health >= 60 ? '#433170' : health >= 35 ? '#322055' : '#20133a';
  const roofLight = health >= 60 ? '#866ec7' : health >= 35 ? '#6850a3' : '#493775';

  // Deterministic stars for calm ambient sky
  const stars = useMemo(() => Array.from({ length: 95 }, (_, i) => ({
    cx: 12 + ((i * 37) % 976),
    cy: 6 + ((i * 23) % 245),
    r: ((i % 5) * 0.25) + 0.45,
    op: 0.3 + ((i % 7) * 0.1),
    dur: 2.2 + (i % 4) * 0.8,
  })), []);

  // Calm fireflies / magic motes
  const motes = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    cx: 120 + ((i * 41) % 760),
    cy: 290 + ((i * 29) % 190),
    dur: 3.5 + (i % 4) * 0.9,
    delay: (i % 5) * 0.8,
    rx: 12 + (i % 3) * 8,
    ry: 8 + (i % 4) * 4,
  })), []);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#07040d]">
      <svg
        viewBox="0 0 1000 580"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Sky Gradient */}
          <linearGradient id="cg-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={atmo.sky0} />
            <stop offset="30%" stopColor={atmo.sky1} />
            <stop offset="65%" stopColor={atmo.sky2} />
            <stop offset="100%" stopColor={atmo.horizon} />
          </linearGradient>

          {/* Mountains */}
          <linearGradient id="cg-mtn-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2c144a" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#150828" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="cg-mtn-near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#220e3c" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0d051c" stopOpacity="0.9" />
          </linearGradient>

          {/* Ground & Bridge */}
          <linearGradient id="cg-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={atmo.ground0} />
            <stop offset="100%" stopColor={atmo.ground1} />
          </linearGradient>
          <linearGradient id="cg-bridge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={wallLight} stopOpacity="0.9" />
            <stop offset="25%" stopColor={wallBase} />
            <stop offset="100%" stopColor={wallDark} />
          </linearGradient>

          {/* Moat Water */}
          <linearGradient id="cg-moat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={atmo.water0} />
            <stop offset="100%" stopColor={atmo.water1} />
          </linearGradient>

          {/* Stone Wall Shading */}
          <linearGradient id="cg-wall-main" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={wallLight} />
            <stop offset="20%" stopColor={wallBase} />
            <stop offset="80%" stopColor={wallDark} />
            <stop offset="100%" stopColor="#160e24" />
          </linearGradient>
          <linearGradient id="cg-wall-cyl" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={wallLight} />
            <stop offset="18%" stopColor={wallBase} />
            <stop offset="68%" stopColor={wallDark} />
            <stop offset="100%" stopColor="#120a20" />
          </linearGradient>

          {/* Roof Cones */}
          <linearGradient id="cg-roof-cone" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={roofLight} />
            <stop offset="28%" stopColor={roofColor} />
            <stop offset="78%" stopColor={roofDark} />
            <stop offset="100%" stopColor="#1b0f32" />
          </linearGradient>

          {/* Stone Brick Pattern */}
          <pattern id="stone-pattern" width="28" height="16" patternUnits="userSpaceOnUse">
            <rect width="28" height="16" fill="transparent" />
            <rect x="1" y="1" width="12" height="6" rx="0.8" fill="rgba(255,255,255,0.04)" stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" />
            <rect x="15" y="1" width="12" height="6" rx="0.8" fill="rgba(255,255,255,0.02)" stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" />
            <rect x="8" y="9" width="12" height="6" rx="0.8" fill="rgba(255,255,255,0.035)" stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" />
          </pattern>

          {/* Cobblestone Path Pattern */}
          <pattern id="cobble-pattern" width="24" height="16" patternUnits="userSpaceOnUse">
            <rect width="24" height="16" fill="transparent" />
            <ellipse cx="6" cy="4" rx="5" ry="3" fill="rgba(255,255,255,0.045)" stroke="rgba(0,0,0,0.18)" strokeWidth="0.5" />
            <ellipse cx="18" cy="4" rx="5" ry="3" fill="rgba(255,255,255,0.025)" stroke="rgba(0,0,0,0.18)" strokeWidth="0.5" />
            <ellipse cx="12" cy="12" rx="6" ry="3.5" fill="rgba(255,255,255,0.035)" stroke="rgba(0,0,0,0.18)" strokeWidth="0.5" />
          </pattern>

          {/* Soft Optical Bloom & Fog Filters */}
          <filter id="soft-glow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="wide-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="20" />
          </filter>
          <filter id="fog-blur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="12" />
          </filter>

          <clipPath id="sky-clip">
            <rect x="0" y="0" width="1000" height="420" />
          </clipPath>
        </defs>

        {/* ═══════════════════════════════════════════════
            1. SKY & CELESTIAL AMBIENCE
        ═══════════════════════════════════════════════ */}
        <rect x="0" y="0" width="1000" height="580" fill="url(#cg-sky)" />

        {/* Subtle Upper Sky Aurora / Nebula Wash */}
        <ellipse cx="500" cy="120" rx="440" ry="85" fill={atmo.ambientLight} opacity="0.05" filter="url(#wide-glow)" />

        {/* Twinkling Night Stars */}
        <g clipPath="url(#sky-clip)" opacity={weather === 'stormy' ? 0.1 : weather === 'rainy' ? 0.25 : 0.85}>
          {stars.map((s, i) => (
            <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#fff" opacity={s.op}>
              <animate attributeName="opacity" values={`${s.op};${s.op * 0.3};${s.op}`} dur={`${s.dur}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>

        {/* Luminous Crescent / Moon Aura */}
        {(weather === 'sunny' || weather === 'cloudy') && (
          <g clipPath="url(#sky-clip)">
            <circle cx="825" cy="85" r="48" fill={atmo.windowGlow} opacity="0.07" filter="url(#wide-glow)" />
            <circle cx="825" cy="85" r="30" fill="#eedcff" opacity="0.16" filter="url(#soft-glow)" />
            <circle cx="825" cy="85" r="22" fill="#fcf8ff" opacity="0.95" />
            <circle cx="818" cy="80" r="17" fill={atmo.sky1} opacity="0.3" />
          </g>
        )}

        {/* Slow Calming Clouds */}
        {(weather === 'cloudy' || weather === 'rainy' || weather === 'stormy') && (
          <g clipPath="url(#sky-clip)" opacity={weather === 'stormy' ? 0.75 : 0.45}>
            <ellipse cx="220" cy="95" rx="140" ry="36" fill={atmo.cloud} filter="url(#fog-blur)">
              <animateTransform attributeName="transform" type="translate" values="0 0; 25 0; 0 0" dur="20s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="680" cy="75" rx="170" ry="42" fill={atmo.cloud} filter="url(#fog-blur)">
              <animateTransform attributeName="transform" type="translate" values="0 0; -30 0; 0 0" dur="24s" repeatCount="indefinite" />
            </ellipse>
          </g>
        )}

        {/* ═══════════════════════════════════════════════
            2. DISTANT MOUNTAIN SILHOUETTES (Depth Layer)
        ═══════════════════════════════════════════════ */}
        {/* Distant Mountain Ridge */}
        <path
          d="M-20,360 L40,295 L110,325 L190,265 L270,310 L350,245 L440,290 L520,235 L610,280 L690,240 L780,285 L860,255 L940,300 L1020,270 L1020,420 L-20,420Z"
          fill="url(#cg-mtn-far)"
          filter="url(#fog-blur)"
        />

        {/* Near Mountain Ridge */}
        <path
          d="M-20,380 L60,315 L150,350 L240,285 L330,330 L410,275 L500,320 L590,270 L680,315 L770,280 L860,320 L950,290 L1020,335 L1020,460 L-20,460Z"
          fill="url(#cg-mtn-near)"
        />
        {/* Ridge subtle moonlight highlights */}
        <path
          d="M240,285 L330,330 M410,275 L500,320 M590,270 L680,315 M770,280 L860,320"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1.2"
          fill="none"
        />

        {/* ═══════════════════════════════════════════════
            3. MOAT & CALM WATER REFLECTIONS
        ═══════════════════════════════════════════════ */}
        <rect x="0" y="420" width="1000" height="160" fill="url(#cg-ground)" />
        <path d="M0,425 Q500,410 1000,425 L1000,490 Q500,465 0,490Z" fill="url(#cg-moat)" opacity="0.85" />
        <ellipse cx="500" cy="445" rx="360" ry="12" fill={atmo.ambientLight} opacity="0.04" filter="url(#soft-glow)" />
        <ellipse cx="500" cy="460" rx="280" ry="8" fill={atmo.windowGlow} opacity="0.06" filter="url(#soft-glow)" />

        {/* ═══════════════════════════════════════════════
            4. PINE FORESTS (Flanking the Sanctuary)
        ═══════════════════════════════════════════════ */}
        {/* Left Pine Forest */}
        {[
          { x: -10, h: 160, w: 54 }, { x: 35, h: 185, w: 62 }, { x: 85, h: 150, w: 50 },
          { x: 130, h: 175, w: 58 }, { x: 175, h: 140, w: 46 }, { x: 215, h: 160, w: 52 },
          { x: 255, h: 125, w: 42 }
        ].map((t, i) => (
          <g key={`lpine-${i}`}>
            <polygon points={`${t.x + t.w / 2},${415 - t.h} ${t.x},${415 - t.h * 0.5} ${t.x + t.w},${415 - t.h * 0.5}`} fill="#0b0816" />
            <polygon points={`${t.x + t.w / 2},${415 - t.h * 0.72} ${t.x - 5},${415 - t.h * 0.28} ${t.x + t.w + 5},${415 - t.h * 0.28}`} fill="#0f0c1e" />
            <polygon points={`${t.x + t.w / 2},${415 - t.h * 0.42} ${t.x - 8},${415} ${t.x + t.w + 8},${415}`} fill="#140f28" />
            <rect x={t.x + t.w / 2 - 3} y={415} width="6" height={15} fill="#07050d" />
          </g>
        ))}

        {/* Right Pine Forest */}
        {[
          { x: 990, h: 160, w: 54 }, { x: 940, h: 185, w: 62 }, { x: 890, h: 150, w: 50 },
          { x: 840, h: 175, w: 58 }, { x: 795, h: 140, w: 46 }, { x: 755, h: 160, w: 52 },
          { x: 715, h: 125, w: 42 }
        ].map((t, i) => (
          <g key={`rpine-${i}`}>
            <polygon points={`${t.x - t.w / 2},${415 - t.h} ${t.x - t.w},${415 - t.h * 0.5} ${t.x},${415 - t.h * 0.5}`} fill="#0b0816" />
            <polygon points={`${t.x - t.w / 2},${415 - t.h * 0.72} ${t.x - t.w - 5},${415 - t.h * 0.28} ${t.x + 5},${415 - t.h * 0.28}`} fill="#0f0c1e" />
            <polygon points={`${t.x - t.w / 2},${415 - t.h * 0.42} ${t.x - t.w - 8},${415} ${t.x + 8},${415}`} fill="#140f28" />
            <rect x={t.x - t.w / 2 - 3} y={415} width="6" height={15} fill="#07050d" />
          </g>
        ))}

        {/* Ambient Sanctuary Glow Behind Castle */}
        <ellipse cx="500" cy="320" rx="270" ry="145" fill={atmo.ambientLight} opacity={0.06 * integrity} filter="url(#wide-glow)" />

        {/* ═══════════════════════════════════════════════
            5. CASTLE STRUCTURE — PURPLE / LAVENDER THEME
        ═══════════════════════════════════════════════ */}

        {/* ── Outer Rampart Walls ── */}
        <rect x="260" y="330" width="480" height="90" fill="url(#cg-wall-main)" />
        <rect x="260" y="330" width="480" height="90" fill="url(#stone-pattern)" opacity="0.6" />
        {Array.from({ length: 24 }, (_, i) => (
          <rect key={`rb-${i}`} x={262 + i * 20} y="318" width="13" height="14" rx="1.5" fill={wallDark} stroke="#000" strokeWidth="0.5" />
        ))}

        {/* ── Outer Left Watchturret ── */}
        <rect x="245" y="270" width="34" height="140" rx="2" fill="url(#cg-wall-cyl)" />
        <rect x="245" y="270" width="34" height="140" fill="url(#stone-pattern)" opacity="0.6" />
        <polygon points="240,270 262,215 284,270" fill="url(#cg-roof-cone)" />
        <circle cx="262" cy="214" r="2.5" fill="#f59e0b" />
        {/* Turret Window + Warm Light Bloom */}
        <rect x="256" y="295" width="12" height="18" rx="6" fill={atmo.windowGlow} opacity="0.8" />
        <rect x="256" y="295" width="12" height="18" rx="6" fill={atmo.windowCore} opacity="0.95" />
        <rect x="256" y="295" width="12" height="18" rx="6" fill={atmo.windowGlow} opacity="0.45" filter="url(#soft-glow)" />

        {/* ── Outer Right Watchturret ── */}
        <rect x="721" y="270" width="34" height="140" rx="2" fill="url(#cg-wall-cyl)" />
        <rect x="721" y="270" width="34" height="140" fill="url(#stone-pattern)" opacity="0.6" />
        <polygon points="716,270 738,215 760,270" fill="url(#cg-roof-cone)" />
        <circle cx="738" cy="214" r="2.5" fill="#f59e0b" />
        <rect x="732" y="295" width="12" height="18" rx="6" fill={atmo.windowGlow} opacity="0.8" />
        <rect x="732" y="295" width="12" height="18" rx="6" fill={atmo.windowCore} opacity="0.95" />
        <rect x="732" y="295" width="12" height="18" rx="6" fill={atmo.windowGlow} opacity="0.45" filter="url(#soft-glow)" />

        {/* ── Grand Keep Mid-Tier Body ── */}
        <rect x="330" y="240" width="340" height="160" fill="url(#cg-wall-main)" />
        <rect x="330" y="240" width="340" height="160" fill="url(#stone-pattern)" opacity="0.55" />
        <rect x="325" y="236" width="350" height="8" rx="1" fill={wallLight} />
        {Array.from({ length: 18 }, (_, i) => (
          <rect key={`kb-${i}`} x={332 + i * 19} y="222" width="12" height="15" rx="1.5" fill={wallDark} />
        ))}

        {/* ── Left Grand Tower ── */}
        <rect x="310" y="150" width="85" height="230" rx="3" fill="url(#cg-wall-cyl)" />
        <rect x="310" y="150" width="85" height="230" fill="url(#stone-pattern)" opacity="0.6" />
        <rect x="304" y="146" width="97" height="8" rx="1" fill={wallLight} />
        {[0, 1, 2, 3, 4].map(i => (
          <rect key={`ltb-${i}`} x={306 + i * 19} y="134" width="12" height="14" rx="1.5" fill={wallDark} />
        ))}
        {/* Left Spire Roof */}
        <polygon points="302,134 352,50 402,134" fill="url(#cg-roof-cone)" />
        <polygon points="352,50 352,90 375,134 352,50" fill="rgba(255,255,255,0.06)" />
        {/* Spire Flag (Golden / Lavender Silk) */}
        <line x1="352" y1="50" x2="352" y2="24" stroke={wallLight} strokeWidth="2" />
        <circle cx="352" cy="24" r="3" fill="#f59e0b" />
        <path d="M352,26 L388,36 L352,46Z" fill="#f59e0b" opacity="0.95">
          <animateTransform attributeName="transform" type="rotate" values="0 352 36; 3 352 36; 0 352 36; -2.5 352 36; 0 352 36" dur="4s" repeatCount="indefinite" />
        </path>

        {/* Left Tower Windows with Luminous Amber Bloom */}
        <rect x="338" y="180" width="14" height="26" rx="7" fill={atmo.windowGlow} opacity="0.85" />
        <rect x="338" y="180" width="14" height="26" rx="7" fill={atmo.windowCore} opacity="0.95" />
        <rect x="338" y="180" width="14" height="26" rx="7" fill={atmo.windowGlow} opacity="0.5" filter="url(#soft-glow)" />

        <rect x="360" y="180" width="14" height="26" rx="7" fill={atmo.windowGlow} opacity="0.85" />
        <rect x="360" y="180" width="14" height="26" rx="7" fill={atmo.windowCore} opacity="0.95" />
        <rect x="360" y="180" width="14" height="26" rx="7" fill={atmo.windowGlow} opacity="0.5" filter="url(#soft-glow)" />

        <rect x="345" y="240" width="18" height="32" rx="9" fill={atmo.windowGlow} opacity="0.8" />
        <rect x="345" y="240" width="18" height="32" rx="9" fill={atmo.windowCore} opacity="0.9" />
        <rect x="345" y="240" width="18" height="32" rx="9" fill={atmo.windowGlow} opacity="0.45" filter="url(#soft-glow)" />

        {/* ── Right Grand Tower ── */}
        <rect x="605" y="150" width="85" height="230" rx="3" fill="url(#cg-wall-cyl)" />
        <rect x="605" y="150" width="85" height="230" fill="url(#stone-pattern)" opacity="0.6" />
        <rect x="599" y="146" width="97" height="8" rx="1" fill={wallLight} />
        {[0, 1, 2, 3, 4].map(i => (
          <rect key={`rtb-${i}`} x={601 + i * 19} y="134" width="12" height="14" rx="1.5" fill={wallDark} />
        ))}
        {/* Right Spire Roof */}
        <polygon points="597,134 647,50 697,134" fill="url(#cg-roof-cone)" />
        <polygon points="647,50 647,90 670,134 647,50" fill="rgba(255,255,255,0.06)" />
        <line x1="647" y1="50" x2="647" y2="24" stroke={wallLight} strokeWidth="2" />
        <circle cx="647" cy="24" r="3" fill="#f59e0b" />
        <path d="M647,26 L683,36 L647,46Z" fill="#f59e0b" opacity="0.95">
          <animateTransform attributeName="transform" type="rotate" values="0 647 36; -3 647 36; 0 647 36; 2.5 647 36; 0 647 36" dur="4.5s" repeatCount="indefinite" />
        </path>

        {/* Right Tower Windows */}
        <rect x="628" y="180" width="14" height="26" rx="7" fill={atmo.windowGlow} opacity="0.85" />
        <rect x="628" y="180" width="14" height="26" rx="7" fill={atmo.windowCore} opacity="0.95" />
        <rect x="628" y="180" width="14" height="26" rx="7" fill={atmo.windowGlow} opacity="0.5" filter="url(#soft-glow)" />

        <rect x="650" y="180" width="14" height="26" rx="7" fill={atmo.windowGlow} opacity="0.85" />
        <rect x="650" y="180" width="14" height="26" rx="7" fill={atmo.windowCore} opacity="0.95" />
        <rect x="650" y="180" width="14" height="26" rx="7" fill={atmo.windowGlow} opacity="0.5" filter="url(#soft-glow)" />

        <rect x="638" y="240" width="18" height="32" rx="9" fill={atmo.windowGlow} opacity="0.8" />
        <rect x="638" y="240" width="18" height="32" rx="9" fill={atmo.windowCore} opacity="0.9" />
        <rect x="638" y="240" width="18" height="32" rx="9" fill={atmo.windowGlow} opacity="0.45" filter="url(#soft-glow)" />

        {/* ── HIGH CENTRAL MONARCH TOWER (Hero Spires) ── */}
        <rect x="435" y="90" width="130" height="280" rx="3" fill="url(#cg-wall-cyl)" />
        <rect x="435" y="90" width="130" height="280" fill="url(#stone-pattern)" opacity="0.5" />
        <rect x="428" y="86" width="144" height="9" rx="1.5" fill={wallLight} />
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={`ctb-${i}`} x={432 + i * 20} y="72" width="13" height="16" rx="1.5" fill={wallDark} />
        ))}
        {/* Monarch High Spire Roof */}
        <polygon points="424,72 500,-15 576,72" fill="url(#cg-roof-cone)" />
        <polygon points="500,-15 500,30 535,72 500,-15" fill="rgba(255,255,255,0.08)" />
        {/* Golden Finial & Crown Crest Flag */}
        <line x1="500" y1="-15" x2="500" y2="-45" stroke="#f59e0b" strokeWidth="2.5" />
        <circle cx="500" cy="-45" r="4" fill="#fbbf24" filter="url(#soft-glow)" />
        <path d="M500,-43 L548,-30 L500,-17Z" fill="#a855f7" opacity="0.95">
          <animateTransform attributeName="transform" type="rotate" values="0 500 -30; 4 500 -30; 0 500 -30; -3.5 500 -30; 0 500 -30" dur="5s" repeatCount="indefinite" />
        </path>

        {/* Monarch Sacred Rose Window (Luminous Geometric Focus) */}
        <circle cx="500" cy="140" r="24" fill="none" stroke={wallLight} strokeWidth="3" />
        <circle cx="500" cy="140" r="21" fill={atmo.windowGlow} opacity="0.75" />
        <circle cx="500" cy="140" r="14" fill={atmo.windowCore} opacity="0.95" />
        <circle cx="500" cy="140" r="24" fill={atmo.windowGlow} opacity="0.5" filter="url(#soft-glow)">
          <animate attributeName="opacity" values="0.45;0.65;0.45" dur="3s" repeatCount="indefinite" />
        </circle>
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          return (
            <line
              key={`rose-${i}`}
              x1={500}
              y1={140}
              x2={500 + Math.cos(angle) * 20}
              y2={140 + Math.sin(angle) * 20}
              stroke={wallDark}
              strokeWidth="1.5"
            />
          );
        })}

        {/* Monarch Lower Arched Windows */}
        <rect x="475" y="185" width="22" height="42" rx="11" fill={atmo.windowGlow} opacity="0.85" />
        <rect x="475" y="185" width="22" height="42" rx="11" fill={atmo.windowCore} opacity="0.95" />
        <rect x="475" y="185" width="22" height="42" rx="11" fill={atmo.windowGlow} opacity="0.5" filter="url(#soft-glow)" />

        <rect x="503" y="185" width="22" height="42" rx="11" fill={atmo.windowGlow} opacity="0.85" />
        <rect x="503" y="185" width="22" height="42" rx="11" fill={atmo.windowCore} opacity="0.95" />
        <rect x="503" y="185" width="22" height="42" rx="11" fill={atmo.windowGlow} opacity="0.5" filter="url(#soft-glow)" />

        {/* ── GRAND PORTAL GATEHOUSE & DRAWBRIDGE ── */}
        <rect x="430" y="300" width="140" height="95" rx="3" fill="url(#cg-wall-main)" />
        <rect x="430" y="300" width="140" height="95" fill="url(#stone-pattern)" opacity="0.6" />
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={`gb-${i}`} x={434 + i * 20} y="288" width="13" height="14" rx="1.5" fill={wallDark} />
        ))}

        {/* Arched Stone Portal Opening */}
        <path d="M455,395 L455,335 A45,45 0 0,1 545,335 L545,395Z" fill="#05020a" />
        <path d="M455,335 A45,45 0 0,1 545,335" fill="none" stroke={wallLight} strokeWidth="4" />
        <polygon points="494,290 506,290 504,302 496,302" fill="#fbbf24" opacity="0.85" />

        {/* Golden Gateway Sanctuary Glow from Inside */}
        <path d="M458,395 L458,338 A42,42 0 0,1 542,338 L542,395Z" fill={atmo.windowGlow} opacity="0.25" filter="url(#soft-glow)">
          <animate attributeName="opacity" values="0.2;0.35;0.2" dur="3s" repeatCount="indefinite" />
        </path>

        {/* Iron Portcullis Grate */}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <line
            key={`pc-${i}`}
            x1={468 + i * 13}
            y1={395}
            x2={468 + i * 13}
            y2={340}
            stroke="#181126"
            strokeWidth="2.5"
          />
        ))}
        <line x1="458" y1="360" x2="542" y2="360" stroke="#181126" strokeWidth="2" />
        <line x1="458" y1="378" x2="542" y2="378" stroke="#181126" strokeWidth="2" />

        {/* Portal Sconce Lanterns */}
        <rect x="444" y="348" width="4" height="12" fill="#78350f" />
        <circle cx="446" cy="344" r="5" fill={atmo.torchGlow} filter="url(#soft-glow)">
          <animate attributeName="r" values="4.5;6;4.5" dur="1.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="446" cy="344" r="2.5" fill="#fff7ed" />

        <rect x="552" y="348" width="4" height="12" fill="#78350f" />
        <circle cx="554" cy="344" r="5" fill={atmo.torchGlow} filter="url(#soft-glow)">
          <animate attributeName="r" values="5.5;4.5;5.5" dur="1.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="554" cy="344" r="2.5" fill="#fff7ed" />

        {/* ═══════════════════════════════════════════════
            6. COBBLESTONE CAUSEWAY / BRIDGE
        ═══════════════════════════════════════════════ */}
        <path d="M400,580 L445,400 L555,400 L600,580Z" fill="url(#cg-bridge)" />
        <path d="M400,580 L445,400 L555,400 L600,580Z" fill="url(#cobble-pattern)" opacity="0.45" />
        <polygon points="390,580 437,400 447,400 405,580" fill={wallDark} stroke={wallLight} strokeWidth="1" />
        <polygon points="610,580 563,400 553,400 595,580" fill={wallDark} stroke={wallLight} strokeWidth="1" />

        {/* Bridge Entrance Lantern Posts */}
        <circle cx="410" cy="540" r="3.5" fill={atmo.torchGlow} filter="url(#soft-glow)" />
        <circle cx="590" cy="540" r="3.5" fill={atmo.torchGlow} filter="url(#soft-glow)" />

        {/* ═══════════════════════════════════════════════
            7. CHAMBER LIGHTING & RESOLUTION FEEDBACK
        ═══════════════════════════════════════════════ */}

        {/* Gate Focus */}
        {chamber === 'gate' && (
          <g>
            <circle cx="500" cy="375" r="45" fill={atmo.torchGlow} opacity="0.25" filter="url(#soft-glow)">
              <animate attributeName="r" values="40;55;40" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {/* Watchtower Focus */}
        {chamber === 'watchtower' && (
          <g>
            <circle cx="500" cy="140" r="40" fill="#fef08a" opacity="0.35" filter="url(#wide-glow)">
              <animate attributeName="opacity" values="0.25;0.45;0.25" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="500" cy="140" r="16" fill="#fff" opacity="0.8" filter="url(#soft-glow)" />
          </g>
        )}

        {/* Inner Hall Focus */}
        {chamber === 'inner-hall' && (
          <g>
            <rect x="340" y="240" width="320" height="150" fill="#fde047" opacity="0.08" filter="url(#wide-glow)">
              <animate attributeName="opacity" values="0.06;0.14;0.06" dur="3s" repeatCount="indefinite" />
            </rect>
          </g>
        )}

        {/* Inner Chamber Harmony */}
        {chamber === 'inner-chamber' && (
          <g>
            <ellipse cx="500" cy="260" rx="360" ry="200" fill="#c084fc" opacity="0.12" filter="url(#wide-glow)">
              <animate attributeName="opacity" values="0.08;0.18;0.08" dur="4s" repeatCount="indefinite" />
            </ellipse>
          </g>
        )}

        {/* Resolved Clarity Glow */}
        {resolvedGlow && (
          <g>
            <ellipse cx="500" cy="300" rx="420" ry="240" fill="#38bdf8" opacity="0.15" filter="url(#wide-glow)">
              <animate attributeName="opacity" values="0.2;0.05;0.2" dur="3.5s" repeatCount="indefinite" />
            </ellipse>
            <circle cx="500" cy="360" r="80" fill="#fef08a" opacity="0.25" filter="url(#soft-glow)">
              <animate attributeName="r" values="70;110;70" dur="2.5s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {/* Emotion Active Aura */}
        {emotionColor && isEmotionActive && (
          <g>
            <ellipse cx="500" cy="340" rx="340" ry="180" fill={emotionColor} opacity="0.08" filter="url(#wide-glow)">
              <animate attributeName="opacity" values="0.06;0.14;0.06" dur="3s" repeatCount="indefinite" />
            </ellipse>
            <circle cx="500" cy="370" r="60" fill={emotionColor} opacity="0.22" filter="url(#soft-glow)">
              <animate attributeName="r" values="50;75;50" dur="2.4s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {/* Calm Fireflies */}
        {weather !== 'stormy' && (
          <g>
            {motes.map((m, i) => (
              <g key={`mote-${i}`}>
                <circle cx={m.cx} cy={m.cy} r="2" fill={atmo.windowCore} opacity="0">
                  <animate attributeName="opacity" values="0;0.75;0" dur={`${m.dur}s`} begin={`${m.delay}s`} repeatCount="indefinite" />
                  <animateMotion
                    path={`M0,0 Q${m.rx},${-m.ry} ${m.rx * 2},0 Q${m.rx},${m.ry} 0,0`}
                    dur={`${m.dur * 1.8}s`}
                    begin={`${m.delay}s`}
                    repeatCount="indefinite"
                  />
                </circle>
                <circle cx={m.cx} cy={m.cy} r="5" fill={atmo.windowGlow} opacity="0" filter="url(#soft-glow)">
                  <animate attributeName="opacity" values="0;0.25;0" dur={`${m.dur}s`} begin={`${m.delay}s`} repeatCount="indefinite" />
                </circle>
              </g>
            ))}
          </g>
        )}

        {/* Ground Mist Layer */}
        <ellipse cx="500" cy="510" rx="460" ry="35" fill={atmo.fog} opacity={resolvedGlow ? 0.15 : 0.3} filter="url(#fog-blur)">
          <animate attributeName="opacity" values={resolvedGlow ? "0.1;0.2;0.1" : "0.25;0.4;0.25"} dur="7s" repeatCount="indefinite" />
        </ellipse>

        {/* Health Damage Darkening Vignette */}
        {health < 60 && (
          <rect
            x="0"
            y="0"
            width="1000"
            height="580"
            fill="#12041a"
            opacity={Math.min(0.4, (60 - health) / 100)}
          />
        )}
      </svg>
    </div>
  );
}