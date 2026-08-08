import { Link } from 'react-router-dom'
import Hero3D from '../components/Hero3D.jsx'
import Tracks from '../components/Tracks.jsx'
import './Home.css'

export default function Home(){
  return (
    <>
      <section className="hero">
        <div className="hero-left">
          <p className="eyebrow mono">PRODUCT DESIGN ENGINEERING — CAD / CFD / CAE</p>
          <h1 className="slogan">
            <span className="line"><span>EXCELLENCE</span></span>
            <span className="line"><span>ENGINEERED IN</span></span>
            <span className="line"><span className="baseline draw">EVERY DIMENSION</span></span>
          </h1>
          <p className="sub-body">Precision, performance, and proven product design.</p>
          <div className="hero-cta">
            <Link to="/projects" className="btn">View Our Work →</Link>
            <Link to="/contact" className="btn ghost">Start a Project</Link>
          </div>
        </div>

        <Hero3D />
      </section>

      <div className="brand-strip">
        <span className="company mono">© FORGE &amp; FRAME — DESIGN OFFICE, EST. GHANA</span>
        <Link to="/projects" className="work-card">
          VIEW OUR WORK <span className="arrow">→</span>
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
        <h2>LET&apos;S BUILD SOMETHING THAT<br />ACTUALLY <span className="baseline">HOLDS UP.</span></h2>
        <div className="close-links">
          <Link to="/projects"><span className="baseline">PROJECTS</span> →</Link>
          <Link to="/about"><span className="baseline">THE TEAM</span> →</Link>
          <Link to="/student-help"><span className="baseline">STUDENT DEADLINE?</span> →</Link>
          <Link to="/contact"><span className="baseline">START A PROJECT</span> →</Link>
        </div>
      </section>
    </>
  )
}
