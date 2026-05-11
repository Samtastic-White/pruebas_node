import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.logo} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <span className={styles.logoRun}>MARATHON</span>
      </div>

      <div className="flex items-center gap-6">
        <a href="#eventos" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
          Eventos
        </a>
        <button
          onClick={() => navigate('/login')}
          className="bg-transparent border border-white/40 text-white px-4 py-2 rounded-full text-sm font-medium hover:border-[#f97316] hover:text-[#f97316] transition-colors"
        >
          Admin
        </button>
      </div>
    </nav>
  )
}