// Mechanical keyboard sounds synthesised with the Web Audio API: no audio files to load.
// Browsers only start audio after a user gesture, so the context is created lazily and hover
// ticks stay silent until the visitor has clicked or pressed something on the page.

let context: AudioContext | null = null
let master: GainNode | null = null
let noise: AudioBuffer | null = null
let lastHover = 0

function audio(): { ctx: AudioContext; out: GainNode; buffer: AudioBuffer } | null {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return null
  if (!context) {
    context = new AudioContext()
    master = context.createGain()
    master.gain.value = 0.55
    master.connect(context.destination)
    // Half a second of white noise, reused by every click.
    noise = context.createBuffer(1, context.sampleRate / 2, context.sampleRate)
    const data = noise.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  }
  if (context.state === 'suspended') void context.resume()
  if (context.state !== 'running') return null
  return { ctx: context, out: master!, buffer: noise! }
}

const jitter = (value: number, amount: number) => value * (1 + (Math.random() * 2 - 1) * amount)

// A short filtered noise burst: the plastic "clack" of the switch.
function burst(filter: BiquadFilterType, frequency: number, peak: number, decay: number) {
  const a = audio()
  if (!a) return
  const { ctx, out, buffer } = a
  const now = ctx.currentTime
  const source = ctx.createBufferSource()
  source.buffer = buffer
  const band = ctx.createBiquadFilter()
  band.type = filter
  band.frequency.value = jitter(frequency, 0.12)
  band.Q.value = 1.1
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(jitter(peak, 0.15), now + 0.002)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + decay)
  source.connect(band).connect(gain).connect(out)
  source.start(now, Math.random() * 0.4)
  source.stop(now + decay + 0.02)
}

// A falling low tone: the "thock" of the keycap bottoming out on the plate.
function thock(peak: number) {
  const a = audio()
  if (!a) return
  const { ctx, out } = a
  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(jitter(170, 0.08), now)
  osc.frequency.exponentialRampToValueAtTime(70, now + 0.05)
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(peak, now + 0.003)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07)
  osc.connect(gain).connect(out)
  osc.start(now)
  osc.stop(now + 0.09)
}

export const keySound = {
  press() {
    burst('bandpass', 2400, 0.45, 0.04)
    thock(0.35)
  },
  release() {
    burst('bandpass', 3600, 0.22, 0.03)
  },
  hover() {
    const now = performance.now()
    if (now - lastHover < 35) return
    lastHover = now
    burst('highpass', 4500, 0.08, 0.018)
  },
}
