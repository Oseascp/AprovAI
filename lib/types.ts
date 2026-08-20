export interface Discipline {
  name: string;
  weight: number;
  importance: "Alta" | "Média" | "Crítica";
  hoursRecommended: number;
  keyTopics: string[];
  bancaTrapAlert?: string;
}

export interface StudyPhase {
  phaseName: string;
  goal: string;
  dailyFocus: string;
}

export interface DaySchedule {
  day: string;
  subject1: string;
  topic1: string;
  subject2: string;
  topic2: string;
  reviewType: string;
}

export interface EditalAnalysisResult {
  concurso: string;
  banca: string;
  totalStudyHours: number;
  confidenceScore: number;
  summary: string;
  disciplines: Discipline[];
  studyPhases: StudyPhase[];
  sampleWeekSchedule: DaySchedule[];
  topStrategyTips: string[];
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface ExamQuestion {
  id: string;
  banca: string;
  discipline: string;
  topic: string;
  statement: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  bancaTip?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  mode?: string;
  timestamp: string;
}
