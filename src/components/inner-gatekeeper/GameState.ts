"use client";

export type ChamberType = 'gate' | 'courtyard' | 'watchtower' | 'inner-hall' | 'inner-chamber';

export interface ChamberInfo {
  id: ChamberType;
  title: string;
  stepNumber: string;
  description: string;
}

export const CHAMBERS: ChamberInfo[] = [
  { id: 'gate', title: 'The Gate', stepNumber: 'I', description: 'Notice the initial arrival of a thought or emotion.' },
  { id: 'courtyard', title: 'The Courtyard', stepNumber: 'II', description: 'Observe the felt sensation without judgment.' },
  { id: 'watchtower', title: 'The Watchtower', stepNumber: 'III', description: 'Thought Gate: Examine the perspective.' },
  { id: 'inner-hall', title: 'The Inner Hall', stepNumber: 'IV', description: 'Choose a conscious, grounded response.' },
  { id: 'inner-chamber', title: 'The Inner Chamber', stepNumber: 'V', description: 'Reflect on the patterns of your inner sanctuary.' },
];

export type ThoughtNature = 'FACT' | 'ASSUMPTION' | 'FEAR';
export type ResponseAction = 'acknowledge' | 'explore' | 'release';

export interface Emotion {
  id: string;
  name: string;
  description: string;
  category: 'grounding' | 'challenging' | 'expansive';
  color: string;
  glowColor: string;
  thought: string;
  thoughtNature: ThoughtNature;
  thoughtExplanation: string;
  effects: {
    accept: { health: number; peace: number; score: number; message: string };
    reject: { health: number; peace: number; score: number; message: string };
  };
  bestChoice: 'accept' | 'reject';
  insight: string;
}

export interface EncounterRecord {
  emotion: Emotion;
  thoughtChoice: ThoughtNature;
  wasThoughtAccurate: boolean;
  actionChoice: ResponseAction;
}

export interface GameState {
  castleHealth: number; // 0-100 (Castle Integrity)
  innerPeace: number; // 0-100 (Inner Peace)
  weather: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  gatekeeperMood: 'peaceful' | 'concerned' | 'worried' | 'stressed' | 'anxious';
  score: number;
  level: number;
  emotionsHandled: number;
  correctChoices: number;
  chamberIndex: number; // 0-4
  history: EncounterRecord[];
}

