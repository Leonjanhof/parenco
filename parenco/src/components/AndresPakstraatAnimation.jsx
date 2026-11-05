import { useEffect, useRef, useState } from 'react'
import { playPackmanSoundtrack } from './packmanSounds'
import { playYeetBoom, shoutPackmanLine, stopPackmanVoice } from './packmanVoice'

const ANIMATION_MS = 30000
const CHAT_GAP_MS = 450

const STATUS_TICKER = [
  'rol binnen…',
  'breedte meten…',
  'uitstoter klaar!',
  'opvanger locked',
  'papier wikkelen…',
  'kwaliteit ok ✓',
  'pack pack mode',
  'robot alert!',
  'klaar voor verzenden!',
]

const PACKMAN_LINES = [
  'plasje plegen',
  'weer een dag geen rust',
  'nog steeds geen koffie gehad',
  'pack pack!',
  'mijn rug kraakt al',
  'wanneer is pauze?',
  'die rol is te dik',
  'uitstoter doet raar',
  'ik heb honger',
  'weer overtime vandaag',
  'junior, schiet op!',
  'papier is op!',
  'meten meten meten',
  'waarom zo vroeg?',
  'koffie koffie koffie',
  'even zitten mag niet',
  'packstraat never sleeps',
  'nog één rol… beloofd',
]

const JUNIOR_REACTIONS = [
  'haha classic packman',
  'ik voel je bro',
  'eerst packen dan plasje',
  'koffie komt zo!',
  'pack pack junior ready',
  'ik vang hem wel',
  'rust later, wrap nu',
  'aye aye packman!',
  'zelfde hier eerlijk',
  'blijf sterk!',
  'ik ren al!',
  'papier erbij!',
  'pauze? droom door',
  'wij regelen dit',
  'nog even doorbijten',
  'pack pack pack!',
  'jij bent de boss',
  'ik luister, ik doe',
]

function pickRandom(list, avoid) {
  if (list.length === 1) return list[0]
  let next = list[Math.floor(Math.random() * list.length)]
  let guard = 0
  while (next === avoid && guard < 8) {
    next = list[Math.floor(Math.random() * list.length)]
    guard += 1
  }
  return next
}

function nextChatLine(prev) {
  if (!prev || prev.who === 'junior') {
    return { who: 'senior', text: pickRandom(PACKMAN_LINES, prev?.text) }
  }
  return { who: 'junior', text: pickRandom(JUNIOR_REACTIONS, prev?.text) }
}

function waitForPageReady() {
  return new Promise((resolve) => {
    const finish = () => {
      const fonts = document.fonts?.ready
      if (fonts) {
        fonts.then(() => resolve()).catch(() => resolve())
      } else {
        resolve()
      }
    }
    if (document.readyState === 'complete') {
      finish()
    } else {
      window.addEventListener('load', finish, { once: true })
      // fallback if load already fired oddly
      window.setTimeout(finish, 4000)
    }
  })
}

function PackmanFigure({ name, variant, bubble, talking, onClick, yeeted, clickable }) {
  const Tag = clickable ? 'button' : 'div'
  return (
    <Tag
      type={clickable ? 'button' : undefined}
      className={`packman packman--${variant} ${yeeted ? 'packman--yeeted' : ''} ${clickable ? 'packman--clickable' : ''}`}
      onClick={onClick}
      aria-label={clickable ? 'klik packman om junior eruit te gooien' : undefined}
    >
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
      {clickable && <span className="packman-hint">klik mij!</span>}
    </Tag>
  )
}

