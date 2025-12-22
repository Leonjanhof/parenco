import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Homepage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const scrollbarStyles = `
    .nav-scroll::-webkit-scrollbar { display: none; }
    .nav-scroll { -ms-overflow-style: none; scrollbar-width: none; }
  `

  const navItems = [
    { name: 'inpakstraat', path: '/inpakstraat' }
  ]

  const handleNavigate = (path) => {
    setLoading(true)
    setTimeout(() => {
      navigate(path)
      setLoading(false)
    }, 1500)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary-light border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-accent-light border-r-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="text-3xl text-primary-light font-medium animate-pulse">
            laden...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gradient-warm">
      <div className="container mx-auto px-4 pt-12 pb-10">
        <div className="flex items-center justify-center min-h-[70vh]">
          <nav className="w-full max-w-3xl">
            <ul className="nav-scroll overflow-visible space-y-5">
              {navItems.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavigate(item.path)}
                    style={{ borderWidth: '2mm' }}
                    className="w-full text-left px-7 py-6 rounded-2xl bg-white/70 hover:bg-white/85 backdrop-blur-md transition-all duration-300 text-primary-light text-2xl font-semibold cursor-pointer transform hover:scale-[1.01] border-accent-light shadow-[0_0_25px_rgba(255,235,59,0.4)] hover:shadow-[0_0_32px_rgba(255,235,59,0.55)]"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <style>{scrollbarStyles}</style>
    </div>
  )
}

export default Homepage

