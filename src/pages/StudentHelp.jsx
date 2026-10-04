import { useState } from 'react'
import './StudentHelp.css'

const SYMPTOMS = [
  { mark: '01', text: <>Your mesh keeps <b>failing to converge</b> and the deadline is not moving.</> },
  { mark: '02', text: <>Your simulation results look <b>physically impossible</b> and you don&apos;t know why.</> },
  { mark: '03', text: <>Your advisor wants a <b>finished model</b> and you have a half-built assembly.</> },
  { mark: '04', text: <>You&apos;re presenting in <b>under 48 hours</b> and something is still broken.</> },
]

const URGENCY_LEVELS = [
  { id: 'critical', label: 'Critical', desc: 'Due in <24h' },
  { id: 'urgent', label: 'Urgent', desc: 'Due this week' },
  { id: 'planning', label: 'Planning ahead', desc: 'Due in 2+ weeks' },
]

export default function StudentHelp(){
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', issue: '', urgency: '' })
  const [errors, setErrors] = useState({})

  const update = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors(er => ({ ...er, [field]: undefined }))
  }

  const selectUrgency = (id) => {
    setForm(f => ({ ...f, urgency: id }))
    if (errors.urgency) setErrors(er => ({ ...er, urgency: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const found = {}
    if (!form.name.trim()) found.name = 'Required'
    if (!form.email.trim()) found.email = 'Required'
    if (!form.issue.trim()) found.issue = 'Required'
    if (!form.urgency) found.urgency = 'Select one'
    setErrors(found)
    if (Object.keys(found).length > 0) return
    setSubmitted(true)
  }

  return (
    <>
      <section className="sh-hero">
        <span className="sh-eyebrow">For final-year engineering students</span>
        <h1 className="sh-hook">Mesh failing?<br />Deadline <span className="accent">tomorrow</span>?</h1>
        <p className="sh-subhook">You didn&apos;t break your project. Software does this. What matters now is the next 24 hours.</p>
      </section>

      <section className="sh-symptoms">
        <h2>If any of this sounds familiar, you&apos;re in the right place.</h2>
        <div className="symptom-grid">
          {SYMPTOMS.map(s => (
            <div className="symptom-card" key={s.mark}>
              <span className="mark mono">{s.mark}</span>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="sh-form-section" id="intake-form">
        <div className="sh-form-wrap">
          {submitted ? (
            <div className="sh-success"><div className="mark">✓</div><h3>Intake received.</h3><p>Someone will reach out within a few hours.</p></div>
          ) : (
            <form className="sh-form" onSubmit={handleSubmit} noValidate>
              <div className={`sh-field ${errors.name ? 'has-error' : ''}`}>
                <label htmlFor="sh-name">Full name *</label>
                <input id="sh-name" value={form.name} onChange={update('name')} />
                {errors.name && <span className="err">{errors.name}</span>}
              </div>

              <div className={`sh-field ${errors.email ? 'has-error' : ''}`}>
                <label htmlFor="sh-email">Email *</label>
                <input id="sh-email" type="email" value={form.email} onChange={update('email')} />
                {errors.email && <span className="err">{errors.email}</span>}
              </div>

              <div className={`sh-field ${errors.urgency ? 'has-error' : ''}`}>
                <label>How urgent is this? *</label>
                <div className="urgency-picker">
                  {URGENCY_LEVELS.map(level => (
                    <div
                      key={level.id}
                      className={`urgency-opt ${level.id} ${form.urgency === level.id ? 'selected' : ''}`}
                      onClick={() => selectUrgency(level.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') selectUrgency(level.id) }}
                    >
                      <div className="lvl">{level.label}</div>
                      <div className="desc">{level.desc}</div>
                    </div>
                  ))}
                </div>
                {errors.urgency && <span className="err">{errors.urgency}</span>}
              </div>

              <div className={`sh-field ${errors.issue ? 'has-error' : ''}`}>
                <label htmlFor="sh-issue">What&apos;s broken, specifically? *</label>
                <textarea id="sh-issue" placeholder="e.g. Mesh won't converge on the cooling duct — residuals plateau and won't drop further." value={form.issue} onChange={update('issue')} />
                {errors.issue && <span className="err">{errors.issue}</span>}
              </div>

              <button className="sh-submit" type="submit">Send emergency intake →</button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
