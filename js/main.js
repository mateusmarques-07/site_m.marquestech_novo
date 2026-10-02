// M.marquestech · interações do site (JS puro, sem dependências)
(function () {
  const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Menu do celular
  const burger = document.getElementById("burger");
  const mnav = document.getElementById("mnav");
  if (burger && mnav) {
    burger.addEventListener("click", () => {
      const aberto = mnav.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(aberto));
      burger.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    });
    mnav.addEventListener("click", e => {
      if (e.target.closest("a")) { mnav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
    });
  }

  // Quadro do topo: alterna os produtos a cada 4,5 s; clicar numa aba para a troca automática
  const sw = document.getElementById("switch");
  if (sw) {
    const tabs = [...sw.querySelectorAll('[role="tab"]')];
    const panels = [...sw.querySelectorAll('[role="tabpanel"]')];
    let atual = 0, timer = null;
    const mostrar = i => {
      atual = i;
      tabs.forEach((t, j) => { const on = j === i; t.classList.toggle("on", on); t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; });
      panels.forEach((p, j) => { p.hidden = j !== i; });
      sw.style.setProperty("--c", tabs[i].style.getPropertyValue("--pc"));
      // reinicia a barrinha de progresso
      const on = tabs[i]; on.classList.remove("on"); void on.offsetWidth; on.classList.add("on");
    };
    const parar = () => { clearInterval(timer); sw.classList.remove("auto"); };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => { parar(); mostrar(i); });
      t.addEventListener("keydown", e => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault(); parar();
        const n = (atual + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
        mostrar(n); tabs[n].focus();
      });
    });
    mostrar(0);
    if (!reduz) { sw.classList.add("auto"); timer = setInterval(() => mostrar((atual + 1) % tabs.length), 4500); }
  }

  // Produtos: esteira (pausar/continuar) e "Ver todos os produtos" (grade parada)
  const prod = document.getElementById("produtos");
  const belt = document.getElementById("belt");
  const beltBtn = document.getElementById("belt-btn");
  const viewBtn = document.getElementById("view-btn");
  const pgrid = document.getElementById("pgrid");
  const pausar = on => {
    if (!belt) return;
    belt.classList.toggle("paused", on);
    if (beltBtn) { beltBtn.setAttribute("aria-pressed", String(on)); beltBtn.textContent = on ? "Continuar esteira" : "Pausar esteira"; }
  };
  if (beltBtn) beltBtn.addEventListener("click", () => pausar(!belt.classList.contains("paused")));
  if (belt) belt.addEventListener("touchstart", () => pausar(true), { passive: true });
  if (viewBtn && pgrid && prod && belt) {
    viewBtn.addEventListener("click", () => {
      const grade = !prod.classList.contains("grid-mode");
      if (grade && !pgrid.children.length) {
        // copia os 6 cards originais da esteira para a grade
        belt.querySelectorAll(".half:first-child > .pc:not(.rep)").forEach(c => pgrid.appendChild(c.cloneNode(true)));
      }
      prod.classList.toggle("grid-mode", grade);
      pgrid.hidden = !grade;
      viewBtn.setAttribute("aria-pressed", String(grade));
      viewBtn.textContent = grade ? "Voltar para a esteira" : "Ver todos os produtos";
    });
  }
})();
