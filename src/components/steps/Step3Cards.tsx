import React, { useState } from 'react';
import { Heart, Eye, CheckCircle2 } from 'lucide-react';
import { ROMANTIC_CARDS } from '../../config';
import { soundEngine } from '../../utils/audio';

interface Step3CardsProps {
  onNextStep: () => void;
}

export const Step3Cards: React.FC<Step3CardsProps> = ({ onNextStep }) => {
  const [openedCards, setOpenedCards] = useState<number[]>([]);

  const handleCardToggle = (id: number) => {
    if (!openedCards.includes(id)) {
      soundEngine.playChime();
      setOpenedCards([...openedCards, id]);
    } else {
      soundEngine.playCardFlip();
    }
  };

  const allOpened = openedCards.length === ROMANTIC_CARDS.length;

  return (
    <div className="flex flex-col items-center justify-center min-h-[68vh] text-center px-4 max-w-lg mx-auto py-2">
      {/* Title */}
      <div className="mb-5 space-y-1.5">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#B42345]">
          Étape 3 / 7
        </span>
        <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#321B2C]">
          Trois choses que j’aime chez toi… 💌
        </h2>
        <p className="text-xs sm:text-sm text-[#321B2C]/80 max-w-sm mx-auto">
          Touche chaque carte. ❤️
        </p>
      </div>

      {/* 3 Romantic Cards */}
      <div className="stagger-reveal flex flex-col sm:flex-row gap-3 w-full max-w-md my-2">
        {ROMANTIC_CARDS.map((card) => {
          const isOpen = openedCards.includes(card.id);
          return (
            <div
              key={card.id}
              onClick={() => handleCardToggle(card.id)}
              className={`motion-card flex-1 min-h-[140px] sm:min-h-[190px] rounded-2xl border p-4 transition-all duration-300 cursor-pointer text-center flex flex-col items-center justify-center relative shadow-sm hover:shadow-md ${
                isOpen
                  ? 'bg-white border-[#E85D75] shadow-md scale-[1.02]'
                  : 'bg-white/70 border-[#F7C8D0] hover:border-[#E85D75]/60 hover:bg-white'
              }`}
            >
              {isOpen ? (
                <div className="animate-fadeIn space-y-2 flex flex-col items-center justify-center h-full">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#E85D75] uppercase tracking-wide">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{card.title}</span>
                  </div>
                  <p className="text-xs sm:text-xs font-medium text-[#321B2C] leading-relaxed">
                    {card.message}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 flex flex-col items-center justify-center h-full">
                  <span className="text-3xl select-none">{card.icon}</span>
                  <div className="text-xs sm:text-sm font-bold text-[#B42345]">
                    {card.title}
                  </div>
                  <div className="text-[10px] text-[#321B2C]/60 flex items-center gap-1 font-medium bg-[#F7C8D0]/40 px-2 py-0.5 rounded-full">
                    <Eye className="w-3 h-3" />
                    <span>Découvrir</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Helper tracker */}
      <div className="min-h-[30px] flex items-center justify-center text-xs text-[#321B2C]/70 font-medium mt-2">
        {allOpened ? (
          <span className="text-[#B42345] flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-current" />
            Trois petits mots pour toi. 💖
          </span>
        ) : (
          <span>{openedCards.length} sur 3 cartes ouvertes</span>
        )}
      </div>

      {/* Continue button */}
      <div className="mt-4 w-full max-w-xs">
        <button
          onClick={() => {
            soundEngine.playHeartPop();
            onNextStep();
          }}
          disabled={openedCards.length === 0}
          className={`w-full py-3.5 px-6 rounded-2xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
            openedCards.length > 0
              ? 'bg-gradient-to-r from-[#E85D75] to-[#B42345] text-white hover:shadow-lg active:scale-[0.98] cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-70'
          }`}
        >
          <span>La suite m’attend ? 👀</span>
        </button>
      </div>
    </div>
  );
};
