// Audio synthesis service using Web Audio API (Zero external network dependencies)
class SoundService {
  constructor() {
    this.ctx = null;
    this.ambientNode = null;
    this.ambientGain = null;
    this.currentAmbient = 'none';
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a meditation chime/bell when focus timer completes
  playCompletionChime() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Primary crystalline bell harmonic (528 Hz - Solfeggio frequency)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(528, now);
      osc1.frequency.exponentialRampToValueAtTime(524, now + 3);

      gain1.gain.setValueAtTime(0.4, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);

      // Overtone harmonic (1056 Hz)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1056, now);

      gain2.gain.setValueAtTime(0.18, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 2);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 3.5);
      osc2.stop(now + 2.5);
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }

  // Play a soft tick or click sound
  playTick() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      // Ignore audio tick failure
    }
  }

  // Start continuous ambient soundscapes
  startAmbient(type, volume = 0.3) {
    this.stopAmbient();
    this.init();
    if (!this.ctx || type === 'none') return;
    this.currentAmbient = type;

    try {
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(volume, this.ctx.currentTime);
      this.ambientGain.connect(this.ctx.destination);

      if (type === 'rain') {
        // Synthesize soft rain / pink noise
        const bufferSize = 2 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2) * 0.08;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 850;

        whiteNoise.connect(filter);
        filter.connect(this.ambientGain);
        whiteNoise.start();
        this.ambientNode = whiteNoise;

      } else if (type === 'waves') {
        // Binaural Alpha Wave pulse (140Hz + 150Hz = 10Hz Alpha state)
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.value = 140;
        osc2.type = 'sine';
        osc2.frequency.value = 150;

        const panner1 = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
        const panner2 = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
        if (panner1) panner1.pan.value = -0.8;
        if (panner2) panner2.pan.value = 0.8;

        if (panner1 && panner2) {
          osc1.connect(panner1);
          panner1.connect(this.ambientGain);
          osc2.connect(panner2);
          panner2.connect(this.ambientGain);
        } else {
          osc1.connect(this.ambientGain);
          osc2.connect(this.ambientGain);
        }

        osc1.start();
        osc2.start();
        this.ambientNode = {
          stop: () => {
            try { osc1.stop(); osc2.stop(); } catch(e){}
          }
        };
      }
    } catch (e) {
      console.warn('Ambient sound error:', e);
    }
  }

  setVolume(volume) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(volume, this.ctx.currentTime);
    }
  }

  stopAmbient() {
    if (this.ambientNode) {
      try {
        this.ambientNode.stop();
      } catch (e) {}
      this.ambientNode = null;
    }
    this.currentAmbient = 'none';
  }
}

export const soundService = new SoundService();
export default soundService;
