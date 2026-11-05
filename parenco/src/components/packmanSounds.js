/**
 * Original packman-style SFX via Web Audio API.
 * Procedural tones only — no copyrighted game samples.
 * Timeline: 30s (under loud spoken packman dialogue).
 */

function createCtx() {
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  return new AC()
}

function tone(ctx, { freq, endFreq, type = 'square', start, dur, gain = 0.04, slide = false }) {
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  if (slide && endFreq) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(endFreq, 1), start + dur)
  }
  g.gain.setValueAtTime(0.0001, start)
  g.gain.exponentialRampToValueAtTime(gain, start + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
  osc.connect(g)
  g.connect(ctx.destination)
  osc.start(start)
  osc.stop(start + dur + 0.02)
}

function noiseBurst(ctx, { start, dur = 0.08, gain = 0.03 }) {
  const frames = Math.floor(ctx.sampleRate * dur)
  const buffer = ctx.createBuffer(1, frames, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < frames; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / frames)
  }
  const src = ctx.createBufferSource()
  const g = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 900
  src.buffer = buffer
  g.gain.setValueAtTime(gain, start)
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
  src.connect(filter)
  filter.connect(g)
  g.connect(ctx.destination)
  src.start(start)
}

/**
 * Schedule the full 30s packman soundtrack for andre's pakstraat.
 * Returns a cleanup that stops the context.
 */
export function playPackmanSoundtrack() {
  const ctx = createCtx()
  if (!ctx) return () => {}

  const schedule = () => {
    runScore(ctx)
  }

  if (ctx.state === 'suspended') {
    ctx.resume().then(schedule).catch(() => {})
  } else {
    schedule()
  }

  return () => {
    try {
      ctx.close()
    } catch {
      /* ignore */
    }
  }
}

function runScore(ctx) {
  if (ctx._packmanScheduled) return
  ctx._packmanScheduled = true

  const start = ctx.currentTime + 0.05

  // curtain / intro jingle
  const intro = [523.25, 659.25, 783.99, 1046.5]
  intro.forEach((freq, i) => {
    tone(ctx, {
      freq,
      type: 'square',
      start: start + 0.15 + i * 0.12,
      dur: 0.14,
      gain: 0.08,
    })
  })
  tone(ctx, {
    freq: 392,
    endFreq: 784,
    slide: true,
    type: 'square',
    start: start + 0.7,
    dur: 0.35,
    gain: 0.09,
  })

  // chomp loop under dialogue (~2.5s → 26s) — very quiet under slow speech
  let chompT = start + 2.4
  let flip = false
  while (chompT < start + 26) {
    tone(ctx, {
      freq: flip ? 180 : 320,
      endFreq: flip ? 90 : 160,
      slide: true,
      type: 'sawtooth',
      start: chompT,
      dur: 0.11,
      gain: 0.018,
    })
    flip = !flip
    chompT += 0.28
  }

  // measure beep
  for (let i = 0; i < 4; i += 1) {
    tone(ctx, {
      freq: 1400,
      type: 'sine',
      start: start + 7.5 + i * 0.28,
      dur: 0.08,
      gain: 0.06,
    })
  }

  // eject / push whoosh
  noiseBurst(ctx, { start: start + 12.2, dur: 0.14, gain: 0.08 })
  tone(ctx, {
    freq: 220,
    endFreq: 90,
    slide: true,
    type: 'triangle',
    start: start + 12.25,
    dur: 0.22,
    gain: 0.07,
  })

  // catch blip
  tone(ctx, {
    freq: 660,
    endFreq: 990,
    slide: true,
    type: 'square',
    start: start + 15.5,
    dur: 0.18,
    gain: 0.07,
  })

  // wrap paper rustle
  for (let i = 0; i < 6; i += 1) {
    noiseBurst(ctx, { start: start + 19.5 + i * 0.35, dur: 0.1, gain: 0.04 })
    tone(ctx, {
      freq: 440 + i * 60,
      type: 'triangle',
      start: start + 19.55 + i * 0.35,
      dur: 0.12,
      gain: 0.05,
    })
  }

  // opponent eat cue
  let eatT = start + 3.0
  while (eatT < start + 27) {
    tone(ctx, {
      freq: 520,
      endFreq: 260,
      slide: true,
      type: 'square',
      start: eatT,
      dur: 0.09,
      gain: 0.03,
    })
    eatT += 1.35
  }

  // siren / alert warble
  for (let i = 0; i < 6; i += 1) {
    tone(ctx, {
      freq: i % 2 === 0 ? 880 : 660,
      type: 'square',
      start: start + 4.2 + i * 0.16,
      dur: 0.12,
      gain: 0.05,
    })
  }

  // stamp hit
  noiseBurst(ctx, { start: start + 22.5, dur: 0.06, gain: 0.08 })
  tone(ctx, {
    freq: 180,
    endFreq: 60,
    slide: true,
    type: 'triangle',
    start: start + 22.52,
    dur: 0.18,
    gain: 0.07,
  })

  // quality OK chime
  ;[523.25, 659.25, 783.99].forEach((freq, i) => {
    tone(ctx, {
      freq,
      type: 'sine',
      start: start + 24.2 + i * 0.09,
      dur: 0.2,
      gain: 0.06,
    })
  })

  // confetti sparkles
  for (let i = 0; i < 8; i += 1) {
    tone(ctx, {
      freq: 1200 + i * 90,
      type: 'square',
      start: start + 26.2 + i * 0.08,
      dur: 0.06,
      gain: 0.04,
    })
  }

  // outro fanfare
  ;[784, 659, 523, 392, 523].forEach((freq, i) => {
    tone(ctx, {
      freq,
      type: 'square',
      start: start + 27.8 + i * 0.12,
      dur: 0.16,
      gain: 0.08,
    })
  })
}
