import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LeadCapture } from './LeadCapture'

describe('LeadCapture', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('rejects an invalid email before making a request', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    render(<LeadCapture endpoint="https://example.com/waitlist" source="hero" />)
    fireEvent.change(screen.getByLabelText('Work email'), { target: { value: 'not-an-email' } })
    fireEvent.submit(screen.getByRole('button', { name: /request access/i }).closest('form')!)

    expect(screen.getByText('Enter a valid work email.')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('shows an honest error when the endpoint is not configured', () => {
    render(<LeadCapture endpoint="" source="hero" />)
    fireEvent.change(screen.getByLabelText('Work email'), { target: { value: 'dev@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /request access/i }))

    expect(screen.getByText('Early access signup is not configured yet.')).toBeInTheDocument()
  })

  it('submits normalized lead data and reports success without tracking the email', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    const trackMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    render(
      <LeadCapture
        endpoint="https://example.com/waitlist"
        onTrack={trackMock}
        source="closing"
      />,
    )
    fireEvent.change(screen.getByLabelText('Work email'), {
      target: { value: '  DEV@Example.com  ' },
    })
    fireEvent.click(screen.getByRole('button', { name: /request access/i }))

    await waitFor(() => {
      expect(screen.getByText("You're on the list. We'll be in touch.")).toBeInTheDocument()
    })

    expect(fetchMock).toHaveBeenCalledWith('https://example.com/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'dev@example.com', source: 'closing' }),
    })
    expect(trackMock).toHaveBeenCalledWith('waitlist_submission_succeeded', {
      source: 'closing',
    })
    expect(JSON.stringify(trackMock.mock.calls)).not.toContain('dev@example.com')
  })

  it('preserves the email and permits retry after a failed request', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 500 })
    vi.stubGlobal('fetch', fetchMock)

    render(<LeadCapture endpoint="https://example.com/waitlist" source="hero" />)
    const input = screen.getByLabelText('Work email') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'dev@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /request access/i }))

    await waitFor(() => {
      expect(screen.getByText('Something went sideways. Try again in a moment.')).toBeInTheDocument()
    })

    expect(input.value).toBe('dev@example.com')
    expect(screen.getByRole('button', { name: /request access/i })).not.toBeDisabled()
  })
})
