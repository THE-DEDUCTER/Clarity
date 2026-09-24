"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  CheckCircle, 
  CheckCircle2, 
  Brain, 
  Heart, 
  Shield, 
  Save, 
  Sparkles, 
  Compass, 
  ArrowRight, 
  BookOpen, 
  MessageSquare, 
  LifeBuoy, 
  RotateCcw, 
  FileText, 
  Target,
  Info 
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSubmitAssessment, useAssessmentHistory } from "@/hooks/use-assessment";
import { useToast } from "@/hooks/use-toast";

// Assessment data structures
const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead or of hurting yourself in some way"
];

const GAD7_QUESTIONS = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it is hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid, as if something awful might happen"
];

const GHQ28_QUESTIONS = [
  // Scale A: Somatic Symptoms
  "Have you recently been feeling perfectly well and in good health?",
  "Have you recently been feeling in need of a good tonic?",
  "Have you recently been feeling run down and out of sorts?",
  "Have you recently felt that you are ill?",
  "Have you recently been getting any pains in your head?",
  "Have you recently been getting a feeling of tightness or pressure in your head?",
  "Have you recently been having hot or cold spells?",
  // Scale B: Anxiety & Insomnia
  "Have you recently lost much sleep over worry?",
  "Have you recently had difficulty in staying asleep once you are off?",
  "Have you recently felt constantly under strain?",
  "Have you recently been getting edgy and bad-tempered?",
  "Have you recently been getting scared or panicky for no good reason?",
  "Have you recently found everything getting on top of you?",
  "Have you recently been feeling nervous and strung-up all the time?",
  // Scale C: Social Dysfunction
  "Have you recently been managing to keep yourself busy and occupied?",
  "Have you recently been taking longer over the things you do?",
  "Have you recently felt on the whole you were doing things well?",
  "Have you recently been satisfied with the way you've carried out your task?",
  "Have you recently felt that you are playing a useful part in things?",
  "Have you recently felt capable of making decisions about things?",
  "Have you recently been able to enjoy your normal day-to-day activities?",
  // Scale D: Severe Depression
  "Have you recently been thinking of yourself as a worthless person?",
  "Have you recently felt that life is entirely hopeless?",
  "Have you recently felt that life isn't worth living?",
  "Have you recently thought of the possibility that you might make away with yourself?",
  "Have you recently found at times you couldn't do anything because your nerves were too bad?",
  "Have you recently found yourself wishing you were dead and away from it all?",
  "Have you recently found that the idea of taking your own life kept coming into your mind?"
];

const DASS21_QUESTIONS = [
  { text: "I found it hard to wind down", scale: "stress" },
  { text: "I was aware of dryness of my mouth", scale: "anxiety" },
  { text: "I couldn't seem to experience any positive feeling at all", scale: "depression" },
  { text: "I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion)", scale: "anxiety" },
  { text: "I found it difficult to work up the initiative to do things", scale: "depression" },
  { text: "I tended to over-react to situations", scale: "stress" },
  { text: "I experienced trembling (e.g. in the hands)", scale: "anxiety" },
  { text: "I felt that I was using a lot of nervous energy", scale: "stress" },
  { text: "I was worried about situations in which I might panic and make a fool of myself", scale: "anxiety" },
  { text: "I felt that I had nothing to look forward to", scale: "depression" },
  { text: "I found myself getting agitated", scale: "stress" },
  { text: "I found it difficult to relax", scale: "stress" },
  { text: "I felt down-hearted and blue", scale: "depression" },
  { text: "I was intolerant of anything that kept me from getting on with what I was doing", scale: "stress" },
  { text: "I felt I was close to panic", scale: "anxiety" },
  { text: "I was unable to become enthusiastic about anything", scale: "depression" },
  { text: "I felt I wasn't worth much as a person", scale: "depression" },
  { text: "I felt that I was rather touchy", scale: "stress" },
  { text: "I was aware of the action of my heart in the absence of physical exertion (e.g. sense of heart rate increase, heart missing a beat)", scale: "anxiety" },
  { text: "I felt scared without any good reason", scale: "anxiety" },
  { text: "I felt that life was meaningless", scale: "depression" }
];

const ANSWER_OPTIONS_STANDARD = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 }
];

