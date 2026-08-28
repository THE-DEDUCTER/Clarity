"use client";

import { useState } from "react";
import { Search, MessageCircle, HeartHandshake, Sparkles, Brain, Moon, Users2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AI_PERSONALITIES, type AIPersonality } from "@shared/ai-personalities";

const personalityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  alex: HeartHandshake,
  maya: Sparkles,
  sage: Brain,
  luna: Moon,
  rio: Users2,
};

interface AIChatListProps {
  onSelectPersonality: (personality: AIPersonality) => void;
  selectedPersonalityId?: string;
  lastMessages?: Record<string, string>;
  unreadCounts?: Record<string, number>;
}

export function AIChatList({ 
  onSelectPersonality, 
  selectedPersonalityId,
  lastMessages = {},
  unreadCounts = {}
}: AIChatListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPersonalities = AI_PERSONALITIES.filter(personality =>
    personality.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    personality.specialties.some(specialty => 
      specialty.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const getLastMessage = (personalityId: string) => {
    return lastMessages[personalityId] || "Start a conversation...";
  };

  const getUnreadCount = (personalityId: string) => {
    return unreadCounts[personalityId] || 0;
  };

  const getPersonalityColor = (color: string) => {
    const colors = {
      blue: 'bg-sky-500',
      orange: 'bg-amber-500',
      purple: 'bg-violet-500',
      indigo: 'bg-indigo-500',
      green: 'bg-emerald-500',
    };
    return colors[color as keyof typeof colors] || 'bg-sky-500';
  };

  return (
    <div className="h-full flex flex-col bg-card dark:bg-black">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-4 border-b border-border dark:border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-sm">
            <MessageCircle className="w-4 h-4" />
          </div>
          <h2 className="font-bold text-foreground dark:text-gray-100">AI Companions</h2>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search buddies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background dark:bg-gray-800 border-border dark:border-gray-700 focus:bg-card dark:focus:bg-black transition-colors rounded-xl"
          />
        </div>
      </div>
      
      {/* Scrollable Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-2 space-y-1.5">
          {filteredPersonalities.map((personality) => {
            const isSelected = selectedPersonalityId === personality.id;
            const unreadCount = getUnreadCount(personality.id);
            const lastMessage = getLastMessage(personality.id);
            
            return (
              <div
                key={personality.id}
                onClick={() => onSelectPersonality(personality)}
                className={`flex items-center gap-3.5 p-3.5 cursor-pointer transition-all duration-200 rounded-2xl hover:bg-background dark:hover:bg-gray-800/60 active:scale-[0.98] ${
                  isSelected 
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 shadow-sm border border-indigo-200 dark:border-indigo-800/60' 
                    : 'border border-transparent'
                }`}
              >
                {/* Avatar with status */}
                <div className="relative flex-shrink-0">
                  <Avatar className="w-12 h-12 ring-2 ring-white dark:ring-gray-800 shadow-sm">
                    <AvatarFallback className={`${getPersonalityColor(personality.color)} text-white`}>
                      {(() => {
                        const IconComponent = personalityIcons[personality.id] || Sparkles;
                        return <IconComponent className="w-6 h-6 stroke-[2]" />;
                      })()}
                    </AvatarFallback>
                  </Avatar>
                  {/* Online indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-card rounded-full"></div>
                  </div>
                </div>

                {/* Chat content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-semibold text-sm text-foreground dark:text-gray-100 truncate">
                      {personality.name}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {unreadCount > 0 && (
                        <Badge className="bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 min-w-[1.25rem] h-5">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                      )}
                      <span className="text-[11px] text-gray-400 dark:text-muted-foreground font-medium">
                        active
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground dark:text-gray-400 mb-1 line-clamp-1">
                    {personality.description}
                  </p>
                  
                  <p className={`text-xs truncate mb-2 ${
                    unreadCount > 0 ? 'font-semibold text-foreground dark:text-gray-200' : 'text-gray-400 dark:text-muted-foreground'
                  }`}>
                    {lastMessage}
                  </p>
                  
                  {/* Specialties tags */}
                  <div className="flex gap-1 flex-wrap">
                    {personality.specialties.slice(0, 2).map((specialty) => (
                      <Badge 
                        key={specialty} 
                        variant="outline" 
                        className="text-[10px] px-2 py-0.5 bg-background dark:bg-gray-800 border-border dark:border-gray-700 text-muted-foreground dark:text-gray-300"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Empty state */}
        {filteredPersonalities.length === 0 && (
          <div className="text-center py-12 px-6">
            <div className="w-14 h-14 mx-auto mb-3 bg-muted dark:bg-gray-800 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="font-semibold text-sm text-muted-foreground dark:text-gray-300 mb-1">No buddies found</h3>
            <p className="text-xs text-muted-foreground dark:text-gray-400">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
}