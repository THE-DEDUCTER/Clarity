"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Brain, 
  Heart, 
  Target, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  Shield,
  Sparkles,
  Compass,
  ArrowRight,
  BookOpen,
  MessageSquare,
  LifeBuoy,
  RotateCcw
} from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface QuizQuestion {
  id: string;
  category: 'phq9' | 'gad7' | 'ghq';
  question: string;
  options: {
    value: number;
    label: string;
  }[];
}

interface QuizResults {
  phq9Score: number;
  gad7Score: number;
  ghqScore: number;
  phq9Level: string;
  gad7Level: string;
  ghqLevel: string;
  recommendations: string[];
  riskLevel: 'low' | 'moderate' | 'high';
}

const phq9Questions: QuizQuestion[] = [
  {
    id: 'phq9-1',
    category: 'phq9',
    question: 'Little interest or pleasure in doing things',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'phq9-2',
    category: 'phq9',
    question: 'Feeling down, depressed, or hopeless',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'phq9-3',
    category: 'phq9',
    question: 'Trouble falling or staying asleep, or sleeping too much',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'phq9-4',
    category: 'phq9',
    question: 'Feeling tired or having little energy',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'phq9-5',
    category: 'phq9',
    question: 'Poor appetite or overeating',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  }
];

const gad7Questions: QuizQuestion[] = [
  {
    id: 'gad7-1',
    category: 'gad7',
    question: 'Feeling nervous, anxious, or on edge',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'gad7-2',
    category: 'gad7',
    question: 'Not being able to stop or control worrying',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'gad7-3',
    category: 'gad7',
    question: 'Worrying too much about different things',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'gad7-4',
    category: 'gad7',
    question: 'Trouble relaxing',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'gad7-5',
    category: 'gad7',
    question: 'Being so restless that it is hard to sit still',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  }
];

const ghqQuestions: QuizQuestion[] = [
  {
    id: 'ghq-1',
    category: 'ghq',
    question: 'Been able to concentrate on whatever you\'re doing',
    options: [
      { value: 0, label: 'Better than usual' },
      { value: 1, label: 'Same as usual' },
      { value: 2, label: 'Less than usual' },
      { value: 3, label: 'Much less than usual' }
    ]
  },
  {
    id: 'ghq-2',
    category: 'ghq',
    question: 'Lost much sleep over worry',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'No more than usual' },
      { value: 2, label: 'Rather more than usual' },
      { value: 3, label: 'Much more than usual' }
    ]
  },
  {
    id: 'ghq-3',
    category: 'ghq',
    question: 'Felt that you are playing a useful part in things',
    options: [
      { value: 0, label: 'More so than usual' },
      { value: 1, label: 'Same as usual' },
      { value: 2, label: 'Less than usual' },
      { value: 3, label: 'Much less than usual' }
    ]
  },
  {
    id: 'ghq-4',
    category: 'ghq',
    question: 'Felt capable of making decisions about things',
    options: [
      { value: 0, label: 'More so than usual' },
      { value: 1, label: 'Same as usual' },
      { value: 2, label: 'Less than usual' },
      { value: 3, label: 'Much less than usual' }
    ]
  },
  {
    id: 'ghq-5',
    category: 'ghq',
    question: 'Felt constantly under strain',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'No more than usual' },
      { value: 2, label: 'Rather more than usual' },
      { value: 3, label: 'Much more than usual' }
    ]
  }
];

const allQuestions = [...phq9Questions, ...gad7Questions, ...ghqQuestions];

