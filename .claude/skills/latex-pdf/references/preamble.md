# Standard LaTeX Preamble — Classroom Tools

Copy this into every new `.tex` file. All packages are confirmed available on this system.

```latex
\documentclass[11pt, a4paper]{article}
\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}
\usepackage{lmodern}
\usepackage[margin=2cm, top=2.5cm, bottom=2.5cm, headheight=14pt]{geometry}
\usepackage{amsmath}
\usepackage{amssymb}
\usepackage[table]{xcolor}
\usepackage{tikz}
\usetikzlibrary{calc}
\usepackage{tcolorbox}
\tcbuselibrary{breakable}
\usepackage{tabularx}
\usepackage{booktabs}
\usepackage{enumitem}
\usepackage{parskip}
\usepackage{titlesec}
\usepackage{fancyhdr}
```

## Colour palette (matches HTML versions)

```latex
\definecolor{accent}{RGB}{22,163,74}        % green — section headings, borders
\definecolor{accentlight}{RGB}{240,253,244}  % light green — box backgrounds
\definecolor{accentmid}{RGB}{34,197,94}      % mid green — rules, worked examples
\definecolor{errred}{RGB}{220,38,38}         % red — misconception boxes
\definecolor{errbg}{RGB}{254,242,242}        % light red — misconception background
\definecolor{orng}{RGB}{249,115,22}          % orange — connection boxes
\definecolor{orngbg}{RGB}{255,247,237}       % light orange — connection background
\definecolor{retreival}{RGB}{29,78,216}      % blue — retrieval check boxes
\definecolor{retrievalbg}{RGB}{239,246,255}  % light blue — retrieval background
\definecolor{slate}{RGB}{71,85,105}          % dark slate — subheadings, header text
\definecolor{slatelight}{RGB}{148,163,184}   % light slate — footer, rules
\definecolor{dblue}{RGB}{29,78,216}          % diagram blue — TikZ lines, arcs
```

## Helper commands

```latex
\newcommand{\blank}[1]{\underline{\hspace{#1}}}
\newcommand{\dgr}{\ensuremath{^\circ}}
\newcommand{\answerline}{\par\vspace{0.45cm}\noindent\rule{\linewidth}{0.4pt}\par\vspace{0.1cm}}
\newcommand{\selfcheck}{\par\smallskip\noindent\textbf{Self-check:}
  $\square$~I could teach it\quad$\square$~Getting there\quad$\square$~Not yet\smallskip}
```

## tcolorbox styles

```latex
\tcbset{
  misconc/.style={colback=errbg,colframe=errred,
    title={\small\bfseries\color{errred}Misconception},
    left=6pt,right=6pt,top=3pt,bottom=3pt,breakable},
  worked/.style={colback=accentlight,colframe=accentmid,
    fonttitle={\small\bfseries\color{accent}},
    left=6pt,right=6pt,top=3pt,bottom=3pt,breakable},
  retrieval/.style={colback=retrievalbg,colframe=dblue!40,
    title={\small\bfseries\color{retreival}Retrieval Check --- \textit{Close your notes}},
    left=6pt,right=6pt,top=3pt,bottom=3pt,breakable},
  connection/.style={colback=orngbg,colframe=orng,
    left=6pt,right=6pt,top=3pt,bottom=3pt,breakable},
  learningtarget/.style={colback=accentlight,colframe=accentmid,
    leftrule=3pt,toprule=0pt,bottomrule=0pt,rightrule=0pt,
    left=8pt,right=6pt,top=3pt,bottom=3pt},
  preknowledge/.style={colback=gray!5,colframe=gray!30,
    left=8pt,right=8pt,top=6pt,bottom=6pt,breakable}
}
```

## Section formatting

```latex
\titleformat{\section}{\large\bfseries\color{accent}}{}{0em}{}[\color{accentmid}\titlerule]
\titleformat{\subsection}{\normalsize\bfseries\color{slate}}{}{0em}{\MakeUppercase}
\titlespacing{\section}{0pt}{18pt}{8pt}
\titlespacing{\subsection}{0pt}{14pt}{4pt}
```

## Header / footer

```latex
\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\small\color{slate}[Document Title]}
\fancyhead[R]{\small\color{slate}Alberta Curriculum}
\fancyfoot[C]{\small\color{slatelight}\thepage}
\renewcommand{\headrulewidth}{0.4pt}
\renewcommand{\headrule}{\color{slatelight}\hrule width\headwidth height\headrulewidth}
```

## Title block

```latex
\begin{tcolorbox}[colback=accentlight, colframe=accent, leftrule=5pt,
    toprule=0.6pt, bottomrule=0.6pt, rightrule=0.6pt,
    top=8pt, bottom=8pt, left=12pt]
  {\small\bfseries\color{accent}GRADE [N] [SUBJECT]
    \textperiodcentered{} ALBERTA CURRICULUM
    \textperiodcentered{} [STRAND]}\\[4pt]
  {\LARGE\bfseries [Title]}\\[3pt]
  {\small\color{slate}[Subtitle]}
\end{tcolorbox}
\vspace{6pt}
\noindent Name:\;\blank{6cm}\hfill Date started:\;\blank{4cm}
\vspace{14pt}
```

## Known issues / gotchas

- Use `\dgr{}` for degree symbols everywhere (works in both text and math mode)
- `\usepackage{lmodern}` is required — without it pdflatex falls back to bitmap fonts
- Do NOT use `\tcbuselibrary{skins}` — `tikzfill.image.sty` is not installed
- `tcolorbox` `skins` library is unavailable; use plain colback/colframe styling only
- Compile with: `bash .claude/skills/latex-pdf/scripts/compile.sh file.tex`
