import { ButterflyCard, MoodOption, MusicTrackConfig, QuizQuestionItem, RomanticPhoto, RomanticSurpriseCard, SenderConfig } from './types';
import portraitShekinaelPhoto from '../IMG-20260115-WA0180.jpg';
import portraitPierrePhoto from '../IMG_20261003_160725_117.jpg';
import birthdayShekinaelPhoto from '../20260225_183019.jpg';
import customSong from '../Slimane_-_Des_milliers_de_je_t_aime__Paroles_Lyrics_(256k).mp3';
import finalDeclarationPhoto from '../Sheki1.jpg';

/**
 * CONFIGURATION PRINCIPALE & PERSONNALISATION
 * Modifiez facilement ces valeurs pour personnaliser l'expérience de Shekinaël.
 */
export const DEFAULT_CONFIG: SenderConfig = {
  // Prénom de la destinataire
  recipientName: 'Shekinaël',
  // Prénom ou surnom de l'expéditeur
  senderName: 'Pierre',
  // Numéro WhatsApp de l'expéditeur (format international sans '+' ni espaces, ex: '33612345678')
  // À renseigner avant la mise en production, au format international sans « + » ni espaces.
  whatsappPhone: '237681282108',
};

// PHOTOS FIXES DE L'ALBUM — souvenirs personnels préparés avant la mise en production.
export const DEFAULT_PHOTOS: RomanticPhoto[] = [
  {
    id: 'photo-1',
    url: portraitShekinaelPhoto,
    caption: 'Ton sourire, mon rayon de soleil',
    date: 'Un joli portrait de toi',
    rotation: -2,
  },
  {
    id: 'photo-2',
    url: portraitPierrePhoto,
    caption: 'Un petit portrait de moi, rien que pour toi',
    date: 'Ton Camerounais ❤️',
    rotation: 2.5,
  },
  {
    id: 'photo-3',
    url: birthdayShekinaelPhoto,
    caption: 'Une belle journée à célébrer',
    date: 'Un souvenir de ton anniversaire 🎂',
    rotation: -1.5,
  },
];

// Piste fixe — changez-la ici avant la mise en production, pas depuis l'interface.
export const DEFAULT_MUSIC_TRACK: MusicTrackConfig = {
  id: 'custom-file',
  name: 'Des milliers de je t’aime',
  artist: 'Slimane',
  isCustomFile: true,
  audioUrl: customSong,
};

// ÉTAPE 1: TEST D'HUMEUR
export const MOOD_OPTIONS: MoodOption[] = [
  {
    id: 'happy',
    label: 'Je suis heureuse',
    emoji: '🥰',
    response: 'Ça me fait plaisir. J’espère t’offrir un joli sourire. 💖',
    accentColor: '#E85D75',
  },
  {
    id: 'cuddle',
    label: 'J\'ai besoin d\'un câlin',
    emoji: '🫂',
    response: 'Je suis là, sans pression. Tu peux tout me dire. 🫂',
    accentColor: '#B42345',
  },
  {
    id: 'laugh',
    label: 'Je veux qu\'on me fasse rire',
    emoji: '😂',
    response: 'Défi accepté : je vais tenter de te faire sourire. 😂',
    accentColor: '#321B2C',
  },
];

// ÉTAPE 2: LE MINI-JEU DES PAPILLONS ET DES CŒURS
export const BUTTERFLY_CARDS: ButterflyCard[] = [
  {
    id: 1,
    isWinner: false,
    title: 'Cœur Secret #1',
    message: 'Un câlin, si tu en as envie. 🫂',
    icon: '🫂',
  },
  {
    id: 2,
    isWinner: false,
    title: 'Cœur Secret #2',
    message: 'Deux pays, deux histoires. J’ai envie de découvrir la tienne. 🌷',
    icon: '🌷',
  },
  {
    id: 3,
    isWinner: true,
    title: 'Cœur Magique #3',
    message: 'Je veux t’écouter, être sincère et te le montrer par mes actes. 💗',
    icon: '💖',
  },
];

