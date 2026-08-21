import { useEffect } from 'react'
import { ArrowIcon, BlobIcon, BracketsIcon, IngestIcon } from './components/Icons'
import { LeadCapture } from './components/LeadCapture'
import { trackEvent } from './lib/analytics'

const bookingUrl = import.meta.env.VITE_BOOKING_URL

const sqlLines = [
  ['SELECT', ' trace_id, span_name,', ' keyword'],
  ['', '  semantic_match(', ''],
  ['', '    "gen_ai.output.messages",', ''],
  ['', "    'sorry, I cannot help you'", ''],
  ['', '  ) AS refusal_score', ''],
  ['FROM', ' spans', ' keyword'],
  ['WHERE', " service = 'support-agent'", ' keyword'],
  ['  AND', " ts > now() - interval '30 minutes'", ' keyword'],
  ['ORDER BY', ' refusal_score DESC', ' keyword'],
  ['LIMIT', ' 50;', ' keyword'],
]

const comparisonRows = [
  ['Primary user', 'Agents', 'Humans'],
  ['Retention', 'Infinite by design', 'Priced expiry tiers'],
  ['Cost model', 'Storage + query', 'Hosts + seats + signals + indexes'],
  ['High cardinality', 'Context to preserve', 'A tax to control'],
  ['Interface', 'Composable SQL', 'Dashboards + proprietary UI'],
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
        <a aria-label="TraceStore home" className="wordmark" href="#top">
          <span className="wordmark__mark" aria-hidden="true">
            ⊕
          </span>
          <span className="wordmark__text">tracestore</span>
          <span className="wordmark__cursor">_</span>
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
              AGENT-NATIVE TELEMETRY
            </div>
            <h1 aria-label="Telemetry built for agents, not dashboards.">
              <span className="hero__line">Telemetry built for agents,</span><br />
              <span className="hero__line hero__line--accent">not dashboards.</span>
            </h1>
            <p className="hero__lede">
              OTEL ingest. SQL query. Built on object storage.<br />
              Keep every high-cardinality dimension forever, with predictable storage and query pricing.
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
              <span>agent.investigation</span>
              <p>“Find refusals that never emitted a policy or error tag.”</p>
            </div>
            <div className="terminal-shell__query">
              <div className="line-numbers" aria-hidden="true">
                01<br />02<br />03<br />04<br />05<br />06<br />07<br />08<br />09<br />10
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
                <span>refusal</span>
              </div>
              <div className="result-row result-row--hot">
                <span>8fd1...a02c</span>
                <span>support-agent.answer</span>
                <span>0.97</span>
              </div>
              <div className="result-row">
                <span>f21b...9e17</span>
                <span>support-agent.answer</span>
                <span>0.91</span>
              </div>
            </div>
            <div className="terminal-shell__finding">
              <span>↳ finding</span>
              127 likely refusals in the last 30 minutes; 63 emitted no policy or error tag.
              <i> confidence 0.96</i>
            </div>
          </div>
        </section>

        <div className="signal-strip" aria-label="Product principles">
          <span>01 / OTEL-NATIVE</span>
          <span>02 / INFINITE RETENTION</span>
          <span>03 / STANDARD SQL</span>
          <span>04 / PREDICTABLE PRICING</span>
          <span>05 / ZERO DASHBOARDS</span>
        </div>

        <section className="thesis section-pad" data-reveal id="why">
          <div className="section-kicker">[ THE THESIS ]</div>
          <div className="thesis__heading">
            <h2>Observability changed users.</h2>
            <p>
              The existing observability stack is built for humans. Agents don’t need another pane
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
              <h3>Infinite retention</h3>
              <p>
                Keep all traces, logs, and metrics on low-cost blob storage with no retention window.
                Use what matters when the incident actually happens.
              </p>
              <span className="mono-tag">retention_days := ∞</span>
            </article>
            <article className="principle-card">
              <div className="principle-card__index">03</div>
              <IngestIcon />
              <h3>Cardinality is signal</h3>
              <p>
                Keep all tenant, prompt, region, model, commit, tool call without aggregation. Agents need all
                of these to investigate the root cause.
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
              The economics come from a deliberately boring data path. Send standard telemetry,
              retain it indefinitely, and query raw history with tools every model understands.
            </p>
          </div>

          <div className="pipeline">
            <div className="pipeline__node">
              <span className="node-label">INGEST / 4317</span>
              <IngestIcon />
              <h3>OTEL in</h3>
              <p>Traces · logs · metrics</p>
              <code>grpc://ingest.tracestore.dev</code>
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
              <strong> If it speaks OpenTelemetry, it speaks TraceStore.</strong>
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
              <code>SELECT deploy_sha, k8s_node, p95(duration_ms) as latency_ms<br />FROM spans<br />WHERE tenant_id = '7f1c'<br />GROUP BY deploy_sha, k8s_node<br />ORDER BY latency_ms DESC<br />LIMIT 50</code>
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
              Traditional observability optimizes for prebuilt views and human browsing. TraceStore
              retains raw context forever and keeps the bill to two predictable inputs: storage and query.
            </p>
          </div>

          <div className="comparison-table" role="table" aria-label="Agent-native versus dashboard-native telemetry">
            <div className="comparison-row comparison-row--head" role="row">
              <span role="columnheader">CONSTRAINT</span>
              <span role="columnheader">TRACESTORE / AGENT-NATIVE</span>
              <span role="columnheader">DASHBOARD-NATIVE</span>
            </div>
            {comparisonRows.map(([label, agent, legacy]) => (
              <div className="comparison-row" key={label} role="row">
                <span role="cell">{label}</span>
                <span aria-label={`TraceStore: ${agent}`} role="cell"><i>+</i>{agent}</span>
                <span aria-label={`Dashboard-native: ${legacy}`} role="cell"><i>−</i>{legacy}</span>
              </div>
            ))}
          </div>
          <p className="comparison__disclaimer">
            * Pricing model, not a published rate card. We’re validating it with early design partners now.
          </p>
        </section>

        <section className="closing" data-reveal id="early-access">
          <div className="closing__radar" aria-hidden="true">
            <i /><i /><i /><i />
            <span>+</span>
          </div>
          <div className="section-kicker">[ PRIVATE ALPHA / DESIGN PARTNERS ]</div>
          <h2>Your telemetry has a{' '}<br />new primary user.</h2>
          <p>
            We’re working with a small group of AI infrastructure teams. If your agents need complete
            production history without an unpredictable observability bill, we should talk.
          </p>
          <LeadCapture source="closing" />
          <BookingLink className="closing__booking" />
        </section>
      </main >

      <footer>
        <a aria-label="TraceStore home" className="wordmark wordmark--footer" href="#top">
          <span className="wordmark__mark" aria-hidden="true">⊕</span>
          tracestore
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
