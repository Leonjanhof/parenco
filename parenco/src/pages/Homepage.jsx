import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Homepage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const navItems = [
    { name: 'inpakstraat', path: '/inpakstraat', note: 'bereken inpakpapier voor rollen' },
  ]

  const handleNavigate = (path) => {
    setLoading(true)
    setTimeout(() => {
      navigate(path)
      setLoading(false)
    }, 1200)
  }

  if (loading) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center px-6">
        <div className="relative z-10 flex flex-col items-center gap-5 animate-fade-up">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-[3px] border-primary-soft" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-primary-light animate-spin-slow" />
            <div className="absolute inset-2 rounded-full border-[3px] border-transparent border-b-accent-light animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '1.6s' }} />
          </div>
          <p className="font-display text-2xl tracking-tight text-primary-light animate-soft-pulse">
            laden...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 pb-16 pt-10 md:px-8 md:pt-14">
        <header className="animate-fade-up">
          <p className="mb-3 font-sans text-sm font-medium tracking-[0.18em] text-primary-light/70">
            werktools
          </p>
          <h1 className="font-display text-[clamp(3.4rem,14vw,6.5rem)] leading-[0.9] tracking-tight text-primary-deep">
            parenco
          </h1>
          <p className="mt-5 max-w-md text-base text-primary-light/85 md:text-lg">
            praktische hulpmiddelen voor de werkvloer, helder en snel op je telefoon.
          </p>
        </header>

        <nav className="mt-14 animate-fade-up md:mt-20" style={{ animationDelay: '120ms' }} aria-label="pagina's">
          <ul className="space-y-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <button
                  type="button"
                  onClick={() => handleNavigate(item.path)}
                  className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-primary-soft/60 bg-white/55 px-5 py-5 text-left transition duration-300 hover:border-accent-light hover:bg-white/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-light md:px-7 md:py-6"
                >
                  <span>
                    <span className="block font-display text-2xl text-primary-deep transition group-hover:text-primary-light md:text-3xl">
                      {item.name}
                    </span>
                    <span className="mt-1 block text-sm text-primary-light/70">
                      {item.note}
                    </span>
                  </span>
                  <span className="font-display text-2xl text-accent transition group-hover:translate-x-1" aria-hidden="true">
                    →
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default Homepage
