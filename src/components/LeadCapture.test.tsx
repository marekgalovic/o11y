import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LeadCapture } from './LeadCapture'

const ACTION =
  'https://docs.google.com/forms/d/e/test-form/formResponse'

describe('LeadCapture', () => {
  it('submits the email directly to Google Forms in a new tab', () => {
    const { container } = render(<LeadCapture action={ACTION} source="hero" />)
    const form = container.querySelector('form')!
    const email = screen.getByLabelText('Work email')

    expect(form).toHaveAttribute('action', ACTION)
    expect(form).toHaveAttribute('method', 'post')
    expect(form).toHaveAttribute('target', '_blank')
    expect(email).toHaveAttribute('name', 'entry.166846648')
    expect(email).toBeRequired()
  })

  it('includes the Google Forms submission metadata', () => {
    const { container } = render(<LeadCapture action={ACTION} source="hero" />)

    expect(container.querySelector('input[name="fvv"]')).toHaveValue('1')
    expect(container.querySelector('input[name="pageHistory"]')).toHaveValue('0')
  })

  it('tracks the attempt without exposing the submitted email', () => {
    const trackMock = vi.fn()
    const { container } = render(
      <LeadCapture action={ACTION} onTrack={trackMock} source="closing" />,
    )

    fireEvent.change(screen.getByLabelText('Work email'), {
      target: { value: 'dev@example.com' },
    })
    fireEvent.submit(container.querySelector('form')!)

    expect(trackMock).toHaveBeenCalledWith('waitlist_submission_attempted', {
      source: 'closing',
    })
    expect(JSON.stringify(trackMock.mock.calls)).not.toContain('dev@example.com')
  })
})
