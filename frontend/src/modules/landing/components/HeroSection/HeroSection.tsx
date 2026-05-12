import type { Event } from '../../types/event.types'
import { useCountdown } from '../../hooks/useCountdown'
import styles from './HeroSection.module.css'

interface Props {
  evento: Event | null
  onInscribirse: () => void
}

export default function HeroSection({ evento, onInscribirse }: Props) {
  const countdown = useCountdown(
    evento ? (evento.event_date.split('T')[0] + 'T' + (evento.event_time || '00:00')) : '2099-01-01T00:00:00'
  )
  const pad = (n: number) => String(n).padStart(2, '0')

  if (!evento) {
    return (
      <section className={styles.hero}>
        <div className={styles.placeholder}>
          <h1 className={styles.placeholderTitle}>MARATHON</h1>
          <p>No hay eventos activos en este momento</p>
        </div>
      </section>
    )
  }

  const fechaFormateada = new Date(evento.event_date.split('T')[0] + 'T12:00:00').toLocaleDateString('es-CO', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <section className={styles.hero}>
      <div className={styles.bgImage} key={evento.id} style={{ backgroundImage: `url(${evento.image_url || 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1920&q=80'})` }} />
      <div className={styles.overlayGradient} />
      <div className={styles.overlayColor} />

      <div className={styles.content}>
        <p className={styles.eyebrow}>SUPERA TUS LÍMITES</p>
        <h1 className={styles.titulo}>{evento.name}</h1>
        <p className={styles.subtitulo}>{evento.description || evento.location}</p>

        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {fechaFormateada}
          </span>
          <span className={styles.metaSep}>·</span>
          <span className={styles.metaItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            {evento.location}
          </span>
          <span className={styles.metaSep}>·</span>
          <span className={styles.metaItem}>{evento.distance}</span>
        </div>

        {evento.status !== 'finished' && (
          <button className={styles.cta} onClick={onInscribirse}>
            INSCRIBIRME AHORA
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        )}
      </div>

      <div className={styles.bottomBar}>
        {countdown.expired ? (
          <div className={styles.countdownBlock}>
            <p className={styles.countdownLabel}>EVENTO FINALIZADO</p>
            <p className={styles.countdownNum} style={{ fontSize: '1.5rem', color: '#f97316' }}>
              Gracias por participar
            </p>
          </div>
        ) : (
          <div className={styles.countdownBlock}>
            <p className={styles.countdownLabel}>
              {countdown.dias === 0 && countdown.horas === 0 ? '¡ES HOY!' : 'FALTAN PARA LA CARRERA'}
            </p>
            <div className={styles.countdownGrid}>
              <div className={styles.countdownUnit}>
                <span className={styles.countdownNum}>{pad(countdown.dias)}</span>
                <span className={styles.countdownSub}>DÍAS</span>
              </div>
              <div className={styles.countdownUnit}>
                <span className={styles.countdownNum}>{pad(countdown.horas)}</span>
                <span className={styles.countdownSub}>HORAS</span>
              </div>
              <div className={styles.countdownUnit}>
                <span className={styles.countdownNum}>{pad(countdown.minutos)}</span>
                <span className={styles.countdownSub}>MIN</span>
              </div>
              <div className={styles.countdownUnit}>
                <span className={styles.countdownNum}>{pad(countdown.segundos)}</span>
                <span className={styles.countdownSub}>SEG</span>
              </div>
            </div>
          </div>
        )}
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <strong>${evento.price}</strong>
            <span>Inscripción</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <strong>{evento.max_slots === 0 ? 'Ilimitado' : evento.max_slots}</strong>
            <span>Cupos</span>
          </div>
        </div>
      </div>
    </section>
  )
}