// ÉTAPE 3: LES 3 CARTES ROMANTIQUES
export const ROMANTIC_CARDS: RomanticSurpriseCard[] = [
  {
    id: 1,
    title: 'Ce que j’aime chez toi',
    subtitle: 'Toi, tout simplement',
    icon: '🌷',
    message: 'J’aime ta façon d’être. Avec moi, reste simplement toi. ❤️',
    colorScheme: {
      bg: '#FFF0F3',
      border: '#F7C8D0',
      badge: '#E85D75',
    },
  },
  {
    id: 2,
    title: 'Nos deux horizons',
    subtitle: 'Tchad & Cameroun',
    icon: '🌸',
    message: 'Tchad et Cameroun : deux histoires, et le bonheur de se rencontrer. 💖',
    colorScheme: {
      bg: '#FFF8F5',
      border: '#E85D75',
      badge: '#B42345',
    },
  },
  {
    id: 3,
    title: 'À ton rythme',
    subtitle: 'Je suis là pour écouter',
    icon: '💌',
    message: 'Tes doutes ont leur place. Je veux les entendre, sans te presser. 💌',
    colorScheme: {
      bg: '#FDF2F4',
      border: '#B42345',
      badge: '#321B2C',
    },
  },
];

// ÉTAPE 4: LE QUIZ COMPLICE
export const QUIZ_QUESTIONS: QuizQuestionItem[] = [
  {
    id: 1,
    question: 'Pour notre prochain rendez-vous à distance, tu choisis… ?',
    options: [
      {
        text: 'Un appel tout doux 🌙',
        reaction: 'Je garde une place dans ma soirée pour entendre ta voix. 🌙',
      },
      {
        text: 'Nos blagues nulles 😂',
        reaction: 'Attention, j’en ai une nouvelle… elle est sûrement très nulle. 😂',
      },
      {
        text: 'Un câlin à travers l’écran 🫂',
        reaction: 'Câlin virtuel envoyé, avec option sourire. 🫂',
      },
    ],
  },
  {
    id: 2,
    question: 'Quel petit mot ferait briller ta journée ?',
    options: [
      {
        text: 'Je pense à toi 💌',
        reaction: 'Alors, petit rappel du jour : je pense à toi. 💌',
      },
      {
        text: 'Tu me fais sourire 🥰',
        reaction: 'Et ton sourire est l’un de mes préférés. 🥰',
      },
      {
        text: 'Courage pour tes études, je crois en toi 💪',
        reaction: 'Je t’encouragerai de tout cœur. Tu peux le faire ! 💪',
      },
    ],
  },
  {
    id: 3,
    question: 'Notre petite tradition à deux, ce serait… ?',
    options: [
      {
        text: 'Un message doux chaque matin ☀️',
        reaction: 'Un bonjour de toi, et ma journée commence bien. ☀️',
      },
      {
        text: 'Un appel plein de fous rires 🌙',
        reaction: 'Marché conclu — même si c’est moi qui raconte les blagues nulles ! 😂',
      },
      {
        text: 'Un petit défi surprise par semaine 🎲',
        reaction: 'J’adore ! Prépare-toi à des défis très sérieux… comme choisir le dessert. 🎲',
      },
    ],
  },
];

// ÉTAPE 5: TEXTE DE LA CARTE POSTALE
export const POSTCARD_TEXT = {
  greeting: 'Ma chère Shekinaël,',
  paragraphs: [
    'Tu comptes beaucoup pour moi. J’aime apprendre à te connaître, un jour à la fois.',
    'Je sais que des doutes peuvent exister. Je ne veux pas les minimiser : je veux t’écouter, sans te presser.',
    'Nos histoires — tchadienne et camerounaise — sont différentes, et j’ai envie de les découvrir avec respect. Je ne promets pas la perfection, mais de la sincérité, de l’écoute et des actes.',
    'Tu n’as rien à décider aujourd’hui. Je voulais juste te dire que je tiens à toi. ❤️',
  ],
  closing: 'Avec toute mon affection,',
  signature: 'Pierre. ❤️',
};

// ÉTAPE 6: LE MOMENT TOUT DOUX
export const SOFT_MOMENT_QUOTE = 'Tu n’as pas besoin d’avoir toutes les réponses. Avançons à ton rythme. ❤️';

// ÉTAPE 7: DÉCLARATION FINALE
export const FINAL_DECLARATION = {
  title: 'Shekinaël, j’ai préparé ça pour toi…',
  paragraphs: [
    'Je suis heureux que nos chemins se soient croisés.',
    'Tu comptes pour moi. Je veux t’écouter, te respecter et te le montrer par mes actes.',
    'Merci d’être toi. Rien à décider aujourd’hui. ❤️',
  ],
};

// Photo personnelle affichée dans la déclaration finale.
export const FINAL_DECLARATION_PHOTO: string | null = finalDeclarationPhoto;
