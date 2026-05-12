import { useState, useEffect } from 'react'

interface Countdown {
  dias: number
  horas: number
  minutos: number
  segundos: number
  expired: boolean
}

export function useCountdown(fechaObjetivo: string): Countdown {
  const calcular = (): Countdown => {

    if (!fechaObjetivo) {
      return { dias: 0, horas: 0, minutos: 0, segundos: 0, expired: true }
    }

    const ahora = new Date().getTime()
    const objetivo = new Date(fechaObjetivo).getTime()
    const diferencia = objetivo - ahora

    if (diferencia <= 0) {
      return { dias: 0, horas: 0, minutos: 0, segundos: 0, expired: true }
    }

    return {
      dias: Math.floor(diferencia / (1000 * 60 * 60 * 24)),
      horas: Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutos: Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60)),
      segundos: Math.floor((diferencia % (1000 * 60)) / 1000),
      expired: false,
    }
  }

  const [countdown, setCountdown] = useState<Countdown>(calcular)

  useEffect(() => {
    setCountdown(calcular())
    const interval = setInterval(() => setCountdown(calcular()), 1000)
    return () => clearInterval(interval)
  }, [fechaObjetivo])

  return countdown
}