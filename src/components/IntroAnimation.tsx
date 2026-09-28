import { useLayoutEffect, useRef, type RefObject } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import AnimatedLogo from './AnimatedLogo'
import { INTRO } from '../introConfig'

gsap.registerPlugin(Flip)

type Props = {
  headerSlot: RefObject<HTMLElement | null>
  reduced: boolean
  onReveal: () => void
  onDone: () => void
}

export default function IntroAnimation({ headerSlot, reduced, onReveal, onDone }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const overlay = overlayRef.current
    const bg = bgRef.current
    const logo = logoRef.current
    const it = logo?.querySelector('.logo-it-wrap')
    const logy = logo?.querySelector('.logo-logy-wrap')
    const ring = logo?.querySelector('.logo-o')
    const draw = logo?.querySelector('.logo-o-draw') as SVGGeometryElement | null
    const glow = logo?.querySelector('.logo-o-glow')
    const flares = logo?.querySelector('.logo-o-flares')
    const burst = logo?.querySelector('.logo-o-burst')
    if (!overlay || !bg || !logo || !it || !logy || !ring || !draw || !glow || !flares || !burst) {
      onReveal()
      onDone()
      return
    }

    document.documentElement.classList.add('intro-lock')

    let completed = false
    let flipTween: gsap.core.Tween | undefined
    const length = draw.getTotalLength()

    const finish = () => {
      completed = true
      document.documentElement.classList.remove('intro-lock')
      onDone()
    }

    const runFlip = () => {
      if (!headerSlot.current) return
      const tween = Flip.fit(logo, headerSlot.current, {
        duration: INTRO.flipDuration,
        ease: 'power2.inOut',
        scale: true,
        absolute: true,
      })
      if (tween && typeof (tween as gsap.core.Tween).kill === 'function') {
        flipTween = tween as gsap.core.Tween
      }
    }

    const centerShift = (logy.getBoundingClientRect().width - it.getBoundingClientRect().width) / 2
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: finish })
      gsap.set([it, logy], { opacity: 0 })
      gsap.set(it, { x: reduced ? 0 : -88 })
      gsap.set(logy, { x: reduced ? 0 : 88 })
      gsap.set(logo, { x: reduced ? 0 : centerShift })
      gsap.set(draw, { strokeDasharray: length, strokeDashoffset: reduced ? 0 : length })
      gsap.set(glow, { opacity: reduced ? 0.55 : 0 })
      gsap.set(flares, { opacity: reduced ? 1 : 0 })
      gsap.set(burst, { opacity: 0, scale: 0.92, transformOrigin: '126px 40px' })

      if (reduced) {
        ring.classList.add('is-lit')
        tl.to(draw, { strokeDashoffset: 0, duration: 0.2 })
          .to([it, logy], { opacity: 1, x: 0, duration: 0.2 }, 0.1)
          .to(logo, { x: 0, duration: 0.2 }, 0.1)
          .add(runFlip, 0.38)
          .to({}, { duration: 0.35 })
          .add(onReveal, 0.42)
          .to(bg, { opacity: 0, duration: 0.18 }, 0.42)
        return
      }

      tl.to({}, { duration: INTRO.blackHold })
        .to(draw, {
          strokeDashoffset: 0,
          duration: INTRO.ringDuration,
          ease: 'power2.inOut',
        }, INTRO.blackHold)
        .to(glow, { opacity: 0.28, duration: 0.55, ease: 'power1.out' }, INTRO.blackHold + 0.25)
        .add(() => ring.classList.add('is-lit'), 1.28)
        .to(glow, { opacity: 0.85, duration: 0.16, ease: 'power2.out' }, 1.28)
        .to(flares, { opacity: 1, duration: 0.2, ease: 'power2.out' }, 1.28)
        .fromTo(
          burst,
          { opacity: 0.7, scale: 0.94 },
          { opacity: 0, scale: 1.55, duration: 0.55, ease: 'power2.out' },
          1.28,
        )
        .to(glow, { opacity: 0.58, duration: 0.4, ease: 'power1.out' }, 1.46)
        .to(it, { x: 0, opacity: 1, duration: INTRO.lettersDuration, ease: 'power3.out' }, 1.3)
        .to(logy, { x: 0, opacity: 1, duration: INTRO.lettersDuration, ease: 'power3.out' }, 1.3)
        .to(logo, { x: 0, duration: INTRO.lettersDuration, ease: 'power3.out' }, 1.3)
        .to({}, { duration: INTRO.assembledHold })
        .add(runFlip)
        .add(onReveal, 2.9)
        .to(bg, { opacity: 0, duration: 0.45, ease: 'power2.out' }, 3.15)
        .to({}, { duration: 0.25 })
    }, overlay)

    return () => {
      flipTween?.kill()
      if (!completed) ctx.revert()
      document.documentElement.classList.remove('intro-lock')
    }
  }, [headerSlot, onDone, onReveal, reduced])

  return (
    <div className="intro-overlay" ref={overlayRef}>
      <div className="intro-bg" ref={bgRef} />
      <div className="intro-stage">
        <AnimatedLogo ref={logoRef} size="stage" lettersVisible drawn={false} />
      </div>
    </div>
  )
}
