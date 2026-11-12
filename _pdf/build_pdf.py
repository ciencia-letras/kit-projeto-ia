"""Generate the full-kit PDF from _pdf/kit.html with Chromium (Playwright).

    pip install playwright && python -m playwright install chromium
    python _pdf/build_pdf.py            ->  dist/kit-projeto-ia-7-fases.pdf

The PDF is ignored by git on purpose: it is delivered by email after the form, not published in the repo.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
OUT = HERE.parent / "dist" / "kit-projeto-ia-7-fases.pdf"

FOOTER = """<div style="width:100%;font:7.5pt 'Open Sans',Arial,sans-serif;color:#8a8a8a;padding:0 17mm;display:flex;justify-content:space-between;">
<span>O meu projeto IA em 7 fases · Ciência e Letras · CC BY 4.0</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>"""


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto((HERE / "kit.html").as_uri(), wait_until="networkidle")
        page.evaluate("document.fonts.ready")
        page.pdf(path=str(OUT), format="A4", print_background=True, prefer_css_page_size=True,
                 display_header_footer=True, header_template="<span></span>", footer_template=FOOTER)
        browser.close()
    print(f"PDF: {OUT}")


if __name__ == "__main__":
    main()
