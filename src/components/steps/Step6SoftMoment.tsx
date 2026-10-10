import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart } from 'lucide-react';
import { SOFT_MOMENT_QUOTE } from '../../config';
import { soundEngine } from '../../utils/audio';

interface Step6SoftMomentProps {
  onNextStep: () => void;
}

export const Step6SoftMoment: React.FC<Step6SoftMomentProps> = ({ onNextStep }) => {
  const [selectedAction, setSelectedAction] = useState<'hug' | 'kiss' | 'both' | null>(null);

  const handleAction = (type: 'hug' | 'kiss' | 'both') => {
    setSelectedAction(type);
    if (type === 'hug') {
      soundEngine.playHeartPop();
    } else if (type === 'kiss') {
      soundEngine.playHeartPop();
    } else {
      soundEngine.playChime();
      confetti({
        particleCount: 50,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#F7C8D0', '#E85D75', '#B42345'],
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[68vh] text-center px-4 max-w-lg mx-auto py-2">
      {/* Title */}
      <div className="mb-4 space-y-1.5">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#B42345]">
          Étape 6 / 7
        </span>
        <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#321B2C]">
          Un dernier instant à deux…
        </h2>
      </div>

      {/* Twilight Animated Romance Box */}
      <div className="soft-moment-card w-full max-w-md bg-gradient-to-b from-[#321B2C] via-[#482840] to-[#602D4E] rounded-3xl p-6 shadow-xl text-white relative overflow-hidden my-2">
        {/* Silhouette / Heart Animation Canvas */}
        <div className="h-32 flex items-center justify-center relative my-2">
          {selectedAction === 'hug' ? (
            /* Hug: Two hearts merging */
            <div className="flex items-center justify-center relative animate-fadeIn">
              <div className="text-5xl animate-soft-pop">🫂</div>
              <div className="absolute -top-3 text-3xl animate-heart-float">💖</div>
            </div>
          ) : selectedAction === 'kiss' ? (
            /* Kiss: Floating hearts & kisses */
            <div className="flex flex-col items-center justify-center space-y-1 animate-fadeIn">
              <div className="text-5xl animate-gentle-pulse">😘</div>
              <div className="flex gap-2 text-xl animate-heart-float">
                <span>💋</span>
                <span>💗</span>
                <span>💋</span>
              </div>
            </div>
          ) : selectedAction === 'both' ? (
            /* Both: Tender explosion of affection */
            <div className="flex items-center justify-center relative animate-fadeIn">
              <div className="text-5xl">🥰</div>
              <div className="absolute -bottom-2 -right-4 text-3xl animate-heart-float">💖</div>
            </div>
          ) : (
            /* Default: Two stylized silhouettes drawing closer under the moonlight */
            <div className="flex items-center gap-8 text-4xl">
              <div className="transform translate-x-2 transition-transform duration-700 animate-romantic-float">
                🤍
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs">
                💗
              </div>
              <div className="transform -translate-x-2 transition-transform duration-700 animate-romantic-float">
                🤍
              </div>
            </div>
          )}
        </div>

        {/* Quote */}
        <p className="font-serif-display italic text-sm sm:text-base text-rose-100 max-w-xs mx-auto leading-relaxed my-3">
          « {SOFT_MOMENT_QUOTE} »
        </p>

        {/* 3 Interactive Buttons */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <button
            onClick={() => handleAction('hug')}
            className={`motion-button py-2 px-1 rounded-xl text-xs font-medium transition-all cursor-pointer min-h-[44px] flex items-center justify-center ${
              selectedAction === 'hug'
                ? 'bg-[#E85D75] text-white shadow-md'
                : 'bg-white/15 hover:bg-white/25 text-rose-100'
            }`}
          >
            Un câlin 🫂
          </button>
          <button
            onClick={() => handleAction('kiss')}
            className={`motion-button py-2 px-1 rounded-xl text-xs font-medium transition-all cursor-pointer min-h-[44px] flex items-center justify-center ${
              selectedAction === 'kiss'
                ? 'bg-[#E85D75] text-white shadow-md'
                : 'bg-white/15 hover:bg-white/25 text-rose-100'
            }`}
          >
            Un bisou 😘
          </button>
          <button
            onClick={() => handleAction('both')}
            className={`motion-button py-2 px-1 rounded-xl text-xs font-medium transition-all cursor-pointer min-h-[44px] flex items-center justify-center ${
              selectedAction === 'both'
                ? 'bg-[#E85D75] text-white shadow-md'
                : 'bg-white/15 hover:bg-white/25 text-rose-100'
            }`}
          >
            Les deux ! 😂❤️
          </button>
        </div>
      </div>

      {/* Helper & Unlock status */}
      <div className="min-h-[45px] flex items-center justify-center mt-3">
        {selectedAction ? (
          <p className="text-xs sm:text-sm text-[#B42345] font-semibold animate-fadeIn flex items-center gap-1.5">
            <Heart className="w-4 h-4 fill-[#B42345]" />
            C’est l’heure de la dernière surprise. 💌
          </p>
        ) : (
          <p className="text-xs text-[#321B2C]/70">
            Un câlin, un bisou… ou les deux ?
          </p>
        )}
      </div>

      {/* Final step trigger */}
      <div className="mt-2 w-full max-w-xs">
        <button
          onClick={() => {
            soundEngine.playHeartPop();
            onNextStep();
          }}
          disabled={!selectedAction}
          className={`motion-button w-full py-3.5 px-6 rounded-2xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
            selectedAction
              ? 'bg-gradient-to-r from-[#E85D75] to-[#B42345] text-white hover:shadow-lg active:scale-[0.98] cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-70'
          }`}
        >
          <span>Ouvrir ma surprise finale 💌</span>
          <Heart className="w-4 h-4 fill-current" />
        </button>
      </div>
    </div>
  );
};
