import { forwardRef, useId } from 'react'
import { INTRO } from '../introConfig'

type AnimatedLogoProps = {
  size?: 'stage' | 'header'
  lettersVisible?: boolean
  spin?: boolean
  drawn?: boolean
}

const STROKE = {
  fill: 'none',
  stroke: '#fff',
  strokeWidth: 4.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const AnimatedLogo = forwardRef<HTMLDivElement, AnimatedLogoProps>(function AnimatedLogo(
  { size = 'stage', drawn = true },
  ref,
) {
  const rawId = useId().replace(/:/g, '')
  const glow = `o-glow-${rawId}`
  const streak = `o-streak-${rawId}`

  return (
    <div
      ref={ref}
      className={`logo animated-logo is-${size}`}
      data-flip-id="itology-logo"
      aria-label="ITology"
    >
      <svg className="logo-mark" viewBox="0 0 448 80" aria-hidden="true">
        <defs>
          <filter id={glow} x="-90%" y="-90%" width="280%" height="280%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={streak} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={INTRO.colors.electric} stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor={INTRO.colors.electric} stopOpacity="0" />
          </linearGradient>
        </defs>

        <g className="logo-it-wrap" {...STROKE}>
          <path d="M18 14v52" />
          <circle className="logo-glint" cx="18" cy="13" r="1.15" fill={INTRO.colors.electric} stroke="none" />
          <path d="M42 14h36" />
          <path d="M60 20v46" />
          <circle className="logo-glint" cx="42" cy="14" r="0.9" fill={INTRO.colors.electric} stroke="none" />
          <circle className="logo-glint" cx="78" cy="14" r="0.9" fill={INTRO.colors.electric} stroke="none" />
        </g>

        <g className={`logo-o${drawn ? ' is-lit' : ''}`}>
          <circle className="logo-o-glow" cx="126" cy="40" r="28" fill="none" stroke={INTRO.colors.electric} strokeWidth="7" />
          <circle className="logo-o-burst" cx="126" cy="40" r="26" fill="none" stroke={INTRO.colors.pink} strokeWidth="1" />
          <circle
            className="logo-o-draw"
            cx="126"
            cy="40"
            r="26"
            fill="none"
            stroke="#fff"
            strokeWidth="4.4"
            strokeLinecap="round"
            strokeDasharray={drawn ? undefined : '200'}
            strokeDashoffset={drawn ? undefined : '200'}
            filter={`url(#${glow})`}
            transform="rotate(-90 126 40)"
          />
          <g className="logo-o-flares">
            <rect x="118" y="11" width="32" height="1.2" fill={`url(#${streak})`} transform="rotate(22 140 16)" />
            <circle cx="144" cy="18" r="1.8" fill="#fff" />
            <circle cx="144" cy="18" r="3.8" fill={INTRO.colors.electric} opacity="0.45" />
          </g>
        </g>

        <g className="logo-logy-wrap" {...STROKE}>
          <path d="M168 14v52h26" />
          <ellipse cx="244" cy="40" rx="22" ry="26" />
          <path d="M318 14A22 26 0 1 0 340 40" />
          <path d="M340 40h-20" />
          <path d="M366 14l18 28" />
          <path className="logo-y-arm" d="M402 14l-18 28" />
          <path d="M384 42v24" />
          <circle className="logo-glint" cx="402" cy="14" r="1.3" fill={INTRO.colors.electric} stroke="none" />
        </g>
      </svg>
    </div>
  )
})

export default AnimatedLogo
