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
  // Message envoyé par WhatsApp après la déclaration finale
    customWhatsAppMessage: 'Coucou Pierre ❤️ J’ai découvert ta surprise !',
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
    response: 'Je suis heureux de savoir que tu vas bien. J’espère que cette petite surprise ajoutera un peu de douceur à ta journée. 💖',
    accentColor: '#E85D75',
  },
  {
    id: 'cuddle',
    label: 'J\'ai besoin d\'un câlin',
    emoji: '🫂',
    response: 'Câlin virtuel, sans question ni obligation de sourire. Si quelque chose te pèse, je veux aussi pouvoir l’entendre. 🫂',
    accentColor: '#B42345',
  },
  {
    id: 'laugh',
    label: 'Je veux qu\'on me fasse rire',
    emoji: '😂',
    response: 'Défi accepté ! Je ne promets pas une grande blague, mais au moins une tentative sincère pour te faire sourire. 😂',
    accentColor: '#321B2C',
  },
];

// ÉTAPE 2: LE MINI-JEU DES PAPILLONS ET DES CŒURS
export const BUTTERFLY_CARDS: ButterflyCard[] = [
  {
    id: 1,
    isWinner: false,
    title: 'Cœur Secret #1',
    message: 'Un câlin, et le rappel que tu peux me parler même quand tu as des doutes. 🫂',
    icon: '🫂',
  },
  {
    id: 2,
    isWinner: false,
    title: 'Cœur Secret #2',
    message: 'Nos chemins viennent de deux pays voisins, mais surtout de deux histoires singulières. J’aimerais découvrir la tienne avec respect. 🌷',
    icon: '🌷',
  },
  {
    id: 3,
    isWinner: true,
    title: 'Cœur Magique #3',
    message: 'Ma promesse n’est pas de tout faire parfaitement : c’est d’écouter, d’être honnête et de laisser mes actes parler avec le temps. 💗',
    icon: '💖',
  },
];

// ÉTAPE 3: LES 3 CARTES ROMANTIQUES
export const ROMANTIC_CARDS: RomanticSurpriseCard[] = [
  {
    id: 1,
    title: 'Ce que j\'aime chez toi',
    subtitle: 'Une touche unique',
    icon: '🌷',
    message: 'J’aime apprendre à connaître la personne que tu es, sans te demander d’être parfaite ni de cacher tes questions. Tu peux être toi, entièrement. ❤️',
    colorScheme: {
      bg: '#FFF0F3',
      border: '#F7C8D0',
      badge: '#E85D75',
    },
  },
  {
    id: 2,
    title: 'Deux horizons, une histoire',
    subtitle: 'Tchad & Cameroun',
    icon: '🌸',
    message: 'Tu es tchadienne, je suis camerounais. J’aime que nos chemins se rencontrent, et je veux accueillir nos différences avec curiosité et respect. 💖',
    colorScheme: {
      bg: '#FFF8F5',
      border: '#E85D75',
      badge: '#B42345',
    },
  },
  {
    id: 3,
    title: 'Quand tu doutes',
    subtitle: 'Tu peux m’en parler',
    icon: '💌',
    message: 'Je ne te demanderai pas d’effacer tes doutes pour me rassurer. Dis-moi ce qui te préoccupe : je veux écouter, comprendre et avancer sans te presser. 🥹',
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
    question: 'Quand quelque chose te fait douter, qu’est-ce qui t’aiderait le plus de ma part ?',
    options: [
      {
        text: 'Que je t’écoute sans me défendre tout de suite 🫂',
        reaction: 'Je veux d’abord comprendre ce que tu ressens, pas balayer tes inquiétudes. 💕',
      },
      {
        text: 'Qu’on se parle franchement et calmement 🌹',
        reaction: 'D’accord. Une conversation sincère vaut mieux que des suppositions. 🌷',
      },
      {
        text: 'Qu’on prenne le temps, puis qu’on en reparle 💑',
        reaction: 'Je respecterai ton rythme et je resterai disponible pour en reparler. 🤍',
      },
    ],
  },
  {
    id: 2,
    question: 'Nos parcours tchadien et camerounais se rencontrent. Qu’aimerais-tu construire avec moi ?',
    options: [
      {
        text: 'Apprendre à connaître nos repères et nos histoires 🌍',
        reaction: 'Oui, avec curiosité : je veux découvrir ton univers sans prétendre déjà tout savoir. 🌍',
      },
      {
        text: 'Respecter ce qui nous rend différents 💗',
        reaction: 'Nos différences font partie de nous ; elles méritent d’être accueillies et respectées. 💗',
      },
      {
        text: 'Créer peu à peu nos propres habitudes à deux 🤍',
        reaction: 'J’aime cette idée : bâtir quelque chose qui nous ressemble, un pas après l’autre. 🌟',
      },
    ],
  },
  {
    id: 3,
    question: 'À tes yeux, qu’est-ce qui aide la confiance à grandir ?',
    options: [
      {
        text: 'Des paroles suivies d’actes 😍',
        reaction: 'Tu as raison : je veux que mes gestes confirment mes mots, dans la durée. 🤍',
      },
      {
        text: 'De la constance dans les petites choses 👀',
        reaction: 'Je retiens : la confiance se construit aussi dans les gestes simples et réguliers. 🤍',
      },
      {
        text: 'Pouvoir dire quand quelque chose m’inquiète 🥰',
        reaction: 'Oui. Tu dois pouvoir me parler librement ; je préfère une vérité inconfortable au silence. 💖',
      },
    ],
  },
];

