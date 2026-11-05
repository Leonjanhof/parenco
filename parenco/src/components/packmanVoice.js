/**
 * Loud spoken packman dialogue via Speech Synthesis + attention blast.
 */

function pickDutchVoice(who) {
  const voices = window.speechSynthesis?.getVoices?.() || []
  const nl = voices.filter((v) => /^nl/i.test(v.lang))
  if (!nl.length) return null
  if (who === 'junior') {
    return nl.find((v) => /female|zira|soft|ellen|xander/i.test(v.name)) || nl[nl.length - 1]
  }
  return nl.find((v) => /male|google|xander|robusto/i.test(v.name)) || nl[0]
}

function attentionBlast(who) {
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  const ctx = new AC()
  const start = ctx.currentTime
  const base = who === 'junior' ? 520 : 280

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(base, start)
  osc.frequency.exponentialRampToValueAtTime(base * 1.8, start + 0.08)
  // intentionally loud — user asked for keihard dialogue cues
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(0.85, start + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(start)
  osc.stop(start + 0.2)
  window.setTimeout(() => {
    try {
      ctx.close()
    } catch {
      /* ignore */
    }
  }, 400)
}

/**
 * Shout one packman line at maximum speech volume.
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
    utter.rate = who === 'junior' ? 1.2 : 0.95
    utter.pitch = who === 'junior' ? 1.55 : 0.7
    const voice = pickDutchVoice(who)
    if (voice) utter.voice = voice
    window.speechSynthesis.speak(utter)
  }

  // voices may load async
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
