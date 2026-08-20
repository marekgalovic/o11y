import { FormEvent, useId, useState } from 'react'
import { trackEvent } from '../lib/analytics'

type SubmissionState = 'error' | 'idle' | 'submitting' | 'success'

interface LeadCaptureProps {
  endpoint?: string
  source: 'closing' | 'hero'
  onTrack?: typeof trackEvent
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LeadCapture({
  endpoint = import.meta.env.VITE_WAITLIST_ENDPOINT,
  source,
  onTrack = trackEvent,
}: LeadCaptureProps) {
  const inputId = useId()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<SubmissionState>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedEmail = email.trim().toLowerCase()
    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setState('error')
      setMessage('Enter a valid work email.')
      return
    }

    if (!endpoint) {
      setState('error')
      setMessage('Early access signup is not configured yet.')
      return
    }

    setState('submitting')
    setMessage('')
    onTrack('waitlist_submission_attempted', { source })

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, source }),
      })

      if (!response.ok) throw new Error(`Waitlist request failed: ${response.status}`)

      setState('success')
      setEmail('')
      setMessage("You're on the list. We'll be in touch.")
      onTrack('waitlist_submission_succeeded', { source })
    } catch {
      setState('error')
      setMessage('Something went sideways. Try again in a moment.')
      onTrack('waitlist_submission_failed', { source })
    }
  }

  const messageId = `${inputId}-message`

  return (
    <div className="lead-capture">
      <form className="lead-form" onSubmit={handleSubmit} noValidate>
        <label className="sr-only" htmlFor={inputId}>
          Work email
        </label>
        <span aria-hidden="true" className="lead-form__prompt">
          &gt;
        </span>
        <input
          aria-describedby={message ? messageId : undefined}
          autoComplete="email"
          id={inputId}
          inputMode="email"
          name="email"
          onChange={(event) => {
            setEmail(event.target.value)
            if (state === 'error') {
              setState('idle')
              setMessage('')
            }
          }}
          placeholder="you@company.com"
          required
          type="email"
          value={email}
        />
        <button disabled={state === 'submitting' || state === 'success'} type="submit">
          {state === 'submitting'
            ? 'SENDING...'
            : state === 'success'
              ? 'ADDED ✓'
              : 'REQUEST ACCESS ↗'}
        </button>
      </form>
      <p
        className={`form-message ${state === 'error' ? 'form-message--error' : ''}`}
        id={messageId}
        role="status"
      >
        {message || 'Private alpha · No spam · Talk to the builders'}
      </p>
    </div>
  )
}
