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
        {open ? 'CLOSE' : 'MENU'}
      </button>

      <nav className={open ? 'open' : ''}>
        <NavLink to="/about" onClick={() => setOpen(false)}>ABOUT</NavLink>
        <NavLink to="/projects" onClick={() => setOpen(false)}>PROJECTS</NavLink>
        <NavLink to="/student-help" onClick={() => setOpen(false)}>STUDENT HELP</NavLink>
        <NavLink to="/contact" onClick={() => setOpen(false)}>CONTACT</NavLink>
      </nav>
    </header>
  )
}
