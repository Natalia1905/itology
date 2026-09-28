import { useState, type RefObject } from 'react'
import AnimatedLogo from './AnimatedLogo'

type HeaderProps = {
  slotRef: RefObject<HTMLDivElement | null>
  showLogo: boolean
  reveal: boolean
  spin?: boolean
}

export default function Header({ slotRef, showLogo, reveal, spin = true }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className={`site-header${reveal ? ' is-revealed' : ''}`}>
      <a className="brand" href="#inicio" aria-label="ITology, inicio">
        <div className="brand-slot" ref={slotRef}>
          {showLogo ? <AnimatedLogo size="header" lettersVisible spin={spin} /> : null}
        </div>
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="main-nav"
        onClick={() => setOpen((value) => !value)}
      >
        <span /><span /><span />
        <span className="sr-only">Abrir menú</span>
      </button>
      <nav id="main-nav" className={`main-nav${open ? ' open' : ''}`} aria-label="Navegación principal">
        <a href="#catalogo" onClick={close}>Servicios</a>
        <a className="nav-cta-mobile" href="#contacto" onClick={close}>Hablemos</a>
      </nav>
      <a className="nav-highlight" href="#contacto">Hablemos</a>
    </header>
  )
}
