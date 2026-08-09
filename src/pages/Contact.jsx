import { useState } from 'react'
import './Contact.css'

const EMPTY = { name: '', email: '', company: '', track: '', message: '' }

function validate(form){
  const errors = {}
  if (!form.name.trim()) errors.name = 'Required'
  if (!form.email.trim()) errors.email = 'Required'
  else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email'
  if (!form.message.trim() || form.message.trim().length < 10){
    errors.message = 'Tell us a bit more about the project'
  }
  return errors
}

export default function Contact(){
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const update = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors(er => ({ ...er, [field]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    // NOTE: wire this to a real endpoint (Formspree, serverless function,
    // or email API) when ready. Simulated delay for now.
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 700)
  }

  return (
    <>
      <section className="contact-hero">
        <p className="eyebrow mono">START A PROJECT</p>
        <h1>Let&apos;s talk about<br />what you&apos;re building.</h1>
        <p>
          CAD, CFD, or CAE — tell us where you are and what you need, and
          we&apos;ll get back to you with next steps, not a form-letter reply.
        </p>
      </section>

      <section className="contact-layout">
        <div className="contact-info">
          <div>
            <h3>Direct lines</h3>
            <p className="lead">
              Prefer to skip the form? Reach out directly and we&apos;ll route
              you to the right person on the team.
            </p>

            <div className="contact-channel">
              <div className="k mono">EMAIL</div>
              <div className="v"><a href="mailto:hello@forgeandframe.design">hello@forgeandframe.design</a></div>
            </div>
            <div className="contact-channel">
              <div className="k mono">STUDIO</div>
              <div className="v">KNUST, Kumasi — Ghana</div>
            </div>
            <div className="contact-channel">
              <div className="k mono">RESPONSE TIME</div>
              <div className="v">Within 2 business days</div>
            </div>
          </div>

          <p className="contact-badge">
            FINAL-YEAR STUDENT WITH A TIGHT DEADLINE?<br />
            USE THE EMERGENCY INTAKE FORM INSTEAD — IT&apos;S ROUTED FASTER.
          </p>
        </div>

        <div className="contact-form-panel">
          {submitted ? (
            <div className="cf-success">
              <div className="mark">✓</div>
              <h3>Message sent.</h3>
              <p>We&apos;ll get back to you within 2 business days.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="cf-row-2">
                <div className={`cf-field ${errors.name ? 'has-error' : ''}`}>
                  <label htmlFor="c-name">NAME <span className="req">*</span></label>
                  <input id="c-name" type="text" value={form.name} onChange={update('name')} />
                  {errors.name && <span className="err">{errors.name}</span>}
                </div>
                <div className={`cf-field ${errors.email ? 'has-error' : ''}`}>
                  <label htmlFor="c-email">EMAIL <span className="req">*</span></label>
                  <input id="c-email" type="email" value={form.email} onChange={update('email')} />
                  {errors.email && <span className="err">{errors.email}</span>}
                </div>
              </div>

              <div className="cf-field">
                <label htmlFor="c-company">COMPANY / ORGANIZATION</label>
                <input id="c-company" type="text" value={form.company} onChange={update('company')} />
              </div>

              <div className="cf-field">
                <label htmlFor="c-track">RELEVANT DISCIPLINE</label>
                <select id="c-track" value={form.track} onChange={update('track')}>
                  <option value="">Select one (optional)</option>
                  <option value="cad">CAD — Computer-Aided Design</option>
                  <option value="cfd">CFD — Computational Fluid Dynamics</option>
                  <option value="cae">CAE — Computer-Aided Engineering</option>
                  <option value="multiple">Multiple / Not sure yet</option>
                </select>
              </div>

              <div className={`cf-field ${errors.message ? 'has-error' : ''}`}>
                <label htmlFor="c-message">PROJECT DETAILS <span className="req">*</span></label>
                <textarea
                  id="c-message"
                  placeholder="What are you trying to build, and where are you in the process?"
                  value={form.message}
                  onChange={update('message')}
                />
                {errors.message && <span className="err">{errors.message}</span>}
              </div>

              <button className="cf-submit" type="submit" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send message →'}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
