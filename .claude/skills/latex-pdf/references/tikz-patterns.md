# TikZ Diagram Patterns — Classroom Tools

Common patterns for math and science diagrams. All tested and working on this system.

## Setup notes

- Always include `\usetikzlibrary{calc}` in preamble
- Use `font=\small` on the tikzpicture for consistent label sizing
- Use `dblue` colour (defined in preamble) for highlighted elements (lines, arcs)
- Use `gray!50, fill=gray!8` for circle/shape backgrounds
- Mark key points with `\fill (pt) circle (1.8pt);`

---

## Circle with labelled parts

Points at exact angles using explicit coordinates:
- 0°   → `(\r, 0)`
- 45°  → `({0.707*\r}, {0.707*\r})`
- 90°  → `(0, \r)` — top of circle
- 135° → `({-0.707*\r}, {0.707*\r})`
- 180° → `(-\r, 0)`
- 225° → `({-0.707*\r}, {-0.707*\r})`
- 270° → `(0, -\r)` — bottom of circle
- 315° → `({0.707*\r}, {-0.707*\r})`

```latex
\begin{tikzpicture}[scale=1.15, font=\small]
  \coordinate (O) at (0,0);
  \coordinate (T) at (0,2.5);          % top (tangent point)
  \coordinate (Q) at (-2.5,0);         % left (diameter endpoint)
  \coordinate (R) at (2.5,0);          % right (diameter endpoint)
  \coordinate (A) at (1.768,1.768);    % 45 deg (radius endpoint)
  \coordinate (P) at (-1.768,-1.768);  % 225 deg (chord endpoint)
  \coordinate (S) at (1.768,-1.768);   % 315 deg (chord endpoint)

  \draw[gray!50, fill=gray!8, line width=1pt] (O) circle (2.5);

  % Tangent at T (horizontal)
  \draw[line width=1pt] (-3.1,2.5) -- (3.1,2.5);
  \draw[line width=0.8pt] (0.18,2.5)--(0.18,2.32)--(0,2.32); % right-angle mark

  % Diameter
  \draw[dblue, line width=1.6pt] (Q)--(R);
  \node[dblue, above, yshift=2pt] at (0,0) {\footnotesize diameter ($d$)};

  % Radius
  \draw[line width=1pt] (O)--(A);
  \node[right, xshift=2pt, yshift=2pt] at (0.88,0.88) {\footnotesize radius ($r$)};

  % Chord (dashed)
  \draw[gray!60, dashed, line width=1pt] (P)--(S);
  \node[gray!60, below, yshift=-2pt] at (0,-1.768) {\footnotesize chord};

  % Minor arc P→S through bottom (225° to 315°)
  \draw[dblue, line width=2pt] (P) arc (225:315:2.5);
  \node[dblue, below] at (0,-2.85) {\footnotesize arc};

  % Points
  \foreach \pt in {O,T,Q,R,A,P,S} \fill (\pt) circle (1.8pt);
  \node[above right] at (O) {$O$};
  \node[above left]  at (T) {$T$};
  \node[left]        at (Q) {$Q$};
  \node[right]       at (R) {$R$};
  \node[above right] at (A) {$A$};
  \node[below left]  at (P) {$P$};
  \node[below right] at (S) {$S$};
  \node[right] at (3.15,2.5) {\footnotesize tangent};
\end{tikzpicture}
```

---

## Arc direction reference

```
\draw (P) arc (start_angle : end_angle : radius);
```

- Angles increase counterclockwise (standard math convention)
- Arc draws from `start_angle` to `end_angle` going counterclockwise
- To draw the bottom arc (minor, through 270°) between P(225°) and S(315°):
  `\draw (P) arc (225:315:r);`  ← goes CCW through 270° ✓
- To draw the top arc (major, through 90°):
  `\draw (P) arc (225:-45:r);`  or  `arc (225:315-360:r)`

---

## Right-angle mark

Small L-shaped square at a corner point. Adjust size (0.15–0.2) to diagram scale.