const ANSWER_OPTIONS_GHQ28_STANDARD = [
  { label: "Not at all", value: 0 },
  { label: "No more than usual", value: 0 },
  { label: "Rather more than usual", value: 1 },
  { label: "Much more than usual", value: 1 }
];

const ANSWER_OPTIONS_DASS21 = [
  { label: "Did not apply to me at all", value: 0 },
  { label: "Applied to me to some degree, or some of the time", value: 1 },
  { label: "Applied to me to a considerable degree or a good part of time", value: 2 },
  { label: "Applied to me very much or most of the time", value: 3 }
];

type AssessmentType = 'PHQ9' | 'GAD7' | 'GHQ28' | 'DASS21';

interface AssessmentResults {
  phq9?: number;
  gad7?: number;
  ghq28?: number;
  dass21?: {
    depression: number;
    anxiety: number;
    stress: number;
  };
}

function getPHQ9Interpretation(score: number) {
  if (score <= 4) {
    return {
      severity: "Minimal / None",
      colorClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      explanation: "Your responses suggest minimal or no reported depressive symptoms over the past two weeks.",
      focusAreas: ["Wellness Maintenance", "Daily Routine & Rest", "Mindful Balance"],
      recommendations: [
        "Continue engaging in regular physical movement and healthy sleep habits.",
        "Use your Emotional Diary to note daily positive reflections.",
        "Maintain periodic check-ins to stay aware of subtle mood shifts."
      ]
    };
  } else if (score <= 9) {
    return {
      severity: "Mild Depressive Symptoms",
      colorClass: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      explanation: "Your responses reflect mild depressive symptoms over the past two weeks, such as occasional low energy or minor mood dips.",
      focusAreas: ["Energy & Sleep Quality", "Routine & Habits", "Stress Management"],
      recommendations: [
        "Establish a consistent nighttime wind-down routine to support rest.",
        "Log your thoughts and mood in the Emotional Diary.",
        "Engage in light outdoor activities or short guided breathing sessions."
      ]
    };
  } else if (score <= 14) {
    return {
      severity: "Moderate Depressive Symptoms",
      colorClass: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      explanation: "Your responses indicate moderate depressive symptoms over the past two weeks. Low mood or reduced motivation may be noticeably affecting daily activities.",
      focusAreas: ["Mood Balance", "Social Connection", "Pacing & Routine"],
      recommendations: [
        "Break daily goals into smaller, low-pressure steps.",
        "Talk with our empathetic AI Buddy for confidential emotional processing.",
        "Consider consulting a campus counselor or healthcare professional for guidance."
      ]
    };
  } else if (score <= 19) {
    return {
      severity: "Moderately Severe Symptoms",
      colorClass: "bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800",
      explanation: "Your responses indicate moderately severe depressive symptoms. You may be finding daily responsibilities and motivation quite challenging.",
      focusAreas: ["Professional Guidance", "Self-Compassion", "Support Network"],
      recommendations: [
        "We strongly encourage reaching out to a qualified campus counselor or doctor.",
        "Connect with supportive peers or mentorship channels.",
        "Access instant support resources in our Crisis Support section if needed."
      ]
    };
  } else {
    return {
      severity: "Severe Depressive Symptoms",
      colorClass: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800",
      explanation: "Your responses indicate severe depressive symptoms over the past two weeks. Daily functioning and emotional wellbeing appear significantly impacted.",
      focusAreas: ["Immediate Support", "Professional Evaluation", "Safety Care"],
      recommendations: [
        "Please connect promptly with a healthcare professional or counseling service.",
        "Utilize our Crisis Support center for 24/7 emergency contact details.",
        "Share what you are experiencing with a trusted professional or support person."
      ]
    };
  }
}

