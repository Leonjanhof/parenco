import { useEffect, useState } from 'react'
import { playPackmanSoundtrack } from './packmanSounds'

const ANIMATION_MS = 20000

const STATUS_TICKER = [
  'rol binnen…',
  'breedte meten…',
  'uitstoter klaar!',
  'opvanger locked',
  'papier wikkelen…',
  'kwaliteit ok ✓',
  'klaar voor verzenden!',
]

/** alternating chat: even = packman, odd = packman junior */
const PACKMAN_CHAT = [
  { who: 'senior', text: 'pack pack!' },
  { who: 'junior', text: 'even een plasje plegen' },
  { who: 'senior', text: 'serieus junior?!' },
  { who: 'junior', text: 'oké… pack pack!' },
  { who: 'senior', text: 'meten die handel' },
  { who: 'junior', text: 'ik vang hem wel' },
  { who: 'senior', text: 'papier eromheen!' },
  { who: 'junior', text: 'pack pack pack!' },
  { who: 'senior', text: 'plasje later, eerst wrap' },
  { who: 'junior', text: 'aye aye packman!' },
]

function PackmanFigure({ name, variant, bubble, talking }) {
  return (
    <div className={`packman packman--${variant}`} aria-hidden="true">
      <div className={`packman-bubble ${talking ? 'packman-bubble--talking' : 'packman-bubble--idle'}`}>
        {bubble}
      </div>
      <div className="packman-hat" />
      <div className="packman-body">
        <div className="packman-eye" />
        <div className="packman-blush packman-blush--l" />
        <div className="packman-blush packman-blush--r" />
        <div className="packman-mouth" />
      </div>
      <div className="packman-legs">
        <span />
        <span />
      </div>
      <div className="packman-arm packman-arm--left" />
      <div className="packman-arm packman-arm--right" />
      <div className="packman-tool" />
      <span className="packman-name">{name}</span>
    </div>
  )
}

function PackmanMiniGame() {
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)

  useEffect(() => {
    const startedAt = Date.now()
    const id = window.setInterval(() => {
      const elapsed = Date.now() - startedAt
      setScore(Math.min(9990, Math.floor(elapsed / 40) * 10))
      if (elapsed > 8000 && elapsed < 9000) setLives(2)
      if (elapsed > 14000) setLives(3)
    }, 180)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="packman-game packman-game--deluxe" aria-hidden="true">
      <div className="packman-game-chrome">
        <span className="packman-game-title">packman arcade</span>
        <span className="packman-game-score">
          papier {String(score).padStart(4, '0')}
        </span>
      </div>
      <div className="packman-game-lives">
        {Array.from({ length: lives }, (_, i) => (
          <i key={i} className="packman-life" />
        ))}
        <span className="packman-game-level">lvl 2</span>
      </div>
      <div className="packman-maze">
        <div className="packman-maze-walls" />
        <div className="packman-maze-tunnel" />
        <div className="packman-pellets">
          {Array.from({ length: 24 }, (_, i) => (
            <i key={i} className={`packman-pellet packman-pellet--${i}`} />
          ))}
        </div>
        <div className="packman-power packman-power--a" />
        <div className="packman-power packman-power--b" />
        <div className="packman-fruit" />
        <div className="packman-hero" title="packman">
          <div className="packman-hero-mouth" />
        </div>
        <div className="packman-foe packman-foe--red" title="tegenstander">
          <div className="packman-foe-eyes"><span /><span /></div>
          <div className="packman-foe-skirt" />
        </div>
        <div className="packman-foe packman-foe--cyan" title="tegenstander 2">
          <div className="packman-foe-eyes"><span /><span /></div>
          <div className="packman-foe-skirt" />
        </div>
        <div className="packman-foe packman-foe--pink" title="tegenstander 3">
          <div className="packman-foe-eyes"><span /><span /></div>
          <div className="packman-foe-skirt" />
        </div>
        <div className="packman-paper-bits">
          <i /><i /><i /><i /><i /><i />
        </div>
      </div>
      <p className="packman-game-caption">tegenstanders eten papier · high score!</p>
    </div>
  )
}

