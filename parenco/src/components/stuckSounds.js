/**
 * Procedural SFX for the "vast onder de kokers" 30s shoe easter-egg.
 */

function createCtx() {
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  return new AC()
}

function tone(ctx, { freq, endFreq, type = 'square', start, dur, gain = 0.05, slide = false }) {
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  if (slide && endFreq) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(endFreq, 1), start + dur)
  }
  g.gain.setValueAtTime(0.0001, start)
  g.gain.exponentialRampToValueAtTime(gain, start + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
  osc.connect(g)
  g.connect(ctx.destination)
  osc.start(start)
  osc.stop(start + dur + 0.02)
}

function noiseBurst(ctx, { start, dur = 0.1, gain = 0.05, freq = 700 }) {
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
  filter.frequency.value = freq
  src.buffer = buffer
  g.gain.setValueAtTime(gain, start)
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
  src.connect(filter)
  filter.connect(g)
  g.connect(ctx.destination)
  src.start(start)
}

/**
 * Full 30s stuck-under-rollers score. Returns cleanup.
 */
export function playStuckSoundtrack() {
  const ctx = createCtx()
  if (!ctx) return () => {}

  const schedule = () => {
    if (ctx._stuckScheduled) return
    ctx._stuckScheduled = true
    runStuckScore(ctx)
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

function runStuckScore(ctx) {
  const start = ctx.currentTime + 0.04

  // shoe catch thud
  noiseBurst(ctx, { start: start + 0.8, dur: 0.16, gain: 0.12, freq: 180 })
  tone(ctx, {
    freq: 140,
    endFreq: 55,
    slide: true,
    type: 'triangle',
    start: start + 0.82,
    dur: 0.28,
    gain: 0.12,
  })

  // roller grind loop
  let grind = start + 1.4
  while (grind < start + 26) {
    tone(ctx, {
      freq: 90 + ((grind * 17) % 40),
      endFreq: 60,
      slide: true,
      type: 'sawtooth',
      start: grind,
      dur: 0.22,
      gain: 0.045,
    })
    noiseBurst(ctx, { start: grind + 0.05, dur: 0.12, gain: 0.035, freq: 420 })
    grind += 0.55
  }

  // alarm siren bursts
  ;[3.2, 8.5, 14.2, 20.5].forEach((t) => {
    for (let i = 0; i < 5; i += 1) {
      tone(ctx, {
        freq: i % 2 === 0 ? 880 : 620,
        type: 'square',
        start: start + t + i * 0.14,
        dur: 0.12,
        gain: 0.07,
      })
    }
  })

  // metal clang / struggle
  ;[5.5, 11.0, 16.8, 22.2].forEach((t, idx) => {
    tone(ctx, {
      freq: 520 - idx * 40,
      endFreq: 180,
      slide: true,
      type: 'triangle',
      start: start + t,
      dur: 0.2,
      gain: 0.08,
    })
    noiseBurst(ctx, { start: start + t + 0.05, dur: 0.15, gain: 0.07, freq: 900 })
  })

  // rescue pull whoosh
  noiseBurst(ctx, { start: start + 25.2, dur: 0.25, gain: 0.1, freq: 300 })
  tone(ctx, {
    freq: 200,
    endFreq: 80,
    slide: true,
    type: 'sawtooth',
    start: start + 25.25,
    dur: 0.35,
    gain: 0.09,
  })

  // free / relief chime
  ;[523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
    tone(ctx, {
      freq,
      type: 'sine',
      start: start + 27.4 + i * 0.12,
      dur: 0.28,
      gain: 0.08,
    })
  })
}
