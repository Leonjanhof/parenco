/**
 * Loud spoken packman dialogue — one speaker at a time.
 * shoutPackmanLine returns a Promise that resolves when speech ends.
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

function attentionBlast(who) {
  const ctx = getAudioCtx()
  if (!ctx) return
  const start = ctx.currentTime
  const base = who === 'junior' ? 560 : 260

  ;[1, 1.5, 2].forEach((mult, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = i === 0 ? 'sawtooth' : 'square'
    osc.frequency.setValueAtTime(base * mult, start)
    osc.frequency.exponentialRampToValueAtTime(base * mult * 1.6, start + 0.1)
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(0.9 / (i + 1), start + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(start)
    osc.stop(start + 0.24)
  })
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

/**
 * Speak one line at max volume. Resolves when finished (or after fallback timeout).
 * Cancels any previous utterance so lines never overlap.
 */
export function shoutPackmanLine(text, who = 'senior') {
  const myToken = ++speakToken

  if (typeof window === 'undefined') {
    return Promise.resolve()
  }

  attentionBlast(who)

  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
    return new Promise((r) => window.setTimeout(r, 900))
  }

  window.speechSynthesis.cancel()

  return waitForVoices().then(
    () =>
      new Promise((resolve) => {
        if (myToken !== speakToken) {
          resolve()
          return
        }

        window.speechSynthesis.cancel()
        const utter = new window.SpeechSynthesisUtterance(text)
        utter.lang = 'nl-NL'
        utter.volume = 1
        utter.rate = who === 'junior' ? 1.1 : 0.9
        utter.pitch = who === 'junior' ? 1.45 : 0.65
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
        // safety if onend never fires
        window.setTimeout(finish, Math.min(5000, 800 + text.length * 80))

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
