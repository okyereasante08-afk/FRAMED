import { useEffect, useRef, useState } from 'react'
import { TEAM } from '../data/team.js'
import './About.css'

const STAT_LABELS = { cad: 'CAD', cfd: 'CFD', cae: 'CAE', speed: 'SPD' }

function TeamCard({ member }){
  const cardRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting){
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const initials = member.name.split(' ').map(w => w[0]).slice(0, 2).join('')

  return (
    <div className="team-card" ref={cardRef}>
      <div className="tc-portrait">
        {member.photo ? (
          <img src={member.photo} alt={member.name} />
        ) : (
          <div className="avatar-fallback">{initials}</div>
        )}
        <span className="tc-level mono">{member.level}</span>
        <span className={`tc-track-badge ${member.track} mono`}>{member.track.toUpperCase()}</span>
        <div className="tc-name-plate">
          <h3>{member.name}</h3>
          <p className="role">{member.role}</p>
        </div>
      </div>

      <div className="tc-body">
        <div className="tc-attr-row">
          <span className="k mono">SPECIALTY</span>
          <span className="v">{member.specialty}</span>
        </div>
        <div className="tc-attr-row weakness">
          <span className="k mono">WEAKNESS</span>
          <span className="v">{member.weakness}</span>
        </div>

        <div className="tc-stats">
          {Object.entries(member.stats).map(([key, val]) => (
            <div
              key={key}
              className={`tc-stat ${visible ? 'fill-in' : ''}`}
              style={{ '--stat-val': `${val}%` }}
            >
              <span className="label mono">{STAT_LABELS[key]}</span>
              <div className="track-bar">
                <div className={`fill ${key}`} />
              </div>
              <span className="val mono">{val}</span>
            </div>
          ))}
        </div>

        <div className="tc-handles">
          {member.handles.map(h => (
            <a key={h.label} href={h.url} target="_blank" rel="noreferrer">
              {h.label.toUpperCase()} ↗
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function About(){
  return (
    <>
      <section className="about-hero">
        <p className="eyebrow mono">THE ROSTER</p>
        <h1>MEET THE TEAM<br />BEHIND THE MODELS.</h1>
        <p>
          Engineers, not mascots. Stats are earned, weaknesses are real, and
          every one of us picks up sessions with students.
        </p>
      </section>

      <section className="team-grid">
        {TEAM.map(member => (
          <TeamCard key={member.id} member={member} />
        ))}
      </section>

      <section className="about-body-band">
        <h2>WE MENTOR AS MUCH AS WE BUILD.</h2>
        <div className="copy">
          <p>
            Forge &amp; Frame started as a way to make real CAD, CFD, and CAE
            practice accessible outside the classroom. Every project we ship
            feeds back into how we teach — and every mentorship session
            sharpens how we build.
          </p>
          <p>
            If your mesh is failing and your deadline isn&apos;t moving, the
            team above is who shows up.
          </p>
        </div>
      </section>
    </>
  )
}
