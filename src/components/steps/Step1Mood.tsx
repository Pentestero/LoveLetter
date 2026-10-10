import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { MOOD_OPTIONS } from '../../config';
import { soundEngine } from '../../utils/audio';

interface Step1MoodProps {
  selectedMoodId: string | null;
  onSelectMood: (moodId: string) => void;
  onNextStep: () => void;
}

export const Step1Mood: React.FC<Step1MoodProps> = ({
  selectedMoodId,
  onSelectMood,
  onNextStep,
}) => {
  const [activeMood, setActiveMood] = useState<string | null>(selectedMoodId);

  const handleChoose = (id: string) => {
    setActiveMood(id);
    onSelectMood(id);
    soundEngine.playHeartPop();
  };

  const selectedOption = MOOD_OPTIONS.find((m) => m.id === activeMood);

  return (
    <div className="flex flex-col items-center justify-center min-h-[68vh] text-center px-4 max-w-lg mx-auto py-2">
      {/* Title & Question */}
      <div className="mb-6 space-y-2">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#B42345]">
          Étape 1 / 7
        </span>
        <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#321B2C]">
          Dis-moi…
        </h2>
        <p className="text-sm sm:text-base text-[#321B2C]/80 font-medium">
          Comment tu te sens, là, maintenant ? ❤️
        </p>
      </div>

      {/* 3 Interactive Cards */}
      <div className="stagger-reveal grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-md my-2">
        {MOOD_OPTIONS.map((opt) => {
          const isSelected = activeMood === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleChoose(opt.id)}
              className={`motion-card p-4 rounded-2xl border transition-all text-center flex flex-col items-center justify-center min-h-[110px] cursor-pointer ${
                isSelected
                  ? 'border-[#E85D75] bg-[#F7C8D0]/40 shadow-md scale-105'
                  : 'border-[#F7C8D0]/60 bg-white/70 hover:bg-white hover:border-[#E85D75]/50 shadow-sm'
              }`}
            >
              <span className="text-3xl mb-2 select-none transform transition-transform group-hover:scale-110">
                {opt.emoji}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#321B2C]">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Feedback Message */}
      <div className="mt-6 min-h-[85px] w-full max-w-md flex flex-col items-center justify-center">
        {selectedOption ? (
          <div className="p-4 rounded-2xl bg-white/80 border border-[#F7C8D0] shadow-sm animate-fadeIn w-full">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#B42345] mb-1">
              <Heart className="w-3.5 h-3.5 fill-[#B42345]" />
              <span>Je t’écoute</span>
            </div>
            <p className="text-xs sm:text-sm text-[#321B2C] font-medium leading-relaxed">
              {selectedOption.response}
            </p>
          </div>
        ) : (
          <p className="text-xs text-[#321B2C]/60 italic">
            Choisis ce qui te ressemble aujourd’hui…
          </p>
        )}
      </div>

      {/* Continue button */}
      <div className="mt-5 w-full max-w-xs">
        <button
          onClick={() => {
            soundEngine.playHeartPop();
            onNextStep();
          }}
          disabled={!activeMood}
          className={`motion-button w-full py-3.5 px-6 rounded-2xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
            activeMood
              ? 'bg-gradient-to-r from-[#E85D75] to-[#B42345] text-white hover:shadow-lg active:scale-[0.98] cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-70'
          }`}
        >
          <span>Voyons la suite 👀</span>
          <Heart className="w-4 h-4 fill-current" />
        </button>
      </div>
    </div>
  );
};