```latex
% Right angle at point (0,0) between lines going right and up:
\draw (0.15,0)--(0.15,0.15)--(0,0.15);

% Right angle at top of circle T=(0,r) between radius (downward) and tangent (horizontal):
\draw (0.18,\r)--(0.18,\r-0.18)--(0,\r-0.18);
```

---

## Central angle vs inscribed angle

```latex
\begin{tikzpicture}[scale=1.1, font=\small]
  % A at 210°, B at 330°, P at 90° (top)
  \coordinate (O) at (0,0);
  \coordinate (A) at ({cos(210)*2},{sin(210)*2});
  \coordinate (B) at ({cos(330)*2},{sin(330)*2});
  \coordinate (P) at (0,2);

  \draw[gray!50, fill=gray!8, line width=1pt] (O) circle (2);
  \fill (O) circle (1.8pt); \node[right] at (O) {$O$};

  % Central angle (blue)
  \draw[dblue, line width=1.6pt] (O)--(A);
  \draw[dblue, line width=1.6pt] (O)--(B);
  \draw[dblue, line width=2pt] (A) arc (210:330:2);

  % Inscribed angle (green/accent)
  \draw[accent, line width=1.6pt] (P)--(A);
  \draw[accent, line width=1.6pt] (P)--(B);

  \fill (A) circle (1.8pt); \node[below left]  at (A) {$A$};
  \fill (B) circle (1.8pt); \node[below right] at (B) {$B$};
  \fill (P) circle (1.8pt); \node[above]        at (P) {$P$};

  \node[dblue,  below] at (0,-2.5) {\footnotesize central angle $AOB$};
  \node[accent, above] at (0, 2.5) {\footnotesize inscribed angle $APB$};
\end{tikzpicture}
```

---

## Chord perpendicular bisector

```latex
\begin{tikzpicture}[scale=1.1, font=\small]
  % Circle r=2.2, chord at d=1.0 below centre
  % Half-chord = sqrt(2.2^2 - 1.0^2) = sqrt(3.84) ≈ 1.96
  \draw[gray!50, fill=gray!8, line width=1pt] (0,0) circle (2.2);
  \fill (0,0) circle (1.8pt); \node[above right] at (0,0) {$O$};

  \draw[line width=1.3pt] (-1.96,-1) -- (1.96,-1);
  \node[below left]  at (-1.96,-1) {$A$};
  \node[below right] at (1.96,-1)  {$B$};
  \node[below]       at (0,-1)     {$M$};
  \fill (-1.96,-1) circle (1.5pt);
  \fill (1.96,-1)  circle (1.5pt);
  \fill (0,-1)     circle (1.5pt);

  \draw[line width=1pt] (0,0)--(0,-1);
  \draw[line width=0.8pt] (0.13,-1)--(0.13,-0.87)--(0,-0.87);  % right-angle mark

  % Equal tick marks on half-chord
  \draw (-0.98,-1.1)--(-0.98,-0.9);
  \draw ( 0.98,-1.1)--( 0.98,-0.9);
\end{tikzpicture}
```

---

## Tangent from external point (right triangle)

**Key constraint:** T must be on the circle, and OT ⊥ PT.
Place T at the top of the circle, O below it, P level with T.
Then OT is vertical and PT is horizontal — the right angle at T is geometrically exact.

Scale to match the problem numbers. Example for r=5, PO=13, PT=12:
- OT = 1 unit (represents 5 cm)
- PT = 2.4 units (represents 12 cm)
- PO = 2.6 units (represents 13 cm)
Check: sqrt(2.4² + 1²) = sqrt(5.76+1) = sqrt(6.76) = 2.6 ✓

