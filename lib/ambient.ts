/**
 * A small, dependency-free forest ambience generated with the Web Audio API.
 * It is only created after an explicit user action and never autoplays.
 */
export type AmbientHandle = {
  setLevel: (level: number) => void;
  close: () => void;
};

export function createAmbient(): AmbientHandle | null {
  if (typeof window === "undefined") return null;
  const AudioCtor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;

  let context: AudioContext;
  try {
    context = new AudioCtor();
  } catch {
    return null;
  }

  const seconds = 4;
  const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i += 1) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 2.6;
  }

  const source = context.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 820;
  filter.Q.value = 0.4;

  const highpass = context.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 120;

  const gain = context.createGain();
  gain.gain.value = 0;

  source.connect(filter);
  filter.connect(highpass);
  highpass.connect(gain);
  gain.connect(context.destination);
  source.start();

  // Occasional soft bird call, so the loop does not feel like static.
  const chirpTimer = window.setInterval(() => {
    if (context.state !== "running") return;
    const oscillator = context.createOscillator();
    const chirpGain = context.createGain();
    oscillator.type = "sine";
    const base = 1600 + Math.random() * 900;
    oscillator.frequency.setValueAtTime(base, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(base * 1.35, context.currentTime + 0.08);
    oscillator.frequency.exponentialRampToValueAtTime(base * 0.9, context.currentTime + 0.22);
    chirpGain.gain.setValueAtTime(0, context.currentTime);
    chirpGain.gain.linearRampToValueAtTime(0.012, context.currentTime + 0.03);
    chirpGain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.32);
    oscillator.connect(chirpGain);
    chirpGain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.34);
  }, 9000);

  return {
    setLevel(level: number) {
      if (context.state === "suspended") void context.resume();
      gain.gain.cancelScheduledValues(context.currentTime);
      gain.gain.linearRampToValueAtTime(Math.max(0, Math.min(0.22, level)), context.currentTime + 0.9);
    },
    close() {
      window.clearInterval(chirpTimer);
      try {
        source.stop();
      } catch {
        // already stopped
      }
      void context.close();
    },
  };
}
