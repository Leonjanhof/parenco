import { useEffect, useState } from 'react'

const ANIMATION_MS = 20000

function AndresPakstraatAnimation({ onComplete }) {
  const [phase, setPhase] = useState('playing')

  useEffect(() => {
    const doneTimer = window.setTimeout(() => {
      setPhase('outro')
    }, ANIMATION_MS - 900)

    const hideTimer = window.setTimeout(() => {
      onComplete?.()
    }, ANIMATION_MS)

    return () => {
      window.clearTimeout(doneTimer)
      window.clearTimeout(hideTimer)
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
