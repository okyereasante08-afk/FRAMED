import { Link } from 'react-router-dom'
import Hero3D from '../components/Hero3D.jsx'
import Tracks from '../components/Tracks.jsx'
import './Home.css'

export default function Home(){
  return (
    <>
      <section className="hero">
        <div className="hero-left">
          <p className="eyebrow mono">Product design engineering — CAD / CFD / CAE</p>
          <h1 className="slogan">
            <span className="line"><span>Excellence</span></span>
            <span className="line"><span>engineered in</span></span>
            <span className="line"><span className="baseline draw">every dimension</span></span>
          </h1>
          <p className="sub-body">Precision, performance, and proven product design.</p>
          <div className="hero-cta">
            <Link to="/projects" className="btn">View our work →</Link>
            <Link to="/contact" className="btn ghost">Start a project</Link>
          </div>
        </div>

        <Hero3D />
      </section>

      <div className="brand-strip">
        <span className="company">© Forge &amp; Frame — Design office, est. Ghana</span>
        <Link to="/projects" className="work-card">
          View our work <span className="arrow">→</span>
        </Link>
      </div>

      <Tracks />

      <div className="marquee-wrap">
        <div className="marquee mono">
          <span>MECHANICAL DESIGN</span><span>FLUID SIMULATION</span><span>STRUCTURAL ANALYSIS</span>
          <span>RAPID PROTOTYPING</span><span>ADDITIVE MANUFACTURING</span><span>REVERSE ENGINEERING</span>
          <span>MECHANICAL DESIGN</span><span>FLUID SIMULATION</span><span>STRUCTURAL ANALYSIS</span>
          <span>RAPID PROTOTYPING</span><span>ADDITIVE MANUFACTURING</span><span>REVERSE ENGINEERING</span>
        </div>
      </div>

      <section className="close-band">
        <h2>Let&apos;s build something that<br />actually <span className="baseline">holds up.</span></h2>
        <div className="close-links">
          <Link to="/projects"><span className="baseline">Projects</span> →</Link>
          <Link to="/about"><span className="baseline">The team</span> →</Link>
          <Link to="/student-help"><span className="baseline">Student deadline?</span> →</Link>
          <Link to="/contact"><span className="baseline">Start a project</span> →</Link>
        </div>
      </section>
    </>
  )
}
