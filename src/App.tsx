import { useEffect } from 'react'
import { ArrowIcon, BlobIcon, BracketsIcon, IngestIcon } from './components/Icons'
import { LeadCapture } from './components/LeadCapture'
import { trackEvent } from './lib/analytics'

const bookingUrl = import.meta.env.VITE_BOOKING_URL

const sqlLines = [
  [
    'SELECT',
    " trace_id, span_name, attrs['tenant.id']",
    ' keyword',
  ],
  ['  AS tenant, duration_ms', '', ''],
  ['FROM', ' spans', ' keyword'],
  ['WHERE', " service = 'checkout-api'", ' keyword'],
  ['  AND', " ts > now() - interval '10 minutes'", ' keyword'],
  ['ORDER BY', ' duration_ms DESC', ' keyword'],
  ['LIMIT', ' 50;', ' keyword'],
]

const comparisonRows = [
  ['Primary interface', 'Composable SQL', 'Dashboards + proprietary UI'],
  ['Telemetry shape', 'Raw and queryable', 'Aggregated at ingest'],
  ['High cardinality', 'Useful context', 'A pricing problem'],
  ['Investigation path', 'Chosen at query time', 'Predicted ahead of time'],
  ['Built for', 'Agent loops', 'Human eyeballs'],
]

function BookingLink({ className = '' }: { className?: string }) {
  if (!bookingUrl) {
    return (
      <span aria-disabled="true" className={`button button--ghost button--disabled ${className}`}>
        BOOKING LINK SOON
      </span>
    )
  }

  return (
    <a
      className={`button button--ghost ${className}`}
      href={bookingUrl}
      onClick={() => trackEvent('design_call_clicked', { location: 'hero' })}
      rel="noreferrer"
      target="_blank"
    >
      BOOK A DESIGN CALL <ArrowIcon />
    </a>
  )
}

