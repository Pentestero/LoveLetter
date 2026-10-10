import React from 'react';
import { Heart, MapPin, Check } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface RomanticPathMapProps {
  currentStep: number;
  totalSteps: number;
  onNavigateStep?: (step: number) => void;
}

interface StepWaypoint {
  step: number;
  label: string;
  emoji: string;
  desc: string;
}

const WAYPOINTS: StepWaypoint[] = [
  { step: 0, label: 'Accueil', emoji: '💌', desc: 'L\'enveloppe mystère' },
  { step: 1, label: 'Humeur', emoji: '😏', desc: 'Comment tu vas ?' },
  { step: 2, label: 'Papillons', emoji: '🦋', desc: 'Le cœur secret' },
  { step: 3, label: 'Surprises', emoji: '🌷', desc: 'Trois douces cartes' },
  { step: 4, label: 'Quiz', emoji: '💘', desc: 'Complices à 100%' },
  { step: 5, label: 'Lettre', emoji: '🌹', desc: 'La carte postale' },
  { step: 6, label: 'Douceur', emoji: '🌙', desc: 'Sous les étoiles' },
  { step: 7, label: 'Déclaration', emoji: '❤️', desc: 'De tout mon cœur' },
];

export const RomanticPathMap: React.FC<RomanticPathMapProps> = ({
  currentStep,
  onNavigateStep,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto mb-4 px-3 select-none">
      {/* Visual Roadmap Container */}
      <div className="bg-white/70 backdrop-blur-md border border-[#F7C8D0]/80 rounded-2xl p-3 sm:p-4 shadow-sm relative overflow-hidden">
        {/* Header Indicator */}
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-1.5 font-semibold text-[#B42345]">
            <MapPin className="w-3.5 h-3.5" />
            <span className="font-serif-display tracking-wide">Notre petite aventure</span>
          </div>
          <span className="text-[11px] font-medium text-[#E85D75] bg-[#F7C8D0]/40 px-2 py-0.5 rounded-full">
            Étape {currentStep} sur 7
          </span>
        </div>

        {/* Winding Horizontal Animated Journey Track */}
        <div className="relative py-2 overflow-x-auto scrollbar-none flex items-center justify-between gap-1 sm:gap-2">
          {/* Animated SVG Path Connecting Line */}
          <div className="absolute top-1/2 left-4 right-4 h-1 -translate-y-1/2 bg-[#F7C8D0]/60 rounded-full z-0 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E85D75] to-[#B42345] transition-all duration-700 ease-out"
              style={{
                width: `${(currentStep / 7) * 100}%`,
              }}
            />
          </div>

          {/* Waypoints along the path */}
          {WAYPOINTS.map((wp) => {
            const isCompleted = wp.step < currentStep;
            const isCurrent = wp.step === currentStep;
            const isUnlocked = wp.step <= currentStep;

            return (
              <button
                key={wp.step}
                disabled={!isUnlocked}
                onClick={() => {
                  if (onNavigateStep && isUnlocked) {
                    soundEngine.playCardFlip();
                    onNavigateStep(wp.step);
                  }
                }}
                className={`motion-button relative z-10 flex flex-col items-center group transition-all duration-300 min-w-[42px] sm:min-w-[48px] ${
                  isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'
                }`}
                title={`${wp.label} : ${wp.desc}`}
              >
                {/* Node Circle */}
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-500 transform ${
                    isCurrent
                      ? 'bg-gradient-to-tr from-[#E85D75] to-[#B42345] text-white shadow-lg scale-110 ring-4 ring-[#F7C8D0]'
                      : isCompleted
                      ? 'bg-white border-2 border-[#E85D75] text-[#E85D75] shadow-xs'
                      : 'bg-white/80 border border-[#F7C8D0] text-[#321B2C]/40'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-[#E85D75] stroke-[3]" />
                  ) : (
                    <span className="text-xs sm:text-sm select-none">{wp.emoji}</span>
                  )}

                  {/* Pulsing beacon glow on current step */}
                  {isCurrent && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#B42345] rounded-full animate-ping" />
                  )}
                </div>

                {/* Step Label */}
                <span
                  className={`text-[9px] sm:text-[10px] mt-1 font-medium transition-colors truncate max-w-[46px] sm:max-w-[54px] text-center ${
                    isCurrent
                      ? 'text-[#B42345] font-bold'
                      : isCompleted
                      ? 'text-[#E85D75]'
                      : 'text-[#321B2C]/50'
                  }`}
                >
                  {wp.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Journey reminder */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#321B2C]/65 pt-1 mt-1 border-t border-[#F7C8D0]/40">
          <Heart className="w-2.5 h-2.5 text-[#E85D75] fill-[#E85D75]" />
          <span>Un pas à ton rythme, toujours. ❤️</span>
        </div>
      </div>
    </div>
  );
};
