"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Clock, Heart, Moon, Music, Wind, Timer, Star, Headphones, SkipBack, SkipForward, Shuffle, Repeat, Plus, Search, Filter, Lightbulb, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface AudioSession {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  category: "sleep" | "meditation" | "focus" | "breathing";
  difficulty: "beginner" | "intermediate" | "advanced";
  instructor?: string;
  tags: string[];
  audioUrl?: string; // In a real app, this would be actual audio files
  backgroundSound?: string;
  isPopular?: boolean;
  isFavorite?: boolean;
  plays?: number;
  coverImage?: string;
}

const AUDIO_SESSIONS: AudioSession[] = [
  // Sleep Sessions
  {
    id: "sleep-1",
    title: "Deep Sleep Meditation",
    description: "Gentle guided meditation to help you fall into deep, restful sleep",
    duration: 30,
    category: "sleep",
    difficulty: "beginner",
    instructor: "Dr. Sarah Chen",
    tags: ["insomnia", "relaxation", "bedtime"],
    backgroundSound: "rain",
    isPopular: true,
    plays: 12450,
    coverImage: "sleep"
  },
  {
    id: "sleep-2", 
    title: "Body Scan for Sleep",
    description: "Progressive muscle relaxation to release tension and prepare for sleep",
    duration: 20,
    category: "sleep",
    difficulty: "beginner",
    instructor: "Mark Williams",
    tags: ["body scan", "tension relief", "peaceful"],
    backgroundSound: "ocean",
    plays: 8920,
    coverImage: "ocean"
  },
  {
    id: "sleep-3",
    title: "Sleep Stories: Forest Journey",
    description: "Calming narrative to drift off to peaceful sleep",
    duration: 45,
    category: "sleep", 
    difficulty: "beginner",
    instructor: "Luna Hayes",
    tags: ["story", "nature", "visualization"],
    backgroundSound: "forest",
    plays: 15630,
    coverImage: "forest"
  },

  // Meditation Sessions
  {
    id: "med-1",
    title: "Mindfulness for Students",
    description: "Learn to stay present and manage academic stress through mindfulness",
    duration: 15,
    category: "meditation",
    difficulty: "beginner",
    instructor: "Prof. Michael Davis",
    tags: ["mindfulness", "stress", "academic"],
    isPopular: true,
    plays: 9870,
    coverImage: "mindfulness"
  },
  {
    id: "med-2",
    title: "Anxiety Relief Meditation",
    description: "Specific techniques to calm anxiety and racing thoughts",
    duration: 20,
    category: "meditation",
    difficulty: "intermediate",
    instructor: "Dr. Emily Rodriguez",
    tags: ["anxiety", "calm", "breathing"],
    backgroundSound: "bells",
    plays: 7450,
    coverImage: "calm"
  },
  {
    id: "med-3",
    title: "Self-Compassion Practice",
    description: "Develop kindness toward yourself during challenging times",
    duration: 25,
    category: "meditation",
    difficulty: "intermediate", 
    instructor: "Dr. Sarah Chen",
    tags: ["self-love", "compassion", "healing"],
    plays: 6780,
    coverImage: "compassion"
  },

  // Focus Sessions
  {
    id: "focus-1",
    title: "Study Focus Soundscape",
    description: "Ambient sounds designed to enhance concentration and productivity",
    duration: 60,
    category: "focus",
    difficulty: "beginner",
    tags: ["study", "concentration", "productivity"],
    backgroundSound: "white-noise",
    isPopular: true,
    plays: 23450,
    coverImage: "focus"
  },
  {
    id: "focus-2",
    title: "Pomodoro Focus Sessions",
    description: "25-minute focus blocks with guided transitions",
    duration: 25,
    category: "focus",
    difficulty: "beginner",
    instructor: "Alex Thompson",
    tags: ["pomodoro", "productivity", "time-management"],
    plays: 11200,
    coverImage: "timer"
  },
  {
    id: "focus-3",
    title: "Deep Work Ambience", 
    description: "Extended focus session for deep, uninterrupted work",
    duration: 90,
    category: "focus",
    difficulty: "advanced",
    tags: ["deep-work", "extended", "ambient"],
    backgroundSound: "cafe",
    plays: 5670,
    coverImage: "cafe"
  },

  // Breathing Sessions
  {
    id: "breath-1",
    title: "4-7-8 Breathing Technique",
    description: "Powerful breathing pattern to reduce anxiety and promote calm",
    duration: 10,
    category: "breathing",
    difficulty: "beginner",
    instructor: "Dr. James Wilson",
    tags: ["anxiety", "quick", "calming"],
    isPopular: true,
    plays: 14520,
    coverImage: "breath"
  },
  {
    id: "breath-2",
    title: "Box Breathing for Focus",
    description: "Military-grade breathing technique to enhance concentration",
    duration: 15,
    category: "breathing",
    difficulty: "intermediate",
    instructor: "Captain Sarah Miller",
    tags: ["focus", "discipline", "clarity"],
    plays: 8930,
    coverImage: "box"
  },
  {
    id: "breath-3",
    title: "Wim Hof Breathing Method",
    description: "Advanced breathing technique for energy and stress resilience",
    duration: 20,
    category: "breathing",
    difficulty: "advanced",
    instructor: "David Kumar",
    tags: ["energy", "advanced", "resilience"],
    plays: 6120,
    coverImage: "energy"
  }
];

