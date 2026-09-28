"use client";

import { useState, useRef, useEffect } from "react";
import { Palette, PenTool, Type, Save, Download, Trash2, Circle, Flower2, Square, Minus, Triangle, Undo, Redo, Paintbrush, PaintBucket, Sparkles, RotateCcw, Info, Undo2, Redo2, Eraser, Check, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

type DrawingTool = 'pen' | 'rectangle' | 'circle' | 'line' | 'triangle';

interface Point {
  x: number;
  y: number;
}

export function CreativeZone() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chakraCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [writingText, setWritingText] = useState("");
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedChakra, setSelectedChakra] = useState(0);
  const [chakraColors, setChakraColors] = useState<Record<string, string>>({});
  const [chakraTool, setChakraTool] = useState<'fill' | 'brush' | 'eraser'>('fill');
  const [chakraBrushSize, setChakraBrushSize] = useState([12]);
  const [isChakraDrawing, setIsChakraDrawing] = useState(false);
  const [chakraUndoStack, setChakraUndoStack] = useState<ImageData[]>([]);
  const [chakraRedoStack, setChakraRedoStack] = useState<ImageData[]>([]);
  const [chakraColor, setChakraColor] = useState("#EF4444");
  const [currentTool, setCurrentTool] = useState<DrawingTool>('pen');
  const [brushSize, setBrushSize] = useState([2]);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [tempCanvas, setTempCanvas] = useState<ImageData | null>(null);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);

  // Save state for undo functionality
  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack(prev => [...prev.slice(-19), imageData]); // Keep last 20 states
    setRedoStack([]); // Clear redo stack when new action is performed
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Save current state to redo stack
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setRedoStack(prev => [...prev, currentState]);
    
    // Restore previous state
    const previousState = undoStack[undoStack.length - 1];
    ctx.putImageData(previousState, 0, 0);
    
    // Remove from undo stack
    setUndoStack(prev => prev.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Save current state to undo stack
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack(prev => [...prev, currentState]);
    
    // Restore next state
    const nextState = redoStack[redoStack.length - 1];
    ctx.putImageData(nextState, 0, 0);
    
    // Remove from redo stack
    setRedoStack(prev => prev.slice(0, -1));
  };

  const colors = [
    "#000000", "#FF0000", "#00FF00", "#0000FF", 
    "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500",
    "#800080", "#008000", "#FFC0CB", "#A52A2A"
  ];

  // Chakra definitions with traditional colors and rich sacred diagrams
  const chakras = [
    {
      name: "Root Chakra",
      sanskrit: "Muladhara",
      location: "Base of Spine",
      element: "Earth",
      mantra: "LAM",
      description: "Grounding, physical stability & inner security",
      affirmation: "I am safe, anchored, and deeply rooted in calm confidence.",
      traditionalColor: "#EF4444",
      accentBg: "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300"
    },
    {
      name: "Sacral Chakra", 
      sanskrit: "Svadhisthana",
      location: "Lower Abdomen",
      element: "Water",
      mantra: "VAM",
      description: "Creativity, emotional flow, joy & passion",
      affirmation: "I flow gracefully with creativity, emotional joy, and vitality.",
      traditionalColor: "#F97316",
      accentBg: "bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-300"
    },
    {
      name: "Solar Plexus",
      sanskrit: "Manipura",
      location: "Navel / Upper Abdomen",
      element: "Fire",
      mantra: "RAM",
      description: "Personal power, courage, motivation & clarity",
      affirmation: "I am strong, courageous, and capable of realizing my goals.",
      traditionalColor: "#EAB308",
      accentBg: "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300"
    },
    {
      name: "Heart Chakra",
      sanskrit: "Anahata",
      location: "Center of Chest",
      element: "Air",
      mantra: "YAM",
      description: "Unconditional love, compassion & emotional balance",
      affirmation: "My heart is open to giving and receiving boundless love.",
      traditionalColor: "#10B981",
      accentBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
    },
    {
      name: "Throat Chakra",
      sanskrit: "Vishuddha",
      location: "Throat & Neck",
      element: "Space / Ether",
      mantra: "HAM",
      description: "Truthful voice, self-expression & active listening",
      affirmation: "I speak my authentic truth with clarity, kindness, and confidence.",
      traditionalColor: "#0EA5E9",
      accentBg: "bg-sky-500/10 border-sky-500/30 text-sky-700 dark:text-sky-300"
    },
    {
      name: "Third Eye",
      sanskrit: "Ajna",
      location: "Between the Brows",
      element: "Light",
      mantra: "OM",
      description: "Deep intuition, inner guidance & imaginative vision",
      affirmation: "I trust my intuition and view life through clarity and wisdom.",
      traditionalColor: "#6366F1",
      accentBg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-700 dark:text-indigo-300"
    },
    {
      name: "Crown Chakra",
      sanskrit: "Sahasrara",
      location: "Crown of Head",
      element: "Cosmic Consciousness",
      mantra: "AUM",
      description: "Higher awareness, transcendence & peaceful oneness",
      affirmation: "I am peaceful, serene, and connected to the universal source.",
      traditionalColor: "#A855F7",
      accentBg: "bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300"
    },
    {
      name: "7-Chakra Harmony",
      sanskrit: "Kundalini Alignment",
      location: "Full Body Energy Channel",
      element: "All Elements",
      mantra: "SO HUM",
      description: "Meditative human silhouette with all 7 energy centers",
      affirmation: "My entire mind, body, and spirit are in radiant harmony.",
      traditionalColor: "#EC4899",
      accentBg: "bg-pink-500/10 border-pink-500/30 text-pink-700 dark:text-pink-300"
    }
  ];

  // Initialize canvas when component mounts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set default canvas properties
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.imageSmoothingEnabled = true;
        
        // Save initial state
        setTimeout(() => {
          const initialState = ctx.getImageData(0, 0, canvas.width, canvas.height);
          setUndoStack([initialState]);
        }, 100);
      }
    }
    
    // Initialize chakra canvas
    const chakraCanvas = chakraCanvasRef.current;
    if (chakraCanvas) {
      drawChakraOutline(chakraCanvas, selectedChakra);
    }
  }, []);

  // Update chakra canvas when selectedChakra changes
  useEffect(() => {
    const canvas = chakraCanvasRef.current;
    if (canvas) {
      drawChakraOutline(canvas, selectedChakra);
    }
  }, [selectedChakra]);

  // Get accurate canvas coordinates
  const getCanvasCoordinates = (canvas: HTMLCanvasElement, e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const point = getCanvasCoordinates(canvas, e);
    setStartPoint(point);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Save canvas state for shape drawing
    if (currentTool !== 'pen') {
      setTempCanvas(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }
    
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    ctx.lineWidth = brushSize[0];
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (currentTool === 'pen') {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const currentPoint = getCanvasCoordinates(canvas, e);
    
    if (currentTool === 'pen') {
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.stroke();
    } else if (startPoint && tempCanvas) {
      // Clear canvas and redraw background
      ctx.putImageData(tempCanvas, 0, 0);
      
      // Draw preview shape
      drawShape(ctx, startPoint, currentPoint, currentTool);
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      saveCanvasState(); // Save state after drawing
    }
    setIsDrawing(false);
    setStartPoint(null);
    setTempCanvas(null);
  };

  const drawShape = (ctx: CanvasRenderingContext2D, start: Point, end: Point, tool: DrawingTool) => {
    ctx.beginPath();
    
    switch (tool) {
      case 'rectangle':
        const width = end.x - start.x;
        const height = end.y - start.y;
        ctx.strokeRect(start.x, start.y, width, height);
        break;
        
      case 'circle':
        const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
        
      case 'line':
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        break;
        
      case 'triangle':
        const centerX = (start.x + end.x) / 2;
        ctx.moveTo(centerX, start.y);
        ctx.lineTo(start.x, end.y);
        ctx.lineTo(end.x, end.y);
        ctx.closePath();
        ctx.stroke();
        break;
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Clear and set white background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    console.log('Canvas cleared');
  };

  const saveCreation = () => {
    console.log('Saving creation...', { title, writingText });
    // TODO: Save to backend
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = title || 'my-drawing.png';
    link.href = canvas.toDataURL();
    link.click();
    console.log('Downloaded drawing');
  };

  // Chakra Undo/Redo Management
  const saveChakraState = () => {
    const canvas = chakraCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setChakraUndoStack(prev => [...prev.slice(-19), state]);
    setChakraRedoStack([]);
  };

  const undoChakra = () => {
    if (chakraUndoStack.length === 0) return;
    const canvas = chakraCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setChakraRedoStack(prev => [...prev, current]);

    const prev = chakraUndoStack[chakraUndoStack.length - 1];
    ctx.putImageData(prev, 0, 0);
    setChakraUndoStack(prevList => prevList.slice(0, -1));
  };

  const redoChakra = () => {
    if (chakraRedoStack.length === 0) return;
    const canvas = chakraCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setChakraUndoStack(prev => [...prev, current]);

    const next = chakraRedoStack[chakraRedoStack.length - 1];
    ctx.putImageData(next, 0, 0);
    setChakraRedoStack(prevList => prevList.slice(0, -1));
  };

  // Helper to draw petal
  const drawPetal = (ctx: CanvasRenderingContext2D, cx: number, cy: number, length: number, width: number, angle: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(width, length * 0.45, 0, length);
    ctx.quadraticCurveTo(-width, length * 0.45, 0, 0);
    ctx.stroke();
    ctx.restore();
  };

  // High-Resolution Solid Chakra Outline Diagrams (560x560 canvas)
  const drawChakraOutline = (canvas: HTMLCanvasElement, chakraIndex: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear and fill with pristine white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // High-contrast, clean coloring-book outline styling
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    
    switch (chakraIndex) {
      case 0: { // Root (Muladhara) - 4 Petals, Earth Square, Inverted Triangle, Center Core
        // Outer lotus petals (4 directions)
        for (let i = 0; i < 4; i++) {
          drawPetal(ctx, cx, cy, 215, 80, (i * Math.PI) / 2);
        }
        // Outer concentric rings
        ctx.beginPath();
        ctx.arc(cx, cy, 145, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, 130, 0, Math.PI * 2);
        ctx.stroke();

        // Inner Earth Square
        const sq = 85;
        ctx.beginPath();
        ctx.rect(cx - sq, cy - sq, sq * 2, sq * 2);
        ctx.stroke();

        // Inverted Triangle inside square
        ctx.beginPath();
        ctx.moveTo(cx - 65, cy - 45);
        ctx.lineTo(cx + 65, cy - 45);
        ctx.lineTo(cx, cy + 65);
        ctx.closePath();
        ctx.stroke();

        // Central seed circle
        ctx.beginPath();
        ctx.arc(cx, cy, 28, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }

      case 1: { // Sacral (Svadhisthana) - 6 Petals, Concentric Circles & Crescent Moon
        // 6 Lotus Petals
        for (let i = 0; i < 6; i++) {
          drawPetal(ctx, cx, cy, 210, 68, (i * Math.PI) / 3);
        }
        // Concentric Rings
        ctx.beginPath();
        ctx.arc(cx, cy, 140, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, 125, 0, Math.PI * 2);
        ctx.stroke();

        // Crescent Moon in lower circle
        ctx.beginPath();
        ctx.arc(cx, cy, 95, 0, Math.PI, false);
        ctx.arc(cx, cy - 25, 82, Math.PI, 0, true);
        ctx.closePath();
        ctx.stroke();

        // Inner core circle
        ctx.beginPath();
        ctx.arc(cx, cy, 38, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }

      case 2: { // Solar Plexus (Manipura) - 10 Petals & Radiant Fire Triangle
        // 10 Lotus Petals
        for (let i = 0; i < 10; i++) {
          drawPetal(ctx, cx, cy, 215, 46, (i * Math.PI) / 5);
        }
        // Ring
        ctx.beginPath();
        ctx.arc(cx, cy, 145, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, 130, 0, Math.PI * 2);
        ctx.stroke();

        // Downward Inverted Fire Triangle
        ctx.beginPath();
        ctx.moveTo(cx - 95, cy - 55);
        ctx.lineTo(cx + 95, cy - 55);
        ctx.lineTo(cx, cy + 100);
        ctx.closePath();
        ctx.stroke();

        // Inner Triangle (nested for kids coloring)
        ctx.beginPath();
        ctx.moveTo(cx - 50, cy - 30);
        ctx.lineTo(cx + 50, cy - 30);
        ctx.lineTo(cx, cy + 50);
        ctx.closePath();
        ctx.stroke();

        // Central sun spark
        ctx.beginPath();
        ctx.arc(cx, cy - 5, 22, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }

      case 3: { // Heart (Anahata) - 12 Petals & Sacred Shatkona (6-Pointed Star)
        // 12 Lotus Petals
        for (let i = 0; i < 12; i++) {
          drawPetal(ctx, cx, cy, 215, 38, (i * Math.PI) / 6);
        }
        // Outer Rings
        ctx.beginPath();
        ctx.arc(cx, cy, 150, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, 135, 0, Math.PI * 2);
        ctx.stroke();

        // Shatkona: Upward Equilateral Triangle
        const rStar = 100;
        ctx.beginPath();
        ctx.moveTo(cx, cy - rStar);
        ctx.lineTo(cx + rStar * Math.cos(Math.PI / 6), cy + rStar * Math.sin(Math.PI / 6));
        ctx.lineTo(cx - rStar * Math.cos(Math.PI / 6), cy + rStar * Math.sin(Math.PI / 6));
        ctx.closePath();
        ctx.stroke();

        // Shatkona: Downward Equilateral Triangle
        ctx.beginPath();
        ctx.moveTo(cx, cy + rStar);
        ctx.lineTo(cx + rStar * Math.cos(Math.PI / 6), cy - rStar * Math.sin(Math.PI / 6));
        ctx.lineTo(cx - rStar * Math.cos(Math.PI / 6), cy - rStar * Math.sin(Math.PI / 6));
        ctx.closePath();
        ctx.stroke();

        // Center sacred circle
        ctx.beginPath();
        ctx.arc(cx, cy, 32, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }

      case 4: { // Throat (Vishuddha) - 16 Petals & Full Moon Inverted Triangle
        // 16 Petals
        for (let i = 0; i < 16; i++) {
          drawPetal(ctx, cx, cy, 215, 28, (i * Math.PI) / 8);
        }
        // Concentric Rings
        ctx.beginPath();
        ctx.arc(cx, cy, 145, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, 130, 0, Math.PI * 2);
        ctx.stroke();

        // Inverted Triangle
        ctx.beginPath();
        ctx.moveTo(cx - 85, cy - 50);
        ctx.lineTo(cx + 85, cy - 50);
        ctx.lineTo(cx, cy + 90);
        ctx.closePath();
        ctx.stroke();

        // Full Moon Sacred Circle
        ctx.beginPath();
        ctx.arc(cx, cy + 5, 52, 0, Math.PI * 2);
        ctx.stroke();

        // Inner Sound Core
        ctx.beginPath();
        ctx.arc(cx, cy + 5, 26, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }

      case 5: { // Third Eye (Ajna) - 2 Majestic Winged Petals & Eye of Insight
        // Left Wing Petal
        ctx.beginPath();
        ctx.moveTo(cx, cy - 110);
        ctx.bezierCurveTo(cx - 180, cy - 140, cx - 240, cy - 40, cx - 240, cy);
        ctx.bezierCurveTo(cx - 240, cy + 40, cx - 180, cy + 140, cx, cy + 110);
        ctx.stroke();

        // Inner Wing Rib (left)
        ctx.beginPath();
        ctx.moveTo(cx - 115, cy - 70);
        ctx.quadraticCurveTo(cx - 180, cy, cx - 115, cy + 70);
        ctx.stroke();

        // Right Wing Petal
        ctx.beginPath();
        ctx.moveTo(cx, cy - 110);
        ctx.bezierCurveTo(cx + 180, cy - 140, cx + 240, cy - 40, cx + 240, cy);
        ctx.bezierCurveTo(cx + 240, cy + 40, cx + 180, cy + 140, cx, cy + 110);
        ctx.stroke();

        // Inner Wing Rib (right)
        ctx.beginPath();
        ctx.moveTo(cx + 115, cy - 70);
        ctx.quadraticCurveTo(cx + 180, cy, cx + 115, cy + 70);
        ctx.stroke();

        // Central Circle Halo
        ctx.beginPath();
        ctx.arc(cx, cy, 115, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, 100, 0, Math.PI * 2);
        ctx.stroke();

        // Inverted Golden Triangle
        ctx.beginPath();
        ctx.moveTo(cx - 70, cy - 40);
        ctx.lineTo(cx + 70, cy - 40);
        ctx.lineTo(cx, cy + 75);
        ctx.closePath();
        ctx.stroke();

        // The Eye of Insight
        ctx.beginPath();
        ctx.moveTo(cx - 50, cy - 5);
        ctx.quadraticCurveTo(cx, cy - 35, cx + 50, cy - 5);
        ctx.quadraticCurveTo(cx, cy + 25, cx - 50, cy - 5);
        ctx.stroke();

        // Iris and Pupil
        ctx.beginPath();
        ctx.arc(cx, cy - 5, 18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy - 5, 8, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }

      case 6: { // Crown (Sahasrara) - Thousand Petal Mandala
        // Outer Ring of 24 Petals
        for (let i = 0; i < 24; i++) {
          drawPetal(ctx, cx, cy, 225, 20, (i * Math.PI) / 12);
        }
        // Middle Ring of 12 Petals
        for (let i = 0; i < 12; i++) {
          drawPetal(ctx, cx, cy, 175, 30, (i * Math.PI) / 6);
        }
        // Inner Ring of 8 Petals
        for (let i = 0; i < 8; i++) {
          drawPetal(ctx, cx, cy, 125, 36, (i * Math.PI) / 4);
        }
        // Concentric Rings
        ctx.beginPath();
        ctx.arc(cx, cy, 80, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, 55, 0, Math.PI * 2);
        ctx.stroke();

        // 8-Pointed Star in Center
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const r1 = 45;
          const r2 = 22;
          const a1 = (i * Math.PI) / 4;
          const a2 = a1 + Math.PI / 8;
          if (i === 0) ctx.moveTo(cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1);
          else ctx.lineTo(cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1);
          ctx.lineTo(cx + Math.cos(a2) * r2, cy + Math.sin(a2) * r2);
        }
        ctx.closePath();
        ctx.stroke();

        // Center Cosmic Eye
        ctx.beginPath();
        ctx.arc(cx, cy, 12, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }

      case 7: { // Full Body Silhouette with 7 Chakras Alignment
        // Aura Outer Circles
        ctx.beginPath();
        ctx.arc(cx, cy - 25, 235, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy - 25, 215, 0, Math.PI * 2);
        ctx.stroke();

        // Seated Meditator Silhouette
        // Head
        ctx.beginPath();
        ctx.arc(cx, 130, 48, 0, Math.PI * 2);
        ctx.stroke();

        // Neck & Shoulders & Torso
        ctx.beginPath();
        ctx.moveTo(cx - 15, 176);
        ctx.lineTo(cx - 85, 210); // Left shoulder
        ctx.lineTo(cx - 120, 310); // Left arm
        ctx.lineTo(cx - 170, 430); // Left knee
        ctx.quadraticCurveTo(cx - 140, 475, cx, 475); // Left leg to base
        ctx.quadraticCurveTo(cx + 140, 475, cx + 170, 430); // Base to right knee
        ctx.lineTo(cx + 120, 310); // Right arm
        ctx.lineTo(cx + 85, 210); // Right shoulder
        ctx.lineTo(cx + 15, 176); // Right neck
        ctx.closePath();
        ctx.stroke();

        // Spinal Column Line (Sushumna)
        ctx.beginPath();
        ctx.moveTo(cx, 90);
        ctx.lineTo(cx, 465);
        ctx.stroke();

        // The 7 Energy Nodes (Double ringed for coloring fun!)
        const nodes = [
          { y: 85, r: 24, label: "Crown" },
          { y: 135, r: 22, label: "Third Eye" },
          { y: 195, r: 22, label: "Throat" },
          { y: 265, r: 24, label: "Heart" },
          { y: 330, r: 22, label: "Solar" },
          { y: 395, r: 22, label: "Sacral" },
          { y: 450, r: 24, label: "Root" }
        ];

        nodes.forEach(n => {
          ctx.beginPath();
          ctx.arc(cx, n.y, n.r, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(cx, n.y, n.r - 8, 0, Math.PI * 2);
          ctx.stroke();
        });
        break;
      }
    }
  };

  // BFS Flood-Fill Algorithm (Tap-to-fill like children's coloring books!)
  const performFloodFill = (startX: number, startY: number, fillHex: string) => {
    const canvas = chakraCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    saveChakraState();

    const width = canvas.width;
    const height = canvas.height;
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    // Convert hex to rgb
    const hex = fillHex.replace('#', '');
    const targetR = parseInt(hex.substring(0, 2), 16);
    const targetG = parseInt(hex.substring(2, 4), 16);
    const targetB = parseInt(hex.substring(4, 6), 16);

    const startPos = (startY * width + startX) * 4;
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];
    const startA = data[startPos + 3];

    // Check if clicked directly on dark border (outline boundary)
    if (startR < 75 && startG < 75 && startB < 75 && startA > 200) {
      return; // Border
    }

    // Check if already same color
    if (
      Math.abs(startR - targetR) < 12 &&
      Math.abs(startG - targetG) < 12 &&
      Math.abs(startB - targetB) < 12
    ) {
      return;
    }

    const queue: number[] = [startX, startY];
    const visited = new Uint8Array(width * height);
    visited[startY * width + startX] = 1;

    while (queue.length > 0) {
      const cy = queue.pop()!;
      const cx = queue.pop()!;
      const idx = (cy * width + cx) * 4;

      data[idx] = targetR;
      data[idx + 1] = targetG;
      data[idx + 2] = targetB;
      data[idx + 3] = 255;

      const neighbors = [
        [cx + 1, cy],
        [cx - 1, cy],
        [cx, cy + 1],
        [cx, cy - 1]
      ];

      for (let i = 0; i < 4; i++) {
        const nx = neighbors[i][0];
        const ny = neighbors[i][1];
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const pPos = ny * width + nx;
          if (!visited[pPos]) {
            visited[pPos] = 1;
            const nIdx = pPos * 4;
            const nr = data[nIdx];
            const ng = data[nIdx + 1];
            const nb = data[nIdx + 2];
            const na = data[nIdx + 3];

            // Wall check: stop at black outlines
            const isBorder = (nr < 75 && ng < 75 && nb < 75 && na > 180);
            if (!isBorder) {
              const diff = Math.abs(nr - startR) + Math.abs(ng - startG) + Math.abs(nb - startB);
              if (diff < 75) {
                queue.push(nx, ny);
              }
            }
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  };

  // Freehand Crayon / Brush Drawing on Chakra Canvas
  const handleChakraMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = chakraCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    if (chakraTool === 'fill') {
      performFloodFill(x, y, chakraColor);
    } else {
      saveChakraState();
      setIsChakraDrawing(true);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = chakraTool === 'eraser' ? '#FFFFFF' : chakraColor;
      ctx.lineWidth = chakraBrushSize[0];
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  };

  const handleChakraMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isChakraDrawing || chakraTool === 'fill') return;
    const canvas = chakraCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleChakraMouseUp = () => {
    if (isChakraDrawing) {
      setIsChakraDrawing(false);
      // Redraw outline over strokes to keep boundaries neat!
      const canvas = chakraCanvasRef.current;
      if (canvas) {
        // Redraw outline over user strokes so children's coloring stays inside/crisp
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        drawChakraOutline(tempCanvas, selectedChakra);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.globalCompositeOperation = 'source-over';
          // Draw outlines only by using darken or direct composite
          ctx.drawImage(tempCanvas, 0, 0);
        }
      }
    }
  };

  // Auto-Color Chakra with Radiant Traditional Harmony
  const autoColorChakra = (index: number) => {
    const canvas = chakraCanvasRef.current;
    if (!canvas) return;
    saveChakraState();

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    
    // Reset outline
    drawChakraOutline(canvas, index);

    // Fill points based on traditional color palette
    if (index === 0) { // Root
      performFloodFill(cx, cy, "#DC2626"); // Center red
      performFloodFill(cx, 100, "#EF4444"); // Top petal
      performFloodFill(cx, 460, "#EF4444"); // Bottom petal
      performFloodFill(100, cy, "#B91C1C"); // Left petal
      performFloodFill(460, cy, "#B91C1C"); // Right petal
      performFloodFill(cx - 70, cy - 70, "#FEF08A"); // Square corners yellow
    } else if (index === 1) { // Sacral
      performFloodFill(cx, cy, "#F97316"); // Center orange
      performFloodFill(cx, cy + 60, "#BAE6FD"); // Crescent light blue
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        performFloodFill(Math.floor(cx + Math.cos(a) * 170), Math.floor(cy + Math.sin(a) * 170), i % 2 === 0 ? "#FB923C" : "#EA580C");
      }
    } else if (index === 2) { // Solar
      performFloodFill(cx, cy, "#EAB308"); // Yellow center
      performFloodFill(cx, cy - 40, "#F59E0B"); // Inner triangle
      for (let i = 0; i < 10; i++) {
        const a = (i * Math.PI) / 5;
        performFloodFill(Math.floor(cx + Math.cos(a) * 170), Math.floor(cy + Math.sin(a) * 170), i % 2 === 0 ? "#FDE047" : "#F59E0B");
      }
    } else if (index === 3) { // Heart
      performFloodFill(cx, cy, "#10B981"); // Center emerald
      performFloodFill(cx, cy - 70, "#6EE7B7"); // Star top
      performFloodFill(cx, cy + 70, "#6EE7B7"); // Star bottom
      for (let i = 0; i < 12; i++) {
        const a = (i * Math.PI) / 6;
        performFloodFill(Math.floor(cx + Math.cos(a) * 170), Math.floor(cy + Math.sin(a) * 170), i % 2 === 0 ? "#34D399" : "#059669");
      }
    } else if (index === 4) { // Throat
      performFloodFill(cx, cy + 5, "#38BDF8"); // Moon cyan
      performFloodFill(cx, cy - 35, "#0284C7"); // Triangle deep blue
      for (let i = 0; i < 16; i++) {
        const a = (i * Math.PI) / 8;
        performFloodFill(Math.floor(cx + Math.cos(a) * 170), Math.floor(cy + Math.sin(a) * 170), i % 2 === 0 ? "#7DD3FC" : "#0EA5E9");
      }
    } else if (index === 5) { // Third Eye
      performFloodFill(cx, cy - 5, "#4338CA"); // Pupil
      performFloodFill(cx - 180, cy, "#6366F1"); // Left wing
      performFloodFill(cx + 180, cy, "#6366F1"); // Right wing
      performFloodFill(cx, cy + 30, "#A5B4FC"); // Eye halo
    } else if (index === 6) { // Crown
      performFloodFill(cx, cy, "#7C3AED"); // Center
      for (let i = 0; i < 24; i++) {
        const a = (i * Math.PI) / 12;
        performFloodFill(Math.floor(cx + Math.cos(a) * 190), Math.floor(cy + Math.sin(a) * 190), i % 2 === 0 ? "#C084FC" : "#A855F7");
      }
    } else if (index === 7) { // Full Body
      performFloodFill(cx, 85, "#A855F7"); // Crown Violet
      performFloodFill(cx, 135, "#6366F1"); // Third eye Indigo
      performFloodFill(cx, 195, "#0EA5E9"); // Throat Blue
      performFloodFill(cx, 265, "#10B981"); // Heart Green
      performFloodFill(cx, 330, "#EAB308"); // Solar Yellow
      performFloodFill(cx, 395, "#F97316"); // Sacral Orange
      performFloodFill(cx, 450, "#EF4444"); // Root Red
      performFloodFill(cx - 100, 350, "#EDE9FE"); // Body soft lilac
      performFloodFill(100, 100, "#F5F3FF"); // Aura soft glow
    }
  };

  const selectChakra = (index: number) => {
    setSelectedChakra(index);
    setChakraColor(chakras[index].traditionalColor);
    setChakraUndoStack([]);
    setChakraRedoStack([]);
    const canvas = chakraCanvasRef.current;
    if (canvas) {
      drawChakraOutline(canvas, index);
    }
  };
  
  const clearChakra = () => {
    saveChakraState();
    const canvas = chakraCanvasRef.current;
    if (canvas) {
      drawChakraOutline(canvas, selectedChakra);
    }
  };
  
  const downloadChakra = () => {
    const canvas = chakraCanvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `${chakras[selectedChakra].name.toLowerCase().replace(/\s+/g, '-')}-artwork.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <Card data-testid="card-creative-zone" className="border-0 shadow-lg bg-gradient-to-br from-violet-400/10 via-purple-400/10 to-indigo-400/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-lg shadow-lg">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <span className="text-slate-800 dark:text-slate-100 font-bold">Creative Expression Space</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Give your creation a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            data-testid="input-creation-title"
          />
          
          <Tabs defaultValue="draw" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800 shadow-sm">
              <TabsTrigger value="draw" data-testid="tab-draw" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg">
                <PenTool className="w-4 h-4 mr-2" />
                Draw
              </TabsTrigger>
              <TabsTrigger value="chakras" data-testid="tab-chakras" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-400 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg">
                <Circle className="w-4 h-4 mr-2" />
                Chakras
              </TabsTrigger>
              <TabsTrigger value="write" data-testid="tab-write" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-400 data-[state=active]:to-green-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg">
                <Type className="w-4 h-4 mr-2" />
                Write
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="draw" className="space-y-4">
              <div className="space-y-4">
                {/* Drawing Tools */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Tools:</span>
                    <div className="flex gap-1">
                      {[
                        { tool: 'pen' as DrawingTool, icon: PenTool, label: 'Pen' },
                        { tool: 'rectangle' as DrawingTool, icon: Square, label: 'Rectangle' },
                        { tool: 'circle' as DrawingTool, icon: Circle, label: 'Circle' },
                        { tool: 'line' as DrawingTool, icon: Minus, label: 'Line' },
                        { tool: 'triangle' as DrawingTool, icon: Triangle, label: 'Triangle' }
                      ].map(({ tool, icon: Icon, label }) => (
                        <Button
                          key={tool}
                          variant={currentTool === tool ? "default" : "outline"}
                          size="sm"
                          className={`p-2 ${currentTool === tool ? 'bg-blue-500 text-white' : ''}`}
                          onClick={() => setCurrentTool(tool)}
                          title={label}
                        >
                          <Icon className="w-4 h-4" />
                        </Button>
                      ))}
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {currentTool.charAt(0).toUpperCase() + currentTool.slice(1)}
                    </Badge>
                  </div>
                  
                  {/* Brush Size */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Size:</span>
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xs text-muted-foreground">1</span>
                      <Slider
                        value={brushSize}
                        onValueChange={setBrushSize}
                        max={20}
                        min={1}
                        step={1}
                        className="flex-1 max-w-[200px]"
                      />
                      <span className="text-xs text-muted-foreground">20</span>
                      <Badge variant="secondary" className="min-w-[40px] text-center">
                        {brushSize[0]}px
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {/* Color Palette */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Colors:</span>
                  <div className="flex gap-1 flex-wrap">
                    {colors.map((color) => (
                      <button
                        key={color}
                        title={`Select color ${color}`}
                        aria-label={`Select color ${color}`}
                        className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                          selectedColor === color ? 'border-gray-800 shadow-lg scale-110' : 'border-border'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                        data-testid={`color-${color}`}
                      />
                    ))}
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-8 h-8 rounded-full border-2 border-border cursor-pointer"
                      title="Custom color picker"
                    />
                  </div>
                </div>
                
                {/* Canvas */}
                <div className="border-2 rounded-lg p-4 bg-card shadow-inner">
                  <div className="relative">
                    <canvas
                      ref={canvasRef}
                      width={800}
                      height={600}
                      className="border border-border rounded cursor-crosshair max-w-full h-auto block"
                      style={{ 
                        touchAction: 'none',
                        imageRendering: 'pixelated'
                      }}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        const touch = e.touches[0];
                        const mouseEvent = new MouseEvent('mousedown', {
                          clientX: touch.clientX,
                          clientY: touch.clientY
                        });
                        startDrawing(mouseEvent as any);
                      }}
                      onTouchMove={(e) => {
                        e.preventDefault();
                        const touch = e.touches[0];
                        const mouseEvent = new MouseEvent('mousemove', {
                          clientX: touch.clientX,
                          clientY: touch.clientY
                        });
                        draw(mouseEvent as any);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        stopDrawing();
                      }}
                      data-testid="canvas-drawing"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-muted-foreground">
                      {currentTool === 'pen' ? 'Click and drag to draw' : `Click and drag to draw ${currentTool}`}
                    </div>
                  </div>
                </div>
                
                {/* Canvas Controls */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={undo}
                      disabled={undoStack.length === 0}
                      size="sm"
                      title="Undo"
                    >
                      <Undo className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={redo}
                      disabled={redoStack.length === 0}
                      size="sm"
                      title="Redo"
                    >
                      <Redo className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={clearCanvas}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                      data-testid="button-clear-canvas"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear Canvas
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={downloadDrawing}
                      data-testid="button-download-drawing"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={saveCreation}
                      data-testid="button-save-creation"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="chakras" className="space-y-6">
              <div className="space-y-6">
                {/* Header Banner */}
                <div className="text-center space-y-2 max-w-xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-800 dark:text-violet-300 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    Sacred Geometry & Coloring Studio
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Chakra Mandala Coloring Book</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Tap to flood-fill sacred petals and geometric yantras with vibrant energy, or switch to crayon brush to shade freely!
                  </p>
                </div>
                
                {/* Chakra Selection Row */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select a Sacred Diagram:</span>
                    <span className="text-xs text-violet-600 dark:text-violet-400 font-semibold">{chakras[selectedChakra].sanskrit}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                    {chakras.map((chakra, index) => (
                      <button
                        key={index}
                        onClick={() => selectChakra(index)}
                        className={`p-2.5 rounded-xl border-2 text-left transition-all duration-200 flex flex-col justify-between ${
                          selectedChakra === index 
                            ? 'border-violet-500 bg-violet-50/90 dark:bg-violet-950/40 shadow-md scale-[1.02]' 
                            : 'border-border/70 bg-card hover:border-violet-300 dark:hover:border-violet-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span 
                            className="w-3 h-3 rounded-full shadow-sm flex-shrink-0" 
                            style={{ backgroundColor: chakra.traditionalColor }}
                          />
                          <span className="text-xs font-bold truncate text-slate-800 dark:text-slate-100">{chakra.name}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">{chakra.sanskrit}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chakra Info & Affirmation Card */}
                <div className={`p-4 rounded-2xl border ${chakras[selectedChakra].accentBg} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-bold uppercase bg-white/60 dark:bg-slate-900/60">
                        {chakras[selectedChakra].element} Element
                      </Badge>
                      <Badge variant="outline" className="text-xs font-bold bg-white/60 dark:bg-slate-900/60">
                        Mantra: {chakras[selectedChakra].mantra}
                      </Badge>
                      <span className="text-xs text-muted-foreground">({chakras[selectedChakra].location})</span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium italic">
                      "{chakras[selectedChakra].affirmation}"
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => autoColorChakra(selectedChakra)}
                    className="shrink-0 text-xs font-bold flex items-center gap-1.5 shadow-sm hover:scale-105 transition-all"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-violet-500" />
                    Auto-Color Aura
                  </Button>
                </div>

                {/* Coloring Controls & Tool Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-card/80 border border-border/80 rounded-2xl shadow-sm">
                  {/* Tool Selection */}
                  <div className="flex items-center gap-1 bg-stone-100 dark:bg-slate-800/80 p-1 rounded-xl">
                    <button
                      onClick={() => setChakraTool('fill')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        chakraTool === 'fill' 
                          ? 'bg-violet-600 text-white shadow-sm' 
                          : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                      }`}
                      title="Tap to flood-fill any petal, shape, or background"
                    >
                      <PaintBucket className="w-3.5 h-3.5" />
                      Bucket Fill
                    </button>
                    <button
                      onClick={() => setChakraTool('brush')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        chakraTool === 'brush' 
                          ? 'bg-violet-600 text-white shadow-sm' 
                          : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                      }`}
                      title="Color freely like crayons"
                    >
                      <Paintbrush className="w-3.5 h-3.5" />
                      Crayon Brush
                    </button>
                    <button
                      onClick={() => setChakraTool('eraser')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        chakraTool === 'eraser' 
                          ? 'bg-violet-600 text-white shadow-sm' 
                          : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                      }`}
                      title="Eraser tool"
                    >
                      <Eraser className="w-3.5 h-3.5" />
                      Eraser
                    </button>
                  </div>

                  {/* Brush Size Slider (Visible in Brush or Eraser mode) */}
                  {chakraTool !== 'fill' && (
                    <div className="flex items-center gap-2 w-40">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">Size:</span>
                      <Slider
                        value={chakraBrushSize}
                        onValueChange={setChakraBrushSize}
                        min={4}
                        max={36}
                        step={2}
                        className="w-28"
                      />
                      <span className="text-xs font-bold text-stone-600 dark:text-stone-300">{chakraBrushSize[0]}px</span>
                    </div>
                  )}

                  {/* Canvas History Controls */}
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={undoChakra}
                      disabled={chakraUndoStack.length === 0}
                      className="h-8 px-2.5 text-xs"
                      title="Undo last stroke"
                    >
                      <Undo2 className="w-3.5 h-3.5 mr-1" /> Undo
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={redoChakra}
                      disabled={chakraRedoStack.length === 0}
                      className="h-8 px-2.5 text-xs"
                      title="Redo stroke"
                    >
                      <Redo2 className="w-3.5 h-3.5 mr-1" /> Redo
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={clearChakra}
                      className="h-8 px-2.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
                    </Button>
                    <Button
                      size="sm"
                      onClick={downloadChakra}
                      className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5 mr-1" /> Download
                    </Button>
                  </div>
                </div>

                {/* Vibrant Kid-Friendly Color Palette */}
                <div className="space-y-2 p-4 bg-card/60 border border-border/70 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Coloring Color:</span>
                    <button
                      className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
                      onClick={() => setChakraColor(chakras[selectedChakra].traditionalColor)}
                    >
                      Pick Traditional {chakras[selectedChakra].name} Color
                    </button>
                  </div>

                  {/* Palette Grid */}
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      "#EF4444", "#DC2626", "#F97316", "#EA580C", 
                      "#F59E0B", "#EAB308", "#FACC15", "#84CC16", 
                      "#10B981", "#059669", "#06B6D4", "#0EA5E9", 
                      "#3B82F6", "#6366F1", "#8B5CF6", "#A855F7", 
                      "#D946EF", "#EC4899", "#F43F5E", "#FB7185",
                      "#FDE047", "#BAE6FD", "#C7D2FE", "#FFFFFF"
                    ].map((col) => (
                      <button
                        key={col}
                        onClick={() => setChakraColor(col)}
                        style={{ backgroundColor: col }}
                        className={`w-8 h-8 rounded-full border-2 transition-all transform hover:scale-125 hover:shadow-md relative ${
                          chakraColor.toLowerCase() === col.toLowerCase()
                            ? "border-black dark:border-white scale-110 shadow-lg ring-2 ring-violet-500/50"
                            : "border-black/20 dark:border-white/20"
                        }`}
                        title={col}
                      >
                        {chakraColor.toLowerCase() === col.toLowerCase() && (
                          <Check className={`w-3.5 h-3.5 mx-auto ${col === "#FFFFFF" || col === "#FDE047" || col === "#FACC15" ? "text-black" : "text-white"}`} />
                        )}
                      </button>
                    ))}

                    {/* Custom Color Input */}
                    <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-border">
                      <input
                        type="color"
                        value={chakraColor}
                        onChange={(e) => setChakraColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-border"
                        title="Pick custom color"
                      />
                      <span className="text-[11px] font-mono text-muted-foreground">{chakraColor.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {/* Big Nice Canvas */}
                <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-stone-50 to-stone-100 dark:from-slate-900 dark:to-slate-950 border-2 border-dashed border-border rounded-3xl shadow-inner">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white border-4 border-stone-800 dark:border-stone-700">
                    <canvas
                      ref={chakraCanvasRef}
                      width={560}
                      height={560}
                      className="cursor-crosshair block max-w-full w-[360px] sm:w-[480px] md:w-[540px] aspect-square touch-none"
                      onMouseDown={handleChakraMouseDown}
                      onMouseMove={handleChakraMouseMove}
                      onMouseUp={handleChakraMouseUp}
                      data-testid="canvas-chakra"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                    {chakraTool === 'fill' ? (
                      <span className="flex items-center gap-1.5">
                        <PaintBucket className="w-4 h-4 text-violet-500" />
                        Click inside any enclosed shape, petal, ring, or corner to flood-fill!
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Paintbrush className="w-4 h-4 text-violet-500" />
                        Click & drag your crayon to shade or draw inside the sacred mandala!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="write" className="space-y-4">
              <Textarea
                placeholder="Express yourself through words... Write a poem, story, or just your thoughts..."
                value={writingText}
                onChange={(e) => setWritingText(e.target.value)}
                className="min-h-[300px] resize-none"
                data-testid="textarea-writing"
              />
              <div className="text-sm text-muted-foreground">
                {writingText.length} characters
              </div>
            </TabsContent>
          </Tabs>
          
          <Button 
            onClick={saveCreation} 
            className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            disabled={!title && !writingText}
            data-testid="button-save-creation"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Creation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}