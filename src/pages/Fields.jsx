import { Link, useParams } from 'react-router-dom'
import { FIELDS } from '../data/fields.js'
import './Fields.css'

function FieldCard({ field }){
  return (
    <Link to={`/fields/${field.id}`} className="field-card">
      <div>
        <h3>{field.name}</h3>
        <p>{field.blurb}</p>
        <div className="tag-row">{field.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
      </div>
      <div className="count-row">
        {field.models.length > 0 ? `${field.models.length} model${field.models.length === 1 ? '' : 's'}` : 'View field'}
        <span className="arrow">→</span>
      </div>
    </Link>
  )
}

function FieldsList(){
  return (
    <>
      <section className="fields-hero">
        <p className="eyebrow mono">INDUSTRIES WE DESIGN FOR</p>
        <h1>Fields.</h1>
        <p>Forge &amp; Frame builds CAD, CFD, and CAE work across a range of industries — each with its own tolerances, standards, and failure modes. Pick a field to see the models we&apos;ve built there.</p>
      </section>
      <section className="fields-grid">
        {FIELDS.map(field => <FieldCard key={field.id} field={field} />)}
      </section>
    </>
  )
}

function FieldDetail({ field }){
  return (
    <>
      <section className="field-detail-hero">
        <Link to="/fields" className="field-detail-back">← All fields</Link>
        <h1>{field.name}</h1>
        <p>{field.blurb}</p>
        <div className="field-detail-tags">{field.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
      </section>

      {field.models.length === 0 ? (
        <div className="field-models-empty">
          <div className="icon">🛠️</div>
          <h3>Models coming soon.</h3>
          <p>
            This field is set up and ready — client models for {field.name.toLowerCase()} work will appear here as they&apos;re delivered. Check back, or{' '}
            <Link to="/contact" style={{ color: 'var(--primary)', fontWeight: 600 }}>get in touch</Link> if you have a project in this space.
          </p>
        </div>
      ) : (
        <div className="field-models-grid">
          {field.models.map(model => (
            // Real <button>, not a styled <div> -- keyboard-focusable and
            // semantically correct. No model detail page exists yet, so
            // this currently just logs; wire it to a real route once
            // there's somewhere for it to go.
            <button
              key={model.id}
              className="field-model-card"
              onClick={() => console.log('Open model:', model.id)}
              type="button"
            >
              <div className="thumb" />
              <div className="info"><h4>{model.name}</h4><p>{model.description}</p></div>
            </button>
          ))}
        </div>
      )}
    </>
  )
}

export default function Fields(){
  const { fieldId } = useParams()
  if (!fieldId) return <FieldsList />
  const field = FIELDS.find(f => f.id === fieldId)
  if (!field){
    return (
      <section className="field-detail-hero">
        <Link to="/fields" className="field-detail-back">← All fields</Link>
        <h1>Field not found.</h1>
        <p>That field doesn&apos;t exist yet. <Link to="/fields" style={{ color: 'var(--primary)' }}>Browse all fields</Link>.</p>
      </section>
    )
  }
  return <FieldDetail field={field} />
}
