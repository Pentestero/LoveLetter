import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface Step0WelcomeProps {
  recipientName: string;
  onStartAdventure: () => void;
  onEnvelopeOpen: () => void;
}

export const Step0Welcome: React.FC<Step0WelcomeProps> = ({
  recipientName,
  onStartAdventure,
  onEnvelopeOpen,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenEnvelope = () => {
    if (!isOpen) {
      setIsOpen(true);
      onEnvelopeOpen();
      soundEngine.playChime();

      // Launch soft heart confettis
      confetti({
        particleCount: 28,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#F7C8D0', '#E85D75', '#B42345'],
        shapes: ['circle'],
        scalar: 1.2,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[72vh] text-center px-4 max-w-lg mx-auto py-4">
      {/* Title & Subtitle */}
      <div className="mb-6 space-y-2.5">
        <div className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase text-[#B42345] font-semibold">
          <span>Un mot rien que pour toi</span>
        </div>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#321B2C] tracking-tight">
          Coucou, <span className="shimmer-text">{recipientName}</span>… 💗
        </h1>
      </div>

      {/* Interactive 3D Envelope */}
      <div className="relative my-4 w-72 h-52 sm:w-80 sm:h-56 select-none perspective-1000 group animate-welcome-float">
        <button
          type="button"
          onClick={handleOpenEnvelope}
          className="w-full h-full relative block cursor-pointer rounded-2xl border-0 bg-transparent p-0 text-left focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#B42345]"
          aria-label={isOpen ? 'Enveloppe ouverte' : 'Ouvrir ton enveloppe'}
          aria-pressed={isOpen}
        >
          {/* Envelope Body */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFE3E8] to-[#F7C8D0] rounded-2xl shadow-xl border border-[#F7C8D0] flex items-center justify-center overflow-visible">
            {/* Envelope pocket triangles */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F5BAC6] to-[#FFE3E8] clip-envelope-pocket shadow-inner" />
            
            {/* The letter inside */}
            <div
              className={`absolute left-4 right-4 bg-[#FFF8F5] border border-[#F7C8D0] rounded-xl p-4 shadow-md transition-all duration-700 ease-out flex flex-col items-center justify-center ${
                isOpen ? 'letter-reveal -top-10 opacity-100 scale-105 z-20' : 'top-6 opacity-40 scale-95 z-0'
              }`}
            >
              {isOpen ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-[#F7C8D0]/60 flex items-center justify-center text-[#B42345] mb-1.5">
                    <Heart className="w-4 h-4 fill-[#E85D75] text-[#E85D75]" />
                  </div>
                  <p className="font-script text-xl sm:text-2xl text-[#B42345] font-semibold">
                    {recipientName}, tu rends mes jours plus doux.
                  </p>
                  <p className="text-[11px] text-[#321B2C]/75 mt-0.5">
                    Je voulais juste te le rappeler. ❤️
                  </p>
                </>
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#F7C8D0]/60 flex items-center justify-center text-[#B42345]">
                  <Heart className="w-4 h-4 fill-[#E85D75] text-[#E85D75]" />
                </div>
              )}
            </div>

            {/* Front flap folds */}
            <div
              className={`envelope-flap absolute top-0 left-0 right-0 h-28 bg-[#F5BAC6] origin-top transition-transform duration-700 ease-out clip-envelope-flap z-10 ${
                isOpen ? '-rotate-x-180 opacity-0 pointer-events-none' : 'rotate-x-0'
              }`}
            />

            {/* Wax seal */}
            {!isOpen && (
              <div className="envelope-seal absolute top-20 z-20 w-12 h-12 rounded-full bg-[#B42345] border-2 border-[#FFE3E8] shadow-lg flex items-center justify-center text-white transform hover:scale-110 active:scale-95 transition-all">
                <Heart className="w-6 h-6 fill-white text-white animate-pulse" />
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Prompt or CTA */}
      <div className="mt-6 min-h-[70px] flex flex-col items-center justify-center">
        {!isOpen ? (
          <button
            onClick={handleOpenEnvelope}
            className="motion-button text-xs font-semibold tracking-wide text-[#B42345] bg-[#F7C8D0]/50 hover:bg-[#F7C8D0] px-4 py-2 rounded-full transition-all animate-content-in"
          >
            Ouvre ton petit mot 💌
          </button>
        ) : (
          <button
            onClick={() => {
              soundEngine.playHeartPop();
              onStartAdventure();
            }}
            className="motion-button w-full max-w-xs py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#E85D75] to-[#B42345] text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 animate-content-in"
          >
            <span>Découvrir ma surprise 💌</span>
          </button>
        )}

        <p className="text-[11px] text-[#321B2C]/60 mt-3 font-medium">
          À ton rythme, avec tout mon cœur. ❤️
        </p>
      </div>
    </div>
  );
};
