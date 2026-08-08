import { useState } from 'react'
import './StudentHelp.css'

const SYMPTOMS = [
  { mark: '01', text: <>Your mesh keeps <b>failing to converge</b> and the deadline is not moving.</> },
  { mark: '02', text: <>Your simulation results look <b>physically impossible</b> and you don&apos;t know why.</> },
  { mark: '03', text: <>Your advisor wants a <b>finished model</b> and you have a half-built assembly.</> },
  { mark: '04', text: <>You&apos;re presenting in <b>under 48 hours</b> and something is still broken.</> },
]

const URGENCY_LEVELS = [
  { id: 'critical', label: 'CRITICAL', desc: 'DUE IN <24H' },
  { id: 'urgent', label: 'URGENT', desc: 'DUE THIS WEEK' },
  { id: 'planning', label: 'PLANNING AHEAD', desc: 'DUE IN 2+ WEEKS' },
]

const EMPTY_FORM = {
  name: '',
  email: '',
  school: '',
  deadline: '',
  urgency: '',
  software: '',
  issue: '',
}

function validate(form, tab){
  const errors = {}
  if (!form.name.trim()) errors.name = 'Required'
  if (!form.email.trim()) errors.email = 'Required'
  else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email'
  if (!form.school.trim()) errors.school = 'Required'
  if (tab === 'emergency'){
    if (!form.urgency) errors.urgency = 'Select one'
    if (!form.deadline.trim()) errors.deadline = 'Required'
  }
  if (!form.issue.trim() || form.issue.trim().length < 10){
    errors.issue = 'Give us at least a sentence — the more specific, the faster we can help'
  }
  return errors
}

