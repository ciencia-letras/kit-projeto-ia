/* ============================================================================
   Kit «O meu projeto IA em 7 fases» — backend do formulário (Google Apps Script)
   Ciência e Letras — Formação Especializada, Lda. · MIT
   ----------------------------------------------------------------------------
   Publicar numa conta Google do CeL: ver ../SETUP.md.

   Quando alguém submete o formulário da página do kit:
     1. Grava uma linha na Google Sheet do CeL (data, nome, email, organização,
        uso, consentimento, idioma, estado, origem).
     2. Envia ao requerente o link do PDF e dois convites (próximo curso aberto;
        workshop ou diagnóstico para equipas).
     3. Notifica a secretaria.

   ⚠️  REPOSITÓRIO PÚBLICO: aqui ficam só PLACEHOLDERS. Os valores reais (ID da
   Sheet, link do PDF, curso) colam-se apenas no editor do Apps Script, ou melhor,
   em Propriedades do script (Definições do projeto → Propriedades do script),
   que se sobrepõem aos valores abaixo. Nunca faça commit dos links reais.
   ========================================================================== */

/* ----------------------------- CONFIGURAÇÃO ------------------------------ */

const DEFAULTS = {
  SHEET_ID:        "COLE_AQUI_O_ID_DA_GOOGLE_SHEET",   // docs.google.com/spreadsheets/d/<ID>/edit
  SHEET_NAME:      "Pedidos kit 7 fases",
  PDF_URL_PT:      "COLE_AQUI_O_LINK_DO_PDF_NO_DRIVE", // partilha "qualquer pessoa com o link"
  PDF_URL_EN:      "",                                  // vazio = usa o PDF em português
  NOTIFY_EMAIL:    "secretaria@ciencia-letras.pt",
  REPLY_TO:        "secretaria@ciencia-letras.pt",
  SENDER_NAME:     "Ciência e Letras",
  COURSE_TITLE_PT: "COLE_AQUI_O_NOME_DO_PROXIMO_CURSO",
  COURSE_TITLE_EN: "",
  COURSE_DATES:    "COLE_AQUI_AS_DATAS",                // ex.: "12 a 26 de janeiro de 2027, online"
  COURSE_URL:      "https://www.ciencia-letras.pt/cursos/iniciacao-chatgpt-ia/",
  TEAMS_URL:       "mailto:secretaria@ciencia-letras.pt?subject=Workshop%20ou%20diagn%C3%B3stico%20para%20equipas",
  KIT_PAGE:        "https://ciencia-letras.github.io/kit-projeto-ia/"
};

function cfg_(key) {
  const v = PropertiesService.getScriptProperties().getProperty(key);
  return (v !== null && v !== "") ? v : DEFAULTS[key];
}
function isSet_(v) { return !!v && !/^COLE_AQUI/.test(v); }

const USOS = {
  "formacao-interna": { pt: "Formação interna", en: "In-house training" },
  "uso-pessoal":      { pt: "Uso pessoal",      en: "Personal use" },
  "docencia":         { pt: "Docência",         en: "Teaching" },
  "outro":            { pt: "Outro",            en: "Other" }
};

/* ------------------------------- ENDPOINT -------------------------------- */

function doPost(e) {
  try {
    const p = (e && e.parameter) ? e.parameter : {};
    const nome  = clip_(p.nome, 120);
    const email = clip_(p.email, 160);
    const org   = clip_(p.organizacao, 160);
    const uso   = clip_(p.uso, 40);
    const consent = p.consentimento === "sim";
    const lang  = p.lang === "en" ? "en" : "pt";
    const origem = clip_(p.origem, 300);

    if (p.website) return json_({ ok: true });                       // honeypot
    if (!nome || !email || !USOS[uso]) return json_({ ok: false, error: "Campos em falta." });
    if (!isEmail_(email)) return json_({ ok: false, error: "Email inválido." });
    if (!consent) return json_({ ok: false, error: "Sem consentimento." });

    const pdf = (lang === "en" && isSet_(cfg_("PDF_URL_EN"))) ? cfg_("PDF_URL_EN") : cfg_("PDF_URL_PT");
    const canSend = isSet_(pdf);

    // Evita pedidos duplicados em rajada do mesmo email (1 por 10 min).
    const cache = CacheService.getScriptCache();
    const key = "k:" + email.toLowerCase();
    const repeated = !!cache.get(key);
    cache.put(key, "1", 600);

    if (canSend && !repeated) sendRequesterEmail_(email, nome, lang, pdf);

    const estado = !canSend ? "SEM LINK — enviar à mão" : (repeated ? "repetido (não reenviado)" : "enviado");
    appendRow_([new Date(), nome, email, org, USOS[uso].pt, "sim · " + new Date().toISOString(), lang, estado, origem]);

    const notify = cfg_("NOTIFY_EMAIL");
    if (notify) {
      MailApp.sendEmail({
        to: notify,
        subject: "Kit 7 fases: novo pedido" + (canSend ? "" : " (ENVIAR À MÃO)"),
        name: cfg_("SENDER_NAME"),
        body: [
          "Novo pedido do kit «O meu projeto IA em 7 fases».", "",
          "Nome: " + nome, "Email: " + email, "Organização: " + (org || "—"),
          "Uso: " + USOS[uso].pt, "Idioma: " + lang, "Estado: " + estado, "Origem: " + origem
        ].join("\n")
      });
    }
    return json_({ ok: true, pending: !canSend });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: "Erro no servidor." });
  }
}

