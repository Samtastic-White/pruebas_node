import { Download } from 'lucide-react'
import { exportToExcel } from '../utils/exportToExcel'

interface ExportColumn {
  header: string
  key: string
  width: number
}

interface Props {
  data: Record<string, any>[]
  columns: ExportColumn[]
  filename: string
  templateKey: string
  dataStartRow?: number
  disabled?: boolean
  label?: string
}

export default function ExportButton({
  data,
  columns,
  filename,
  templateKey,
  dataStartRow = 5,
  disabled = false,
  label = 'Exportar',
}: Props) {
  const handleExport = async () => {
    if (!data.length) return

    await exportToExcel(data, columns, {
      filename,
      templateKey,
      dataStartRow,
    })
  }

  return (
    <button
      onClick={handleExport}
      disabled={disabled || data.length === 0}
      className="flex items-center gap-1 sm:gap-2 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap disabled:opacity-50"
    >
      <Download size={16} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}