function getGAD7Interpretation(score: number) {
  if (score <= 4) {
    return {
      severity: "Minimal Anxiety",
      colorClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      explanation: "Your score indicates minimal anxiety over the past two weeks. Worry levels appear low and manageable.",
      focusAreas: ["Resilience & Calm", "Mindfulness", "Physical Balance"],
      recommendations: [
        "Maintain current stress-relieving practices like exercise and leisure.",
        "Practice periodic box breathing to support ongoing calm."
      ]
    };
  } else if (score <= 9) {
    return {
      severity: "Mild Anxiety",
      colorClass: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      explanation: "Your score indicates mild anxiety symptoms, such as occasional restlessness or mild worry.",
      focusAreas: ["Worry Regulation", "Breathing & Rest", "Screen Time Balance"],
      recommendations: [
        "Try guided relaxation or breathing sessions when feeling tense.",
        "Limit evening screen exposure and caffeine intake.",
        "Note recurring worry triggers in your journal."
      ]
    };
  } else if (score <= 14) {
    return {
      severity: "Moderate Anxiety",
      colorClass: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      explanation: "Your score indicates moderate anxiety symptoms. Persistent worry or difficulty relaxing may be interfering with daily focus.",
      focusAreas: ["Anxiety Relief", "Cognitive Grounding", "Counseling Support"],
      recommendations: [
        "Use 5-4-3-2-1 grounding exercises during anxious moments.",
        "Talk through stressful situations with our empathetic AI Buddy.",
        "Consider scheduling a check-in with a campus counselor."
      ]
    };
  } else {
    return {
      severity: "Severe Anxiety",
      colorClass: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800",
      explanation: "Your score indicates severe anxiety symptoms. High levels of worry, restlessness, or panic feelings may be distressing.",
      focusAreas: ["Professional Consultation", "Immediate Calm", "Crisis Navigation"],
      recommendations: [
        "Seek evaluation and guidance from a qualified mental health clinician.",
        "Use deep belly breathing and grounding tools during intense anxiety spikes.",
        "Reach out to campus counseling or crisis helplines for immediate support."
      ]
    };
  }
}

function getGHQ28Interpretation(score: number) {
  if (score <= 4) {
    return {
      severity: "Good Wellbeing / Low Strain",
      colorClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      explanation: "Your responses reflect healthy psychological wellbeing, solid daily functioning, and minimal somatic strain.",
      focusAreas: ["Wellbeing Maintenance", "Social Engagement", "Work-Life Balance"],
      recommendations: [
        "Continue maintaining your positive daily routines.",
        "Keep up healthy social connections and balanced activities."
      ]
    };
  } else if (score <= 11) {
    return {
      severity: "Moderate Psychological Strain",
      colorClass: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      explanation: "Your responses suggest mild to moderate psychological strain, possibly related to fatigue, workload, or stress.",
      focusAreas: ["Rest & Fatigue", "Stress Reduction", "Routine Pacing"],
      recommendations: [
        "Prioritize restful sleep and set boundaries around heavy workloads.",
        "Engage in relaxing hobbies or peer support conversations."
      ]
    };
  } else {
    return {
      severity: "High Psychological Distress",
      colorClass: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800",
      explanation: "Your responses indicate high psychological distress across physical, emotional, or social areas.",
      focusAreas: ["Professional Care", "Stress Relief", "Self-Care Recovery"],
      recommendations: [
        "Consult a healthcare professional or campus counselor for comprehensive evaluation.",
        "Allow dedicated time for rest and step back from non-essential pressure."
      ]
    };
  }
}

