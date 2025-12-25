export interface Survey {
  id: string;
  user_name: string;
  user_age: number;
  user_grade: string;
  user_school: string;
  created_at: string;
  completed_at?: string;
  status: 'in_progress' | 'completed';
}

export interface SurveyResponse {
  id: string;
  survey_id: string;
  question_id: string;
  question_type: 'likert' | 'multiple_choice' | 'open_ended';
  answer: any;
  created_at: string;
}

export interface SurveyResult {
  id: string;
  survey_id: string;
  total_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  analysis: any;
  recommendations: string[];
  created_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  message: string;
  role: 'user' | 'assistant';
  created_at: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Question {
  id: string;
  type: 'likert' | 'multiple_choice' | 'open_ended';
  text: string;
  options?: string[];
  category: string;
}
