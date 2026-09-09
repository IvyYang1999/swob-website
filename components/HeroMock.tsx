"use client";
import { useEffect, useState, type CSSProperties } from "react";
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
      <div className="mock" data-phase={phase} aria-label={m.aria} role="img">
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
          <main className="m-main">
            <div className="m-tabs"><span className="on">{m.tabs[0]}</span><span>{m.tabs[1]}</span><span>{m.tabs[2]}</span></div>
            <div className="m-pill">{m.compact}</div>
            <div className="m-msg u"><span className="av">U</span><div><div className="who">{m.user}</div><p>{m.u1a}<mark>{m.u1b}</mark>{m.u1c}</p></div></div>
            <div className="m-msg a"><span className="av">A</span><div><div className="who">{m.assistant}</div>
              <div className="m-chips"><span>Read ×3</span><span>Grep</span><span>Edit</span></div>
              <p>{m.a1a}<mark>{m.a1b}</mark>{m.a1c}</p></div></div>
            <div className="m-term"><span className="ok">$</span> {m.term}</div>
          </main>
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
