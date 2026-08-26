import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    {
      id: "1",
      name: "Dr. Ananya Sharma",
      specialty: "Clinical Psychologist",
      experience: "8 years",
      rating: 4.9,
      reviewsCount: 124,
      availability: "Available Today",
      price: "$40/session",
      languages: ["English", "Hindi"],
      bio: "Specializing in cognitive behavioral therapy, anxiety, stress management, and mindfulness."
    },
    {
      id: "2",
      name: "Dr. Rahul Verma",
      specialty: "Counseling Psychologist",
      experience: "6 years",
      rating: 4.8,
      reviewsCount: 98,
      availability: "Available Tomorrow",
      price: "$35/session",
      languages: ["English", "Hindi"],
      bio: "Focusing on student wellness, academic pressure, emotional regulation, and relationship guidance."
    },
    {
      id: "3",
      name: "Dr. Priya Patel",
      specialty: "Psychiatrist & Therapist",
      experience: "12 years",
      rating: 5.0,
      reviewsCount: 210,
      availability: "Available this week",
      price: "$50/session",
      languages: ["English", "Gujarati", "Hindi"],
      bio: "Expertise in mood disorders, sleep issues, holistic wellness, and trauma-informed counseling."
    }
  ]);
}
