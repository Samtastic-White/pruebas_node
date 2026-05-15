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
  registrations: '/templates/registrations/template_registrations.xlsx',
  runners: '/templates/runners/template_runners.xlsx',
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
    try {
      const response = await fetch(templatePath)
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer()
        workbook = new ExcelJS.Workbook()
        await workbook.xlsx.load(arrayBuffer)
        worksheet = workbook.worksheets[0]
      }
    } catch (error) {
      console.warn('No se pudo cargar la plantilla, creando desde cero')
    }
  }

  if (!worksheet) {
    workbook = new ExcelJS.Workbook()
    worksheet = workbook.addWorksheet(options.sheetName || 'Datos')
    
    worksheet.mergeCells(`A1:${String.fromCharCode(64 + columns.length + 1)}1`)
    const logoRow = worksheet.getRow(1)
    logoRow.getCell(1).value = 'MARATHON'
    logoRow.getCell(1).font = { bold: true, size: 18, color: { argb: 'FFF97316' } }
    logoRow.height = 35
    logoRow.alignment = { vertical: 'middle', horizontal: 'center' }
    
    worksheet.getRow(2).height = 8
    
    worksheet.mergeCells(`A3:${String.fromCharCode(64 + columns.length + 1)}3`)
    const titleRow = worksheet.getRow(3)
    titleRow.getCell(1).value = options.title || `REPORTE - ${new Date().toLocaleDateString('es-CO')}`
    titleRow.getCell(1).font = { bold: true, size: 12, color: { argb: 'FF333333' } }
    titleRow.height = 28
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
    
    const headerRow = worksheet.getRow(4)
    headerRow.getCell(1).value = '#'
    columns.forEach((col, i) => {
      headerRow.getCell(i + 2).value = col.header
    })
    headerRow.height = 30
    
    for (let col = 1; col <= columns.length + 1; col++) {
      const cell = headerRow.getCell(col)
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF97316' } }
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF333333' } },
        left: { style: 'thin', color: { argb: 'FF333333' } },
        bottom: { style: 'thin', color: { argb: 'FF333333' } },
        right: { style: 'thin', color: { argb: 'FF333333' } },
      }
    }
    
    initial = 4
  }

  data.forEach((item, index) => {
    initial = initial + 1
    const row = worksheet.getRow(initial)

    row.getCell(1).value = index + 1

    columns.forEach((col, i) => {
      row.getCell(i + 2).value = item[col.key] || ''
    })

    row.height = 25

    for (let col = 1; col <= columns.length + 1; col++) {
      const cell = row.getCell(col)
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF333333' } },
        left: { style: 'thin', color: { argb: 'FF333333' } },
        bottom: { style: 'thin', color: { argb: 'FF333333' } },
        right: { style: 'thin', color: { argb: 'FF333333' } },
      }
    }
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