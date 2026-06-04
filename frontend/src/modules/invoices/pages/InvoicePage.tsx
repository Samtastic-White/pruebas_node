import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { useInvoices } from '../hooks/useInvoices'
import { useDebounce } from '../../../shared/hooks/useDebounce'
import ExportButton from '../../../shared/components/ExportButton'
import styles from './InvoicePage.module.css'

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'succeeded', label: 'Completados' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'failed', label: 'Fallidos' },
] as const

const formatCurrency = (cents: number): string => {
  return `$${(cents / 100).toFixed(2)} USD`
}

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-'
  return new Date(dateStr.split('T')[0] + 'T12:00:00').toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getStatusClass = (status: string): string => {
  switch (status) {
    case 'succeeded':
    case 'completed':
      return styles.badgeSuccess
    case 'pending':
      return styles.badgePending
    case 'failed':
    case 'canceled':
      return styles.badgeFailed
    default:
      return ''
  }
}

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'succeeded':
    case 'completed':
      return 'Completado'
    case 'pending':
      return 'Pendiente'
    case 'failed':
      return 'Fallido'
    default:
      return status
  }
}

const truncatePaymentId = (id: string): string => {
  if (!id) return '-'
  return id.length > 16 ? `${id.substring(0, 8)}...${id.slice(-4)}` : id
}

export default function InvoicesPage() {
  const { data: invoices, isLoading } = useInvoices()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const debouncedSearch = useDebounce(search, 500)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 

  const filtered = invoices?.filter((invoice) => {
    const searchLower = debouncedSearch.toLowerCase()
    const matchSearch =
      invoice.full_name.toLowerCase().includes(searchLower) ||
      invoice.dni.includes(debouncedSearch) ||
      invoice.event_name.toLowerCase().includes(searchLower) ||
      invoice.payment_intent_id?.toLowerCase().includes(searchLower)

    const matchStatus =
      statusFilter === 'all' || invoice.payment_status === statusFilter

    return matchSearch && matchStatus
  }) ?? []

  useEffect(() => {
    setCurrentPage(1)
  }, [search, statusFilter])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = filtered.slice(startIndex, endIndex)

  const totalAmount = filtered.reduce((sum, inv) => sum + (inv.amount || 0), 0)

  const exportData = filtered.map((inv) => ({
    'ID Pago': inv.payment_intent_id || '-',
    Corredor: inv.full_name,
    DNI: inv.dni,
    Email: inv.email || '-',
    Evento: inv.event_name,
    Monto: formatCurrency(inv.amount),
    Estado: getStatusLabel(inv.payment_status),
    Fecha: formatDate(inv.paid_at || inv.created_at),
  }))

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
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
        <div>
          <h1 className={styles.title}>Facturas</h1>
          <p className={styles.subtitle}>
            Historial de pagos recibidos vía Stripe
          </p>
        </div>
        <ExportButton
          data={exportData}
          columns={[
            { header: 'ID Pago', key: 'ID Pago', width: 25 },
            { header: 'Corredor', key: 'Corredor', width: 25 },
            { header: 'DNI', key: 'DNI', width: 12 },
            { header: 'Evento', key: 'Evento', width: 25 },
            { header: 'Monto', key: 'Monto', width: 12 },
            { header: 'Estado', key: 'Estado', width: 12 },
            { header: 'Fecha', key: 'Fecha', width: 15 },
          ]}
          filename={`facturas-${new Date().toISOString().split('T')[0]}`}
          templateKey="invoices"
        />
      </div>

      <div className={styles.filters}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={18} />
          <input
            type="text"
            placeholder="Buscar por corredor, DNI, evento o ID de pago..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.select}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.totalBar}>
        <span className={styles.totalLabel}>
          {filtered.length} factura{filtered.length !== 1 ? 's' : ''}
        </span>
        <span className={styles.totalAmount}>
          Total: {formatCurrency(totalAmount)}
        </span>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID Pago</th>
              <th>Corredor</th>
              <th>DNI</th>
              <th>Email</th>
              <th>Evento</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((invoice) => (
              <tr key={invoice.id}>
                <td>
                  <span className={styles.paymentId} title={invoice.payment_intent_id}>
                    {truncatePaymentId(invoice.payment_intent_id)}
                  </span>
                </td>

                <td className={styles.corredorName}>{invoice.full_name}</td>

                <td className={styles.corredorDni}>{invoice.dni}</td>

                <td className={styles.corredorEmail}>{invoice.email || '-'}</td>

                <td className={styles.eventName}>{invoice.event_name}</td>

                <td className={styles.amount}>{formatCurrency(invoice.amount)}</td>

                <td>
                  <span className={`${styles.badge} ${getStatusClass(invoice.payment_status)}`}>
                    {getStatusLabel(invoice.payment_status)}
                  </span>
                </td>

                <td className={styles.date}>
                  {formatDate(invoice.paid_at || invoice.created_at)}
                </td>
                <td className={styles.actionCell}>
                  {invoice.receipt_url ? (
                    <a
                      href={invoice.receipt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.facturaButton}
                    >
                      <ExternalLink size={14} />
                      Factura
                    </a>
                  ) : (
                    <span className={styles.facturaButtonDisabled}>
                      <ExternalLink size={14} />
                      Pendiente
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className={styles.emptyState}>
                  {search || statusFilter !== 'all'
                    ? 'No se encontraron facturas con esos filtros'
                    : 'No hay facturas registradas aún'}
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