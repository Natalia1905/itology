import { useState } from 'react'
import LavaBackground from './LavaBackground'

function GlassCard({ icon, title, copy, href, label, tall, tone }) {
  return (
    <article className={`glass-card${tall ? ' tall' : ''}${tone ? ` is-${tone}` : ''}`}>
      <span className="card-icon" aria-hidden="true">{icon}</span>
      <h3>{title}</h3>
      {copy ? <p>{copy}</p> : null}
      <a href={href}>{label} →</a>
    </article>
  )
}

export default function PageBody() {
  const [status, setStatus] = useState('')
  const year = new Date().getFullYear()

  const onSubmit = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.checkValidity()) {
      form.reportValidity()
      setStatus('Completa los campos obligatorios para continuar.')
      return
    }
    setStatus('Datos validados. Demostración: no se envía ni guarda tu solicitud.')
  }

  return (
    <>
      <section className="section why" aria-labelledby="why-title">
        <p className="eyebrow">Por qué ITology</p>
        <h2 id="why-title" className="title-row">Un socio técnico que se entiende con tu negocio.</h2>
        <div className="bento">
          <GlassCard
            tall
            icon="⌘"
            title="Implementación a la medida"
            copy="No encajamos tu operación en un paquete genérico. Definimos alcance, prioridades y una solución que sí se usa."
            href="#contacto"
            label="Saber más"
          />
          <GlassCard
            icon="◎"
            title="Continuidad operativa"
            copy="Redes, sistemas y respaldos pensados para que el trabajo diario no se detenga por fallas evitables."
            href="#catalogo"
            label="Saber más"
          />
          <GlassCard
            icon="⬡"
            title="Resultados medibles"
            copy="Cada proyecto deja indicadores claros: tiempos, control, conversión o visibilidad, según el objetivo."
            href="#metodo"
            label="Saber más"
          />
        </div>
      </section>

      <section className="section" id="catalogo" aria-labelledby="services-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Catálogo de soluciones</p>
            <h2 id="services-title" className="title-row">Todo conectado. Un solo equipo.</h2>
          </div>
          <p>Identificamos el punto que frena a tu negocio y construimos una solución útil, medible y fácil de mantener.</p>
        </div>
        <div className="service-grid">
          <GlassCard icon="01" title="Redes" copy="Diseño, instalación y optimización de redes seguras y estables para conectar equipos, personas y sedes." href="#contacto" label="Consultar" />
          <GlassCard tone="lilac" icon="02" title="Sistemas" copy="Soporte y administración tecnológica para que tu operación avance sin interrupciones innecesarias." href="#contacto" label="Consultar" />
          <GlassCard icon="03" title="Páginas web" copy="Sitios rápidos, claros y responsivos que convierten tu presencia digital en una herramienta comercial." href="#contacto" label="Consultar" />
          <GlassCard tone="lilac" icon="04" title="Agentes de IA" copy="Automatizaciones inteligentes que responden, organizan información y ejecutan tareas repetitivas." href="#contacto" label="Consultar" />
          <GlassCard icon="05" title="Inventarios" copy="Control de existencias, movimientos y alertas para decidir con información confiable." href="#contacto" label="Consultar" />
          <GlassCard tone="lilac" icon="06" title="Plan de marketing" copy="Estrategias digitales conectadas a objetivos, audiencias y métricas que sí importan." href="#contacto" label="Consultar" />
        </div>
      </section>

      <section className="section" id="metodo" aria-labelledby="method-title">
        <p className="eyebrow">Cómo trabajamos</p>
        <h2 id="method-title" className="title-row">El proceso</h2>
        <p className="section-lead">Tres etapas claras. Cada una deja un entregable y una siguiente decisión.</p>
        <div className="bento">
          <GlassCard tall icon="01" title="Escuchamos" copy="Entendemos tu operación, tus retos y la meta que quieres alcanzar." href="#contacto" label="Agendar diagnóstico" />
          <GlassCard icon="02" title="Diseñamos e implementamos" copy="Definimos alcance, construimos por etapas y validamos contigo sin frenar el negocio." href="#contacto" label="Saber más" />
          <GlassCard icon="03" title="Mejoramos" copy="Medimos, damos soporte y evolucionamos la solución cuando tu empresa lo necesita." href="#contacto" label="Saber más" />
        </div>
      </section>

      <section className="section" id="nosotros" aria-labelledby="about-title">
        <p className="eyebrow">La idea detrás de ITology</p>
        <div className="quote-banner glass-card">
          <blockquote>
            <h2 id="about-title" className="title-row">“Tu negocio entiende su operación. Nosotros, la tecnología.”</h2>
            <p className="section-lead">“Cerramos la distancia entre una necesidad de negocio y una solución tecnológica que de verdad se usa.”</p>
          </blockquote>
        </div>
      </section>

      <section className="section faq" id="faq" aria-labelledby="faq-title">
        <p className="eyebrow">Preguntas frecuentes</p>
        <h2 id="faq-title" className="title-row">Antes de escribirnos</h2>
        <div className="faq-list">
          <details>
            <summary>¿El primer diagnóstico tiene costo?</summary>
            <p>El primer contacto sirve para entender el reto y proponerte una ruta realista, sin compromiso. Si el proyecto avanza, el alcance y la inversión quedan por escrito.</p>
          </details>
          <details>
            <summary>¿Trabajan con empresas que no tienen área de TI?</summary>
            <p>Sí. Justamente para eso existe ITology: traducir la necesidad del negocio a una solución técnica que el equipo pueda usar y mantener.</p>
          </details>
          <details>
            <summary>¿Pueden intervenir solo en un área, por ejemplo la web?</summary>
            <p>Sí. Podemos resolver un punto puntual o conectar varias piezas. Lo definimos según el diagnóstico, no con un paquete cerrado.</p>
          </details>
        </div>
      </section>

      <section className="cta-band" id="contacto" aria-labelledby="contact-title">
        <p className="eyebrow">Siguiente paso</p>
        <h2 id="contact-title" className="title-row">¿Listo para hacer más simple lo que hoy se traba?</h2>
        <p className="section-lead">Cuéntanos el reto. Te proponemos una ruta clara, con alcance y siguientes pasos.</p>
        <form className="contact-form glass-card" onSubmit={onSubmit} noValidate>
          <div className="form-row">
            <label>Nombre<input type="text" name="nombre" autoComplete="name" required placeholder="Tu nombre" /></label>
            <label>Empresa<input type="text" name="empresa" autoComplete="organization" placeholder="Nombre de tu negocio" /></label>
          </div>
          <div className="form-row">
            <label>Correo<input type="email" name="correo" autoComplete="email" required placeholder="nombre@empresa.com" /></label>
            <label>Número<input type="tel" name="numero" autoComplete="tel" placeholder="Tu número" /></label>
          </div>
          <label>¿En qué podemos ayudarte?
            <select name="servicio" required defaultValue="">
              <option value="">Selecciona un servicio</option>
              <option>Redes</option>
              <option>Sistemas</option>
              <option>Páginas web</option>
              <option>Agentes de IA</option>
              <option>Inventarios</option>
              <option>Plan de marketing</option>
              <option>Otro</option>
            </select>
          </label>
          <label>Cuéntanos brevemente<textarea name="mensaje" rows="4" required placeholder="¿Qué reto quieres resolver?" /></label>
          <button className="button button-ghost form-submit" type="submit">Enviar solicitud</button>
          <p className="form-status" role="status" aria-live="polite">{status}</p>
        </form>
      </section>

      <footer className="site-footer">
        <LavaBackground variant="footer" />
        <a className="footer-brand" href="#inicio" aria-label="ITology, volver al inicio">
          <img src="/assets/itology-logo-clear.png" alt="ITology" width="140" height="26" />
        </a>
        <p>Tecnología para empresas que quieren avanzar con orden.</p>
        <nav className="footer-links" aria-label="Pie de página">
          <a href="#catalogo">Servicios</a>
          <a href="#metodo">Método</a>
          <a href="#faq">FAQ</a>
          <a href="#contacto">Contacto</a>
        </nav>
        <small>© {year} ITology</small>
      </footer>
    </>
  )
}
