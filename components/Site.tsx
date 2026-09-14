import type { CSSProperties } from "react";
import Fx from "@/components/Fx";
import HeroMock from "@/components/HeroMock";
import { COPY, DIARY, DL, VERSION, type Lang } from "@/data/site";

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

export function Mark({ className }: { className?: string }) {
  return <img className={className} src="/icons/swob-512.png" alt="" width={512} height={512} />;
}

function DiaryViz({ lang }: { lang: Lang }) {
  const t = COPY[lang].diary;
  return (
    <div className="diary" aria-label={t.title}>
      <div className="d-head"><b>{t.title}</b><span>{t.refreshed}</span></div>
      <div className="d-axis">{t.cols.map((c) => <span key={c}>{c}</span>)}</div>
      <ul className="d-rows">
        {DIARY.map((r, i) => (
          <li key={i} className="hued" style={v({ "--h": r.hue, "--l": `${(r.start / 1440) * 100}%`, "--w": `${((r.end - r.start) / 1440) * 100}%`, "--d": `${0.15 + i * 0.12}s` })}>
            <div className="d-track"><i className="d-bar" /></div>
            <div className="d-meta">
              <span className="d-tool">{r.tool}</span>
              <span className="d-proj">{r.project}</span>
              <span className="d-num">{t.active} {r.active} · {r.msg} {t.msg} · {r.tok}</span>
            </div>
            <p className="d-title">{lang === "zh" ? r.titleZh : r.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ShareViz({ lang }: { lang: Lang }) {
  const t = COPY[lang].share;
  return (
    <div className="share" aria-hidden="true">
      <div className="s-bar"><span>{t.turns}</span><span className="s-red">{t.redact}</span><span>{t.theme}</span></div>
      <div className="s-card">
        <div className="s-msg u"><i>U</i><p>{t.u}</p></div>
        <div className="s-msg a"><i>A</i><p>{t.a.split("OAUTH_CLIENT_SECRET").map((part, i) => i === 0 ? <span key={i}>{part}<code className="s-mask">sk-••••••••••••</code></span> : <span key={i}>{part}</span>)}</p></div>
        <div className="s-foot"><span className="s-wm">swob.app</span><span className="s-btn">{t.export}</span></div>
      </div>
    </div>
  );
}

function Shot({ src, alt, cap }: { src: string; alt: string; cap?: string }) {
  return (
    <figure className="shot">
      <div className="frame"><img src={src} alt={alt} loading="lazy" /></div>
      {cap && <figcaption>{cap}</figcaption>}
    </figure>
  );
}

export default function Site({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const zh = lang === "zh";
  const p = (path: string) => (zh ? `/zh${path}` : path);
  return (
    <div className={`sw${zh ? " zh" : ""}`} lang={t.htmlLang}>
      <Fx />
      <div className="grain" aria-hidden="true" />

      <nav>
        <div className="wrap">
          <a className="brand" href={p("/")} aria-label="Swob"><Mark className="mark" />Swob</a>
          <div className="links">
            <a href="#doors">{t.nav.doors}</a>
            <a href="#engine">{t.nav.engine}</a>
            <a href="#company">{t.nav.company}</a>
            <a href={p("/sources")}>{t.nav.sources}</a>
            <a href={lang === "en" ? "/docs/en/" : "/docs/"}>{t.nav.docs}</a>
          </div>
          <div className="nav-r">
            <a className="lang" href={t.switch.href} hrefLang={zh ? "en" : "zh"}>{t.switch.label}</a>
            <a className="btn solid" href={DL.arm64}>{t.nav.download}</a>
          </div>
        </div>
      </nav>

      <header className="hero" id="top">
        <div className="wrap">
          <Mark className="hero-mark" />
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1><span className="premise">{t.hero.pre}</span><em>{t.hero.h1}</em></h1>
          <p className="verbs" aria-hidden="true">
            {t.hero.verbs.map((w, i) => <span key={w} className="hued" style={v({ "--h": [330, 200, 110][i], "--d": `${0.4 + i * 0.18}s` })}>{w}</span>)}
          </p>
          <p className="lede">{t.hero.lede}</p>
          <div className="cta">
            <a className="btn solid" href={DL.arm64}>{t.hero.cta1}<small>{t.hero.cta1s}</small></a>
            <a className="btn" href={DL.github} target="_blank" rel="noopener">{t.hero.cta2}</a>
          </div>
          <p className="note">{t.hero.note}</p>
          <HeroMock lang={lang} />
        </div>
      </header>

      <section className="pains">
        <div className="wrap">
          {t.pains.map((x, i) => (
            <div className="pain pre" key={i} style={v({ "--d": `${i * 0.1}s` })}><h3>{x.h}</h3><p>{x.p}</p></div>
          ))}
        </div>
      </section>

      <section className="doors-sec" id="doors">
        <div className="wrap">
          <div className="sec-head pre">
            <div><p className="eyebrow">{t.doors.eyebrow}</p><h2>{t.doors.h2}</h2></div>
            <p className="side">{t.doors.side}</p>
          </div>
          {t.doors.lines.map((line, li) => (
            <div className="line" key={line.id}>
              <div className="line-head pre">
                <span className="idx">{String(li + 1).padStart(2, "0")}</span>
                <p className="eyebrow">{line.title}</p>
                <p className="line-desc">{line.desc}</p>
              </div>
              <div className="door-grid">
                {t.doors.items.filter((d) => d.line === line.id).map((d, di) => (
                  <article className="door hued pre" id={`d-${d.id}`} key={d.id} style={v({ "--h": d.hue, "--d": `${0.1 + di * 0.12}s` })}>
                    <div className="plabel">
                      <span className="dot" /><b>{d.name}</b>
                      <span className={`st ${d.status === "Building" ? "wip" : "live"}`}>{t.status[d.status]}</span>
                    </div>
                    <h3>{d.h3}</h3>
                    <p>{d.p}</p>
                    <div className="viz">
                      {d.id === "diary" && <DiaryViz lang={lang} />}
                      {d.id === "share" && <ShareViz lang={lang} />}
                      {d.id === "audit" && <Shot src="/shots/insights.jpg" alt="Swob Insights: tokens, sessions, active days, heatmap" />}
                      {d.id === "finder" && <Shot src="/shots/spotlight.jpg" alt="Swob Spotlight window listing sessions with Resume" />}
                    </div>
                    <div className="door-foot"><span>{d.cap}</span><span className="sl">{d.statusLine}</span></div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="engine-sec" id="engine">
        <div className="wrap">
          <div className="sec-head pre">
            <div><p className="eyebrow">{t.engine.eyebrow}</p><h2>{t.engine.h2}</h2></div>
            <p className="side">{t.engine.side}</p>
          </div>
          <div className="engine">
            <ul className="eng-list">
              {t.engine.items.map((it, i) => (
                <li className="eng pre" key={i} style={v({ "--d": `${i * 0.08}s` })}>
                  <span className="n">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{it.h}</h3>
                    <p>{it.p}</p>
                    {"code" in it && it.code && <pre className="code">{it.code}</pre>}
                    {"link" in it && it.link && <a className="tlink" href={it.href}>{it.link} <span>→</span></a>}
                  </div>
                </li>
              ))}
            </ul>
            <div className="eng-shot pre">
              <Shot src="/shots/galaxy.jpg" alt="Session Galaxy force graph" cap={t.engine.shotCap} />
              <Shot src="/shots/reader.jpg" alt="Swob reader with tool calls, thinking and compact boundaries" />
            </div>
          </div>
        </div>
        <div className="stats"><div className="wrap">
          {t.engine.stats.map((s, i) => <div className="stat" key={i}><div className="nv">{s.n}</div><div className="l">{s.l}</div></div>)}
        </div></div>
      </section>

      <section className="company" id="company">
        <div className="wrap">
          <div className="pre">
            <p className="eyebrow">{t.company.eyebrow}</p>
            <h2>{t.company.h2}</h2>
            <p className="body">{t.company.p1}</p>
            <p className="body">{t.company.p2}</p>
            <div className="more">{t.company.links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noopener">{l.label} ↗</a>)}</div>
          </div>
          <div className="figs pre">
            {t.company.figs.map((f, i) => <div className="fig" key={i}><div className="nv">{f.n}</div><div className="l">{f.l}</div></div>)}
            <p className="srcnote">{t.company.figNote}</p>
          </div>
        </div>
      </section>

      <section className="end" id="download">
        <div className="wrap">
          <h2 className="big">{t.end.big}</h2>
          <p>{t.end.p}</p>
          <div className="cta">
            <a className="btn solid" href={DL.arm64}>{t.end.cta1}</a>
            <a className="btn" href={DL.x64}>{t.end.cta1x}</a>
            <a className="btn" href={lang === "en" ? "/docs/en/" : "/docs/"}>{t.end.cta2}</a>
          </div>
          <p className="note">v{VERSION} · macOS 13+ · <a href={DL.releases} target="_blank" rel="noopener">{t.footer.releases}</a></p>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <span>© {new Date().getFullYear()} {t.footer.rights} · Apache 2.0</span>
          <div className="fl">
            <a href={lang === "en" ? "/docs/en/" : "/docs/"}>{t.footer.docs}</a>
            <a href={p("/sources")}>{t.footer.sources}</a>
            <a href="https://github.com/IvyYang1999/swob/blob/master/PRIVACY.md" target="_blank" rel="noopener">{t.footer.privacy}</a>
            <a href={DL.github} target="_blank" rel="noopener">{t.footer.github}</a>
            <a href="mailto:support@swob.app">{t.footer.support}</a>
            <a href="https://darkconstant.com" target="_blank" rel="noopener">Dark Constant</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
