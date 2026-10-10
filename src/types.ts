export interface SenderConfig {
  recipientName: string;
  senderName: string;
  whatsappPhone: string; // international format without + or spaces, e.g. "33612345678" or customizable
}

export type PresetMelodyId = 'music-box' | 'soft-piano' | 'starlight-waltz' | 'cinematic-love';

export interface MusicTrackConfig {
  id: PresetMelodyId;
  name: string;
  artist: string;
}

export interface MoodOption {
  id: string;
  label: string;
  emoji: string;
  response: string;
  accentColor: string;
}

export interface ButterflyCard {
  id: number;
  isWinner: boolean;
  title: string;
  message: string;
  icon: string;
}

export interface RomanticSurpriseCard {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  message: string;
  colorScheme: {
    bg: string;
    border: string;
    badge: string;
  };
}

export interface QuizQuestionItem {
  id: number;
  question: string;
  options: {
    text: string;
    reaction: string;
  }[];
}

export interface RomanticPhoto {
  id: string;
  url: string;
  caption: string;
  date?: string;
  rotation: number;
}
