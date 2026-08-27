"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ArrowLeft, 
  RotateCcw, 
  MessageCircle, 
  BookHeart, 
  Flame, 
  ShieldAlert, 
  Info,
  ChevronRight,
  Sliders,
  Send,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export interface EmotionData {
  id: string;
  name: string;
  category: "anger" | "fear" | "sadness" | "joy" | "peace" | "power";
  color: string;
  glowColor: string;
  textColor?: string;
  definition: string;
  bodySensation: string;
  copingAdvice: string;
  recommendedCompanion: "alex" | "maya" | "sage" | "luna" | "rio";
  subEmotions?: EmotionData[];
}

export const EMOTION_TREE: EmotionData[] = [
  {
    id: "anger",
    name: "Anger & Frustration",
    category: "anger",
    color: "#ff003c",
    glowColor: "rgba(255, 0, 60, 0.45)",
    definition: "A strong feeling of annoyance, displeasure, or hostility when boundaries or expectations are violated.",
    bodySensation: "Increased heart rate, clenched jaw, tightness in chest, warmth in face.",
    copingAdvice: "Take slow deep exhalations, step back from the trigger, and express your boundary clearly.",
    recommendedCompanion: "sage",
    subEmotions: [
      {
        id: "irate",
        name: "Irate",
        category: "anger",
        color: "#ff003c",
        glowColor: "rgba(255, 0, 60, 0.5)",
        definition: "Feeling extreme irritation and indignation at a specific unfairness or offense.",
        bodySensation: "Sharp spike of adrenaline, racing thoughts, muscle tension.",
        copingAdvice: "Physical release (brisk walk) followed by structured journaling.",
        recommendedCompanion: "sage",
        subEmotions: [
          { id: "enraged", name: "Enraged", category: "anger", color: "#d90429", glowColor: "rgba(217, 4, 41, 0.6)", definition: "Overpowering, intense wrath seeking immediate confrontation.", bodySensation: "Trembling, tunnel vision, intense heat.", copingAdvice: "Pause immediately. Do the 4-7-8 breathing technique before speaking.", recommendedCompanion: "alex" },
          { id: "livid", name: "Livid", category: "anger", color: "#ef233c", glowColor: "rgba(239, 35, 60, 0.5)", definition: "Furiously angry to the point of speechless shock.", bodySensation: "Stiff neck, shallow breathing.", copingAdvice: "Write an unfiltered letter you will never send to discharge tension.", recommendedCompanion: "sage" },
          { id: "furious", name: "Furious", category: "anger", color: "#ff1053", glowColor: "rgba(255, 16, 83, 0.5)", definition: "High-voltage rage directed at a person or circumstance.", bodySensation: "Elevated pulse, pacing urge.", copingAdvice: "Ground feet firmly on floor and count 5 red objects in the room.", recommendedCompanion: "alex" },
          { id: "spiteful", name: "Spiteful", category: "anger", color: "#b5179e", glowColor: "rgba(181, 23, 158, 0.5)", definition: "Desire to hurt or annoy because of wounded pride.", bodySensation: "Hollow knot in gut.", copingAdvice: "Acknowledge the hurt beneath the desire for revenge.", recommendedCompanion: "luna" },
        ]
      },
      {
        id: "annoyed",
        name: "Annoyed",
        category: "anger",
        color: "#f72585",
        glowColor: "rgba(247, 37, 133, 0.5)",
        definition: "Mildly angry or irritated by persistent inconveniences.",
        bodySensation: "Eye strain, sighing, restless fingers.",
        copingAdvice: "Shift environment or put on noise-cancelling headphones.",
        recommendedCompanion: "maya",
        subEmotions: [
          { id: "frustrated", name: "Frustrated", category: "anger", color: "#e63946", glowColor: "rgba(230, 57, 70, 0.5)", definition: "Distressed from being blocked from achieving an intended goal.", bodySensation: "Tight shoulders, clenched fists.", copingAdvice: "Break the barrier down into micro-steps or pivot temporarily.", recommendedCompanion: "sage" },
          { id: "impatient", name: "Impatient", category: "anger", color: "#ff4d6d", glowColor: "rgba(255, 77, 109, 0.5)", definition: "Restlessness caused by delay or perceived slowness of others.", bodySensation: "Tapping feet, rapid speech.", copingAdvice: "Remind yourself: 'Timing does not equal worth.'", recommendedCompanion: "alex" },
          { id: "resentful", name: "Resentful", category: "anger", color: "#c1121f", glowColor: "rgba(193, 18, 31, 0.5)", definition: "Bitterness from perceived unfair treatment over time.", bodySensation: "Heavy chest, bitter taste.", copingAdvice: "Clarify unspoken expectations you held for others.", recommendedCompanion: "luna" }
        ]
      },
      {
        id: "bitter",
        name: "Bitter",
        category: "anger",
        color: "#9d0208",
        glowColor: "rgba(157, 2, 8, 0.5)",
        definition: "Lingering resentment from feeling deeply let down.",
        bodySensation: "Constriction in throat, posture slump.",
        copingAdvice: "Practice self-compassion for what you lost.",
        recommendedCompanion: "luna"
      }
    ]
  },
  {
    id: "fear",
    name: "Fear & Anxiety",
    category: "fear",
    color: "#7209b7",
    glowColor: "rgba(114, 9, 183, 0.5)",
    definition: "An unpleasant emotion caused by anticipation of threat, uncertainty, or vulnerability.",
    bodySensation: "Fluttering stomach (butterflies), cold hands, rapid pulse, hyper-vigilance.",
    copingAdvice: "Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.",
    recommendedCompanion: "alex",
    subEmotions: [
      {
        id: "panicked",
        name: "Panicked",
        category: "fear",
        color: "#560bad",
        glowColor: "rgba(86, 11, 173, 0.6)",
        definition: "Sudden overwhelming terror that impairs clear logical thought.",
        bodySensation: "Gasping for air, dizziness, feeling detached from body.",
        copingAdvice: "Put an ice cube in hand or splash cold water on face (mammalian dive reflex).",
        recommendedCompanion: "alex",
        subEmotions: [
          { id: "terrified", name: "Terrified", category: "fear", color: "#480ca8", glowColor: "rgba(72, 12, 168, 0.6)", definition: "Extreme dread in the presence of overwhelming danger.", bodySensation: "Freezing in place, shivers.", copingAdvice: "Hold a weighted blanket or cross arms in a butterfly hug.", recommendedCompanion: "alex" },
          { id: "overwhelmed", name: "Overwhelmed", category: "fear", color: "#3f37c9", glowColor: "rgba(63, 55, 201, 0.5)", definition: "Inundated by too many demands, emotions, or stimuli at once.", bodySensation: "Brain fog, fatigue, sensory overload.", copingAdvice: "Do a 'brain dump' on paper and do ONE single item only.", recommendedCompanion: "sage" },
          { id: "frightened", name: "Frightened", category: "fear", color: "#4361ee", glowColor: "rgba(67, 97, 238, 0.5)", definition: "Startled or alarmed by sudden unexpected events.", bodySensation: "Jerk reflex, tense shoulders.", copingAdvice: "Take 3 box breaths: Inhale 4s, Hold 4s, Exhale 4s, Hold 4s.", recommendedCompanion: "alex" },
          { id: "scared", name: "Scared", category: "fear", color: "#4895ef", glowColor: "rgba(72, 149, 239, 0.5)", definition: "Nervous apprehension about what might happen next.", bodySensation: "Shaky legs, dry mouth.", copingAdvice: "Repeat: 'I am safe in this exact moment right now.'", recommendedCompanion: "luna" },
        ]
      },
      {
        id: "anxious",
        name: "Anxious",
        category: "fear",
        color: "#4cc9f0",
        glowColor: "rgba(76, 201, 240, 0.5)",
        definition: "Persistent worry about uncertain future outcomes.",
        bodySensation: "Restlessness, knot in stomach, difficulty concentrating.",
        copingAdvice: "Ask yourself: 'Is this worry solvable right now, or is it hypothetical?'",
        recommendedCompanion: "sage",
        subEmotions: [
          { id: "nervous", name: "Nervous", category: "fear", color: "#00b4d8", glowColor: "rgba(0, 180, 216, 0.5)", definition: "Apprehension before a test, speech, or social encounter.", bodySensation: "Sweaty palms, butterflies.", copingAdvice: "Reframe nervous energy as excitement and readiness.", recommendedCompanion: "maya" },
          { id: "insecure", name: "Insecure", category: "fear", color: "#0077b6", glowColor: "rgba(0, 119, 182, 0.5)", definition: "Uncertainty regarding one's own adequacy, worth, or acceptance.", bodySensation: "Slumping shoulders, avoiding eye contact.", copingAdvice: "List 3 undeniable strengths or past achievements.", recommendedCompanion: "luna" },
          { id: "dread", name: "Dread", category: "fear", color: "#03045e", glowColor: "rgba(3, 4, 94, 0.5)", definition: "Heavy foreboding anticipation of an impending trial.", bodySensation: "Heavy weight in gut, sluggish limbs.", copingAdvice: "Talk it out aloud to demystify the monster in your head.", recommendedCompanion: "sage" }
        ]
      }
    ]
  },
  {
    id: "sadness",
    name: "Sadness & Grief",
    category: "sadness",
    color: "#2b6cb0",
    glowColor: "rgba(43, 108, 176, 0.5)",
    definition: "An emotional response to loss, disappointment, or feeling disconnected.",
    bodySensation: "Heavy chest, stinging eyes, lethargy, lump in throat.",
    copingAdvice: "Allow the tears to flow without judgment; crying releases endorphins.",
    recommendedCompanion: "luna",
    subEmotions: [
      {
        id: "lonely",
        name: "Lonely",
        category: "sadness",
        color: "#3182ce",
        glowColor: "rgba(49, 130, 206, 0.5)",
        definition: "Feeling isolated or unacknowledged by those around you.",
        bodySensation: "Cold sensation in chest, quiet fatigue.",
        copingAdvice: "Send a friendly text to an acquaintance or join a community voice lounge.",
        recommendedCompanion: "rio"
      },
      {
        id: "grief",
        name: "Heartbroken / Grief",
        category: "sadness",
        color: "#2c5282",
        glowColor: "rgba(44, 82, 130, 0.5)",
        definition: "Deep sorrow from losing someone or something cherished.",
        bodySensation: "Ache in the physical center of the chest.",
        copingAdvice: "Gently nurture yourself with warm tea, soft blankets, and restorative rest.",
        recommendedCompanion: "alex"
      },
      {
        id: "hopeless",
        name: "Hopeless / Depleted",
        category: "sadness",
        color: "#1a365d",
        glowColor: "rgba(26, 54, 93, 0.5)",
        definition: "Belief that things won't get better or energy is drained.",
        bodySensation: "Heavy limbs, lack of motivation.",
        copingAdvice: "Focus only on the next 10 minutes. Just breathe and rest.",
        recommendedCompanion: "luna"
      }
    ]
  },
  {
    id: "joy",
    name: "Joy & Exuberance",
    category: "joy",
    color: "#eab308",
    glowColor: "rgba(234, 179, 8, 0.5)",
    definition: "A vibrant feeling of delight, high energy, and uplifting accomplishment.",
    bodySensation: "Lightness in chest, spontaneous smile, energized bounce in step.",
    copingAdvice: "Celebrate this moment, share it with someone you love, and record it in your diary!",
    recommendedCompanion: "rio",
    subEmotions: [
      {
        id: "excited",
        name: "Excited",
        category: "joy",
        color: "#f59e0b",
        glowColor: "rgba(245, 158, 11, 0.5)",
        definition: "Eager enthusiasm and tingling anticipation.",
        bodySensation: "Bouncing energy, talking quickly, tingling in hands.",
        copingAdvice: "Channel this energy into a creative project or movement!",
        recommendedCompanion: "maya"
      },
      {
        id: "proud",
        name: "Proud",
        category: "joy",
        color: "#d97706",
        glowColor: "rgba(217, 119, 6, 0.5)",
        definition: "Satisfaction derived from one's own achievements or qualities.",
        bodySensation: "Upright posture, chin up, deep expansive breath.",
        copingAdvice: "Acknowledge the hard work and discipline that brought you here.",
        recommendedCompanion: "maya"
      },
      {
        id: "grateful",
        name: "Grateful",
        category: "joy",
        color: "#84cc16",
        glowColor: "rgba(132, 204, 22, 0.5)",
        definition: "Warm feeling of appreciation for the gifts and kindnesses received.",
        bodySensation: "Warmth radiating outward from center of chest.",
        copingAdvice: "Write down 3 specific things you are grateful for today.",
        recommendedCompanion: "luna"
      }
    ]
  },
  {
    id: "peace",
    name: "Calm & Grounded",
    category: "peace",
    color: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.5)",
    definition: "Serenity, balance, and freedom from mental turbulence.",
    bodySensation: "Slow rhythmic heartbeat, relaxed jaw and shoulders, clear head.",
    copingAdvice: "Savor the stillness. Anchor this peaceful state in your memory.",
    recommendedCompanion: "luna",
    subEmotions: [
      {
        id: "serene",
        name: "Serene / Tranquil",
        category: "peace",
        color: "#059669",
        glowColor: "rgba(5, 150, 105, 0.5)",
        definition: "Quiet undisturbed stillness of mind.",
        bodySensation: "Deep relaxed breathing, soft gaze.",
        copingAdvice: "Enjoy the silence, meditate or read in comfort.",
        recommendedCompanion: "luna"
      },
      {
        id: "balanced",
        name: "Balanced & Centered",
        category: "peace",
        color: "#14b8a6",
        glowColor: "rgba(20, 184, 166, 0.5)",
        definition: "Equanimity where mind and body feel aligned.",
        bodySensation: "Steady, rooted stance, easy flow of thought.",
        copingAdvice: "Maintain your rhythm with gentle hydration and stretch.",
        recommendedCompanion: "alex"
      }
    ]
  }
];

