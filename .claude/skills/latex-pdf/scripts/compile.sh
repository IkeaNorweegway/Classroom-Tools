#!/usr/bin/env bash
# Compile a .tex file to PDF using the project's TeXLive installation.
# Usage: compile.sh <path/to/file.tex>
# Runs pdflatex twice (second pass resolves cross-references).

set -e

TEX_FILE="$1"
if [[ -z "$TEX_FILE" ]]; then
  echo "Usage: compile.sh <file.tex>" >&2
  exit 1
fi

TEX_ABS="$(realpath "$TEX_FILE")"
DIR="$(dirname "$TEX_ABS")"
BASE="$(basename "$TEX_ABS")"

# Font map workaround: Fedora TeXLive requires TEXMFHOME to locate fonts
# until sudo updmap-sys has been run system-wide.
export TEXMFHOME=/usr/share/texlive/texmf-dist

cd "$DIR"
echo "[latex-pdf] Pass 1..."
pdflatex -interaction=nonstopmode "$BASE"
echo "[latex-pdf] Pass 2 (cross-references)..."
pdflatex -interaction=nonstopmode "$BASE"

PDF="${BASE%.tex}.pdf"
if [[ -f "$PDF" ]]; then
  echo "[latex-pdf] Done: $DIR/$PDF"
else
  echo "[latex-pdf] ERROR: PDF not produced. Check ${BASE%.tex}.log" >&2
  exit 1
fi
