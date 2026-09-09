// Progressive enhancement: reveal on scroll, card glow follows the pointer, diary bars grow in.
export function mount() {
  const root = document.querySelector(".sw");
  if (!root) return () => {};
  root.classList.add("js");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  root.querySelectorAll(".pre").forEach((el) => (reduce ? el.classList.add("in") : io.observe(el)));
  const onMove = (e) => {
    const t = e.target.closest?.(".door, .eng, .case");
    if (!t) return;
    const r = t.getBoundingClientRect();
    t.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    t.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  root.addEventListener("pointermove", onMove, { passive: true });
  return () => { io.disconnect(); root.removeEventListener("pointermove", onMove); };
}
