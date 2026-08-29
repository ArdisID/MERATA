/**
 * Web Audio API Synthesizer for zero-dependency game sound effects
 */

class SoundSynthesizer {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1) {
    try {
      this.init();
      if (!this.ctx) return;

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio not permitted or supported silently
    }
  }

  // Card Flip Sound
  playCardFlip() {
    this.playTone(320, 'triangle', 0.08, 0.08);
  }

  // Match Success Sound (Happy Chime)
  playMatchSuccess() {
    this.playTone(523.25, 'sine', 0.12, 0.12); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.12, 0.12), 90); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.25, 0.15), 180); // G5
  }

  // Match Fail (Mismatch)
  playMismatch() {
    this.playTone(220, 'sawtooth', 0.12, 0.05); // A3
    setTimeout(() => this.playTone(180, 'sawtooth', 0.18, 0.05), 100);
  }

  // Game Victory Fanfare
  playVictory() {
    const notes = [
      { f: 523.25, t: 0 },
      { f: 659.25, t: 100 },
      { f: 783.99, t: 200 },
      { f: 1046.50, t: 350 },
    ];
    notes.forEach((n) => {
      setTimeout(() => this.playTone(n.f, 'triangle', 0.35, 0.18), n.t);
    });
  }

  // Button Click / Action
  playClick() {
    this.playTone(440, 'sine', 0.05, 0.05);
  }
}

export const sound = new SoundSynthesizer();
