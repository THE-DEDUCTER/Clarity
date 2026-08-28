"use client";

import { useState, useEffect } from "react";
import { AIChatList } from "@/components/ai-chat-list";
import { AIChat } from "@/components/ai-chat";
import { BackButton } from "@/components/ui/back-button";
import { AI_PERSONALITIES, type AIPersonality } from "@shared/ai-personalities";
import { useRouter, usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  personalityId?: string;
}

type ConversationHistory = Record<string, Message[]>;

export default function AIBuddyPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedPersonality, setSelectedPersonality] = useState<AIPersonality | null>(null);
  const [conversations, setConversations] = useState<ConversationHistory>({});
  const [lastMessages, setLastMessages] = useState<Record<string, string>>({});
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [userMoodEmoji, setUserMoodEmoji] = useState<string | null>(null);

  // Extract mood and emoji from URL parameters
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    const mood = urlParams.get('mood');
    const emoji = urlParams.get('emoji');
    
    if (emoji) {
      setUserMoodEmoji(decodeURIComponent(emoji));
    }
    
    // Auto-select a personality based on mood
    if (mood && !selectedPersonality) {
      const moodToPersonality = {
        '1': 'alex',  // Very Low -> Alex (calm)
        '2': 'luna',  // Low -> Luna (gentle)
        '3': 'sage',  // Medium -> Sage (analytical)
        '4': 'maya',  // Good -> Maya (motivational)
        '5': 'rio'    // Excellent -> Rio (social)
      };
      
      const personalityId = moodToPersonality[mood as keyof typeof moodToPersonality];
      if (personalityId) {
        const personality = AI_PERSONALITIES.find(p => p.id === personalityId);
        if (personality) {
          setSelectedPersonality(personality);
        }
      }
    }
  }, [pathname, selectedPersonality]);

  // Hide bottom nav when in an active chat on mobile
  useEffect(() => {
    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) {
      if (selectedPersonality) {
        bottomNav.style.transform = 'translateY(150%)';
      } else {
        bottomNav.style.transform = 'translateY(0)';
      }
    }
    
    return () => {
      if (bottomNav) {
        bottomNav.style.transform = 'translateY(0)';
      }
    };
  }, [selectedPersonality]);

  // Update last messages when conversations change (but don't save to localStorage)
  useEffect(() => {
    const lastMsgs: Record<string, string> = {};
    Object.keys(conversations).forEach(personalityId => {
      const msgs = conversations[personalityId];
      if (msgs.length > 0) {
        const lastMsg = msgs[msgs.length - 1];
        const safeContent = lastMsg.content || "";
        lastMsgs[personalityId] = lastMsg.sender === 'user' 
          ? `You: ${safeContent.slice(0, 50)}${safeContent.length > 50 ? '...' : ''}`
          : `${safeContent.slice(0, 50)}${safeContent.length > 50 ? '...' : ''}`;
      }
    });
    setLastMessages(lastMsgs);
  }, [conversations]);

  const handleSelectPersonality = (personality: AIPersonality) => {
    setSelectedPersonality(personality);
    // Clear unread count for this personality
    setUnreadCounts(prev => ({
      ...prev,
      [personality.id]: 0
    }));
    
    // Clear conversation history for fresh start with each personality
    setConversations(prev => ({
      ...prev,
      [personality.id]: []
    }));
  };

  const handleMessagesUpdate = (messages: Message[]) => {
    if (!selectedPersonality) return;
    
    setConversations(prev => ({
      ...prev,
      [selectedPersonality.id]: messages
    }));
  };

  const handleBack = () => {
    setSelectedPersonality(null);
  };

  const getCurrentMessages = (): Message[] => {
    if (!selectedPersonality) return [];
    return conversations[selectedPersonality.id] || [];
  };

  // Desktop layout with Instagram-like design
  const DesktopLayout = () => (
    <div className="flex h-full w-full gap-0 bg-white dark:bg-black overflow-hidden">
      <div className="w-[350px] flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black flex flex-col z-20">
        <AIChatList
          onSelectPersonality={handleSelectPersonality}
          selectedPersonalityId={selectedPersonality?.id}
          lastMessages={lastMessages}
          unreadCounts={unreadCounts}
        />
      </div>
      
      <div className="flex-1 flex flex-col bg-white dark:bg-black">
        {selectedPersonality ? (
          <AIChat
            personality={selectedPersonality}
            messages={getCurrentMessages()}
            onMessagesUpdate={handleMessagesUpdate}
            userMoodEmoji={userMoodEmoji}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-white dark:bg-black">
            <div className="text-center space-y-4 p-8">
              <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center shadow-sm">
                <MessageCircle className="w-10 h-10 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Your Messages</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[250px] mx-auto">
                  Select a companion to start chatting.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Mobile layout - full screen immersive
  const MobileLayout = () => (
    <div className="h-full w-full bg-white dark:bg-black overflow-hidden flex flex-col">
      {selectedPersonality ? (
        <AIChat
          personality={selectedPersonality}
          onBack={handleBack}
          messages={getCurrentMessages()}
          onMessagesUpdate={handleMessagesUpdate}
          userMoodEmoji={userMoodEmoji}
        />
      ) : (
        <AIChatList
          onSelectPersonality={handleSelectPersonality}
          selectedPersonalityId={undefined}
          lastMessages={lastMessages}
          unreadCounts={unreadCounts}
        />
      )}
    </div>
  );

  return (
    <div 
      className="w-full h-full flex flex-col animate-in fade-in duration-500 bg-white dark:bg-black" 
      data-testid="page-ai-buddy"
    >
      <div className="hidden lg:block absolute top-20 left-[300px] z-50">
        {!selectedPersonality && <BackButton to="/dashboard" />}
      </div>
      
      {/* Show desktop layout on larger screens, mobile on smaller */}
      <div className="hidden lg:flex flex-col flex-1 h-full w-full">
        <DesktopLayout />
      </div>
      <div className="lg:hidden flex flex-col flex-1 h-full w-full">
        <MobileLayout />
      </div>
    </div>
  );
}
