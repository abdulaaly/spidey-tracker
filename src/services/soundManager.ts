/**
 * Enhanced Sound Engine: Dual Web Audio API synthesis + HTML5 Spider-Man 60s Theme Audio Player.
 * Fully SSR-safe and autoplay-policy compliant.
 */

class SoundManager {
  private audioCtx: AudioContext | null = null;
  private ringtoneAudio: HTMLAudioElement | null = null;
  private enabled: boolean = false;
  private unlocked: boolean = false;

  constructor() {
    // Lazy init on first user interaction
  }

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    return this.audioCtx;
  }

  private initRingtone(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (!this.ringtoneAudio) {
      this.ringtoneAudio = new Audio('/sounds/spider-ringtone.mp3');
      this.ringtoneAudio.preload = 'auto';
      this.ringtoneAudio.loop = true;
    }
    return this.ringtoneAudio;
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (val) {
      this.unlock();
    } else {
      this.stopRingtone();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public unlock() {
    const ctx = this.initCtx();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    this.unlocked = true;
  }

  /**
   * Play the iconic Spider-Man Theme Ringtone
   */
  public async playRingtone() {
    if (!this.enabled) return;
    this.unlock();
    const ringtone = this.initRingtone();
    if (!ringtone) return;
    try {
      ringtone.currentTime = 0;
      ringtone.volume = 0.75;
      await ringtone.play();
    } catch (err) {
      console.warn('Audio play restricted by autoplay policy:', err);
    }
  }

  /**
   * Stop ringtone
   */
  public stopRingtone() {
    if (this.ringtoneAudio) {
      this.ringtoneAudio.pause();
      this.ringtoneAudio.currentTime = 0;
    }
  }

  public isRingtonePlaying(): boolean {
    return Boolean(this.ringtoneAudio && !this.ringtoneAudio.paused);
  }

  public onRingtoneEnded(callback: () => void) {
    if (this.ringtoneAudio) {
      this.ringtoneAudio.onended = callback;
    }
  }

  /**
   * 8-Bit Web Audio Beep
   */
  public playBeep(frequency = 750, duration = 0.08, type: OscillatorType = 'square', gainValue = 0.05) {
    if (!this.enabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(gainValue, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Ignore audio glitches
    }
  }

  /**
   * High-tech Double Chirp Signal
   */
  public playSignal() {
    if (!this.enabled) return;
    this.playBeep(880, 0.06, 'sine', 0.06);
    setTimeout(() => {
      this.playBeep(1200, 0.09, 'sine', 0.07);
    }, 70);
  }

  /**
   * Tactical Radar Ping
   */
  public playRadarPing() {
    if (!this.enabled) return;
    this.playBeep(1400, 0.12, 'sine', 0.04);
  }

  /**
   * Whoosh Transition Sound
   */
  public playWhoosh() {
    if (!this.enabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(250, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {
      // Ignore
    }
  }

  /**
   * Alert Alarm Tone
   */
  public playAlert() {
    if (!this.enabled) return;
    this.playBeep(440, 0.15, 'sawtooth', 0.08);
    setTimeout(() => {
      this.playBeep(440, 0.15, 'sawtooth', 0.08);
    }, 200);
  }

  /**
   * Play by category name for compatibility
   */
  public playCategory(category?: string) {
    if (!this.enabled) return;
    if (category === 'notification' || category === 'events') {
      this.playSignal();
    } else if (category === 'activity') {
      this.playBeep(850, 0.06);
    } else {
      this.playBeep(700, 0.05);
    }
  }

  /**
   * Play jingle / fanfare
   */
  public playJingle() {
    this.playFanfare();
  }

  /**
   * Victory Fanfare
   */
  public playFanfare() {
    if (!this.enabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playBeep(freq, 0.12, 'triangle', 0.08);
      }, idx * 110);
    });
  }
}

export const soundManager = new SoundManager();
