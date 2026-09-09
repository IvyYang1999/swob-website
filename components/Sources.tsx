import { COPY, type Lang } from "@/data/site";
import matrix from "@/public/source-matrix.json";
import Fx from "@/components/Fx";
import { Mark } from "@/components/Site";

type Cap = "available" | "experimental" | "unavailable";
type Source = { sourceId: string; displayName: string; tier: string; capabilities: Record<string, Cap> };
const M = matrix as { generated: string; capabilities: string[]; sources: Source[] };
const G: Record<Cap, string> = { available: "●", experimental: "◐", unavailable: "○" };

export default function Sources({ lang }: { lang: Lang }) {
  const t = COPY[lang]; const s = t.sources; const zh = lang === "zh";
  return (
    <div className={`sw${zh ? " zh" : ""}`} lang={t.htmlLang}>
      <Fx />
      <nav><div className="wrap">
        <a className="brand" href={zh ? "/zh" : "/"}><Mark className="mark" />Swob</a>
        <div className="nav-r"><a className="lang" href={zh ? "/sources" : "/zh/sources"}>{t.switch.label}</a><a className="btn" href={zh ? "/zh" : "/"}>{s.back}</a></div>
      </div></nav>
      <section className="matrix-sec">
        <div className="wrap">
          <p className="eyebrow">{s.eyebrow}</p>
          <h2>{s.h2}</h2>
          <p className="body">{s.p}</p>
          <p className="legend">
            <span className="av">{G.available} {s.legend.available}</span>
            <span className="ex">{G.experimental} {s.legend.experimental}</span>
            <span className="un">{G.unavailable} {s.legend.unavailable}</span>
            <span className="gen">generated {M.generated}</span>
          </p>
          <div className="mwrap">
            <table className="matrix">
              <thead><tr><th>source</th>{M.capabilities.map((c) => <th key={c}><span>{c}</span></th>)}</tr></thead>
              <tbody>
                {M.sources.map((src) => (
                  <tr key={src.sourceId}>
                    <th><b>{src.displayName}</b><small>{src.tier}</small></th>
                    {M.capabilities.map((c) => { const k = src.capabilities[c] ?? "unavailable"; return <td key={c} className={k} title={`${src.displayName} · ${c}: ${k}`}>{G[k]}</td>; })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <footer><div className="wrap"><span>© {new Date().getFullYear()} Dark Constant · Apache 2.0</span></div></footer>
    </div>
  );
}
