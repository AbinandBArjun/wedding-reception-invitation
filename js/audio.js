/**
 * Romantic Wedding Audio Engine
 * Uses Web Audio API procedural gentle romantic piano arpeggio synthesis
 * with smooth reverb and envelope shaping, ensuring immediate, reliable,
 * and elegant background music on any device without external audio loading failures.
 */

class RomanticAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.timer = null;
    this.noteIndex = 0;
    this.masterGain = null;
    this.reverbNode = null;

    // Romantic piano chord progression & melody notes (frequencies in Hz)
    // D Major / B Minor / G Major / A Major progression
    this.sequence = [
      // Dmaj9
      { chord: [146.83, 220.00, 277.18, 369.99], melody: [587.33, 739.99, 880.00, 739.99] },
      // F#m7
      { chord: [185.00, 220.00, 277.18, 369.99], melody: [554.37, 739.99, 830.61, 739.99] },
      // Gmaj7
      { chord: [196.00, 246.94, 293.66, 369.99], melody: [587.33, 739.99, 880.00, 987.77] },
      // Asus4 -> A
      { chord: [220.00, 293.66, 329.63, 440.00], melody: [659.25, 739.99, 587.33, 440.00] },
      // Bm7
      { chord: [123.47, 185.00, 220.00, 293.66], melody: [587.33, 739.99, 880.00, 739.99] },
      // Em7
      { chord: [164.81, 246.94, 293.66, 369.99], melody: [493.88, 587.33, 739.99, 659.25] },
      // Gmaj7
      { chord: [196.00, 246.94, 293.66, 369.99], melody: [587.33, 739.99, 880.00, 739.99] },
      // A7sus4 -> A
      { chord: [220.00, 277.18, 329.63, 440.00], melody: [554.37, 587.33, 739.99, 880.00] }
    ];
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Create simple impulse reverb for romantic warmth
    this.createConvolver();
  }

  createConvolver() {
    if (!this.ctx) return;
    const rate = this.ctx.sampleRate;
    const length = rate * 2.2;
    const decay = 2.0;
    const impulse = this.ctx.createBuffer(2, length, rate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = (1 - i / length) ** decay;
      left[i] = (Math.random() * 2 - 1) * n;
      right[i] = (Math.random() * 2 - 1) * n;
    }

    this.reverbNode = this.ctx.createConvolver();
    this.reverbNode.buffer = impulse;

    const reverbGain = this.ctx.createGain();
    reverbGain.gain.value = 0.35;

    this.reverbNode.connect(reverbGain);
    reverbGain.connect(this.masterGain);
  }

  playPianoNote(freq, time, duration = 2.2, gainLevel = 0.28) {
    if (!this.ctx || this.isMuted) return;

    // Harmonic synthesis: fundamental + subtle warm overtones
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, time);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 2, time);
    const osc2Gain = this.ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.15, time);
    osc2.connect(osc2Gain);
    osc2Gain.connect(filter);

    // Lowpass filter for smooth romantic felt piano tone
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1400, time);
    filter.frequency.exponentialRampToValueAtTime(350, time + duration);

    // Piano amplitude envelope: quick attack, natural exponential decay
    noteGain.gain.setValueAtTime(0.0001, time);
    noteGain.gain.linearRampToValueAtTime(gainLevel, time + 0.025);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);
    if (this.reverbNode) {
      noteGain.connect(this.reverbNode);
    }

    osc.start(time);
    osc2.start(time);
    osc.stop(time + duration);
    osc2.stop(time + duration);
  }

  step() {
    if (!this.isPlaying || !this.ctx) return;

    const now = this.ctx.currentTime;
    const bar = this.sequence[this.noteIndex % this.sequence.length];

    // Play bass and chord arpeggio
    bar.chord.forEach((freq, idx) => {
      this.playPianoNote(freq, now + idx * 0.42, 2.5, idx === 0 ? 0.22 : 0.14);
    });

    // Play singing melody notes
    bar.melody.forEach((freq, idx) => {
      this.playPianoNote(freq, now + 0.35 + idx * 0.52, 2.0, 0.24);
    });

    this.noteIndex++;
    this.timer = setTimeout(() => this.step(), 2200);
  }

  play() {
    this.init();
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    this.isPlaying = true;
    this.isMuted = false;

    // Fade in
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0.35, this.ctx.currentTime + 1.2);

    this.step();
    this.updateUI();
  }

  pause() {
    this.isPlaying = false;
    clearTimeout(this.timer);
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
    }
    this.updateUI();
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  updateUI() {
    const btn = document.getElementById("music-toggle-btn");
    const waves = document.getElementById("music-waves");
    const statusText = document.getElementById("music-status");
    if (!btn) return;

    if (this.isPlaying) {
      btn.classList.add("playing");
      btn.setAttribute("aria-label", "Pause romantic background music");
      if (statusText) statusText.textContent = "Music Playing";
      if (waves) waves.classList.remove("paused");
    } else {
      btn.classList.remove("playing");
      btn.setAttribute("aria-label", "Play romantic background music");
      if (statusText) statusText.textContent = "Play Music";
      if (waves) waves.classList.add("paused");
    }
  }
}

window.romanticAudio = new RomanticAudioEngine();
