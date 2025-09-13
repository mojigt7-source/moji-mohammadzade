
export enum Tone {
  CASUAL = 'دوستانه',
  PROFESSIONAL = 'حرفه‌ای',
  HUMOROUS = 'طنزآمیز',
  INSPIRATIONAL = 'انگیزشی',
  INFORMATIVE = 'آموزشی',
}

export interface GenerationOptions {
  tone: Tone;
  includeEmojis: boolean;
  includeHashtags: boolean;
  captionLength: number; // e.g., 50, 100, 150 words
  variantCount: number;
}

export interface GeneratedCaption {
  id: string;
  text: string;
  hashtags: string[];
  emojis: string[];
  predictedEngagement?: 'پایین' | 'متوسط' | 'بالا';
}

export enum AppState {
    IDLE = 'IDLE',
    LOADING = 'LOADING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}