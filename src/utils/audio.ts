import { PresetMelodyId } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isSynthesizerRunning = false;
  private synthGainNode: GainNode | null = null;
  private synthTimer: number | null = null;
  private sfxGainNode: GainNode | null = null;
  private musicDuckTimer: number | null = null;

  private currentMelody: PresetMelodyId = 'music-box';
  private volume = 0.6;
  private isMuted = false;
  private isLoop = true;

  constructor() {
    // Lazy init on first user interaction
  }

  /**
   * Resume AudioContext if suspended — call from any user-gesture handler.
   * Does NOT touch the <audio> element (no play/pause race).
   */
  public ensureAudioContextResumed(): Promise<void> {
    try {
      const ctx = this.initAudioContext();
      return ctx.state === 'suspended' ? ctx.resume() : Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private initAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    return this.ctx;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.ctx) {
      const now = this.ctx.currentTime;
      const duck = this.musicDuckTimer !== null ? 0.48 : 1;
      const synthLevel = this.isMuted ? 0 : this.volume * 0.75 * duck;
      if (this.synthGainNode) {
        const param = this.synthGainNode.gain;
        param.cancelScheduledValues(now);
        param.setTargetAtTime(synthLevel, now, 0.035);
      }
      if (this.sfxGainNode) {
        this.sfxGainNode.gain.setTargetAtTime(this.isMuted ? 0 : this.volume * 0.2, now, 0.025);
      }
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
      void this.ensureAudioContextResumed().catch(() => {});
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
      void this.ensureAudioContextResumed().catch(() => {});
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
      void this.ensureAudioContextResumed().catch(() => {});
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
    const duckedSynthLevel = this.isMuted ? 0 : this.volume * 0.75 * 0.48;
    if (this.synthGainNode) {
      this.synthGainNode.gain.cancelScheduledValues(now);
      this.synthGainNode.gain.setTargetAtTime(duckedSynthLevel, now, 0.025);
    }
    if (this.musicDuckTimer !== null) {
      window.clearTimeout(this.musicDuckTimer);
    }
    this.musicDuckTimer = window.setTimeout(() => {
      const releaseTime = ctx.currentTime;
      const synthLevel = this.isMuted ? 0 : this.volume * 0.75;
      if (this.synthGainNode) {
        this.synthGainNode.gain.cancelScheduledValues(releaseTime);
        this.synthGainNode.gain.setTargetAtTime(synthLevel, releaseTime, 0.12);
      }
      this.musicDuckTimer = null;
    }, duration);
  }

  // --- Background Music: Romantic Web Audio Synthesizer ---
  public playPresetMelody(preset: PresetMelodyId): Promise<void> {
    this.currentMelody = preset;
    let resumePromise: Promise<void>;
    try {
      // Calling resume here, synchronously from the envelope tap, satisfies
      // the mobile browser's user-activation requirement for Web Audio.
      resumePromise = this.ensureAudioContextResumed();
    } catch (error) {
      return Promise.reject(error);
    }
    this.startSynthesizer();
    return resumePromise.then(() => undefined).catch((error: unknown) => {
      this.stopSynthesizer();
      throw error;
    });
  }

  private startSynthesizer() {
    this.stopSynthesizer();
    const ctx = this.initAudioContext();

    this.synthGainNode = ctx.createGain();
    this.synthGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume * 0.75, ctx.currentTime);
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
          // Second phrase: gentle inversions for a longer, flowing theme
          [261.63, 329.63, 392.0, 523.25],
          [196.0, 246.94, 293.66, 392.0],
          [220.0, 261.63, 329.63, 440.0],
          [164.81, 220.0, 261.63, 329.63],
          [174.61, 220.0, 261.63, 392.0],
          [164.81, 196.0, 261.63, 329.63],
          [174.61, 261.63, 349.23, 440.0],
          [196.0, 246.94, 293.66, 349.23],
        ],
      },
      'soft-piano': {
        bpm: 66,
        notes: [
          [261.63, 329.63, 392.0, 523.25],
          [220.0, 261.63, 329.63, 440.0],
          [174.61, 220.0, 261.63, 329.63],
          [196.0, 246.94, 293.66, 392.0],
          [261.63, 329.63, 392.0, 493.88],
          [246.94, 293.66, 392.0, 493.88],
          [220.0, 261.63, 329.63, 440.0],
          [196.0, 246.94, 329.63, 392.0],
          [174.61, 220.0, 261.63, 349.23],
          [164.81, 196.0, 261.63, 329.63],
          [174.61, 220.0, 261.63, 329.63],
          [196.0, 246.94, 293.66, 392.0],
          [220.0, 261.63, 329.63, 392.0],
          [196.0, 246.94, 329.63, 392.0],
          [174.61, 220.0, 261.63, 349.23],
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
      'cinematic-love': {
        bpm: 80,
        notes: [
          [130.81, 164.81, 196.0, 261.63],
          [123.47, 146.83, 196.0, 293.66],
          [110.0, 130.81, 164.81, 220.0],
          [87.31, 130.81, 174.61, 220.0],
          [130.81, 164.81, 196.0, 261.63],
          [123.47, 146.83, 196.0, 246.94],
          [110.0, 130.81, 164.81, 220.0],
          [87.31, 130.81, 174.61, 261.63],
          [146.83, 174.61, 220.0, 293.66],
          [130.81, 164.81, 196.0, 261.63],
          [87.31, 130.81, 174.61, 220.0],
          [98.0, 146.83, 196.0, 246.94],
          [87.31, 130.81, 174.61, 261.63],
          [82.41, 130.81, 164.81, 196.0],
          [98.0, 146.83, 196.0, 246.94],
          [130.81, 164.81, 196.0, 261.63],
        ],
      },
    };

    const seq = sequences[this.currentMelody] || sequences['music-box'];
    const chordDuration = (60 / seq.bpm) * (this.currentMelody === 'cinematic-love' ? 4 : 3);

    const now = this.ctx.currentTime;
    let timeOffset = 0;

    const romanticMelody = this.currentMelody === 'cinematic-love'
      ? [
          392, 440, 523.25, 493.88, 440, 392, 440, 523.25,
          587.33, 659.25, 698.46, 659.25, 587.33, 523.25, 587.33, 783.99,
        ]
      : [
      523.25, 493.88, 440, 392, 440, 523.25, 493.88, 392,
      440, 392, 349.23, 392, 440, 392, 349.23, 392,
        ];

    seq.notes.forEach((chord, chordIdx) => {
      const chordStart = now + timeOffset;
      const isCinematic = this.currentMelody === 'cinematic-love';
      const sectionLevel = chordIdx < 4 ? 0.68 : chordIdx < 8 ? 0.82 : chordIdx < 12 ? 1 : 1.15;
      const intensity = isCinematic ? sectionLevel : 1;

      // Warm sustained bass under each piano chord.
      const bass = this.ctx!.createOscillator();
      const bassEnvelope = this.ctx!.createGain();
      bass.type = 'sine';
      bass.frequency.setValueAtTime(chord[0] / 2, chordStart);
      bassEnvelope.gain.setValueAtTime(0.0001, chordStart);
      bassEnvelope.gain.exponentialRampToValueAtTime(0.045, chordStart + 0.24);
      bassEnvelope.gain.exponentialRampToValueAtTime(0.0001, chordStart + chordDuration);
      bass.connect(bassEnvelope);
      bassEnvelope.connect(this.synthGainNode!);
      bass.start(chordStart);
      bass.stop(chordStart + chordDuration + 0.05);

      // A slow, singing top line gives the accompaniment a romantic theme.
      const lead = this.ctx!.createOscillator();
      const leadEnvelope = this.ctx!.createGain();
      const leadStart = chordStart + 0.28;
      lead.type = 'sine';
      lead.frequency.setValueAtTime(romanticMelody[chordIdx % romanticMelody.length], leadStart);
      leadEnvelope.gain.setValueAtTime(0.0001, leadStart);
      leadEnvelope.gain.exponentialRampToValueAtTime(isCinematic ? 0.075 * intensity : 0.055, leadStart + 0.18);
      leadEnvelope.gain.exponentialRampToValueAtTime(0.0001, leadStart + chordDuration - 0.08);
      if (isCinematic) lead.type = 'triangle';
      lead.connect(leadEnvelope);
      leadEnvelope.connect(this.synthGainNode!);
      lead.start(leadStart);
      lead.stop(chordStart + chordDuration + 0.05);

      if (isCinematic) {
        // Four-beat piano pulse adds the steady motion of a romantic pop ballad.
        const beatDuration = 60 / seq.bpm;
        for (let beat = 0; beat < 4; beat += 1) {
          const pulse = this.ctx!.createOscillator();
          const pulseEnvelope = this.ctx!.createGain();
          const pulseStart = chordStart + beat * beatDuration;
          const pulseNote = beat === 0 ? chord[0] / 2 : chord[(beat + 1) % chord.length];
          pulse.type = beat === 0 ? 'sine' : 'triangle';
          pulse.frequency.setValueAtTime(pulseNote, pulseStart);
          pulseEnvelope.gain.setValueAtTime(0.0001, pulseStart);
          pulseEnvelope.gain.exponentialRampToValueAtTime((beat === 0 ? 0.07 : 0.045) * intensity, pulseStart + 0.025);
          pulseEnvelope.gain.exponentialRampToValueAtTime(0.0001, pulseStart + beatDuration * 0.88);
          pulse.connect(pulseEnvelope);
          pulseEnvelope.connect(this.synthGainNode!);
          pulse.start(pulseStart);
          pulse.stop(pulseStart + beatDuration);
        }

        // Strings bloom after the intro and get fuller in the chorus.
        if (chordIdx >= 4) {
          chord.slice(0, 3).forEach((freq, voiceIdx) => {
            const pad = this.ctx!.createOscillator();
            const padEnvelope = this.ctx!.createGain();
            pad.type = 'triangle';
            pad.frequency.setValueAtTime(freq, chordStart);
            pad.detune.setValueAtTime((voiceIdx - 1) * 5, chordStart);
            padEnvelope.gain.setValueAtTime(0.0001, chordStart);
            const padLevel = chordIdx >= 8 ? 0.032 : 0.018;
            padEnvelope.gain.exponentialRampToValueAtTime(padLevel * intensity, chordStart + 0.48);
            padEnvelope.gain.exponentialRampToValueAtTime(0.0001, chordStart + chordDuration);
            pad.connect(padEnvelope);
            padEnvelope.connect(this.synthGainNode!);
            pad.start(chordStart);
            pad.stop(chordStart + chordDuration + 0.05);
          });
        }

        // Add an octave shimmer from the chorus onward for a lifted finale.
        if (chordIdx >= 8) {
          const shimmer = this.ctx!.createOscillator();
          const shimmerEnvelope = this.ctx!.createGain();
          const shimmerStart = chordStart + 0.34;
          shimmer.type = 'sine';
          shimmer.frequency.setValueAtTime(romanticMelody[chordIdx] * 2, shimmerStart);
          shimmerEnvelope.gain.setValueAtTime(0.0001, shimmerStart);
          shimmerEnvelope.gain.exponentialRampToValueAtTime(0.018 * intensity, shimmerStart + 0.22);
          shimmerEnvelope.gain.exponentialRampToValueAtTime(0.0001, chordStart + chordDuration - 0.08);
          shimmer.connect(shimmerEnvelope);
          shimmerEnvelope.connect(this.synthGainNode!);
          shimmer.start(shimmerStart);
          shimmer.stop(chordStart + chordDuration + 0.05);
        }
      }

      chord.forEach((freq, noteIdx) => {
        if (!this.ctx || !this.synthGainNode) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        // Music box timbre: mix of sine with soft bell sparkle
        osc.type = this.currentMelody === 'soft-piano' ? 'sine' : 'triangle';
        const noteSpacing = isCinematic ? 0.2 : 0.18;
        osc.frequency.setValueAtTime(freq, now + timeOffset + noteIdx * noteSpacing);

        const startTime = now + timeOffset + noteIdx * noteSpacing;
        const decayTime = this.currentMelody === 'soft-piano' ? 2.1 : isCinematic ? 1.55 : 1.8;

        noteGain.gain.setValueAtTime(0.0001, startTime);
        noteGain.gain.exponentialRampToValueAtTime(isCinematic ? 0.105 * intensity : 0.12, startTime + 0.03);
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
    this.stopSynthesizer();
  }

  public resume(track: { id: PresetMelodyId }): Promise<void> {
    return this.playPresetMelody(track.id);
  }
}

export const soundEngine = new SoundEngine();
