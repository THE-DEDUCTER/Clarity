"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Visitor } from "./GameState";
import { 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Lightbulb, 
  Sparkles, 
  Heart, 
  Sun, 
  CloudRain, 
  Flame, 
  Scale, 
  MessageSquare, 
  Wind, 
  Moon, 
  Star 
} from "lucide-react";

interface VisitorChoiceProps {
  visitor: Visitor;
  onChoice: (choice: 'accept' | 'reject' | 'challenge') => void;
}

export function VisitorChoice({ visitor, onChoice }: VisitorChoiceProps) {
  const [hoveredChoice, setHoveredChoice] = useState<string | null>(null);

  const getVisitorIcon = (id: string) => {
    switch (id) {
      case 'encouragement': return <Sparkles className="w-10 h-10 text-white" />;
      case 'joy': return <Sun className="w-10 h-10 text-white" />;
      case 'gratitude': return <Heart className="w-10 h-10 text-white" />;
      case 'self-doubt': return <CloudRain className="w-10 h-10 text-white" />;
      case 'anger': return <Flame className="w-10 h-10 text-white" />;
      case 'guilt': return <Scale className="w-10 h-10 text-white" />;
      case 'criticism': return <MessageSquare className="w-10 h-10 text-white" />;
      case 'worry': return <Wind className="w-10 h-10 text-white" />;
      case 'loneliness': return <Moon className="w-10 h-10 text-white" />;
      default: return <Sparkles className="w-10 h-10 text-white" />;
    }
  };

  const getChoicePreview = (choice: 'accept' | 'reject' | 'challenge') => {
    const effect = visitor.effects[choice];
    if (!effect) return null;

    return (
      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap z-10">
        <div className="flex items-center gap-2">
          <span>Health: {effect.health > 0 ? `+${effect.health}` : effect.health}</span>
          <span>Peace: {effect.peace > 0 ? `+${effect.peace}` : effect.peace}</span>
          <span>Score: {effect.score > 0 ? `+${effect.score}` : effect.score}</span>
        </div>
      </div>
    );
  };

  const getChoiceColor = (choice: 'accept' | 'reject' | 'challenge') => {
    switch (choice) {
      case 'accept':
        return 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700';
      case 'reject':
        return 'from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700';
      case 'challenge':
        return 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getChallengeInfo = () => {
    if (visitor.type !== 'complex') return null;
    
    const difficulty = visitor.effects.challenge.difficulty || 1;
    
    return (
      <div className="text-xs text-center text-blue-600 dark:text-blue-400 mt-1 flex items-center justify-center gap-1">
        <span>Difficulty:</span>
        <div className="flex items-center">
          {Array.from({ length: difficulty }).map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="border-0 shadow-xl bg-card dark:bg-gray-900">
      <CardContent className="p-6">
        {/* Visitor Information */}
        <div className="text-center mb-6">
          <div 
            className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg border-2 border-white/40"
            style={{ backgroundColor: visitor.color }}
          >
            {getVisitorIcon(visitor.id)}
          </div>
          <h3 className="text-xl font-bold mb-2">{visitor.name}</h3>
          <p className="text-muted-foreground text-sm mb-4">{visitor.description}</p>
          
          {/* Visitor type badge */}
          <Badge 
            variant="secondary"
            className={cn(
              "text-xs",
              visitor.type === 'positive' && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
              visitor.type === 'negative' && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
              visitor.type === 'complex' && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            )}
          >
            {visitor.type === 'positive' && 'Positive'}
            {visitor.type === 'negative' && 'Negative'}
            {visitor.type === 'complex' && 'Complex'}
          </Badge>
        </div>

        {/* Choice Buttons */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Accept Button */}
            <div className="relative">
              <Button
                onClick={() => onChoice('accept')}
                onMouseEnter={() => setHoveredChoice('accept')}
                onMouseLeave={() => setHoveredChoice(null)}
                className={cn(
                  "w-full h-16 text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95",
                  "bg-gradient-to-r shadow-lg",
                  getChoiceColor('accept')
                )}
              >
                <div className="flex flex-col items-center">
                  <CheckCircle className="w-6 h-6 mb-1" />
                  <span>ACCEPT</span>
                </div>
              </Button>
              {hoveredChoice === 'accept' && getChoicePreview('accept')}
            </div>

            {/* Reject Button */}
            <div className="relative">
              <Button
                onClick={() => onChoice('reject')}
                onMouseEnter={() => setHoveredChoice('reject')}
                onMouseLeave={() => setHoveredChoice(null)}
                className={cn(
                  "w-full h-16 text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95",
                  "bg-gradient-to-r shadow-lg",
                  getChoiceColor('reject')
                )}
              >
                <div className="flex flex-col items-center">
                  <XCircle className="w-6 h-6 mb-1" />
                  <span>REJECT</span>
                </div>
              </Button>
              {hoveredChoice === 'reject' && getChoicePreview('reject')}
            </div>
          </div>

          {/* Challenge Button (for complex visitors only) */}
          {visitor.type === 'complex' && (
            <div className="relative">
              <Button
                onClick={() => onChoice('challenge')}
                onMouseEnter={() => setHoveredChoice('challenge')}
                onMouseLeave={() => setHoveredChoice(null)}
                className={cn(
                  "w-full h-16 text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95",
                  "bg-gradient-to-r shadow-lg",
                  getChoiceColor('challenge')
                )}
              >
                <div className="flex flex-col items-center">
                  <HelpCircle className="w-6 h-6 mb-1" />
                  <span>CHALLENGE</span>
                </div>
              </Button>
              {hoveredChoice === 'challenge' && getChoicePreview('challenge')}
              {getChallengeInfo()}
            </div>
          )}
        </div>

        {/* Choice Descriptions */}
        <div className="mt-6 text-xs text-muted-foreground space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span><strong>Accept:</strong> Let this thought enter your mind</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <span><strong>Reject:</strong> Push this thought away</span>
          </div>
          {visitor.type === 'complex' && (
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              <span><strong>Challenge:</strong> Use mindfulness to transform this thought</span>
            </div>
          )}
        </div>

        {/* Wisdom Hint */}
        {visitor.insight && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700 dark:text-blue-300 italic">
                {visitor.insight}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}