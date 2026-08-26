import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    {
      id: "m1",
      name: "Aarav Mehta",
      department: "Computer Science",
      year: "4th Year",
      interests: ["Peer Support", "Academic Stress", "Career Guidance"],
      bio: "Happy to help juniors navigate college life, campus stress, and balance.",
      rating: 4.9,
      menteesCount: 5
    },
    {
      id: "m2",
      name: "Sneha Reddy",
      department: "Design & Media",
      year: "3rd Year",
      interests: ["Creative Well-being", "Mindfulness", "Time Management"],
      bio: "Passionate about mental health awareness and creative expression.",
      rating: 4.8,
      menteesCount: 4
    }
  ]);
}