function getDASS21Interpretation(dass21: { depression: number; anxiety: number; stress: number }) {
  const getSubscaleLevel = (score: number, thresholds: number[]) => {
    if (score <= thresholds[0]) return { level: "Normal", badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300" };
    if (score <= thresholds[1]) return { level: "Mild", badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300" };
    if (score <= thresholds[2]) return { level: "Moderate", badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300" };
    if (score <= thresholds[3]) return { level: "Severe", badgeColor: "bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300" };
    return { level: "Extremely Severe", badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300" };
  };

  const depInfo = getSubscaleLevel(dass21.depression, [9, 13, 20, 27]);
  const anxInfo = getSubscaleLevel(dass21.anxiety, [7, 9, 14, 19]);
  const strInfo = getSubscaleLevel(dass21.stress, [14, 18, 25, 33]);

  return {
    depression: { score: dass21.depression, maxScore: 42, ...depInfo },
    anxiety: { score: dass21.anxiety, maxScore: 42, ...anxInfo },
    stress: { score: dass21.stress, maxScore: 42, ...strInfo },
    explanation: `Your DASS-21 response profile measures three distinct emotional dimensions: Depression (${depInfo.level}), Anxiety (${anxInfo.level}), and Stress (${strInfo.level}).`,
    focusAreas: ["Emotional Domain Analysis", "Grounding Techniques", "Targeted Support"],
    recommendations: [
      "Focus attention on the subscale indicating the highest relative elevation.",
      "Practice deep diaphragmatic breathing to regulate acute stress or anxiety.",
      "Journal daily reflections in your Emotional Diary to identify environmental triggers.",
      "Consider consulting a mental health professional for personalized guidance."
    ]
  };
}

interface ScoreLevel {
  level: string;
  color: 'green' | 'yellow' | 'red';
  description: string;
  recommendations: string[];
}

export default function MentalHealthAssessment() {
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentType | null>(null);
  const [lastCompletedType, setLastCompletedType] = useState<AssessmentType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [results, setResults] = useState<AssessmentResults>({});
  const [isCompleted, setIsCompleted] = useState(false);
  
  const { toast } = useToast();
  const submitAssessment = useSubmitAssessment();
  const { data: history } = useAssessmentHistory();

  const getQuestions = (type: AssessmentType) => {
    switch (type) {
      case 'PHQ9': return PHQ9_QUESTIONS;
      case 'GAD7': return GAD7_QUESTIONS;
      case 'GHQ28': return GHQ28_QUESTIONS;
      case 'DASS21': return DASS21_QUESTIONS.map(q => q.text);
    }
  };

  const getAnswerOptions = (type: AssessmentType) => {
    switch (type) {
      case 'PHQ9':
      case 'GAD7':
        return ANSWER_OPTIONS_STANDARD;
      case 'GHQ28':
        return ANSWER_OPTIONS_GHQ28_STANDARD;
      case 'DASS21':
        return ANSWER_OPTIONS_DASS21;
      default:
        return ANSWER_OPTIONS_STANDARD;
    }
  };

  const getInstruction = (type: AssessmentType) => {
    switch (type) {
      case 'PHQ9': return "Over the last 2 weeks, how often have you been bothered by the following problems?";
      case 'GAD7': return "Over the last 2 weeks, how often have you been bothered by the following problems?";
      case 'GHQ28': return "Thinking about the past few weeks, please answer how each statement applies to you:";
      case 'DASS21': return "Please read each statement and indicate how much the statement applied to you over the past week:";
    }
  };

  const startAssessment = (type: AssessmentType) => {
    setCurrentAssessment(type);
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    const questions = getQuestions(currentAssessment!);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Assessment completed
      const totalScore = newAnswers.reduce((sum, answer) => sum + answer, 0);
      setLastCompletedType(currentAssessment);
      
      if (currentAssessment === 'DASS21') {
        // Calculate DASS-21 subscales
        const depressionItems = [2, 4, 9, 12, 15, 16, 20]; // 0-based indices
        const anxietyItems = [1, 3, 6, 8, 14, 18, 19];
        const stressItems = [0, 5, 7, 10, 11, 13, 17];
        
        const depression = depressionItems.reduce((sum, idx) => sum + newAnswers[idx], 0) * 2;
        const anxiety = anxietyItems.reduce((sum, idx) => sum + newAnswers[idx], 0) * 2;
        const stress = stressItems.reduce((sum, idx) => sum + newAnswers[idx], 0) * 2;
        
        setResults(prev => ({
          ...prev,
          dass21: { depression, anxiety, stress }
        }));
      } else {
        setResults(prev => ({
          ...prev,
          [currentAssessment!.toLowerCase()]: totalScore
        }));
      }
      
      setIsCompleted(true);
      setCurrentAssessment(null);
      setCurrentQuestion(0);
      setAnswers([]);
    }
  };

  const saveAssessmentResults = async () => {
    try {
      await submitAssessment.mutateAsync(results);
      
      toast({
        title: "Assessment Saved",
        description: "Your assessment results have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save assessment results. Please try again.",
        variant: "destructive",
      });
    }
  };

  const retakeSingleAssessment = (type: AssessmentType) => {
    setResults(prev => {
      const updated = { ...prev };
      const key = type.toLowerCase() as keyof AssessmentResults;
      delete updated[key];
      
      // If no remaining completed assessment results, mark non-completed
      if (Object.keys(updated).length === 0) {
        setIsCompleted(false);
      }
      return updated;
    });

    startAssessment(type);
  };

  const resetAssessment = () => {
    setResults({});
    setIsCompleted(false);
    setCurrentAssessment(null);
    setLastCompletedType(null);
  };

  // Main menu view
  if (!currentAssessment && !isCompleted) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Mental Health Assessment</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete these validated mental health questionnaires to get insights into your wellbeing. 
            Each assessment takes about 2-5 minutes to complete.
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              Clinically validated
            </span>
            <span className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              Confidential
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              Professional guidance
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* PHQ-9 Depression Screening */}
          <Card className={`cursor-pointer transition-all hover:shadow-lg ${results.phq9 !== undefined ? 'border-green-200 bg-green-50' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">PHQ-9</CardTitle>
                {results.phq9 !== undefined && <CheckCircle className="h-5 w-5 text-green-600" />}
              </div>
              <CardDescription>Depression Screening</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Assesses depression symptoms over the past 2 weeks.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Questions:</span>
                  <span className="font-medium">9</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Duration:</span>
                  <span className="font-medium">2-3 min</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => results.phq9 !== undefined ? retakeSingleAssessment('PHQ9') : startAssessment('PHQ9')} 
                className="w-full"
                variant={results.phq9 !== undefined ? "outline" : "default"}
              >
                {results.phq9 !== undefined ? "Retake" : "Start PHQ-9"}
              </Button>
            </CardFooter>
          </Card>

          {/* GAD-7 Anxiety Screening */}
          <Card className={`cursor-pointer transition-all hover:shadow-lg ${results.gad7 !== undefined ? 'border-green-200 bg-green-50' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">GAD-7</CardTitle>
                {results.gad7 !== undefined && <CheckCircle className="h-5 w-5 text-green-600" />}
              </div>
              <CardDescription>Anxiety Screening</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Measures anxiety symptoms and worry patterns.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Questions:</span>
                  <span className="font-medium">7</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Duration:</span>
                  <span className="font-medium">2-3 min</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => results.gad7 !== undefined ? retakeSingleAssessment('GAD7') : startAssessment('GAD7')} 
                className="w-full"
                variant={results.gad7 !== undefined ? "outline" : "default"}
              >
                {results.gad7 !== undefined ? "Retake" : "Start GAD-7"}
              </Button>
            </CardFooter>
          </Card>

          {/* GHQ-28 General Mental Health */}
          <Card className={`cursor-pointer transition-all hover:shadow-lg ${results.ghq28 !== undefined ? 'border-green-200 bg-green-50' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">GHQ-28</CardTitle>
                {results.ghq28 !== undefined && <CheckCircle className="h-5 w-5 text-green-600" />}
              </div>
              <CardDescription>General Health Questionnaire</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive assessment of psychological wellbeing.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Questions:</span>
                  <span className="font-medium">28</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Duration:</span>
                  <span className="font-medium">5-7 min</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => results.ghq28 !== undefined ? retakeSingleAssessment('GHQ28') : startAssessment('GHQ28')} 
                className="w-full"
                variant={results.ghq28 !== undefined ? "outline" : "default"}
              >
                {results.ghq28 !== undefined ? "Retake" : "Start GHQ-28"}
              </Button>
            </CardFooter>
          </Card>

          {/* DASS-21 */}
          <Card className={`cursor-pointer transition-all hover:shadow-lg ${results.dass21 !== undefined ? 'border-green-200 bg-green-50' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">DASS-21</CardTitle>
                {results.dass21 !== undefined && <CheckCircle className="h-5 w-5 text-green-600" />}
              </div>
              <CardDescription>Depression, Anxiety & Stress</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Measures depression, anxiety, and stress levels.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Questions:</span>
                  <span className="font-medium">21</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Duration:</span>
                  <span className="font-medium">3-5 min</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => results.dass21 !== undefined ? retakeSingleAssessment('DASS21') : startAssessment('DASS21')} 
                className="w-full"
                variant={results.dass21 !== undefined ? "outline" : "default"}
              >
                {results.dass21 !== undefined ? "Retake" : "Start DASS-21"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> These assessments are screening tools and not diagnostic instruments. 
            If you're experiencing mental health concerns, please consult with a qualified healthcare professional.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Assessment question view
  if (currentAssessment) {
    const questions = getQuestions(currentAssessment);
    const answerOptions = getAnswerOptions(currentAssessment);
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">
              {currentAssessment} Assessment
            </h2>
            <p className="text-muted-foreground">
              {getInstruction(currentAssessment)}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </div>

          {/* Question Card */}
          <Card className="rounded-[32px] border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">
                {questions[currentQuestion]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {answerOptions.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto p-4 text-left"
                    onClick={() => handleAnswer(option.value)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-sm text-muted-foreground mt-0.5">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span>{option.label}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button variant="ghost" onClick={() => setCurrentAssessment(null)}>
              Back to Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Results view
  if (isCompleted) {
    const activeTest = lastCompletedType || (results.phq9 !== undefined ? 'PHQ9' : results.gad7 !== undefined ? 'GAD7' : results.ghq28 !== undefined ? 'GHQ28' : 'DASS21');
    const displayTest = currentAssessment || activeTest;

    let phqData = results.phq9 !== undefined ? getPHQ9Interpretation(results.phq9) : null;
    let gadData = results.gad7 !== undefined ? getGAD7Interpretation(results.gad7) : null;
    let ghqData = results.ghq28 !== undefined ? getGHQ28Interpretation(results.ghq28) : null;
    let dassData = results.dass21 !== undefined ? getDASS21Interpretation(results.dass21) : null;

    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8 animate-in fade-in duration-300" data-testid="assessment-results">
        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Assessment Complete & Analyzed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Your Clinical Self-Assessment Insights
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Review your calculated score breakdown, plain-language summary, key areas of focus, and supportive next steps below.
          </p>
        </div>

        {/* Assessment Switcher Tabs if multiple taken */}
        <div className="flex flex-wrap justify-center gap-2">
          {results.phq9 !== undefined && (
            <Badge 
              variant={displayTest === 'PHQ9' ? 'default' : 'outline'}
              className="cursor-pointer px-4 py-1.5 text-xs font-semibold rounded-full transition-all"
              onClick={() => setCurrentAssessment('PHQ9')}
            >
              PHQ-9 Score ({results.phq9}/27)
            </Badge>
          )}
          {results.gad7 !== undefined && (
            <Badge 
              variant={displayTest === 'GAD7' ? 'default' : 'outline'}
              className="cursor-pointer px-4 py-1.5 text-xs font-semibold rounded-full transition-all"
              onClick={() => setCurrentAssessment('GAD7')}
            >
              GAD-7 Score ({results.gad7}/21)
            </Badge>
          )}
          {results.ghq28 !== undefined && (
            <Badge 
              variant={displayTest === 'GHQ28' ? 'default' : 'outline'}
              className="cursor-pointer px-4 py-1.5 text-xs font-semibold rounded-full transition-all"
              onClick={() => setCurrentAssessment('GHQ28')}
            >
              GHQ-28 Score ({results.ghq28}/28)
            </Badge>
          )}
          {results.dass21 !== undefined && (
            <Badge 
              variant={displayTest === 'DASS21' ? 'default' : 'outline'}
              className="cursor-pointer px-4 py-1.5 text-xs font-semibold rounded-full transition-all"
              onClick={() => setCurrentAssessment('DASS21')}
            >
              DASS-21 Subscales
            </Badge>
          )}
        </div>

        {/* Selected Assessment Result Card */}
        {displayTest === 'PHQ9' && results.phq9 !== undefined && phqData && (
          <Card className="rounded-[32px] border-border shadow-sm overflow-hidden bg-card">
            <CardHeader className="border-b border-border/50 pb-6 bg-muted/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Badge variant="outline" className="mb-2 text-xs font-medium">PHQ-9 Screening</Badge>
                  <CardTitle className="text-xl sm:text-2xl font-bold">Depression Score Analysis</CardTitle>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-3xl font-extrabold text-foreground">{results.phq9} <span className="text-sm font-normal text-muted-foreground">/ 27</span></div>
                  </div>
                  <Badge className={`px-3 py-1 text-xs font-semibold rounded-full ${phqData.colorClass}`}>
                    {phqData.severity}
                  </Badge>
                </div>
              </div>
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Score Intensity</span>
                  <span>{Math.round((results.phq9 / 27) * 100)}%</span>
                </div>
                <Progress value={(results.phq9 / 27) * 100} className="h-2.5 rounded-full" />
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Plain Language Interpretation */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  What Your Score Means
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-2xl border border-border/40">
                  {phqData.explanation}
                </p>
              </div>

              {/* Focus Areas */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Key Areas of Focus
                </h3>
                <div className="flex flex-wrap gap-2">
                  {phqData.focusAreas.map((area, idx) => (
                    <Badge key={idx} variant="secondary" className="px-3 py-1 rounded-xl text-xs font-medium">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Suggested Next Steps
                </h3>
                <ul className="space-y-2.5">
                  {phqData.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {displayTest === 'GAD7' && results.gad7 !== undefined && gadData && (
          <Card className="rounded-[32px] border-border shadow-sm overflow-hidden bg-card">
            <CardHeader className="border-b border-border/50 pb-6 bg-muted/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Badge variant="outline" className="mb-2 text-xs font-medium">GAD-7 Screening</Badge>
                  <CardTitle className="text-xl sm:text-2xl font-bold">Anxiety Score Analysis</CardTitle>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-3xl font-extrabold text-foreground">{results.gad7} <span className="text-sm font-normal text-muted-foreground">/ 21</span></div>
                  </div>
                  <Badge className={`px-3 py-1 text-xs font-semibold rounded-full ${gadData.colorClass}`}>
                    {gadData.severity}
                  </Badge>
                </div>
              </div>
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Anxiety Level Gauge</span>
                  <span>{Math.round((results.gad7 / 21) * 100)}%</span>
                </div>
                <Progress value={(results.gad7 / 21) * 100} className="h-2.5 rounded-full" />
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  What Your Score Means
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-2xl border border-border/40">
                  {gadData.explanation}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Key Areas of Focus
                </h3>
                <div className="flex flex-wrap gap-2">
                  {gadData.focusAreas.map((area, idx) => (
                    <Badge key={idx} variant="secondary" className="px-3 py-1 rounded-xl text-xs font-medium">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Suggested Next Steps
                </h3>
                <ul className="space-y-2.5">
                  {gadData.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {displayTest === 'GHQ28' && results.ghq28 !== undefined && ghqData && (
          <Card className="rounded-[32px] border-border shadow-sm overflow-hidden bg-card">
            <CardHeader className="border-b border-border/50 pb-6 bg-muted/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Badge variant="outline" className="mb-2 text-xs font-medium">GHQ-28 Questionnaire</Badge>
                  <CardTitle className="text-xl sm:text-2xl font-bold">General Health & Wellbeing Analysis</CardTitle>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-3xl font-extrabold text-foreground">{results.ghq28} <span className="text-sm font-normal text-muted-foreground">/ 28</span></div>
                  </div>
                  <Badge className={`px-3 py-1 text-xs font-semibold rounded-full ${ghqData.colorClass}`}>
                    {ghqData.severity}
                  </Badge>
                </div>
              </div>
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>General Distress Indicator</span>
                  <span>{Math.round((results.ghq28 / 28) * 100)}%</span>
                </div>
                <Progress value={(results.ghq28 / 28) * 100} className="h-2.5 rounded-full" />
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  What Your Score Means
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-2xl border border-border/40">
                  {ghqData.explanation}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Key Areas of Focus
                </h3>
                <div className="flex flex-wrap gap-2">
                  {ghqData.focusAreas.map((area, idx) => (
                    <Badge key={idx} variant="secondary" className="px-3 py-1 rounded-xl text-xs font-medium">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Suggested Next Steps
                </h3>
                <ul className="space-y-2.5">
                  {ghqData.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {displayTest === 'DASS21' && results.dass21 !== undefined && dassData && (
          <Card className="rounded-[32px] border-border shadow-sm overflow-hidden bg-card">
            <CardHeader className="border-b border-border/50 pb-6 bg-muted/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Badge variant="outline" className="mb-2 text-xs font-medium">DASS-21 Multidimensional Scale</Badge>
                  <CardTitle className="text-xl sm:text-2xl font-bold">Depression, Anxiety & Stress Profile</CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* 3 Subscale Cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="p-4 rounded-2xl border border-border/60 bg-muted/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Depression</span>
                    <Badge className={`text-[10px] ${dassData.depression.badgeColor}`}>
                      {dassData.depression.level}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {dassData.depression.score} <span className="text-xs text-muted-foreground font-normal">/ 42</span>
                  </div>
                  <Progress value={(dassData.depression.score / 42) * 100} className="h-2" />
                </div>

                <div className="p-4 rounded-2xl border border-border/60 bg-muted/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Anxiety</span>
                    <Badge className={`text-[10px] ${dassData.anxiety.badgeColor}`}>
                      {dassData.anxiety.level}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {dassData.anxiety.score} <span className="text-xs text-muted-foreground font-normal">/ 42</span>
                  </div>
                  <Progress value={(dassData.anxiety.score / 42) * 100} className="h-2" />
                </div>

                <div className="p-4 rounded-2xl border border-border/60 bg-muted/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Stress</span>
                    <Badge className={`text-[10px] ${dassData.stress.badgeColor}`}>
                      {dassData.stress.level}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {dassData.stress.score} <span className="text-xs text-muted-foreground font-normal">/ 42</span>
                  </div>
                  <Progress value={(dassData.stress.score / 42) * 100} className="h-2" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  What Your Score Means
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-2xl border border-border/40">
                  {dassData.explanation}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Key Areas of Focus
                </h3>
                <div className="flex flex-wrap gap-2">
                  {dassData.focusAreas.map((area, idx) => (
                    <Badge key={idx} variant="secondary" className="px-3 py-1 rounded-xl text-xs font-medium">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Suggested Next Steps
                </h3>
                <ul className="space-y-2.5">
                  {dassData.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Action Navigation Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground px-1">Take Action in Clarity</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/diary" className="group p-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all flex flex-col justify-between space-y-2">
              <div className="flex justify-between items-center">
                <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <ArrowRight className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div>
                <div className="font-semibold text-xs text-foreground">Emotional Diary</div>
                <div className="text-[11px] text-muted-foreground">Journal your thoughts & triggers</div>
              </div>
            </Link>

            <Link href="/ai-buddy" className="group p-4 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-all flex flex-col justify-between space-y-2">
              <div className="flex justify-between items-center">
                <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <ArrowRight className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div>
                <div className="font-semibold text-xs text-foreground">AI Companion</div>
                <div className="text-[11px] text-muted-foreground">Talk with an empathetic assistant</div>
              </div>
            </Link>

            <Link href="/crisis" className="group p-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all flex flex-col justify-between space-y-2">
              <div className="flex justify-between items-center">
                <LifeBuoy className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <ArrowRight className="w-4 h-4 text-rose-600 dark:text-rose-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div>
                <div className="font-semibold text-xs text-foreground">Counselor & Crisis Support</div>
                <div className="text-[11px] text-muted-foreground">Access professional resources</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button 
            onClick={saveAssessmentResults} 
            size="lg"
            disabled={submitAssessment.isPending}
            className="gap-2 rounded-2xl"
          >
            <Save className="h-4 w-4" />
            {submitAssessment.isPending ? "Saving..." : "Confirm & Save Results"}
          </Button>
          <Button onClick={() => retakeSingleAssessment(displayTest)} variant="outline" size="lg" className="gap-2 rounded-2xl">
            <RotateCcw className="h-4 w-4" />
            Retake Assessment
          </Button>
          <Button onClick={() => setIsCompleted(false)} size="lg" variant="ghost" className="rounded-2xl">
            Return to Assessments Menu
          </Button>
        </div>

        {/* Non-Diagnostic Disclaimer */}
        <Alert className="rounded-2xl border-purple-500/20 bg-purple-500/5">
          <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <AlertDescription className="text-xs text-muted-foreground leading-relaxed">
            <strong>Clinical Disclaimer:</strong> These self-assessments (PHQ-9, GAD-7, GHQ-28, DASS-21) are evidence-based screening tools designed to help monitor wellbeing trends. They do not constitute a formal clinical diagnosis. If you are experiencing distress, please consult a qualified medical or mental health professional.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return null;
}

