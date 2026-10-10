import React, { useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { SoundState } from '../types';
import { soundEngine } from '../utils/audio';

interface AudioPlayerBarProps {
  soundState: SoundState;
  onPlayAudio: () => Promise<void>;
  onUpdateSoundState: (updated: Partial<SoundState>) => void;
  audioError: string | null;
  onAudioError: (message: string | null) => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  soundState,
  onPlayAudio,
  onUpdateSoundState,
  audioError,
  onAudioError,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTogglePlay = () => {
    // Unlock audio on mobile — must be called synchronously in a user gesture
    soundEngine.unlock();

    if (soundState.isPlaying) {
      soundEngine.pause();
      onUpdateSoundState({ isPlaying: false });
    } else {
      soundEngine.setMuted(false);
      onAudioError(null);
      onPlayAudio().then(() => {
        onUpdateSoundState({ isPlaying: true, isMuted: false });
      }).catch((error: unknown) => {
        onUpdateSoundState({ isPlaying: false, isMuted: false });
        const reason = error instanceof DOMException && error.name === 'NotAllowedError'
          ? 'Touche le bouton Lecture une fois de plus pour lancer la musique \u{1F3B5}'
          : 'La piste n\u2019a pas pu d\u00E9marrer. Essaie avec le lecteur natif affich\u00E9 en bas.';
        onAudioError(reason);
      });
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !soundState.isMuted;
    soundEngine.setMuted(nextMuted);
    onUpdateSoundState({ isMuted: nextMuted });
  };

  return (
    <aside
      aria-label="Lecteur audio d'ambiance"
      className="fixed bottom-3 right-3 z-40 transition-all duration-300"
    >
      {audioError && (
        <p role="alert" className="mb-2 max-w-[92vw] rounded-2xl border border-[#F7C8D0] bg-[#FFF8F5] px-3 py-2 text-xs text-[#B42345] shadow-lg">
          {audioError}
        </p>
      )}
      <div className="bg-[#FFF8F5]/90 backdrop-blur-md border border-[#F7C8D0]/80 rounded-full shadow-lg p-1.5 flex items-center gap-2 max-w-[92vw]">
        {/* Play/Pause Button */}
        <button
          onClick={handleTogglePlay}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-[#E85D75] to-[#B42345] text-white flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all shrink-0 min-w-[40px]"
          title={soundState.isPlaying ? 'Mettre en pause' : 'Lancer la musique'}
          aria-label={soundState.isPlaying ? 'Pause' : 'Lecture'}
        >
          {soundState.isPlaying ? (
            <Pause className="w-4 h-4 fill-white" />
          ) : (
            <Play className="w-4 h-4 fill-white translate-x-0.5" />
          )}
        </button>

        {/* Track details (expandable or compact) */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-1 text-left cursor-pointer group"
          title="Cliquez pour afficher les d\u00E9tails"
        >
          {/* Animated Equalizer bars */}
          <div className="flex items-end gap-0.5 h-4 w-4 shrink-0 py-0.5">
            <span
              className={`w-1 bg-[#E85D75] rounded-full transition-all duration-300 ${
                soundState.isPlaying && !soundState.isMuted
                  ? 'h-3.5 animate-pulse'
                  : 'h-1.5 opacity-40'
              }`}
            />
            <span
              className={`w-1 bg-[#B42345] rounded-full transition-all duration-300 ${
                soundState.isPlaying && !soundState.isMuted
                  ? 'h-4 animate-bounce'
                  : 'h-2 opacity-40'
              }`}
            />
            <span
              className={`w-1 bg-[#E85D75] rounded-full transition-all duration-300 ${
                soundState.isPlaying && !soundState.isMuted
                  ? 'h-2.5 animate-pulse'
                  : 'h-1 opacity-40'
              }`}
            />
          </div>

          {/* Titles */}
          <div className="flex flex-col max-w-[130px] sm:max-w-[170px] leading-tight">
            <span className="text-[11px] font-semibold text-[#321B2C] truncate">
              {soundState.currentTrack.name}
            </span>
            <span className="text-[9px] text-[#B42345]/80 truncate">
              {soundState.currentTrack.artist}
            </span>
          </div>
        </button>

        {/* Quick Mute Toggle */}
        <button
          onClick={handleToggleMute}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#B42345] hover:bg-[#F7C8D0]/40 transition-colors shrink-0"
          title={soundState.isMuted ? 'Activer le son' : 'Couper le son'}
          aria-label={soundState.isMuted ? 'Activer le son' : 'Couper le son'}
        >
          {soundState.isMuted || soundState.volume === 0 ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>

      </div>
    </aside>
  );
};
