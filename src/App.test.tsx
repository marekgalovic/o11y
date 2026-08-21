import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('landing page', () => {
  it('presents the product thesis and core telemetry primitives', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /telemetry built for agents, not dashboards/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('02 / INFINITE RETENTION')).toBeInTheDocument()
    expect(screen.getByText('04 / PREDICTABLE PRICING')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'OTEL in' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Blobs at rest' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'SQL out' })).toBeInTheDocument()
    expect(screen.getByLabelText('SQL query')).toHaveTextContent(
      'semantic_match( "gen_ai.output.messages", \'sorry, I cannot help you\' )',
    )
    expect(screen.getByLabelText('SQL query')).toHaveTextContent(
      "ts > now() - interval '30 minutes'",
    )
    expect(screen.getAllByLabelText('Work email')).toHaveLength(2)
  })
})
