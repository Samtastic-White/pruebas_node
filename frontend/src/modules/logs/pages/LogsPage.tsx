import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronLeft, ChevronRight, ScrollText } from 'lucide-react'
import { useLogs } from '../hooks/useLogs'
import { useDebounce } from '../../../shared/hooks/useDebounce'
import type { LogFilters } from '../hooks/useLogs'
import styles from './LogsPage.module.css'

const TYPE_OPTIONS = [
  { value: '', label: 'Todos los tipos' },
  { value: 'success', label: 'Success' },
  { value: 'error', label: 'Error' },
] as const

const MODULO_OPTIONS = [
  { value: '', label: 'Todos los módulos' },
  { value: 'auth', label: 'Auth' },
  { value: 'events', label: 'Eventos' },
  { value: 'registrations', label: 'Inscripciones' },
  { value: 'runners', label: 'Corredores' },
  { value: 'invoices', label: 'Facturas' },
  { value: 'system', label: 'Sistema' },
] as const

const typeLabels: Record<string, string> = {
  success: 'Success',
  error: 'Error',
}

const getTypeClass = (type: string): string => {
  switch (type) {
    case 'success':
      return styles.badgeSuccess
    case 'error':
      return styles.badgeError
    default:
      return ''
  }
}

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-'
  return new Date(dateStr.split('T')[0] + 'T12:00:00').toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function inferType(log: { mensaje?: string }): 'success' | 'error' {
  return log.mensaje ? 'error' : 'success'
}

function renderDetails(log: { detalles?: Record<string, unknown>; mensaje?: string }): string {
  if (log.mensaje) {
    try {
      const parsed = JSON.parse(log.mensaje)
      return typeof parsed === 'string' ? parsed : JSON.stringify(parsed)
    } catch {
      return log.mensaje
    }
  }
  if (log.detalles) {
    const str = JSON.stringify(log.detalles)
    return str.length > 120 ? str.slice(0, 120) + '...' : str
  }
  return '-'
}

export default function LogsPage() {
  const [typeFilter, setTypeFilter] = useState('')
  const [moduloFilter, setModuloFilter] = useState('')
  const [accionFilter, setAccionFilter] = useState('')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const debouncedSearch = useDebounce(search, 500)
  const debouncedAccion = useDebounce(accionFilter, 500)

  const filters: LogFilters = {}
  if (typeFilter) filters.type = typeFilter
  if (moduloFilter) filters.modulo = moduloFilter
  if (debouncedAccion) filters.accion = debouncedAccion

  const { data: logs, isLoading } = useLogs(filters)

  const itemsPerPage = 10

  const filtered = logs?.filter((log) => {
    const q = debouncedSearch.toLowerCase()
    if (!q) return true
    return (
      log.usuario.toLowerCase().includes(q) ||
      log.accion.toLowerCase().includes(q) ||
      (log.detalles && JSON.stringify(log.detalles).toLowerCase().includes(q)) ||
      (log.mensaje && log.mensaje.toLowerCase().includes(q))
    )
  }) ?? []

  useEffect(() => {
    setCurrentPage(1)
  }, [typeFilter, moduloFilter, debouncedAccion, debouncedSearch])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <div className={styles.spinner} />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.page}
    >
      <div className={styles.header}>
        <ScrollText className={styles.headerIcon} size={28} />
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Logs del Sistema</h1>
          <p className={styles.subtitle}>
            Registro de actividades y eventos del sistema
          </p>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={18} />
          <input
            type="text"
            placeholder="Buscar por usuario, acción o detalle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={styles.select}
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          value={moduloFilter}
          onChange={(e) => setModuloFilter(e.target.value)}
          className={`${styles.select} ${styles.selectWide}`}
        >
          {MODULO_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Filtrar por acción..."
          value={accionFilter}
          onChange={(e) => setAccionFilter(e.target.value)}
          className={styles.accionInput}
        />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Usuario</th>
              <th>Módulo</th>
              <th>Acción</th>
              <th>Detalle</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((log) => (
              <tr key={log.id}>
                <td className={styles.dateCell}>{formatDate(log.createdAt)}</td>
                <td className={styles.userCell}>{log.usuario}</td>
                <td className={styles.moduloCell}>{log.modulo}</td>
                <td className={styles.accionCell}>{log.accion}</td>
                <td className={styles.detailCell} title={renderDetails(log)}>
                  {renderDetails(log)}
                </td>
                <td>
                  <span className={`${styles.badge} ${getTypeClass(inferType(log))}`}>
                    {typeLabels[inferType(log)]}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.emptyState}>
                  {search || typeFilter || moduloFilter || accionFilter
                    ? 'No se encontraron logs con esos filtros'
                    : 'No hay registros de actividad aún'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.pageButton}
          >
            <ChevronLeft size={16} />
          </button>

          <span className={styles.pageInfo}>
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.pageButton}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </motion.div>
  )
}
