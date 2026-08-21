import { readFile, rm, writeFile } from 'node:fs/promises'

const outputUrl = new URL('../dist/index.html', import.meta.url)
const serverBuildUrl = new URL('../dist-ssr/entry-server.js', import.meta.url)
const serverOutputUrl = new URL('../dist-ssr/', import.meta.url)

const template = await readFile(outputUrl, 'utf8')
const { render } = await import(serverBuildUrl.href)
const appHtml = render()

if (!appHtml.includes('Telemetry built for agents')) {
  throw new Error('Prerendered output is missing the landing-page content.')
}

const rootPlaceholder = '<div id="root"></div>'
if (!template.includes(rootPlaceholder)) {
  throw new Error(`Could not find ${rootPlaceholder} in the client build.`)
}

await writeFile(outputUrl, template.replace(rootPlaceholder, `<div id="root">${appHtml}</div>`))
await rm(serverOutputUrl, { recursive: true })
