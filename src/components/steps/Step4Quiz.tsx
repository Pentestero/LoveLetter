import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, ArrowRight, Award } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../../config';
import { soundEngine } from '../../utils/audio';

interface Step4QuizProps {
  onNextStep: () => void;
  onAnswersChange: (answers: string[]) => void;
}

export const Step4Quiz: React.FC<Step4QuizProps> = ({ onNextStep, onAnswersChange }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, { text: string; reaction: string }>>({});
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];
  const currentAnswer = selectedAnswers[currentQuestionIndex];

  const handleSelectOption = (option: { text: string; reaction: string }) => {
    soundEngine.playHeartPop();
    const updated = {
      ...selectedAnswers,
      [currentQuestionIndex]: option,
    };
    setSelectedAnswers(updated);
    onAnswersChange(
      QUIZ_QUESTIONS.flatMap((question, index) => {
        const answer = updated[index];
        return answer ? [`${question.question}\n${answer.text}`] : [];
      }),
    );
  };

  const handleNextQuestion = () => {
    soundEngine.playCardFlip();
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsQuizCompleted(true);
      soundEngine.playChime();
      confetti({
        particleCount: 50,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#F7C8D0', '#E85D75', '#B42345'],
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[68vh] text-center px-4 max-w-lg mx-auto py-2">
      {/* Title */}
      <div className="mb-4 space-y-1.5">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#B42345]">
          Étape 4 / 7
        </span>
        <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#321B2C]">
          Parlons de ce qui compte pour nous… 💘
        </h2>
        <p className="text-xs sm:text-sm text-[#321B2C]/80">
          Ce n’est pas un test : aucune mauvaise réponse, juste une façon d’écouter ce qui te ferait du bien.
        </p>
      </div>

      {!isQuizCompleted ? (
        <div className="w-full max-w-md bg-white/80 border border-[#F7C8D0] rounded-3xl p-5 shadow-sm space-y-4">
          {/* Question Counter */}
          <div className="flex items-center justify-between text-xs text-[#B42345] font-semibold border-b border-[#F7C8D0]/60 pb-2">
            <span>Question {currentQuestionIndex + 1} sur {QUIZ_QUESTIONS.length}</span>
            <span className="text-[#321B2C]/60 text-[11px]">Je veux surtout t’écouter 💕</span>
          </div>

          {/* Question Text */}
          <h3 className="text-sm sm:text-base font-bold text-[#321B2C] leading-snug">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-2">
            {currentQ.options.map((opt, idx) => {
              const isSelected = currentAnswer?.text === opt.text;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  className={`motion-button w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between text-xs sm:text-sm cursor-pointer min-h-[50px] ${
                    isSelected
                      ? 'border-[#E85D75] bg-[#F7C8D0]/40 font-semibold text-[#B42345] shadow-sm'
                      : 'border-[#F7C8D0]/70 bg-white hover:bg-[#F7C8D0]/20 text-[#321B2C]'
                  }`}
                >
                  <span>{opt.text}</span>
                  {isSelected && <span>💖</span>}
                </button>
              );
            })}
          </div>

          {/* Answer Reaction */}
          {currentAnswer && (
            <div className="p-3 bg-[#FFF0F3] rounded-2xl border border-[#F7C8D0] animate-fadeIn">
              <p className="text-xs text-[#B42345] font-medium leading-relaxed">
                {currentAnswer.reaction}
              </p>
            </div>
          )}

          {/* Next Question Button */}
          {currentAnswer && (
            <button
              onClick={handleNextQuestion}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#E85D75] to-[#B42345] text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? 'Question suivante' : 'Voir le résultat'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        /* Quiz Finished Card */
        <div className="w-full max-w-md bg-white/90 border border-[#E85D75] rounded-3xl p-6 shadow-md text-center space-y-4 animate-fadeIn">
          <div className="w-14 h-14 rounded-full bg-[#F7C8D0]/60 mx-auto flex items-center justify-center text-3xl">
            🏆
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E85D75] uppercase tracking-wider bg-[#F7C8D0]/40 px-3 py-1 rounded-full">
            <Award className="w-3.5 h-3.5" />
            <span>Merci de m’avoir répondu</span>
          </div>

          <h3 className="font-serif-display text-lg sm:text-xl font-bold text-[#B42345]">
            Il n’y a pas de bonne note en amour : ce que tu ressens mérite d’être entendu. ❤️
          </h3>

          <p className="text-xs sm:text-sm text-[#321B2C]/80 leading-relaxed">
            Merci de m’avoir partagé un peu de ce qui compte pour toi. Je veux en tenir compte, pas te faire passer un examen. ❤️
          </p>

          <button
            onClick={() => {
              soundEngine.playHeartPop();
              onNextStep();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#E85D75] to-[#B42345] text-white font-semibold text-sm shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            <span>Merci d’avoir partagé cela avec moi 💌</span>
            <Heart className="w-4 h-4 fill-current" />
          </button>
        </div>
      )}
    </div>
  );
};
