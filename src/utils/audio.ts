/**
 * Web Audio API synthesizer for playful Capybara sound effects
 * and ambient Lo-Fi / Zen study music for deep concentration.
 * Zero external audio files, 100% offline, procedural & relaxing!
 */

class BackgroundMusicEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private padGain: GainNode | null = null;
  private melodyGain: GainNode | null = null;
  private waterGain: GainNode | null = null;
  private timerId: any = null;
  private padOscs: OscillatorNode[] = [];
  private waterSource: AudioBufferSourceNode | null = null;
  public volume: number = 0.5;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public start() {
    if (this.isPlaying) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      this.isPlaying = true;

      // Master music volume
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(Math.max(0.01, this.volume * 0.4), this.ctx.currentTime + 1.5);
      this.masterGain.connect(this.ctx.destination);

      // 1. Ambient Warm Pad Chords
      this.startWarmPad();

      // 2. Gentle River / Onsen Water Flow
      this.startGentleWaterStream();

      // 3. Kalimba / Bell Melodic Sequence (Pentatonic Focus Notes)
      this.startPentatonicMelody();
    } catch {
      this.isPlaying = false;
    }
  }

  public stop() {
    if (!this.isPlaying) return;
    try {
      if (this.ctx && this.masterGain) {
        const now = this.ctx.currentTime;
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      }
      setTimeout(() => {
        this.cleanup();
      }, 850);
    } catch {
      this.cleanup();
    }
    this.isPlaying = false;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.ctx && this.masterGain && this.isPlaying) {
      this.masterGain.gain.setTargetAtTime(this.volume * 0.4, this.ctx.currentTime, 0.1);
    }
  }

  private cleanup() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.padOscs.forEach(osc => {
      try { osc.stop(); osc.disconnect(); } catch {}
    });
    this.padOscs = [];
    if (this.waterSource) {
      try { this.waterSource.stop(); this.waterSource.disconnect(); } catch {}
      this.waterSource = null;
    }
    this.isPlaying = false;
  }

  private startWarmPad() {
    if (!this.ctx || !this.masterGain) return;

    this.padGain = this.ctx.createGain();
    this.padGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    // Warm Low-Pass Filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    // Pentatonic chord: F3 (174.61), C4 (261.63), A4 (440.00), D4 (293.66)
    const freqs = [174.61, 261.63, 293.66];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'sine';
      // Slight detune for cozy warmth
      osc.frequency.setValueAtTime(freq + (idx * 0.4 - 0.2), this.ctx!.currentTime);
      osc.connect(filter);
      osc.start();
      this.padOscs.push(osc);
    });

    filter.connect(this.padGain);
    this.padGain.connect(this.masterGain);
  }

  private startGentleWaterStream() {
    if (!this.ctx || !this.masterGain) return;

    // Create 3 seconds of looping soft pinkish water noise
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.05;
      b1 = 0.96300 * b1 + white * 0.11;
      b2 = 0.57000 * b2 + white * 0.40;
      data[i] = (b0 + b1 + b2) * 0.08;
    }

    this.waterSource = this.ctx.createBufferSource();
    this.waterSource.buffer = buffer;
    this.waterSource.loop = true;

    // Bandpass filter to sound like gentle bubbling spring water
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    this.waterGain = this.ctx.createGain();
    this.waterGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    this.waterSource.connect(filter);
    filter.connect(this.waterGain);
    this.waterGain.connect(this.masterGain);

    this.waterSource.start();
  }

  private startPentatonicMelody() {
    if (!this.ctx || !this.masterGain) return;

    this.melodyGain = this.ctx.createGain();
    this.melodyGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    this.melodyGain.connect(this.masterGain);

    // F Major Pentatonic scale (F4, G4, A4, C5, D5, F5, G5)
    // Very serene, calming, natural Zen garden mood
    const scale = [349.23, 392.00, 440.00, 523.25, 587.33, 698.46, 783.99];

    const playNextNote = () => {
      if (!this.isPlaying || !this.ctx || !this.melodyGain) return;

      const freq = scale[Math.floor(Math.random() * scale.length)];
      const now = this.ctx.currentTime;

      // Soft marimba / chime oscillator
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Sweet bell-like envelope
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.linearRampToValueAtTime(0.18, now + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      osc.connect(noteGain);
      noteGain.connect(this.melodyGain);

      osc.start(now);
      osc.stop(now + 2.25);

      // Schedule next note with calm, unhurried tempo (1.4s to 3.2s intervals)
      const nextDelay = 1400 + Math.random() * 1800;
      this.timerId = setTimeout(playNextNote, nextDelay);
    };

    // First note starts gently after 800ms
    this.timerId = setTimeout(playNextNote, 800);
  }
}

export const bgm = new BackgroundMusicEngine();

class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft bubble pop for clicks
  pop() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  // Happy chime for correct answer
  correct() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = this.ctx!.currentTime + idx * 0.07;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.28);
      });
    } catch {}
  }

  // Gentle low boing on wrong answer
  wrong() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.22);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {}
  }

  // Coin pickup sound
  coin() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(987.77, now); // B5
      osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.35);
    } catch {}
  }

  // Water splash sound for onsen / river hop
  splash() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.25);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
    } catch {}
  }

  // Celebration fanfare on completing a round or getting stars
  fanfare() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const chords = [
        { freq: 523.25, time: 0 },
        { freq: 659.25, time: 0.1 },
        { freq: 783.99, time: 0.2 },
        { freq: 1046.5, time: 0.35 },
      ];
      chords.forEach(c => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = this.ctx!.currentTime + c.time;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(c.freq, startTime);

        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
    } catch {}
  }
}

export const sound = new SoundEffects();
