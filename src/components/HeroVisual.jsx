import './HeroVisual.css'

/**
 * Static, CSS-only hero visual. Replaces the previous React Three Fiber
 * Porsche model + OrbitControls scene, which was the single largest
 * contributor to page weight and lag:
 *   - ~1.35MB JS bundle just for three.js/R3F/drei
 *   - ~13MB of model geometry + textures
 *   - a WebGL canvas that rendered every frame continuously
 *     (frameloop="always"), all the time the page was open, even
 *     scrolled out of view
 * This component is plain HTML/CSS: no JS execution cost, no network
 * weight beyond the page's own stylesheet, nothing rendering when
 * off-screen. The gentle float animation is transform/opacity only
 * (GPU-composited, no layout recalculation) and is already covered by
 * the site-wide prefers-reduced-motion rule in global.css.
 */
export default function HeroVisual(){
  return (
    <div className="hero-visual">
      <div className="hv-grid" />
      <div className="hv-card hv-card-a">
        <span className="hv-tag mono">CAD</span>
        <p className="hv-label">Parametric modeling</p>
      </div>
      <div className="hv-card hv-card-b">
        <span className="hv-tag mono">CFD</span>
        <p className="hv-label">Fluid &amp; thermal simulation</p>
      </div>
      <div className="hv-card hv-card-c">
        <span className="hv-tag mono">CAE</span>
        <p className="hv-label">Structural &amp; stress analysis</p>
      </div>
    </div>
  )
}
