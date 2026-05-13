import ExcelJS from 'exceljs'

interface ColumnDef {
  header: string
  key: string
  width: number
}

interface ExportOptions {
  filename: string
  sheetName?: string
  templateKey?: string
  dataStartRow?: number 
  title?: string
}

const TEMPLATES: Record<string, string> = {
  events: '/templates/events/template_events.xlsx',
  //registrations: '/templates/registrations/template_registrations.xlsx',
  //runners: '/templates/runners/template_runners.xlsx',
}

export async function exportToExcel<T extends Record<string, any>>(
  data: T[],
  columns: ColumnDef[],
  options: ExportOptions
) {
  if (!data || data.length === 0) {
    console.warn('No hay datos para exportar')
    return
  }

  let workbook!: ExcelJS.Workbook
  let worksheet!: ExcelJS.Worksheet
  let initial = 4

  const templatePath = options.templateKey ? TEMPLATES[options.templateKey] : null

  if (templatePath) {
    const response = await fetch(templatePath)
    const arrayBuffer = await response.arrayBuffer()
    workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(arrayBuffer)
    worksheet = workbook.worksheets[0]
    if (!worksheet) {
      throw new Error('No se encontró ninguna hoja en la plantilla')
    }
  }

  data.forEach((item, index) => {
    initial = initial + 1
    const row = worksheet.getRow(initial)
    
    row.getCell(1).value = index + 1
    
    columns.forEach((col, i) => {
      row.getCell(i + 2).value = item[col.key] || ''
    })
    
    row.height = 25
    row.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF333333' } },
        left: { style: 'thin', color: { argb: 'FF333333' } },
        bottom: { style: 'thin', color: { argb: 'FF333333' } },
        right: { style: 'thin', color: { argb: 'FF333333' } },
      }
    })
  })

  worksheet.getColumn(1).width = 5
  columns.forEach((col, i) => {
    worksheet.getColumn(i + 2).width = col.width
  })

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${options.filename}.xlsx`
  a.click()
  URL.revokeObjectURL(url)
}