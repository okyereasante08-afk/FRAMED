import { useState } from 'react'
import './Contact.css'

const EMPTY = { name: '', email: '', message: '' }

export default function Contact(){
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const update = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors(er => ({ ...er, [field]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const found = {}
    if (!form.name.trim()) found.name = 'Required'
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) found.email = 'Enter a valid email'
    if (!form.message.trim() || form.message.trim().length < 10) found.message = 'Tell us a bit more'
    setErrors(found)
    if (Object.keys(found).length > 0) return
    setSubmitted(true)
  }

  return (
    <>
      <section className="contact-hero">
        <p className="eyebrow mono">START A PROJECT</p>
        <h1>Let&apos;s talk about<br />what you&apos;re building.</h1>
        <p>CAD, CFD, or CAE — tell us where you are and what you need.</p>
      </section>

      <section className="contact-layout">
        <div className="contact-info">
          <div>
            <h3>Direct lines</h3>
            <div className="contact-channel">
              <div className="k mono">EMAIL</div>
              <div className="v"><a href="mailto:turibius@gmail.com">turibius@gmail.com</a></div>
            </div>
          </div>
        </div>
        <div className="contact-form-panel">
          {submitted ? (
            <div className="cf-success"><div className="mark">✓</div><h3>Message sent.</h3><p>We&apos;ll get back to you within 2 business days.</p></div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className={`cf-field ${errors.name ? 'has-error' : ''}`}>
                <label htmlFor="c-name">Name *</label>
                <input id="c-name" value={form.name} onChange={update('name')} />
                {errors.name && <span className="err">{errors.name}</span>}
              </div>
              <div className={`cf-field ${errors.email ? 'has-error' : ''}`}>
                <label htmlFor="c-email">Email *</label>
                <input id="c-email" type="email" value={form.email} onChange={update('email')} />
                {errors.email && <span className="err">{errors.email}</span>}
              </div>
              <div className={`cf-field ${errors.message ? 'has-error' : ''}`}>
                <label htmlFor="c-message">Project details *</label>
                <textarea id="c-message" value={form.message} onChange={update('message')} />
                {errors.message && <span className="err">{errors.message}</span>}
              </div>
              <button className="cf-submit" type="submit">Send message →</button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
