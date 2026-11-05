import { useEffect, useState } from 'react'
import { playPackmanSoundtrack } from './packmanSounds'

const ANIMATION_MS = 20000

function PackmanFigure({ name, variant }) {
  return (
    <div className={`packman packman--${variant}`} aria-hidden="true">
      <div className="packman-body">
        <div className="packman-eye" />
        <div className="packman-mouth" />
      </div>
      <div className="packman-legs">
        <span />
        <span />
      </div>
      <div className="packman-arm packman-arm--left" />
      <div className="packman-arm packman-arm--right" />
      <span className="packman-name">{name}</span>
    </div>
  )
}

function PackmanMiniGame() {
  const [score, setScore] = useState(0)

  useEffect(() => {
    const startedAt = Date.now()
    const id = window.setInterval(() => {
      const elapsed = Date.now() - startedAt
      const next = Math.min(1800, Math.floor(elapsed / 55) * 10)
      setScore(next)
    }, 220)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="packman-game" aria-hidden="true">
      <div className="packman-game-chrome">
        <span className="packman-game-title">packman</span>
        <span className="packman-game-score">
          papier {String(score).padStart(4, '0')}
        </span>
      </div>
      <div className="packman-maze">
        <div className="packman-maze-walls" />
        <div className="packman-pellets">
          {Array.from({ length: 18 }, (_, i) => (
            <i key={i} className={`packman-pellet packman-pellet--${i}`} />
          ))}
        </div>
        <div className="packman-hero" title="packman">
          <div className="packman-hero-mouth" />
        </div>
        <div className="packman-foe" title="tegenstander">
          <div className="packman-foe-eyes">
            <span />
            <span />
          </div>
          <div className="packman-foe-skirt" />
        </div>
        <div className="packman-paper-bits">
          <i /><i /><i /><i />
        </div>
      </div>
      <p className="packman-game-caption">tegenstander eet papier</p>
    </div>
  )
}

function AndresPakstraatAnimation({ onComplete }) {
  const [phase, setPhase] = useState('playing')

  useEffect(() => {
    let stopSound = () => {}
    let started = false

    const startSound = () => {
      if (started) return
      started = true
      stopSound = playPackmanSoundtrack()
    }

    // try immediately; many browsers need a gesture — retry on first interaction
    startSound()
    const resume = () => {
      startSound()
      window.removeEventListener('pointerdown', resume)
      window.removeEventListener('keydown', resume)
    }
    window.addEventListener('pointerdown', resume)
    window.addEventListener('keydown', resume)

    const doneTimer = window.setTimeout(() => {
      setPhase('outro')
    }, ANIMATION_MS - 900)

    const hideTimer = window.setTimeout(() => {
      onComplete?.()
    }, ANIMATION_MS)

    return () => {
      window.clearTimeout(doneTimer)
      window.clearTimeout(hideTimer)
      window.removeEventListener('pointerdown', resume)
      window.removeEventListener('keydown', resume)
      stopSound()
    }
    // run once on mount for the fixed 20s sequence
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className={`andres-stage ${phase === 'outro' ? 'andres-stage--outro' : ''}`}
      role="dialog"
      aria-label="andre's pakstraat animatie"
      aria-live="polite"
    >
      <div className="andres-sky" aria-hidden="true" />
      <div className="andres-floor" aria-hidden="true" />

      <PackmanMiniGame />

      <div className="andres-title-wrap">
        <p className="andres-eyebrow">smurfit westrock · parenco</p>
        <h1 className="andres-title">andre's pakstraat</h1>
        <p className="andres-subtitle">meten · doorzetten · inpakken</p>
      </div>

      <div className="andres-scene" aria-hidden="true">
        <div className="andres-rail">
          <div className="andres-rail-belt" />
          <div className="andres-rail-legs">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="andres-roll andres-roll--main">
          <div className="andres-roll-body">
            <div className="andres-roll-rings">
              <i /><i /><i /><i />
            </div>
            <div className="andres-roll-core" />
            <div className="andres-wrap-sheet" />
          </div>
          <div className="andres-roll-shadow" />
        </div>

        <div className="andres-pillar andres-pillar--left">
          <div className="andres-pillar-stem" />
          <div className="andres-pillar-head" />
          <div className="andres-measure-beam" />
          <span className="andres-measure-label">breedte</span>
        </div>
        <div className="andres-pillar andres-pillar--right">
          <div className="andres-pillar-stem" />
          <div className="andres-pillar-head" />
        </div>

        <div className="andres-ejector">
          <div className="andres-ejector-arm" />
          <div className="andres-ejector-pad" />
          <span className="andres-station-label">uitstoter</span>
        </div>

        <div className="andres-catcher">
          <div className="andres-catcher-cradle" />
          <div className="andres-catcher-arms">
            <span />
            <span />
          </div>
          <span className="andres-station-label">opvanger</span>
        </div>

        <div className="andres-wrapper">
          <div className="andres-paper-roll">
            <div className="andres-paper-core" />
          </div>
          <div className="andres-paper-feed" />
          <span className="andres-station-label">inpakpapier</span>
        </div>

        <PackmanFigure name="packman" variant="senior" />
        <PackmanFigure name="packman junior" variant="junior" />

        <div className="andres-path-dots">
          <i /><i /><i /><i /><i /><i />
        </div>
      </div>

      <div className="andres-progress" aria-hidden="true">
        <div className="andres-progress-bar" />
      </div>

      <div className="andres-curtain andres-curtain--left" aria-hidden="true">
        <div className="andres-curtain-folds">
          <span /><span /><span /><span /><span /><span />
        </div>
      </div>
      <div className="andres-curtain andres-curtain--right" aria-hidden="true">
        <div className="andres-curtain-folds">
          <span /><span /><span /><span /><span /><span />
        </div>
      </div>

      <div className="andres-curtain-rod" aria-hidden="true" />
    </div>
  )
}

export default AndresPakstraatAnimation
