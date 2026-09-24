#!/usr/bin/env python3
"""
Make first-page thumbnails for the Publications catalog.

Usage
-----
    pip install pymupdf pillow
    python tools/make_thumbnails.py path/to/pdfs            # every PDF in a folder
    python tools/make_thumbnails.py paper1.pdf paper2.pdf   # specific files

Each PDF's first page is saved as a JPEG in assets/img/papers/, named after
the PDF (e.g. 2026-kim-rse.pdf -> assets/img/papers/2026-kim-rse.jpg).
Then set  thumb: "assets/img/papers/2026-kim-rse.jpg"  in data/publications.js.

Tip: name the PDFs after the publication ids so the paths match.
"""
import sys
from pathlib import Path

try:
    import pymupdf as fitz          # PyMuPDF >= 1.24
except ImportError:
    try:
        import fitz                 # older PyMuPDF
    except ImportError:
        sys.exit("PyMuPDF is missing. Install it with:  pip install pymupdf pillow")

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "assets" / "img" / "papers"
WIDTH = 760          # px; the catalog shows ~170px, the preview up to ~380px (2x for sharp screens)
QUALITY = 82


def render_first_page(pdf: Path, out_dir: Path) -> Path:
    with fitz.open(pdf) as doc:
        page = doc[0]
        zoom = WIDTH / page.rect.width
        pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
        img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    out = out_dir / (pdf.stem + ".jpg")
    img.save(out, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    return out


def main(args):
    if not args:
        sys.exit(__doc__)
    pdfs = []
    for a in args:
        p = Path(a)
        if p.is_dir():
            pdfs += sorted(p.glob("*.pdf"))
        elif p.suffix.lower() == ".pdf" and p.exists():
            pdfs.append(p)
        else:
            print(f"skip: {a} (not a PDF or folder)")
    if not pdfs:
        sys.exit("No PDF files found.")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for pdf in pdfs:
        try:
            out = render_first_page(pdf, OUT_DIR)
            print(f"ok   {pdf.name} -> {out.relative_to(ROOT).as_posix()}")
        except Exception as e:  # keep going if one file is broken
            print(f"fail {pdf.name}: {e}")


if __name__ == "__main__":
    main(sys.argv[1:])