function FactoryExtras() {
  return (
    <>
      <div className="fx-ceiling" aria-hidden="true">
        {Array.from({ length: 7 }, (_, i) => (
          <span key={i} className={`fx-lamp fx-lamp--${i}`} />
        ))}
      </div>
      <div className="fx-sparks" aria-hidden="true">
        {Array.from({ length: 16 }, (_, i) => (
          <i key={i} className={`fx-spark fx-spark--${i}`} />
        ))}
      </div>
      <div className="fx-steam" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>
      <div className="fx-confetti" aria-hidden="true">
        {Array.from({ length: 20 }, (_, i) => (
          <i key={i} className={`fx-confetti-bit fx-confetti-bit--${i}`} />
        ))}
      </div>
      <div className="fx-speedlines" aria-hidden="true">
        <span /><span /><span /><span />
      </div>
      <div className="fx-siren" aria-hidden="true" />
      <div className="fx-alert-banner" aria-hidden="true">pakstraat turbo mode</div>
    </>
  )
}

function ControlHud({ status }) {
  return (
    <div className="pak-hud" aria-hidden="true">
      <div className="pak-hud-row">
        <span className="pak-hud-dot" />
        <span>live</span>
        <span className="pak-hud-sep">·</span>
        <span className="pak-hud-status">{status}</span>
      </div>
      <div className="pak-hud-meters">
        <div className="pak-meter">
          <span>rpm</span>
          <b className="pak-meter-fill pak-meter-fill--rpm" />
        </div>
        <div className="pak-meter">
          <span>druk</span>
          <b className="pak-meter-fill pak-meter-fill--druk" />
        </div>
        <div className="pak-meter">
          <span>papier</span>
          <b className="pak-meter-fill pak-meter-fill--papier" />
        </div>
      </div>
      <div className="pak-hud-readout">
        <span>ø</span>
        <strong className="pak-diameter">1255</strong>
        <span>mm</span>
      </div>
    </div>
  )
}

