import { useEffect, useRef, useState } from 'react';
import { FloatingHearts } from './components/FloatingHearts';
import { RomanticPathMap } from './components/RomanticPathMap';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { CustomPhotoGallery } from './components/CustomPhotoGallery';
import { Step0Welcome } from './components/steps/Step0Welcome';
import { Step1Mood } from './components/steps/Step1Mood';
import { Step2Butterflies } from './components/steps/Step2Butterflies';
import { Step3Cards } from './components/steps/Step3Cards';
import { Step4Quiz } from './components/steps/Step4Quiz';
import { Step5Postcard } from './components/steps/Step5Postcard';
import { Step6SoftMoment } from './components/steps/Step6SoftMoment';
import { Step7FinalDeclaration } from './components/steps/Step7FinalDeclaration';
import { DEFAULT_CONFIG, DEFAULT_MUSIC_TRACK, DEFAULT_PHOTOS } from './config';
import { SoundState } from './types';
import { soundEngine } from './utils/audio';
import { Camera } from 'lucide-react';

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedMoodId, setSelectedMoodId] = useState<string | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const config = DEFAULT_CONFIG;
  const photos = DEFAULT_PHOTOS;

  useEffect(() => {
    const audio = audioRef.current;
    soundEngine.attachAudioElement(audio);
    if (!audio) return;

    const handleAudioError = () => {
      setSoundState((prev) => ({ ...prev, isPlaying: false }));
      setAudioError('Chrome n’a pas pu lancer le fichier audio. Utilise le lecteur natif ci-dessous pour réessayer.');
    };
    const handleAudioPause = () => {
      if (!audio.ended) {
        setSoundState((prev) => ({ ...prev, isPlaying: false }));
      }
    };
    const handleAudioPlaying = () => {
      setAudioError(null);
      setSoundState((prev) => ({ ...prev, isPlaying: true, isMuted: false }));
    };

    audio.addEventListener('error', handleAudioError);
    audio.addEventListener('pause', handleAudioPause);
    audio.addEventListener('playing', handleAudioPlaying);
    return () => {
      audio.removeEventListener('error', handleAudioError);
      audio.removeEventListener('pause', handleAudioPause);
      audio.removeEventListener('playing', handleAudioPlaying);
    };
  }, []);

  // Mobile audio unlock: prime audio on first user gesture (tap/click).
  // This is required by iOS Safari and Android Chrome to allow programmatic
  // .play() calls later without getting NotAllowedError.
  useEffect(() => {
    const unlockAudio = () => {
      soundEngine.unlock();
      document.removeEventListener('touchstart', unlockAudio, true);
      document.removeEventListener('touchend', unlockAudio, true);
      document.removeEventListener('click', unlockAudio, true);
    };
    document.addEventListener('touchstart', unlockAudio, { capture: true, once: false });
    document.addEventListener('touchend', unlockAudio, { capture: true, once: false });
    document.addEventListener('click', unlockAudio, { capture: true, once: false });
    return () => {
      document.removeEventListener('touchstart', unlockAudio, true);
      document.removeEventListener('touchend', unlockAudio, true);
      document.removeEventListener('click', unlockAudio, true);
    };
  }, []);

  // Sound state
  const [soundState, setSoundState] = useState<SoundState>(() => {
    return {
      isPlaying: false,
      isMuted: false,
      volume: 0.6,
      currentTrack: DEFAULT_MUSIC_TRACK,
    };
  });

  const handleUpdateSoundState = (updated: Partial<SoundState>) => {
    setSoundState((prev) => ({ ...prev, ...updated }));
  };

  const handleResumeAudio = (): Promise<void> => {
    // Must unlock inside the user-gesture call stack for mobile
    soundEngine.unlock();
    soundEngine.setMuted(false);
    const audio = audioRef.current;
    if (soundState.currentTrack.isCustomFile && audio) {
      // On mobile, directly calling .play() on the element within the
      // gesture handler is the most reliable approach.
      audio.volume = soundState.volume;
      audio.muted = false;
      audio.loop = true;
      const p = audio.play();
      return p || Promise.resolve();
    }
    return soundEngine.resume(soundState.currentTrack);
  };

  const handleEnvelopeOpen = () => {
    if (soundState.isPlaying) return;
    setAudioError(null);
    handleResumeAudio().then(() => {
      setSoundState((prev) => ({ ...prev, isPlaying: true, isMuted: false }));
    }).catch(() => {
      setSoundState((prev) => ({ ...prev, isPlaying: false, isMuted: false }));
      setAudioError('Chrome a refusé la lecture. Touche directement Lecture ou le contrôle audio natif ci-dessous.');
    });
  };

  // Start adventure from welcome envelope
  const handleStartAdventure = () => {
    setCurrentStep(1);
    if (!soundState.isPlaying) {
      handleResumeAudio().then(() => {
        setSoundState((prev) => ({ ...prev, isPlaying: true, isMuted: false }));
      }).catch(() => {
        setSoundState((prev) => ({ ...prev, isPlaying: false, isMuted: false }));
        setAudioError('Chrome a refusé la lecture. Touche directement Lecture ou le contrôle audio natif ci-dessous.');
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 7));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedMoodId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FFF8F5] text-[#321B2C] relative flex flex-col justify-between overflow-x-hidden selection:bg-[#F7C8D0] selection:text-[#B42345]">
      <audio
        ref={audioRef}
        src={DEFAULT_MUSIC_TRACK.audioUrl}
        preload="auto"
        loop
        playsInline
        controls={Boolean(audioError)}
        aria-label="Lecteur de musique natif"
        className={audioError
          ? 'fixed bottom-20 left-1/2 z-50 w-[min(92vw,24rem)] -translate-x-1/2 rounded-xl shadow-xl'
          : 'sr-only'}
      />
      {/* Background Animated Atmosphere */}
      <FloatingHearts />

      {/* Top Navigation Bar */}
      <header className="relative z-30 w-full px-3 sm:px-8 py-3.5 flex items-center justify-between border-b border-[#F7C8D0]/40 bg-[#FFF8F5]/85 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="font-serif-display text-lg sm:text-xl font-bold tracking-tight text-[#B42345]">
            {config.recipientName}
          </span>
          <span className="text-xs text-[#E85D75] select-none">❤️</span>
          <span className="text-xs text-[#321B2C]/50 font-medium hidden sm:inline">& {config.senderName}</span>
        </div>

        {/* Quick actions in top bar */}
        <div className="flex items-center gap-2">
          {/* Photos Button */}
          <button
            onClick={() => {
              soundEngine.playHeartPop();
              setIsPhotoModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#B42345] bg-[#F7C8D0]/50 hover:bg-[#F7C8D0] shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
            title="Voir notre album photo 📷"
          >
            <Camera className="w-3.5 h-3.5 text-[#E85D75]" />
            <span>Photos</span>
            <span className="w-2 h-2 rounded-full bg-[#E85D75] animate-pulse" />
          </button>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-3 sm:px-6 py-3 pb-24">
        {/* Animated Motion Design Pathway (visible from step 1 onwards) */}
        {currentStep > 0 && (
          <RomanticPathMap
            currentStep={currentStep}
            totalSteps={7}
            onNavigateStep={(step) => setCurrentStep(step)}
          />
        )}

        {/* Interactive Step Container with 3D Depth & Transitions */}
        <div key={currentStep} className="w-full step-transition">
          {currentStep === 0 && (
            <Step0Welcome
              recipientName={config.recipientName}
              onStartAdventure={handleStartAdventure}
              onEnvelopeOpen={handleEnvelopeOpen}
            />
          )}

          {currentStep === 1 && (
            <Step1Mood
              selectedMoodId={selectedMoodId}
              onSelectMood={(id) => setSelectedMoodId(id)}
              onNextStep={handleNextStep}
            />
          )}

          {currentStep === 2 && (
            <Step2Butterflies onNextStep={handleNextStep} />
          )}

          {currentStep === 3 && (
            <Step3Cards onNextStep={handleNextStep} />
          )}

          {currentStep === 4 && (
            <Step4Quiz onNextStep={handleNextStep} />
          )}

          {currentStep === 5 && (
            <Step5Postcard
              recipientName={config.recipientName}
              senderName={config.senderName}
              onNextStep={handleNextStep}
            />
          )}

          {currentStep === 6 && (
            <Step6SoftMoment onNextStep={handleNextStep} />
          )}

          {currentStep === 7 && (
            <Step7FinalDeclaration
              recipientName={config.recipientName}
              senderName={config.senderName}
              whatsappPhone={config.whatsappPhone}
              onRestart={handleRestart}
            />
          )}
        </div>

        {/* Floating Mini Banner to Explore Photos when in mid-journey */}
        {currentStep > 0 && currentStep < 7 && (
          <div className="mt-4 flex items-center justify-center">
            <button
              onClick={() => {
                soundEngine.playHeartPop();
                setIsPhotoModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-[#E85D75] hover:text-[#B42345] bg-white/70 hover:bg-white border border-[#F7C8D0]/60 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <Camera className="w-3 h-3" />
              <span>Voir notre album photo de souvenirs ({photos.length}) 📸</span>
            </button>
          </div>
        )}
      </main>

      {/* Floating Audio Player */}
      <AudioPlayerBar
        soundState={soundState}
        onPlayAudio={handleResumeAudio}
        onUpdateSoundState={handleUpdateSoundState}
        audioError={audioError}
        onAudioError={setAudioError}
      />

      {/* Read-only romantic photo gallery */}
      <CustomPhotoGallery
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        photos={photos}
        recipientName={config.recipientName}
        senderName={config.senderName}
      />
    </div>
  );
}
