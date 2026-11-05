/**
 * Procedural SFX for the "vast onder de kokers" shoe easter-egg.
 * Default timeline: 50s (5 scenes × 10s).
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
 * Full stuck-under-rollers score across `durationSec` (default 50).
 * Returns cleanup.
 */
export function playStuckSoundtrack(durationSec = 50) {
  const ctx = createCtx()
  if (!ctx) return () => {}

  const schedule = () => {
    if (ctx._stuckScheduled) return
    ctx._stuckScheduled = true
    runStuckScore(ctx, durationSec)
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

function runStuckScore(ctx, durationSec) {
  const start = ctx.currentTime + 0.04
  const end = start + durationSec

  // scene 1 — shoe catch thud
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

  // roller grind under whole rescue until free
  let grind = start + 1.2
  while (grind < start + Math.min(42, durationSec - 6)) {
    tone(ctx, {
      freq: 90 + ((grind * 17) % 40),
      endFreq: 60,
      slide: true,
      type: 'sawtooth',
      start: grind,
      dur: 0.22,
      gain: 0.04,
    })
    noiseBurst(ctx, { start: grind + 0.05, dur: 0.12, gain: 0.03, freq: 420 })
    grind += 0.58
  }

  // scene 1–2 alarm sirens
  ;[2.5, 7.5, 11.5, 16.5].forEach((t) => {
    for (let i = 0; i < 5; i += 1) {
      tone(ctx, {
        freq: i % 2 === 0 ? 880 : 620,
        type: 'square',
        start: start + t + i * 0.14,
        dur: 0.12,
        gain: 0.065,
      })
    }
  })

  // scene 2 arrive footsteps blips
  for (let i = 0; i < 8; i += 1) {
    tone(ctx, {
      freq: 180 + (i % 2) * 40,
      type: 'triangle',
      start: start + 10.2 + i * 0.18,
      dur: 0.08,
      gain: 0.05,
    })
  }

  // scene 3 inspect beeps
  for (let i = 0; i < 6; i += 1) {
    tone(ctx, {
      freq: 980 + i * 40,
      type: 'sine',
      start: start + 21 + i * 0.35,
      dur: 0.1,
      gain: 0.05,
    })
  }

  // scene 4 metal clang / struggle + pull
  ;[31, 33.5, 36, 38.5].forEach((t, idx) => {
    tone(ctx, {
      freq: 520 - idx * 40,
      endFreq: 180,
      slide: true,
      type: 'triangle',
      start: start + t,
      dur: 0.22,
      gain: 0.08,
    })
    noiseBurst(ctx, { start: start + t + 0.05, dur: 0.15, gain: 0.07, freq: 900 })
  })

  noiseBurst(ctx, { start: start + 39.2, dur: 0.28, gain: 0.11, freq: 280 })
  tone(ctx, {
    freq: 200,
    endFreq: 70,
    slide: true,
    type: 'sawtooth',
    start: start + 39.25,
    dur: 0.4,
    gain: 0.1,
  })

  // scene 5 free / relief fanfare
  ;[523.25, 659.25, 783.99, 1046.5, 783.99].forEach((freq, i) => {
    tone(ctx, {
      freq,
      type: 'sine',
      start: start + 41.5 + i * 0.14,
      dur: 0.3,
      gain: 0.085,
    })
  })

  // confetti sparkles near end
  for (let i = 0; i < 10; i += 1) {
    const t = start + 44 + i * 0.18
    if (t > end - 0.2) break
    tone(ctx, {
      freq: 1100 + i * 70,
      type: 'square',
      start: t,
      dur: 0.07,
      gain: 0.04,
    })
  }
}
