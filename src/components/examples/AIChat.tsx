"use client";

import { AIChat } from '../ai-chat';
import { AI_PERSONALITIES } from '@shared/ai-personalities';

export default function AIChatExample() {
  return (
    <div className="p-8 max-w-2xl">
      <AIChat 
        personality={AI_PERSONALITIES[0]} 
        messages={[]} 
        onMessagesUpdate={() => {}} 
      />
    </div>
  );
}