interface EmotionMapProps {
  onSelectEmotion?: (emotion: { name: string; category: string; intensity: number; note: string }) => void;
  onSendToLLM?: (prompt: string, companion: string) => void;
  className?: string;
}

export function EmotionMap({ onSelectEmotion, onSendToLLM, className }: EmotionMapProps) {
  // Navigation stack for drill-down
  const [navStack, setNavStack] = useState<EmotionData[]>([]);
  const [selectedLeaf, setSelectedLeaf] = useState<EmotionData | null>(null);
  const [intensity, setIntensity] = useState<number>(75);
  const [customNote, setCustomNote] = useState<string>("");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Current active level: root tree or children of top of stack
  const currentParent = navStack.length > 0 ? navStack[navStack.length - 1] : null;
  const currentNodes: EmotionData[] = currentParent ? (currentParent.subEmotions || []) : EMOTION_TREE;

  // Compute SVG orbital positions around center (450, 450)
  const nodePositions = useMemo(() => {
    const total = currentNodes.length;
    const cx = 450;
    const cy = 450;
    const radius = total <= 4 ? 260 : total <= 6 ? 280 : 310;

    return currentNodes.map((node, i) => {
      const angle = (i * (2 * Math.PI)) / total - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      return {
        ...node,
        x,
        y,
        r: total <= 4 ? 90 : total <= 6 ? 82 : 74
      };
    });
  }, [currentNodes]);

  // Center polygon shape coordinates (dynamic morph based on active parent or root)
  const centerShapePoints = useMemo(() => {
    if (!currentParent) {
      // Harmonic 14-point star polygon
      return "330,360 370,300 410,350 450,300 490,350 530,300 570,360 570,500 530,560 490,500 450,560 410,500 370,560 330,500";
    }
    // High energy angular polygon for sub-emotions
    return "340,350 400,280 450,330 500,280 560,350 600,450 550,540 500,510 450,570 400,510 350,540 300,450";
  }, [currentParent]);

  const activeColor = currentParent ? currentParent.color : "#6366f1";
  const activeGlow = currentParent ? currentParent.glowColor : "rgba(99, 102, 241, 0.4)";

  // Handle clicking a node
  const handleNodeClick = (node: EmotionData) => {
    if (node.subEmotions && node.subEmotions.length > 0) {
      setNavStack(prev => [...prev, node]);
      setSelectedLeaf(null);
    } else {
      setSelectedLeaf(node);
    }
  };

  // Step back in drill-down
  const handleBack = () => {
    if (selectedLeaf) {
      setSelectedLeaf(null);
    } else if (navStack.length > 0) {
      setNavStack(prev => prev.slice(0, -1));
    }
  };

  // Reset to root
  const handleReset = () => {
    setNavStack([]);
    setSelectedLeaf(null);
    setCustomNote("");
  };

  // Talk to LLM / AI Companion
  const handleChatWithCompanion = () => {
    const activeEmotion = selectedLeaf || currentParent;
    if (!activeEmotion) return;

    const companion = activeEmotion.recommendedCompanion || "alex";
    const prompt = `I'm currently feeling **${activeEmotion.name}** at an intensity of ${intensity}%. ${
      customNote ? `Here is what's happening: "${customNote}". ` : ""
    }Can you help me process this emotion and guide me through it?`;

    if (onSendToLLM) {
      onSendToLLM(prompt, companion);
    } else {
      // Store in session storage and redirect to AI chat
      sessionStorage.setItem("clarity_ai_prefill_prompt", prompt);
      sessionStorage.setItem("clarity_ai_companion", companion);
      router.push("/wellness");
      toast({
        title: `Connecting with ${companion.toUpperCase()}...`,
        description: `Passing your emotional state: ${activeEmotion.name} (${intensity}%)`
      });
    }
  };

  // Save/Log mood entry
  const handleSaveMood = async () => {
    const activeEmotion = selectedLeaf || currentParent;
    if (!activeEmotion) return;

    if (onSelectEmotion) {
      onSelectEmotion({
        name: activeEmotion.name,
        category: activeEmotion.category,
        intensity,
        note: customNote
      });
    }

    try {
      await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: activeEmotion.category === 'joy' ? 5 : activeEmotion.category === 'peace' ? 4 : activeEmotion.category === 'sadness' ? 2 : 1,
          emotionName: `${activeEmotion.name} (${intensity}%)`,
          note: customNote
        }),
      });
      toast({
        title: "✨ Emotion Logged to Clarity",
        description: `Recorded "${activeEmotion.name}" with intensity ${intensity}% into your wellness journey.`,
      });
      handleReset();
    } catch (e) {
      toast({
        title: "Mood Logged Locally",
        description: `Recorded "${activeEmotion.name}" (${intensity}%)`,
      });
    }
  };

  const activeFocusEmotion = selectedLeaf || currentParent;

  return (
    <div className={cn("w-full flex flex-col items-center select-none", className)}>
      {/* Header & Breadcrumb Nav */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-neutral-900/80 backdrop-blur-md rounded-2xl border border-neutral-800 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto text-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-neutral-400 hover:text-white flex items-center gap-1.5 h-8 px-2.5 rounded-lg"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Root Constellation</span>
          </Button>

          {navStack.map((item, idx) => (
            <React.Fragment key={item.id}>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setNavStack(navStack.slice(0, idx + 1));
                  setSelectedLeaf(null);
                }}
                className={cn(
                  "h-8 px-2.5 rounded-lg font-medium transition-colors",
                  idx === navStack.length - 1 && !selectedLeaf
                    ? "text-white bg-white/10"
                    : "text-neutral-400 hover:text-white"
                )}
                style={{
                  borderLeft: `2px solid ${item.color}`
                }}
              >
                {item.name}
              </Button>
            </React.Fragment>
          ))}

          {selectedLeaf && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
              <span className="h-8 px-2.5 flex items-center font-bold text-white bg-white/15 rounded-lg border-l-2" style={{ borderColor: selectedLeaf.color }}>
                {selectedLeaf.name}
              </span>
            </>
          )}
        </div>

        {(navStack.length > 0 || selectedLeaf) && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="border-neutral-700 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 h-8 text-xs font-medium gap-1.5 rounded-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Button>
        )}
      </div>

      {/* Main Emotion Visualization Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SVG Constellation Container */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-black/90 rounded-3xl p-4 sm:p-6 border border-neutral-800 shadow-2xl relative overflow-hidden min-h-[500px] sm:min-h-[600px]">
          
          {/* Subtle Ambient Radial Glow */}
          <div 
            className="absolute inset-0 pointer-events-none transition-colors duration-700 opacity-25 blur-3xl"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${activeGlow}, transparent 70%)`
            }}
          />

          <div className="w-full max-w-[620px] aspect-square relative">
            <svg
              viewBox="0 0 900 900"
              className="w-full h-full filter drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] overflow-visible"
            >
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                
                <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={activeColor} stopOpacity="1" />
                  <stop offset="100%" stopColor={activeColor} stopOpacity="0.75" />
                </radialGradient>
              </defs>

              {/* Connecting Geometric Lines to Nodes */}
              {nodePositions.map((pos) => {
                const isHovered = hoveredNode === pos.id;
                const isCurrentLeaf = selectedLeaf?.id === pos.id;

                return (
                  <g key={`line-${pos.id}`}>
                    <line
                      x1="450"
                      y1="450"
                      x2={pos.x}
                      y2={pos.y}
                      stroke={pos.color}
                      strokeWidth={isHovered || isCurrentLeaf ? "3.5" : "1.8"}
                      strokeDasharray={isHovered ? "6,4" : "none"}
                      strokeOpacity={isHovered || isCurrentLeaf ? 0.9 : 0.4}
                      className="transition-all duration-300"
                    />
                    {/* Animated Pulse Particle on cord */}
                    {(isHovered || isCurrentLeaf) && (
                      <circle
                        r="4.5"
                        fill="#ffffff"
                        filter="url(#glow)"
                      >
                        <animate
                          attributeName="cx"
                          from="450"
                          to={pos.x}
                          dur="1.2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="cy"
                          from="450"
                          to={pos.y}
                          dur="1.2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* Central Geometric Shape (The Heart / Core Emotion) */}
              <g 
                className="cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => {
                  if (currentParent) setSelectedLeaf(currentParent);
                }}
              >
                <polygon
                  points={centerShapePoints}
                  fill="url(#centerGradient)"
                  filter="url(#glow)"
                  className="transition-all duration-500 ease-out"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeOpacity="0.7"
                />

                <text
                  x="450"
                  y="445"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#ffffff"
                  fontSize={currentParent ? "28" : "24"}
                  fontWeight="bold"
                  letterSpacing="1px"
                  className="pointer-events-none select-none font-sans drop-shadow-md"
                >
                  {currentParent ? currentParent.name.toUpperCase() : "HOW ARE YOU"}
                </text>
                <text
                  x="450"
                  y="475"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="rgba(255,255,255,0.8)"
                  fontSize="14"
                  fontWeight="500"
                  letterSpacing="2px"
                  className="pointer-events-none select-none font-sans"
                >
                  {currentParent ? "CLICK OR DRILL DOWN" : "FEELING RIGHT NOW?"}
                </text>
              </g>

              {/* Orbital Emotion Nodes */}
              {nodePositions.map((node) => {
                const isHovered = hoveredNode === node.id;
                const isLeafSelected = selectedLeaf?.id === node.id;
                const hasChildren = Boolean(node.subEmotions && node.subEmotions.length > 0);

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer transition-transform duration-300"
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => handleNodeClick(node)}
                    transform={`translate(${node.x}, ${node.y}) scale(${isHovered ? 1.12 : isLeafSelected ? 1.08 : 1}) translate(${-node.x}, ${-node.y})`}
                  >
                    {/* Pulsing ring if selected */}
                    {isLeafSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.r + 14}
                        fill="none"
                        stroke={node.color}
                        strokeWidth="3"
                        strokeDasharray="5,5"
                        className="animate-spin"
                        style={{ transformOrigin: `${node.x}px ${node.y}px`, animationDuration: "8s" }}
                      />
                    )}

                    {/* Main Node Circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.r}
                      fill={node.color}
                      stroke="#ffffff"
                      strokeWidth={isHovered || isLeafSelected ? "3.5" : "1.5"}
                      strokeOpacity={isHovered ? 1 : 0.6}
                      filter={isHovered ? "url(#glow)" : undefined}
                      className="transition-all duration-300"
                    />

                    {/* Node Text Label */}
                    <text
                      x={node.x}
                      y={hasChildren ? node.y - 6 : node.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#ffffff"
                      fontSize={node.name.length > 12 ? "16" : "18"}
                      fontWeight="bold"
                      className="pointer-events-none select-none drop-shadow-sm font-sans"
                    >
                      {node.name}
                    </text>

                    {/* Subtext indicator if node has sub-emotions */}
                    {hasChildren && (
                      <text
                        x={node.x}
                        y={node.y + 16}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="rgba(255,255,255,0.8)"
                        fontSize="11"
                        fontWeight="600"
                        className="pointer-events-none select-none uppercase tracking-wider"
                      >
                        Explore ›
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="text-center mt-4 text-xs text-neutral-400">
            {navStack.length === 0
              ? "Tap any orbit to explore deeper emotional nuances and physiological signals."
              : "Select a specific feeling to uncover coping insights and talk with your AI buddy."}
          </div>
        </div>

        {/* Dynamic Detail & Action Panel */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <Card className="border-neutral-800 bg-neutral-900/90 backdrop-blur-xl shadow-xl overflow-hidden">
            <CardContent className="p-6">
              {activeFocusEmotion ? (
                <div className="space-y-5">
                  {/* Emotion Title & Badge */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: activeFocusEmotion.color }}
                        />
                        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                          {activeFocusEmotion.category.toUpperCase()} EMOTION
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white tracking-tight">
                        {activeFocusEmotion.name}
                      </h3>
                    </div>

                    <div className="px-3 py-1 rounded-full text-xs font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700">
                      Companion: {activeFocusEmotion.recommendedCompanion.toUpperCase()}
                    </div>
                  </div>

                  {/* Definition / Psychology */}
                  <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 text-sm text-neutral-300 leading-relaxed">
                    <div className="flex items-center gap-1.5 text-neutral-200 font-semibold mb-1 text-xs uppercase tracking-wide">
                      <Info className="w-3.5 h-3.5 text-indigo-400" />
                      Psychological Meaning
                    </div>
                    {activeFocusEmotion.definition}
                  </div>

                  {/* Somatic / Body Sensation */}
                  <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 text-sm text-neutral-300">
                    <div className="flex items-center gap-1.5 text-neutral-200 font-semibold mb-1 text-xs uppercase tracking-wide">
                      <Flame className="w-3.5 h-3.5 text-rose-400" />
                      Body Sensation
                    </div>
                    {activeFocusEmotion.bodySensation}
                  </div>

                  {/* Coping / Self-regulation advice */}
                  <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 text-sm text-neutral-300">
                    <div className="flex items-center gap-1.5 text-neutral-200 font-semibold mb-1 text-xs uppercase tracking-wide">
                      <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                      Immediate Action / Grounding
                    </div>
                    {activeFocusEmotion.copingAdvice}
                  </div>

                  {/* Intensity Slider */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center text-xs font-medium">
                      <span className="text-neutral-400 flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-neutral-300" />
                        Intensity Scale
                      </span>
                      <span className="text-white font-bold bg-neutral-800 px-2 py-0.5 rounded text-xs">
                        {intensity}%
                      </span>
                    </div>
                    <Slider
                      value={[intensity]}
                      onValueChange={(val) => setIntensity(val[0])}
                      max={100}
                      min={10}
                      step={5}
                      className="cursor-pointer py-1"
                    />
                  </div>

                  {/* Custom Note / Trigger input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-400">
                      What triggered this feeling? (Optional)
                    </label>
                    <Textarea
                      placeholder="e.g. Preparing for exams, conflict with a friend, quiet reflective evening..."
                      value={customNote}
                      onChange={(e) => setCustomNote(e.target.value)}
                      rows={2}
                      className="bg-neutral-950 border-neutral-800 text-sm text-white placeholder:text-neutral-600 resize-none focus:border-indigo-500 rounded-xl"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <Button
                      onClick={handleChatWithCompanion}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-5 rounded-xl shadow-lg shadow-indigo-500/20 gap-2 text-xs sm:text-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Talk to {activeFocusEmotion.recommendedCompanion.toUpperCase()}
                    </Button>

                    <Button
                      onClick={handleSaveMood}
                      variant="outline"
                      className="w-full border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-5 rounded-xl gap-2 text-xs sm:text-sm"
                    >
                      <BookHeart className="w-4 h-4 text-rose-400" />
                      Log in Journal
                    </Button>
                  </div>
                </div>
              ) : (
                /* Empty state / instructions */
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 text-neutral-400">
                  <div className="w-16 h-16 rounded-2xl bg-neutral-800/80 flex items-center justify-center text-neutral-300 shadow-inner">
                    <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">Emotion Constellation</h4>
                    <p className="text-xs sm:text-sm text-neutral-400 max-w-[280px]">
                      Select any emotion node in the constellation map to examine its psychological core, bodily cues, and open guided support.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
