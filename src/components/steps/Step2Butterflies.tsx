import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart } from 'lucide-react';
import { BUTTERFLY_CARDS } from '../../config';
import { soundEngine } from '../../utils/audio';

interface Step2ButterfliesProps {
  onNextStep: () => void;
}

export const Step2Butterflies: React.FC<Step2ButterfliesProps> = ({ onNextStep }) => {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [hasFoundWinner, setHasFoundWinner] = useState(false);

  const handleCardClick = (id: number, isWinner: boolean) => {
    if (flippedCards.includes(id)) return;

    soundEngine.playCardFlip();
    const updated = [...flippedCards, id];
    setFlippedCards(updated);

    if (isWinner) {
      setHasFoundWinner(true);
      soundEngine.playChime();
      confetti({
        particleCount: 45,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F7C8D0', '#E85D75', '#B42345'],
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[68vh] text-center px-4 max-w-lg mx-auto py-2">
      {/* Title & Instructions */}
      <div className="mb-5 space-y-1.5">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#B42345]">
          Étape 2 / 7
        </span>
        <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#321B2C]">
          Petite mission pour toi ! 🦋
        </h2>
        <p className="text-xs sm:text-sm text-[#321B2C]/80 max-w-sm mx-auto leading-relaxed">
          Parmi ces trois cœurs, l'un cache un petit mot d'amour spécial. À toi de le trouver ! (Tu peux tous les ouvrir 😉)
        </p>
      </div>

      {/* 3 Flip Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-md my-3">
        {BUTTERFLY_CARDS.map((card) => {
          const isFlipped = flippedCards.includes(card.id);
          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id, card.isWinner)}
              className="motion-card h-44 sm:h-48 cursor-pointer select-none perspective-1000 group"
            >
              <div
                className={`w-full h-full relative duration-500 transform-style-3d transition-transform ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* Front (Hidden Face) */}
                <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#FFF0F3] to-[#F7C8D0] rounded-2xl border-2 border-dashed border-[#E85D75]/60 shadow-md flex flex-col items-center justify-center p-3 hover:border-[#B42345] transition-all">
                  <div className="w-12 h-12 rounded-full bg-white/80 shadow-inner flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform">
                    💝
                  </div>
                  <span className="text-xs font-bold text-[#B42345]">
                    Cœur #{card.id}
                  </span>
                  <span className="text-[10px] text-[#321B2C]/60 mt-1">
                    Touche pour révéler
                  </span>
                </div>

                {/* Back (Revealed Face) */}
                <div
                  className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border shadow-lg p-3 flex flex-col items-center justify-center text-center ${
                    card.isWinner
                      ? 'bg-gradient-to-br from-[#FFE8EE] to-[#FFF0F3] border-[#E85D75]'
                      : 'bg-white/95 border-[#F7C8D0]'
                  }`}
                >
                  <span className="text-2xl mb-1.5">{card.icon}</span>
                  <p className="text-xs sm:text-xs font-semibold text-[#321B2C] leading-snug">
                    {card.message}
                  </p>
                  {card.isWinner && (
                    <span className="mt-2 text-[10px] font-bold text-[#B42345] bg-[#F7C8D0]/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Heart className="w-2.5 h-2.5 fill-current" />
                      Gagné !
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Helper text based on progress */}
      <div className="min-h-[40px] flex items-center justify-center text-xs text-[#321B2C]/75 font-medium">
        {hasFoundWinner ? (
          <span className="text-[#B42345] flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-[#B42345]" />
            Bravo ! Tu as trouvé le cœur magique ! 💗
          </span>
        ) : flippedCards.length > 0 ? (
          <span>Essaie encore les autres cœurs ! 😉</span>
        ) : (
          <span>Clique sur un cœur pour le retourner !</span>
        )}
      </div>

      {/* Continue button */}
      <div className="mt-4 w-full max-w-xs">
        <button
          onClick={() => {
            soundEngine.playHeartPop();
            onNextStep();
          }}
          disabled={flippedCards.length === 0}
          className={`motion-button w-full py-3.5 px-6 rounded-2xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
            flippedCards.length > 0
              ? 'bg-gradient-to-r from-[#E85D75] to-[#B42345] text-white hover:shadow-lg active:scale-[0.98] cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-70'
          }`}
        >
          <span>J'ai fini ma mission ! 🎉</span>
        </button>
      </div>
    </div>
  );
};
