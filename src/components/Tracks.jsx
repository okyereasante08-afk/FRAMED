import { useState } from 'react'
import { Link } from 'react-router-dom'
import HoverTileCanvas from './HoverTileCanvas.jsx'
import CadAssembly from './CadAssembly.jsx'
import NozzleFlow from './NozzleFlow.jsx'
import DragPlane from './DragPlane.jsx'
import './Tracks.css'

export default function Tracks(){
  const [activeTrack, setActiveTrack] = useState(null)

  return (
    <section className="tracks" id="tracks">
      <Link
        className={`track cad ${activeTrack === 'cad' ? 'active' : ''}`}
        to="/projects?track=cad"
        onMouseEnter={() => setActiveTrack('cad')}
        onMouseLeave={() => setActiveTrack(null)}
      >
        {activeTrack === 'cad' && (
          <div className="track-3d">
            <HoverTileCanvas accentColor="#5b7fe0">
              <CadAssembly />
            </HoverTileCanvas>
          </div>
        )}
        <span className="track-num mono">01</span>
        <span className="track-tag mono">CAD</span>
        <h3 className="track-title">Structure</h3>
        <p className="track-sub">Parametric solid modeling — components engineered to spec, assembled in real time.</p>
        <span className="track-full mono">EXPLORE CAD →</span>
      </Link>

      <Link
        className={`track cfd ${activeTrack === 'cfd' ? 'active' : ''}`}
        to="/projects?track=cfd"
        onMouseEnter={() => setActiveTrack('cfd')}
        onMouseLeave={() => setActiveTrack(null)}
      >
        {activeTrack === 'cfd' && (
          <div className="track-3d">
            <HoverTileCanvas accentColor="#3b5fcc">
              <NozzleFlow />
            </HoverTileCanvas>
          </div>
        )}
        <span className="track-num mono">02</span>
        <span className="track-tag mono">CFD</span>
        <h3 className="track-title">Flow</h3>
        <p className="track-sub">Wind-tunnel grade fluid dynamics — visualize pressure, drag, and turbulence.</p>
        <span className="track-full mono">EXPLORE CFD →</span>
      </Link>

      <Link
        className={`track cae ${activeTrack === 'cae' ? 'active' : ''}`}
        to="/projects?track=cae"
        onMouseEnter={() => setActiveTrack('cae')}
        onMouseLeave={() => setActiveTrack(null)}
      >
        {activeTrack === 'cae' && (
          <div className="track-3d">
            <HoverTileCanvas accentColor="#a3475a">
              <DragPlane />
            </HoverTileCanvas>
          </div>
        )}
        <span className="track-num mono">03</span>
        <span className="track-tag mono">CAE</span>
        <h3 className="track-title">Drag</h3>
        <p className="track-sub">Aerodynamic load simulation — visualize how airflow and drag shape a design in motion.</p>
        <span className="track-full mono">EXPLORE CAE →</span>
      </Link>
    </section>
  )
}
