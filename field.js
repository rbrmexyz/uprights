// Paints each .field as a real field seen from above: yard lines every 5 yards
// (one --row) and hash ticks every yard. It redraws on resize, so it always fits the window.
(() => {
  const NS = "http://www.w3.org/2000/svg";
  function el(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function paint(field) {
    let svg = field.querySelector(":scope > svg.markings");
    if (!svg) { svg = el("svg", { class: "markings", "aria-hidden": "true" }); field.prepend(svg); }
    svg.replaceChildren();
    const W = document.documentElement.clientWidth;
    const H = field.offsetHeight;
    const row = parseFloat(getComputedStyle(field).getPropertyValue("--row-px")) ||
                field.querySelector(".row-probe")?.offsetHeight || 100;
    const lw = 3;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("width", W);
    svg.setAttribute("height", H);
    const g = el("g", { fill: "#fff" });
    svg.append(g);
    const narrow = W < 680;
    const edgeTick = narrow ? [8, W - 8 - 14] : [W * 0.03, W * 0.97 - 18];
    const hashes = [W / 2 - 58, W / 2 + 40];
    // Yard lines and one-yard ticks.
    for (let y = 0, n = 0; y <= H + 1; y += row / 5, n++) {
      if (n % 5 === 0) {
        // Skip a line that would crowd the goal line under the footer.
        if (n > 0 && H - y > row * 0.35) g.append(el("rect", { x: 0, y: y - lw, width: W, height: lw }));
      } else {
        for (const x of edgeTick) g.append(el("rect", { x, y: y - 1, width: narrow ? 14 : 18, height: 2 }));
        for (const x of hashes) g.append(el("rect", { x, y: y - 1, width: 18, height: 2 }));
      }
    }
  }
  const all = () => document.querySelectorAll(".field").forEach(paint);
  const go = () => (document.fonts?.ready ?? Promise.resolve()).then(all);
  go();
  addEventListener("resize", all);
  new ResizeObserver(all).observe(document.body);
})();
