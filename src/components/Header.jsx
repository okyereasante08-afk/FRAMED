import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Header.css'

export default function Header(){
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <NavLink to="/" className="logo-mark" onClick={() => setOpen(false)}>
        <span className="dot" />FORGE &amp; FRAME
      </NavLink>

      <button className="nav-toggle" onClick={() => setOpen(o => !o)} aria-label="Toggle menu" aria-expanded={open}>
        {open ? 'Close' : 'Menu'}
      </button>

      <nav className={open ? 'open' : ''}>
        <NavLink to="/about" onClick={() => setOpen(false)}>About</NavLink>
        <NavLink to="/projects" onClick={() => setOpen(false)}>Projects</NavLink>
        <NavLink to="/student-help" onClick={() => setOpen(false)}>Student Help</NavLink>
        <NavLink to="/contact" onClick={() => setOpen(false)}>Contact</NavLink>
      </nav>
    </header>
  )
}
