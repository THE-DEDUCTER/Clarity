"use client";

import { useState, useEffect } from "react";
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
  Info,
  ChevronLeft
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
  const [saveError, setSaveError] = useState(false);
  // Snapshot of an interrupted attempt so the user can resume or discard it
  const [inProgressType, setInProgressType] = useState<AssessmentType | null>(null);
  const [inProgressAnswers, setInProgressAnswers] = useState<number[]>([]);
  const [inProgressQuestion, setInProgressQuestion] = useState(0);
  
  const { toast } = useToast();
  const submitAssessment = useSubmitAssessment();
  const { data: history } = useAssessmentHistory();

  const hasAnyResult = results.phq9 !== undefined || results.gad7 !== undefined || results.ghq28 !== undefined || results.dass21 !== undefined;

  // Warn before leaving with an unfinished assessment in progress
  useEffect(() => {
    if (!currentAssessment || answers.length === 0) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ""; // Required for Chrome
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [currentAssessment, answers.length]);

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
    // Starting fresh on this type discards any saved-up progress for it
    if (inProgressType === type) {
      setInProgressType(null);
      setInProgressAnswers([]);
      setInProgressQuestion(0);
    }
  };

  // Leave mid-assessment, keeping progress so it can be resumed from the menu
  const exitToMenu = () => {
    if (currentAssessment && answers.length > 0) {
      setInProgressType(currentAssessment);
      setInProgressAnswers(answers);
      setInProgressQuestion(currentQuestion);
    }
    setCurrentAssessment(null);
  };

  const resumeAssessment = () => {
    if (!inProgressType) return;
    setCurrentAssessment(inProgressType);
    setAnswers(inProgressAnswers);
    setCurrentQuestion(inProgressQuestion);
    setInProgressType(null);
    setInProgressAnswers([]);
    setInProgressQuestion(0);
  };

  const discardInProgress = () => {
    setInProgressType(null);
    setInProgressAnswers([]);
    setInProgressQuestion(0);
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
    setSaveError(false);
    try {
      await submitAssessment.mutateAsync(results);
      
      toast({
        title: "Assessment Saved",
        description: "Your assessment results have been saved successfully.",
      });
    } catch (error) {
      setSaveError(true);
      toast({
        title: "Couldn't save results",
        description: "Your scores are still shown below. Check your connection and try again.",
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
    setSaveError(false);
  };

  // Main menu view — also shown as a safety net if completion state ever has no scores
  const showMenu = !currentAssessment && (!isCompleted || !hasAnyResult);
  if (showMenu) {
    return (
      <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6" aria-labelledby="mental-health-heading">
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Brain className="h-8 w-8 text-primary shrink-0" aria-hidden="true" />
            <h1 id="mental-health-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Mental Health Assessment
            </h1>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Complete these validated mental health questionnaires to get insights into your wellbeing. 
            Each assessment takes about 2-5 minutes to complete.
          </p>
          
          <ul className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-muted-foreground" aria-label="Assessment Features">
            <li className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
              <span>Clinically validated</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" aria-hidden="true" />
              <span>Confidential</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" aria-hidden="true" />
              <span>Professional guidance</span>
            </li>
          </ul>
        </header>

        {/* Resume banner for an interrupted attempt */}
        {inProgressType && inProgressAnswers.length > 0 && (
          <Card className="border-amber-500/40 bg-amber-500/5" role="status">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-start gap-3 flex-1">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Unfinished {inProgressType} assessment</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    You answered {inProgressAnswers.filter(a => a !== undefined).length} of {getQuestions(inProgressType).length} questions. Pick up where you left off, or start over.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  type="button"
                  size="sm"
                  onClick={resumeAssessment}
                  className="min-h-[44px]"
                  aria-label={`Resume ${inProgressType} assessment at question ${inProgressQuestion + 1}`}
                >
                  Resume
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={discardInProgress}
                  className="min-h-[44px]"
                  aria-label={`Discard unfinished ${inProgressType} answers`}
                >
                  Discard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <section aria-label="Available Screenings" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* PHQ-9 Depression Screening */}
          <Card className={`transition-all hover:shadow-lg ${results.phq9 !== undefined ? 'border-emerald-500/40 dark:border-emerald-600/50 bg-emerald-500/5' : 'border-border/80'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-foreground" id="phq9-card-title">PHQ-9</CardTitle>
                {results.phq9 !== undefined && (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 gap-1 px-2 py-0.5">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    <span>Done</span>
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs text-muted-foreground font-medium">Depression Screening</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed">
                Assesses depression symptoms over the past 2 weeks.
              </p>
              <dl className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Questions:</dt>
                  <dd className="font-semibold text-foreground">9</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Duration:</dt>
                  <dd className="font-semibold text-foreground">2-3 min</dd>
                </div>
              </dl>
            </CardContent>
            <CardFooter>
              <Button 
                type="button"
                onClick={() => results.phq9 !== undefined ? retakeSingleAssessment('PHQ9') : startAssessment('PHQ9')} 
                className="w-full min-h-[44px] rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-teal-400 dark:focus-visible:ring-offset-slate-950 font-medium"
                variant={results.phq9 !== undefined ? "outline" : "default"}
                aria-labelledby="phq9-card-title"
              >
                {results.phq9 !== undefined ? "Retake PHQ-9" : "Start PHQ-9"}
              </Button>
            </CardFooter>
          </Card>

          {/* GAD-7 Anxiety Screening */}
          <Card className={`transition-all hover:shadow-lg ${results.gad7 !== undefined ? 'border-emerald-500/40 dark:border-emerald-600/50 bg-emerald-500/5' : 'border-border/80'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-foreground" id="gad7-card-title">GAD-7</CardTitle>
                {results.gad7 !== undefined && (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 gap-1 px-2 py-0.5">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    <span>Done</span>
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs text-muted-foreground font-medium">Anxiety Screening</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed">
                Measures anxiety symptoms and worry patterns.
              </p>
              <dl className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Questions:</dt>
                  <dd className="font-semibold text-foreground">7</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Duration:</dt>
                  <dd className="font-semibold text-foreground">2-3 min</dd>
                </div>
              </dl>
            </CardContent>
            <CardFooter>
              <Button 
                type="button"
                onClick={() => results.gad7 !== undefined ? retakeSingleAssessment('GAD7') : startAssessment('GAD7')} 
                className="w-full min-h-[44px] rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-teal-400 dark:focus-visible:ring-offset-slate-950 font-medium"
                variant={results.gad7 !== undefined ? "outline" : "default"}
                aria-labelledby="gad7-card-title"
              >
                {results.gad7 !== undefined ? "Retake GAD-7" : "Start GAD-7"}
              </Button>
            </CardFooter>
          </Card>

          {/* GHQ-28 General Mental Health */}
          <Card className={`transition-all hover:shadow-lg ${results.ghq28 !== undefined ? 'border-emerald-500/40 dark:border-emerald-600/50 bg-emerald-500/5' : 'border-border/80'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-foreground" id="ghq28-card-title">GHQ-28</CardTitle>
                {results.ghq28 !== undefined && (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 gap-1 px-2 py-0.5">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    <span>Done</span>
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs text-muted-foreground font-medium">General Health Questionnaire</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed">
                Comprehensive assessment of psychological wellbeing.
              </p>
              <dl className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Questions:</dt>
                  <dd className="font-semibold text-foreground">28</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Duration:</dt>
                  <dd className="font-semibold text-foreground">5-7 min</dd>
                </div>
              </dl>
            </CardContent>
            <CardFooter>
              <Button 
                type="button"
                onClick={() => results.ghq28 !== undefined ? retakeSingleAssessment('GHQ28') : startAssessment('GHQ28')} 
                className="w-full min-h-[44px] rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-teal-400 dark:focus-visible:ring-offset-slate-950 font-medium"
                variant={results.ghq28 !== undefined ? "outline" : "default"}
                aria-labelledby="ghq28-card-title"
              >
                {results.ghq28 !== undefined ? "Retake GHQ-28" : "Start GHQ-28"}
              </Button>
            </CardFooter>
          </Card>

          {/* DASS-21 */}
          <Card className={`transition-all hover:shadow-lg ${results.dass21 !== undefined ? 'border-emerald-500/40 dark:border-emerald-600/50 bg-emerald-500/5' : 'border-border/80'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-foreground" id="dass21-card-title">DASS-21</CardTitle>
                {results.dass21 !== undefined && (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 gap-1 px-2 py-0.5">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    <span>Done</span>
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs text-muted-foreground font-medium">Depression, Anxiety & Stress</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed">
                Measures depression, anxiety, and stress levels.
              </p>
              <dl className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Questions:</dt>
                  <dd className="font-semibold text-foreground">21</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Duration:</dt>
                  <dd className="font-semibold text-foreground">3-5 min</dd>
                </div>
              </dl>
            </CardContent>
            <CardFooter>
              <Button 
                type="button"
                onClick={() => results.dass21 !== undefined ? retakeSingleAssessment('DASS21') : startAssessment('DASS21')} 
                className="w-full min-h-[44px] rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-teal-400 dark:focus-visible:ring-offset-slate-950 font-medium"
                variant={results.dass21 !== undefined ? "outline" : "default"}
                aria-labelledby="dass21-card-title"
              >
                {results.dass21 !== undefined ? "Retake DASS-21" : "Start DASS-21"}
              </Button>
            </CardFooter>
          </Card>
        </section>

        <Alert role="note" className="border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" aria-hidden="true" />
          <AlertDescription className="text-xs sm:text-sm leading-relaxed">
            <strong className="font-semibold text-foreground">Important Notice:</strong> These assessments are evidence-based screening tools and not diagnostic instruments. 
            If you are experiencing mental health concerns, please consult with a qualified healthcare professional.
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  // Assessment question view
  if (currentAssessment) {
    const questions = getQuestions(currentAssessment);
    const answerOptions = getAnswerOptions(currentAssessment);
    const progress = Math.round(((currentQuestion + 1) / questions.length) * 100);
    const selectedAnswer = answers[currentQuestion];

    const handleSelectAnswer = (value: number) => {
      const updatedAnswers = [...answers];
      updatedAnswers[currentQuestion] = value;
      setAnswers(updatedAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Assessment completed
        const totalScore = updatedAnswers.reduce((sum, answer) => sum + answer, 0);
        setLastCompletedType(currentAssessment);
        
        if (currentAssessment === 'DASS21') {
          const depressionItems = [2, 4, 9, 12, 15, 16, 20];
          const anxietyItems = [1, 3, 6, 8, 14, 18, 19];
          const stressItems = [0, 5, 7, 10, 11, 13, 17];
          
          const depression = depressionItems.reduce((sum, idx) => sum + updatedAnswers[idx], 0) * 2;
          const anxiety = anxietyItems.reduce((sum, idx) => sum + updatedAnswers[idx], 0) * 2;
          const stress = stressItems.reduce((sum, idx) => sum + updatedAnswers[idx], 0) * 2;
          
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

    const handlePreviousQuestion = () => {
      if (currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1);
      }
    };

    const handleRadioKeyDown = (e: React.KeyboardEvent, index: number) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (index + 1) % answerOptions.length;
        handleSelectAnswer(answerOptions[nextIndex].value);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (index - 1 + answerOptions.length) % answerOptions.length;
        handleSelectAnswer(answerOptions[prevIndex].value);
      }
    };

    return (
      <main className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-300" aria-labelledby="mh-screen-heading">
        {/* Header & Progress */}
        <div className="space-y-4 text-center">
          <h1 id="mh-screen-heading" className="sr-only">{currentAssessment} Screening</h1>
          <div className="flex items-center justify-between gap-2">
            <Badge variant="outline" className="text-xs font-semibold px-3 py-1 rounded-full border-teal-500/30 text-teal-800 dark:text-teal-200 bg-teal-500/10" aria-hidden="true">
              {currentAssessment} Screening
            </Badge>
            <p role="status" className="text-xs font-medium text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length} ({progress}%)<span className="sr-only"> — {progress} percent complete</span>
            </p>
          </div>
          
          <div role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-valuetext={`Question ${currentQuestion + 1} of ${questions.length}, ${progress} percent complete`}>
            <Progress value={progress} className="h-2 rounded-full w-full" />
          </div>
          
          <p className="text-xs sm:text-sm text-muted-foreground italic bg-muted/40 p-3.5 rounded-2xl border border-border/50 max-w-xl mx-auto leading-relaxed">
            {getInstruction(currentAssessment)}
          </p>
        </div>

        {/* Question Card */}
        <Card className="rounded-[32px] border-border shadow-sm overflow-hidden bg-card">
          <CardHeader className="pb-4 bg-muted/20 border-b border-border/40">
            <h2 id="mh-question-title" className="text-base sm:text-lg font-semibold text-foreground leading-snug">
              {currentQuestion + 1}. {questions[currentQuestion]}
            </h2>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid gap-3" role="radiogroup" aria-labelledby="mh-question-title">
              {answerOptions.map((option, index) => {
                const isSelected = selectedAnswer === option.value;
                return (
                  <Button
                    key={index}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`Option ${String.fromCharCode(65 + index)}: ${option.label}${isSelected ? ", selected" : ""}`}
                    variant={isSelected ? "default" : "outline"}
                    tabIndex={isSelected || (selectedAnswer === undefined && index === 0) ? 0 : -1}
                    onKeyDown={(e) => handleRadioKeyDown(e, index)}
                    className={`justify-start h-auto min-h-[48px] p-4 text-left rounded-2xl transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-teal-400 dark:focus-visible:ring-offset-slate-950 ${
                      isSelected 
                        ? 'bg-teal-700 hover:bg-teal-800 text-white font-semibold border-teal-700 shadow-md scale-[1.01] ring-2 ring-teal-700/60 dark:bg-teal-600 dark:hover:bg-teal-500 dark:ring-teal-400/60' 
                        : 'hover:bg-muted/60 border-border/60 text-foreground bg-background'
                    }`}
                    onClick={() => handleSelectAnswer(option.value)}
                  >
                    <div className="flex items-center gap-3.5 w-full">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        isSelected 
                          ? 'bg-white/20 text-white' 
                          : 'bg-muted text-muted-foreground'
                      }`} aria-hidden="true">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-sm font-medium leading-relaxed flex-1">{option.label}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-white shrink-0 ml-auto" aria-hidden="true" />
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <Button 
            type="button"
            variant="outline" 
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className="rounded-2xl gap-2 text-xs sm:text-sm min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-teal-400 dark:focus-visible:ring-offset-slate-950 font-medium"
            aria-label="Previous Question"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            Previous
          </Button>

          <Button 
            type="button"
            variant="ghost" 
            onClick={exitToMenu}
            className="rounded-2xl text-xs sm:text-sm text-muted-foreground hover:text-foreground min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-teal-400 dark:focus-visible:ring-offset-slate-950 font-medium"
            aria-label="Save progress and return to Assessment Selection Menu"
          >
            Back to Menu
          </Button>
        </div>
      </main>
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
      <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8 animate-in fade-in duration-300" data-testid="assessment-results" aria-labelledby="results-heading">
        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20" role="status" aria-live="polite">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>Assessment Complete &amp; Analyzed</span>
          </div>
          <h1 id="results-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Your Clinical Self-Assessment Insights
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Review your calculated score breakdown, plain-language summary, key areas of focus, and supportive next steps below.
          </p>
        </div>

        {/* Save-failure recovery banner */}
        {saveError && (
          <div
            className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl border border-rose-500/30 bg-rose-500/10"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" aria-hidden="true" />
            <p className="text-sm text-foreground flex-1">
              Your results couldn&apos;t be saved. They remain visible below — nothing is lost.
            </p>
            <Button
              type="button"
              size="sm"
              onClick={saveAssessmentResults}
              disabled={submitAssessment.isPending}
              className="shrink-0 min-h-[44px]"
              aria-label="Retry saving your assessment results"
            >
              {submitAssessment.isPending ? "Retrying..." : "Retry Save"}
            </Button>
          </div>
        )}

        {/* Assessment Switcher Tabs if multiple taken */}
        <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Assessment result views">
          {results.phq9 !== undefined && (
            <button
              type="button"
              role="tab"
              id="results-tab-PHQ9"
              aria-selected={displayTest === 'PHQ9'}
              aria-controls="assessment-result-panel"
              className={`min-h-[44px] sm:min-h-[38px] px-4 py-1.5 text-xs font-semibold rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 ${
                displayTest === 'PHQ9'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-muted/80 text-foreground hover:bg-muted border border-border/60'
              }`}
              onClick={() => setCurrentAssessment('PHQ9')}
            >
              PHQ-9 Score ({results.phq9}/27)
            </button>
          )}
          {results.gad7 !== undefined && (
            <button
              type="button"
              role="tab"
              id="results-tab-GAD7"
              aria-selected={displayTest === 'GAD7'}
              aria-controls="assessment-result-panel"
              className={`min-h-[44px] sm:min-h-[38px] px-4 py-1.5 text-xs font-semibold rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 ${
                displayTest === 'GAD7'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-muted/80 text-foreground hover:bg-muted border border-border/60'
              }`}
              onClick={() => setCurrentAssessment('GAD7')}
            >
              GAD-7 Score ({results.gad7}/21)
            </button>
          )}
          {results.ghq28 !== undefined && (
            <button
              type="button"
              role="tab"
              id="results-tab-GHQ28"
              aria-selected={displayTest === 'GHQ28'}
              aria-controls="assessment-result-panel"
              className={`min-h-[44px] sm:min-h-[38px] px-4 py-1.5 text-xs font-semibold rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 ${
                displayTest === 'GHQ28'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-muted/80 text-foreground hover:bg-muted border border-border/60'
              }`}
              onClick={() => setCurrentAssessment('GHQ28')}
            >
              GHQ-28 Score ({results.ghq28}/28)
            </button>
          )}
          {results.dass21 !== undefined && (
            <button
              type="button"
              role="tab"
              id="results-tab-DASS21"
              aria-selected={displayTest === 'DASS21'}
              aria-controls="assessment-result-panel"
              className={`min-h-[44px] sm:min-h-[38px] px-4 py-1.5 text-xs font-semibold rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 ${
                displayTest === 'DASS21'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-muted/80 text-foreground hover:bg-muted border border-border/60'
              }`}
              onClick={() => setCurrentAssessment('DASS21')}
            >
              DASS-21 Subscales
            </button>
          )}
        </div>

        {/* Selected Assessment Result Card */}
        {displayTest === 'PHQ9' && results.phq9 !== undefined && phqData && (
          <Card id="assessment-result-panel" role="tabpanel" aria-labelledby="results-tab-PHQ9" tabIndex={0} className="rounded-[32px] border-border shadow-sm overflow-hidden bg-card">
            <CardHeader className="border-b border-border/50 pb-6 bg-muted/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Badge variant="outline" className="mb-2 text-xs font-medium">PHQ-9 Screening</Badge>
                  <CardTitle id="phq9-result-title" className="text-xl sm:text-2xl font-bold text-foreground">Depression Score Analysis</CardTitle>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-3xl font-extrabold text-foreground" aria-label={`PHQ-9 score: ${results.phq9} out of 27`}>{results.phq9} <span className="text-sm font-normal text-muted-foreground" aria-hidden="true">/ 27</span></div>
                  </div>
                  <Badge className={`px-3 py-1 text-xs font-semibold rounded-full ${phqData.colorClass}`}>
                    <span className="sr-only">Severity: </span>{phqData.severity}
                  </Badge>
                </div>
              </div>
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
                  <span>Score Intensity</span>
                  <span>{Math.round((results.phq9 / 27) * 100)}%</span>
                </div>
                <div role="progressbar" aria-valuenow={Math.round((results.phq9 / 27) * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={`PHQ-9 score intensity: ${Math.round((results.phq9 / 27) * 100)} percent`}>
                  <Progress value={(results.phq9 / 27) * 100} className="h-2.5 rounded-full" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                  What Your Score Means
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-2xl border border-border/40">
                  {phqData.explanation}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Sparkles className="w-4 h-4 text-amber-500" aria-hidden="true" />
                  Key Areas of Focus
                </h3>
                <ul className="flex flex-wrap items-center gap-2" aria-label="Key focus areas">
                  {phqData.focusAreas.map((area, idx) => (
                    <li key={idx}>
                      <Badge 
                        variant="secondary" 
                        className="inline-flex items-center h-6 px-2.5 py-0.5 rounded-full text-xs font-medium border border-border/40 shrink-0 whitespace-nowrap"
                      >
                        {area}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  Suggested Next Steps
                </h3>
                <ul className="space-y-2.5">
                  {phqData.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {displayTest === 'GAD7' && results.gad7 !== undefined && gadData && (
          <Card id="assessment-result-panel" role="tabpanel" aria-labelledby="results-tab-GAD7" tabIndex={0} className="rounded-[32px] border-border shadow-sm overflow-hidden bg-card">
            <CardHeader className="border-b border-border/50 pb-6 bg-muted/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Badge variant="outline" className="mb-2 text-xs font-medium">GAD-7 Screening</Badge>
                  <CardTitle id="gad7-result-title" className="text-xl sm:text-2xl font-bold text-foreground">Anxiety Score Analysis</CardTitle>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-3xl font-extrabold text-foreground" aria-label={`GAD-7 score: ${results.gad7} out of 21`}>{results.gad7} <span className="text-sm font-normal text-muted-foreground" aria-hidden="true">/ 21</span></div>
                  </div>
                  <Badge className={`px-3 py-1 text-xs font-semibold rounded-full ${gadData.colorClass}`}>
                    <span className="sr-only">Severity: </span>{gadData.severity}
                  </Badge>
                </div>
              </div>
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
                  <span>Anxiety Level Gauge</span>
                  <span>{Math.round((results.gad7 / 21) * 100)}%</span>
                </div>
                <div role="progressbar" aria-valuenow={Math.round((results.gad7 / 21) * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={`GAD-7 anxiety level: ${Math.round((results.gad7 / 21) * 100)} percent`}>
                  <Progress value={(results.gad7 / 21) * 100} className="h-2.5 rounded-full" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                  What Your Score Means
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-2xl border border-border/40">
                  {gadData.explanation}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Sparkles className="w-4 h-4 text-amber-500" aria-hidden="true" />
                  Key Areas of Focus
                </h3>
                <ul className="flex flex-wrap items-center gap-2" aria-label="Key focus areas">
                  {gadData.focusAreas.map((area, idx) => (
                    <li key={idx}>
                      <Badge variant="secondary" className="inline-flex items-center h-6 px-2.5 py-0.5 rounded-full text-xs font-medium border border-border/40 shrink-0 whitespace-nowrap">
                        {area}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  Suggested Next Steps
                </h3>
                <ul className="space-y-2.5">
                  {gadData.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {displayTest === 'GHQ28' && results.ghq28 !== undefined && ghqData && (
          <Card id="assessment-result-panel" role="tabpanel" aria-labelledby="results-tab-GHQ28" tabIndex={0} className="rounded-[32px] border-border shadow-sm overflow-hidden bg-card">
            <CardHeader className="border-b border-border/50 pb-6 bg-muted/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Badge variant="outline" className="mb-2 text-xs font-medium">GHQ-28 Questionnaire</Badge>
                  <CardTitle id="ghq28-result-title" className="text-xl sm:text-2xl font-bold text-foreground">General Health &amp; Wellbeing Analysis</CardTitle>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-3xl font-extrabold text-foreground" aria-label={`GHQ-28 score: ${results.ghq28} out of 28`}>{results.ghq28} <span className="text-sm font-normal text-muted-foreground" aria-hidden="true">/ 28</span></div>
                  </div>
                  <Badge className={`px-3 py-1 text-xs font-semibold rounded-full border border-current/20 shrink-0 whitespace-nowrap ${ghqData.colorClass}`}>
                    <span className="sr-only">Severity: </span>{ghqData.severity}
                  </Badge>
                </div>
              </div>
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
                  <span>General Distress Indicator</span>
                  <span>{Math.round((results.ghq28 / 28) * 100)}%</span>
                </div>
                <div role="progressbar" aria-valuenow={Math.round((results.ghq28 / 28) * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={`GHQ-28 distress level: ${Math.round((results.ghq28 / 28) * 100)} percent`}>
                  <Progress value={(results.ghq28 / 28) * 100} className="h-2.5 rounded-full" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                  What Your Score Means
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-2xl border border-border/40">
                  {ghqData.explanation}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Sparkles className="w-4 h-4 text-amber-500" aria-hidden="true" />
                  Key Areas of Focus
                </h3>
                <ul className="flex flex-wrap items-center gap-2" aria-label="Key focus areas">
                  {ghqData.focusAreas.map((area, idx) => (
                    <li key={idx}>
                      <Badge variant="secondary" className="inline-flex items-center h-6 px-2.5 py-0.5 rounded-full text-xs font-medium border border-border/40 shrink-0 whitespace-nowrap">
                        {area}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  Suggested Next Steps
                </h3>
                <ul className="space-y-2.5">
                  {ghqData.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {displayTest === 'DASS21' && results.dass21 !== undefined && dassData && (
          <Card id="assessment-result-panel" role="tabpanel" aria-labelledby="results-tab-DASS21" tabIndex={0} className="rounded-[32px] border-border shadow-sm overflow-hidden bg-card">
            <CardHeader className="border-b border-border/50 pb-6 bg-muted/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Badge variant="outline" className="mb-2 text-xs font-medium">DASS-21 Multidimensional Scale</Badge>
                  <CardTitle id="dass21-result-title" className="text-xl sm:text-2xl font-bold text-foreground">Depression, Anxiety &amp; Stress Profile</CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* 3 Subscale Cards */}
              <div className="grid gap-4 sm:grid-cols-3" role="list" aria-label="DASS-21 Subscale Scores">
                <div className="p-4 rounded-2xl border border-border/60 bg-muted/20 space-y-3" role="listitem">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-foreground">Depression</span>
                    <Badge className={`inline-flex items-center h-5 px-2 py-0 text-[10px] font-semibold rounded-full border border-current/20 shrink-0 whitespace-nowrap ${dassData.depression.badgeColor}`}>
                      <span className="sr-only">Level: </span>{dassData.depression.level}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-foreground" aria-label={`Depression score: ${dassData.depression.score} out of 42`}>
                    {dassData.depression.score} <span className="text-xs text-muted-foreground font-normal" aria-hidden="true">/ 42</span>
                  </div>
                  <div role="progressbar" aria-valuenow={Math.round((dassData.depression.score / 42) * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={`Depression score: ${Math.round((dassData.depression.score / 42) * 100)} percent`}>
                    <Progress value={(dassData.depression.score / 42) * 100} className="h-2" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-border/60 bg-muted/20 space-y-3" role="listitem">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-foreground">Anxiety</span>
                    <Badge className={`inline-flex items-center h-5 px-2 py-0 text-[10px] font-semibold rounded-full border border-current/20 shrink-0 whitespace-nowrap ${dassData.anxiety.badgeColor}`}>
                      <span className="sr-only">Level: </span>{dassData.anxiety.level}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-foreground" aria-label={`Anxiety score: ${dassData.anxiety.score} out of 42`}>
                    {dassData.anxiety.score} <span className="text-xs text-muted-foreground font-normal" aria-hidden="true">/ 42</span>
                  </div>
                  <div role="progressbar" aria-valuenow={Math.round((dassData.anxiety.score / 42) * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={`Anxiety score: ${Math.round((dassData.anxiety.score / 42) * 100)} percent`}>
                    <Progress value={(dassData.anxiety.score / 42) * 100} className="h-2" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-border/60 bg-muted/20 space-y-3" role="listitem">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-foreground">Stress</span>
                    <Badge className={`inline-flex items-center h-5 px-2 py-0 text-[10px] font-semibold rounded-full border border-current/20 shrink-0 whitespace-nowrap ${dassData.stress.badgeColor}`}>
                      <span className="sr-only">Level: </span>{dassData.stress.level}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-foreground" aria-label={`Stress score: ${dassData.stress.score} out of 42`}>
                    {dassData.stress.score} <span className="text-xs text-muted-foreground font-normal" aria-hidden="true">/ 42</span>
                  </div>
                  <div role="progressbar" aria-valuenow={Math.round((dassData.stress.score / 42) * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={`Stress score: ${Math.round((dassData.stress.score / 42) * 100)} percent`}>
                    <Progress value={(dassData.stress.score / 42) * 100} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                  What Your Score Means
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-2xl border border-border/40">
                  {dassData.explanation}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Sparkles className="w-4 h-4 text-amber-500" aria-hidden="true" />
                  Key Areas of Focus
                </h3>
                <ul className="flex flex-wrap items-center gap-2" aria-label="Key focus areas">
                  {dassData.focusAreas.map((area, idx) => (
                    <li key={idx}>
                      <Badge variant="secondary" className="inline-flex items-center h-6 px-2.5 py-0.5 rounded-full text-xs font-medium border border-border/40 shrink-0 whitespace-nowrap">
                        {area}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  Suggested Next Steps
                </h3>
                <ul className="space-y-2.5">
                  {dassData.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Action Navigation Grid */}
        <nav aria-label="Take Action in Clarity" className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground px-1">Take Action in Clarity</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/diary"
              className="group p-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all flex flex-col justify-between space-y-2 min-h-[72px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-teal-400 dark:focus-visible:ring-offset-slate-950"
              aria-label="Go to Emotional Diary — Journal your thoughts and triggers"
            >
              <div className="flex justify-between items-center">
                <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                <ArrowRight className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </div>
              <div>
                <div className="font-semibold text-xs text-foreground">Emotional Diary</div>
                <div className="text-[11px] text-muted-foreground">Journal your thoughts &amp; triggers</div>
              </div>
            </Link>

            <Link
              href="/ai-buddy"
              className="group p-4 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-all flex flex-col justify-between space-y-2 min-h-[72px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-teal-400 dark:focus-visible:ring-offset-slate-950"
              aria-label="Go to AI Companion — Talk with an empathetic assistant"
            >
              <div className="flex justify-between items-center">
                <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                <ArrowRight className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </div>
              <div>
                <div className="font-semibold text-xs text-foreground">AI Companion</div>
                <div className="text-[11px] text-muted-foreground">Talk with an empathetic assistant</div>
              </div>
            </Link>

            <Link
              href="/crisis"
              className="group p-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all flex flex-col justify-between space-y-2 min-h-[72px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-teal-400 dark:focus-visible:ring-offset-slate-950"
              aria-label="Go to Counselor and Crisis Support — Access professional resources"
            >
              <div className="flex justify-between items-center">
                <LifeBuoy className="w-5 h-5 text-rose-600 dark:text-rose-400" aria-hidden="true" />
                <ArrowRight className="w-4 h-4 text-rose-600 dark:text-rose-400 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </div>
              <div>
                <div className="font-semibold text-xs text-foreground">Counselor &amp; Crisis Support</div>
                <div className="text-[11px] text-muted-foreground">Access professional resources</div>
              </div>
            </Link>
          </div>
        </nav>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button 
            type="button"
            onClick={saveAssessmentResults} 
            size="lg"
            disabled={submitAssessment.isPending}
            aria-busy={submitAssessment.isPending}
            aria-label={submitAssessment.isPending ? "Saving results, please wait" : "Confirm and save assessment results"}
            data-testid="button-save-assessment"
            className="gap-2 rounded-2xl min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-teal-400 dark:focus-visible:ring-offset-slate-950 font-medium"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            {submitAssessment.isPending ? "Saving..." : "Confirm & Save Results"}
          </Button>
          <Button 
            type="button"
            onClick={() => retakeSingleAssessment(displayTest)} 
            variant="outline" 
            size="lg" 
            aria-label={`Retake the ${displayTest} assessment`}
            className="gap-2 rounded-2xl min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-teal-400 dark:focus-visible:ring-offset-slate-950 font-medium"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Retake Assessment
          </Button>
          <Button 
            type="button"
            onClick={() => setIsCompleted(false)} 
            size="lg" 
            variant="ghost" 
            aria-label="Return to Assessments Menu"
            className="rounded-2xl min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-teal-400 dark:focus-visible:ring-offset-slate-950 font-medium"
          >
            Return to Assessments Menu
          </Button>
        </div>

        {/* Non-Diagnostic Disclaimer */}
        <Alert role="note" className="rounded-2xl border-purple-500/20 bg-purple-500/10 text-purple-950 dark:text-purple-200">
          <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" aria-hidden="true" />
          <AlertDescription className="text-xs text-muted-foreground leading-relaxed">
            <strong className="font-semibold text-foreground">Clinical Disclaimer:</strong> These self-assessments (PHQ-9, GAD-7, GHQ-28, DASS-21) are evidence-based screening tools designed to help monitor wellbeing trends. They do not constitute a formal clinical diagnosis. If you are experiencing distress, please consult a qualified medical or mental health professional.
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  return null;
}

