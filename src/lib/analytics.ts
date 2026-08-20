type EventProperties = Record<string, boolean | number | string | undefined>

type PostHogClient = {
  capture: (eventName: string, properties?: EventProperties) => void
  init: (
    apiKey: string,
    options: {
      api_host: string
      autocapture: boolean
      capture_pageleave: boolean
      capture_pageview: boolean
      disable_session_recording: boolean
      person_profiles: 'identified_only'
    },
  ) => void
}

let client: PostHogClient | null = null

export async function initializeAnalytics(): Promise<void> {
  const apiKey = import.meta.env.VITE_POSTHOG_KEY
  const apiHost = import.meta.env.VITE_POSTHOG_HOST

  if (!apiKey || !apiHost || client) return

  const { default: posthog } = await import('posthog-js')
  posthog.init(apiKey, {
    api_host: apiHost,
    autocapture: false,
    capture_pageleave: false,
    capture_pageview: false,
    disable_session_recording: true,
    person_profiles: 'identified_only',
  })
  client = posthog
  trackEvent('landing_page_viewed')
}

export function trackEvent(eventName: string, properties?: EventProperties): void {
  client?.capture(eventName, properties)
}