export function AudioSessions() {
  const [activeTab, setActiveTab] = useState("all");
  const [currentSession, setCurrentSession] = useState<AudioSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'all' | 'one'>('none');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<{ resource: AudioSession, reasoning: string } | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate audio playback (in real app, this would use actual audio files)
  useEffect(() => {
    if (isPlaying && currentSession) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          const totalSeconds = (selectedDuration || currentSession.duration) * 60;
          if (newTime >= totalSeconds) {
            setIsPlaying(false);
            setCurrentTime(0);
            return 0;
          }
          return newTime;
        });
      }, 1000 / playbackSpeed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentSession, playbackSpeed, selectedDuration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPlays = (plays: number) => {
    if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`;
    if (plays >= 1000) return `${(plays / 1000).toFixed(1)}K`;
    return plays.toString();
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleSessionSelect = (session: AudioSession) => {
    setCurrentSession(session);
    setCurrentTime(0);
    setIsPlaying(true);
    setSelectedDuration(null);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFavorite = (sessionId: string) => {
    setFavorites(prev => 
      prev.includes(sessionId) 
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const handleAIRecommend = async () => {
    if (!searchTerm) return;
    setIsAIThinking(true);
    setAiRecommendation(null);
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchTerm, items: AUDIO_SESSIONS, type: 'audio session' })
      });
      if (res.ok) {
        const data = await res.json();
        const recommendedResource = AUDIO_SESSIONS.find(r => r.id === data.recommendedId);
        if (recommendedResource) {
          setAiRecommendation({ resource: recommendedResource, reasoning: data.reasoning });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAIThinking(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "sleep": return Moon;
      case "meditation": return Heart;  
      case "focus": return Music;
      case "breathing": return Wind;
      default: return Headphones;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "sleep": return "text-indigo-600 bg-indigo-100 border border-indigo-200";
      case "meditation": return "text-purple-600 bg-purple-100 border border-purple-200";
      case "focus": return "text-blue-600 bg-blue-100 border border-blue-200"; 
      case "breathing": return "text-green-600 bg-green-100 border border-green-200";
      default: return "text-muted-foreground bg-muted border border-border";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "text-green-400 bg-green-900/50";
      case "intermediate": return "text-yellow-400 bg-yellow-900/50";
      case "advanced": return "text-red-400 bg-red-900/50";
      default: return "text-gray-400 bg-gray-900/50";
    }
  };

  const filteredSessions = AUDIO_SESSIONS.filter(session => {
    const matchesCategory = activeTab === "all" || session.category === activeTab;
    const matchesSearch = searchTerm === "" || 
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.instructor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const totalDuration = selectedDuration || (currentSession?.duration ?? 0);
  const progress = totalDuration > 0 ? (currentTime / (totalDuration * 60)) * 100 : 0;

  return (
    <div className="min-h-screen text-foreground px-4 pb-6">
      {/* Clean Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-card rounded-2xl shadow-lg border border-border">
            <Headphones className="w-12 h-12 text-blue-600" />
          </div>
          <div>
            <h1 className="text-5xl font-light text-foreground mb-2">
              Wellness Audio
            </h1>
            <p className="text-muted-foreground text-lg">
              {AUDIO_SESSIONS.length} sessions • By certified instructors • Made for you
            </p>
          </div>
        </div>
        
        {/* Play All Button */}
        <div className="flex items-center gap-4">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => filteredSessions.length > 0 && handleSessionSelect(filteredSessions[0])}
          >
            <Play className="w-6 h-6 mr-2 fill-current" />
            Play All
          </Button>
          <Button 
            variant="ghost" 
            className="text-muted-foreground hover:text-foreground p-3 rounded-full hover:bg-muted"
            onClick={() => setIsShuffled(!isShuffled)}
          >
            <Shuffle className={`w-6 h-6 ${isShuffled ? 'text-blue-600' : ''}`} />
          </Button>
          <Button 
            variant="ghost" 
            className="text-muted-foreground hover:text-foreground p-3 rounded-full hover:bg-muted"
            onClick={() => setRepeatMode(repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none')}
          >
            <Repeat className={`w-6 h-6 ${repeatMode !== 'none' ? 'text-blue-600' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Search sessions or describe how you feel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAIRecommend()}
              className="pl-12 pr-32 bg-card border-border text-foreground placeholder-gray-400 rounded-full h-12 focus:ring-2 focus:ring-blue-500 shadow-sm w-full"
            />
            <div className="absolute right-1">
              <Button
                onClick={handleAIRecommend}
                disabled={isAIThinking || !searchTerm}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center gap-2 shadow-md transition-all h-10 px-4"
              >
                {isAIThinking ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Lightbulb className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Ask AI</span>
              </Button>
            </div>
          </div>
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-40 bg-card border-border text-foreground rounded-full shadow-sm h-12">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="sleep">Sleep</SelectItem>
              <SelectItem value="meditation">Meditation</SelectItem>
              <SelectItem value="focus">Focus</SelectItem>
              <SelectItem value="breathing">Breathing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* AI Recommendation Result */}
        {aiRecommendation && (
          <div className="max-w-md animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">AI Pick for You</div>
                  <h4 className="text-foreground font-semibold text-base">{aiRecommendation.resource.title}</h4>
                  <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                    "{aiRecommendation.reasoning}"
                  </p>
                  <Button 
                    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs font-medium rounded-lg px-4"
                    onClick={() => {
                      setActiveTab('all');
                      setSearchTerm(aiRecommendation.resource.title);
                      handleSessionSelect(aiRecommendation.resource);
                    }}
                  >
                    Play Session
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clean Track List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-lg border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-light text-foreground">Sessions</h2>
          <div className="text-sm text-muted-foreground">
            {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        {/* Track List Header */}
        <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center text-sm text-muted-foreground border-b border-border pb-2 mb-4">
          <div className="col-span-1 hidden sm:block">#</div>
          <div className="col-span-10 sm:col-span-6">Title</div>
          <div className="col-span-2 hidden md:block">Category</div>
          <div className="col-span-2 hidden md:block">Plays</div>
          <div className="col-span-2 sm:col-span-1 text-center">
            <Heart className="w-4 h-4 mx-auto" />
          </div>
        </div>
        
        {/* Track List */}
        <div className="space-y-1">
          {filteredSessions.map((session, index) => {
            const isCurrentSession = currentSession?.id === session.id;
            const isFavorited = favorites.includes(session.id);
            
            return (
              <div 
                key={session.id}
                className={`grid grid-cols-12 gap-2 sm:gap-4 items-center p-3 rounded-lg hover:bg-background transition-all duration-200 cursor-pointer group ${
                  isCurrentSession ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleSessionSelect(session)}
              >
                {/* Track Number / Play Button */}
                <div className="col-span-1 hidden sm:block">
                  <div className="relative">
                    <span className={`text-sm ${
                      isCurrentSession ? 'text-blue-600' : 'text-muted-foreground group-hover:hidden'
                    }`}>
                      {isCurrentSession && isPlaying ? <Volume2 className="w-3.5 h-3.5 text-blue-600 animate-pulse" /> : index + 1}
                    </span>
                    <Play className="w-4 h-4 text-blue-600 hidden group-hover:block absolute top-0 left-0" />
                  </div>
                </div>
                
                {/* Title and Artist */}
                <div className="col-span-10 sm:col-span-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    {(() => {
                      const Icon = session.category === 'sleep' ? Moon : session.category === 'meditation' ? Sparkles : session.category === 'focus' ? Music : Wind;
                      return <Icon className="w-5 h-5 text-white" />;
                    })()}
                  </div>
                  <div className="min-w-0">
                    <div className={`font-medium truncate ${
                      isCurrentSession ? 'text-blue-600' : 'text-foreground'
                    }`}>
                      {session.title}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {session.instructor || 'Various Artists'}
                    </div>
                  </div>
                </div>
                
                {/* Category */}
                <div className="col-span-2 hidden md:block">
                  <Badge className={`${getCategoryColor(session.category)} border-0 truncate max-w-full block text-center`}>
                    {session.category}
                  </Badge>
                </div>
                
                {/* Plays */}
                <div className="col-span-2 text-muted-foreground text-sm hidden md:block">
                  {formatPlays(session.plays || 0)}
                </div>
                
                {/* Favorite Button */}
                <div className="col-span-2 sm:col-span-1 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto w-auto hover:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(session.id);
                    }}
                  >
                    <Heart 
                      className={`w-4 h-4 ${
                        isFavorited 
                            ? 'text-red-500 fill-red-500' 
                            : 'text-gray-400 hover:text-red-500'
                      }`} 
                    />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fixed Bottom Player */}
      {currentSession && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border p-4 z-[1001] shadow-xl">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Current Track Info */}
              <div className="flex items-center gap-4 min-w-0 w-1/4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  {(() => {
                    const Icon = currentSession.category === 'sleep' ? Moon : currentSession.category === 'meditation' ? Sparkles : currentSession.category === 'focus' ? Music : Wind;
                    return <Icon className="w-7 h-7 text-white" />;
                  })()}
                </div>
                <div className="min-w-0">
                  <div className="text-foreground font-medium truncate">{currentSession.title}</div>
                  <div className="text-muted-foreground text-sm truncate">{currentSession.instructor || 'Various Artists'}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto w-auto hover:bg-transparent flex-shrink-0"
                  onClick={() => toggleFavorite(currentSession.id)}
                >
                  <Heart 
                    className={`w-4 h-4 ${
                      favorites.includes(currentSession.id) 
                        ? 'text-red-500 fill-red-500' 
                        : 'text-gray-400 hover:text-red-500'
                    }`} 
                  />
                </Button>
              </div>

              {/* Player Controls */}
              <div className="flex flex-col items-center gap-2 w-2/4 max-w-lg">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handlePlayPause}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 p-0"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Progress Bar */}
                <div className="flex items-center gap-2 w-full">
                  <span className="text-xs text-muted-foreground w-10 text-right">{formatTime(currentTime)}</span>
                  <div className="flex-1">
                    <Progress value={progress} className="h-1 bg-secondary" />
                  </div>
                  <span className="text-xs text-muted-foreground w-10">{formatTime(totalDuration * 60)}</span>
                </div>
              </div>

              {/* Volume and Options */}
              <div className="flex items-center gap-4 w-1/4 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={toggleMute}
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <div className="w-24">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Bottom Padding for Fixed Player */}
      {currentSession && <div className="h-24" />}
    </div>
  );
}