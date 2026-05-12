import { useState } from 'react'
import { LayoutDashboard, CalendarDays, ClipboardList, Users, UserPlus, UserCircle, LogOut, Menu, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import logo from '../../assets/logo.png'

export const Sidebar = () => {
  const [open, setOpen] = useState(false)

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: CalendarDays, label: 'Eventos', path: '/events' },
    { icon: ClipboardList, label: 'Inscripciones', path: '/registrations' },
    { icon: Users, label: 'Corredores', path: '/runners' },
    { icon: UserPlus, label: 'Inscribir corredor', path: '/register-runner' },
    { icon: UserCircle, label: 'Perfil', path: '/profile' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-[#171923] p-2 rounded-lg border border-white/10"
      >
        {open ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <aside className={`
        h-screen w-[260px] fixed left-0 top-0 flex flex-col bg-surface-low border-r border-white/5 py-8 z-50
        transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="px-6 mb-10">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Marathon" className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">MARATHON</h1>
              <p className="text-[10px] text-on-surface-variant tracking-[0.2em] uppercase">Running Events</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-md transition-all font-medium
                ${isActive 
                  ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                  : 'text-on-surface-variant hover:text-white hover:bg-white/5'}
              `}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-4 pt-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-md transition-all font-medium text-[#ef4444] hover:bg-[#ef4444]/10"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  )
}