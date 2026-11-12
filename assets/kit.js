/* Copy buttons and the request form.
 * The form posts to window.CONFIG.endpoint (Google Apps Script Web App). With no endpoint, or if anything fails,
 * it always shows the email alternative: it never fails silently. */
(function () {
  "use strict";
  const CFG = Object.assign({ endpoint: "", email: "secretaria@ciencia-letras.pt" }, window.CONFIG || {});
  const L = () => (window.PAGE ? window.PAGE.lang() : "pt");
  const S = {
    pt: {
      copy: "Copiar", copied: "Copiado ✓", copyFail: "Selecione o texto e copie",
      subject: "Pedido do kit «O meu projeto IA em 7 fases»",
      body: (d) => `Olá,\n\nGostaria de receber o kit completo «O meu projeto IA em 7 fases».\n\nNome: ${d.nome}\nOrganização: ${d.organizacao || "—"}\nPara que vou usar: ${d.usoTxt}\n\nAceito que o Ciência e Letras trate estes dados para me enviar o kit, com informação sobre os seus cursos de IA.\n`,
      noEndpoint: (m) => `Por agora, o kit é enviado pela secretaria. <a href="${m}">Peça o kit por email a ${CFG.email}</a> (o assunto e os seus dados ficam preenchidos).`,
      submitMail: "Pedir por email",
      fix: "Falta preencher: ",
      fields: { nome: "nome", email: "email válido", uso: "para que vai usar", consentimento: "consentimento" },
      sending: "A enviar…",
      ok: (e) => `Pedido registado. Enviámos o link do kit para <strong>${e}</strong>. Se não o receber em 10 minutos, veja a pasta de spam ou escreva para <a href="mailto:${CFG.email}">${CFG.email}</a>.`,
      pending: (m) => `Pedido registado. A secretaria vai enviar-lhe o kit por email nos próximos dias úteis. Se preferir, <a href="${m}">escreva-nos diretamente</a>.`,
      err: (m) => `Não foi possível enviar o pedido agora. <a href="${m}">Peça o kit por email a ${CFG.email}</a> (o assunto e os seus dados ficam preenchidos).`,
    },
    en: {
      copy: "Copy", copied: "Copied ✓", copyFail: "Select the text and copy it",
      subject: "Request: kit «O meu projeto IA em 7 fases» (My AI project in 7 phases)",
      body: (d) => `Hello,\n\nI would like to receive the full kit "My AI project in 7 phases".\n\nName: ${d.nome}\nOrganisation: ${d.organizacao || "—"}\nWhat I will use it for: ${d.usoTxt}\n\nI agree that Ciência e Letras may process this data to email me the kit, together with information about its AI courses.\n`,
      noEndpoint: (m) => `For now, the kit is sent by the CeL office. <a href="${m}">Request the kit by email from ${CFG.email}</a> (subject and your details are filled in).`,
      submitMail: "Request by email",
      fix: "Please fill in: ",
      fields: { nome: "name", email: "a valid email", uso: "what you will use it for", consentimento: "consent" },
      sending: "Sending…",
      ok: (e) => `Request received. We have emailed the kit link to <strong>${e}</strong>. If it hasn't arrived within 10 minutes, check your spam folder or write to <a href="mailto:${CFG.email}">${CFG.email}</a>.`,
      pending: (m) => `Request received. The CeL office will email you the kit within the next working days. If you prefer, <a href="${m}">write to us directly</a>.`,
      err: (m) => `We couldn't send your request right now. <a href="${m}">Request the kit by email from ${CFG.email}</a> (subject and your details are filled in).`,
    },
  };
  const t = () => S[L()];
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- copy buttons ---------- */
  function labelCopy() { document.querySelectorAll("button.copy:not(.ok)").forEach(b => { b.textContent = S[b.closest("[data-l]")?.dataset.l || L()].copy; }); }
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) {}
    try {
      const ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select(); const ok = document.execCommand("copy"); ta.remove(); return ok;
    } catch (e) { return false; }
  }
  document.addEventListener("click", async (e) => {
    const b = e.target.closest("button.copy"); if (!b) return;
    const pre = document.getElementById(b.dataset.copy); if (!pre) return;
    const lang = b.closest("[data-l]")?.dataset.l || L();
    const ok = await copyText(pre.textContent);
    if (ok) { b.textContent = S[lang].copied; b.classList.add("ok"); }
    else { b.textContent = S[lang].copyFail; const r = document.createRange(); r.selectNodeContents(pre); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
    setTimeout(() => { b.classList.remove("ok"); b.textContent = S[lang].copy; }, 2200);
  });

  /* ---------- form ---------- */
  const form = document.getElementById("kit-form");
  if (!form) return;
  const st = document.getElementById("f-status");
  const btn = document.getElementById("f-submit");
  const hasEndpoint = /^https:\/\//.test((CFG.endpoint || "").trim());

  function data() {
    const f = new FormData(form), sel = form.uso;
    return {
      nome: (f.get("nome") || "").toString().trim(),
      email: (f.get("email") || "").toString().trim(),
      organizacao: (f.get("organizacao") || "").toString().trim(),
      uso: (f.get("uso") || "").toString(),
      usoTxt: sel.selectedIndex > 0 ? sel.options[sel.selectedIndex].textContent : "—",
      consentimento: form.consentimento.checked,
      website: (f.get("website") || "").toString(),
    };
  }
  function mailto(d) {
    d = d || data();
    return `mailto:${CFG.email}?subject=${encodeURIComponent(t().subject)}&body=${encodeURIComponent(t().body(d))}`;
  }
  function show(kind, html) { st.className = "full status show " + kind; st.innerHTML = html; }
  function idle() {
    if (!hasEndpoint) show("info", t().noEndpoint(esc(mailto())));
    else if (!st.classList.contains("ok") && !st.classList.contains("err")) { st.className = "full status"; st.innerHTML = ""; }
    if (!hasEndpoint) btn.innerHTML = `<span>${t().submitMail}</span>`;
  }
  function missing(d) {
    const m = [];
    if (!d.nome) m.push("nome");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) m.push("email");
    if (!d.uso) m.push("uso");
    if (!d.consentimento) m.push("consentimento");
    return m;
  }

  form.addEventListener("input", () => { if (!hasEndpoint) show("info", t().noEndpoint(esc(mailto()))); });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const d = data();
    const m = missing(d);
    if (m.length) {
      show("err", esc(t().fix + m.map(k => t().fields[k]).join(", ") + "."));
      const first = { nome: "f-nome", email: "f-email", uso: "f-uso", consentimento: "f-consent" }[m[0]];
      document.getElementById(first).focus();
      return;
    }
    if (d.website) { show("ok", t().ok(esc(d.email))); return; } // honeypot: quietly accept bots
    if (!hasEndpoint) { location.href = mailto(d); show("info", t().noEndpoint(esc(mailto(d)))); return; }

    btn.disabled = true; const old = btn.innerHTML; btn.innerHTML = `<span>${t().sending}</span>`;
    const ctrl = "AbortController" in window ? new AbortController() : null;
    const timer = setTimeout(() => ctrl && ctrl.abort(), 20000);
    try {
      const body = new URLSearchParams({
        nome: d.nome, email: d.email, organizacao: d.organizacao, uso: d.uso,
        consentimento: "sim", lang: L(), origem: location.href.split("#")[0],
      });
      // Simple request (form-urlencoded, no custom headers): no CORS preflight. Apps Script answers with JSON after a redirect.
      const r = await fetch(CFG.endpoint.trim(), { method: "POST", body, signal: ctrl ? ctrl.signal : undefined, redirect: "follow" });
      if (!r.ok) throw new Error("HTTP " + r.status);
      const j = await r.json();
      if (!j || j.ok !== true) throw new Error((j && j.error) || "resposta inválida");
      if (j.pending) show("ok", t().pending(esc(mailto(d))));
      else { show("ok", t().ok(esc(d.email))); form.reset(); }
    } catch (err) {
      console.warn("Pedido do kit não enviado:", err && err.message ? err.message : err);
      show("err", t().err(esc(mailto(d))));
    } finally {
      clearTimeout(timer); btn.disabled = false; btn.innerHTML = old;
    }
  });

  document.addEventListener("langchange", () => { labelCopy(); idle(); });
  document.addEventListener("DOMContentLoaded", () => { labelCopy(); idle(); });
})();
