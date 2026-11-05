import { useEffect, useRef, useState } from 'react'
import { playPackmanSoundtrack } from './packmanSounds'
import { playYeetBoom, shoutPackmanLine, stopPackmanVoice } from './packmanVoice'
import { playStuckSoundtrack } from './stuckSounds'

const ANIMATION_MS = 30000
const CHAT_GAP_MS = 1100
const STUCK_SCENE_MS = 10000
const STUCK_LINE_GAP_MS = 500

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

/**
 * 5 volle scènes × 10s — elk met eigen gag, animatie en domme dialoog.
 * Packman + Junior helpen (soort van) de vastzittende operator.
 */
const STUCK_SCENES = [
  {
    id: 1,
    key: 'trap',
    title: 'scène 1 · stomme schoen-klem',
    subtitle: 'operator vs. koker — spoiler: de koker wint',
    gag: 'waarom altijd MIJN schoen?!',
    lines: [
      { who: 'operator', text: 'hé… mijn schoen blijft hangen! weer!' },
      { who: 'operator', text: 'help! help! dit is zo dom!' },
      { who: 'operator', text: 'help help, ik zit vast onder de kokers!' },
      { who: 'operator', text: 'waarom altijd míjn schoen?!' },
    ],
  },
  {
    id: 2,
    key: 'arrive',
    title: 'scène 2 · verkeerde helden',
    subtitle: 'packman denkt pauze, junior neemt koffie mee',
    gag: 'is er cake? oh wacht — noodgeval',
    lines: [
      { who: 'senior', text: 'alarm! of… is er cake op de pakstraat?' },
      { who: 'junior', text: 'ik neem koffie mee! redden gaat beter met caffeine!' },
      { who: 'operator', text: 'geen koffie! mijn voet zit onder de koker joh!' },
      { who: 'senior', text: 'ah. geen cake. wel een vastzittende collega. classic.' },
    ],
  },
  {
    id: 3,
    key: 'inspect',
    title: 'scène 3 · diagnose: stom',
    subtitle: 'serieuze inspectie met nul nuttige ideeën',
    gag: 'plan A: schoen uitdoen… te laat',
    lines: [
      { who: 'senior', text: 'diagnose: schoen is bot, koker is botter.' },
      { who: 'junior', text: 'misschien even uitdoen die schoen? …oh. te laat.' },
      { who: 'operator', text: 'serieus?! dat was plan A geweest!' },
      { who: 'junior', text: 'plan B: likken aan de koker? …nee wacht, slecht idee.' },
      { who: 'senior', text: 'junior. nooit meer plan B zeggen.' },
    ],
  },
  {
    id: 4,
    key: 'rescue',
    title: 'scène 4 · trek de verkeerde voet',
    subtitle: 'heldhaftig trekken — eerst aan de vrije voet',
    gag: 'één… twee… vier? wacht',
    lines: [
      { who: 'senior', text: 'oké team, trekken op drie! één… twee… vier?' },
      { who: 'junior', text: 'ik trek al! …aan de verkeerde voet trouwens.' },
      { who: 'operator', text: 'auw! die zat juist nog los! de ándere!' },
      { who: 'senior', text: 'rechts is links als je ondersteboven panikeert. nog eens!' },
      { who: 'junior', text: 'nu écht: één… twee… drie… YEET de schoen!' },
    ],
  },
  {
    id: 5,
    key: 'free',
    title: 'scène 5 · schoen-trofee dance',
    subtitle: 'vrij! niemand mag dit ooit navertellen',
    gag: 'pack pack victory wiggle',
    lines: [
      { who: 'operator', text: 'ik ben vrij! mijn schoen ruikt naar karton!' },
      { who: 'senior', text: 'victory dance! junior, doe de pack pack wiggle!' },
      { who: 'junior', text: 'wiggle wiggle! dit komt níet in het logboek!' },
      { who: 'operator', text: 'als iemand dit filmt… ik ontslag mezelf.' },
      { who: 'senior', text: 'regel één: schoenen ver van kokers. regel twee: stilzwijgen.' },
    ],
  },
]

const STUCK_MS = STUCK_SCENES.length * STUCK_SCENE_MS

const SPEAKER_LABEL = {
  senior: 'packman',
  junior: 'packman junior',
  operator: 'operator',
}

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

