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

## GitHub Pages

Push the project to GitHub, then select **Settings → Pages → Build and deployment → GitHub Actions**. The workflow in `.github/workflows/deploy-pages.yml` validates, builds, and deploys the site whenever changes land on `main`.

The workflow automatically uses the repository name as Vite's base path, so a repository named `o11y_landing` is served correctly from `https://<owner>.github.io/o11y_landing/`.

Configure these optional repository variables under **Settings → Secrets and variables → Actions → Variables**:

- `VITE_WAITLIST_ENDPOINT`
- `VITE_BOOKING_URL`
- `VITE_POSTHOG_KEY`
- `VITE_POSTHOG_HOST`

These values are embedded into the browser bundle and must not contain private secrets. The waitlist endpoint must allow requests from the GitHub Pages origin.
