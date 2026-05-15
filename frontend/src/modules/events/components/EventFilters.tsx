interface Props {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
}

export default function EventFilters({ search, onSearchChange, statusFilter, onStatusChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        placeholder="Buscar por nombre o lugar..."
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        className="flex-1 bg-[#171923] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
      />
      <select
        value={statusFilter}
        onChange={e => onStatusChange(e.target.value)}
        className="bg-[#171923] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-[#e2e8f0] focus:border-[#f97316] focus:outline-none w-full sm:w-40"
      >
        <option value="all">Todos</option>
        <option value="active">Activos</option>
        <option value="inactive">Inactivos</option>
        <option value="finished">Finalizados</option>
      </select>
    </div>
  )
}