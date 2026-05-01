from pathlib import Path
import re
from xml.sax.saxutils import escape

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.platypus import (
    HRFlowable,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "resume"
OUT.mkdir(parents=True, exist_ok=True)

FRONTMATTER_RE = re.compile(r"^---\n.*?\n---\n", re.S)
LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
BOLD_RE = re.compile(r"\*\*([^*]+)\*\*")
PAGE_TWO_BREAK = "Cloud Engineer II (Containers) / Containers Specialist | Amazon Web Services"

REPLACEMENTS = {
    "–": "-",
    "→": "->",
    "“": '"',
    "”": '"',
}

SUMMARY_REWRITE = {
    "en": {
        "Cloud-native engineer specializing in Kubernetes, EKS, large-scale cluster management, GitOps, and infrastructure automation. Extensive experience in production migrations, cost optimization, reliability engineering, observability, and incident response across enterprise and multi-cloud environments. Previously at Huawei, Amazon Web Services, Kong , CBA": "Cloud-native engineer specializing in Kubernetes, EKS, large-scale cluster management, GitOps, infrastructure automation, production migrations, cost optimization, reliability engineering, observability, and incident response across enterprise and multi-cloud environments.",
    },
    "zh": {
        "资深 Cloud-native 工程师，专注于 Kubernetes、EKS、大规模集群管理、GitOps 与基础设施自动化。在生产环境迁移、成本优化、可靠性工程、可观测性建设以及多云/企业级环境下的事故响应方面拥有丰富经验。": "资深 Cloud-native 工程师，专注于 Kubernetes、EKS、大规模集群管理、GitOps、基础设施自动化、生产迁移、成本优化、可靠性工程、可观测性建设以及企业级事故响应。",
    },
}


try:
    pdfmetrics.registerFont(UnicodeCIDFont("STSong-Light"))
except Exception:
    print("WARNING: Failed to register CJK font STSong-Light — Chinese PDF may render incorrectly")


def normalize(text: str) -> str:
    text = text.strip().replace("🔗 ", "")
    for old, new in REPLACEMENTS.items():
        text = text.replace(old, new)
    return text


def rewrite(locale: str, text: str) -> str:
    text = normalize(text)
    return SUMMARY_REWRITE[locale].get(text, text)


def inline_markup(text: str) -> str:
    chunks: list[str] = []
    last = 0
    for match in LINK_RE.finditer(text):
        chunks.append(escape(text[last : match.start()]))
        label = escape(match.group(1))
        href = escape(match.group(2), {'"': "&quot;"})
        chunks.append(f'<a href="{href}" color="#2563eb">{label}</a>')
        last = match.end()
    chunks.append(escape(text[last:]))
    html = "".join(chunks)
    return BOLD_RE.sub(r"<b>\1</b>", html)


def plain_text(text: str) -> str:
    text = LINK_RE.sub(lambda match: match.group(1), text)
    return BOLD_RE.sub(r"\1", text)


def parse_resume(locale: str) -> list[tuple[str, str, str]]:
    source = ROOT / "content" / "resume" / f"{locale}.mdx"
    body = FRONTMATTER_RE.sub("", source.read_text(encoding="utf-8"), count=1)
    entries: list[tuple[str, str, str]] = []
    paragraph: list[str] = []

    def flush_paragraph() -> None:
        nonlocal paragraph
        if paragraph:
            raw = rewrite(locale, " ".join(paragraph))
            entries.append(("p", inline_markup(raw), plain_text(raw)))
            paragraph = []

    for raw_line in body.splitlines():
        line = raw_line.strip()
        if not line:
            flush_paragraph()
            continue
        if line == "---":
            flush_paragraph()
            entries.append(("hr", "", ""))
            continue
        for prefix, kind in (("### ", "h3"), ("## ", "h2"), ("# ", "h1"), ("- ", "li")):
            if line.startswith(prefix):
                flush_paragraph()
                raw = rewrite(locale, line[len(prefix) :])
                entries.append((kind, inline_markup(raw), plain_text(raw)))
                break
        else:
            paragraph.append(line)

    flush_paragraph()
    return entries


def make_styles(locale: str) -> dict[str, ParagraphStyle]:
    cjk = locale == "zh"
    base = "STSong-Light" if cjk else "Helvetica"
    bold = "STSong-Light" if cjk else "Helvetica-Bold"
    word_wrap = "CJK" if cjk else None

    return {
        "h1": ParagraphStyle(
            "h1",
            fontName=bold,
            fontSize=29,
            leading=33,
            textColor=HexColor("#111827"),
            spaceAfter=5,
            alignment=TA_LEFT,
            wordWrap=word_wrap,
        ),
        "title": ParagraphStyle(
            "title",
            fontName=base,
            fontSize=15.5,
            leading=18,
            textColor=HexColor("#334155"),
            spaceAfter=2.5,
            wordWrap=word_wrap,
        ),
        "h2": ParagraphStyle(
            "h2",
            fontName=bold,
            fontSize=19,
            leading=22,
            textColor=HexColor("#111827"),
            spaceBefore=9,
            spaceAfter=4.5,
            wordWrap=word_wrap,
        ),
        "h3": ParagraphStyle(
            "h3",
            fontName=bold,
            fontSize=15,
            leading=17.5,
            textColor=HexColor("#1f2937"),
            spaceBefore=5,
            spaceAfter=3.5,
            wordWrap=word_wrap,
        ),
        "p": ParagraphStyle(
            "p",
            fontName=base,
            fontSize=13.5 if cjk else 13.2,
            leading=15.5 if cjk else 15.2,
            textColor=HexColor("#374151"),
            spaceAfter=3,
            wordWrap=word_wrap,
        ),
        "li": ParagraphStyle(
            "li",
            fontName=base,
            fontSize=12.5 if cjk else 12.2,
            leading=14.3 if cjk else 14,
            leftIndent=15.5,
            firstLineIndent=-10,
            bulletIndent=2,
            textColor=HexColor("#374151"),
            spaceAfter=1.8,
            wordWrap=word_wrap,
        ),
    }


def footer(canvas, doc) -> None:
    canvas.saveState()
    canvas.setFont("Helvetica", 6.8)
    canvas.setFillColor(HexColor("#64748b"))
    canvas.drawRightString(A4[0] - 10.5 * mm, 7.5 * mm, f"Page {doc.page}")
    canvas.restoreState()


def build_resume(locale: str) -> Path:
    styles = make_styles(locale)
    output = OUT / f"scott-si-qiu-wang-resume-{locale}.pdf"
    doc = SimpleDocTemplate(
        str(output),
        pagesize=A4,
        leftMargin=10.5 * mm,
        rightMargin=10.5 * mm,
        topMargin=8.5 * mm,
        bottomMargin=9.5 * mm,
        title=f"Scott Si Qiu Wang Resume {locale.upper()}",
        author="Scott Si Qiu Wang",
    )

    story = []
    intro_paragraphs = 0
    inserted_page_break = False

    for kind, html, text in parse_resume(locale):
        if kind == "h3" and text == PAGE_TWO_BREAK and not inserted_page_break:
            story.append(PageBreak())
            inserted_page_break = True

        if kind == "hr":
            story.append(Spacer(1, 1.1))
            story.append(
                HRFlowable(
                    width="100%",
                    thickness=0.45,
                    color=HexColor("#cbd5e1"),
                    spaceBefore=0.3,
                    spaceAfter=1.9,
                )
            )
        elif kind == "h1":
            story.append(Paragraph(html, styles["h1"]))
        elif kind == "h2":
            story.append(Paragraph(html, styles["h2"]))
        elif kind == "h3":
            story.append(Paragraph(html, styles["h3"]))
        elif kind == "p":
            intro_paragraphs += 1
            story.append(Paragraph(html, styles["title"] if intro_paragraphs <= 3 else styles["p"]))
        elif kind == "li":
            story.append(Paragraph(html, styles["li"], bulletText="•"))

    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    return output


def main() -> None:
    for locale in ("en", "zh"):
        output = build_resume(locale)
        print(f"Generated {output.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
