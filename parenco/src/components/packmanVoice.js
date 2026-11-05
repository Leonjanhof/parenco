/**
 * Loud spoken packman dialogue via Speech Synthesis + attention blast.
 * Always max volume — user asked for full-volume lines.
 */

let sharedAudioCtx = null

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

function attentionBlast(who) {
  const ctx = getAudioCtx()
  if (!ctx) return
  const start = ctx.currentTime
  const base = who === 'junior' ? 560 : 260

  // stacked oscillators = louder presence under speech
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

/**
 * Shout one packman line at absolute max speech volume.
 */
export function shoutPackmanLine(text, who = 'senior') {
  if (typeof window === 'undefined') return

  attentionBlast(who)

  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return

  const speak = () => {
    window.speechSynthesis.cancel()
    const utter = new window.SpeechSynthesisUtterance(text)
    utter.lang = 'nl-NL'
    utter.volume = 1
    utter.rate = who === 'junior' ? 1.15 : 0.92
    utter.pitch = who === 'junior' ? 1.5 : 0.65
    const voice = pickDutchVoice(who)
    if (voice) utter.voice = voice

    window.speechSynthesis.speak(utter)
  }

  if (!(window.speechSynthesis.getVoices() || []).length) {
    window.speechSynthesis.addEventListener('voiceschanged', speak, { once: true })
    window.setTimeout(speak, 120)
  } else {
    speak()
  }
}

export function stopPackmanVoice() {
  try {
    window.speechSynthesis?.cancel()
  } catch {
    /* ignore */
  }
}
