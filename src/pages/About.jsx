import { useState } from 'react'
import { TEAM, STATUS_META } from '../data/team.js'
import './About.css'

function StatusDot({ status }){
  const meta = STATUS_META[status]
  return (
    <span className="status-dot-wrap">
      <span className="status-dot" style={{ background: meta.color }} />
      <span className="status-label mono">{meta.label}</span>
    </span>
  )
}

export default function About(){
  const [selectedId, setSelectedId] = useState(TEAM[0]?.id ?? null)
  const selected = TEAM.find(m => m.id === selectedId)

  return (
    <>
      <section className="about-hero">
        <p className="eyebrow mono">THE ROSTER</p>
        <h1>Meet the team<br />behind the models.</h1>
        <p>Engineers, not mascots. Select someone below to see their focus, availability, and how to reach them.</p>
      </section>

      <section className="team-selector">
        <div className="team-list">
          {TEAM.map(member => (
            <button
              key={member.id}
              className={`team-list-item ${member.id === selectedId ? 'active' : ''}`}
              onClick={() => setSelectedId(member.id)}
              type="button"
            >
              <span className="tli-photo">
                <img src={member.photo} alt="" />
                <span className="tli-dot" style={{ background: STATUS_META[member.status].color }} />
              </span>
              <span className="tli-text">
                <span className="tli-name">{member.name}</span>
                <span className="tli-role">{member.role}</span>
              </span>
            </button>
          ))}
        </div>

        {selected && (
          <div className="team-detail">
            <div className="td-photo">
              <img src={selected.photo} alt={selected.name} />
            </div>
            <div className="td-body">
              <StatusDot status={selected.status} />
              <h2 className="td-name">{selected.name}</h2>
              <p className="td-role">{selected.role}</p>

              <div className="td-specialties">
                {selected.specialties.map(s => <span key={s} className="td-chip">{s}</span>)}
              </div>

              <div className="td-contact">
                <a href={selected.linkedin} target="_blank" rel="noreferrer" className="td-contact-link">
                  <span className="mono">LinkedIn</span>
                  <span className="td-contact-value">{selected.linkedin.replace('https://www.', '')}</span>
                </a>
                <a href={`mailto:${selected.email}`} className="td-contact-link">
                  <span className="mono">Email</span>
                  <span className="td-contact-value">{selected.email}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="about-body-band">
        <h2>We mentor as much as we build.</h2>
        <div className="copy">
          <p>Forge &amp; Frame started as a way to make real CAD, CFD, and CAE practice accessible outside the classroom. Every project we ship feeds back into how we teach — and every mentorship session sharpens how we build.</p>
          <p>If your mesh is failing and your deadline isn&apos;t moving, the team above is who shows up.</p>
        </div>
      </section>
    </>
  )
}
