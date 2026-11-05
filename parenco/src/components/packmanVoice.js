/**
 * Loud spoken packman dialogue — one speaker at a time.
 * shoutPackmanLine returns a Promise that resolves when speech ends.
 * Rates stay slow so bubbles stay readable and each speaker is clear.
 */

let sharedAudioCtx = null
let speakToken = 0

function getAudioCtx() {
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    sharedAudioCtx = new AC()
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {})
  }
  return sharedAudioCtx
}

function pickDutchVoice(who) {
  const voices = window.speechSynthesis?.getVoices?.() || []
  const nl = voices.filter((v) => /^nl/i.test(v.lang))
  if (!nl.length) return null
  if (who === 'junior') {
    return nl.find((v) => /female|zira|soft|ellen/i.test(v.name)) || nl[nl.length - 1]
  }
  if (who === 'operator') {
    return nl.find((v) => /male|google|xander|robusto/i.test(v.name)) || nl[Math.min(1, nl.length - 1)]
  }
  return nl.find((v) => /male|google|xander|robusto/i.test(v.name)) || nl[0]
}

function waitForVoices() {
  return new Promise((resolve) => {
    const existing = window.speechSynthesis?.getVoices?.() || []
    if (existing.length) {
      resolve(existing)
      return
    }
    const done = () => {
      window.speechSynthesis?.removeEventListener('voiceschanged', done)
      resolve(window.speechSynthesis?.getVoices?.() || [])
    }
    window.speechSynthesis?.addEventListener('voiceschanged', done)
    window.setTimeout(done, 400)
  })
}

/** Short cue so speech start stays audible — not a long blast over the line. */
function attentionBlast(who) {
  const ctx = getAudioCtx()
  if (!ctx) return
  const start = ctx.currentTime
  const base = who === 'junior' ? 520 : who === 'operator' ? 340 : 240

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'square'
  osc.frequency.setValueAtTime(base, start)
  osc.frequency.exponentialRampToValueAtTime(base * 1.35, start + 0.06)
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(0.35, start + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.09)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(start)
  osc.stop(start + 0.1)
}

/** Huge throw / impact SFX when junior gets yeeted */
export function playYeetBoom() {
  const ctx = getAudioCtx()
  if (!ctx) return
  const start = ctx.currentTime

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(120, start)
  osc.frequency.exponentialRampToValueAtTime(40, start + 0.45)
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(0.95, start + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(start)
  osc.stop(start + 0.55)

  const frames = Math.floor(ctx.sampleRate * 0.35)
  const buffer = ctx.createBuffer(1, frames, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < frames; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / frames)
  }
  const src = ctx.createBufferSource()
  const ng = ctx.createGain()
  src.buffer = buffer
  ng.gain.setValueAtTime(0.7, start)
  ng.gain.exponentialRampToValueAtTime(0.0001, start + 0.35)
  src.connect(ng)
  ng.connect(ctx.destination)
  src.start(start)
}

const SPEECH_RATE = {
  senior: 0.62,
  junior: 0.72,
  operator: 0.68,
}

const SPEECH_PITCH = {
  senior: 0.55,
  junior: 1.55,
  operator: 0.95,
}

/** Slow spoken line with clear speaker identity. Resolves when finished. */
export function shoutPackmanLine(text, who = 'senior') {
  const myToken = ++speakToken

  if (typeof window === 'undefined') {
    return Promise.resolve()
  }

  attentionBlast(who)

  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
    const rate = SPEECH_RATE[who] || 0.65
    const fallbackMs = Math.min(14000, 2200 + text.length * (120 / rate))
    return new Promise((r) => window.setTimeout(r, fallbackMs))
  }

  window.speechSynthesis.cancel()

  // light pauses so Dutch TTS stays intelligible
  const spoken = String(text)
    .replace(/([,.!?])/g, '$1 ')
    .replace(/\s+/g, ' ')
    .trim()

  return waitForVoices().then(
    () =>
      new Promise((resolve) => {
        if (myToken !== speakToken) {
          resolve()
          return
        }

        window.speechSynthesis.cancel()
        const utter = new window.SpeechSynthesisUtterance(spoken)
        utter.lang = 'nl-NL'
        utter.volume = 1
        const rate = SPEECH_RATE[who] || 0.65
        utter.rate = rate
        utter.pitch = SPEECH_PITCH[who] ?? 1
        const voice = pickDutchVoice(who)
        if (voice) utter.voice = voice

        let settled = false
        const finish = () => {
          if (settled) return
          settled = true
          resolve()
        }

        utter.onend = finish
        utter.onerror = finish
        // slow speech needs a long safety window — do not cut lines short
        const safetyMs = Math.min(16000, Math.max(4000, 2200 + spoken.length * (145 / rate)))
        window.setTimeout(finish, safetyMs)

        try {
          window.speechSynthesis.speak(utter)
        } catch {
          finish()
        }
      }),
  )
}

export function stopPackmanVoice() {
  speakToken += 1
  try {
    window.speechSynthesis?.cancel()
  } catch {
    /* ignore */
  }
}