// ÉTAPE 5: TEXTE DE LA CARTE POSTALE
export const POSTCARD_TEXT = {
  greeting: 'Ma chère Shekinaël,',
  paragraphs: [
    'Je voulais t’écrire sans détour : tu comptes beaucoup pour moi, et j’aime apprendre à connaître la personne que tu es, à ton rythme.',
    'Je sais que tu peux parfois douter de notre relation. Je ne veux ni minimiser ces doutes ni te demander de les faire taire. Tu as le droit de poser tes questions et de me dire ce qui te manque pour te sentir en confiance.',
    'Tu es tchadienne, je suis camerounais. Nos origines et nos parcours font partie de nous ; j’aimerais continuer à découvrir les tiens avec respect, sans supposer que je sais déjà ce qu’ils signifient pour toi.',
    'Je ne peux pas promettre d’être parfait. Je peux te promettre de faire de mon mieux pour être sincère, t’écouter et faire en sorte que mes actes rejoignent mes paroles. La confiance se construit avec le temps, pas sous la pression.',
    'Tu n’as pas besoin de répondre à cette lettre ni de décider quoi que ce soit aujourd’hui. Je voulais simplement que tu saches que je tiens à toi et que je suis prêt à parler, vraiment.',
  ],
  closing: 'Avec toute mon affection,',
  signature: 'Pierre. ❤️',
};

// ÉTAPE 6: LE MOMENT TOUT DOUX
export const SOFT_MOMENT_QUOTE = 'Tu n’as pas besoin d’avoir toutes les réponses aujourd’hui. J’aimerais qu’on puisse se parler avec confiance, et avancer à ton rythme.';

// ÉTAPE 7: DÉCLARATION FINALE
export const FINAL_DECLARATION = {
  title: 'Shekinaël, cette petite surprise était pour toi…',
  paragraphs: [
    'Tu comptes beaucoup pour moi, et je suis heureux que nos chemins — tchadien et camerounais — se soient croisés.',
    'Je sais que tu peux parfois douter. Tu as le droit de m’en parler : je veux t’écouter et te rassurer par mes actes, pas seulement par des mots.',
    'Je tiens à toi, sans te demander d’avoir toutes les réponses aujourd’hui. Merci d’être toi. ❤️',
  ],
};

// Photo personnelle affichée dans la déclaration finale.
export const FINAL_DECLARATION_PHOTO: string | null = finalDeclarationPhoto;
