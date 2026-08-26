import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    _id: "mock_id",
    userId: "mock_user",
    currentStreak: 12,
    longestStreak: 15,
    lastReactionDate: new Date().toISOString(),
    totalReactions: 105,
    reactionsByType: {
      like: 20,
      heart: 35,
      helpful: 15,
      support: 25,
      thumbsup: 10
    },
    weeklyReactions: 42,
    monthlyReactions: 89,
    achievements: {
      firstReaction: true,
      streak3Days: true,
      streak7Days: true,
      streak30Days: false,
      streak100Days: false,
      socialButterflyWeekly: false,
      helpfulMember: true,
      supportiveUser: true
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}