export function OnboardingQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState<QuizResults | null>(null);

  const totalSteps = allQuestions.length + 1; // +1 for introduction
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateResults = (): QuizResults => {
    const phq9Score = phq9Questions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    const gad7Score = gad7Questions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    const ghqScore = ghqQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);

    // PHQ-9 Depression levels
    let phq9Level = 'Minimal';
    if (phq9Score >= 15) phq9Level = 'Severe';
    else if (phq9Score >= 10) phq9Level = 'Moderate';
    else if (phq9Score >= 5) phq9Level = 'Mild';

    // GAD-7 Anxiety levels
    let gad7Level = 'Minimal';
    if (gad7Score >= 15) gad7Level = 'Severe';
    else if (gad7Score >= 10) gad7Level = 'Moderate';
    else if (gad7Score >= 5) gad7Level = 'Mild';

    // GHQ General health levels
    let ghqLevel = 'Good';
    if (ghqScore >= 15) ghqLevel = 'Poor';
    else if (ghqScore >= 10) ghqLevel = 'Moderate concern';
    else if (ghqScore >= 5) ghqLevel = 'Some concern';

    // Risk assessment
    let riskLevel: 'low' | 'moderate' | 'high' = 'low';
    if (phq9Score >= 10 || gad7Score >= 10 || ghqScore >= 15) {
      riskLevel = 'high';
    } else if (phq9Score >= 5 || gad7Score >= 5 || ghqScore >= 10) {
      riskLevel = 'moderate';
    }

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (phq9Score >= 10) {
      recommendations.push('Consider speaking with a counselor about depression symptoms');
      recommendations.push('Establish a regular sleep schedule and daily routine');
    }
    
    if (gad7Score >= 10) {
      recommendations.push('Practice anxiety management techniques like deep breathing');
      recommendations.push('Consider mindfulness and meditation practices');
    }
    
    if (ghqScore >= 10) {
      recommendations.push('Focus on stress management and self-care activities');
      recommendations.push('Connect with supportive friends and family');
    }

    if (riskLevel === 'low') {
      recommendations.push('Continue maintaining good mental health habits');
      recommendations.push('Use our wellness tracking features to monitor your mood');
    }

    return {
      phq9Score,
      gad7Score,
      ghqScore,
      phq9Level,
      gad7Level,
      ghqLevel,
      recommendations,
      riskLevel
    };
  };

  const handleNext = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
    } else if (currentStep < allQuestions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Quiz completed
      const calculatedResults = calculateResults();
      setResults(calculatedResults);
      setIsCompleted(true);
      
      // Save results to localStorage (in real app, would save to backend)
      localStorage.setItem('onboardingResults', JSON.stringify(calculatedResults));
      localStorage.setItem('onboardingCompleted', 'true');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    if (currentStep === 0) return true;
    if (currentStep <= allQuestions.length) {
      const currentQuestion = allQuestions[currentStep - 1];
      return answers[currentQuestion.id] !== undefined;
    }
    return false;
  };

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
      case 'moderate': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
      case 'high': return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
      default: return 'bg-muted text-foreground border-border';
    }
  };

  const getRiskDescription = (level: 'low' | 'moderate' | 'high') => {
    switch (level) {
      case 'low':
        return 'Your initial screening indicates a low risk profile across emotional wellbeing indicators. Keep building healthy coping routines, regular sleep patterns, and mindfulness habits.';
      case 'moderate':
        return 'Your answers indicate mild-to-moderate emotional strain in one or more areas. We recommend engaging with self-care tools like our Emotional Diary and AI Companion, or reaching out to campus support.';
      case 'high':
        return 'Your responses indicate noticeable distress or emotional challenge. We strongly encourage taking proactive steps, utilizing campus support services, or talking with a licensed healthcare professional.';
    }
  };

  if (isCompleted && results) {
    const phq9Percentage = Math.round((results.phq9Score / 15) * 100);
    const gad7Percentage = Math.round((results.gad7Score / 15) * 100);
    const ghqPercentage = Math.round((results.ghqScore / 15) * 100);

    return (
      <div className="space-y-6" data-testid="quiz-results">
        {/* Header Hero Card */}
        <Card className="border-teal-200/60 dark:border-teal-800/40 bg-gradient-to-br from-teal-50/70 via-emerald-50/40 to-cyan-50/50 dark:from-teal-950/30 dark:via-emerald-950/20 dark:to-cyan-950/20 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <Badge variant="outline" className="bg-white/80 dark:bg-slate-900/80 border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-300">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-teal-600 dark:text-teal-400" />
                Initial Screening Completed
              </Badge>
              <span className="text-xs text-muted-foreground font-medium">Non-diagnostic assessment</span>
            </div>
            <CardTitle className="text-2xl font-bold text-teal-950 dark:text-teal-100 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              Your Onboarding Results & Baseline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Thank you for completing your initial mental health baseline. Your responses have been evaluated across three standardized screening scales (PHQ-9 for mood, GAD-7 for anxiety, and GHQ for general health).
            </p>
          </CardContent>
        </Card>

        {/* Overall Risk Profile Alert */}
        <Card className={`border ${getRiskLevelColor(results.riskLevel)}`}>
          <CardContent className="p-4 flex items-start gap-3">
            {results.riskLevel === 'high' ? (
              <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <Shield className="w-6 h-6 text-teal-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-base capitalize">Overall Risk Level: {results.riskLevel}</h4>
                <Badge className={getRiskLevelColor(results.riskLevel)}>
                  {results.riskLevel.toUpperCase()} RISK
                </Badge>
              </div>
              <p className="text-sm leading-relaxed opacity-90">
                {getRiskDescription(results.riskLevel)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Breakdown Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* PHQ-9 Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Depression (PHQ-9)
                </CardTitle>
                <Badge className={getRiskLevelColor(results.phq9Level.toLowerCase())}>
                  {results.phq9Level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold">{results.phq9Score}</span>
                <span className="text-xs text-muted-foreground">out of 15 max</span>
              </div>
              <Progress value={phq9Percentage} className="h-2" />
              
              <div className="pt-2 border-t text-xs text-muted-foreground space-y-1.5">
                <p className="font-medium text-foreground">Focus Areas:</p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline" className="inline-flex items-center h-5 px-2 py-0 text-[10px] font-medium shrink-0 whitespace-nowrap">Mood Stability</Badge>
                  <Badge variant="outline" className="inline-flex items-center h-5 px-2 py-0 text-[10px] font-medium shrink-0 whitespace-nowrap">Daily Energy</Badge>
                  <Badge variant="outline" className="inline-flex items-center h-5 px-2 py-0 text-[10px] font-medium shrink-0 whitespace-nowrap">Sleep Patterns</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GAD-7 Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Heart className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  Anxiety (GAD-7)
                </CardTitle>
                <Badge className={`inline-flex items-center h-5 px-2 py-0 text-[10px] font-semibold rounded-full border border-current/20 shrink-0 whitespace-nowrap ${getRiskLevelColor(results.gad7Level.toLowerCase())}`}>
                  {results.gad7Level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold">{results.gad7Score}</span>
                <span className="text-xs text-muted-foreground">out of 15 max</span>
              </div>
              <Progress value={gad7Percentage} className="h-2" />

              <div className="pt-2 border-t text-xs text-muted-foreground space-y-1.5">
                <p className="font-medium text-foreground">Focus Areas:</p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline" className="inline-flex items-center h-5 px-2 py-0 text-[10px] font-medium shrink-0 whitespace-nowrap">Worry Control</Badge>
                  <Badge variant="outline" className="inline-flex items-center h-5 px-2 py-0 text-[10px] font-medium shrink-0 whitespace-nowrap">Nervousness</Badge>
                  <Badge variant="outline" className="inline-flex items-center h-5 px-2 py-0 text-[10px] font-medium shrink-0 whitespace-nowrap">Restlessness</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GHQ Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  General Health (GHQ)
                </CardTitle>
                <Badge className={`inline-flex items-center h-5 px-2 py-0 text-[10px] font-semibold rounded-full border border-current/20 shrink-0 whitespace-nowrap ${getRiskLevelColor(results.ghqLevel.toLowerCase())}`}>
                  {results.ghqLevel}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold">{results.ghqScore}</span>
                <span className="text-xs text-muted-foreground">out of 15 max</span>
              </div>
              <Progress value={ghqPercentage} className="h-2" />

              <div className="pt-2 border-t text-xs text-muted-foreground space-y-1.5">
                <p className="font-medium text-foreground">Focus Areas:</p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline" className="inline-flex items-center h-5 px-2 py-0 text-[10px] font-medium shrink-0 whitespace-nowrap">Stress Load</Badge>
                  <Badge variant="outline" className="inline-flex items-center h-5 px-2 py-0 text-[10px] font-medium shrink-0 whitespace-nowrap">Work Strain</Badge>
                  <Badge variant="outline" className="inline-flex items-center h-5 px-2 py-0 text-[10px] font-medium shrink-0 whitespace-nowrap">Somatic Health</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personalized Recommendations */}
        <Card className="border-teal-100 dark:border-teal-900">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Compass className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              Personalized Next Steps & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="grid gap-3 sm:grid-cols-2">
              {results.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                  <span className="leading-snug">{rec}</span>
                </li>
              ))}
            </ul>

            {/* Recommended Tools Grid */}
            <div className="pt-3 border-t">
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Explore Clarity Tools for You</h5>
              <div className="grid gap-3 sm:grid-cols-3">
                <Link href="/dashboard">
                  <div className="p-3 rounded-lg border bg-card hover:bg-accent transition-colors flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-medium">My Dashboard</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>

                <Link href="/diary">
                  <div className="p-3 rounded-lg border bg-card hover:bg-accent transition-colors flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium">Emotional Diary</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>

                <Link href="/ai-buddy">
                  <div className="p-3 rounded-lg border bg-card hover:bg-accent transition-colors flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-teal-600" />
                      <span className="text-xs font-medium">AI Companion</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Crisis Alert if High Risk */}
        {results.riskLevel === 'high' && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Support Available</AlertTitle>
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-1">
              <span>Your responses indicate elevated stress or discomfort. Immediate support and counselor assistance are ready for you.</span>
              <Link href="/crisis">
                <Button size="sm" variant="secondary" className="shrink-0 gap-1 mt-2 sm:mt-0">
                  <LifeBuoy className="w-3.5 h-3.5" />
                  Crisis Support
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Retake and Continue Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Button 
            variant="outline" 
            onClick={() => {
              setIsCompleted(false);
              setCurrentStep(0);
              setAnswers({});
              setResults(null);
            }}
            className="w-full sm:w-auto gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Screening
          </Button>

          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white gap-2">
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Privacy & Non-diagnostic Banner */}
        <Alert className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <Shield className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <AlertTitle className="text-xs font-semibold">Privacy & Non-Diagnostic Disclaimer</AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground">
            This screening tool is designed purely for personal awareness and wellness tracking. It does not provide a formal medical or clinical diagnosis. If you are experiencing distress, please consult a qualified mental health professional or counselor.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="onboarding-quiz">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Mental Health Assessment</CardTitle>
            <Badge variant="outline">{currentStep}/{totalSteps - 1}</Badge>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
      </Card>

      {/* Introduction Step */}
      {currentStep === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-600" />
              Welcome to Your Mental Health Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This brief assessment will help us understand your current mental health and provide personalized support. 
              It includes three standardized screening tools:
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Brain className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium">PHQ-9 Depression Screen</div>
                  <div className="text-sm text-muted-foreground">Assesses symptoms of depression</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <Heart className="w-5 h-5 text-red-600" />
                <div>
                  <div className="font-medium">GAD-7 Anxiety Screen</div>
                  <div className="text-sm text-muted-foreground">Evaluates anxiety symptoms</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Target className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium">GHQ General Health</div>
                  <div className="text-sm text-muted-foreground">Overall mental wellbeing assessment</div>
                </div>
              </div>
            </div>
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>Your Privacy Matters</AlertTitle>
              <AlertDescription>
                Your responses are confidential and will only be used to provide personalized recommendations. 
                This is not a medical diagnosis.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Question Steps */}
      {currentStep > 0 && currentStep <= allQuestions.length && (
        <Card className="rounded-[32px] border-border shadow-sm overflow-hidden">
          <CardHeader className="pb-4 bg-muted/20 border-b border-border/40">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              {allQuestions[currentStep - 1].category === 'phq9' && <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
              {allQuestions[currentStep - 1].category === 'gad7' && <Heart className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
              {allQuestions[currentStep - 1].category === 'ghq' && <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
              <span className="uppercase tracking-wider text-[11px] font-bold">{allQuestions[currentStep - 1].category} Assessment</span>
            </div>
            <CardTitle className="text-base sm:text-lg font-semibold text-foreground leading-snug mt-1">
              Over the last 2 weeks, how often have you been bothered by:
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-6">
            <h3 className="text-sm sm:text-base font-medium text-foreground bg-muted/30 p-3.5 rounded-2xl border border-border/40">
              {currentStep}. {allQuestions[currentStep - 1].question}
            </h3>
            
            <RadioGroup
              value={answers[allQuestions[currentStep - 1].id]?.toString() ?? ""}
              onValueChange={(value) => handleAnswer(allQuestions[currentStep - 1].id, parseInt(value))}
              className="grid gap-3"
            >
              {allQuestions[currentStep - 1].options.map((option, idx) => {
                const isSelected = answers[allQuestions[currentStep - 1].id] === option.value;
                return (
                  <Label
                    key={option.value}
                    htmlFor={`option-${option.value}`}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-900 dark:text-teal-100 shadow-sm'
                        : 'border-border/60 hover:bg-muted/50 text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        isSelected 
                          ? 'bg-teal-600 text-white' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm font-medium leading-relaxed">{option.label}</span>
                    </div>
                    <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} className="shrink-0" />
                  </Label>
                );
              })}
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="rounded-2xl gap-2 text-xs sm:text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="rounded-2xl gap-2 text-xs sm:text-sm bg-teal-600 hover:bg-teal-700 text-white"
        >
          {currentStep === allQuestions.length ? 'Complete Assessment' : 'Next'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}