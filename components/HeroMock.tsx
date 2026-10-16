"use client";
import { useEffect, useId, useState, type CSSProperties } from "react";
import { MOCK, type Lang } from "@/data/site";

type Phase = "collect" | "search" | "resume";
const ORDER: Phase[] = ["collect", "search", "resume"];
const LEN: Record<Phase, number> = { collect: 4200, search: 4600, resume: 4200 };
const v = (vars: Record<string, string | number>) => vars as CSSProperties;
type Item = { hue: number; tool: string; project: string; when: string; title: string; hit?: boolean; sel?: boolean };

/** A looping, three-beat demo of the library: sessions arrive → a fuzzy search narrows them → one is resumed. */
export default function HeroMock({ lang }: { lang: Lang }) {
  const m = MOCK[lang];
  const items = m.items as readonly Item[];
  const [phase, setPhase] = useState<Phase>("collect");
  const [typed, setTyped] = useState("");
  const [mode, setMode] = useState(0);
  const readerId = useId();
  const markdown = `## ${m.user}\n\n${m.u1a}${m.u1b}${m.u1c}\n\n## ${m.assistant}\n\n${m.a1a}${m.a1b}${m.a1c}`;

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setPhase("search"); setTyped(m.query); return; }
    let i = 0; let alive = true; const timers: number[] = [];
    const run = () => {
      if (!alive) return;
      const ph = ORDER[i % ORDER.length]; setPhase(ph);
      if (ph === "collect") setTyped("");
      if (ph === "search") { let k = 0; const tick = () => { if (!alive) return; k++; setTyped(m.query.slice(0, k)); if (k < m.query.length) timers.push(window.setTimeout(tick, 70 + Math.random() * 60)); }; timers.push(window.setTimeout(tick, 500)); }
      i++; timers.push(window.setTimeout(run, LEN[ph]));
    };
    run();
    return () => { alive = false; timers.forEach(clearTimeout); };
  }, [m.query]);

  const q = typed.toLowerCase();
  const hit = (s: Item) => phase !== "collect" && !!s.hit && (q.length >= 3 || phase === "resume");

  return (
    <div className="stage">
      <div className="mock" data-phase={phase} aria-label={m.aria} role="group">
        <div className="m-top">
          <div className="m-lights"><i /><i /><i /></div>
          <div className="m-search">
            <span aria-hidden="true">⌕</span>
            {typed ? <span className="q">{typed}</span> : <span>{m.placeholder}</span>}
            <span className="caret" />
            <span className="kbd">⌘K</span>
          </div>
        </div>
        <div className="m-body">
          <aside className="m-side">
            <p className="m-h">{m.sessions}</p>
            {items.map((s, k) => (
              <div key={k} className={`m-item hued${hit(s) ? " hit" : ""}${s.sel ? " sel" : ""}`} style={v({ "--h": s.hue, "--d": `${0.1 + k * 0.13}s` })}>
                <i /><div><b>{s.title}</b><small><em>{s.tool}</em> · {s.project} · {s.when}</small></div>
              </div>
            ))}
          </aside>
          <div className="m-main">
            <div className="m-tabs" role="tablist" aria-label={lang === "zh" ? "阅读模式" : "Reader mode"}>
              {m.tabs.map((label, index) => <button key={label} type="button" role="tab"
                id={`${readerId}-tab-${index}`} aria-controls={`${readerId}-panel`} aria-selected={mode === index}
                tabIndex={mode === index ? 0 : -1} onClick={() => setMode(index)}
                onKeyDown={(event) => {
                  const next = event.key === "ArrowRight" ? (index + 1) % 3 : event.key === "ArrowLeft" ? (index + 2) % 3 : event.key === "Home" ? 0 : event.key === "End" ? 2 : undefined;
                  if (next === undefined) return;
                  event.preventDefault(); setMode(next);
                  event.currentTarget.parentElement?.querySelectorAll("button")[next]?.focus();
                }}>{label}</button>)}
            </div>
            <div className="m-reader" id={`${readerId}-panel`} role="tabpanel" aria-labelledby={`${readerId}-tab-${mode}`} tabIndex={0} data-mode={mode}>
            {mode === 2 ? <pre className="m-markdown">{markdown}</pre> : <>
            <div className="m-pill">{m.compact}</div>
            <div className="m-msg u"><span className="av">U</span><div><div className="who">{m.user}</div><p>{m.u1a}<mark>{m.u1b}</mark>{m.u1c}</p></div></div>
            <div className="m-msg a"><span className="av">A</span><div><div className="who">{m.assistant}</div>
              <div className="m-chips"><span>Read ×3</span><span>Grep</span><span>Edit</span></div>
              {mode === 1 && <pre className="m-tool-detail">{`Read  config.ts, auth.ts, routes.ts\nGrep  /oauth/cb\nEdit  callbackUrl → app.example.com/oauth/cb`}</pre>}
              <p>{m.a1a}<mark>{m.a1b}</mark>{m.a1c}</p></div></div>
            </>}
            </div>
            <div className="m-term"><span className="ok">$</span> {m.term}</div>
          </div>
          <aside className="m-info">
            <p className="m-h">{m.info}</p>
            {m.rows.map((r, k) => <div className="row" key={k}><span className="lb">{r[0]}</span><b>{r[1]}{r[2] && <span className="tag">{r[2]}</span>}</b></div>)}
            <ul className="m-tree">{m.tree.map((t, k) => <li key={k} className={k === m.tree.length - 1 ? "cur" : ""}>{t}</li>)}</ul>
            <div className="m-btns"><span className="m-btn go">{m.resume}</span><span className="m-btn">{m.share}</span></div>
          </aside>
        </div>
      </div>
      <p className="m-steps" aria-hidden="true">
        {ORDER.map((p) => <span key={p} className={p === phase ? "on" : ""}>{m.steps[p]}</span>)}
      </p>
    </div>
  );
}
