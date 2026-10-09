import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { POSTCARD_TEXT } from '../../config';
import { soundEngine } from '../../utils/audio';

interface Step5PostcardProps {
  recipientName: string;
  senderName: string;
  onNextStep: () => void;
}

export const Step5Postcard: React.FC<Step5PostcardProps> = ({
  recipientName,
  senderName,
  onNextStep,
}) => {
  const [revealedParagraphs, setRevealedParagraphs] = useState<number>(1);

  useEffect(() => {
    // Progressively reveal paragraphs smoothly
    const interval = setInterval(() => {
      setRevealedParagraphs((prev) => {
        if (prev < POSTCARD_TEXT.paragraphs.length) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 900);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[68vh] text-center px-4 max-w-lg mx-auto py-2">
      {/* Title */}
      <div className="mb-4 space-y-1.5">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#B42345]">
          Étape 5 / 7
        </span>
        <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#321B2C]">
          Quelques mots que je voulais te dire… 🌹
        </h2>
      </div>

      {/* Postcard Container */}
      <div className="w-full max-w-md bg-[#FFF8F5] border-2 border-[#E85D75]/40 rounded-3xl p-6 sm:p-7 shadow-xl relative text-left my-2 overflow-hidden">
        {/* Subtle decorative stamp & postal watermark */}
        <div className="absolute top-4 right-4 flex flex-col items-center">
          <div className="w-12 h-14 border border-dashed border-[#B42345] rounded-lg bg-white/80 p-1 flex flex-col items-center justify-center shadow-xs">
            <span className="text-xl">💌</span>
            <span className="text-[8px] font-bold text-[#B42345] uppercase tracking-tighter mt-0.5">
              Amour 1st
            </span>
          </div>
          {/* Postmark circle */}
          <div className="w-9 h-9 rounded-full border border-[#E85D75]/50 flex items-center justify-center -mt-2 -mr-3 rotate-12">
            <span className="text-[8px] font-bold text-[#B42345]/70">SPECIAL</span>
          </div>
        </div>

        {/* Greeting */}
        <div className="font-script text-2xl sm:text-3xl text-[#B42345] font-semibold mb-3">
          {POSTCARD_TEXT.greeting.replace('Shekinaël', recipientName)}
        </div>

        {/* Paragraphs with gentle progressive reveal */}
        <div className="space-y-3 text-xs sm:text-sm text-[#321B2C]/90 leading-relaxed pr-8">
          {POSTCARD_TEXT.paragraphs.slice(0, revealedParagraphs).map((para, idx) => (
            <p key={idx} className="animate-fadeIn">
              {para}
            </p>
          ))}
        </div>

        {/* Closing & Signature */}
        <div className="mt-5 pt-3 border-t border-[#F7C8D0]/60 flex flex-col items-end">
          <span className="text-xs text-[#321B2C]/70 italic">
            {POSTCARD_TEXT.closing}
          </span>
          <span className="font-script text-xl sm:text-2xl text-[#B42345] font-semibold mt-0.5 flex items-center gap-1.5">
            {senderName}
            <Heart className="w-4 h-4 fill-[#B42345] text-[#B42345]" />
          </span>
        </div>
      </div>

      {/* Continue button */}
      <div className="mt-5 w-full max-w-xs">
        <button
          onClick={() => {
            soundEngine.playHeartPop();
            onNextStep();
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#E85D75] to-[#B42345] text-white font-semibold text-sm shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>J'ai un dernier message pour toi… 💗</span>
          <Heart className="w-4 h-4 fill-current" />
        </button>
      </div>
    </div>
  );
};
