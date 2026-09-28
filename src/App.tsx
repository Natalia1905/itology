import { useCallback, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import Header from './components/Header'
import Hero from './components/Hero'
import PageBody from './components/PageBody.jsx'
import IntroAnimation from './components/IntroAnimation'
import useIntroSession from './hooks/useIntroSession'
import './index.css'
import './styles/intro.css'
import 'lenis/dist/lenis.css'

function isHomeHash(hash: string) {
  return hash === '' || hash === '#' || hash === '#inicio' || hash === '#contenido'
}

export default function App() {
  const headerSlot = useRef<HTMLDivElement>(null)
  const session = useIntroSession()
  const [introKey, setIntroKey] = useState(0)
  const [introDone, setIntroDone] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const onReveal = useCallback(() => setRevealed(true), [])
  const finishIntro = useCallback(() => {
    setRevealed(true)
    setIntroDone(true)
  }, [])

  const lenisRef = useRef<Lenis | null>(null)

  const restartIntro = useCallback(() => {
    window.scrollTo(0, 0)
    document.documentElement.classList.add('intro-lock')
    setRevealed(false)
    setIntroDone(false)
    setIntroKey((value) => value + 1)
  }, [])

  const scrollToId = useCallback((id: string) => {
    const target = document.getElementById(id)
    if (!target) return false
    const lenis = lenisRef.current
    if (lenis) {
      lenis.start()
      lenis.scrollTo(target, { duration: 1.15, offset: 0 })
    } else {
      target.scrollIntoView({ behavior: 'smooth' })
    }
    return true
  }, [])

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true })
    lenisRef.current = lenis
    if (!introDone) lenis.stop()
    else lenis.start()

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(frame)
      if (lenisRef.current === lenis) lenisRef.current = null
      lenis.destroy()
    }
  }, [introDone])

  useEffect(() => {
    const onAnchorClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest('a[href^="#"]')
      if (!link) return
      const href = link.getAttribute('href') || ''
      if (isHomeHash(href)) {
        event.preventDefault()
        restartIntro()
        return
      }
      const id = href.slice(1)
      if (!id || !document.getElementById(id)) return
      event.preventDefault()
      history.pushState(null, '', href)
      scrollToId(id)
    }

    const onHashChange = () => {
      if (isHomeHash(window.location.hash)) restartIntro()
    }

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) restartIntro()
    }

    document.addEventListener('click', onAnchorClick)
    window.addEventListener('hashchange', onHashChange)
    window.addEventListener('pageshow', onPageShow)

    const navigation = (window as Window & {
      navigation?: {
        addEventListener: (name: string, handler: (event: NavigateEventLike) => void) => void
        removeEventListener: (name: string, handler: (event: NavigateEventLike) => void) => void
      }
    }).navigation

    const onNavigate = (event: NavigateEventLike) => {
      if (!event.canIntercept || event.downloadRequest || event.formData) return
      if (event.navigationType === 'push') return
      let dest: URL
      try {
        dest = new URL(event.destination.url)
      } catch {
        return
      }
      if (dest.origin !== window.location.origin || dest.pathname !== window.location.pathname) return
      if (event.navigationType !== 'reload' && !isHomeHash(dest.hash)) return

      event.intercept({
        handler: async () => {
          restartIntro()
        },
      })
    }

    navigation?.addEventListener('navigate', onNavigate)

    return () => {
      document.removeEventListener('click', onAnchorClick)
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('pageshow', onPageShow)
      navigation?.removeEventListener('navigate', onNavigate)
    }
  }, [restartIntro, scrollToId])

  return (
    <>
      {!introDone && (
        <IntroAnimation
          key={introKey}
          headerSlot={headerSlot}
          reduced={session.reduced}
          onReveal={onReveal}
          onDone={finishIntro}
        />
      )}
      <Header slotRef={headerSlot} showLogo={introDone} reveal={revealed} spin={!session.reduced} />
      <main id="contenido" className={introDone ? 'is-ready' : 'is-waiting'}>
        <Hero ready={revealed} />
        <PageBody />
      </main>
    </>
  )
}

type NavigateEventLike = {
  canIntercept: boolean
  downloadRequest?: unknown
  formData?: unknown
  navigationType?: string
  destination: { url: string }
  intercept: (options: { handler: () => Promise<void> }) => void
}
