import { Link } from 'react-router-dom'
import './Tracks.css'

/**
 * Simplified: previously each tile mounted its own WebGL canvas on
 * hover (a wireframe-build animation, a fluid-nozzle simulation, a
 * drag-streamline plane) -- three separate always-rendering 3D scenes.
 * Replaced with plain claymorphic cards and a CSS-only hover lift, per
 * the direction to remove everything contributing to page lag.
 */
export default function Tracks(){
  return (
    <section className="tracks" id="tracks">
      <Link className="track cad" to="/projects?track=cad">
        <span className="track-num mono">01</span>
        <span className="track-tag mono">CAD</span>
        <h3 className="track-title">Structure</h3>
        <p className="track-sub">Parametric solid modeling — components engineered to spec, assembled in real time.</p>
        <span className="track-full mono">EXPLORE CAD →</span>
      </Link>

      <Link className="track cfd" to="/projects?track=cfd">
        <span className="track-num mono">02</span>
        <span className="track-tag mono">CFD</span>
        <h3 className="track-title">Flow</h3>
        <p className="track-sub">Wind-tunnel grade fluid dynamics — visualize pressure, drag, and turbulence.</p>
        <span className="track-full mono">EXPLORE CFD →</span>
      </Link>

      <Link className="track cae" to="/projects?track=cae">
        <span className="track-num mono">03</span>
        <span className="track-tag mono">CAE</span>
        <h3 className="track-title">Drag</h3>
        <p className="track-sub">Aerodynamic load simulation — visualize how airflow and drag shape a design in motion.</p>
        <span className="track-full mono">EXPLORE CAE →</span>
      </Link>
    </section>
  )
}
