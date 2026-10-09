import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Image as ImageIcon, MessageCircle, RotateCcw } from 'lucide-react';
import { FINAL_DECLARATION, FINAL_DECLARATION_PHOTO } from '../../config';
import { soundEngine } from '../../utils/audio';

interface Step7FinalDeclarationProps {
  recipientName: string;
  senderName: string;
  whatsappPhone: string;
  customWhatsAppMessage: string;
  quizAnswers: string[];
  onRestart: () => void;
}

export const Step7FinalDeclaration: React.FC<Step7FinalDeclarationProps> = ({
  recipientName,
  senderName,
  whatsappPhone,
  customWhatsAppMessage,
  quizAnswers,
  onRestart,
}) => {

  useEffect(() => {
    soundEngine.playChime();
    // Glorious celebratory confetti burst
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#F7C8D0', '#E85D75', '#B42345'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const handleSendWhatsApp = () => {
    soundEngine.playHeartPop();
    const defaultMessage = `Coucou ${senderName} ❤️ J'ai découvert ta surprise et elle m'a fait sourire ! Je t'envoie plein de cœurs. 💗`;
    const answersMessage = quizAnswers.length
      ? `\n\nMes réponses au petit quiz :\n${quizAnswers.map((answer, index) => `${index + 1}. ${answer}`).join('\n\n')}`
      : '';
    const encoded = encodeURIComponent(`${customWhatsAppMessage || defaultMessage}${answersMessage}`);

    const cleanPhone = whatsappPhone.replace(/[^0-9]/g, '');

    let url = '';
    if (cleanPhone && cleanPhone.length >= 6) {
      url = `https://wa.me/${cleanPhone}?text=${encoded}`;
    } else {
      // Direct WhatsApp share without pre-assigned phone: Shekinaël selects Pierre's chat
      url = `https://api.whatsapp.com/send?text=${encoded}`;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center px-4 max-w-lg mx-auto py-4">
      {/* Grand Romantic Header & Glowing Heart */}
      <div className="relative my-3">
        {/* Glowing halo */}
        <div className="absolute inset-0 bg-[#E85D75]/25 rounded-full blur-2xl animate-pulse" />
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#E85D75] to-[#B42345] shadow-xl flex items-center justify-center text-white relative animate-gentle-pulse">
          <Heart className="w-10 h-10 sm:w-12 sm:h-12 fill-white text-white drop-shadow-md" />
        </div>
      </div>

      {/* Main Title */}
      <div className="mb-4 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B42345] bg-[#F7C8D0]/40 px-3 py-1 rounded-full">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Déclaration Finale</span>
          <Heart className="w-3.5 h-3.5 fill-current" />
        </div>

        <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#321B2C] leading-tight">
          {recipientName}, cette petite surprise était pour toi… ❤️
        </h1>
      </div>

      {/* Reserved spot for the personal photo to be supplied before production. */}
      <div className="w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden border border-[#F7C8D0] shadow-lg bg-gradient-to-br from-[#FFF0F3] via-white to-[#F7C8D0]/50 relative my-3">
        {FINAL_DECLARATION_PHOTO ? (
          <img
            src={FINAL_DECLARATION_PHOTO}
            alt={`Un souvenir de ${recipientName} et ${senderName}`}
            className="w-full h-full object-cover object-[center_42%]"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#B42345]">
            <div className="w-16 h-16 rounded-full bg-white/80 shadow-sm flex items-center justify-center">
              <ImageIcon className="w-7 h-7" />
            </div>
            <span className="font-script text-2xl font-semibold">Un souvenir à deux</span>
            <span className="text-xs text-[#321B2C]/60">Votre photo prendra sa place ici</span>
          </div>
        )}
      </div>

      {/* Card with complete romantic letter */}
      <div className="w-full max-w-md bg-white/90 border border-[#F7C8D0] rounded-3xl p-6 sm:p-7 shadow-xl space-y-3.5 text-left text-xs sm:text-sm text-[#321B2C]/90 leading-relaxed my-2">
        {FINAL_DECLARATION.paragraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}

        {/* Highlighted Banner */}
        <div className="mt-6 pt-4 border-t border-[#F7C8D0]/70 text-center">
          <p className="font-script text-2xl sm:text-3xl text-[#B42345] font-bold">
            Pour toi, {recipientName}. Avec tout mon amour. ❤️
          </p>
          <p className="text-xs text-[#321B2C]/70 mt-1 italic">— {senderName}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-md mt-6 space-y-3">
        {/* Button: Send WhatsApp */}
        <button
          onClick={handleSendWhatsApp}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 fill-white" />
          <span>Envoyer mes réponses à {senderName} par WhatsApp ❤️</span>
        </button>
        <p className="text-[11px] text-[#321B2C]/60 text-center">
          WhatsApp s’ouvrira avec tes réponses déjà écrites. Relis-les puis appuie sur « Envoyer » si tu le souhaites.
        </p>

        {/* Button: Restart */}
        <button
          onClick={() => {
            soundEngine.playCardFlip();
            onRestart();
          }}
          className="w-full py-3 px-6 rounded-2xl bg-white/80 hover:bg-white text-[#B42345] border border-[#F7C8D0] font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Revoir ma surprise 🔄</span>
        </button>

      </div>
    </div>
  );
};
