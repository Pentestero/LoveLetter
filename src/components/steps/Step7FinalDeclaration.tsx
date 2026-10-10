import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Image as ImageIcon, MessageCircle, RotateCcw } from 'lucide-react';
import { FINAL_DECLARATION, FINAL_DECLARATION_PHOTO } from '../../config';
import { soundEngine } from '../../utils/audio';

interface Step7FinalDeclarationProps {
  recipientName: string;
  senderName: string;
  whatsappPhone: string;
  onRestart: () => void;
}

export const Step7FinalDeclaration: React.FC<Step7FinalDeclarationProps> = ({
  recipientName,
  senderName,
  whatsappPhone,
  onRestart,
}) => {
  const [messageChoice, setMessageChoice] = useState<'yes' | 'no' | null>(null);

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
    const cleanPhone = whatsappPhone.replace(/[^0-9]/g, '');
    const url = cleanPhone.length >= 6
      ? `https://wa.me/${cleanPhone}`
      : 'https://api.whatsapp.com/send';
    setMessageChoice('yes');
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
      <div className="final-photo-reveal w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden border border-[#F7C8D0] shadow-lg bg-gradient-to-br from-[#FFF0F3] via-white to-[#F7C8D0]/50 relative my-3">
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

      {/* A personal note inspired by their shared story */}
      <aside className="memory-note-reveal w-full max-w-md my-3 rounded-3xl border border-[#E85D75]/30 bg-gradient-to-br from-[#FFF0F3] via-white to-[#FFF8F5] p-5 sm:p-6 text-left shadow-lg">
        <div className="mb-3 flex items-center gap-2 text-[#B42345]">
          <Heart className="h-4 w-4 fill-current" />
          <h2 className="font-serif-display text-base font-bold sm:text-lg">Ce que j’ai compris de toi</h2>
        </div>
        <p className="text-xs leading-relaxed text-[#321B2C]/90 sm:text-sm">
          J’ai compris que l’amour compte énormément pour toi, même si la peur d’être déçue est encore là. Je ne te demanderai pas d’effacer ton passé : je veux, avec le temps et mes actes, t’aider à retrouver confiance, faire renaître ton joli sourire et bâtir un amour qui ait du sens. Pour tes 24 ans, j’espère que nous aurons franchi un beau cap. Même si c’est parfois difficile, avançons ensemble, à ton rythme. Promis, je ferai ma part. ❤️
        </p>
        <p className="mt-3 text-xs leading-relaxed text-[#321B2C]/90 sm:text-sm">
          Et pour tes études, tu n’es pas seule : je serai là pour t’encourager, autant que possible. En nous parlant avec sincérité, on évitera bien des malentendus. Ensemble, on avancera. Je crois en toi. ❤️
        </p>
        <p className="mt-4 text-right font-script text-xl font-semibold text-[#B42345] sm:text-2xl">
          Ton homme, {senderName}
        </p>
      </aside>

      {/* Card with complete romantic letter */}
      <div className="final-letter-reveal w-full max-w-md bg-white/90 border border-[#F7C8D0] rounded-3xl p-6 sm:p-7 shadow-xl space-y-3.5 text-left text-xs sm:text-sm text-[#321B2C]/90 leading-relaxed my-2">
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
        <section className="rounded-3xl border border-[#F7C8D0] bg-white/85 p-5 text-center shadow-sm" aria-labelledby="message-choice-title">
          <h2 id="message-choice-title" className="font-serif-display text-lg font-bold text-[#321B2C]">
            Tu veux laisser un mot à {senderName} ?
          </h2>
          <p className="mt-1 text-xs text-[#321B2C]/65">
            C’est toi qui choisis quoi lui écrire, si tu en as envie. ❤️
          </p>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="motion-button flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] px-4 py-2 text-sm font-semibold text-white shadow-sm"
            >
              <MessageCircle className="h-4 w-4" />
              Oui, lui écrire
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playCardFlip();
                setMessageChoice('no');
              }}
              className="motion-button min-h-11 rounded-xl border border-[#F7C8D0] bg-[#FFF8F5] px-4 py-2 text-sm font-semibold text-[#B42345]"
            >
              Non, pas maintenant
            </button>
          </div>
          {messageChoice && (
            <p role="status" className="mt-3 animate-fadeIn text-xs font-medium text-[#B42345]">
              {messageChoice === 'yes'
                ? 'WhatsApp s’ouvre sans message préécrit : écris seulement ce que tu souhaites.'
                : 'Bien sûr. Tu peux garder ce joli moment pour toi. 💗'}
            </p>
          )}
        </section>

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
