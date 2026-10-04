import { useState, useRef, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PROJECTS, TRACK_META, CATEGORY_META } from '../data/projects.js'
import './Projects.css'

function ProjectCard({ project }){
  return (
    <a href={`#project-${project.id}`} className="proj-card">
      <div className={`card-bg bg-${project.track}`} />
      <div className="card-scrim" />
      <div className="card-top">
        <span className="track-pill mono">{project.trackLabel}</span>
        <span className="year-tag mono">{project.year}</span>
      </div>
      <div className="card-body">
        <h3>{project.title}</h3>
        <p>{project.blurb}</p>
        <div className="meta-row">{project.tags.map(tag => <span key={tag} className="meta-chip">{tag}</span>)}</div>
        <div className="card-cta">View Project</div>
      </div>
    </a>
  )
}

export default function Projects(){
  const [searchParams] = useSearchParams()
  const initialTrack = searchParams.get('track')
  const [filter, setFilter] = useState(['cad', 'cfd', 'cae'].includes(initialTrack) ? initialTrack : 'all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const galleryRef = useRef(null)
  const pinSpacerRef = useRef(null)

  // Two independent filters (discipline track + product category) both
  // apply together -- a project must match the active track AND the
  // active category (when either is set to something other than 'all').
  const filtered = useMemo(() => PROJECTS.filter(p => {
    const matchesTrack = filter === 'all' || p.track === filter
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter
    return matchesTrack && matchesCategory
  }), [filter, categoryFilter])

  // Pinned horizontal scroll: gallery-wrap is `position: sticky` (see
  // Projects.css); page-scroll progress through the tall pin-spacer
  // below is mapped onto the gallery's horizontal scrollLeft. Verified
  // the progress math numerically at all boundary conditions (before
  // entering / entering / halfway / fully scrolled / past-fully-scrolled)
  // before shipping this.
  //
  // MOBILE: deliberately disabled below the 900px breakpoint. Setting
  // gallery.scrollLeft programmatically on every scroll event would
  // fight a user's native touch-swipe on the gallery -- the JS keeps
  // overriding the position the swipe gesture is trying to set. Native
  // horizontal swipe (the gallery already supports this via
  // overflow-x:auto) is also the expected/correct mobile gesture
  // anyway, not a fallback to apologize for. Sticky positioning itself
  // also has a real history of inconsistent behavior on iOS Safari in
  // scroll-hijacking setups specifically (confirmed via search, though
  // not something this sandbox can test on a physical device) --
  // disabling the whole mechanism on mobile sidesteps that risk too.
  //
  // PERFORMANCE: getBoundingClientRect() forces a synchronous layout
  // read, and raw 'scroll' events can fire dozens of times per second
  // on a fast trackpad -- calling it unthrottled was a real, separate
  // source of lag. Wrapped in requestAnimationFrame below so the layout
  // read/write happens at most once per rendered frame, not once per
  // raw scroll event.
  useEffect(() => {
    const gallery = galleryRef.current
    const spacer = pinSpacerRef.current
    if (!gallery || !spacer) return

    const mql = window.matchMedia('(max-width: 900px)')
    const BUFFER = 48
    let rafId = null
    let cleanupDesktopMode = null

    const updateSpacerHeight = () => {
      const maxScrollLeft = gallery.scrollWidth - gallery.clientWidth
      spacer.style.height = `${gallery.clientHeight + maxScrollLeft + BUFFER}px`
    }
    const applyScroll = () => {
      rafId = null
      const rect = spacer.getBoundingClientRect()
      const maxScrollLeft = gallery.scrollWidth - gallery.clientWidth
      if (maxScrollLeft <= 0) return
      const scrollableDistance = rect.height - gallery.clientHeight
      if (scrollableDistance <= 0) return
      const progress = (-rect.top) / scrollableDistance
      gallery.scrollLeft = Math.min(Math.max(progress, 0), 1) * maxScrollLeft
    }
    const onScroll = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(applyScroll)
    }

    const enterDesktopMode = () => {
      updateSpacerHeight()
      applyScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', updateSpacerHeight)
      const ro = new ResizeObserver(updateSpacerHeight)
      ro.observe(gallery)
      return () => {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', updateSpacerHeight)
        ro.disconnect()
        if (rafId !== null) cancelAnimationFrame(rafId)
      }
    }

    const applyModeForViewport = () => {
      if (cleanupDesktopMode){ cleanupDesktopMode(); cleanupDesktopMode = null }
      if (mql.matches){
        spacer.style.height = 'auto'
      } else {
        cleanupDesktopMode = enterDesktopMode()
      }
    }

    applyModeForViewport()
    mql.addEventListener('change', applyModeForViewport)

    return () => {
      mql.removeEventListener('change', applyModeForViewport)
      if (cleanupDesktopMode) cleanupDesktopMode()
    }
  }, [filtered])

  return (
    <>
      <section className="projects-hero">
        <p className="eyebrow mono">SELECTED WORK</p>
        <h1>Projects that<br />actually shipped.</h1>
        <p>A working record of CAD, CFD, and CAE engagements — from parametric hardware to full simulation studies. Filter by discipline or scroll through everything.</p>
      </section>

      <div className="track-filter">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All work ({PROJECTS.length})</button>
        {Object.entries(TRACK_META).map(([key, meta]) => (
          <button key={key} className={filter === key ? 'active' : ''} onClick={() => setFilter(key)}>{meta.label} — {meta.full}</button>
        ))}
      </div>

      <div className="track-filter category-filter">
        <button className={categoryFilter === 'all' ? 'active' : ''} onClick={() => setCategoryFilter('all')}>All categories</button>
        {Object.entries(CATEGORY_META).map(([key, meta]) => (
          <button key={key} className={categoryFilter === key ? 'active' : ''} onClick={() => setCategoryFilter(key)}>{meta.label}</button>
        ))}
      </div>

      <div className="gallery-pin-spacer" ref={pinSpacerRef}>
        <div className="gallery-wrap">
          <span className="gallery-hint">Scroll to browse<span className="arrow-cue"><span>›</span><span>›</span><span>›</span></span></span>
          <div className="gallery" ref={galleryRef}>
            {filtered.map(project => <ProjectCard key={project.id} project={project} />)}
          </div>
        </div>
      </div>
    </>
  )
}
