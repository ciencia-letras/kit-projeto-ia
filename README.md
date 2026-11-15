# My AI project in 7 phases

<!-- cel:badge -->
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.24243385.svg)](https://doi.org/10.5281/zenodo.24243385)
<!-- /cel:badge -->

**[English](#english)** · **[Português](#português)**

Live: **https://ciencia-letras.github.io/kit-projeto-ia/**

---

## English

One conversation with an AI assistant takes a workplace initiative from first idea to dissemination, in seven phases. Each phase has a technique, a prompt to fill in, an iteration and a checklist. A teaching resource of the Ciência e Letras generative AI courses.

### What is in this repository

- `index.html`: the public page (Portuguese by default, English with the EN/PT switch): what the kit is, how it works, the starting prompt, the project card and phase 1 in full with Copy buttons, phases 2–7 in summary, the request form, CeL courses, transparency and licence.
- `assets/kit.js`: Copy buttons and the form. The form posts to `CONFIG.endpoint` (top of `index.html`). While it is empty, or if sending fails, the page offers a pre-filled email to secretaria@ciencia-letras.pt. It never fails silently.
- `apps-script/Code.gs` + [SETUP.md](SETUP.md): Google Apps Script backend (CeL Google Sheet, email with the PDF link and two invitations, notification to the CeL office). Placeholders only: real links go in Script properties, never in this repo.
- `_pdf/kit.html` + `_pdf/build_pdf.py`: source of the full-kit PDF. The `_pdf/` folder is not published by GitHub Pages, and the PDF itself (`dist/`) is ignored by git: it is delivered by email after the form.

### Run locally

```bash
python3 -m http.server 8000      # then open http://localhost:8000/
pip install playwright && python -m playwright install chromium
python _pdf/build_pdf.py         # -> dist/kit-projeto-ia-7-fases.pdf
```

### Limits

The prompts are a teaching exercise, not legal or funding advice. Funding programmes named in phase 4 are examples: always confirm on the official source. The kit supports AI literacy (Article 4 of the EU AI Act); it does not certify compliance. Prepared with the help of generative AI and reviewed by the author.

### Use and citation

<!-- cel:cite:en -->
© 2026 Ciência e Letras — Formação Especializada, Lda. · Author: Ricardo Correia.

Any institution may use, adapt and share this tool, including in teaching and training, **as long as it cites it**. Code: MIT ([LICENSE](LICENSE)). Content: CC BY 4.0 ([LICENSE-CONTENT](LICENSE-CONTENT)).

> Correia, R. (2026). *My AI project in 7 phases: a practical simulation kit for generative AI* (Version 1.0.0) [Computer software]. Ciência e Letras. https://doi.org/10.5281/zenodo.24243385

Archived on Zenodo: version DOI [10.5281/zenodo.24243385](https://doi.org/10.5281/zenodo.24243385), all versions [10.5281/zenodo.24243384](https://doi.org/10.5281/zenodo.24243384), in the [Ciência e Letras community](https://zenodo.org/communities/ciencia-letras).

GitHub's “Cite this repository” button (from [CITATION.cff](CITATION.cff)) gives APA and BibTeX.
<!-- /cel:cite:en -->

---

## Português

Uma conversa com um assistente de IA leva uma iniciativa de trabalho da primeira ideia à divulgação, em sete fases. Cada fase tem uma técnica, um prompt para preencher, uma iteração e uma checklist. Um recurso pedagógico dos cursos de IA generativa do Ciência e Letras.

### O que está neste repositório

- `index.html`: a página pública (português por omissão, inglês pelo seletor EN/PT): o que é, como funciona, prompt inicial, cartão do projeto e fase 1 completos com botões Copiar, fases 2–7 em resumo, formulário, cursos do CeL, transparência e licença.
- `assets/kit.js`: botões Copiar e formulário. O formulário envia para `CONFIG.endpoint` (no topo do `index.html`). Enquanto estiver vazio, ou se o envio falhar, a página propõe um email já preenchido para secretaria@ciencia-letras.pt. Nunca falha em silêncio.
- `apps-script/Code.gs` + [SETUP.md](SETUP.md): backend em Google Apps Script (Google Sheet do CeL, email com o link do PDF e dois convites, notificação à secretaria). Só placeholders: os links reais vão para as propriedades do script, nunca para este repositório.
- `_pdf/kit.html` + `_pdf/build_pdf.py`: fonte do PDF do kit completo. A pasta `_pdf/` não é publicada pelo GitHub Pages e o PDF (`dist/`) é ignorado pelo git: é entregue por email depois do formulário.

### Correr localmente

```bash
python3 -m http.server 8000      # depois abrir http://localhost:8000/
pip install playwright && python -m playwright install chromium
python _pdf/build_pdf.py         # -> dist/kit-projeto-ia-7-fases.pdf
```

### Limites

Os prompts são um exercício de formação, não aconselhamento jurídico nem sobre financiamento. Os programas referidos na fase 4 são exemplos: confirme sempre na fonte oficial. O kit apoia a literacia em IA (art. 4.º do Regulamento da IA); não certifica conformidade. Preparado com apoio de IA generativa e revisto pelo autor.

### Utilização e citação

<!-- cel:cite:pt -->
© 2026 Ciência e Letras — Formação Especializada, Lda. · Autor: Ricardo Correia.

Qualquer instituição pode usar, adaptar e partilhar esta ferramenta, incluindo em ensino e formação, **desde que a cite**. Código: MIT ([LICENSE](LICENSE)). Conteúdos: CC BY 4.0 ([LICENSE-CONTENT](LICENSE-CONTENT)).

> Correia, R. (2026). *My AI project in 7 phases: a practical simulation kit for generative AI* (Version 1.0.0) [Computer software]. Ciência e Letras. https://doi.org/10.5281/zenodo.24243385

Arquivado no Zenodo: DOI desta versão [10.5281/zenodo.24243385](https://doi.org/10.5281/zenodo.24243385), de todas as versões [10.5281/zenodo.24243384](https://doi.org/10.5281/zenodo.24243384), na [comunidade Ciência e Letras](https://zenodo.org/communities/ciencia-letras).

O botão “Cite this repository” do GitHub (a partir de [CITATION.cff](CITATION.cff)) dá APA e BibTeX.
<!-- /cel:cite:pt -->