// GET: confirma no browser que a Web App está no ar.
function doGet() {
  return HtmlService.createHtmlOutput("<p>Kit 7 fases: serviço de pedidos ativo.</p>");
}

/* ------------------------------- EMAIL ----------------------------------- */

const STR = {
  pt: {
    subject: "O seu kit «O meu projeto IA em 7 fases»",
    hi: "Olá ", intro: "Obrigado pelo interesse. O kit completo, com as sete fases, as checklists e o prompt final, está aqui:",
    btn: "Descarregar o kit (PDF)", fallback: "Se o botão não funcionar, copie este endereço: ",
    tip: "Uma sugestão: faça a fase 4 com a pesquisa web ligada e abra sempre a fonte oficial antes de confiar num programa, prazo ou valor.",
    nextTitle: "Se quiser ir mais longe",
    course: "Próximo curso aberto", courseBtn: "Ver o curso e inscrever-se",
    teams: "Para equipas: esta simulação, adaptada aos projetos do seu serviço, numa manhã de workshop, ou um diagnóstico das necessidades de literacia em IA da equipa.",
    teamsBtn: "Falar com o CeL",
    cite: "Pode usar e adaptar o kit (CC BY 4.0), desde que cite: Correia, R. (2026). O meu projeto IA em 7 fases. Ciência e Letras. ",
    sign: "Com os melhores cumprimentos,", team: "A equipa do Ciência e Letras",
    rgpd: "Recebe este email porque pediu o kit e deu o seu consentimento. Para aceder, corrigir ou apagar os seus dados, responda a este email ou escreva para secretaria@ciencia-letras.pt."
  },
  en: {
    subject: "Your kit «My AI project in 7 phases»",
    hi: "Hello ", intro: "Thank you for your interest. The full kit, with all seven phases, the checklists and the closing prompt, is here (in Portuguese):",
    btn: "Download the kit (PDF)", fallback: "If the button doesn't work, copy this address: ",
    tip: "One tip: do phase 4 with web search switched on and always open the official source before trusting a programme, deadline or amount.",
    nextTitle: "If you want to go further",
    course: "Next open course", courseBtn: "See the course and enrol",
    teams: "For teams: this simulation, adapted to your team's projects, in a one-morning workshop, or an assessment of your team's AI literacy needs.",
    teamsBtn: "Contact CeL",
    cite: "You may use and adapt the kit (CC BY 4.0) as long as you cite: Correia, R. (2026). My AI project in 7 phases. Ciência e Letras. ",
    sign: "Kind regards,", team: "The Ciência e Letras team",
    rgpd: "You are receiving this email because you requested the kit and gave your consent. To access, correct or delete your data, reply to this email or write to secretaria@ciencia-letras.pt."
  }
};

