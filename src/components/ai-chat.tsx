"use client";

import { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, 
  Phone, 
  Video, 
  Info, 
  Smile, 
  Mic, 
  Image as ImageIcon, 
  Camera,
  HeartHandshake, 
  Sparkles, 
  Brain, 
  Moon, 
  Users2,
  Volume2,
  VolumeX,
  Download,
  Trash2,
  CheckCircle2,
  Sparkle,
  MoreVertical,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { type AIPersonality } from "@shared/ai-personalities";
import { cn } from "@/lib/utils";

const personalityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  alex: HeartHandshake,
  maya: Sparkles,
  sage: Brain,
  luna: Moon,
  rio: Users2,
};

// Conversation Starters for each companion
const conversationStarters: Record<string, string[]> = {
  alex: [
    "Take a calming breath with me",
    "I'm feeling overwhelmed today",
    "Help me ground my thoughts",
    "How to manage stress?"
  ],
  maya: [
    "I need a motivational boost!",
    "Help me stop procrastinating",
    "Celebrate a small win with me",
    "Give me energy for study"
  ],
  sage: [
    "Help me break down a decision",
    "Analyze my study habits",
    "Structured problem solving",
    "Organize my weekly priorities"
  ],
  luna: [
    "Help me unwind before sleep",
    "Release the tension of the day",
    "Peaceful nighttime reflection",
    "Guided bedtime relaxation"
  ],
  rio: [
    "Roommate / friendship advice",
    "Overcoming social anxiety",
    "How to make new friends",
    "Handling difficult conversations"
  ]
};

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  personalityId?: string;
  provider?: string;
}

interface AIChatProps {
  personality: AIPersonality;
  onBack?: () => void;
  messages: Message[];
  onMessagesUpdate: (messages: Message[]) => void;
  userMoodEmoji?: string | null;
}