export const emotions: Emotion[] = [
  {
    id: 'worry',
    name: 'Worry',
    description: 'Anxious anticipation regarding future uncertainties.',
    category: 'challenging',
    color: '#8B5CF6',
    glowColor: 'rgba(139, 92, 246, 0.35)',
    thought: '"What if something goes wrong and I am unprepared to handle it?"',
    thoughtNature: 'FEAR',
    thoughtExplanation: 'Worry projects imagined catastrophes into the future. Recognizing it as fear helps you stay anchored in what is actionable today.',
    effects: {
      accept: { health: -8, peace: -12, score: 2, message: 'Dwelling on ungrounded worry obscures clarity in your inner space.' },
      reject: { health: 8, peace: 14, score: 10, message: 'You release the imagined threat. The atmosphere returns to calm balance.' },
    },
    bestChoice: 'reject',
    insight: 'Worry is anticipation of trouble before it exists. Focus on what you can influence now.'
  },
  {
    id: 'happiness',
    name: 'Happiness',
    description: 'A genuine sense of contentment and lightness.',
    category: 'expansive',
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    thought: '"This is a genuine moment of lightness and ease in my day."',
    thoughtNature: 'FACT',
    thoughtExplanation: 'This moment of contentment is real and present. Embracing it fortifies your mental wellbeing.',
    effects: {
      accept: { health: 12, peace: 18, score: 10, message: 'Embracing contentment brings warmth and steadiness to your inner sanctuary.' },
      reject: { health: -4, peace: -10, score: 0, message: 'Dismissing ease leaves the inner environment colder than necessary.' },
    },
    bestChoice: 'accept',
    insight: 'Contentment is an essential foundation for mental resilience.'
  },
  {
    id: 'self-doubt',
    name: 'Self-Doubt',
    description: 'Internal uncertainty questioning competence and readiness.',
    category: 'challenging',
    color: '#64748B',
    glowColor: 'rgba(100, 116, 139, 0.35)',
    thought: '"Everyone else seems to know what they are doing except me."',
    thoughtNature: 'ASSUMPTION',
    thoughtExplanation: 'You are comparing your internal uncertainties to external presentations. It is an unverified assumption.',
    effects: {
      accept: { health: -14, peace: -18, score: 0, message: 'Unchecked self-criticism weakens your confidence.' },
      reject: { health: 10, peace: 14, score: 10, message: 'You question the doubtful assumption and uphold your self-trust.' },
    },
    bestChoice: 'reject',
    insight: 'Self-doubt is an internal narrative, not an objective truth. Question the inner critic.'
  },
  {
    id: 'joy',
    name: 'Joy',
    description: 'An open, revitalizing feeling of connection and vitality.',
    category: 'expansive',
    color: '#D97706',
    glowColor: 'rgba(217, 119, 6, 0.35)',
    thought: '"I feel present, engaged, and grateful for this experience."',
    thoughtNature: 'FACT',
    thoughtExplanation: 'Joy reinforces your connection to what is meaningful in your daily life.',
    effects: {
      accept: { health: 14, peace: 20, score: 12, message: 'Welcoming joy illuminates your inner world with clarity.' },
      reject: { health: 0, peace: -12, score: 0, message: 'Holding back from joy dims your natural vitality.' },
    },
    bestChoice: 'accept',
    insight: 'Joy is renewal. Allowing it in strengthens your emotional capacity.'
  },
  {
    id: 'anger',
    name: 'Anger',
    description: 'A surge of tension responding to a perceived boundary breach.',
    category: 'challenging',
    color: '#DC2626',
    glowColor: 'rgba(220, 38, 38, 0.35)',
    thought: '"They crossed my boundaries deliberately and I must react immediately."',
    thoughtNature: 'ASSUMPTION',
    thoughtExplanation: 'Anger frequently assumes malicious intent where there may only be misalignment or oversight.',
    effects: {
      accept: { health: -16, peace: -20, score: 0, message: 'Impulsive anger disrupts internal calm.' },
      reject: { health: 8, peace: 12, score: 10, message: 'You pause and steady your response. Boundaries are maintained with composure.' },
    },
    bestChoice: 'reject',
    insight: 'Anger signals a boundary, but composure protects your peace.'
  },
  {
    id: 'gratitude',
    name: 'Gratitude',
    description: 'A grounded appreciation for supportive realities in your life.',
    category: 'grounding',
    color: '#059669',
    glowColor: 'rgba(5, 150, 105, 0.35)',
    thought: '"Even amidst difficulty, there are tangible realities supporting me."',
    thoughtNature: 'FACT',
    thoughtExplanation: 'Gratitude grounds you in concrete, observable realities that anxiety overlooks.',
    effects: {
      accept: { health: 12, peace: 16, score: 10, message: 'Gratitude anchors your inner space with steady perspective.' },
      reject: { health: -4, peace: -8, score: 0, message: 'Overlooking support narrows your perspective.' },
    },
    bestChoice: 'accept',
    insight: 'Gratitude aligns awareness with what is enduring and present.'
  },
  {
    id: 'guilt',
    name: 'Guilt',
    description: 'A heavy burden regarding past choices or perceived mistakes.',
    category: 'challenging',
    color: '#6B7280',
    glowColor: 'rgba(107, 114, 128, 0.35)',
    thought: '"I should have known better and I cannot move forward from this."',
    thoughtNature: 'FEAR',
    thoughtExplanation: 'Guilt often stems from fear that a mistake defines your permanent identity. Growth requires learning and moving forward.',
    effects: {
      accept: { health: -12, peace: -16, score: 0, message: 'Dwelling in self-punishment stalls your forward momentum.' },
      reject: { health: 6, peace: 12, score: 8, message: 'You extract the lesson and release the weight. Clarity is restored.' },
    },
    bestChoice: 'reject',
    insight: 'Guilt is an invitation to learn, not a life sentence.'
  },
  {
    id: 'jealousy',
    name: 'Jealousy',
    description: 'An uncomfortable comparison with someone else’s progress.',
    category: 'challenging',
    color: '#0D9488',
    glowColor: 'rgba(13, 148, 136, 0.35)',
    thought: '"Their progress suggests that I am falling behind in life."',
    thoughtNature: 'ASSUMPTION',
    thoughtExplanation: 'Another person\'s trajectory does not reduce your potential or worth. Life is not a zero-sum race.',
    effects: {
      accept: { health: -14, peace: -18, score: 0, message: 'Comparison consumes your focus and distorts your perspective.' },
      reject: { health: 8, peace: 12, score: 10, message: 'You refocus on your personal path and regain centered direction.' },
    },
    bestChoice: 'reject',
    insight: 'Comparison measures you against someone else\'s script. Focus on your own growth.'
  },
  {
    id: 'hope',
    name: 'Hope',
    description: 'A quiet, constructive belief in future potential.',
    category: 'expansive',
    color: '#DB2777',
    glowColor: 'rgba(219, 39, 119, 0.35)',
    thought: '"Progress is possible, and small deliberate actions create meaningful change."',
    thoughtNature: 'FACT',
    thoughtExplanation: 'Hope is a realistic recognition that incremental efforts yield meaningful change over time.',
    effects: {
      accept: { health: 12, peace: 18, score: 12, message: 'Nurturing hope opens pathways toward constructive action.' },
      reject: { health: -6, peace: -10, score: 0, message: 'Closing off hope creates unnecessary resignation.' },
    },
    bestChoice: 'accept',
    insight: 'Hope is constructive orientation toward what you can build.'
  },
  {
    id: 'loneliness',
    name: 'Loneliness',
    description: 'A felt sense of distance or emotional disconnection.',
    category: 'challenging',
    color: '#4F46E5',
    glowColor: 'rgba(79, 70, 229, 0.35)',
    thought: '"No one understands what I am going through right now."',
    thoughtNature: 'FEAR',
    thoughtExplanation: 'Loneliness can amplify feelings of isolation. Recognizing it allows you to practice self-care and seek authentic connection.',
    effects: {
      accept: { health: -6, peace: -12, score: 2, message: 'Isolating yourself deepens the feeling of disconnection.' },
      reject: { health: 6, peace: 12, score: 8, message: 'You establish inner grounding and remain open to meaningful connection.' },
    },
    bestChoice: 'reject',
    insight: 'Loneliness signals a desire for connection. Start with self-understanding.'
  },
  {
    id: 'encouragement',
    name: 'Encouragement',
    description: 'A steady reminder of your resilience and capability.',
    category: 'grounding',
    color: '#CA8A04',
    glowColor: 'rgba(202, 138, 4, 0.35)',
    thought: '"I have navigated difficult moments before, and I have the tools to handle this."',
    thoughtNature: 'FACT',
    thoughtExplanation: 'Your history of overcoming past adversity is factual evidence of your capability.',
    effects: {
      accept: { health: 12, peace: 16, score: 10, message: 'Accepting encouragement strengthens your inner foundation.' },
      reject: { health: -4, peace: -8, score: 0, message: 'Rejecting supportive perspective weakens your resolve.' },
    },
    bestChoice: 'accept',
    insight: 'Internalized encouragement builds enduring resilience.'
  },
  {
    id: 'compassion',
    name: 'Compassion',
    description: 'Patient, non-judgmental kindness toward yourself and others.',
    category: 'grounding',
    color: '#9333EA',
    glowColor: 'rgba(147, 51, 234, 0.35)',
    thought: '"I am learning and growing, and I deserve patient understanding."',
    thoughtNature: 'FACT',
    thoughtExplanation: 'Self-compassion provides the steady emotional environment necessary for genuine growth.',
    effects: {
      accept: { health: 14, peace: 20, score: 12, message: 'Self-compassion brings enduring restoration to your inner world.' },
      reject: { health: -6, peace: -10, score: 0, message: 'Harsh self-criticism drains your mental reserves.' },
    },
    bestChoice: 'accept',
    insight: 'Self-compassion is not indulgence; it is the prerequisite for self-correction.'
  }
];

export const initialGameState: GameState = {
  castleHealth: 100,
  innerPeace: 100,
  weather: 'sunny',
  gatekeeperMood: 'peaceful',
  score: 0,
  level: 1,
  emotionsHandled: 0,
  correctChoices: 0,
  chamberIndex: 0,
  history: []
};

export const getWeatherFromHealth = (health: number, peace: number): GameState['weather'] => {
  const overall = (health + peace) / 2;
  if (overall >= 80) return 'sunny';
  if (overall >= 60) return 'cloudy';
  if (overall >= 40) return 'rainy';
  return 'stormy';
};

export const getGatekeeperMood = (health: number, peace: number): GameState['gatekeeperMood'] => {
  const overall = (health + peace) / 2;
  if (overall >= 80) return 'peaceful';
  if (overall >= 60) return 'concerned';
  if (overall >= 40) return 'worried';
  if (overall >= 20) return 'stressed';
  return 'anxious';
};