function sendRequesterEmail_(email, nome, lang, pdf) {
  const s = STR[lang];
  const first = esc_(nome.split(/\s+/)[0]);
  const courseTitle = (lang === "en" && cfg_("COURSE_TITLE_EN")) ? cfg_("COURSE_TITLE_EN") : cfg_("COURSE_TITLE_PT");
  const hasCourse = isSet_(courseTitle);
  const dates = isSet_(cfg_("COURSE_DATES")) ? cfg_("COURSE_DATES") : "";
  const page = cfg_("KIT_PAGE");
  const btn = (href, label, bg) => '<a href="' + esc_(href) + '" style="display:inline-block;background:' + bg +
    ';color:#fff;padding:11px 22px;border-radius:999px;text-decoration:none;font-weight:bold;text-transform:uppercase;font-size:13px;letter-spacing:.4px;">' + label + '</a>';

  const html =
    '<div style="font-family:\'Open Sans\',Arial,sans-serif;color:#4a4a4a;line-height:1.6;max-width:600px;">' +
      '<div style="background:#2F4E5E;color:#fff;padding:16px 22px;border-radius:12px 12px 0 0;font-family:\'Roboto Condensed\',Arial,sans-serif;font-size:20px;font-weight:bold;">' +
        'Ciência e Letras <span style="color:#F79135;">·</span> ' + esc_(s.subject.replace(/^[^«]*/, "")) + '</div>' +
      '<div style="border:1px solid #e2e2e2;border-top:0;padding:20px 22px;border-radius:0 0 12px 12px;">' +
        '<p>' + s.hi + first + ',</p><p>' + s.intro + '</p>' +
        '<p>' + btn(pdf, s.btn, "#F79135") + '</p>' +
        '<p style="font-size:12.5px;color:#74808D;word-break:break-all;">' + s.fallback + esc_(pdf) + '</p>' +
        '<p style="background:#FFE5CE;border-radius:10px;padding:10px 14px;">' + s.tip + '</p>' +
        '<h3 style="font-family:\'Roboto Condensed\',Arial,sans-serif;color:#2F4E5E;margin:26px 0 6px;">' + s.nextTitle + '</h3>' +
        (hasCourse
          ? '<p><strong style="color:#2F4E5E;">' + s.course + ':</strong> ' + esc_(courseTitle) + (dates ? ' · ' + esc_(dates) : '') + '</p>' +
            '<p>' + btn(cfg_("COURSE_URL"), s.courseBtn, "#2F4E5E") + '</p>'
          : '') +
        '<p>' + s.teams + '</p><p>' + btn(cfg_("TEAMS_URL"), s.teamsBtn, "#2F4E5E") + '</p>' +
        '<p style="font-size:13px;color:#74808D;margin-top:22px;">' + s.cite + '<a href="' + esc_(page) + '" style="color:#2F4E5E;">' + esc_(page) + '</a></p>' +
        '<p style="margin-top:22px;">' + s.sign + '<br><strong style="color:#2F4E5E;">' + s.team + '</strong><br>' +
          '<span style="font-size:13px;">UPTEC Asprela I · Rua Alfredo Allen, 455/461 · 4200-135 Porto<br>www.ciencia-letras.pt · secretaria@ciencia-letras.pt</span></p>' +
        '<p style="font-size:11.5px;color:#8a8a8a;border-top:1px solid #e2e2e2;padding-top:10px;">' + s.rgpd + '</p>' +
      '</div></div>';

  const plain = [
    s.hi + nome.split(/\s+/)[0] + ",", "", s.intro, pdf, "", s.tip, "", s.nextTitle,
    hasCourse ? s.course + ": " + courseTitle + (dates ? " · " + dates : "") + "\n" + cfg_("COURSE_URL") : "",
    s.teams, cfg_("TEAMS_URL"), "", s.cite + page, "", s.sign, s.team,
    "UPTEC Asprela I · Rua Alfredo Allen, 455/461 · 4200-135 Porto", "www.ciencia-letras.pt · secretaria@ciencia-letras.pt", "", s.rgpd
  ].join("\n");

  MailApp.sendEmail({ to: email, subject: s.subject, name: cfg_("SENDER_NAME"), replyTo: cfg_("REPLY_TO"), body: plain, htmlBody: html });
}

/* ------------------------------- SHEET ----------------------------------- */

function appendRow_(row) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.openById(cfg_("SHEET_ID"));
    let sh = ss.getSheetByName(cfg_("SHEET_NAME"));
    if (!sh) sh = ss.insertSheet(cfg_("SHEET_NAME"));
    if (sh.getLastRow() === 0) {
      sh.appendRow(["Data", "Nome", "Email", "Organização", "Para que vai usar", "Consentimento", "Idioma", "Estado", "Origem"]);
      sh.getRange(1, 1, 1, 9).setFontWeight("bold");
      sh.setFrozenRows(1);
    }
    sh.appendRow(row.map(safeCell_));
  } finally {
    lock.releaseLock();
  }
}

/* ------------------------------- HELPERS --------------------------------- */

function clip_(v, n) { return (v || "").toString().trim().slice(0, n); }
function isEmail_(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function esc_(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
// Evita injeção de fórmulas na folha (=, +, -, @ no início de um campo de texto).
function safeCell_(v) { return (typeof v === "string" && /^[=+\-@]/.test(v)) ? "'" + v : v; }

/* Teste manual no editor: Executar → testeEnvio (envia para o seu próprio email). */
function testeEnvio() {
  const me = Session.getActiveUser().getEmail();
  const r = doPost({ parameter: { nome: "Teste CeL", email: me, organizacao: "CeL", uso: "outro", consentimento: "sim", lang: "pt", origem: "teste" } });
  console.log(r.getContent());
}
