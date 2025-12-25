import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Inpakstraat() {
  const navigate = useNavigate()
  const [diameter, setDiameter] = useState('')
  const [windsPerRoll, setWindsPerRoll] = useState('1.5')
  const [reductionFactor, setReductionFactor] = useState('5')
  const [rollsCount, setRollsCount] = useState(0)

  const animationStyles = `
    @keyframes unwind-line {
      0% { width: 0; opacity: 1; }
      65% { width: 180px; opacity: 1; }
      100% { width: 0; opacity: 0; }
    }
    @keyframes unwind-spool {
      0% { transform: scale(1); opacity: 1; }
      60% { transform: scale(0.9); opacity: 0.9; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes unwind-ring {
      0% { transform: scale(1); opacity: 0.8; }
      60% { transform: scale(0.9); opacity: 0.5; }
      100% { transform: scale(0.8); opacity: 0.25; }
    }
  `

  const ROLL_DIAMETER = 1255
  const MIN_ROLL_DIAMETER = 1180
  const MAX_ROLL_DIAMETER = 1255
  const BASE_CORE_DIAMETER = 185
  const MEASURED_DIAMETER = 1185
  const MEASURED_LENGTH = 4248
  const MAX_DIAMETER = 1200
  const MIN_DIAMETER = 185

  useEffect(() => {
    let calculatedRolls = 0

    if (diameter && diameter >= MIN_DIAMETER && diameter <= MAX_DIAMETER) {
      const currentDiameter = parseFloat(diameter)
      const winds = parseFloat(windsPerRoll) || 1.5
      const reductionPercent = parseFloat(reductionFactor) || 5
      if (!isNaN(currentDiameter) && !isNaN(winds) && winds > 0 && !isNaN(reductionPercent)) {
        // Calculate paper area (excluding the 185mm core)
        // Paper area = π * (outer_radius^2 - core_radius^2)
        // Simplified: π * ((diameter^2 - core_diameter^2) / 4)
        const currentPaperArea = Math.PI * ((currentDiameter * currentDiameter - BASE_CORE_DIAMETER * BASE_CORE_DIAMETER) / 4)
        const measuredPaperArea = Math.PI * ((MEASURED_DIAMETER * MEASURED_DIAMETER - BASE_CORE_DIAMETER * BASE_CORE_DIAMETER) / 4)
        
        // Calculate remaining length based on area ratio
        const areaRatio = currentPaperArea / measuredPaperArea
        const remainingLength = MEASURED_LENGTH * areaRatio

        // Calculate how many rolls can be made
        const metersPerRoll = (Math.PI * ROLL_DIAMETER / 1000) * winds
        const reductionFactorValue = 1 - (reductionPercent / 100)
        const adjustedMetersPerRoll = metersPerRoll * reductionFactorValue
        calculatedRolls = Math.floor(remainingLength / adjustedMetersPerRoll)
      }
    }

    setRollsCount(calculatedRolls > 0 ? calculatedRolls : 0)
  }, [diameter, windsPerRoll, reductionFactor])

  const handleDiameterChange = (e) => {
    const value = e.target.value
    setDiameter(value)
  }

  const handleWindsPerRollChange = (e) => {
    const value = e.target.value
    setWindsPerRoll(value)
  }

  const handleReductionFactorChange = (e) => {
    const value = e.target.value
    setReductionFactor(value)
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      <header className="bg-white/60 backdrop-blur-sm shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-left text-xl md:text-2xl font-semibold text-primary-light hover:text-accent-light transition-colors cursor-pointer"
            aria-label="return to homepage"
          >
            inpakstraat
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-3xl md:text-4xl text-primary-light hover:text-accent-light transition-colors cursor-pointer"
            aria-label="return to homepage"
          >
            ←
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 mb-8">
            <div className="w-full md:w-64 h-64 flex items-center justify-center relative">
              <div className="relative w-48 h-48 md:w-64 md:h-64 animate-[unwind-spool_2.4s_ease-in-out_infinite]">
                <div className="absolute top-1/2 left-1/2 origin-left -translate-y-1/2 rotate-[-55deg] h-2 md:h-3 rounded-full bg-primary-light animate-[unwind-line_2.4s_ease-in-out_infinite]" />
                <div className="absolute inset-0 rounded-full border-8 border-primary-light/35 animate-[unwind-ring_2.4s_ease-in-out_infinite]" style={{ animationDelay: '0s' }}></div>
                <div className="absolute inset-3 rounded-full border-8 border-primary-light/50 animate-[unwind-ring_2.4s_ease-in-out_infinite]" style={{ animationDelay: '0.1s' }}></div>
                <div className="absolute inset-6 rounded-full border-8 border-primary-light/65 animate-[unwind-ring_2.4s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }}></div>
                <div className="absolute inset-9 rounded-full border-8 border-primary-light/80 animate-[unwind-ring_2.4s_ease-in-out_infinite]" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute inset-12 rounded-full border-8 border-primary-light"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/80 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-8 h-8 bg-primary-light rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg w-full md:w-auto">
              <div className="space-y-2 text-primary-light text-sm md:text-base">
                <div>
                  <span className="font-semibold">naam:</span> REELPLEX 220
                </div>
                <div>
                  <span className="font-semibold">diameter:</span> 1185mm
                </div>
                <div>
                  <span className="font-semibold">lengte:</span> 4248m
                </div>
                <div>
                  <span className="font-semibold">kern diameter:</span> 185mm
                </div>
                <div>
                  <span className="font-semibold">vgm:</span> 220
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 md:mb-8 space-y-4">
            <div>
              <div className="text-xs md:text-sm text-gray-600 mb-2">
                bereik: {MAX_DIAMETER}mm tot {MIN_DIAMETER}mm (kern: {BASE_CORE_DIAMETER}mm)
              </div>
              <input
                type="number"
                value={diameter}
                onChange={handleDiameterChange}
                placeholder="diameter (mm)"
                min={MIN_DIAMETER}
                max={MAX_DIAMETER}
                className="w-full px-4 py-3 rounded-xl border-2 border-primary-light focus:border-accent-light focus:outline-none text-primary-light placeholder-gray-400 bg-white/60 backdrop-blur-sm text-base md:text-lg"
              />
            </div>
            <div>
              <div className="text-xs md:text-sm text-gray-600 mb-2">
                standaard: 1.5 wikkelingen per rol
              </div>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={windsPerRoll}
                  onChange={handleWindsPerRollChange}
                  placeholder="aantal wikkelingen per rol"
                  min="0.1"
                  step="0.1"
                  className="w-1/2 px-4 py-3 rounded-xl border-2 border-primary-light focus:border-accent-light focus:outline-none text-primary-light placeholder-gray-400 bg-white/60 backdrop-blur-sm text-base md:text-lg"
                />
                <div className="w-1/2 relative">
                  <select
                    value={reductionFactor}
                    onChange={handleReductionFactorChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-primary-light focus:border-accent-light focus:outline-none text-primary-light bg-white/60 backdrop-blur-sm text-base md:text-lg cursor-pointer appearance-none"
                    style={{ direction: 'ltr' }}
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((percent) => (
                      <option key={percent} value={percent}>
                        {percent}%
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-lg">
            <div className="space-y-6 md:space-y-8">
              <div>
                <div className="text-primary-light mb-3 text-sm md:text-base">
                  aantal rollen die gewikkeld kunnen worden:
                </div>
                <div className="text-3xl md:text-5xl font-bold text-primary-light">
                  {rollsCount}
                </div>
              </div>

              <div className="border-t border-primary-light/30 pt-6 md:pt-8">
                <div className="text-primary-light mb-3 text-sm md:text-base">
                  het percentage van de kans dat de rollen een diameter van minder dan 1255mm hebben:
                </div>
                <div className="text-3xl md:text-5xl font-bold text-primary-light">
                  {reductionFactor || '5'}% 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{animationStyles}</style>
    </div>
  )
}

export default Inpakstraat