export default function StudentHelp(){
  const [tab, setTab] = useState('emergency')
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

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
    const foundErrors = validate(form, tab)
    setErrors(foundErrors)
    if (Object.keys(foundErrors).length > 0) return

    setSubmitting(true)
    // NOTE: wire this to your real intake endpoint / form service
    // (e.g. Formspree, a serverless function, or email API) when ready.
    // Simulated latency below so the submit state is honest about not
    // being connected to a backend yet.
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 700)
  }

  if (submitted){
    return (
      <section className="sh-form-section">
        <div className="sh-form-wrap">
          <div className="sh-success">
            <div className="mark">✓</div>
            <h3>INTAKE RECEIVED.</h3>
            <p>
              {tab === 'emergency'
                ? "This is flagged high priority. Someone from the team will reach out within a few hours — check the email you gave us."
                : "Thanks — we'll follow up by email to get a session on the calendar."}
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="sh-hero">
        <span className="sh-siren mono"><span className="dot" />INTAKE LINE OPEN</span>

        <span className="sh-eyebrow">FOR FINAL-YEAR ENGINEERING STUDENTS</span>

        <h1 className="sh-hook">
          MESH FAILING?<br />
          DEADLINE <span className="accent">TOMORROW</span>?
        </h1>

        <p className="sh-subhook">
          You didn&apos;t break your project. Software does this. <b>What matters now
          is the next 24 hours</b> — and we&apos;ve spent enough of ours in this exact
          seat to get you unstuck fast.
        </p>

        <div className="sh-cta-row">
          <a href="#intake-form" className="sh-cta-primary">
            START EMERGENCY INTAKE →
          </a>
        </div>

        <div className="sh-proof-row">
          <div className="sh-proof-stat">
            <div className="num">24H</div>
            <div className="lbl">TYPICAL RESPONSE, CRITICAL TIER</div>
          </div>
          <div className="sh-proof-stat">
            <div className="num">CAD/CFD/CAE</div>
            <div className="lbl">ALL THREE DISCIPLINES COVERED</div>
          </div>
          <div className="sh-proof-stat">
            <div className="num">1-ON-1</div>
            <div className="lbl">ACTUAL ENGINEERS, NOT A TICKET QUEUE</div>
          </div>
        </div>
      </section>

      <section className="sh-symptoms">
        <h2>IF ANY OF THIS SOUNDS FAMILIAR, YOU&apos;RE IN THE RIGHT PLACE.</h2>
        <div className="symptom-grid">
          {SYMPTOMS.map(s => (
            <div className="symptom-card" key={s.mark}>
              <span className="mark mono">{s.mark}</span>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="sh-tabs">
        <button
          className={`sh-tab ${tab === 'emergency' ? 'active' : ''}`}
          onClick={() => setTab('emergency')}
        >
          EMERGENCY INTAKE
          <span className="tab-sub">Deadline in days or hours</span>
        </button>
        <button
          className={`sh-tab ${tab === 'general' ? 'active' : ''}`}
          onClick={() => setTab('general')}
        >
          GENERAL STUDENT HELP
          <span className="tab-sub">Mentorship, no fire to put out</span>
        </button>
      </div>

      <section className="sh-form-section" id="intake-form">
        <div className="sh-form-wrap">
          <div className="sh-form-head">
            <h2>{tab === 'emergency' ? 'HIGH-PRIORITY INTAKE' : 'BOOK A MENTORSHIP SESSION'}</h2>
            <p>
              {tab === 'emergency'
                ? 'Give us the real picture. Vague requests take longer to route than specific ones.'
                : 'Tell us what you\u2019re working on and we\u2019ll match you with the right person on the team.'}
            </p>
          </div>

          <form className="sh-form" onSubmit={handleSubmit} noValidate>
            <div className="sh-row-2">
              <div className={`sh-field ${errors.name ? 'has-error' : ''}`}>
                <label htmlFor="name">FULL NAME <span className="req">*</span></label>
                <input id="name" type="text" value={form.name} onChange={update('name')} />
                {errors.name && <span className="err">{errors.name}</span>}
              </div>
              <div className={`sh-field ${errors.email ? 'has-error' : ''}`}>
                <label htmlFor="email">EMAIL <span className="req">*</span></label>
                <input id="email" type="email" value={form.email} onChange={update('email')} />
                {errors.email && <span className="err">{errors.email}</span>}
              </div>
            </div>

            <div className={`sh-field ${errors.school ? 'has-error' : ''}`}>
              <label htmlFor="school">UNIVERSITY / PROGRAM <span className="req">*</span></label>
              <input id="school" type="text" placeholder="e.g. KNUST, BSc Mechanical Engineering" value={form.school} onChange={update('school')} />
              {errors.school && <span className="err">{errors.school}</span>}
            </div>

            {tab === 'emergency' && (
              <>
                <div className={`sh-field ${errors.urgency ? 'has-error' : ''}`}>
                  <label>HOW URGENT <span className="req">*</span></label>
                  <div className="urgency-picker">
                    {URGENCY_LEVELS.map(level => (
                      <div
                        key={level.id}
                        className={`urgency-opt ${level.id} ${form.urgency === level.id ? 'selected' : ''} ${level.id === 'critical' ? 'critical' : ''}`}
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

                <div className={`sh-field ${errors.deadline ? 'has-error' : ''}`}>
                  <label htmlFor="deadline">EXACT DEADLINE <span className="req">*</span></label>
                  <input id="deadline" type="text" placeholder="e.g. Friday 9 AM presentation" value={form.deadline} onChange={update('deadline')} />
                  {errors.deadline && <span className="err">{errors.deadline}</span>}
                </div>
              </>
            )}

            <div className="sh-field">
              <label htmlFor="software">SOFTWARE / TOOLS IN USE</label>
              <input id="software" type="text" placeholder="e.g. SolidWorks, ANSYS Fluent, Abaqus" value={form.software} onChange={update('software')} />
            </div>

            <div className={`sh-field ${errors.issue ? 'has-error' : ''}`}>
              <label htmlFor="issue">
                {tab === 'emergency' ? 'WHAT\u2019S BROKEN, SPECIFICALLY' : 'WHAT DO YOU WANT TO WORK ON'} <span className="req">*</span>
              </label>
              <textarea
                id="issue"
                placeholder={tab === 'emergency'
                  ? 'e.g. Mesh won\u2019t converge on the cooling duct — residuals plateau around 1e-3 and won\u2019t drop further.'
                  : 'e.g. I want to get better at setting up FEA boundary conditions before my capstone starts.'}
                value={form.issue}
                onChange={update('issue')}
              />
              {errors.issue && <span className="err">{errors.issue}</span>}
            </div>

            <button className="sh-submit" type="submit" disabled={submitting}>
              {submitting ? 'SENDING…' : tab === 'emergency' ? 'SEND EMERGENCY INTAKE →' : 'REQUEST A SESSION →'}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
