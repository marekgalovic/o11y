import { useId } from 'react'
import { trackEvent } from '../lib/analytics'

interface LeadCaptureProps {
  action?: string
  source: 'closing' | 'hero'
  onTrack?: typeof trackEvent
}

const GOOGLE_FORM_ACTION =
  'https://docs.google.com/forms/d/e/1FAIpQLSf53OfsGPkJ9WnY_F29159XAogNZMa8KdDpwZxSlLXI6ESq2w/formResponse'
const GOOGLE_EMAIL_FIELD = 'entry.166846648'

export function LeadCapture({
  action = import.meta.env.VITE_GOOGLE_FORM_ACTION || GOOGLE_FORM_ACTION,
  source,
  onTrack = trackEvent,
}: LeadCaptureProps) {
  const inputId = useId()

  return (
    <div className="lead-capture">
      <form
        action={action}
        className="lead-form"
        method="post"
        onSubmit={() => onTrack('waitlist_submission_attempted', { source })}
        target="_blank"
      >
        <label className="sr-only" htmlFor={inputId}>
          Work email
        </label>
        <span aria-hidden="true" className="lead-form__prompt">
          &gt;
        </span>
        <input
          autoComplete="email"
          id={inputId}
          inputMode="email"
          name={GOOGLE_EMAIL_FIELD}
          placeholder="you@company.com"
          required
          type="email"
        />
        <input name="fvv" type="hidden" value="1" />
        <input name="pageHistory" type="hidden" value="0" />
        <button name="subscribe" type="submit" value="Subscribe">
          REQUEST ACCESS ↗
        </button>
      </form>
      <p className="form-message">No spam · Talk to the builders</p>
    </div>
  )
}
