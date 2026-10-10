import { PresetMelodyId } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isSynthesizerRunning = false;
  private synthGainNode: GainNode | null = null;
  private synthTimer: number | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private sfxGainNode: GainNode | null = null;
  private musicDuckTimer: number | null = null;

  private currentMelody: PresetMelodyId = 'music-box';
  private volume = 0.6;
  private isMuted = false;
  private isLoop = true;

  constructor() {
    // Lazy init on first user interaction
  }

  private initAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.ctx) {
      const now = this.ctx.currentTime;
      const duck = this.musicDuckTimer !== null ? 0.48 : 1;
      const synthLevel = this.isMuted ? 0 : this.volume * 0.35 * duck;
      if (this.synthGainNode) {
        const param = this.synthGainNode.gain;
        param.cancelScheduledValues(now);
        param.setTargetAtTime(synthLevel, now, 0.035);
      }
      if (this.sfxGainNode) {
        this.sfxGainNode.gain.setTargetAtTime(this.isMuted ? 0 : this.volume * 0.2, now, 0.025);
      }
    }
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
      this.audioElement.muted = this.isMuted;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    this.setVolume(this.volume);
  }

  // --- Sound Effects (SFX) ---
  public playHeartPop() {
    try {
      const ctx = this.initAudioContext();
      this.duckMusic(150);
      this.playTone(740, ctx.currentTime, 0.12, 0.42, 'sine', 1046);
      this.playTone(1046, ctx.currentTime + 0.025, 0.1, 0.18, 'sine', 1175);
    } catch {
      // AudioContext policy catch
    }
  }

  public playCardFlip() {
    try {
      const ctx = this.initAudioContext();
      this.duckMusic(180);
      this.playTone(390, ctx.currentTime, 0.11, 0.36, 'triangle', 245);
      this.playTone(610, ctx.currentTime + 0.018, 0.07, 0.12, 'sine', 420);
    } catch {
      // AudioContext policy catch
    }
  }

  public playChime() {
    try {
      const ctx = this.initAudioContext();
      this.duckMusic(720);
      [587.33, 739.99, 880, 1174.66].forEach((freq, idx) => {
        this.playTone(freq, ctx.currentTime + idx * 0.075, 0.48, 0.32 - idx * 0.035, 'sine');
      });
    } catch {
      // AudioContext policy catch
    }
  }

  private ensureSfxBus(): GainNode {
    const ctx = this.initAudioContext();
    if (!this.sfxGainNode) {
      this.sfxGainNode = ctx.createGain();
      this.sfxGainNode.gain.value = this.isMuted ? 0 : this.volume * 0.2;
      this.sfxGainNode.connect(ctx.destination);
    }
    return this.sfxGainNode;
  }

  private playTone(
    frequency: number,
    startTime: number,
    duration: number,
    amplitude: number,
    type: OscillatorType,
    endFrequency?: number,
  ) {
    if (this.isMuted) return;
    const ctx = this.initAudioContext();
    const oscillator = ctx.createOscillator();
    const envelope = ctx.createGain();
    const endTime = startTime + duration;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);
    if (endFrequency) {
      oscillator.frequency.exponentialRampToValueAtTime(endFrequency, endTime);
    }
    envelope.gain.setValueAtTime(0.0001, startTime);
    envelope.gain.exponentialRampToValueAtTime(amplitude, startTime + Math.min(0.018, duration / 3));
    envelope.gain.exponentialRampToValueAtTime(0.0001, endTime);
    oscillator.connect(envelope);
    envelope.connect(this.ensureSfxBus());
    oscillator.start(startTime);
    oscillator.stop(endTime + 0.02);
  }

  private duckMusic(duration: number) {
    const ctx = this.initAudioContext();
    const now = ctx.currentTime;
    const duckedSynthLevel = this.isMuted ? 0 : this.volume * 0.35 * 0.48;
    if (this.synthGainNode) {
      this.synthGainNode.gain.cancelScheduledValues(now);
      this.synthGainNode.gain.setTargetAtTime(duckedSynthLevel, now, 0.025);
    }
    if (this.audioElement) {
      this.audioElement.volume = this.volume * 0.48;
    }

    if (this.musicDuckTimer !== null) {
      window.clearTimeout(this.musicDuckTimer);
    }
    this.musicDuckTimer = window.setTimeout(() => {
      const releaseTime = ctx.currentTime;
      const synthLevel = this.isMuted ? 0 : this.volume * 0.35;
      if (this.synthGainNode) {
        this.synthGainNode.gain.cancelScheduledValues(releaseTime);
        this.synthGainNode.gain.setTargetAtTime(synthLevel, releaseTime, 0.12);
      }
      if (this.audioElement) {
        this.audioElement.volume = this.volume;
      }
      this.musicDuckTimer = null;
    }, duration);
  }

  // --- Background Music: Custom Audio File ---
  public loadCustomAudio(audioUrl: string, onPlay?: () => void, onError?: (err: unknown) => void) {
    this.stopSynthesizer();
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
    }
    this.audioElement = new Audio(audioUrl);
    this.audioElement.preload = 'auto';
    this.audioElement.volume = this.volume;
    this.audioElement.muted = this.isMuted;
    this.audioElement.loop = this.isLoop;

    this.audioElement.addEventListener('play', () => {
      onPlay?.();
    });

    this.audioElement.addEventListener('error', (e) => {
      onError?.(e);
    });

    return this.audioElement.play();
  }

  // --- Background Music: Romantic Web Audio Synthesizer ---
  public playPresetMelody(preset: PresetMelodyId) {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.currentMelody = preset;
    this.startSynthesizer();
  }

  private startSynthesizer() {
    this.stopSynthesizer();
    const ctx = this.initAudioContext();

    this.synthGainNode = ctx.createGain();
    this.synthGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume * 0.35, ctx.currentTime);
    this.synthGainNode.connect(ctx.destination);

    this.isSynthesizerRunning = true;
    this.scheduleSynthesizerLoop();
  }

  private stopSynthesizer() {
    this.isSynthesizerRunning = false;
    if (this.synthTimer) {
      window.clearTimeout(this.synthTimer);
      this.synthTimer = null;
    }
    if (this.synthGainNode) {
      try {
        this.synthGainNode.disconnect();
      } catch {
        // ignore
      }
      this.synthGainNode = null;
    }
  }

  private scheduleSynthesizerLoop() {
    if (!this.isSynthesizerRunning || !this.ctx || !this.synthGainNode) return;

    // Beautiful harmonic chord progression:
    // Cmaj7 -> Am9 -> Fmaj7 -> Gsus4/G
    const sequences: Record<PresetMelodyId, { bpm: number; notes: number[][] }> = {
      'music-box': {
        bpm: 78,
        notes: [
          // Cmaj7 (C4, E4, G4, B4, C5)
          [261.63, 329.63, 392.0, 493.88, 523.25],
          // G/B (B3, D4, G4, D5)
          [246.94, 293.66, 392.0, 587.33],
          // Am9 (A3, C4, E4, B4, C5)
          [220.0, 261.63, 329.63, 493.88, 523.25],
          // Em (E3, G3, B3, E4, G4)
          [164.81, 196.0, 246.94, 329.63, 392.0],
          // Fmaj7 (F3, A3, C4, E4, A4)
          [174.61, 220.0, 261.63, 329.63, 440.0],
          // C/E (E3, G3, C4, G4)
          [164.81, 196.0, 261.63, 392.0],
          // Fadd9 (F3, C4, G4, A4)
          [174.61, 261.63, 392.0, 440.0],
          // G7sus4 -> G (G3, D4, F4, B4)
          [196.0, 293.66, 349.23, 493.88],
        ],
      },
      'soft-piano': {
        bpm: 64,
        notes: [
          [261.63, 329.63, 392.0, 523.25],
          [220.0, 261.63, 329.63, 440.0],
          [174.61, 220.0, 261.63, 329.63],
          [196.0, 246.94, 293.66, 392.0],
        ],
      },
      'starlight-waltz': {
        bpm: 90,
        notes: [
          [261.63, 392.0, 523.25],
          [220.0, 329.63, 440.0],
          [174.61, 261.63, 349.23],
          [196.0, 293.66, 392.0],
        ],
      },
      'custom-file': {
        bpm: 78,
        notes: [],
      },
    };

    const seq = sequences[this.currentMelody] || sequences['music-box'];
    const chordDuration = (60 / seq.bpm) * 3; // in seconds

    const now = this.ctx.currentTime;
    let timeOffset = 0;

    seq.notes.forEach((chord) => {
      chord.forEach((freq, noteIdx) => {
        if (!this.ctx || !this.synthGainNode) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        // Music box timbre: mix of sine with soft bell sparkle
        osc.type = this.currentMelody === 'soft-piano' ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + timeOffset + noteIdx * 0.18);

        const startTime = now + timeOffset + noteIdx * 0.18;
        const decayTime = this.currentMelody === 'soft-piano' ? 2.4 : 1.8;

        noteGain.gain.setValueAtTime(0.0001, startTime);
        noteGain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.03);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + decayTime);

        osc.connect(noteGain);
        noteGain.connect(this.synthGainNode);

        osc.start(startTime);
        osc.stop(startTime + decayTime + 0.1);
      });

      timeOffset += chordDuration;
    });

    const totalLoopDuration = timeOffset * 1000;
    this.synthTimer = window.setTimeout(() => {
      if (this.isLoop && this.isSynthesizerRunning) {
        this.scheduleSynthesizerLoop();
      } else {
        this.stopSynthesizer();
      }
    }, Math.max(100, totalLoopDuration - 200));
  }

  public pause() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopSynthesizer();
  }

  public resume(track: { isCustomFile: boolean; audioUrl?: string; id: PresetMelodyId }): Promise<void> {
    if (track.isCustomFile && track.audioUrl) {
      if (this.audioElement) {
        return this.audioElement.play();
      }
      return this.loadCustomAudio(track.audioUrl);
    }

    this.playPresetMelody(track.id);
    return Promise.resolve();
  }
}

export const soundEngine = new SoundEngine();