function AndresPakstraatAnimation({ onComplete }) {
  const [phase, setPhase] = useState('playing')
  const [status, setStatus] = useState(STATUS_TICKER[0])
  const [chatIndex, setChatIndex] = useState(0)

  useEffect(() => {
    let stopSound = () => {}
    let started = false

    const startSound = () => {
      if (started) return
      started = true
      stopSound = playPackmanSoundtrack()
    }

    startSound()
    const resume = () => {
      startSound()
      window.removeEventListener('pointerdown', resume)
      window.removeEventListener('keydown', resume)
    }
    window.addEventListener('pointerdown', resume)
    window.addEventListener('keydown', resume)

    const tickers = STATUS_TICKER.map((text, i) =>
      window.setTimeout(() => setStatus(text), 1200 + i * 2500),
    )

    const chatTimer = window.setInterval(() => {
      setChatIndex((i) => (i + 1) % PACKMAN_CHAT.length)
    }, 1800)

    const doneTimer = window.setTimeout(() => setPhase('outro'), ANIMATION_MS - 900)
    const hideTimer = window.setTimeout(() => onComplete?.(), ANIMATION_MS)

    return () => {
      window.clearTimeout(doneTimer)
      window.clearTimeout(hideTimer)
      window.clearInterval(chatTimer)
      tickers.forEach((id) => window.clearTimeout(id))
      window.removeEventListener('pointerdown', resume)
      window.removeEventListener('keydown', resume)
      stopSound()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const chatLine = PACKMAN_CHAT[chatIndex]
  const seniorLine = chatLine.who === 'senior' ? chatLine.text : '…'
  const juniorLine = chatLine.who === 'junior' ? chatLine.text : '…'
  const seniorTalking = chatLine.who === 'senior'
  const juniorTalking = chatLine.who === 'junior'

  return (
    <div
      className={`andres-stage andres-stage--deluxe ${phase === 'outro' ? 'andres-stage--outro' : ''}`}
      role="dialog"
      aria-label="andre's pakstraat animatie"
      aria-live="polite"
    >
      <div className="andres-sky andres-sky--deluxe" aria-hidden="true" />
      <div className="andres-floor andres-floor--deluxe" aria-hidden="true" />
      <FactoryExtras />

      <PackmanMiniGame />
      <ControlHud status={status} />

      <div className="andres-title-wrap">
        <p className="andres-eyebrow">smurfit westrock · parenco</p>
        <h1 className="andres-title andres-title--glitch">andre's pakstraat</h1>
        <p className="andres-subtitle">meten · doorzetten · inpakken · turbo</p>
        <div className="andres-title-badges">
          <span>packman crew</span>
          <span>20s show</span>
          <span>papier power</span>
        </div>
      </div>

      <div className="andres-scene andres-scene--deluxe" aria-hidden="true">
        <div className="pak-crane">
          <div className="pak-crane-rail" />
          <div className="pak-crane-hook" />
        </div>

        <div className="pak-scanner">
          <div className="pak-scanner-beam" />
          <span className="pak-scanner-label">laser scan</span>
        </div>

        <div className="andres-rail andres-rail--deluxe">
          <div className="andres-rail-belt" />
          <div className="andres-rail-glow" />
          <div className="andres-rail-legs">
            <span /><span /><span /><span /><span /><span />
          </div>
        </div>

        <div className="andres-rail andres-rail--upper">
          <div className="andres-rail-belt" />
        </div>

        <div className="andres-roll andres-roll--main">
          <div className="andres-roll-body">
            <div className="andres-roll-rings"><i /><i /><i /><i /><i /></div>
            <div className="andres-roll-core" />
            <div className="andres-wrap-sheet" />
            <div className="andres-roll-sticker">ok</div>
          </div>
          <div className="andres-roll-shadow" />
          <div className="andres-roll-trail" />
        </div>

        <div className="andres-roll andres-roll--queue">
          <div className="andres-roll-body">
            <div className="andres-roll-rings"><i /><i /><i /></div>
            <div className="andres-roll-core" />
          </div>
        </div>

        <div className="andres-roll andres-roll--done">
          <div className="andres-roll-body andres-roll-body--wrapped">
            <div className="andres-roll-core" />
          </div>
        </div>

        <div className="andres-pillar andres-pillar--left">
          <div className="andres-pillar-stem" />
          <div className="andres-pillar-head" />
          <div className="andres-measure-beam" />
          <div className="andres-measure-digits">1185</div>
          <span className="andres-measure-label">breedte</span>
        </div>
        <div className="andres-pillar andres-pillar--right">
          <div className="andres-pillar-stem" />
          <div className="andres-pillar-head" />
          <div className="andres-measure-digits andres-measure-digits--r">ø ok</div>
        </div>

        <div className="andres-ejector">
          <div className="andres-ejector-arm" />
          <div className="andres-ejector-pad" />
          <div className="andres-ejector-shock" />
          <span className="andres-station-label">uitstoter</span>
        </div>

        <div className="andres-catcher">
          <div className="andres-catcher-cradle" />
          <div className="andres-catcher-arms"><span /><span /></div>
          <div className="andres-catcher-pulse" />
          <span className="andres-station-label">opvanger</span>
        </div>

        <div className="pak-stamper">
          <div className="pak-stamper-head" />
          <span className="andres-station-label">stempel</span>
        </div>

        <div className="pak-qc">
          <span className="pak-qc-light pak-qc-light--red" />
          <span className="pak-qc-light pak-qc-light--amber" />
          <span className="pak-qc-light pak-qc-light--green" />
          <span className="andres-station-label">kwaliteit</span>
        </div>

        <div className="andres-wrapper">
          <div className="andres-paper-roll">
            <div className="andres-paper-core" />
          </div>
          <div className="andres-paper-feed" />
          <div className="andres-paper-spiral" />
          <span className="andres-station-label">inpakpapier</span>
        </div>

        <div className="pak-fan">
          <div className="pak-fan-blades" />
        </div>

        <PackmanFigure
          name="packman"
          variant="senior"
          bubble={seniorLine}
          talking={seniorTalking}
        />
        <PackmanFigure
          name="packman junior"
          variant="junior"
          bubble={juniorLine}
          talking={juniorTalking}
        />

        <div className="andres-path-dots">
          <i /><i /><i /><i /><i /><i /><i /><i />
        </div>

        <div className="pak-floating-notes">
          <span>boing</span>
          <span>whirr</span>
          <span>chomp</span>
          <span>wrap!</span>
        </div>
      </div>

      <div className="andres-progress" aria-hidden="true">
        <div className="andres-progress-bar" />
        <div className="andres-progress-glow" />
      </div>

      <div className="andres-curtain andres-curtain--left" aria-hidden="true">
        <div className="andres-curtain-folds">
          <span /><span /><span /><span /><span /><span /><span /><span />
        </div>
        <div className="andres-curtain-sparkle" />
      </div>
      <div className="andres-curtain andres-curtain--right" aria-hidden="true">
        <div className="andres-curtain-folds">
          <span /><span /><span /><span /><span /><span /><span /><span />
        </div>
        <div className="andres-curtain-sparkle" />
      </div>

      <div className="andres-curtain-rod" aria-hidden="true" />
      <div className="andres-curtain-lights" aria-hidden="true">
        <i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
      </div>
    </div>
  )
}

export default AndresPakstraatAnimation