function FactoryRobot({ variant, mode }) {
  return (
    <div className={`pak-robot pak-robot--${variant} pak-robot--${mode}`} aria-hidden="true">
      <div className="pak-robot-antenna" />
      <div className="pak-robot-head">
        <span className="pak-robot-eye" />
        <span className="pak-robot-eye" />
      </div>
      <div className="pak-robot-body">
        <div className="pak-robot-core" />
      </div>
      <div className="pak-robot-arm pak-robot-arm--l" />
      <div className="pak-robot-arm pak-robot-arm--r" />
      <div className="pak-robot-legs">
        <span />
        <span />
      </div>
      <span className="pak-robot-tag">bot {variant}</span>
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
  const [boot, setBoot] = useState(true)
  const [phase, setPhase] = useState('playing')
  const [status, setStatus] = useState(STATUS_TICKER[0])
  const [chatLine, setChatLine] = useState(null)
  const [yeet, setYeet] = useState(false)
  const [shake, setShake] = useState(false)
  const chatAlive = useRef(true)
  const yeetLock = useRef(false)

  // wait until page (+ fonts) fully loaded before starting the show
  useEffect(() => {
    let cancelled = false
    waitForPageReady().then(() => {
      if (!cancelled) setBoot(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // main show timers — only after boot
  useEffect(() => {
    if (boot) return undefined

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
      window.setTimeout(() => setStatus(text), 1200 + i * 3000),
    )

    const doneTimer = window.setTimeout(() => setPhase('outro'), ANIMATION_MS - 900)
    const hideTimer = window.setTimeout(() => onComplete?.(), ANIMATION_MS)

    return () => {
      window.clearTimeout(doneTimer)
      window.clearTimeout(hideTimer)
      tickers.forEach((id) => window.clearTimeout(id))
      window.removeEventListener('pointerdown', resume)
      window.removeEventListener('keydown', resume)
      stopPackmanVoice()
      stopSound()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boot])

  // sequential chat — never overlap; wait for speech end
  useEffect(() => {
    if (boot || yeet) return undefined

    chatAlive.current = true
    let prev = null

    const loop = async () => {
      while (chatAlive.current) {
        const line = nextChatLine(prev)
        prev = line
        if (!chatAlive.current) break
        setChatLine(line)
        await shoutPackmanLine(line.text, line.who)
        if (!chatAlive.current) break
        await new Promise((r) => window.setTimeout(r, CHAT_GAP_MS))
      }
    }

    loop()

    return () => {
      chatAlive.current = false
      stopPackmanVoice()
    }
  }, [boot, yeet])

  const handlePackmanClick = () => {
    if (yeetLock.current || yeet || boot) return
    yeetLock.current = true
    chatAlive.current = false
    stopPackmanVoice()
    setYeet(true)
    setShake(true)
    playYeetBoom()
    shoutPackmanLine('robot, gooi junior eruit!', 'senior')
    window.setTimeout(() => setShake(false), 900)
    window.setTimeout(() => {
      shoutPackmanLine('aaaaaa ik vlieg!', 'junior')
    }, 700)
  }

  if (boot) {
    return (
      <div className="andres-stage andres-stage--boot" role="status" aria-label="animatie laden">
        <div className="andres-boot-panel">
          <div className="andres-boot-spinner" />
          <p className="andres-boot-title">andre's pakstraat</p>
          <p className="andres-boot-sub">laden… even wachten tot alles klaar is</p>
        </div>
      </div>
    )
  }

  const seniorLine = chatLine?.who === 'senior' ? chatLine.text : (yeet ? 'yeet!' : '…')
  const juniorLine = chatLine?.who === 'junior' ? chatLine.text : (yeet ? 'aaaa!' : '…')
  const seniorTalking = chatLine?.who === 'senior' && !yeet
  const juniorTalking = chatLine?.who === 'junior' && !yeet

  return (
    <div
      className={`andres-stage andres-stage--deluxe ${phase === 'outro' ? 'andres-stage--outro' : ''} ${shake ? 'andres-stage--shake' : ''} ${yeet ? 'andres-stage--yeet' : ''}`}
      role="dialog"
      aria-label="andre's pakstraat animatie"
      aria-live="polite"
    >
      <div className="andres-sky andres-sky--deluxe" aria-hidden="true" />
      <div className="andres-floor andres-floor--deluxe" aria-hidden="true" />
      <FactoryExtras />
      {yeet && <div className="fx-yeet-flash" aria-hidden="true" />}

      <PackmanMiniGame />
      <ControlHud status={yeet ? 'junior gelanceerd!' : status} />

      <div className="andres-title-wrap">
        <p className="andres-eyebrow">smurfit westrock · parenco</p>
        <h1 className="andres-title andres-title--glitch">andre's pakstraat</h1>
        <p className="andres-subtitle">meten · doorzetten · inpakken · robots</p>
        <div className="andres-title-badges">
          <span>packman crew</span>
          <span>30s show</span>
          <span>klik packman</span>
        </div>
      </div>

      <div className="andres-scene andres-scene--deluxe">
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

        <FactoryRobot variant="alpha" mode={yeet ? 'throw' : 'patrol'} />
        <FactoryRobot variant="beta" mode={yeet ? 'cheer' : 'patrol'} />
        <FactoryRobot variant="gamma" mode={yeet ? 'chase' : 'patrol'} />

        <PackmanFigure
          name="packman"
          variant="senior"
          bubble={seniorLine}
          talking={seniorTalking}
          clickable={!yeet}
          onClick={handlePackmanClick}
        />
        <PackmanFigure
          name="packman junior"
          variant="junior"
          bubble={juniorLine}
          talking={juniorTalking}
          yeeted={yeet}
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

        {yeet && (
          <div className="pak-yeet-banner" aria-live="assertive">
            junior yeet complete
          </div>
        )}
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
