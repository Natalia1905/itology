import LavaBackground from './LavaBackground'

export default function Hero({ ready }: { ready: boolean }) {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <LavaBackground />
      <div className={`hero-copy${ready ? ' show' : ''}`}>
        <h1 id="hero-title">Tecnología que impulsa tu negocio.</h1>
        <p className="hero-lead">Conectamos y automatizamos tu negocio para que opere mejor, venda más y crezca.</p>
        <div className="hero-actions">
          <a className="button button-smoke" href="#contacto">Solicitar consultoría</a>
          <a className="button button-ghost" href="#catalogo">Ver servicios</a>
        </div>
      </div>
    </section>
  )
}