export function AIChat({ personality, onBack, messages, onMessagesUpdate, userMoodEmoji }: AIChatProps) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [activeProvider, setActiveProvider] = useState<string>("NuGen / Smart Engine");
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const speakText = (text: string) => {
    if (!speechEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = personality.id === "luna" ? 0.9 : personality.id === "maya" ? 1.1 : 1.0;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: getWelcomeMessage(personality),
        sender: 'ai',
        timestamp: new Date(),
        personalityId: personality.id
      };
      onMessagesUpdate([welcomeMessage]);
    }
  }, [personality.id, messages.length, onMessagesUpdate]);

  const getWelcomeMessage = (personality: AIPersonality): string => {
    const welcomeMessages = {
      alex: "Hi! I'm Alex, your calm wellness coach. I'm here to help you find peace and balance. Take a deep breath — you're in a safe space. How are you feeling today?",
      maya: "Hey there! I'm Maya, your motivational buddy! I'm thrilled to meet you and can't wait to help you achieve your goals! What's something exciting you're working on?",
      sage: "Hello! I'm Sage, your analytical companion. I enjoy helping people think through challenges systematically. What situation would you like to work through together?",
      luna: "Good evening... I'm Luna, your gentle nighttime companion. I'm here to help you unwind and find restful calm. How has your day treated you?",
      rio: "Hey! I'm Rio, your friendly social buddy! I love helping people connect and communicate better. What's on your mind today?"
    };
    return welcomeMessages[personality.id as keyof typeof welcomeMessages] || 
           `Hi! I'm ${personality.name}. ${personality.description} How can I support you today?`;
  };

  const getPersonalityColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-500',
      orange: 'bg-orange-500', 
      purple: 'bg-purple-500',
      indigo: 'bg-indigo-500',
      green: 'bg-green-500',
    };
    return colors[color as keyof typeof colors] || 'bg-blue-500';
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      sender: 'user',
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    onMessagesUpdate(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.sender, content: m.content })),
          personalityId: personality.id,
          moodContext: userMoodEmoji || undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        sender: 'ai',
        timestamp: new Date(),
        personalityId: personality.id,
        provider: data.provider
      };

      onMessagesUpdate([...newMessages, aiResponse]);
      speakText(data.message);
      
      if (data.provider) {
        setActiveProvider(data.provider);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date(),
        personalityId: personality.id
      };
      onMessagesUpdate([...newMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleExportChat = () => {
    const chatText = messages.map(m => 
      `[${m.timestamp.toLocaleTimeString()}] ${m.sender === 'user' ? 'You' : personality.name}: ${m.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Chat_with_${personality.name}_${new Date().toLocaleDateString().replace(/\//g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setShowInfoDialog(false);
  };

  const handleClearChat = () => {
    onMessagesUpdate([]);
    setShowInfoDialog(false);
  };

  const IconComponent = personalityIcons[personality.id] || Sparkles;
  const starters = conversationStarters[personality.id] || [];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black font-sans w-full max-w-full">
      
      {/* Instagram-style Header */}
      <div className="flex items-center justify-between px-4 h-[60px] border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black shrink-0 z-10 sticky top-0">
        <div className="flex items-center gap-3 cursor-pointer">
          {onBack && (
            <button onClick={onBack} className="p-1 -ml-1 text-black dark:text-white hover:opacity-70 transition-opacity">
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <Avatar className="w-8 h-8">
            <AvatarFallback className={cn("text-white text-xs", getPersonalityColor(personality.color))}>
              <IconComponent className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-black dark:text-white leading-tight">
              {personality.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {personality.role}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-5 text-black dark:text-white">
          <button 
            onClick={() => setSpeechEnabled(!speechEnabled)} 
            className="hover:opacity-70 transition-opacity relative"
            title={speechEnabled ? "Voice Output Active" : "Enable Voice Output"}
          >
            <Phone className="w-[26px] h-[26px]" strokeWidth={2} />
            {speechEnabled && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-black" />
            )}
          </button>
          <button className="hover:opacity-70 transition-opacity">
            <Video className="w-7 h-7" strokeWidth={2} />
          </button>
          
          <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
            <DialogTrigger asChild>
              <button className="hover:opacity-70 transition-opacity">
                <Info className="w-7 h-7" strokeWidth={2} />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-center">Details</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center py-6 gap-2">
                <Avatar className="w-20 h-20 mb-2">
                  <AvatarFallback className={cn("text-white text-3xl", getPersonalityColor(personality.color))}>
                    <IconComponent className="w-10 h-10" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-xl font-bold">{personality.name}</span>
                <span className="text-sm text-gray-500">{personality.description}</span>
                
                <div className="flex gap-4 mt-6 w-full">
                  <Button variant="outline" className="flex-1 rounded-xl flex flex-col h-auto py-3 gap-2" onClick={handleExportChat}>
                    <Download className="w-5 h-5" />
                    <span className="text-xs">Export Chat</span>
                  </Button>
                  <Button variant="outline" className="flex-1 rounded-xl flex flex-col h-auto py-3 gap-2 text-rose-500 hover:text-rose-600 border-rose-100 hover:bg-rose-50 dark:border-rose-900/30 dark:hover:bg-rose-900/20" onClick={handleClearChat}>
                    <Trash2 className="w-5 h-5" />
                    <span className="text-xs">Clear Chat</span>
                  </Button>
                </div>
                
                <div className="w-full mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-sm font-medium">Provider Status</span>
                  <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    {activeProvider}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div 
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto px-4 py-5 space-y-1 scrollbar-none"
      >
        {messages.map((message, index) => {
          const isAI = message.sender === 'ai';
          const isLastInGroup = index === messages.length - 1 || messages[index + 1].sender !== message.sender;
          const isFirstInGroup = index === 0 || messages[index - 1].sender !== message.sender;
          
          return (
            <div
              key={message.id}
              className={cn(
                "flex",
                isAI ? "justify-start" : "justify-end",
                isLastInGroup ? "mb-4" : "mb-1"
              )}
            >
              {isAI && (
                <div className="w-7 flex-shrink-0 mr-2 flex items-end">
                  {isLastInGroup ? (
                    <Avatar className="w-7 h-7 mb-0.5">
                      <AvatarFallback className={cn("text-white", getPersonalityColor(personality.color))}>
                        <IconComponent className="w-3.5 h-3.5 stroke-[2]" />
                      </AvatarFallback>
                    </Avatar>
                  ) : <div className="w-7" />}
                </div>
              )}

              <div
                className={cn(
                  "max-w-[72%] px-4 py-2.5 text-[15px] leading-[1.35rem]",
                  isAI 
                    ? "bg-[#EFEFEF] dark:bg-[#262626] text-black dark:text-white" 
                    : "bg-[#0095F6] text-white",
                  // Instagram rounded corners logic
                  isAI && isFirstInGroup && isLastInGroup ? "rounded-[22px]" :
                  isAI && isFirstInGroup ? "rounded-tl-[22px] rounded-tr-[22px] rounded-br-[22px] rounded-bl-md" :
                  isAI && isLastInGroup ? "rounded-tl-md rounded-tr-[22px] rounded-br-[22px] rounded-bl-[22px]" :
                  isAI ? "rounded-tl-md rounded-tr-[22px] rounded-br-[22px] rounded-bl-md" :
                  // User (Sent) rounded corners
                  !isAI && isFirstInGroup && isLastInGroup ? "rounded-[22px]" :
                  !isAI && isFirstInGroup ? "rounded-tl-[22px] rounded-tr-[22px] rounded-bl-[22px] rounded-br-md" :
                  !isAI && isLastInGroup ? "rounded-tl-[22px] rounded-tr-md rounded-bl-[22px] rounded-br-[22px]" :
                  "rounded-tl-[22px] rounded-tr-md rounded-bl-[22px] rounded-br-md"
                )}
              >
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="w-7 flex-shrink-0 mr-2 flex items-end">
              <Avatar className="w-7 h-7 mb-0.5">
                <AvatarFallback className={cn("text-white", getPersonalityColor(personality.color))}>
                  <IconComponent className="w-3.5 h-3.5 stroke-[2]" />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="bg-[#EFEFEF] dark:bg-[#262626] rounded-[22px] px-4 py-3.5">
              <div className="flex space-x-1.5 items-center justify-center h-2.5">
                <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Conversation Starter Chips (Horizontal Scroll like IG Highlights) */}
      {messages.length <= 2 && starters.length > 0 && (
        <div className="px-4 py-3 bg-white dark:bg-black">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {starters.map((starter, i) => (
              <button
                key={i}
                onClick={() => handleSend(starter)}
                className="whitespace-nowrap rounded-full bg-[#EFEFEF] dark:bg-[#262626] px-4 py-2.5 text-[14px] text-black dark:text-white font-medium active:opacity-70 transition-opacity"
              >
                {starter}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Instagram-style Input Area */}
      <div className="px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-2 bg-white dark:bg-black">
        <div className="flex items-end gap-2.5">
          
          {/* IG Camera Circle Icon */}
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0095F6] text-white flex-shrink-0 active:scale-95 transition-transform shadow-sm mb-0.5">
            <Camera className="w-5 h-5" strokeWidth={2} />
          </button>

          {/* Input Pill */}
          <div className="flex-1 flex items-end bg-[#F1F1F1] dark:bg-[#262626] rounded-[24px] pl-1 pr-1.5 py-1 min-h-[44px]">
            
            <button className="p-2.5 flex-shrink-0 text-black dark:text-white hover:opacity-70" title="Emoji">
              <Smile className="w-[22px] h-[22px]" strokeWidth={2} />
            </button>
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={isListening ? "Listening..." : "Message..."}
              className="flex-1 border-0 bg-transparent text-[15px] focus-visible:ring-0 px-0 py-2.5 max-h-[100px] shadow-none text-black dark:text-white placeholder:text-gray-500 resize-none outline-none scrollbar-none leading-tight"
              rows={1}
              style={{
                minHeight: "40px",
                height: input ? "auto" : "40px",
              }}
              disabled={isTyping}
            />
            
            {input.trim() ? (
              <button 
                onClick={() => handleSend()}
                disabled={isTyping}
                className="p-2.5 flex-shrink-0 text-[#0095F6] font-semibold text-[15px] hover:text-blue-600 transition-colors"
              >
                Send
              </button>
            ) : (
              <div className="flex items-center gap-0.5 pr-0.5 text-black dark:text-white">
                <button 
                  onClick={toggleListening}
                  className={cn(
                    "p-2.5 flex-shrink-0 transition-colors",
                    isListening ? "text-rose-500 animate-pulse" : "hover:opacity-70"
                  )}
                >
                  <Mic className="w-[22px] h-[22px]" strokeWidth={2} />
                </button>
                <button className="p-2.5 flex-shrink-0 hover:opacity-70">
                  <ImageIcon className="w-[22px] h-[22px]" strokeWidth={2} />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
