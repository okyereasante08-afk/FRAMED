import { useState, useRef, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PROJECTS, TRACK_META } from '../data/projects.js'
import ExplodedViewCanvas from '../components/ExplodedViewCanvas.jsx'
import './Projects.css'

function ProjectCard({ project }){
  const featClass = project.hasExplode ? 'feat-explode' : project.hasWebXR ? 'feat-xr' : ''
  return (
    <a href={`#project-${project.id}`} className={`proj-card ${featClass}`}>
      <div className={`card-bg bg-${project.track}`} />
      <div className="card-scrim" />

      <div className="card-top">
        <span className="track-pill mono">{project.trackLabel}</span>
        <span className="year-tag mono">{project.year}</span>
      </div>

      <div className="card-body">
        <h3>{project.title}</h3>
        <p>{project.blurb}</p>
        <div className="meta-row">
          {project.tags.map(tag => (
            <span key={tag} className="meta-chip">{tag}</span>
          ))}
        </div>
        <div className="card-cta">View Project</div>
      </div>
    </a>
  )
}

export default function Projects(){
  const [searchParams] = useSearchParams()
  const initialTrack = searchParams.get('track')
  const [filter, setFilter] = useState(
    ['cad', 'cfd', 'cae'].includes(initialTrack) ? initialTrack : 'all'
  )
  const galleryRef = useRef(null)

  const filtered = useMemo(
    () => (filter === 'all' ? PROJECTS : PROJECTS.filter(p => p.track === filter)),
    [filter]
  )

  // Lets a normal vertical mouse wheel / trackpad scroll the horizontal
  // gallery while the cursor is over it -- "scroll down to move right"
  // as requested, without hijacking scroll for the rest of the page.
  useEffect(() => {
    const el = galleryRef.current
    if (!el) return
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)){
        el.scrollLeft += e.deltaY
        e.preventDefault()
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  return (
    <>
      <section className="projects-hero">
        <p className="eyebrow mono">SELECTED WORK</p>
        <h1>PROJECTS THAT<br />ACTUALLY SHIPPED.</h1>
        <p>
          A working record of CAD, CFD, and CAE engagements — from parametric
          hardware to full simulation studies. Filter by discipline or scroll
          through everything.
        </p>
      </section>

      <div className="track-filter">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
          ALL WORK ({PROJECTS.length})
        </button>
        {Object.entries(TRACK_META).map(([key, meta]) => (
          <button
            key={key}
            className={filter === key ? 'active' : ''}
            onClick={() => setFilter(key)}
          >
            {meta.label} — {meta.full.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="gallery-wrap">
        <span className="gallery-hint">
          SCROLL TO BROWSE
          <span className="arrow-cue"><span>›</span><span>›</span><span>›</span></span>
        </span>
        <div className="gallery" ref={galleryRef}>
          {filtered.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      <section className="explode-section" id="exploded-view">
        <div className="explode-head">
          <p className="eyebrow mono">CAE — INTERACTIVE</p>
          <h2>WATCH IT COME APART.</h2>
          <p>
            A live, physically-driven exploded view — drag to orbit, use the
            button or slider to blow the assembly apart and watch every
            component find its way home again.
          </p>
        </div>
        <ExplodedViewCanvas />
      </section>

      <section className="xr-section" id="webxr">
        <div className="xr-grid">
          <div className="xr-panel walkthrough">
            <div>
              <span className="tag mono">WEBXR — CAD</span>
              <h3>WALK THROUGH THE BUILDING.</h3>
              <p>
                For architectural work, step inside the model itself.
                First-person navigation, real scale, real light.
              </p>
            </div>
            <button className="btn" disabled title="Requires a real architectural model — connect a project to enable">
              ENTER WALKTHROUGH →
            </button>
          </div>

          <div className="xr-panel ar">
            <div>
              <span className="tag mono">AR — ON-SITE</span>
              <h3>SCAN IT INTO YOUR ROOM.</h3>
              <p>
                Point a phone camera at the QR code below and drop the model
                into your actual living room at true scale.
              </p>
            </div>
            <div className="qr-block">
              <div className="qr-code" aria-hidden="true" />
              <p className="qr-copy">
                QR_CODE.SVG<br />
                LINKS TO /ar/model-viewer<br />
                ACTIVATES ON REAL PROJECT UPLOAD
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
