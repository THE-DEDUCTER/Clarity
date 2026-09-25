"use client";

import React from 'react';
import { GameState } from './GameState';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Smile,
  Meh,
  Frown,
  AlertCircle,
  RotateCcw,
  Shield,
  HeartHandshake,
  Trophy,
  Crosshair
} from 'lucide-react';

interface GameUIProps {
  gameState: GameState;
  onRestart: () => void;
}

export const GameUI: React.FC<GameUIProps> = ({
  gameState,
  onRestart,
}) => {
  const getHealthColor = (health: number) => {
    if (health > 70) return '#4ade80';
    if (health > 40) return '#fbbf24';
    return '#ef4444';
  };

  const getPeaceColor = (peace: number) => {
    if (peace > 70) return '#818cf8';
    if (peace > 40) return '#a78bfa';
    return '#f87171';
  };

  const renderWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'sunny': return <Sun className="w-3.5 h-3.5 text-amber-400" />;
      case 'cloudy': return <Cloud className="w-3.5 h-3.5 text-slate-400" />;
      case 'rainy': return <CloudRain className="w-3.5 h-3.5 text-sky-400" />;
      case 'stormy': return <CloudLightning className="w-3.5 h-3.5 text-purple-400" />;
      default: return <Sun className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const renderMoodIcon = (mood: string) => {
    switch (mood) {
      case 'peaceful': return <Smile className="w-3.5 h-3.5 text-emerald-400" />;
      case 'concerned': return <Meh className="w-3.5 h-3.5 text-amber-400" />;
      case 'worried': return <Frown className="w-3.5 h-3.5 text-orange-400" />;
      case 'stressed':
      case 'anxious': return <AlertCircle className="w-3.5 h-3.5 text-rose-400" />;
      default: return <Smile className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const accuracy = gameState.emotionsHandled > 0
    ? Math.round((gameState.correctChoices / gameState.emotionsHandled) * 100)
    : 0;

  return (
    <div className="relative z-20 px-4 pt-2">
      <div className="max-w-3xl mx-auto">
        {/* Compact HUD Bar */}
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/8 rounded-2xl px-4 py-3 shadow-lg">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* Health & Peace Bars */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Castle Health */}
              <div className="flex items-center gap-2 flex-1 min-w-[120px]">
                <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Castle</span>
                    <span className="text-[10px] font-mono text-white/60">{gameState.castleHealth}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${gameState.castleHealth}%`,
                        backgroundColor: getHealthColor(gameState.castleHealth)
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Inner Peace */}
              <div className="flex items-center gap-2 flex-1 min-w-[120px]">
                <HeartHandshake className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Peace</span>
                    <span className="text-[10px] font-mono text-white/60">{gameState.innerPeace}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${gameState.innerPeace}%`,
                        backgroundColor: getPeaceColor(gameState.innerPeace)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-white/[0.04] rounded-lg px-2.5 py-1.5">
                {renderWeatherIcon(gameState.weather)}
                <span className="text-[10px] text-white/50 capitalize">{gameState.weather}</span>
              </div>

              <div className="flex items-center gap-1.5 bg-white/[0.04] rounded-lg px-2.5 py-1.5">
                {renderMoodIcon(gameState.gatekeeperMood)}
                <span className="text-[10px] text-white/50 capitalize">{gameState.gatekeeperMood}</span>
              </div>

              <div className="hidden sm:flex items-center gap-3 text-[10px] text-white/40 font-mono">
                <div className="flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span>{gameState.score}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Crosshair className="w-3 h-3 text-indigo-400" />
                  <span>{accuracy}%</span>
                </div>
                <span>Lv.{gameState.level}</span>
              </div>

              <button
                onClick={onRestart}
                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/40 hover:text-white/70 transition-colors"
                title="Restart"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};