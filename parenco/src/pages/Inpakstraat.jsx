import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ROLL_DIAMETER = 1255
const BASE_CORE_DIAMETER = 230
const MEASURED_DIAMETER = 1185
const MEASURED_LENGTH = 4248
const MAX_DIAMETER = 1200
const MIN_DIAMETER = 230

function calculateRollsCount(diameter, windsPerRoll, reductionFactor) {
  const currentDiameter = parseFloat(diameter)
  const winds = parseFloat(windsPerRoll) || 1.5
  const reductionPercent = parseFloat(reductionFactor) || 5

  if (
    !diameter ||
    Number.isNaN(currentDiameter) ||
    currentDiameter < MIN_DIAMETER ||
    currentDiameter > MAX_DIAMETER ||
    Number.isNaN(winds) ||
    winds <= 0 ||
    Number.isNaN(reductionPercent)
  ) {
    return 0
  }

  // Paper area excludes the 230mm kern: π * ((d² - core²) / 4)
  const currentPaperArea = Math.PI * ((currentDiameter * currentDiameter - BASE_CORE_DIAMETER * BASE_CORE_DIAMETER) / 4)
  const measuredPaperArea = Math.PI * ((MEASURED_DIAMETER * MEASURED_DIAMETER - BASE_CORE_DIAMETER * BASE_CORE_DIAMETER) / 4)
  const remainingLength = MEASURED_LENGTH * (currentPaperArea / measuredPaperArea)
  const metersPerRoll = (Math.PI * ROLL_DIAMETER / 1000) * winds
  const adjustedMetersPerRoll = metersPerRoll * (1 - (reductionPercent / 100))
  const calculatedRolls = Math.floor(remainingLength / adjustedMetersPerRoll)

  return calculatedRolls > 0 ? calculatedRolls : 0
}

function Inpakstraat() {
  const navigate = useNavigate()
  const [diameter, setDiameter] = useState('')
  const [windsPerRoll, setWindsPerRoll] = useState('1.5')
  const [reductionFactor, setReductionFactor] = useState('5')
  const rollsCount = calculateRollsCount(diameter, windsPerRoll, reductionFactor)

  const handleDiameterChange = (e) => {
    setDiameter(e.target.value)
  }

  const handleWindsPerRollChange = (e) => {
    setWindsPerRoll(e.target.value)
  }

  const handleReductionFactorChange = (e) => {
    setReductionFactor(e.target.value)
  }

  return (
    <div className="page-shell">
      <header className="site-header">
        <div className="relative z-10 mx-auto flex max-w-4xl items-center justify-between px-4 py-4 md:px-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="font-display text-left text-xl text-brand-navy transition hover:text-brand-mid md:text-2xl"
            aria-label="terug naar homepage"
          >
            inpakstraat
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-soft/80 bg-white/80 text-2xl text-brand-mid transition hover:border-brand-bright hover:text-brand-navy"
            aria-label="terug naar homepage"
          >
            ←
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-10">
        <section className="mb-8 flex flex-col items-center gap-6 md:mb-10 md:flex-row md:justify-center md:gap-10">
          <div className="relative flex h-56 w-full items-center justify-center md:h-64 md:w-64">
            <div className="relative h-48 w-48 animate-unwind-spool md:h-60 md:w-60">
              <div className="absolute left-1/2 top-1/2 h-2 origin-left -translate-y-1/2 rotate-[-55deg] rounded-full bg-brand-bright animate-unwind-line md:h-3" />
              <div className="absolute inset-0 rounded-full border-8 border-brand-soft/60 animate-unwind-ring" />
              <div className="absolute inset-3 rounded-full border-8 border-brand-soft/80 animate-unwind-ring" style={{ animationDelay: '0.1s' }} />
              <div className="absolute inset-6 rounded-full border-8 border-brand-bright/45 animate-unwind-ring" style={{ animationDelay: '0.2s' }} />
              <div className="absolute inset-9 rounded-full border-8 border-brand-bright/70 animate-unwind-ring" style={{ animationDelay: '0.3s' }} />
              <div className="absolute inset-12 rounded-full border-8 border-brand-navy/80" />
              <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_6px_18px_rgba(0,32,91,0.12)]">
                <div className="h-7 w-7 rounded-full bg-brand-navy" />
              </div>
            </div>
          </div>

          <dl className="w-full space-y-2.5 text-sm text-brand-mid md:w-auto md:min-w-[14rem] md:text-base">
            <div className="flex gap-2">
              <dt className="font-medium text-brand-navy">naam:</dt>
              <dd>reelplex 220</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium text-brand-navy">diameter:</dt>
              <dd>1185mm</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium text-brand-navy">lengte:</dt>
              <dd>4248m</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium text-brand-navy">kern diameter:</dt>
              <dd>{BASE_CORE_DIAMETER}mm</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium text-brand-navy">vgm:</dt>
              <dd>220</dd>
            </div>
          </dl>
        </section>

        <section className="mb-6 space-y-4 md:mb-8">
          <div>
            <p className="mb-2 text-xs text-brand-mid/80 md:text-sm">
              bereik: {MAX_DIAMETER}mm tot {MIN_DIAMETER}mm (kern: {BASE_CORE_DIAMETER}mm)
            </p>
            <input
              type="number"
              value={diameter}
              onChange={handleDiameterChange}
              placeholder="diameter (mm)"
              min={MIN_DIAMETER}
              max={MAX_DIAMETER}
              className="field-input"
            />
          </div>

          <div>
            <p className="mb-2 text-xs text-brand-mid/80 md:text-sm">
              standaard: 1.5 wikkelingen per rol
            </p>
            <div className="flex gap-3">
              <input
                type="number"
                value={windsPerRoll}
                onChange={handleWindsPerRollChange}
                placeholder="aantal wikkelingen per rol"
                min="0.1"
                step="0.1"
                className="field-input w-1/2"
              />
              <div className="relative w-1/2">
                <select
                  value={reductionFactor}
                  onChange={handleReductionFactorChange}
                  className="field-input cursor-pointer appearance-none pr-10"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((percent) => (
                    <option key={percent} value={percent}>
                      {percent}%
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg className="h-5 w-5 text-brand-mid" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="result-panel space-y-7 md:space-y-8">
          <div>
            <p className="mb-2 text-sm text-brand-mid md:text-base">
              aantal rollen die gewikkeld kunnen worden:
            </p>
            <p className="font-display text-4xl font-bold tracking-tight text-brand-navy md:text-5xl">
              {rollsCount}
            </p>
          </div>

          <div className="border-t border-brand-soft/60 pt-6 md:pt-8">
            <p className="mb-2 text-sm text-brand-mid md:text-base">
              het percentage van de kans dat de rollen een diameter van minder dan 1255mm hebben:
            </p>
            <p className="font-display text-4xl font-bold tracking-tight text-brand-navy md:text-5xl">
              {reductionFactor || '5'}%
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Inpakstraat