function PackmanFigure({
  name,
  variant,
  bubble,
  talking,
  onClick,
  yeeted,
  clickable,
  ariaLabel,
  hint,
}) {
  const Tag = clickable ? 'button' : 'div'
  return (
    <Tag
      type={clickable ? 'button' : undefined}
      className={`packman packman--${variant} ${yeeted ? 'packman--yeeted' : ''} ${clickable ? 'packman--clickable' : ''}`}
      onClick={onClick}
      aria-label={clickable ? ariaLabel : undefined}
    >
      <div className={`packman-bubble ${talking ? 'packman-bubble--talking' : 'packman-bubble--idle'}`}>
        <strong className="packman-bubble-who">{name}</strong>
        <span className="packman-bubble-text">{bubble}</span>
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
      {clickable && <span className="packman-hint">{hint || 'klik mij!'}</span>}
    </Tag>
  )
}

function ShoeTrigger({ onClick, disabled }) {
  return (
    <button
      type="button"
      className={`shoe-trigger ${disabled ? 'shoe-trigger--off' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label="klik de schoen voor vast onder de kokers animatie"
      title="klik: vast onder de kokers"
    >
      <span className="shoe-trigger-icon" aria-hidden="true">
        <i className="shoe-sole" />
        <i className="shoe-vamp" />
        <i className="shoe-toe" />
        <i className="shoe-laces" />
      </span>
      <span className="shoe-trigger-label">schoen · klik</span>
    </button>
  )
}

function StuckHelper({ variant, pose }) {
  return (
    <div className={`stuck-helper stuck-helper--${variant} stuck-helper--${pose}`} title={variant === 'senior' ? 'packman' : 'packman junior'}>
      <div className="stuck-helper-body">
        <div className="stuck-helper-eye" />
        <div className="stuck-helper-mouth" />
      </div>
      <span className="stuck-helper-name">{variant === 'senior' ? 'packman' : 'junior'}</span>
    </div>
  )
}

function StuckUnderRollers({ line, scene }) {
  const active = scene || STUCK_SCENES[0]
  const speaker = line ? SPEAKER_LABEL[line.who] || line.who : '…'
  const text = line?.text || 'laden…'
  const sceneKey = active.key

  return (
    <div
      className={`stuck-show stuck-show--${sceneKey}`}
      role="group"
      aria-label="operator vast onder de kokers — packman crew helpt"
    >
      <div className="stuck-show-bg" aria-hidden="true" />

      <div className="stuck-scene-rail" aria-hidden="true">
        {STUCK_SCENES.map((s) => (
          <span
            key={s.id}
            className={`stuck-scene-dot ${s.id === active.id ? 'stuck-scene-dot--on' : ''} ${s.id < active.id ? 'stuck-scene-dot--done' : ''}`}
          >
            {s.id}
          </span>
        ))}
      </div>

      <div className="stuck-stage" aria-hidden="true">
        <div className="stuck-rollers">
          <span className="stuck-koker stuck-koker--a" />
          <span className="stuck-koker stuck-koker--b" />
          <span className="stuck-koker stuck-koker--c" />
        </div>

        <div className={`stuck-operator stuck-operator--${sceneKey}`}>
          <div className="stuck-op-head" />
          <div className="stuck-op-body" />
          <div className="stuck-op-legs">
            <span className="stuck-op-leg stuck-op-leg--free" />
            <span className="stuck-op-leg stuck-op-leg--caught">
              <i className="stuck-shoe" />
            </span>
          </div>
          <div className="stuck-op-arms">
            <span /><span />
          </div>
          <span className="stuck-op-label">operator</span>
        </div>

        {/* scene 1: dramatic dumb trap */}
        <div className={`stuck-layer ${sceneKey === 'trap' ? 'stuck-layer--on' : ''}`}>
          <p className="stuck-big-cry stuck-big-cry--soft">HELP!</p>
          <div className="stuck-sparks"><i /><i /><i /><i /></div>
          <div className="stuck-gag-shoe" title="stomme schoen" />
          <p className="stuck-gag-banner">schoen vs koker</p>
        </div>

        {/* scene 2: wrong heroes + coffee */}
        <div className={`stuck-layer ${sceneKey === 'arrive' ? 'stuck-layer--on' : ''}`}>
          <div className="stuck-alarm" />
          <StuckHelper variant="senior" pose="run" />
          <StuckHelper variant="junior" pose="run" />
          <div className="stuck-coffee" title="koffie" />
          <div className="stuck-cake-q">cake?</div>
          <p className="stuck-big-cry">HELP!</p>
        </div>

        {/* scene 3: useless inspection */}
        <div className={`stuck-layer ${sceneKey === 'inspect' ? 'stuck-layer--on' : ''}`}>
          <StuckHelper variant="senior" pose="talk" />
          <StuckHelper variant="junior" pose="inspect" />
          <div className="stuck-inspect-beam" />
          <div className="stuck-magnifier" />
          <p className="stuck-plan-bubble">diagnose: stom</p>
          <p className="stuck-plan-bubble stuck-plan-bubble--alt">plan B: ❌ likken</p>
        </div>

        {/* scene 4: wrong-foot tug of war */}
        <div className={`stuck-layer ${sceneKey === 'rescue' ? 'stuck-layer--on' : ''}`}>
          <StuckHelper variant="senior" pose="pull" />
          <StuckHelper variant="junior" pose="push" />
          <div className="stuck-pull-line" />
          <div className="stuck-wrong-foot-tag">verkeerde voet!</div>
          <div className="stuck-force-arrows"><span /><span /><span /></div>
          <p className="stuck-count-banner">1 · 2 · 4? · wacht</p>
        </div>

        {/* scene 5: shoe trophy dance */}
        <div className={`stuck-layer ${sceneKey === 'free' ? 'stuck-layer--on' : ''}`}>
          <StuckHelper variant="senior" pose="cheer" />
          <StuckHelper variant="junior" pose="cheer" />
          <div className="stuck-free-op stuck-free-op--dance" />
          <div className="stuck-shoe-trophy" title="schoen trofee" />
          <p className="stuck-free-banner">vrij!</p>
          <p className="stuck-gag-banner stuck-gag-banner--win">pack pack wiggle</p>
          <div className="stuck-confetti"><i /><i /><i /><i /><i /><i /><i /><i /></div>
        </div>
      </div>

      <div className="stuck-scene-header">
        <p className="stuck-show-title">noodgeval · vast onder de kokers</p>
        <p className="stuck-scene-tag">{active.title}</p>
        <p className="stuck-scene-sub">{active.subtitle}</p>
        {active.gag && <p className="stuck-scene-gag"> gag · {active.gag}</p>}
      </div>

      <div className="stuck-caption-board" aria-live="assertive">
        <span className={`stuck-caption-who stuck-caption-who--${line?.who || 'operator'}`}>
          {speaker}
        </span>
        <p className="stuck-caption-text">{text}</p>
      </div>

      <div className="stuck-progress" aria-hidden="true">
        <div
          className="stuck-progress-bar stuck-progress-bar--manual"
          style={{ width: `${(active.id / STUCK_SCENES.length) * 100}%` }}
        />
      </div>
    </div>
  )
}

function GiantFootCircus() {
  return (
    <div className="foot-circus" aria-hidden="true">
      <div className="foot-circus-stage">
        <div className="foot-circus-ground" />
        <div className="tiny-ball">
          <span className="tiny-ball-shine" />
          <span className="tiny-ball-stripe" />
        </div>
        <div className="giant-foot">
          {/* side-view cartoon foot: heel left → toes right */}
          <div className="foot-draw">
            <div className="foot-leg" />
            <div className="foot-heel" />
            <div className="foot-arch" />
            <div className="foot-fore" />
            <div className="foot-toes">
              <i /><i /><i /><i /><i />
            </div>
            <div className="foot-sole-line" />
          </div>
        </div>
      </div>
      <p className="foot-circus-caption">enorme voet rolt heen en weer</p>
    </div>
  )
}

function SixAxisRobot({ variant, mode }) {
  return (
    <div
      className={`arm6 arm6--${variant} arm6--${mode}`}
      aria-hidden="true"
    >
      <div className="arm6-scene">
        <div className="arm6-base">
          <div className="arm6-base-ring" />
          <div className="arm6-j arm6-j1">
            <div className="arm6-joint-cap" />
            <div className="arm6-link arm6-link1">
              <div className="arm6-j arm6-j2">
                <div className="arm6-joint-cap" />
                <div className="arm6-link arm6-link2">
                  <div className="arm6-j arm6-j3">
                    <div className="arm6-joint-cap" />
                    <div className="arm6-link arm6-link3">
                      <div className="arm6-j arm6-j4">
                        <div className="arm6-joint-cap arm6-joint-cap--sm" />
                        <div className="arm6-j arm6-j5">
                          <div className="arm6-joint-cap arm6-joint-cap--sm" />
                          <div className="arm6-j arm6-j6">
                            <div className="arm6-wrist" />
                            <div className="arm6-gripper">
                              <span className="arm6-claw arm6-claw--l" />
                              <span className="arm6-claw arm6-claw--r" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="arm6-shadow" />
      </div>
      <span className="arm6-tag">6-as · {variant}</span>
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
  const [footShow, setFootShow] = useState(false)
  const [stuckShow, setStuckShow] = useState(false)
  const [stuckLine, setStuckLine] = useState(null)
  const [stuckScene, setStuckScene] = useState(STUCK_SCENES[0])
  const [shake, setShake] = useState(false)
  const chatAlive = useRef(true)
  const stuckAlive = useRef(false)
  const yeetLock = useRef(false)
  const footLock = useRef(false)
  const stuckLock = useRef(false)
  const mainTimers = useRef({ done: null, hide: null, tickers: [] })
  const stopMainSound = useRef(() => {})
  const stopStuckSound = useRef(() => {})

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

  // main show timers — only after boot; paused/replaced when stuck plays
  useEffect(() => {
    if (boot || stuckShow) return undefined

    let stopSound = () => {}
    let started = false

    const startSound = () => {
      if (started) return
      started = true
      stopSound = playPackmanSoundtrack()
      stopMainSound.current = stopSound
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
    mainTimers.current = { done: doneTimer, hide: hideTimer, tickers }

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
  }, [boot, stuckShow])

  // sequential chat — never overlap; wait for speech end
  useEffect(() => {
    if (boot || yeet || footShow || stuckShow) return undefined

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
  }, [boot, yeet, footShow, stuckShow])

  // stuck-under-rollers: 5 connected scenes, each at least 10s, with crew dialogue
  useEffect(() => {
    if (!stuckShow) return undefined

    stuckAlive.current = true
    stopStuckSound.current = playStuckSoundtrack(STUCK_MS / 1000)
    let finished = false

    const wait = (ms) => new Promise((r) => window.setTimeout(r, ms))

    const finishShow = () => {
      if (finished || !stuckAlive.current) return
      finished = true
      setPhase('outro')
      window.setTimeout(() => onComplete?.(), 900)
    }

    const run = async () => {
      for (const scene of STUCK_SCENES) {
        if (!stuckAlive.current) break
        setStuckScene(scene)
        setStatus(`scène ${scene.id}/${STUCK_SCENES.length} · crew helpt`)
        const startedAt = Date.now()

        for (const line of scene.lines) {
          if (!stuckAlive.current) break
          setStuckLine(line)
          await shoutPackmanLine(line.text, line.who)
          if (!stuckAlive.current) break
          await wait(STUCK_LINE_GAP_MS)
        }

        // elke scène blijft minimaal 10s staan, daarna soft door naar de volgende
        const elapsed = Date.now() - startedAt
        const remain = STUCK_SCENE_MS - elapsed
        if (stuckAlive.current && remain > 0) {
          await wait(remain)
        }
      }

      finishShow()
    }

    run()

    // safety only — scenes themselves gate the real end
    const hardStop = window.setTimeout(finishShow, STUCK_SCENES.length * 22000)

    return () => {
      stuckAlive.current = false
      window.clearTimeout(hardStop)
      stopPackmanVoice()
      stopStuckSound.current?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stuckShow])

  const handlePackmanClick = () => {
    if (yeetLock.current || yeet || boot || footShow || stuckShow) return
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

  const handleJuniorClick = () => {
    if (footLock.current || footShow || yeet || boot || stuckShow) return
    footLock.current = true
    chatAlive.current = false
    stopPackmanVoice()
    setFootShow(true)
    setShake(true)
    playYeetBoom()
    shoutPackmanLine('kijk die voet!', 'junior')
    window.setTimeout(() => setShake(false), 800)
    window.setTimeout(() => {
      shoutPackmanLine('die voet rolt op dat balletje!', 'senior')
    }, 1200)
  }

  const handleShoeClick = () => {
    if (stuckLock.current || stuckShow || yeet || footShow || boot) return
    stuckLock.current = true
    chatAlive.current = false
    stopPackmanVoice()
    stopMainSound.current?.()
    const { done, hide, tickers } = mainTimers.current
    if (done) window.clearTimeout(done)
    if (hide) window.clearTimeout(hide)
    tickers?.forEach((id) => window.clearTimeout(id))
    setShake(true)
    setStuckShow(true)
    setStatus('NOODGEVAL · vast onder kokers')
    window.setTimeout(() => setShake(false), 700)
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

  const seniorLine = chatLine?.who === 'senior'
    ? chatLine.text
    : (yeet ? 'yeet!' : footShow ? 'wtf voet?!' : stuckShow ? 'noodstop!' : '…')
  const juniorLine = chatLine?.who === 'junior'
    ? chatLine.text
    : (yeet ? 'aaaa!' : footShow ? 'circus mode!' : stuckShow ? 'ik help!' : '…')
  const seniorTalking = chatLine?.who === 'senior' && !yeet && !footShow && !stuckShow
  const juniorTalking = chatLine?.who === 'junior' && !yeet && !footShow && !stuckShow
  const busy = yeet || footShow || stuckShow

  return (
    <div
      className={`andres-stage andres-stage--deluxe ${phase === 'outro' ? 'andres-stage--outro' : ''} ${shake ? 'andres-stage--shake' : ''} ${yeet ? 'andres-stage--yeet' : ''} ${footShow ? 'andres-stage--foot' : ''} ${stuckShow ? 'andres-stage--stuck' : ''}`}
      role="dialog"
      aria-label="andre's pakstraat animatie"
      aria-live="polite"
    >
      <div className="andres-sky andres-sky--deluxe" aria-hidden="true" />
      <div className="andres-floor andres-floor--deluxe" aria-hidden="true" />
      <FactoryExtras />
      {yeet && <div className="fx-yeet-flash" aria-hidden="true" />}
      {footShow && <GiantFootCircus />}
      {stuckShow && <StuckUnderRollers line={stuckLine} scene={stuckScene} />}

      <ShoeTrigger onClick={handleShoeClick} disabled={busy} />
      <PackmanMiniGame />
      <ControlHud
        status={
          yeet
            ? 'junior gelanceerd!'
            : footShow
              ? 'voet circus!!!'
              : stuckShow
                ? 'NOODGEVAL · vast!'
                : status
        }
      />

      {!stuckShow && (
      <div className="andres-title-wrap">
        <p className="andres-eyebrow">smurfit westrock · parenco</p>
        <h1 className="andres-title andres-title--glitch">andre's pakstraat</h1>
        <p className="andres-subtitle">meten · doorzetten · inpakken · 6-as robots</p>
        <div className="andres-title-badges">
          <span>packman crew</span>
          <span>30s show</span>
          <span>oranje 6-as</span>
          <span>klik packman</span>
          <span>klik junior</span>
          <span>klik schoen</span>
        </div>
      </div>
      )}

      {chatLine && !busy && (
        <div className="pak-subtitle" aria-live="polite">
          <span className={`pak-subtitle-who pak-subtitle-who--${chatLine.who}`}>
            {SPEAKER_LABEL[chatLine.who]}
          </span>
          <span className="pak-subtitle-text">{chatLine.text}</span>
        </div>
      )}

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

        <SixAxisRobot variant="alpha" mode={yeet ? 'throw' : 'work'} />
        <SixAxisRobot variant="beta" mode={yeet ? 'spot' : 'work'} />
        <SixAxisRobot variant="gamma" mode={yeet ? 'wave' : 'work'} />

        <PackmanFigure
          name="packman"
          variant="senior"
          bubble={seniorLine}
          talking={seniorTalking}
          clickable={!busy}
          onClick={handlePackmanClick}
          ariaLabel="klik packman om junior eruit te gooien"
          hint="klik: yeet"
        />
        <PackmanFigure
          name="packman junior"
          variant="junior"
          bubble={juniorLine}
          talking={juniorTalking}
          yeeted={yeet}
          clickable={!busy}
          onClick={handleJuniorClick}
          ariaLabel="klik junior voor voet circus easter egg"
          hint="klik: voet"
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
