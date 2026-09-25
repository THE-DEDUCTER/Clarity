"use client";

import React, { useState, useCallback } from 'react';
import {
  GameState, Emotion, emotions, ChamberType, CHAMBERS,
  ThoughtNature, ResponseAction, EncounterRecord,
  initialGameState, getWeatherFromHealth, getGatekeeperMood
} from './GameState';
import { Castle } from './Castle';
import {
  Shield, ArrowLeft, RotateCcw,
  Heart, Compass, Eye,
  Check, ArrowRight, Sparkles, Feather
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type SubPhase = 'courtyard' | 'thought-gate' | 'thought-result' | 'response' | 'feedback';
type GamePhase = 'start' | 'journey' | 'reflection' | 'gameover';

export const InnerGatekeeper: React.FC = () => {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [gamePhase, setGamePhase] = useState<GamePhase>('start');
  const [subPhase, setSubPhase] = useState<SubPhase>('courtyard');

  const [currentEmotion, setCurrentEmotion] = useState<Emotion>(emotions[0]);
  const [thoughtSelection, setThoughtSelection] = useState<ThoughtNature | null>(null);
  const [wasThoughtAccurate, setWasThoughtAccurate] = useState<boolean>(false);
  const [actionSelection, setActionSelection] = useState<ResponseAction | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [feedbackInsight, setFeedbackInsight] = useState<string>('');
  const [resolvedGlow, setResolvedGlow] = useState<boolean>(false);

  const [currentChamberStep, setCurrentChamberStep] = useState<number>(0);
  const [emotionHistory, setEmotionHistory] = useState<string[]>([]);
  const totalChambers = 5;

  const getNextEmotion = useCallback((history: string[]): Emotion => {
    const pool = emotions.filter(e => !history.slice(-3).includes(e.id));
    const list = pool.length > 0 ? pool : emotions;
    return list[Math.floor(Math.random() * list.length)];
  }, []);

  // ─── START JOURNEY ───
  const startJourney = useCallback(() => {
    setGameState(initialGameState);
    const first = emotions[Math.floor(Math.random() * emotions.length)];
    setCurrentEmotion(first);
    setEmotionHistory([first.id]);
    setCurrentChamberStep(0);
    setSubPhase('courtyard');
    setGamePhase('journey');
    setThoughtSelection(null);
    setActionSelection(null);
    setResolvedGlow(false);
  }, []);

  // ─── THOUGHT GATE SELECTION (Fact / Assumption / Fear) ───
  const handleThoughtGateChoice = useCallback((choice: ThoughtNature) => {
    const isAccurate = currentEmotion.thoughtNature === choice;
    setThoughtSelection(choice);
    setWasThoughtAccurate(isAccurate);
    setSubPhase('thought-result');
  }, [currentEmotion]);

  // ─── RESPONSE SELECTION (Acknowledge / Explore / Release) ───
  const handleActionChoice = useCallback((action: ResponseAction) => {
    setActionSelection(action);

    const isAcceptAction = action === 'acknowledge';
    const isRejectAction = action === 'release';

    let effect = currentEmotion.effects.accept;
    let isCorrect = currentEmotion.bestChoice === 'accept';

    if (isRejectAction) {
      effect = currentEmotion.effects.reject;
      isCorrect = currentEmotion.bestChoice === 'reject';
    } else if (action === 'explore') {
      effect = {
        health: 6,
        peace: 10,
        score: 8,
        message: `Exploring ${currentEmotion.name} with calm curiosity deepens understanding and restores balance.`
      };
      isCorrect = true;
    }

    setGameState(prev => {
      const h = Math.max(0, Math.min(100, prev.castleHealth + effect.health));
      const p = Math.max(0, Math.min(100, prev.innerPeace + effect.peace));
      const s = Math.max(0, prev.score + effect.score + (wasThoughtAccurate ? 10 : 0));
      const handled = prev.emotionsHandled + 1;
      const record: EncounterRecord = {
        emotion: currentEmotion,
        thoughtChoice: thoughtSelection || 'FEAR',
        wasThoughtAccurate,
        actionChoice: action
      };
      return {
        ...prev,
        castleHealth: h,
        innerPeace: p,
        score: s,
        emotionsHandled: handled,
        correctChoices: prev.correctChoices + (isCorrect ? 1 : 0),
        level: Math.floor(handled / 5) + 1,
        weather: getWeatherFromHealth(h, p),
        gatekeeperMood: getGatekeeperMood(h, p),
        history: [...prev.history, record]
      };
    });

    setFeedbackText(effect.message);
    setFeedbackInsight(currentEmotion.insight);
    setResolvedGlow(true);
    setSubPhase('feedback');
  }, [currentEmotion, wasThoughtAccurate, thoughtSelection]);

  // ─── ADVANCE TO NEXT CHAMBER / COMPLETE JOURNEY ───
  const handleAdvanceChamber = useCallback(() => {
    setResolvedGlow(false);
    if (gameState.castleHealth <= 0 || gameState.innerPeace <= 0) {
      setGamePhase('gameover');
      return;
    }

    const nextStep = currentChamberStep + 1;
    if (nextStep >= totalChambers) {
      setGamePhase('reflection');
      return;
    }

    setCurrentChamberStep(nextStep);
    const nextEmo = getNextEmotion(emotionHistory);
    setCurrentEmotion(nextEmo);
    setEmotionHistory(prev => [...prev, nextEmo.id]);
    setThoughtSelection(null);
    setActionSelection(null);
    setSubPhase('courtyard');
  }, [currentChamberStep, gameState.castleHealth, gameState.innerPeace, getNextEmotion, emotionHistory]);

  const restartGame = useCallback(() => {
    setGameState(initialGameState);
    setGamePhase('start');
    setSubPhase('courtyard');
    setCurrentChamberStep(0);
    setEmotionHistory([]);
    setThoughtSelection(null);
    setActionSelection(null);
    setResolvedGlow(false);
  }, []);

  const currentChamber: ChamberType =
    currentChamberStep === 0 ? 'gate' :
    currentChamberStep === 1 ? 'courtyard' :
    currentChamberStep === 2 ? 'watchtower' :
    currentChamberStep === 3 ? 'inner-hall' : 'inner-chamber';

  const healthBar = (val: number, color: string) => (
    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${val}%`, backgroundColor: color }} />
    </div>
  );

  /* ─────────────────────────────────────────────────────────────
     1. START SCREEN — Mature Self-Reflection Introduction
  ───────────────────────────────────────────────────────────── */
  if (gamePhase === 'start') {
    return (
      <div className="h-screen w-full overflow-hidden bg-[#07040d] flex flex-col select-none">
        {/* Top bar */}
        <div className="flex-none px-6 py-3.5 flex items-center justify-between z-20 border-b border-white/5 bg-black/40 backdrop-blur-md">
          <button
            onClick={() => router.push('/games')}
            className="flex items-center gap-2 text-white/50 hover:text-white text-xs font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Games</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-white/80 font-medium tracking-wide">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>Mind Castle Sanctuary</span>
          </div>
        </div>

        {/* Side-by-side Layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_420px] lg:grid-cols-[1fr_460px] min-h-0">
          {/* Left: Hero Castle Environment */}
          <div className="relative min-h-0 hidden md:block">
            <Castle health={100} weather="sunny" gatekeeperMood="peaceful" isEmotionActive={false} chamber="gate" />
            <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#07040d] to-transparent pointer-events-none" />
          </div>

          {/* Right: Sophisticated Glassmorphic Panel */}
          <div className="flex flex-col justify-center px-6 py-6 overflow-y-auto bg-gradient-to-l from-[#080410] via-[#0b0615] to-transparent">
            <div className="max-w-md w-full mx-auto space-y-5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300/70">Self-Reflection Exercise</span>
                <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mt-1">The Mind Castle</h1>
                <p className="text-white/50 text-xs leading-relaxed mt-2">
                  Your mind is an internal sanctuary. Navigate 5 chambers, examine incoming thoughts at the Thought Gate, and respond with conscious clarity.
                </p>
              </div>

              {/* Chambers Step Sequence */}
              <div className="space-y-2">
                <span className="text-[10px] font-medium text-white/40 uppercase tracking-widest block">Chambers of Awareness</span>
                <div className="space-y-1.5">
                  {CHAMBERS.map((ch) => (
                    <div key={ch.id} className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-xl px-3.5 py-2">
                      <span className="text-xs font-mono text-indigo-300/80 w-5">{ch.stepNumber}</span>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-medium text-white/90 block">{ch.title}</span>
                        <span className="text-[10px] text-white/40 block truncate">{ch.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={startJourney}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-3.5 rounded-xl text-xs tracking-wider transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Enter The Mind Castle</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     2. FINAL REFLECTION SCREEN ("Your Castle, Your Pattern")
  ───────────────────────────────────────────────────────────── */
  if (gamePhase === 'reflection') {
    return (
      <div className="h-screen w-full overflow-hidden bg-[#07040d] flex flex-col select-none">
        <div className="flex-none px-6 py-3.5 flex items-center justify-between z-20 border-b border-white/5 bg-black/40 backdrop-blur-md">
          <button
            onClick={() => router.push('/games')}
            className="flex items-center gap-1.5 text-white/40 hover:text-white text-xs font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Games</span>
          </button>
          <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-medium tracking-wide">
            <Feather className="w-3.5 h-3.5 text-indigo-400" />
            <span>Reflection & Synthesis</span>
          </div>
          <button onClick={restartGame} className="flex items-center gap-1 text-white/40 hover:text-white text-xs transition-colors">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Repeat</span>
          </button>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_440px] lg:grid-cols-[1fr_480px] min-h-0">
          <div className="relative min-h-0 hidden md:block">
            <Castle health={gameState.castleHealth} weather="sunny" gatekeeperMood="peaceful" isEmotionActive={false} chamber="inner-chamber" resolvedGlow={true} />
            <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#07040d] to-transparent pointer-events-none" />
          </div>

          <div className="flex flex-col justify-between p-6 overflow-y-auto bg-gradient-to-l from-[#080410] via-[#0b0615] to-transparent">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300/70">Chamber V</span>
                <h2 className="text-xl font-semibold text-white tracking-tight mt-1">Your Castle, Your Pattern</h2>
                <p className="text-white/40 text-xs mt-1">A synthesis of the thoughts and responses explored during your journey.</p>
              </div>

              {/* Status Bar */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-white/[0.03] border border-white/8 rounded-xl p-3">
                  <span className="text-[10px] text-white/40 uppercase tracking-wider font-mono">Sanctuary Integrity</span>
                  <p className="text-lg font-semibold text-emerald-400 mt-1">{gameState.castleHealth}%</p>
                </div>
                <div className="bg-white/[0.03] border border-white/8 rounded-xl p-3">
                  <span className="text-[10px] text-white/40 uppercase tracking-wider font-mono">Inner Peace</span>
                  <p className="text-lg font-semibold text-indigo-300 mt-1">{gameState.innerPeace}%</p>
                </div>
              </div>

              {/* Explored Emotions Log */}
              <div className="bg-white/[0.03] border border-white/6 rounded-xl p-3.5 space-y-2.5">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">Observed Patterns</span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {gameState.history.map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-lg px-3 py-2 text-xs">
                      <span className="font-medium text-white/90">{item.emotion.name}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {item.thoughtChoice}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-white/5 text-white/60">
                          {item.actionChoice}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Takeaways */}
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 space-y-2">
                <span className="text-[10px] font-mono text-indigo-300/80 uppercase tracking-wider block">Core Reflections</span>
                <ul className="text-xs text-white/60 space-y-1.5 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Thought Recognition:</strong> You observed thoughts as temporary events rather than absolute facts.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Perspective Inquiry:</strong> Discerning Assumptions and Fears prevented unneeded emotional reactivity.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Conscious Response:</strong> Choosing how to respond maintains the stability of your inner environment.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={startJourney}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-3 rounded-xl text-xs tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Walk The Mind Castle Again</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     3. GAME OVER SCREEN — Gentle Reflective Rebuild
  ───────────────────────────────────────────────────────────── */
  if (gamePhase === 'gameover') {
    return (
      <div className="h-screen w-full overflow-hidden bg-[#07040d] flex flex-col select-none">
        <div className="flex-none px-6 py-3.5 flex items-center justify-between z-20 border-b border-white/5">
          <button onClick={() => router.push('/games')} className="flex items-center gap-1.5 text-white/40 hover:text-white text-xs font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /><span>Games</span>
          </button>
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_420px] min-h-0">
          <div className="relative min-h-0 hidden md:block">
            <Castle health={0} weather="stormy" gatekeeperMood="anxious" isEmotionActive={false} />
            <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#07040d] to-transparent pointer-events-none" />
          </div>
          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-l from-[#080410] via-[#0b0615] to-transparent">
            <div className="max-w-sm w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center shadow-xl space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-rose-300/80">Inner Storm</span>
                <h2 className="text-xl font-semibold text-white mt-1">Sanctuary Overwhelmed</h2>
                <p className="text-white/50 text-xs mt-2 leading-relaxed">
                  Persistent tension disrupted internal equilibrium. Cultivating emotional balance is a practice renewed with each reflection.
                </p>
              </div>
              <button
                onClick={startJourney}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-3 rounded-xl text-xs tracking-wider transition-all"
              >
                Begin Anew
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     4. ACTIVE CHAMBER JOURNEY
     Side-by-side, 100% fitting in ONE single screen without scrolling
  ───────────────────────────────────────────────────────────── */
  return (
    <div className="h-screen w-full overflow-hidden bg-[#07040d] flex flex-col select-none">
      {/* ── Top Nav Bar ── */}
      <div className="flex-none h-12 px-5 flex items-center justify-between bg-black/40 backdrop-blur-md border-b border-white/5 z-20">
        <button
          onClick={() => router.push('/games')}
          className="flex items-center gap-1.5 text-white/40 hover:text-white/80 text-xs font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Games</span>
        </button>

        {/* Stepped Chamber Indicator */}
        <div className="flex items-center gap-2">
          {CHAMBERS.map((ch, idx) => {
            const isDone = idx < currentChamberStep;
            const isCurr = idx === currentChamberStep;
            return (
              <div key={ch.id} className="flex items-center gap-1.5">
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-medium transition-all ${
                    isCurr
                      ? 'bg-indigo-500/20 border border-indigo-400/40 text-indigo-200'
                      : isDone
                      ? 'bg-white/5 text-white/40'
                      : 'text-white/20'
                  }`}
                >
                  <span className="font-mono text-[9px]">{ch.stepNumber}</span>
                  <span className="hidden sm:inline">{ch.title}</span>
                </div>
                {idx < CHAMBERS.length - 1 && <span className="text-white/10 text-[10px]">/</span>}
              </div>
            );
          })}
        </div>

        <button
          onClick={restartGame}
          className="flex items-center gap-1 text-white/30 hover:text-white/70 text-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Restart</span>
        </button>
      </div>

      {/* ── Main Workspace ── */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_400px] lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_470px] min-h-0">

        {/* LEFT COLUMN — Live Responsive Castle */}
        <div className="relative min-h-0 w-full h-full overflow-hidden bg-[#07040d]">
          <Castle
            health={gameState.castleHealth}
            weather={gameState.weather}
            gatekeeperMood={gameState.gatekeeperMood}
            isEmotionActive={true}
            emotionColor={currentEmotion.glowColor}
            chamber={currentChamber}
            resolvedGlow={resolvedGlow}
          />

          {/* Minimalist Location Badge floating on Castle */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2.5 bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-xl">
            <span className="text-xs font-mono text-indigo-300 font-semibold">{CHAMBERS[currentChamberStep]?.stepNumber}</span>
            <div>
              <p className="text-[9px] text-white/40 uppercase font-mono tracking-wider">Chamber 0{currentChamberStep + 1} of 05</p>
              <p className="text-xs font-medium text-white/90">{CHAMBERS[currentChamberStep]?.title}</p>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#07040d] to-transparent pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-[#07040d] to-transparent pointer-events-none" />
        </div>

        {/* RIGHT COLUMN — Mind Sanctuary Panel */}
        <div className="flex flex-col justify-between min-h-0 p-4 sm:p-5 gap-3 bg-gradient-to-l from-[#080410] via-[#0b0615] to-transparent backdrop-blur-md border-l border-white/5 overflow-y-auto">

          {/* ── 1. Status Bar ── */}
          <div className="flex-none space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/[0.03] border border-white/8 rounded-xl px-3 py-2 flex items-center gap-2.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center text-[9px] mb-1">
                    <span className="font-mono text-white/40 uppercase tracking-wider">Integrity</span>
                    <span className="font-mono text-emerald-300 font-medium">{gameState.castleHealth}%</span>
                  </div>
                  {healthBar(gameState.castleHealth, gameState.castleHealth > 65 ? '#34d399' : gameState.castleHealth > 35 ? '#fbbf24' : '#f87171')}
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/8 rounded-xl px-3 py-2 flex items-center gap-2.5">
                <Heart className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center text-[9px] mb-1">
                    <span className="font-mono text-white/40 uppercase tracking-wider">Peace</span>
                    <span className="font-mono text-indigo-300 font-medium">{gameState.innerPeace}%</span>
                  </div>
                  {healthBar(gameState.innerPeace, gameState.innerPeace > 65 ? '#818cf8' : gameState.innerPeace > 35 ? '#a78bfa' : '#f87171')}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-white/30 px-1">
              <span className="capitalize text-white/40 font-medium">{gameState.weather} Atmosphere</span>
              <span className="text-indigo-300/60 font-mono">Stage {currentChamberStep + 1} / {totalChambers}</span>
            </div>
          </div>

          {/* ── 2. Chamber Interaction Flow ── */}
          <div className="flex-1 flex flex-col justify-center min-h-0">

            {/* STAGE A: Courtyard (Observation) */}
            {subPhase === 'courtyard' && (
              <div className="flex flex-col space-y-3.5 animate-in fade-in slide-in-from-right-3 duration-300">
                <div className="flex items-center gap-1.5 text-indigo-300 text-xs font-medium">
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Your mind is noticing an emotional state</span>
                </div>

                {/* Emotion Presentation Card */}
                <div
                  className="bg-white/[0.03] border border-white/10 rounded-xl p-4 relative overflow-hidden shadow-lg"
                  style={{ borderLeftColor: currentEmotion.color, borderLeftWidth: 3 }}
                >
                  <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 block mb-1">Current State</span>
                  <h3 className="text-lg font-semibold text-white tracking-tight">{currentEmotion.name}</h3>
                  <p className="text-white/50 text-xs leading-relaxed mt-1.5">{currentEmotion.description}</p>
                </div>

                <p className="text-[11px] text-white/40 text-center leading-relaxed">
                  Take a moment to notice what may be underneath this feeling.
                </p>

                <button
                  onClick={() => setSubPhase('thought-gate')}
                  className="w-full bg-indigo-600/20 hover:bg-indigo-600/35 border border-indigo-500/30 hover:border-indigo-400 text-indigo-200 font-medium py-3 rounded-xl text-xs tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <span>Examine at Thought Gate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* STAGE B: Thought Gate (Inquiry: FACT | ASSUMPTION | FEAR) */}
            {subPhase === 'thought-gate' && (
              <div className="flex flex-col space-y-3.5 animate-in fade-in slide-in-from-right-3 duration-300">
                <div className="flex items-center gap-1.5 text-amber-200/90 text-xs font-medium">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Thought Gate: Perspective Check</span>
                </div>

                {/* Underlying Thought Quote */}
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white/40 block mb-1">Internal Thought</span>
                  <p className="text-xs sm:text-sm font-medium text-indigo-100/90 leading-snug italic">
                    {currentEmotion.thought}
                  </p>
                </div>

                <p className="text-[11px] text-white/50 text-center">
                  How would you classify the nature of this thought?
                </p>

                {/* 3 Mature Inquiry Options */}
                <div className="grid grid-cols-3 gap-2">
                  {(['FACT', 'ASSUMPTION', 'FEAR'] as ThoughtNature[]).map((nature) => (
                    <button
                      key={nature}
                      onClick={() => handleThoughtGateChoice(nature)}
                      className="bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-indigo-400/50 rounded-xl py-3 px-2 text-center transition-all duration-200"
                    >
                      <span className="block text-xs font-medium text-white/90 tracking-wider">{nature}</span>
                      <span className="block text-[8px] text-white/40 mt-1 leading-tight">
                        {nature === 'FACT' ? 'Observable Reality' : nature === 'ASSUMPTION' ? 'Interpretation' : 'Anticipation'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STAGE C: Thought Gate Explanation */}
            {subPhase === 'thought-result' && (
              <div className="flex flex-col space-y-3 animate-in fade-in slide-in-from-right-3 duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-indigo-300/80 uppercase tracking-widest">
                    Perspective Insight · {currentEmotion.thoughtNature}
                  </span>
                </div>

                <div className="bg-white/[0.03] border border-white/8 rounded-xl p-3.5">
                  <p className="text-xs text-white/80 leading-relaxed">
                    {currentEmotion.thoughtExplanation}
                  </p>
                </div>

                <button
                  onClick={() => setSubPhase('response')}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-3 rounded-xl text-xs tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <span>Proceed to The Inner Hall</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* STAGE D: The Inner Hall (Conscious Response) */}
            {subPhase === 'response' && (
              <div className="flex flex-col space-y-3 animate-in fade-in slide-in-from-right-3 duration-300">
                <div className="text-center">
                  <span className="text-[10px] font-mono text-indigo-300/70 uppercase tracking-wider">The Inner Hall</span>
                  <h4 className="text-xs sm:text-sm font-medium text-white mt-0.5">Choose how you want to respond</h4>
                </div>

                {/* 3 Response Actions */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleActionChoice('acknowledge')}
                    className="bg-white/[0.03] hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-400/40 rounded-xl p-2.5 text-center transition-all duration-200 group"
                  >
                    <span className="block text-[11px] font-medium text-white/90 group-hover:text-emerald-300 tracking-wider">ACKNOWLEDGE</span>
                    <span className="block text-[8px] text-white/40 mt-1 leading-tight">Recognize without judging</span>
                  </button>

                  <button
                    onClick={() => handleActionChoice('explore')}
                    className="bg-white/[0.03] hover:bg-indigo-500/15 border border-white/10 hover:border-indigo-400/40 rounded-xl p-2.5 text-center transition-all duration-200 group"
                  >
                    <span className="block text-[11px] font-medium text-white/90 group-hover:text-indigo-300 tracking-wider">EXPLORE</span>
                    <span className="block text-[8px] text-white/40 mt-1 leading-tight">Consider what influences it</span>
                  </button>

                  <button
                    onClick={() => handleActionChoice('release')}
                    className="bg-white/[0.03] hover:bg-rose-500/15 border border-white/10 hover:border-rose-400/40 rounded-xl p-2.5 text-center transition-all duration-200 group"
                  >
                    <span className="block text-[11px] font-medium text-white/90 group-hover:text-rose-300 tracking-wider">RELEASE</span>
                    <span className="block text-[8px] text-white/40 mt-1 leading-tight">Allow thought to pass</span>
                  </button>
                </div>
              </div>
            )}

            {/* STAGE E: Feedback & Castle Atmosphere Reaction */}
            {subPhase === 'feedback' && (
              <div className="flex flex-col space-y-3 animate-in fade-in slide-in-from-right-3 duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-indigo-300/80 uppercase tracking-widest">
                    Atmospheric Response
                  </span>
                  <span className="text-[10px] text-white/40 uppercase font-mono">
                    {actionSelection}ed {currentEmotion.name}
                  </span>
                </div>

                <div className="bg-white/[0.03] border border-white/8 rounded-xl p-3.5 text-xs leading-relaxed text-white/80">
                  {feedbackText}
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                  <p className="text-white/60 text-xs italic leading-relaxed">
                    {feedbackInsight}
                  </p>
                </div>

                <button
                  onClick={handleAdvanceChamber}
                  className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-3 rounded-xl text-xs tracking-wider transition-all duration-200 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                >
                  <span>
                    {currentChamberStep + 1 >= totalChambers ? 'Enter The Inner Chamber' : 'Advance to Next Chamber →'}
                  </span>
                </button>
              </div>
            )}

          </div>

          {/* ── 3. Minimal Subtle Footer ── */}
          <div className="flex-none pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-white/25 font-mono">
            <span>Mind Sanctuary</span>
            <span>Chamber {currentChamberStep + 1} / {totalChambers}</span>
          </div>

        </div>

      </div>
    </div>
  );
};