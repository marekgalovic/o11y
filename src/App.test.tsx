import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('landing page', () => {
  it('presents the product thesis and core telemetry primitives', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /telemetry built for agents, not dashboards/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'OTEL in' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Blobs at rest' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'SQL out' })).toBeInTheDocument()
    expect(screen.getAllByLabelText('Work email')).toHaveLength(2)
  })
})
