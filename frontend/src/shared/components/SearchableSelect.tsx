import { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown } from 'lucide-react'

interface Option {
  id: number
  name: string
}

interface Props {
  options: Option[]
  value: number
  onChange: (id: number) => void
  placeholder?: string
}

export default function SearchableSelect({ options, value, onChange, placeholder = 'Buscar...' }: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find(o => o.id === value)

  const filtered = options.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 px-4 text-left flex items-center justify-between focus:border-[#f97316] focus:outline-none"
      >
        <span className={selected ? 'text-[#e2e8f0]' : 'text-[#94a3b8]'}>
          {selected?.name || placeholder}
        </span>
        <ChevronDown size={16} className="text-[#94a3b8]" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-[#171923] border border-white/5 rounded-lg shadow-xl overflow-hidden">
          <div className="p-2 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={14} />
              <input
                type="text"
                placeholder="Buscar evento..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#0f1117] border border-white/5 rounded-md py-1.5 pl-8 pr-3 text-sm text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-[#94a3b8] text-sm text-center py-4">Sin resultados</p>
            ) : (
              filtered.map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => { onChange(option.id); setOpen(false); setSearch('') }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#f97316]/10 transition-colors ${
                    option.id === value ? 'text-[#f97316] bg-[#f97316]/5' : 'text-[#e2e8f0]'
                  }`}
                >
                  {option.name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}