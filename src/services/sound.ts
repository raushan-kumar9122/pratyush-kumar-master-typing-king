/**
 * Procedural Web Audio API sound synthesizer for PRATYUSH KUMAR MASTER PRO
 * Zero dependencies, works 100% offline, latency-free typing acoustics.
 */

import { SoundTheme } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.5;
  private theme: SoundTheme = 'mechanical';

  constructor() {
    // Initialized on first user interaction to satisfy browser autoplay policies
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public setTheme(theme: SoundTheme) {
    this.theme = theme;
  }

  public playKeypress(isSpecial: boolean = false) {
    if (this.isMuted || this.volume === 0) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const gain = this.ctx.createGain();
    gain.connect(this.ctx.destination);

    if (this.theme === 'mechanical') {
      // Crisp mechanical click (simulated Cherry MX Blue switch)
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(isSpecial ? 1600 : 2400 + Math.random() * 400, t);
      filter.Q.setValueAtTime(3.5, t);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isSpecial ? 220 : 380 + Math.random() * 80, t);
      osc.frequency.exponentialRampToValueAtTime(110, t + 0.04);

      gain.gain.setValueAtTime(this.volume * 0.45, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

      osc.connect(filter);
      filter.connect(gain);
      osc.start(t);
      osc.stop(t + 0.05);

      // Add miniature secondary pop
      const popOsc = this.ctx.createOscillator();
      const popGain = this.ctx.createGain();
      popGain.connect(this.ctx.destination);
      popOsc.type = 'sine';
      popOsc.frequency.setValueAtTime(450, t + 0.012);
      popGain.gain.setValueAtTime(this.volume * 0.15, t + 0.012);
      popGain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
      popOsc.connect(popGain);
      popOsc.start(t + 0.012);
      popOsc.stop(t + 0.04);
    } else if (this.theme === 'typewriter') {
      // Deep mechanical typewriter striker and chassis reverberation
      const osc = this.ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(isSpecial ? 180 : 320, t);
      osc.frequency.exponentialRampToValueAtTime(60, t + 0.06);

      gain.gain.setValueAtTime(this.volume * 0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(gain);
      osc.start(t);
      osc.stop(t + 0.065);
    } else if (this.theme === 'soft') {
      // Gentle laptop bubble key
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isSpecial ? 260 : 420 + Math.random() * 50, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.035);

      gain.gain.setValueAtTime(this.volume * 0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      osc.connect(gain);
      osc.start(t);
      osc.stop(t + 0.045);
    } else {
      // Modern sci-fi UI blip
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isSpecial ? 650 : 880 + Math.random() * 60, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.03);

      gain.gain.setValueAtTime(this.volume * 0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

      osc.connect(gain);
      osc.start(t);
      osc.stop(t + 0.035);
    }
  }

  public playError() {
    if (this.isMuted || this.volume === 0) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.setValueAtTime(110, t + 0.05);

    gain.gain.setValueAtTime(this.volume * 0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.13);
  }

  public playSuccess() {
    if (this.isMuted || this.volume === 0) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = t + idx * 0.07;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(this.volume * 0.35, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.2);
    });
  }

  public playFanfare() {
    if (this.isMuted || this.volume === 0) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const melody = [
      { f: 440.0, d: 0.1 },  // A4
      { f: 554.37, d: 0.1 }, // C#5
      { f: 659.25, d: 0.1 }, // E5
      { f: 880.0, d: 0.35 }  // A5
    ];

    let current = t;
    melody.forEach((item) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(item.f, current);

      gain.gain.setValueAtTime(this.volume * 0.4, current);
      gain.gain.exponentialRampToValueAtTime(0.001, current + item.d + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(current);
      osc.stop(current + item.d + 0.08);

      current += item.d;
    });
  }

  public playLaser() {
    if (this.isMuted || this.volume === 0) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.15);

    gain.gain.setValueAtTime(this.volume * 0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.16);
  }

  public playExplosion() {
    if (this.isMuted || this.volume === 0) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.3);

    gain.gain.setValueAtTime(this.volume * 0.45, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.31);
  }
}

export const soundService = new SoundEngine();