function App() {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('[data-reveal]')
    if (!('IntersectionObserver' in window)) {
      sections.forEach((section) => section.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <a aria-label="o11y home" className="wordmark" href="#top">
          <span className="wordmark__mark" aria-hidden="true">
            ⊕
          </span>
          o11y<span className="wordmark__cursor">_</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#why">WHY</a>
          <a href="#architecture">ARCHITECTURE</a>
          <a href="#query">QUERY</a>
        </nav>
        <a className="header-cta" href="#early-access">
          JOIN THE ALPHA <span aria-hidden="true">↘</span>
        </a>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero__copy">
            <div className="eyebrow">
              <span className="status-dot" />
              AGENT-NATIVE TELEMETRY / 001
            </div>
            <h1>
              Telemetry built for agents,{' '}<br />
              <span>not dashboards.</span>
            </h1>
            <p className="hero__lede">
              OTEL-native ingest. Blob storage at rest. SQL when an agent needs answers.
              Keep every high-cardinality dimension without paying to turn it into a chart.
            </p>
            <LeadCapture source="hero" />
            <div className="hero__secondary">
              <BookingLink />
              <p>
                Built for AI infrastructure teams
                <br />
                investigating real production systems.
              </p>
            </div>
          </div>

          <div className="terminal-shell" aria-label="Example agent telemetry investigation">
            <div className="terminal-shell__bar">
              <span>
                <i /> AGENT SESSION
              </span>
              <span>investigator-07 / LIVE</span>
            </div>
            <div className="terminal-shell__question">
              <span>agent.question</span>
              <p>“Why did checkout latency spike for tenant_7f1c after deploy?”</p>
            </div>
            <div className="terminal-shell__query">
              <div className="line-numbers" aria-hidden="true">
                01<br />02<br />03<br />04<br />05<br />06<br />07
              </div>
              <pre aria-label="SQL query">
                <code>
                  {sqlLines.map(([lead, tail, className], index) => (
                    <span key={index}>
                      <b className={className}>{lead}</b>
                      {tail}
                      {'\n'}
                    </span>
                  ))}
                </code>
              </pre>
            </div>
            <div className="terminal-shell__result">
              <div className="result-head">
                <span>trace_id</span>
                <span>span_name</span>
                <span>duration</span>
              </div>
              <div className="result-row result-row--hot">
                <span>8fd1...a02c</span>
                <span>inventory.reserve</span>
                <span>4,882 ms</span>
              </div>
              <div className="result-row">
                <span>f21b...9e17</span>
                <span>payment.authorize</span>
                <span>812 ms</span>
              </div>
            </div>
            <div className="terminal-shell__finding">
              <span>↳ finding</span>
              Cold cache on inventory-shard-19, isolated to tenant_7f1c.
              <i> confidence 0.94</i>
            </div>
          </div>
        </section>

        <div className="signal-strip" aria-label="Product principles">
          <span>01 / OTEL-NATIVE</span>
          <span>02 / OBJECT STORAGE</span>
          <span>03 / STANDARD SQL</span>
          <span>04 / RAW CONTEXT</span>
          <span>05 / ZERO DASHBOARDS</span>
        </div>

        <section className="thesis section-pad" data-reveal id="why">
          <div className="section-kicker">[ THE THESIS ]</div>
          <div className="thesis__heading">
            <h2>Observability changed users.</h2>
            <p>
              The next primary user of telemetry is software. Agents don’t need another pane
              of glass. They need cheap, complete context and a language they can compose.
            </p>
          </div>
          <div className="principle-grid">
            <article className="principle-card">
              <div className="principle-card__index">01</div>
              <BracketsIcon />
              <h3>SQL, not UI</h3>
              <p>
                Agents already write queries, test hypotheses, and iterate. Give them a stable,
                expressive interface instead of teaching them where to click.
              </p>
              <span className="mono-tag">interface := query</span>
            </article>
            <article className="principle-card principle-card--acid">
              <div className="principle-card__index">02</div>
              <BlobIcon />
              <h3>Raw by default</h3>
              <p>
                Keep the detail. Store traces, logs, and metrics on low-cost blob storage, then
                decide what matters when the incident actually happens.
              </p>
              <span className="mono-tag">retention &gt; prediction</span>
            </article>
            <article className="principle-card">
              <div className="principle-card__index">03</div>
              <IngestIcon />
              <h3>Cardinality is signal</h3>
              <p>
                Tenant, prompt, region, model, commit, tool call—these dimensions are how an
                agent isolates a failure. We don’t treat useful context as contraband.
              </p>
              <span className="mono-tag">dimensions := unbounded</span>
            </article>
          </div>
        </section>

        <section className="architecture section-pad" data-reveal id="architecture">
          <div className="section-heading">
            <div>
              <div className="section-kicker">[ THE STACK ]</div>
              <h2>Three primitives.{' '}<br />No theater.</h2>
            </div>
            <p>
              A deliberately boring data path is a feature. Send standard telemetry, retain it
              economically, and query the raw history with tools every model already understands.
            </p>
          </div>

          <div className="pipeline">
            <div className="pipeline__node">
              <span className="node-label">INGEST / 4317</span>
              <IngestIcon />
              <h3>OTEL in</h3>
              <p>Traces · logs · metrics</p>
              <code>grpc://ingest.o11y</code>
            </div>
            <div className="pipeline__connector" aria-hidden="true">
              <span>STREAM</span>
              <div><i /><i /><i /></div>
            </div>
            <div className="pipeline__node pipeline__node--dark">
              <span className="node-label">STORE / PARQUET</span>
              <BlobIcon />
              <h3>Blobs at rest</h3>
              <p>Columnar · durable · cheap</p>
              <code>s3://telemetry/raw/</code>
            </div>
            <div className="pipeline__connector" aria-hidden="true">
              <span>SCAN</span>
              <div><i /><i /><i /></div>
            </div>
            <div className="pipeline__node pipeline__node--acid">
              <span className="node-label">QUERY / ANSI-ish</span>
              <BracketsIcon />
              <h3>SQL out</h3>
              <p>Flexible · composable · agentic</p>
              <code>SELECT * FROM spans</code>
            </div>
          </div>

          <div className="architecture__footnote">
            <span>+</span>
            <p>
              No proprietary agent SDK. No new query DSL. No instrumentation rewrite.
              <strong> If it speaks OpenTelemetry, it speaks o11y.</strong>
            </p>
          </div>
        </section>

        <section className="query-section section-pad" data-reveal id="query">
          <div className="query-section__copy">
            <div className="section-kicker">[ INVESTIGATION LOOP ]</div>
            <h2>Let agents ask the expensive questions.</h2>
            <p>
              Incidents don’t follow dashboard layouts. Agents move across signals, refine their
              scope, and join context that no one thought to pre-aggregate.
            </p>
            <ol className="loop-list">
              <li>
                <span>01</span>
                <div>
                  <strong>Form a hypothesis</strong>
                  <p>Start from the alert, user report, or failed evaluation.</p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <strong>Query raw context</strong>
                  <p>Slice by any attribute. Join across telemetry types.</p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <strong>Converge on cause</strong>
                  <p>Run the next query, preserve evidence, report confidence.</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="agent-log">
            <div className="agent-log__header">
              <span>RUN #1842</span>
              <span>14:32:09 UTC</span>
            </div>
            <div className="agent-message">
              <span className="agent-message__type">THINK</span>
              <p>Latency is isolated to one tenant. I’ll correlate the slow traces with deployment and infrastructure attributes.</p>
            </div>
            <div className="agent-message agent-message--query">
              <span className="agent-message__type">QUERY</span>
              <code>SELECT deploy_sha, k8s_node, p95(duration_ms)<br />FROM spans<br />WHERE tenant_id = '7f1c'<br />GROUP BY ALL</code>
            </div>
            <div className="agent-message">
              <span className="agent-message__type">OBSERVE</span>
              <p><mark>97.8%</mark> of slow spans run on <code>inventory-shard-19</code> after deploy <code>8c41fd</code>.</p>
            </div>
            <div className="agent-message agent-message--answer">
              <span className="agent-message__type">ANSWER</span>
              <p>Probable cause found in 3 queries. Recommend draining shard-19 and reverting inventory deploy 8c41fd.</p>
            </div>
          </div>
        </section>

        <section className="comparison section-pad" data-reveal>
          <div className="section-heading section-heading--comparison">
            <div>
              <div className="section-kicker">[ DIFFERENT CONSTRAINTS ]</div>
              <h2>Stop paying the{' '}<br />dashboard tax.</h2>
            </div>
            <p>
              Traditional observability optimizes for prebuilt views and human browsing. That
              architecture gets awkward—and expensive—when software investigates continuously.
            </p>
          </div>

          <div className="comparison-table" role="table" aria-label="Agent-native versus dashboard-native telemetry">
            <div className="comparison-row comparison-row--head" role="row">
              <span role="columnheader">CONSTRAINT</span>
              <span role="columnheader">o11y / AGENT-NATIVE</span>
              <span role="columnheader">DASHBOARD-NATIVE</span>
            </div>
            {comparisonRows.map(([label, agent, legacy]) => (
              <div className="comparison-row" key={label} role="row">
                <span role="cell">{label}</span>
                <span role="cell"><i>+</i>{agent}</span>
                <span role="cell"><i>−</i>{legacy}</span>
              </div>
            ))}
          </div>
          <p className="comparison__disclaimer">
            * Architectural direction, not a benchmark. We’re building with early design partners now.
          </p>
        </section>

        <section className="manifesto" data-reveal>
          <div className="manifesto__label">THE SHORT VERSION</div>
          <div className="manifesto__statements">
            <p><span>×</span> No dashboards to maintain.</p>
            <p><span>×</span> No views to predict upfront.</p>
            <p><span>×</span> No cardinality guilt.</p>
            <p className="manifesto__positive"><span>→</span> Just telemetry your agents can use.</p>
          </div>
        </section>

        <section className="closing" data-reveal id="early-access">
          <div className="closing__radar" aria-hidden="true">
            <i /><i /><i /><i />
            <span>+</span>
          </div>
          <div className="section-kicker">[ PRIVATE ALPHA / DESIGN PARTNERS ]</div>
          <h2>Your telemetry has a{' '}<br />new primary user.</h2>
          <p>
            We’re working with a small group of AI infrastructure teams. If your agents need to
            investigate production—not just generate another summary—we should talk.
          </p>
          <LeadCapture source="closing" />
          <BookingLink className="closing__booking" />
        </section>
      </main>

      <footer>
        <a aria-label="o11y home" className="wordmark wordmark--footer" href="#top">
          <span className="wordmark__mark" aria-hidden="true">⊕</span>
          o11y_
        </a>
        <p>TELEMETRY FOR THE AGENTIC ERA.</p>
        <div>
          <a href="#architecture">ARCHITECTURE</a>
          <a href="#early-access">EARLY ACCESS</a>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </>
  )
}

export default App
