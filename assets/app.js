/* Page language. Portuguese by default (<html lang="pt-PT">); the EN/PT buttons in the CeL header set <html lang>.
 * Page text lives in the HTML as pairs of elements with data-l="pt" / data-l="en"; CSS shows the one that matches <html lang>.
 * ?lang=en (or ?lang=pt) in the URL forces a language. This file updates <title>, <option> labels and fires "langchange". */
(function (g) {
  "use strict";
  const TITLE = {
    pt: "O meu projeto IA em 7 fases · Ciência e Letras",
    en: "My AI project in 7 phases · Ciência e Letras",
  };
  const q = new URLSearchParams(location.search).get("lang");
  try { if (q === "pt" || q === "en") localStorage.setItem("celLang", q); } catch (e) {}
  const lang = () => ((document.documentElement.lang || "pt").toLowerCase().startsWith("pt") ? "pt" : "en");
  function apply() {
    const L = lang();
    document.title = TITLE[L];
    document.querySelectorAll("option[data-pt]").forEach(o => { o.textContent = o.dataset[L]; });
    document.dispatchEvent(new Event("langchange"));
  }
  new MutationObserver(apply).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  document.addEventListener("DOMContentLoaded", apply);
  g.PAGE = { lang };
})(window);
