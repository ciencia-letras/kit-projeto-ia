# Setup: request form → Google Sheet + email · Configuração do formulário

**[English](#english)** · **[Português](#português)**

## English

The kit page sends the form to a Google Apps Script Web App, which saves the request in a CeL Google Sheet, emails the requester the PDF link and two invitations, and notifies the CeL office. Use a **CeL Google account** (e.g. the office account), not a personal one.

1. **PDF.** Upload `dist/kit-projeto-ia-7-fases.pdf` to the CeL Google Drive. Share → "Anyone with the link" → Viewer. Copy the link.
2. **Sheet.** Create an empty Google Sheet (e.g. "Kit 7 fases — pedidos"). Copy its ID from the URL: `docs.google.com/spreadsheets/d/<ID>/edit`.
3. **Script.** In the Sheet: Extensions → Apps Script. Replace the contents of `Code.gs` with `apps-script/Code.gs` from this repo.
4. **Real values, outside the repo.** Project Settings (gear) → Script properties → add: `SHEET_ID`, `PDF_URL_PT`, `COURSE_TITLE_PT`, `COURSE_DATES`, `COURSE_URL` (and optionally `PDF_URL_EN`, `COURSE_TITLE_EN`, `NOTIFY_EMAIL`). Script properties override the placeholders in the code, so the code can stay identical to the public repo.
5. **Test.** Select the `testeEnvio` function → Run → authorise (Sheets, Gmail, Script properties). You should get the email and see a row in the Sheet.
6. **Deploy.** Deploy → New deployment → type **Web app** · Execute as: **Me** · Who has access: **Anyone**. Copy the URL ending in `/exec`.
7. **Connect the page.** In `index.html`, set `CONFIG.endpoint` to that URL, commit and push. (The `/exec` URL is not secret: it only accepts form submissions.)
8. **Updating.** After editing the script: Deploy → Manage deployments → edit → Version: *New version*. The `/exec` URL stays the same.

If the PDF link is not set, requests are still recorded, the page tells the person the office will send the kit, and the office is notified with "ENVIAR À MÃO".

Requests stay in the Sheet. To honour a deletion request, delete the row. Consent and its timestamp are in the "Consentimento" column.

## Português

A página do kit envia o formulário para uma Web App do Google Apps Script, que grava o pedido numa Google Sheet do CeL, envia ao requerente o link do PDF e dois convites e notifica a secretaria. Use uma **conta Google do CeL** (por exemplo, a da secretaria), não uma conta pessoal.

1. **PDF.** Carregue `dist/kit-projeto-ia-7-fases.pdf` no Google Drive do CeL. Partilhar → «Qualquer pessoa com o link» → Leitor. Copie o link.
2. **Folha.** Crie uma Google Sheet vazia (ex.: «Kit 7 fases — pedidos»). Copie o ID do URL: `docs.google.com/spreadsheets/d/<ID>/edit`.
3. **Script.** Na folha: Extensões → Apps Script. Substitua o conteúdo de `Code.gs` pelo `apps-script/Code.gs` deste repositório.
4. **Valores reais, fora do repositório.** Definições do projeto (roda dentada) → Propriedades do script → acrescente: `SHEET_ID`, `PDF_URL_PT`, `COURSE_TITLE_PT`, `COURSE_DATES`, `COURSE_URL` (e, se quiser, `PDF_URL_EN`, `COURSE_TITLE_EN`, `NOTIFY_EMAIL`). As propriedades sobrepõem-se aos placeholders, por isso o código pode ficar igual ao do repositório público.
5. **Teste.** Escolha a função `testeEnvio` → Executar → autorize (Sheets, Gmail, propriedades). Deve receber o email e ver uma linha na folha.
6. **Publicar.** Implementar → Nova implementação → tipo **Aplicação Web** · Executar como: **Eu** · Quem tem acesso: **Qualquer pessoa**. Copie o URL que termina em `/exec`.
7. **Ligar a página.** Em `index.html`, ponha esse URL em `CONFIG.endpoint`, faça commit e push. (O URL `/exec` não é secreto: só aceita submissões do formulário.)
8. **Atualizar.** Depois de alterar o script: Implementar → Gerir implementações → editar → Versão: *Nova versão*. O URL `/exec` mantém-se.

Se o link do PDF não estiver definido, os pedidos ficam registados, a página diz à pessoa que a secretaria lhe enviará o kit e a secretaria recebe a notificação com «ENVIAR À MÃO».

Os pedidos ficam na folha. Para cumprir um pedido de apagamento, apague a linha. O consentimento e a respetiva data estão na coluna «Consentimento».