```latex
\begin{tikzpicture}[scale=0.9, font=\small]
  % T at top of circle, O directly below, P level with T
  % OT vertical, PT horizontal → right angle at T is exact, T is on the circle
  \coordinate (O) at (0,-1);    % centre
  \coordinate (T) at (0, 0);    % tangent point (top of circle, distance r=1 from O)
  \coordinate (P) at (-2.4, 0); % external point (adjust for problem's PT length)

  \draw[gray!50, fill=gray!8] (O) circle (1);  % radius = distance OT ✓
  \fill (O) circle (1.5pt); \node[right, xshift=3pt] at (O) {$O$};
  \fill (T) circle (1.8pt); \node[above right] at (T) {$T$};
  \fill (P) circle (1.8pt); \node[left] at (P) {$P$};

  \draw[line width=1.5pt] (P)--(T);           % tangent segment (horizontal)
  \draw[line width=1pt]   (O)--(T);           % radius (vertical)
  \draw[dashed, gray!60]  (P)--(O);           % hypotenuse PO

  % Right-angle mark at T (between downward OT and leftward PT)
  \draw[line width=0.8pt] (-0.15,0)--(-0.15,-0.15)--(0,-0.15);

  % Measurements — adjust to match the problem
  \node[right, font=\footnotesize] at (0.1,-0.5)  {$r$};
  \node[below, font=\footnotesize] at (-1.2,-0.52) {$d$};
  \node[above, font=\footnotesize] at (-1.2, 0)   {$PT=?$};
\end{tikzpicture}
```

---

## Force diagram (for science — vectors)

```latex
\usetikzlibrary{arrows.meta}

\begin{tikzpicture}[scale=1.0, font=\small,
    >={Stealth[length=6pt, width=4pt]}]
  % Object (box)
  \fill[gray!20] (-0.4,-0.4) rectangle (0.4,0.4);
  \draw ((-0.4,-0.4) rectangle (0.4,0.4);

  % Forces (adjust direction and magnitude)
  \draw[->, dblue, line width=1.5pt] (0,0.4) -- (0,2)
    node[right] {$F_N$ (normal)};
  \draw[->, errred, line width=1.5pt] (0,-0.4) -- (0,-2)
    node[right] {$F_g$ (gravity)};
  \draw[->, accent, line width=1.5pt] (0.4,0) -- (2,0)
    node[above] {$F_{app}$};
  \draw[->, orng, line width=1.5pt] (-0.4,0) -- (-1.8,0)
    node[above] {$F_f$ (friction)};
\end{tikzpicture}
```

---

## Coordinate plane (for graphing)

```latex
\begin{tikzpicture}[scale=0.6, font=\small]
  % Grid
  \draw[gray!30, thin] (-4,-4) grid (4,4);
  % Axes
  \draw[->, gray!70] (-4.3,0)--(4.5,0) node[right] {$x$};
  \draw[->, gray!70] (0,-4.3)--(0,4.5) node[above] {$y$};
  % Tick labels
  \foreach \x in {-4,-3,-2,-1,1,2,3,4}
    \node[below, font=\footnotesize, gray!60] at (\x,0) {\x};
  \foreach \y in {-4,-3,-2,-1,1,2,3,4}
    \node[left, font=\footnotesize, gray!60] at (0,\y) {\y};
  % Plot a line: y = 2x - 1
  \draw[dblue, line width=1.5pt, domain=-1.5:2.5] plot (\x, {2*\x - 1});
\end{tikzpicture}
```

---

## Coordinate calculation reference

For a circle centred at `(cx, cy)` with radius `r`, a point at angle `θ`:
```
x = cx + r * cos(θ)
y = cy + r * sin(θ)
```

Key values:
| θ    | cos(θ) | sin(θ) | Direction    |
|------|--------|--------|--------------|
| 0°   | 1.000  | 0.000  | right        |
| 30°  | 0.866  | 0.500  | upper-right  |
| 45°  | 0.707  | 0.707  | upper-right  |
| 60°  | 0.500  | 0.866  | upper-right  |
| 90°  | 0.000  | 1.000  | top          |
| 120° | -0.500 | 0.866  | upper-left   |
| 135° | -0.707 | 0.707  | upper-left   |
| 150° | -0.866 | 0.500  | upper-left   |
| 180° | -1.000 | 0.000  | left         |
| 210° | -0.866 | -0.500 | lower-left   |
| 225° | -0.707 | -0.707 | lower-left   |
| 270° | 0.000  | -1.000 | bottom       |
| 315° | 0.707  | -0.707 | lower-right  |
| 330° | 0.866  | -0.500 | lower-right  |
