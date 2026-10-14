/**
 * Theater Sound Engine using Web Audio API
 * Provides immersive theatrical ambient soundscapes & traditional stage knocks
 */

class TheaterSoundEngine {
  private ctx: AudioContext | null = null;
  private rainNode: AudioNode | null = null;
  private isRainPlaying = false;
  private clockInterval: number | null = null;
  private isClockPlaying = false;

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Traditional French / Classical Theater "Trois Coups" (الضربات المسرحية الثلاث)
   * Three resonant wooden thuds on the stage floor signaling the curtain rises.
   */
  public playTroisCoups(onComplete?: () => void) {
    const ctx = this.getAudioContext();
    const now = ctx.currentTime;

    const playKnock = (time: number, freq: number, gainVal: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, time);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(35, time + 0.18);

      gain.gain.setValueAtTime(gainVal, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.38);
    };

    // Knock 1, Knock 2, Knock 3 spaced by ~0.8s
    playKnock(now + 0.1, 110, 0.9);
    playKnock(now + 0.9, 105, 0.95);
    playKnock(now + 1.7, 95, 1.0);

    if (onComplete) {
      setTimeout(onComplete, 2200);
    }
  }

  /**
   * Stage Spotlight Chime / Dramatic Cue
   */
  public playDramaticChime() {
    const ctx = this.getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.4); // E5

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.8);
  }

  /**
   * Distant Train Whistle
   */
  public playTrainWhistle() {
    const ctx = this.getAudioContext();
    const now = ctx.currentTime;

    // Dual-tone whistle chord
    [466.16, 587.33].forEach((f) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(f, now);
      filter.Q.setValueAtTime(4, now);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, now);
      osc.frequency.linearRampToValueAtTime(f * 1.02, now + 1.2);
      osc.frequency.linearRampToValueAtTime(f * 0.98, now + 2.5);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.6);
      gain.gain.linearRampToValueAtTime(0.001, now + 2.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.9);
    });
  }

  /**
   * Ambient Rain & Wind Loop Generator
   */
  public toggleRainWind(enabled: boolean): boolean {
    const ctx = this.getAudioContext();

    if (!enabled || this.isRainPlaying) {
      if (this.rainNode) {
        try {
          (this.rainNode as unknown as { stop?: () => void }).stop?.();
          this.rainNode.disconnect();
        } catch {
          // ignore
        }
        this.rainNode = null;
      }
      this.isRainPlaying = false;
      return false;
    }

    // Generate Pink/Brownish Noise for Rain
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 1.8;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    whiteNoise.start();
    this.rainNode = whiteNoise;
    this.isRainPlaying = true;
    return true;
  }

  /**
   * Antique Clock Ticking
   */
  public toggleClock(enabled: boolean): boolean {
    if (!enabled || this.isClockPlaying) {
      if (this.clockInterval) {
        window.clearInterval(this.clockInterval);
        this.clockInterval = null;
      }
      this.isClockPlaying = false;
      return false;
    }

    const ctx = this.getAudioContext();

    const tick = (high: boolean) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(high ? 1100 : 850, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    };

    let step = false;
    tick(step);
    this.clockInterval = window.setInterval(() => {
      step = !step;
      tick(step);
    }, 1000);

    this.isClockPlaying = true;
    return true;
  }

  public getRainStatus(): boolean {
    return this.isRainPlaying;
  }

  public getClockStatus(): boolean {
    return this.isClockPlaying;
  }
}

export const soundEngine = new TheaterSoundEngine();
