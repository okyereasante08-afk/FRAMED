import './Footer.css'

export default function Footer(){
  return (
    <footer className="site-footer">
      <span>FORGE &amp; FRAME © {new Date().getFullYear()}</span>
      <span>KNUST / GHANA — CAD · CFD · CAE</span>
    </footer>
  )
}
