# o11y landing page

Agent-native telemetry landing page built with React, TypeScript, and Vite.

Use Node 24 (`nvm use`) or another version supported by the `engines` entry in `package.json`.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

The waitlist endpoint must accept a JSON `POST` body shaped as:

```json
{ "email": "dev@example.com", "source": "hero" }
```

Any `2xx` response is considered successful. Leave the PostHog variables empty to run without analytics. The site never sends the submitted email address to PostHog.

## Checks

```bash
npm run lint
npm test
npm run build
```
