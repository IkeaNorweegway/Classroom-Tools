package Math8Viz;
# Math 8 teaching diagrams, drawn as SVG from one-line directives.
#
# A source line   @viz numberline min=-5 max=5 points="-3:A;2:B" caption="…"
# becomes a <figure class="viz"> with an inline SVG that uses the dg-* classes
# (styles live in the page; see render_math8.pl). Labels may hold [[answer]]:
# the student copy shows a dashed box, the key shows the answer in green.
#
# Used by scripts/render_math8.pl. Each type is a sub draw_<type>(\%a) that
# returns (svg, aria-label). List of types and their arguments: see %DOC below.
use strict;
use warnings;
use utf8;
use POSIX qw(floor ceil);
use List::Util qw(max min sum);

our $KEY = 0;   # 1 while rendering an answer key

my $PI = 3.14159265358979;

our %DOC = (
    numberline => 'min max step every points="v:label;…" jumps="a>b>c" jumplabels="+3,+3" highlight="a,b" ticklabels="v:text;…" ends="left,right" width',
    hundred    => 'shaded=N (0.5, 45, 150…) grids labels="…,…" zoom=1 (enlarge one square for N<1)',
    bars       => 'bars="3/4;7/4" labels="…;…" unit=px (fraction bars; improper fractions use more wholes)',
    area       => 'a=2/3 b=3/4 result="…" (area model for fraction × fraction)',
    groups     => 'total=3 piece=1/4 count="[[12]]" (how many pieces fit: division)',
    counters   => 'pos neg pairs | groups=3 each=-2 (groups<0 removes groups from zero pairs) result="…"',
    tape       => 'parts="3:juice;5:water" values="10" total="…" (ratio tape diagram)',
    dnl        => 'top="0,3,6" bottom="0,2,4" toplabel bottomlabel arrow="1,3,×3" (double number line)',
    percentbar => 'percent=25 top="0%,25%,…" bottom="0,20,…" toplabel bottomlabel',
    balance    => 'left="2x;+3" right="+11" (terms separated by ;  x-bags, + and − blocks)',
    pattern    => 'start=1 add=2 figures=3 last="?" (growing pattern; start column + groups of add)',
    coord      => 'xmin xmax ymin ymax xstep ystep xevery yevery xlabel ylabel points="x,y:label;…" line=1 dashed=1 width vline=3 open="x,y;…"',
    transform  => 'shape="1,1;4,1;1,3" move="translate 3,-4 | reflect x | reflect y | rotate 90 | rotate 180 [then …]" names="A,B,C" image=key|show|none range=6',
    righttri   => 'a b c (labels) aval bval (numbers for shape) squares=1 areas="9,16,25" alabel blabel clabel names="A,B,C"',
    prism      => 'l w h (labels) lv wv hv (numbers for shape)',
    triprism   => 'b th s l (labels: base, triangle height, slant, length) bv thv lv',
    cylinder   => 'r h (labels) rv hv diameter=1',
    net        => 'type=box|tri|cyl  l w h | b th s l | r h (labels) …v (numbers)',
    blocks     => 'heights="2,1;1,0" (rows back→front, cols left→right) views=show|blank|key|none front=1',
    bar        => 'data="A:5;B:8" ymin ymax ystep title ylabel xlabel break=1 widths="1,2" highlight="B"',
    line       => 'data="2019:3;2020:5" ymin ymax ystep title ylabel xlabel break=1',
    pie        => 'data="Rent:40;Food:25;…" (percents) title',
    picto      => 'data="A:4;B:2.5" per="10 cans" icon=circle|square mode=icons|scaled title',
    tree       => 'first="H,T" second="1,2,3" p1="…" p2="…" outcomes=show|blank',
    spinner    => 'sections="red,blue,blue,green" (equal parts)',
    outcomes   => 'rows="H,T" cols="1,2,3" highlight="H2;T2" blank=1 rowlabel collabel',
    flow       => 'steps="Read|Draw|Solve|Check" (numbered boxes with arrows)',
    squares    => 'shapes="1x1;2x2;3x4" labels="…;…" (unit-square rectangles)',
    receipt    => 'items="Subtotal:$40.00;GST (5%):[[$2.00]];Total:[[$42.00]]" title',
    dotgrid    => 'cols rows iso=1 (blank grid or isometric dot paper for drawing)',
    scale      => 'left="…" right="…" (compare two quantities on a pan balance, no x)',
    # Grade 7 (draft 2026) types
    circle     => 'show=r|d|rd|none rlabel dlabel clabel centre="O" shade=1 title size=78 fill=plant half=1 (semicircle) box=1 boxlabel (square around it) rsq=1 rsqlabel="r²" (r-by-r square) spokes=8 chord=1 chordlabel alabel (inside) size2 show2 rlabel2 dlabel2 clabel2 title2 alabel2 rsq2 rsqlabel2 fill2 (a second circle to the right)',
    circlearea => 'sectors=8 hlabel="r" blabel="half the circumference" tlabel (circle cut into slices, rearranged)',
    lines      => 'items="line:A,B;ray:C,D;segment:E,F;angle:P,Q,R" (angle:P,Q,R,120 sets the size) labels="…;…" sym=1 (draw the symbol under each item) notitle=1',
    angles     => 'kind=intersect a=40 tilt=15 labels="1;2;3;4" | kind=transversal a=60 labels="1;…;8" parallel=0 marks=0 (no arrowheads) | kind=perp | kind=parallel; highlight="2,6" names="m,n"',
    polygon    => 'pts="0,0;4,0;4,3" names="A,B,C" ticks="1,2,0" arcs="1,0,2" sides="5 cm;;" angles="40°;;" right="2" par="1,0,1,0" (parallel arrowheads per side) open=1 (no last side: not a polygon) cap="Shape 1" (under the shape) unit=28 (+ pts2 names2 ticks2 … par2 open2 cap2 for a second shape) label',
    tiles      => 'terms="2x;-3" | left="2x;+3" right="x;+7" label (algebra tiles)',
    dotplot    => 'data="3,4,4,5" min max step title xlabel marks="mean:4.5;median:4" highlight="4"',
    mapping    => 'in="1,2,3" out="2,4,6" arrows="1>2;2>4;3>6" inlabel outlabel',
    people     => 'n=40 cols=10 pick="1,5,9" groups="1-20:cold;21-40:hot" numbers=1 title label',
    cube       => 'n=3 label (perfect cube of unit cubes)',
    thermo     => 'min=-30 max=20 step=10 values="-12,5" labels="night;day"',
    layers     => 'l=4 w=3 h=2 llabel blabel (one layer of cubes, then the stacked box)',
    vline      => 'min max step every points="v:label;…" keypoints zero="sea level" above="…" below="…" water=1 unit=" m" prefix="$" height=240 width=320 (vertical number line: sea level, bank balance)',
    chips      => 'pos=2 neg=0 add=3 addlabel="+3 zero pairs" xpos=0 xneg=3 pairs=0 title result="…" (chip mat: add zero pairs, cross out chips taken away)',
    vjumps     => 'min max step every jumps="-3>2>-1" jumplabels="+5;−3" points="v:label;…" keypoints zero above below water=1 unit prefix height width (vertical number line with jump arrows: elevator, temperature, bank)',
    sqside     => 'n=5 side="5 m" labels="Area = [[25]] m²;Perimeter = [[20]] m" fence=1 fill=accent|plant|sun|soft grid=0 cell=20 title (a square of n × n unit squares, side labelled on two edges, notes to the right; fence=1 draws the edge thick)',
    tilerows   => 'rows="2x;+3 = x;+7 | x!;x;+3 = x!;+7" labels="Start;Take x from both sides" notes="…;[[x + 3 = 7]]" title (rows of algebra tiles, one row per step or group; " = " splits the sides and lines up; a term ending in ! is crossed out; "0" draws a 0)',
    machine    => 'in="3" rule="× 4" out="[[12]]" (several rows: in="1;2;3" out="4;8;[[12]]") inlabel outlabel rulelabel title (function machine: input → rule → output)',
    wheel      => 'dlabel="d" clabel="one turn = circumference" seglabel="d" bitlabel="a bit more" size=34 title (a wheel rolled one turn: 3 diameters and a bit)',
    compass    => 'r=3 rlabel="3 cm" centre="O" steps="1. …|2. …|3. …" (drawing a circle with a compass: ruler, point on the centre, full turn)',
    curve      => 'xmin xmax ymin ymax xstep ystep xevery yevery xlabel ylabel path="x,y;x,y;… | x,y;…" smooth=1 circle="cx,cy,r" points="x,y:label;…" open="x,y;…" vline=3 hline=4 hits="x,y;…" keyhits width cell (smooth graph with no dots at the corners: temperature over a day, non-function shapes for the vertical line test; hits ring where the vertical line meets the graph)',
    solid      => 'kind=box base=bottom|front|side l w h lv wv hv | kind=tri along=x|z|y right=1 b th l bv thv lv | kind=ngon n=5 sv=2 hv=4 | kind=cyl r h rv hv lying=1 diameter=1; blabel both=1 lateral="lateral face" slices=4 ground=1 groundlabel ghost=0 shade=0 (bases not shaded: for "find the bases" questions) fill=sun size=190 (prism or cylinder in any position, both bases shaded)',
    levelling  => 'data="2,5,3,6" labels="G1;G2;…" after=1 (evened-out towers to the right) meanline=1 meanlabel="mean = [[4]]" beforelabel afterlabel arrowlabel="share out" cell=16 fill title (towers of cubes levelled to the mean)',
    numstrip   => 'rows="18,7,25 | 7,18,25" labels="As given;In order" notes=";median = [[18]]" ring="2:2" (row:positions) hot="1:3,5" cell title (strips of numbers in boxes; middle ringed for the median)',
    dotplot2   => 'data data2 min max step label label2 marks="mean:3" marks2 highlight highlight2 xlabel title (two dot plots stacked on one scale; a mark value in [[ ]] hides its line on the student copy)',
    hat        => 'names="Ava,Sam,…" out="Leo;Mia;[[ ]]" label="all 120 names" outlabel="the sample" title (names in a hat, some drawn out: simple random sampling)',
    dice       => 'values="1,2,3,4,5,6" hot="5,6" (shade faces by value) size=34 labels="…;…" (under each face) label title (a row of die faces; a value that is not 1–6 prints as text: "?", [[4]])',
    bag        => 'counters="red:3;blue:2;yellow:1" letters=0 (no R/B/Y on the counters) out="red" outlabel="draw one" label title cols (a bag of coloured counters, each marked with its first letter)',
    spin       => 'sections="red:2;blue:1;yellow:1" (sizes, so parts can be unequal) size=150 guides=1 (dashed lines split each part into its equal pieces) arrow=0 label title (spinner with equal or unequal parts)',
    flips      => 'items="H,H,T,[[ ]]" kind=coin|card hot="1,3" (positions) under="1st;2nd;…" label title (a row of coins or cards; ♥ ♦ print red)',
    trials     => 'data="10:0.7;50:0.56;100:0.52" theory=0.5 theorylabel="theory: 0.5" ymin=0 ymax=1 ystep=0.1 yevery=0.2 (labelled steps) percent=1 height=160 xlabel ylabel title width (experimental probability after more and more trials, with a dashed line at the theoretical probability)',
);

# ── text helpers ─────────────────────────────────────────────────────────
sub xesc { my ($s) = @_; $s //= ''; $s =~ s/&(?![#a-zA-Z0-9]+;)/&amp;/g; $s =~ s/</&lt;/g; $s =~ s/>/&gt;/g; $s =~ s/"/&quot;/g; return $s; }

my %FS = ('dg-label' => 12, 'dg-label-sm' => 11, 'dg-label-accent' => 11, 'dg-math' => 15,
          'dg-math-lg' => 20, 'dg-math-accent' => 15, 'dg-title' => 13, 'dg-label-hot' => 11,
          'dg-label-cold' => 11, 'dg-label-plant' => 11, 'dg-label-white' => 12);

sub tw { my ($s, $fs) = @_; return length($s // '') * $fs * 0.56; }

# Plain text of a label, for aria-labels.
sub plain {
    my ($s) = @_; $s //= '';
    $s =~ s/\[\[(.*?)\]\]/$KEY ? $1 : 'blank'/ge;
    return $s;
}

# Text that may contain [[answer]] blanks. Returns SVG.
sub T {
    my ($x, $y, $s, %o) = @_;
    my $cls = $o{cls} || 'dg-label';
    my $anchor = $o{anchor} || 'start';
    my $fs = $FS{$cls} || 12;
    $s //= '';
    return '' if $s eq '';
    if ($s !~ /\[\[/) {
        return sprintf('<text x="%.1f" y="%.1f" text-anchor="%s" class="%s">%s</text>', $x, $y, $anchor, $cls, xesc($s));
    }
    if ($KEY) {
        my $h = '';
        for my $seg (split /(\[\[.*?\]\])/, $s) {
            next if $seg eq '';
            if ($seg =~ /^\[\[(.*)\]\]$/) { $h .= '<tspan class="dg-tag-answer">' . xesc($1) . '</tspan>'; }
            else { $h .= xesc($seg); }
        }
        return sprintf('<text x="%.1f" y="%.1f" text-anchor="%s" class="%s">%s</text>', $x, $y, $anchor, $cls, $h);
    }
    my @seg = grep { $_ ne '' } split /(\[\[.*?\]\])/, $s;
    my @w = map { /^\[\[(.*)\]\]$/ ? max(30, tw($1, $fs) + 16) : tw($_, $fs) } @seg;
    my $total = sum(@w) + 0;
    my $cx = $anchor eq 'middle' ? $x - $total / 2 : $anchor eq 'end' ? $x - $total : $x;
    my $out = '';
    for my $i (0 .. $#seg) {
        if ($seg[$i] =~ /^\[\[/) {
            $out .= sprintf('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="3" class="dg-tag"/>', $cx + 2, $y - $fs - 1, $w[$i] - 4, $fs + 7);
        } else {
            $out .= sprintf('<text x="%.1f" y="%.1f" text-anchor="start" class="%s">%s</text>', $cx, $y, $cls, xesc($seg[$i]));
        }
        $cx += $w[$i];
    }
    return $out;
}

sub arrow {
    my ($x1, $y1, $x2, $y2, $cls) = @_;
    $cls ||= 'plain';
    my ($dx, $dy) = ($x2 - $x1, $y2 - $y1);
    my $len = sqrt($dx * $dx + $dy * $dy) || 1;
    my ($ux, $uy) = ($dx / $len, $dy / $len);
    my ($bx, $by) = ($x2 - $ux * 8, $y2 - $uy * 8);
    my ($px, $py) = (-$uy * 4.6, $ux * 4.6);
    return sprintf('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" class="dg-arrow %s"/><polygon points="%.1f,%.1f %.1f,%.1f %.1f,%.1f" class="dg-head %s"/>',
        $x1, $y1, $bx + $ux * 1.5, $by + $uy * 1.5, $cls, $x2, $y2, $bx + $px, $by + $py, $bx - $px, $by - $py, $cls);
}

# Curved arrow (quadratic) from (x1,y1) to (x2,y2), bulging by $h (negative = up).
sub carrow {
    my ($x1, $y1, $x2, $y2, $h, $cls) = @_;
    $cls ||= 'accent';
    my ($mx, $my) = (($x1 + $x2) / 2, ($y1 + $y2) / 2 + $h);
    # tangent at end: from control to end
    my ($dx, $dy) = ($x2 - $mx, $y2 - $my);
    my $len = sqrt($dx * $dx + $dy * $dy) || 1;
    my ($ux, $uy) = ($dx / $len, $dy / $len);
    my ($bx, $by) = ($x2 - $ux * 8, $y2 - $uy * 8);
    my ($px, $py) = (-$uy * 4.4, $ux * 4.4);
    return sprintf('<path d="M%.1f,%.1f Q%.1f,%.1f %.1f,%.1f" class="dg-arrow %s"/><polygon points="%.1f,%.1f %.1f,%.1f %.1f,%.1f" class="dg-head %s"/>',
        $x1, $y1, $mx, $my, $bx + $ux * 1.5, $by + $uy * 1.5, $cls, $x2, $y2, $bx + $px, $by + $py, $bx - $px, $by - $py, $cls);
}

sub rect { my ($x, $y, $w, $h, $cls, $rx) = @_; return sprintf('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f"%s class="%s"/>', $x, $y, $w, $h, $rx ? qq{ rx="$rx"} : '', $cls); }
sub line { my ($x1, $y1, $x2, $y2, $cls) = @_; return sprintf('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" class="%s"/>', $x1, $y1, $x2, $y2, $cls || 'dg-line'); }
sub poly { my ($cls, @p) = @_; my @s; while (@p) { my ($a, $b) = splice @p, 0, 2; push @s, sprintf('%.1f,%.1f', $a, $b); } return '<polygon points="' . join(' ', @s) . qq{" class="$cls"/>}; }
sub circ { my ($x, $y, $r, $cls) = @_; return sprintf('<circle cx="%.1f" cy="%.1f" r="%.1f" class="%s"/>', $x, $y, $r, $cls); }

sub list  { my ($s, $sep) = @_; return () unless defined $s && $s ne ''; $sep //= qr/\s*,\s*/; return split $sep, $s; }
sub items { my ($s) = @_; return () unless defined $s && $s ne ''; return map { [split /\s*:\s*/, $_, 2] } split /\s*;\s*/, $s; }
sub frac  { my ($s) = @_; return (0, 1) unless defined $s; return ($1, $2) if $s =~ m{^\s*(\d+)\s*/\s*(\d+)\s*$}; return ($s + 0, 1); }
sub gcd   { my ($a, $b) = @_; ($a, $b) = ($b, $a % $b) while $b; return $a; }
sub lcm   { my ($a, $b) = @_; return $a / gcd($a, $b) * $b; }
sub num   { my ($s) = @_; $s //= ''; $s =~ s/[−–]/-/g; return $s =~ /(-?\d+(?:\.\d+)?)/ ? $1 + 0 : undef; }
sub fmt   { my ($v) = @_; my $s = sprintf('%.2f', $v); $s =~ s/\.?0+$//; $s =~ s/^-/−/; return $s; }

sub svg {
    my ($w, $h, $aria, $body) = @_;
    return sprintf('<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 %d %d" width="%d" height="%d" aria-label="%s">', ceil($w), ceil($h), ceil($w), ceil($h), xesc($aria)) . "\n$body\n</svg>";
}

# ── entry point ──────────────────────────────────────────────────────────
# Parse `type key=value key="value"` and draw.
sub parse_args {
    my ($s) = @_;
    my %a;
    while ($s =~ /([\w-]+)=(?:"((?:[^"\\]|\\.)*)"|(\S+))/g) { $a{$1} = defined $2 ? $2 : $3; }
    return \%a;
}

sub draw {
    my ($line) = @_;
    $line =~ s/^\s*@?viz\s+//;
    my ($type, $rest) = $line =~ /^(\w+)\s*(.*)$/ or die "viz: no type in '$line'\n";
    my $a = parse_args($rest);
    my $sub = __PACKAGE__->can("draw_$type") or die "viz: unknown type '$type'\n";
    my ($svg, $aria) = $sub->($a);
    (my $tag = $rest) =~ s/--/—/g;
    $tag =~ s/\[\[.*?\]\]/[[ ]]/g;   # keep answers out of the student page source
    $tag =~ s/(key\w*)="[^"]*"/$1="…"/g;   # key-only arguments (keypoints=…) too
    return ("<!-- tikz: m8-$type | " . $tag . " -->\n" . $svg, $a->{caption});
}

# ═════════════════════════════════════════════════════════════════════════
# NUMBER
# ═════════════════════════════════════════════════════════════════════════

sub draw_numberline {
    my ($a) = @_;
    my ($min, $max) = ($a->{min} // 0, $a->{max} // 10);
    my $step = $a->{step} // 1;
    my $W = $a->{width} // 560;
    my $m = 34;
    my @jumps = list($a->{jumps}, qr/\s*>\s*/);
    my @pts = items($a->{points});
    push @pts, items($a->{keypoints}) if $KEY;   # keypoints: shown in the answer key only
    my $up = @jumps ? 58 : 0;
    my $y = 52 + $up;
    my $X = sub { $m + ($_[0] - $min) / (($max - $min) || 1) * ($W - 2 * $m) };
    my $nticks = ($max - $min) / $step;
    my $every = $a->{every} // ($nticks <= 12 ? $step : $nticks <= 24 ? 2 * $step : $nticks <= 60 ? 5 * $step : 10 * $step);
    my %custom = map { (num($_->[0]) // 0) . '' => $_->[1] } items($a->{ticklabels});
    my $b = '';
    $b .= line($m - 18, $y, $W - $m + 18, $y, 'dg-line');
    $b .= poly('dg-head plain', $m - 24, $y, $m - 14, $y - 5, $m - 14, $y + 5);
    $b .= poly('dg-head plain', $W - $m + 24, $y, $W - $m + 14, $y - 5, $W - $m + 14, $y + 5);
    if (my @h = list($a->{highlight})) {
        $b .= sprintf('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" class="dg-accent"/>', $X->(num($h[0])), $y, $X->(num($h[1])), $y);
    }
    for (my $i = 0; $i <= $nticks + 1e-9; $i++) {
        my $v = $min + $i * $step;
        my $x = $X->($v);
        my $labelled = abs(($v - $min) / $every - floor(($v - $min) / $every + 1e-9)) < 1e-6;
        $b .= line($x, $y - ($labelled ? 7 : 4), $x, $y + ($labelled ? 7 : 4), 'dg-line');
        my $k = (num(fmt($v)) // 0) . '';
        if (exists $custom{$k}) { $b .= T($x, $y + 24, $custom{$k}, anchor => 'middle'); }
        elsif ($labelled && !%custom) { $b .= T($x, $y + 24, fmt($v), anchor => 'middle'); }
    }
    my $below = @jumps ? 1 : 0;
    for my $p (@pts) {
        my $v = num($p->[0]); next unless defined $v;
        my $x = $X->($v);
        $b .= circ($x, $y, 5.5, 'dg-point-accent');
        if (defined $p->[1] && $p->[1] ne '') {
            $b .= $below ? T($x, $y + 44, $p->[1], anchor => 'middle', cls => 'dg-label-accent')
                         : T($x, $y - 16, $p->[1], anchor => 'middle', cls => 'dg-label-accent');
        }
    }
    my @jl = list($a->{jumplabels});
    for my $i (0 .. $#jumps - 1) {
        my ($p, $q) = (num($jumps[$i]), num($jumps[$i + 1]));
        my ($x1, $x2) = ($X->($p), $X->($q));
        $b .= carrow($x1, $y - 6, $x2, $y - 6, -46, 'accent');
        $b .= T(($x1 + $x2) / 2, $y - 34, $jl[$i], anchor => 'middle', cls => 'dg-label-accent') if defined $jl[$i];
    }
    if (my @e = list($a->{ends})) {
        $b .= T($m - 18, $y + 44, "← $e[0]", cls => 'dg-label-sm');
        $b .= T($W - $m + 18, $y + 44, "$e[1] →", cls => 'dg-label-sm', anchor => 'end');
    }
    my $H = $y + ((@pts && $below) || $a->{ends} ? 56 : 36);
    return (svg($W, $H, "Number line from " . fmt($min) . " to " . fmt($max) . (@pts ? ', marked: ' . join(', ', map { fmt(num($_->[0])) . ($_->[1] ? ' (' . plain($_->[1]) . ')' : '') } @pts) : ''), $b));
}

sub draw_hundred {
    my ($a) = @_;
    my $n = $a->{shaded} // 0;
    my $c = 14;
    my $G = 10 * $c;
    my $grids = $a->{grids} // max(1, ceil($n / 100 - 1e-9));
    my @labels = list($a->{labels}, qr/\s*;\s*/);
    my $gap = 26;
    my $zoom = $a->{zoom} && $n < 1;
    my $W = $grids * $G + ($grids - 1) * $gap + 20 + ($zoom ? 200 : 0);
    my $H = $G + 20 + (@labels ? 26 : 0);
    my $b = '';
    my $left = $n;
    for my $g (0 .. $grids - 1) {
        my $x0 = 10 + $g * ($G + $gap);
        my $y0 = 10;
        my $here = min(100, max(0, $left)); $left -= 100;
        for my $k (0 .. 99) {
            my ($r, $q) = (floor($k / 10), $k % 10);
            my $f = $here - $k;
            next if $f <= 0;
            my $w = $f >= 1 ? $c : $c * $f;
            $b .= rect($x0 + $q * $c, $y0 + $r * $c, $w, $c, 'dg-shade');
        }
        for my $k (0 .. 10) {
            $b .= line($x0 + $k * $c, $y0, $x0 + $k * $c, $y0 + $G, 'dg-grid');
            $b .= line($x0, $y0 + $k * $c, $x0 + $G, $y0 + $k * $c, 'dg-grid');
        }
        $b .= rect($x0, $y0, $G, $G, 'dg-outline');
        $b .= T($x0 + $G / 2, $y0 + $G + 20, $labels[$g], anchor => 'middle') if defined $labels[$g];
    }
    if ($zoom) {
        my $x0 = 10;
        $b .= rect($x0, 10, $c, $c, 'dg-accent');
        my ($zx, $zy, $Z) = ($grids * $G + 70, 10, 110);
        $b .= rect($zx, $zy, $Z * $n, $Z, 'dg-shade');
        $b .= rect($zx, $zy, $Z, $Z, 'dg-outline');
        $b .= arrow($x0 + $c + 4, 10 + $c / 2, $zx - 8, $zy + $Z / 2, 'muted');
        $b .= T($zx + $Z / 2, $zy + $Z + 20, 'one square = 1%', anchor => 'middle', cls => 'dg-label-sm');
    }
    return (svg($W, $H, "Hundred grid" . ($grids > 1 ? "s" : '') . " with " . fmt($n) . " small squares shaded", $b));
}

sub draw_bars {
    my ($a) = @_;
    my @bars = list($a->{bars}, qr/\s*;\s*/);
    my @labels = list($a->{labels}, qr/\s*;\s*/);
    my $maxw = max(map { my ($n, $d) = frac($_); ceil($n / $d - 1e-9) || 1 } @bars);
    my $unit = $a->{unit} // ($maxw > 1 ? min(150, int(440 / $maxw)) : 400);
    my $lw = @labels ? max(map { tw(plain($_), 13) } @labels) + 18 : 0;
    my ($bh, $gap) = (30, 16);
    my $W = 20 + $lw + $maxw * ($unit + 8) + 10;
    my $H = 10 + @bars * ($bh + $gap) + 4;
    my $b = '';
    my $y = 10;
    for my $i (0 .. $#bars) {
        my ($n, $d) = frac($bars[$i]);
        my $wholes = max(1, ceil($n / $d - 1e-9));
        my $x = 10 + $lw;
        $b .= T(10, $y + $bh / 2 + 5, $labels[$i]) if defined $labels[$i];
        my $left = $n;
        for my $w (0 .. $wholes - 1) {
            my $bx = $x + $w * ($unit + 8);
            for my $k (0 .. $d - 1) {
                my $cls = $left > 0 ? 'dg-fill-accent' : 'dg-fill-soft';
                $b .= rect($bx + $k * $unit / $d, $y, $unit / $d, $bh, $cls);
                $left--;
            }
            $b .= rect($bx, $y, $unit, $bh, 'dg-outline');
        }
        $y += $bh + $gap;
    }
    return (svg($W, $H, 'Fraction bars: ' . join('; ', map { plain($_) } @bars), $b));
}

sub draw_area {
    my ($a) = @_;
    my ($an, $ad) = frac($a->{a} // '1/2');
    my ($bn, $bd) = frac($a->{b} // '1/2');
    my $S = 180;
    my ($x0, $y0) = (70, 34);
    my $b = '';
    for my $c (0 .. $bd - 1) {
        $b .= rect($x0 + $c * $S / $bd, $y0, $S / $bd, $S, 'dg-fill-cold') if $c < $bn;
    }
    for my $r (0 .. $ad - 1) {
        $b .= rect($x0, $y0 + $r * $S / $ad, $S, $S / $ad, 'dg-fill-sun') if $r < $an;
    }
    for my $c (1 .. $bd - 1) { $b .= line($x0 + $c * $S / $bd, $y0, $x0 + $c * $S / $bd, $y0 + $S, 'dg-line'); }
    for my $r (1 .. $ad - 1) { $b .= line($x0, $y0 + $r * $S / $ad, $x0 + $S, $y0 + $r * $S / $ad, 'dg-line'); }
    $b .= rect($x0, $y0, $S, $S, 'dg-outline');
    $b .= rect($x0, $y0, $S * $bn / $bd, $S * $an / $ad, 'dg-accent');
    $b .= T($x0 + $S * $bn / $bd / 2, $y0 - 10, $a->{blabel} // "$bn/$bd", anchor => 'middle', cls => 'dg-label-cold');
    $b .= T($x0 - 8, $y0 + $S * $an / $ad / 2 + 4, $a->{alabel} // "$an/$ad", anchor => 'end', cls => 'dg-label-earth');
    my $tx = $x0 + $S + 24;
    $b .= T($tx, $y0 + 20, $a->{note1} // "columns: $bn of $bd shaded", cls => 'dg-label-sm');
    $b .= T($tx, $y0 + 40, $a->{note2} // "rows: $an of $ad shaded", cls => 'dg-label-sm');
    $b .= T($tx, $y0 + 70, $a->{result}, cls => 'dg-math') if defined $a->{result};
    $b .= T($tx, $y0 + 98, $a->{result2}, cls => 'dg-label') if defined $a->{result2};
    my $W = $tx + max(200, tw(plain($a->{result} // ''), 15) + 20);
    return (svg($W, $y0 + $S + 14, "Area model: a unit square with $an/$ad of the rows and $bn/$bd of the columns shaded. The overlap shows $an/$ad × $bn/$bd.", $b));
}

# Rectangle split into partial products: cols="2:2;0.5:1/2" rows="1:1;0.33:1/3" (size:label),
# cells="…;…" row by row. Shows every piece of a mixed-number product.
sub draw_partial {
    my ($a) = @_;
    my @c = items($a->{cols});
    my @r = items($a->{rows});
    my @cells = list($a->{cells}, qr/\s*;\s*/);
    my $cw = sum(map { num($_->[0]) } @c) || 1;
    my $rh = sum(map { num($_->[0]) } @r) || 1;
    my $u = min(300 / $cw, 170 / $rh);
    my ($x0, $y0) = (70, 34);
    my $b = '';
    my @fills = ('dg-fill-accent', 'dg-fill-sun', 'dg-fill-plant', 'dg-fill-hot');
    my $y = $y0; my $k = 0;
    for my $i (0 .. $#r) {
        my $h = num($r[$i][0]) * $u;
        my $x = $x0;
        $b .= T($x0 - 10, $y + $h / 2 + 4, $r[$i][1], anchor => 'end', cls => 'dg-label-accent');
        for my $j (0 .. $#c) {
            my $w = num($c[$j][0]) * $u;
            $b .= rect($x, $y, $w, $h, $fills[($i * 2 + $j) % 4]) . rect($x, $y, $w, $h, 'dg-outline');
            $b .= T($x + $w / 2, $y + $h / 2 + 4, $cells[$k], anchor => 'middle', cls => ($w < 70 ? 'dg-label-sm' : 'dg-label')) if defined $cells[$k];
            $b .= T($x + $w / 2, $y0 - 10, $c[$j][1], anchor => 'middle', cls => 'dg-label-accent') if $i == 0;
            $x += $w; $k++;
        }
        $y += $h;
    }
    my $W = $x0 + $cw * $u + 20;
    my $H = $y + 10;
    if (defined $a->{total}) { $b .= T($x0, $y + 24, $a->{total}, cls => 'dg-math'); $H += 28; }
    return (svg(max($W, $x0 + tw(plain($a->{total} // ''), 15) + 20), $H, 'Area model split into parts: ' . join(', ', map { plain($_) } @cells) . (defined $a->{total} ? '. ' . plain($a->{total}) : ''), $b));
}

sub draw_groups {
    my ($a) = @_;
    my ($tn, $td) = frac($a->{total} // '3');
    my ($pn, $pd) = frac($a->{piece} // '1/4');
    my $L = lcm($td, $pd);
    my $parts = $tn * $L / $td;
    my $gsize = $pn * $L / $pd;
    my $wholes = max(1, ceil($tn / $td - 1e-9));
    my $unit = min(170, int(480 / $wholes));
    my ($x0, $y0, $bh) = (10, 14, 30);
    my $b = '';
    my $k = 0;
    for my $w (0 .. $wholes - 1) {
        my $bx = $x0 + $w * ($unit + 8);
        for my $j (0 .. $L - 1) {
            my $cls = $k < $parts ? 'dg-fill-accent' : 'dg-fill-soft';
            $b .= rect($bx + $j * $unit / $L, $y0, $unit / $L, $bh, $cls);
            $k++;
        }
        $b .= rect($bx, $y0, $unit, $bh, 'dg-outline');
    }
    # groups under the bar
    # x of the boundary after p parts: start-side (for a group's left end) or end-side (right end)
    my $pstart = sub { my $p = shift; my $w = floor($p / $L + 1e-9); return $x0 + $w * ($unit + 8) + ($p - $w * $L) * $unit / $L; };
    my $pend   = sub { my $p = shift; my $w = max(0, ceil($p / $L - 1e-9) - 1); return $x0 + $w * ($unit + 8) + ($p - $w * $L) * $unit / $L; };
    my $g = 0;
    for (my $s = 0; $s + 1e-9 < $parts; $s += $gsize) {
        my $e = min($parts, $s + $gsize);
        my ($xa, $xb) = ($pstart->($s) + 2, $pend->($e) - 2);
        $g++;
        my $full = $e - $s >= $gsize - 1e-9;
        $b .= sprintf('<path d="M%.1f,%d Q%.1f,%d %.1f,%d" class="dg-arrow %s"/>', $xa, $y0 + $bh + 4, ($xa + $xb) / 2, $y0 + $bh + 22, $xb, $y0 + $bh + 4, $full ? 'accent' : 'muted');
        $b .= T(($xa + $xb) / 2, $y0 + $bh + 32, $full ? $g : '', anchor => 'middle', cls => 'dg-label-accent') if $full && ($a->{numbers} // 1);
    }
    my $W = $x0 + $wholes * ($unit + 8) + 10;
    my $H = $y0 + $bh + 42;
    if (defined $a->{count}) { $b .= T($W / 2, $H + 16, $a->{count}, anchor => 'middle', cls => 'dg-math'); $H += 26; }
    return (svg($W, $H, "Bar model: " . plain($a->{total}) . " split into pieces of size " . plain($a->{piece}), $b));
}

sub chip {
    my ($x, $y, $sign, $cross) = @_;
    my $r = 11;
    my $s = circ($x, $y, $r, $sign > 0 ? 'dg-fill-sun' : 'dg-fill-hot');
    $s .= sprintf('<text x="%.1f" y="%.1f" text-anchor="middle" class="dg-math">%s</text>', $x, $y + 5, $sign > 0 ? '+' : '−');
    $s .= line($x - 9, $y + 9, $x + 9, $y - 9, 'dg-line') if $cross;
    return $s;
}

sub draw_counters {
    my ($a) = @_;
    my $b = '';
    my ($W, $H);
    if (defined $a->{groups}) {
        my ($g, $e) = (num($a->{groups}), num($a->{each}));
        my $ae = abs($e);
        if ($g > 0) {
            my $bw = max(60, $ae * 26 + 14);
            $W = 20 + $g * ($bw + 12);
            for my $i (0 .. $g - 1) {
                my $x0 = 10 + $i * ($bw + 12);
                $b .= rect($x0, 10, $bw, 40, 'dg-dashed', 6);
                $b .= chip($x0 + 18 + $_ * 26, 30, $e) for 0 .. $ae - 1;
            }
            $H = 64;
            $b .= T($W / 2, 74, $a->{result}, anchor => 'middle', cls => 'dg-math') if defined $a->{result};
            $H = 84 if defined $a->{result};
            return (svg($W, $H, "$g groups of " . fmt($e) . " counters" . (defined $a->{result} ? ': ' . plain($a->{result}) : ''), $b));
        }
        # negative groups: remove |g| groups of e from zero pairs
        my $n = abs($g) * $ae;
        $W = 20 + $n * 28 + 10;
        for my $i (0 .. $n - 1) {
            my $x = 24 + $i * 28;
            my $removed = 1;
            $b .= chip($x, 26, $e > 0 ? 1 : -1, $removed);
            $b .= chip($x, 54, $e > 0 ? -1 : 1, 0);
        }
        $b .= T(10, 88, "Start with $n zero pairs. Take away " . abs($g) . ' groups of ' . fmt($e) . '.', cls => 'dg-label-sm');
        $b .= T(10, 110, $a->{result}, cls => 'dg-math') if defined $a->{result};
        $H = defined $a->{result} ? 120 : 98;
        return (svg(max($W, 330), $H, "Zero pairs with " . abs($g) . " groups of " . fmt($e) . " crossed out" . (defined $a->{result} ? ': ' . plain($a->{result}) : ''), $b));
    }
    my ($p, $n, $pairs) = ($a->{pos} // 0, $a->{neg} // 0, $a->{pairs} // 0);
    my $cols = max($p, $n);
    $W = 20 + $cols * 28 + 10;
    $b .= chip(24 + $_ * 28, 26, 1) for 0 .. $p - 1;
    $b .= chip(24 + $_ * 28, 56, -1) for 0 .. $n - 1;
    for my $i (0 .. $pairs - 1) { $b .= rect(10 + $i * 28, 11, 28, 60, 'dg-dashed', 12); }
    $H = 82;
    if (defined $a->{result}) { $b .= T(10, 100, $a->{result}, cls => 'dg-math'); $H = 110; }
    return (svg(max($W, 200), $H, "$p positive and $n negative counters" . ($pairs ? ", $pairs zero pairs circled" : ''), $b));
}

sub draw_tape {
    my ($a) = @_;
    my @rows = items($a->{parts});
    my @vals = list($a->{values}, qr/\s*;\s*/);
    my $maxp = max(map { $_->[0] } @rows);
    my $lw = max(map { tw($_->[1] // '', 12) } @rows) + 20;
    my $u = min(52, int(380 / $maxp));
    my ($bh, $gap) = (30, 12);
    my $b = '';
    my $y = 10;
    for my $i (0 .. $#rows) {
        my ($k, $lab) = @{ $rows[$i] };
        $b .= T(10, $y + $bh / 2 + 5, $lab // '');
        for my $j (0 .. $k - 1) {
            $b .= rect($lw + $j * $u, $y, $u, $bh, $i % 2 ? 'dg-fill-sun' : 'dg-fill-accent');
            my $v = $vals[$i] // $vals[0];
            $b .= T($lw + $j * $u + $u / 2, $y + $bh / 2 + 5, $v, anchor => 'middle', cls => 'dg-label-sm') if defined $v && $v ne '';
        }
        $y += $bh + $gap;
    }
    my $W = $lw + $maxp * $u + 20;
    if (defined $a->{total}) {
        my $x = $W - 6;
        $b .= sprintf('<path d="M%.1f,%d Q%.1f,%d %.1f,%d Q%.1f,%d %.1f,%d" class="dg-arrow muted"/>', $x - 8, 10, $x + 4, 10, $x + 4, ($y - $gap) / 2 + 5, $x + 4, $y - $gap, $x - 8, $y - $gap);
        $b .= T($x + 12, ($y - $gap) / 2 + 9, $a->{total}, cls => 'dg-label');
        $W += 20 + tw(plain($a->{total}), 12) + 10;
    }
    return (svg($W, $y, 'Tape diagram: ' . join(', ', map { "$_->[0] parts " . ($_->[1] // '') } @rows), $b));
}

sub draw_dnl {
    my ($a) = @_;
    my @top = list($a->{top});
    my @bot = list($a->{bottom});
    my $n = max(scalar @top, scalar @bot);
    my $W = $a->{width} // 560;
    my $lw = max(tw($a->{toplabel} // '', 12), tw($a->{bottomlabel} // '', 12)) + 18;
    my ($m, $y1, $y2) = ($lw + 16, 40, 104);
    my $X = sub { $m + $_[0] * ($W - $m - 30) / (($n - 1) || 1) };
    my $b = '';
    for my $y ($y1, $y2) {
        $b .= line($m - 10, $y, $W - 14, $y, 'dg-line');
        $b .= poly('dg-head plain', $W - 8, $y, $W - 17, $y - 5, $W - 17, $y + 5);
    }
    for my $i (0 .. $n - 1) {
        my $x = $X->($i);
        $b .= line($x, $y1 - 6, $x, $y1 + 6, 'dg-line') . line($x, $y2 - 6, $x, $y2 + 6, 'dg-line');
        $b .= T($x, $y1 - 12, $top[$i], anchor => 'middle') if defined $top[$i];
        $b .= T($x, $y2 + 22, $bot[$i], anchor => 'middle') if defined $bot[$i];
    }
    $b .= T(8, $y1 + 4, $a->{toplabel}, cls => 'dg-label-accent') if $a->{toplabel};
    $b .= T(8, $y2 + 4, $a->{bottomlabel}, cls => 'dg-label-accent') if $a->{bottomlabel};
    for my $ar (list($a->{arrow}, qr/\s*;\s*/)) {
        my ($i, $j, $lab) = split /\s*,\s*/, $ar, 3;
        my ($xa, $xb) = ($X->($i), $X->($j));
        $b .= carrow($xa, $y1 + 10, $xb, $y1 + 10, 22, 'accent');
        $b .= carrow($xa, $y2 - 10, $xb, $y2 - 10, -22, 'accent');
        $b .= T(($xa + $xb) / 2, ($y1 + $y2) / 2 + 5, $lab, anchor => 'middle', cls => 'dg-label-accent') if defined $lab;
    }
    return (svg($W, $y2 + 34, 'Double number line. ' . ($a->{toplabel} // 'Top') . ': ' . join(', ', map { plain($_) } @top) . '. ' . ($a->{bottomlabel} // 'Bottom') . ': ' . join(', ', map { plain($_) } @bot) . '.', $b));
}

sub draw_percentbar {
    my ($a) = @_;
    my @top = list($a->{top});
    my @bot = list($a->{bottom});
    my @tv = map { num($_) // 0 } @top;
    my $pmax = max(100, @tv);
    my $W = $a->{width} // 560;
    my $lw = max(tw($a->{toplabel} // '', 12), tw($a->{bottomlabel} // '', 12));
    $lw = $lw ? $lw + 20 : 0;
    my ($m, $y0, $bh) = ($lw + 20, 40, 34);
    my $X = sub { $m + $_[0] / $pmax * ($W - $m - 24) };
    my $b = '';
    my $p = num($a->{percent} // 0);
    $b .= rect($m, $y0, $X->($pmax) - $m, $bh, 'dg-fill-soft');
    $b .= rect($m, $y0, $X->($p) - $m, $bh, 'dg-fill-accent') if $p > 0;
    $b .= rect($m, $y0, $X->(100) - $m, $bh, 'dg-outline');
    $b .= rect($m, $y0, $X->($pmax) - $m, $bh, 'dg-outline') if $pmax > 100;
    for my $i (0 .. $#top) {
        my $x = $X->($tv[$i]);
        $b .= line($x, $y0 - 5, $x, $y0 + $bh + 5, 'dg-line');
        $b .= T($x, $y0 - 10, $top[$i], anchor => 'middle');
        $b .= T($x, $y0 + $bh + 22, $bot[$i], anchor => 'middle') if defined $bot[$i];
    }
    $b .= T(6, $y0 - 10, $a->{toplabel}, cls => 'dg-label-accent') if $a->{toplabel};
    $b .= T(6, $y0 + $bh + 22, $a->{bottomlabel}, cls => 'dg-label-accent') if $a->{bottomlabel};
    if ($pmax > 100) { $b .= T($X->(100), $y0 + $bh + 40, 'one whole', anchor => 'middle', cls => 'dg-label-sm'); }
    return (svg($W, $y0 + $bh + ($pmax > 100 ? 48 : 32), "Percent bar: " . fmt($p) . "% shaded. Percents " . join(', ', map { plain($_) } @top) . (@bot ? '; values ' . join(', ', map { plain($_) } @bot) : ''), $b));
}

# ═════════════════════════════════════════════════════════════════════════
# ALGEBRA
# ═════════════════════════════════════════════════════════════════════════

# Draw one side of a balance: terms like 2x, x, x/3, +3, −4.
sub pan_items {
    my ($terms, $cx, $ytop) = @_;
    my @shapes;
    for my $t (list($terms, qr/\s*;\s*/)) {
        (my $s = $t) =~ s/[−–]/-/g;
        if ($s =~ /^([+-]?\d*)x$/) {
            my $k = $1 eq '' || $1 eq '+' ? 1 : $1 eq '-' ? -1 : $1;
            push @shapes, ['x', $k > 0 ? 1 : -1] for 1 .. abs($k);
        } elsif ($s =~ m{^x/(\d+)$}) { push @shapes, ["x/$1", 1]; }
        elsif ($s =~ /^([+-]?)(\d+)$/) {
            my $v = $2; my $sg = $1 eq '-' ? -1 : 1;
            if ($v > 12) { push @shapes, ['big', $sg, $v]; } else { push @shapes, ['u', $sg] for 1 .. $v; }
        }
    }
    # lay out: x-bags first, then unit blocks in rows of 6
    my @bags = grep { $_->[0] =~ /^x/ } @shapes;
    my @units = grep { $_->[0] !~ /^x/ } @shapes;
    my $out = '';
    my $bw = 24;
    my $wb = @bags * ($bw + 4);
    my $nu = scalar @units;
    my $per = min(6, $nu || 1);
    my $wu = (grep { $_->[0] eq 'big' } @units) ? 46 : $per * 14;
    my $total = $wb + ($nu ? $wu + 6 : 0);
    my $x = $cx - $total / 2;
    for my $g (@bags) {
        my $label = $g->[0] eq 'x' ? ($g->[1] > 0 ? 'x' : '−x') : $g->[0];
        my $w = $g->[0] eq 'x' ? $bw : 36;
        $out .= rect($x, $ytop - 30, $w, 30, $g->[1] > 0 ? 'dg-fill-accent' : 'dg-fill-hot', 6);
        $out .= T($x + $w / 2, $ytop - 10, $label, anchor => 'middle', cls => 'dg-label');
        $x += $w + 4;
    }
    $x += 4 if @bags && $nu;
    my $i = 0;
    for my $u (@units) {
        if ($u->[0] eq 'big') {
            $out .= rect($x, $ytop - 30, 44, 30, $u->[1] > 0 ? 'dg-fill-sun' : 'dg-fill-hot', 3);
            $out .= T($x + 22, $ytop - 10, ($u->[1] < 0 ? '−' : '') . $u->[2], anchor => 'middle', cls => 'dg-label');
            $x += 48; next;
        }
        my ($r, $c) = (floor($i / 6), $i % 6);
        my $ux = $x + $c * 14;
        my $uy = $ytop - 13 - $r * 14;
        $out .= rect($ux, $uy, 12, 12, $u->[1] > 0 ? 'dg-fill-sun' : 'dg-fill-hot');
        $out .= T($ux + 6, $uy + 10, '−', anchor => 'middle', cls => 'dg-label-sm') if $u->[1] < 0;
        $i++;
    }
    return $out;
}

sub draw_balance {
    my ($a) = @_;
    my ($W, $H) = (420, 170);
    my ($lx, $rx, $py) = (110, 310, 92);
    my $b = '';
    $b .= poly('dg-fill-soft', 210, $py, 192, $py + 52, 228, $py + 52);
    $b .= line(60, $py, 360, $py, 'dg-arrow plain');
    for my $cx ($lx, $rx) {
        $b .= line($cx, $py, $cx - 34, $py - 26, 'dg-line') . line($cx, $py, $cx + 34, $py - 26, 'dg-line');
        $b .= line($cx - 62, $py - 26, $cx + 62, $py - 26, 'dg-arrow plain');
    }
    $b .= pan_items($a->{left}, $lx, $py - 28);
    $b .= pan_items($a->{right}, $rx, $py - 28);
    my $eq = $a->{text} // do {
        my $f = sub { my $s = join ' + ', map { s/^\+//r } list($_[0], qr/\s*;\s*/); $s =~ s/\+ -/− /g; $s =~ s/-/−/g; $s };
        $f->($a->{left}) . ' = ' . $f->($a->{right});
    };
    $b .= T(210, $H - 6, $eq, anchor => 'middle', cls => 'dg-math');
    return (svg($W, $H, 'Balance scale: ' . plain($eq), $b));
}

sub draw_scale { my ($a) = @_; return draw_balance($a); }

sub draw_pattern {
    my ($a) = @_;
    my ($start, $add, $figs) = ($a->{start} // 1, $a->{add} // 2, $a->{figures} // 3);
    my $c = 16;
    my $rows = max($start, $add);
    my $b = '';
    my $x = 12;
    my $H = 30 + $rows * $c + 28;
    for my $f (1 .. $figs) {
        my $x0 = $x;
        my $is_last = $f == $figs && defined $a->{last};
        if ($is_last) {
            $b .= rect($x, 30, 70, $rows * $c, 'dg-dashed', 6);
            $b .= T($x + 35, 30 + $rows * $c / 2 + 6, $a->{last}, anchor => 'middle', cls => 'dg-math');
            $b .= T($x + 35, $H - 6, "Figure $f", anchor => 'middle', cls => 'dg-label-sm');
            $x += 70 + 34; next;
        }
        for my $k (0 .. $start - 1) { $b .= rect($x, 30 + ($rows - 1 - $k) * $c, $c, $c, 'dg-fill-soft'); $b .= rect($x, 30 + ($rows - 1 - $k) * $c, $c, $c, 'dg-outline'); }
        $x += $c + 3;
        for my $g (1 .. $f) {
            for my $k (0 .. $add - 1) { $b .= rect($x, 30 + ($rows - 1 - $k) * $c, $c, $c, 'dg-fill-accent'); }
            $x += $c;
        }
        $b .= T(($x0 + $x) / 2, $H - 6, "Figure $f", anchor => 'middle', cls => 'dg-label-sm');
        $x += 34;
    }
    $b .= T(12, 16, $a->{note}, cls => 'dg-label-sm') if $a->{note};
    return (svg($x, $H, "Growing pattern: figure n has $start grey square" . ($start == 1 ? '' : 's') . " plus n groups of $add coloured squares", $b));
}

# Shared grid for coord and transform.
sub grid_frame {
    my (%o) = @_;
    my ($xmin, $xmax, $ymin, $ymax) = @o{qw(xmin xmax ymin ymax)};
    my ($xs, $ys) = ($o{xstep} || 1, $o{ystep} || 1);
    my $cell = $o{cell};
    my ($ml, $mb, $mt, $mr) = (46, 40, ($o{ylabel} ? 32 : 18), 22);
    my $gw = ($xmax - $xmin) / $xs * $cell;
    my $gh = ($ymax - $ymin) / $ys * $cell;
    my $X = sub { $ml + ($_[0] - $xmin) / $xs * $cell };
    my $Y = sub { $mt + ($ymax - $_[0]) / $ys * $cell };
    my $b = '';
    for (my $v = $xmin; $v <= $xmax + 1e-9; $v += $xs) { $b .= line($X->($v), $Y->($ymin), $X->($v), $Y->($ymax), 'dg-grid'); }
    for (my $v = $ymin; $v <= $ymax + 1e-9; $v += $ys) { $b .= line($X->($xmin), $Y->($v), $X->($xmax), $Y->($v), 'dg-grid'); }
    my $ax = $xmin <= 0 && $xmax >= 0 ? 0 : $xmin;
    my $ay = $ymin <= 0 && $ymax >= 0 ? 0 : $ymin;
    $b .= line($X->($xmin), $Y->($ay), $X->($xmax) + 10, $Y->($ay), 'dg-line') . poly('dg-head plain', $X->($xmax) + 16, $Y->($ay), $X->($xmax) + 7, $Y->($ay) - 4.5, $X->($xmax) + 7, $Y->($ay) + 4.5);
    $b .= line($X->($ax), $Y->($ymin), $X->($ax), $Y->($ymax) - 10, 'dg-line') . poly('dg-head plain', $X->($ax), $Y->($ymax) - 16, $X->($ax) - 4.5, $Y->($ymax) - 7, $X->($ax) + 4.5, $Y->($ymax) - 7);
    my ($xe, $ye) = ($o{xevery} || $xs, $o{yevery} || $ys);
    my $four = $xmin < 0 && $ymin < 0;
    for (my $v = $xmin; $v <= $xmax + 1e-9; $v += $xe) {
        next if $four && abs($v) < 1e-9;
        $b .= T($X->($v), $Y->($ay) + 16, fmt($v), anchor => 'middle', cls => 'dg-label-sm');
    }
    for (my $v = $ymin; $v <= $ymax + 1e-9; $v += $ye) {
        next if abs($v - $ay) < 1e-9 && $ax == $xmin + 0 && !$four && $v == 0;
        next if $four && abs($v) < 1e-9;
        $b .= T($X->($ax) - 6, $Y->($v) + 4, fmt($v), anchor => 'end', cls => 'dg-label-sm');
    }
    $b .= T($X->(0) - 5, $Y->(0) + 15, '0', anchor => 'end', cls => 'dg-label-sm') if $four;
    $b .= T($X->($xmax) + 14, $Y->($ay) + 34, $o{xlabel}, anchor => 'end', cls => 'dg-label') if $o{xlabel};
    $b .= T($X->($ax) + 10, $mt - 2, $o{ylabel}, anchor => 'start', cls => 'dg-label') if $o{ylabel};
    my $W = $ml + $gw + $mr + 10;
    my $H = $mt + $gh + $mb;
    return ($b, $X, $Y, $W, $H);
}

sub draw_coord {
    my ($a) = @_;
    my %o = (xmin => $a->{xmin} // 0, xmax => $a->{xmax} // 10, ymin => $a->{ymin} // 0, ymax => $a->{ymax} // 10,
             xstep => $a->{xstep} // 1, ystep => $a->{ystep} // 1, xevery => $a->{xevery}, yevery => $a->{yevery},
             xlabel => $a->{xlabel}, ylabel => $a->{ylabel});
    my $nx = ($o{xmax} - $o{xmin}) / $o{xstep};
    my $ny = ($o{ymax} - $o{ymin}) / $o{ystep};
    $o{cell} = $a->{cell} // max(14, min(30, int(($a->{width} // 420) / $nx), int(320 / $ny)));
    $o{ylabel} = $a->{ylabel};
    my ($b, $X, $Y, $W, $H) = grid_frame(%o);
    $o{mt} = 18;
    my $src = join ';', grep { defined && $_ ne '' } $a->{points}, ($KEY ? $a->{keypoints} : undef);
    my @p = map { my ($xy, $lab) = split /\s*:\s*/, $_, 2; my ($x, $y) = split /\s*,\s*/, $xy; [num($x), num($y), $lab] } list($src, qr/\s*;\s*/);
    if ($a->{line} && @p > 1) {
        my $d = 'M' . join(' L', map { sprintf('%.1f,%.1f', $X->($_->[0]), $Y->($_->[1])) } @p);
        $b .= qq{<path d="$d" class="} . ($a->{dashed} ? 'dg-dashed' : 'dg-accent') . '"/>';
    }
    if (defined $a->{vline}) {   # vline=3: a dashed vertical line (the vertical line test)
        my $vx = $X->(num($a->{vline}));
        $b .= sprintf('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" class="dg-dashed"/>', $vx, $Y->($o{ymax}), $vx, $Y->($o{ymin}));
    }
    for my $q (map { my ($x, $y) = split /\s*,\s*/; [num($x), num($y)] } list($a->{open}, qr/\s*;\s*/)) {   # open="x,y;…": open circles
        $b .= sprintf('<circle cx="%.1f" cy="%.1f" r="4.5" fill="#fff" class="dg-accent"/>', $X->($q->[0]), $Y->($q->[1]));
    }
    for my $q (@p) {
        $b .= circ($X->($q->[0]), $Y->($q->[1]), 4.5, 'dg-point-accent');
        $b .= T($X->($q->[0]) + 8, $Y->($q->[1]) - 8, $q->[2], cls => 'dg-label-accent') if defined $q->[2] && $q->[2] ne '';
    }
    return (svg($W, $H, 'Coordinate grid' . ($a->{xlabel} ? ", x: $a->{xlabel}" : '') . ($a->{ylabel} ? ", y: $a->{ylabel}" : '') . (@p ? '. Points: ' . join('; ', map { '(' . fmt($_->[0]) . ', ' . fmt($_->[1]) . ')' } @p) : ''), $b));
}

sub apply_move {
    my ($pts, $move) = @_;
    my @p = map { [@$_] } @$pts;
    for my $m (split /\s+then\s+/, $move) {
        if ($m =~ /translate\s+(-?\d+)\s*,\s*(-?\d+)/) { my ($dx, $dy) = ($1, $2); $_ = [$_->[0] + $dx, $_->[1] + $dy] for @p; }
        elsif ($m =~ /reflect\s+(?:in\s+(?:the\s+)?)?x/) { $_ = [$_->[0], -$_->[1]] for @p; }
        elsif ($m =~ /reflect\s+(?:in\s+(?:the\s+)?)?y/) { $_ = [-$_->[0], $_->[1]] for @p; }
        elsif ($m =~ /rotate\s+(90|180|270)/) {
            my $r = $1;
            for (@p) { my ($x, $y) = @$_; $_ = $r == 90 ? [-$y, $x] : $r == 180 ? [-$x, -$y] : [$y, -$x]; }
        }
    }
    return @p;
}

sub draw_transform {
    my ($a) = @_;
    my $R = $a->{range} // 6;
    my @shape = map { [map { num($_) } split /\s*,\s*/] } list($a->{shape}, qr/\s*;\s*/);
    my $image = $a->{image} // 'show';
    my @img = apply_move(\@shape, $a->{move} // '');
    my %o = (xmin => -$R, xmax => $R, ymin => -$R, ymax => $R, xstep => 1, ystep => 1, xevery => $a->{every} // 2, yevery => $a->{every} // 2, cell => $a->{cell} // int(300 / (2 * $R)));
    my ($b, $X, $Y, $W, $H) = grid_frame(%o);
    my @names = list($a->{names});
    my $draw = sub {
        my ($pts, $cls, $suffix, $lcls) = @_;
        my $s = poly($cls, map { ($X->($_->[0]), $Y->($_->[1])) } @$pts);
        for my $i (0 .. $#$pts) {
            $s .= circ($X->($pts->[$i][0]), $Y->($pts->[$i][1]), 3.2, 'dg-point');
            $s .= T($X->($pts->[$i][0]) + 6, $Y->($pts->[$i][1]) - 6, $names[$i] . $suffix, cls => $lcls) if defined $names[$i];
        }
        return $s;
    };
    $b .= $draw->(\@shape, 'dg-fill-accent', '', 'dg-label-accent');
    my $show_img = $image eq 'show' || ($image eq 'key' && $KEY);
    $b .= $draw->(\@img, 'dg-fill-hot', '′', 'dg-label-hot') if $show_img;
    if ($a->{mirror}) {
        if ($a->{mirror} eq 'x') { $b .= line($X->(-$R), $Y->(0), $X->($R), $Y->(0), 'dg-accent'); }
        elsif ($a->{mirror} eq 'y') { $b .= line($X->(0), $Y->(-$R), $X->(0), $Y->($R), 'dg-accent'); }
    }
    return (svg($W, $H, 'Grid with shape ' . join(' ', @names) . ' at ' . join('; ', map { "($_->[0], $_->[1])" } @shape) . ($show_img ? '. Image after ' . ($a->{move} // '') . ': ' . join('; ', map { "($_->[0], $_->[1])" } @img) : ''), $b));
}

# ═════════════════════════════════════════════════════════════════════════
# MEASUREMENT & GEOMETRY
# ═════════════════════════════════════════════════════════════════════════

sub draw_righttri {
    my ($a) = @_;
    my $av = $a->{aval} // num($a->{a}) // 3;
    my $bv = $a->{bval} // num($a->{b}) // 4;
    my $sq = $a->{squares};
    my $scale = $sq ? 125 / max($av, $bv, 1) : 190 / max($av, $bv, 1);
    my ($A, $B) = ($av * $scale, $bv * $scale);
    # right angle at bottom-left C; a vertical (left side), b horizontal (bottom)
    my ($ox, $oy) = $sq ? ($A + 40, 30 + max($A, 0) + ($A + $B) * 0.0 + 10) : (60, 30 + $A);
    if ($sq) { $ox = $A + 30; $oy = 20 + $A + sqrt($A * $A + $B * $B) * 0.75; }
    my @C = ($ox, $oy);
    my @Bp = ($ox, $oy - $A);   # top
    my @Ap = ($ox + $B, $oy);   # right
    my $b = '';
    my @ar = list($a->{areas}, qr/\s*[;,]\s*/);
    if ($sq) {
        # square on a (left of vertical side)
        $b .= poly('dg-fill-sun', $C[0], $C[1], $Bp[0], $Bp[1], $Bp[0] - $A, $Bp[1], $C[0] - $A, $C[1]);
        $b .= T($C[0] - $A / 2, $C[1] - $A / 2 + 5, $ar[0], anchor => 'middle', cls => 'dg-math') if defined $ar[0];
        # square on b (below horizontal side)
        $b .= poly('dg-fill-cold', $C[0], $C[1], $Ap[0], $Ap[1], $Ap[0], $Ap[1] + $B, $C[0], $C[1] + $B);
        $b .= T($C[0] + $B / 2, $C[1] + $B / 2 + 5, $ar[1], anchor => 'middle', cls => 'dg-math') if defined $ar[1];
        # square on hypotenuse (outward, up-right)
        my ($dx, $dy) = ($Ap[0] - $Bp[0], $Ap[1] - $Bp[1]);
        my ($nx, $ny) = (-$dy, $dx); # rotate; choose outward (away from C)
        my ($mx, $my) = (($Ap[0] + $Bp[0]) / 2 - $C[0], ($Ap[1] + $Bp[1]) / 2 - $C[1]);
        ($nx, $ny) = (-$nx, -$ny) if $nx * $mx + $ny * $my < 0;
        my @P3 = ($Ap[0] + $nx, $Ap[1] + $ny);
        my @P4 = ($Bp[0] + $nx, $Bp[1] + $ny);
        $b .= poly('dg-fill-plant', @Bp, @Ap, @P3, @P4);
        $b .= T(($Bp[0] + $P3[0]) / 2, ($Bp[1] + $P3[1]) / 2 + 5, $ar[2], anchor => 'middle', cls => 'dg-math') if defined $ar[2];
        my $minx = min($C[0] - $A, $P4[0], $P3[0]);
        my $maxx = max($Ap[0], $P3[0], $P4[0]);
        my $miny = min($Bp[1], $P3[1], $P4[1]);
        my $maxy = $C[1] + $B;
        $b .= poly('dg-boundary', @C, @Bp, @Ap);
        $b .= sprintf('<polyline points="%.1f,%.1f %.1f,%.1f %.1f,%.1f" class="dg-right-angle"/>', $C[0], $C[1] - 12, $C[0] + 12, $C[1] - 12, $C[0] + 12, $C[1]);
        $b .= T($C[0] + 8, ($C[1] + $Bp[1]) / 2 + 4, $a->{a}, cls => 'dg-label-accent') if defined $a->{a};
        $b .= T(($C[0] + $Ap[0]) / 2, $C[1] - 8, $a->{b}, anchor => 'middle', cls => 'dg-label-accent') if defined $a->{b};
        $b .= T(($Bp[0] + $Ap[0]) / 2 - 8, ($Bp[1] + $Ap[1]) / 2 + 16, $a->{c}, anchor => 'end', cls => 'dg-label-accent') if defined $a->{c};
        my $shift = 10 - $minx;
        my $vshift = 10 - $miny;
        return (svg($maxx - $minx + 20, $maxy - $miny + 20, "Right triangle with a square drawn on each side. Areas: " . join(', ', map { plain($_) } @ar), qq{<g transform="translate($shift,$vshift)">$b</g>}));
    }
    $b .= poly('dg-boundary', @C, @Bp, @Ap);
    $b .= sprintf('<polyline points="%.1f,%.1f %.1f,%.1f %.1f,%.1f" class="dg-right-angle"/>', $C[0], $C[1] - 14, $C[0] + 14, $C[1] - 14, $C[0] + 14, $C[1]);
    my $hyp = sprintf('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" class="dg-accent"/>', @Bp, @Ap);
    $b .= $hyp if $a->{hyp} // 0;
    my $al = join ' ', grep { defined && $_ ne '' } ($a->{alabel}, $a->{a});
    my $bl = join ' ', grep { defined && $_ ne '' } ($a->{blabel}, $a->{b});
    my $cl = join ' ', grep { defined && $_ ne '' } ($a->{clabel}, $a->{c});
    $b .= T($C[0] - 10, ($C[1] + $Bp[1]) / 2 + 4, $al, anchor => 'end', cls => 'dg-label-accent') if $al ne '';
    $b .= T(($C[0] + $Ap[0]) / 2, $C[1] + 20, $bl, anchor => 'middle', cls => 'dg-label-accent') if $bl ne '';
    $b .= T(($Bp[0] + $Ap[0]) / 2 + 10, ($Bp[1] + $Ap[1]) / 2 - 8, $cl, anchor => 'start', cls => 'dg-label-accent') if $cl ne '';
    if (my @n = list($a->{names})) {
        $b .= T($C[0] - 8, $C[1] + 16, $n[0], anchor => 'end');
        $b .= T($Bp[0] - 8, $Bp[1] - 4, $n[1], anchor => 'end');
        $b .= T($Ap[0] + 8, $Ap[1] + 4, $n[2]);
    }
    my $W = $Ap[0] + 40 + max(0, tw(plain($cl), 11) - $B / 2 + 10);
    return (svg($W, $oy + 34, "Right triangle. Legs: " . plain($al) . ' and ' . plain($bl) . '. Hypotenuse: ' . plain($cl) . '.', $b));
}

# Oblique rectangular prism.
sub draw_prism {
    my ($a) = @_;
    my ($lv, $wv, $hv) = ($a->{lv} // num($a->{l}) // 6, $a->{wv} // num($a->{w}) // 3, $a->{hv} // num($a->{h}) // 4);
    my $s = 200 / max($lv + $wv * 0.6, $hv + $wv * 0.4, 1);
    my ($L, $Wd, $Hh) = ($lv * $s, $wv * $s * 0.5, $hv * $s);
    my ($x0, $y0) = (58, 20 + $Wd * 0.8 + $Hh);
    my ($dx, $dy) = ($Wd * 0.9, -$Wd * 0.75);
    my $b = '';
    # hidden edges
    $b .= sprintf('<path d="M%.1f,%.1f L%.1f,%.1f M%.1f,%.1f L%.1f,%.1f M%.1f,%.1f L%.1f,%.1f" class="dg-dashed"/>',
        $x0 + $dx, $y0 + $dy, $x0 + $dx + $L, $y0 + $dy, $x0 + $dx, $y0 + $dy, $x0 + $dx, $y0 + $dy - $Hh, $x0, $y0, $x0 + $dx, $y0 + $dy);
    $b .= poly('dg-fill-soft', $x0, $y0 - $Hh, $x0 + $dx, $y0 + $dy - $Hh, $x0 + $dx + $L, $y0 + $dy - $Hh, $x0 + $L, $y0 - $Hh);
    $b .= poly('dg-fill-accent', $x0 + $L, $y0, $x0 + $L + $dx, $y0 + $dy, $x0 + $L + $dx, $y0 + $dy - $Hh, $x0 + $L, $y0 - $Hh);
    $b .= rect($x0, $y0 - $Hh, $L, $Hh, 'dg-boundary');
    $b .= T($x0 + $L / 2, $y0 + 18, $a->{l}, anchor => 'middle', cls => 'dg-label-accent') if defined $a->{l};
    $b .= T($x0 - 8, $y0 - $Hh / 2 + 4, $a->{h}, anchor => 'end', cls => 'dg-label-accent') if defined $a->{h};
    $b .= T($x0 + $L + $dx / 2 + 8, $y0 + $dy / 2 + 12, $a->{w}, cls => 'dg-label-accent') if defined $a->{w};
    $b .= T($x0 + $L / 2, $y0 - $Hh / 2 + 4, $a->{face}, anchor => 'middle', cls => 'dg-label-sm') if $a->{face};
    my $Wt = $x0 + $L + $dx + 20 + max(30, tw(plain($a->{w} // ''), 11));
    return (svg($Wt, $y0 + 28, 'Rectangular prism. Length ' . plain($a->{l}) . ', width ' . plain($a->{w}) . ', height ' . plain($a->{h}) . '.', $b));
}

sub draw_triprism {
    my ($a) = @_;
    my ($bv, $thv, $lv) = ($a->{bv} // num($a->{b}) // 6, $a->{thv} // num($a->{th}) // 4, $a->{lv} // num($a->{l}) // 8);
    my $s = 170 / max($bv, $thv, $lv * 0.7, 1);
    my ($B, $TH, $L) = ($bv * $s, $thv * $s, $lv * $s * 0.55);
    my ($x0, $y0) = (40, 24 + $TH + $L * 0.45);
    my ($dx, $dy) = ($L * 0.72, -$L * 0.36);
    my $apex = $a->{right} ? 0 : $B / 2;
    my @F = ($x0, $y0, $x0 + $B, $y0, $x0 + $apex, $y0 - $TH);
    my @K = map { $_ % 2 ? $F[$_] + $dy : $F[$_] + $dx } 0 .. 5;
    my $b = '';
    $b .= poly('dg-fill-soft', $F[4], $F[5], $K[4], $K[5], $K[2], $K[3], $F[2], $F[3]);
    $b .= poly('dg-fill-accent', @F);
    $b .= sprintf('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" class="dg-dashed"/>', $x0 + $apex, $y0, $x0 + $apex, $y0 - $TH) unless $a->{right};
    $b .= sprintf('<polyline points="%.1f,%.1f %.1f,%.1f %.1f,%.1f" class="dg-right-angle"/>', $x0 + $apex, $y0 - 10, $x0 + $apex + 10, $y0 - 10, $x0 + $apex + 10, $y0);
    $b .= T($x0 + $B / 2, $y0 + 18, $a->{b}, anchor => 'middle', cls => 'dg-label-accent') if defined $a->{b};
    $b .= T($x0 + $apex + ($a->{right} ? -8 : 6), $y0 - $TH / 2, $a->{th}, anchor => ($a->{right} ? 'end' : 'start'), cls => 'dg-label-accent') if defined $a->{th};
    $b .= T($x0 + $apex / 2 - 8, $y0 - $TH / 2 - 6, $a->{s}, anchor => 'end', cls => 'dg-label-accent') if defined $a->{s} && !$a->{right};
    $b .= T($x0 + $B + $dx / 2 + 8, $y0 + $dy / 2 + 14, $a->{l}, cls => 'dg-label-accent') if defined $a->{l};
    my $Wt = $x0 + $B + $dx + 30 + max(30, tw(plain($a->{l} // ''), 11));
    return (svg($Wt, $y0 + 28, 'Triangular prism. Triangle base ' . plain($a->{b}) . ', triangle height ' . plain($a->{th}) . ', prism length ' . plain($a->{l}) . '.', $b));
}

sub draw_cylinder {
    my ($a) = @_;
    my ($rv, $hv) = ($a->{rv} // num($a->{r}) // 3, $a->{hv} // num($a->{h}) // 6);
    my $s = 170 / max(2 * $rv, $hv, 1);
    my ($R, $H) = ($rv * $s, $hv * $s);
    my $e = $R * 0.32;
    my ($cx, $top) = (40 + $R, 20 + $e);
    my $bot = $top + $H;
    my $b = '';
    $b .= sprintf('<path d="M%.1f,%.1f L%.1f,%.1f A%.1f,%.1f 0 0 0 %.1f,%.1f L%.1f,%.1f" class="dg-fill-accent"/>', $cx - $R, $top, $cx - $R, $bot, $R, $e, $cx + $R, $bot, $cx + $R, $top);
    $b .= sprintf('<path d="M%.1f,%.1f A%.1f,%.1f 0 0 1 %.1f,%.1f" class="dg-dashed"/>', $cx - $R, $bot, $R, $e, $cx + $R, $bot);
    $b .= sprintf('<path d="M%.1f,%.1f A%.1f,%.1f 0 0 0 %.1f,%.1f" class="dg-line"/>', $cx - $R, $bot, $R, $e, $cx + $R, $bot);
    $b .= line($cx - $R, $top, $cx - $R, $bot) . line($cx + $R, $top, $cx + $R, $bot);
    $b .= sprintf('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" class="dg-boundary"/>', $cx, $top, $R, $e);
    $b .= circ($cx, $top, 2.5, 'dg-point');
    if ($a->{diameter}) {
        $b .= line($cx - $R, $top, $cx + $R, $top, 'dg-accent');
        $b .= T($cx, $top - $e - 6, $a->{r}, anchor => 'middle', cls => 'dg-label-accent') if defined $a->{r};
    } else {
        $b .= line($cx, $top, $cx + $R, $top, 'dg-accent');
        $b .= T($cx + $R / 2, $top - $e - 5, $a->{r}, anchor => 'middle', cls => 'dg-label-accent') if defined $a->{r};
    }
    $b .= T($cx + $R + 8, ($top + $bot) / 2 + 4, $a->{h}, cls => 'dg-label-accent') if defined $a->{h};
    my $W = $cx + $R + 20 + max(30, tw(plain($a->{h} // ''), 11));
    return (svg($W, $bot + $e + 14, 'Cylinder. ' . ($a->{diameter} ? 'Diameter ' : 'Radius ') . plain($a->{r}) . ', height ' . plain($a->{h}) . '.', $b));
}

sub draw_net {
    my ($a) = @_;
    my $type = $a->{type} // 'box';
    my $b = '';
    my ($W, $H);
    if ($type eq 'box') {
        my ($lv, $wv, $hv) = ($a->{lv} // num($a->{l}) // 6, $a->{wv} // num($a->{w}) // 3, $a->{hv} // num($a->{h}) // 4);
        my $s = min(440 / (2 * $lv + 2 * $wv), 280 / ($hv + 2 * $wv));
        my ($L, $Wd, $Hh) = ($lv * $s, $wv * $s, $hv * $s);
        my ($x0, $y0) = (16, 16 + $Wd);
        # middle row: side(w) front(l) side(w) back(l)
        my @row = ([$Wd, 'dg-fill-soft', $a->{n3}], [$L, 'dg-fill-accent', $a->{n1}], [$Wd, 'dg-fill-soft', $a->{n4}], [$L, 'dg-fill-accent', $a->{n2}]);
        my $x = $x0;
        for my $r (@row) { $b .= rect($x, $y0, $r->[0], $Hh, $r->[1]); $b .= rect($x, $y0, $r->[0], $Hh, 'dg-outline'); $b .= T($x + $r->[0] / 2, $y0 + $Hh / 2 + 4, $r->[2], anchor => 'middle', cls => 'dg-label-sm') if $r->[2]; $x += $r->[0]; }
        $b .= rect($x0 + $Wd, $y0 - $Wd, $L, $Wd, 'dg-fill-sun') . rect($x0 + $Wd, $y0 - $Wd, $L, $Wd, 'dg-outline');
        $b .= rect($x0 + $Wd, $y0 + $Hh, $L, $Wd, 'dg-fill-sun') . rect($x0 + $Wd, $y0 + $Hh, $L, $Wd, 'dg-outline');
        $b .= T($x0 + $Wd + $L / 2, $y0 - $Wd / 2 + 4, $a->{n5}, anchor => 'middle', cls => 'dg-label-sm') if $a->{n5};
        $b .= T($x0 + $Wd + $L / 2, $y0 + $Hh + $Wd / 2 + 4, $a->{n6}, anchor => 'middle', cls => 'dg-label-sm') if $a->{n6};
        $b .= T($x0 + $Wd + $L / 2, $y0 + $Hh - 6, $a->{l}, anchor => 'middle', cls => 'dg-label-accent') if defined $a->{l};
        $b .= T($x0 + $Wd + 6, $y0 + $Hh / 2 + 4, $a->{h}, cls => 'dg-label-accent') if defined $a->{h};
        $b .= T($x0 + $Wd / 2, $y0 + $Hh - 6, $a->{w}, anchor => 'middle', cls => 'dg-label-accent') if defined $a->{w};
        ($W, $H) = ($x0 + 2 * $L + 2 * $Wd + 16, $y0 + $Hh + $Wd + 16);
        return (svg($W, $H, 'Net of a rectangular prism: four side faces in a row with a top and a bottom face attached. Length ' . plain($a->{l}) . ', width ' . plain($a->{w}) . ', height ' . plain($a->{h}) . '.', $b));
    }
    if ($type eq 'tri') {
        my ($bv, $thv, $lv) = ($a->{bv} // num($a->{b}) // 6, $a->{thv} // num($a->{th}) // 4, $a->{lv} // num($a->{l}) // 8);
        my $sv = $a->{sv} // num($a->{s}) // sqrt(($bv / 2) ** 2 + $thv ** 2);
        my $s = min(460 / ($bv + 2 * $sv), 260 / ($lv + 2 * $thv));
        my ($B, $TH, $S, $L) = ($bv * $s, $thv * $s, $sv * $s, $lv * $s);
        my ($x0, $y0) = (16, 16 + $TH);
        my $x = $x0;
        for my $r ([$S, $a->{s}], [$B, $a->{b}], [$S, $a->{s}]) {
            $b .= rect($x, $y0, $r->[0], $L, 'dg-fill-soft') . rect($x, $y0, $r->[0], $L, 'dg-outline');
            $b .= T($x + $r->[0] / 2, $y0 + $L / 2 + 4, $r->[1], anchor => 'middle', cls => 'dg-label-accent') if defined $r->[1];
            $x += $r->[0];
        }
        my $bx = $x0 + $S;
        $b .= poly('dg-fill-accent', $bx, $y0, $bx + $B, $y0, $bx + $B / 2, $y0 - $TH);
        $b .= poly('dg-fill-accent', $bx, $y0 + $L, $bx + $B, $y0 + $L, $bx + $B / 2, $y0 + $L + $TH);
        $b .= line($bx + $B / 2, $y0, $bx + $B / 2, $y0 - $TH, 'dg-dashed');
        $b .= T($bx + $B / 2 + 5, $y0 - $TH / 2 + 4, $a->{th}, cls => 'dg-label-accent') if defined $a->{th};
        $b .= T($x0 + $S + $B + $S + 6, $y0 + $L / 2 + 4, $a->{l}, cls => 'dg-label-accent') if defined $a->{l};
        ($W, $H) = ($x0 + 2 * $S + $B + 40 + tw(plain($a->{l} // ''), 11), $y0 + $L + $TH + 16);
        return (svg($W, $H, 'Net of a triangular prism: three rectangles in a row with a triangle on each end.', $b));
    }
    # cylinder
    my ($rv, $hv) = ($a->{rv} // num($a->{r}) // 3, $a->{hv} // num($a->{h}) // 6);
    my $s = min(420 / (2 * $PI * $rv), 280 / ($hv + 4 * $rv));
    my ($R, $Hh, $C) = ($rv * $s, $hv * $s, 2 * $PI * $rv * $s);
    my ($x0, $y0) = (16, 16 + 2 * $R);
    $b .= rect($x0, $y0, $C, $Hh, 'dg-fill-accent') . rect($x0, $y0, $C, $Hh, 'dg-outline');
    $b .= circ($x0 + $C / 2, $y0 - $R, $R, 'dg-fill-sun') . circ($x0 + $C / 2, $y0 - $R, $R, 'dg-outline');
    $b .= circ($x0 + $C / 2, $y0 + $Hh + $R, $R, 'dg-fill-sun') . circ($x0 + $C / 2, $y0 + $Hh + $R, $R, 'dg-outline');
    $b .= line($x0 + $C / 2, $y0 - $R, $x0 + $C / 2 + $R, $y0 - $R, 'dg-accent');
    $b .= T($x0 + $C / 2 + $R / 2, $y0 - $R - 6, $a->{r}, anchor => 'middle', cls => 'dg-label-accent') if defined $a->{r};
    $b .= T($x0 + $C / 2, $y0 + $Hh - 8, $a->{c} // 'length = circumference', anchor => 'middle', cls => 'dg-label-accent');
    $b .= T($x0 + $C + 6, $y0 + $Hh / 2 + 4, $a->{h}, cls => 'dg-label-accent') if defined $a->{h};
    ($W, $H) = ($x0 + $C + 30 + tw(plain($a->{h} // ''), 11), $y0 + $Hh + 2 * $R + 16);
    return (svg($W, $H, 'Net of a cylinder: a rectangle whose length is the circumference, with a circle on the top and the bottom.', $b));
}

# Painter's order for isometric cubes: far columns first, then bottom to top.
sub by_depth { ($a->[0] + $a->[1]) <=> ($b->[0] + $b->[1]) || $a->[2] <=> $b->[2] }

sub iso_cube {
    my ($sx, $sy, $s) = @_;
    my ($c, $h) = ($s * 0.866, $s * 0.5);
    # top face, left (front) face, right face; (sx,sy) = top-front corner of cube's top face (nearest point)
    my $t = poly('dg-fill-soft', $sx, $sy, $sx + $c, $sy - $h, $sx, $sy - 2 * $h, $sx - $c, $sy - $h);
    my $l = poly('dg-fill-accent', $sx, $sy, $sx - $c, $sy - $h, $sx - $c, $sy - $h + $s, $sx, $sy + $s);
    my $r = poly('dg-fill-sun', $sx, $sy, $sx + $c, $sy - $h, $sx + $c, $sy - $h + $s, $sx, $sy + $s);
    return $t . $l . $r;
}

sub view_grid {
    my ($x0, $y0, $cols, $cells, $title, $fill) = @_;
    # $cells: arrayref of [col,rowFromBottom] filled; draw within cols x rows box
    my $c = 20;
    my $rows = $cells->[1];
    my @f = @{ $cells->[0] };
    my $b = '';
    my $Hg = $rows * $c;
    for my $k (0 .. $cols) { $b .= line($x0 + $k * $c, $y0, $x0 + $k * $c, $y0 + $Hg, 'dg-grid'); }
    for my $k (0 .. $rows) { $b .= line($x0, $y0 + $k * $c, $x0 + $cols * $c, $y0 + $k * $c, 'dg-grid'); }
    if ($fill) { for my $q (@f) { $b .= rect($x0 + $q->[0] * $c, $y0 + ($rows - 1 - $q->[1]) * $c, $c, $c, 'dg-fill-accent'); } }
    $b .= T($x0 + $cols * $c / 2, $y0 + $Hg + 16, $title, anchor => 'middle', cls => 'dg-label-sm');
    return ($b, $cols * $c, $Hg);
}

sub draw_blocks {
    my ($a) = @_;
    my @rows = map { [map { $_ + 0 } split /\s*,\s*/] } list($a->{heights}, qr/\s*;\s*/);
    my $R = @rows;
    my $C = max(map { scalar @$_ } @rows);
    my $Hmax = max(map { @$_ } @rows);
    my $s = 26;
    my ($c, $h) = ($s * 0.866, $s * 0.5);
    # screen: X = col, D = row (front larger). sx = ox + (X - D)*c ; sy = oy + (X + D)*h - Z*s
    my $ox = 56 + $R * $c;
    my $oy = 20 + $Hmax * $s + $h * 0 + $s * 0.5;
    my $b = '';
    my @order;
    for my $r (0 .. $R - 1) { for my $x (0 .. $C - 1) { my $z = $rows[$r][$x] // 0; push @order, [$x, $r, $_] for 0 .. $z - 1; } }
    @order = sort by_depth @order;
    for my $q (@order) {
        my ($X, $D, $Z) = @$q;
        # nearest top corner of cube (X,D,Z): its front-right-top vertex
        my $sx = $ox + (($X + 1) - ($D + 1)) * $c;
        my $sy = $oy + (($X + 1) + ($D + 1)) * $h - ($Z + 1) * $s;
        $b .= iso_cube($sx, $sy + 0, $s);
    }
    my $objW = $ox + ($C + 1) * $c + 10;
    my $objH = $oy + ($C + $R) * $h + $s + 10;
    my $front = $a->{front} // 1;
    # object=key: draw the cubes in the answer key only (for "build it from the views" tasks)
    if (($a->{object} // 'show') eq 'key' && !$KEY) { $b = ''; $front = 0; $objW = 10; $objH = 10; }
    if ($front) {
        my ($fx, $fy) = ($ox + ($C / 2 - $R - 0.5) * $c, $oy + ($C / 2 + $R + 0.5) * $h - 0.5 * $s);
        $b .= arrow($fx - 30, $fy + 17, $fx, $fy, 'muted');
        $b .= T($fx - 32, $fy + 32, 'front', anchor => 'middle', cls => 'dg-label-sm');
        $objH = max($objH, $fy + 40);
    }
    my $views = $a->{views} // 'none';
    my $W = $objW;
    my $Ht = $objH;
    if ($views ne 'none') {
        my $fill = $views eq 'show' || ($views eq 'key' && $KEY);
        my $vx = $objW + 16;
        my $vy = 30;
        # front: cols X, height max over rows
        my @fv; for my $x (0 .. $C - 1) { my $m = max(map { $_->[$x] // 0 } @rows); push @fv, [$x, $_] for 0 .. $m - 1; }
        # right side: cols front→back
        my @sv; for my $i (0 .. $R - 1) { my $r = $R - 1 - $i; my $m = max(@{ $rows[$r] }, 0); push @sv, [$i, $_] for 0 .. $m - 1; }
        # top: rows back→front from top
        my @tv; for my $r (0 .. $R - 1) { for my $x (0 .. $C - 1) { push @tv, [$x, $R - 1 - $r] if ($rows[$r][$x] // 0) > 0; } }
        my $rowsTall = max($Hmax, $R);
        my ($g1, $w1) = view_grid($vx, $vy, $C, [\@tv, $R], 'Top', $fill);
        my ($g2, $w2) = view_grid($vx + $w1 + 22, $vy, $C, [\@fv, $Hmax], 'Front', $fill);
        my ($g3, $w3) = view_grid($vx + $w1 + $w2 + 44, $vy, $R, [\@sv, $Hmax], 'Right side', $fill);
        $b .= $g1 . $g2 . $g3;
        $W = $vx + $w1 + $w2 + $w3 + 44 + 16;
        $Ht = max($objH, $vy + $rowsTall * 20 + 30);
    }
    return (svg($W, $Ht, "Object built from cubes, stack heights by row from back to front: " . ($a->{heights} // '') . ($views ne 'none' ? '. With top, front and right side view grids.' : ''), $b));
}

sub draw_dotgrid {
    my ($a) = @_;
    my ($cols, $rows) = ($a->{cols} // 16, $a->{rows} // 8);
    my $b = '';
    my ($W, $H);
    if ($a->{iso}) {
        my $s = 22; my ($c, $h) = ($s * 0.866, $s * 0.5);
        for my $r (0 .. $rows * 2) { for my $k (0 .. $cols) { my $x = 12 + $k * $c * 2 + ($r % 2 ? $c : 0); my $y = 12 + $r * $h; $b .= circ($x, $y, 1.4, 'dg-solid-muted'); } }
        ($W, $H) = (24 + $cols * $c * 2 + $c, 24 + $rows * $s);
    } else {
        my $c = 18;
        for my $k (0 .. $cols) { $b .= line(10 + $k * $c, 10, 10 + $k * $c, 10 + $rows * $c, 'dg-grid'); }
        for my $k (0 .. $rows) { $b .= line(10, 10 + $k * $c, 10 + $cols * $c, 10 + $k * $c, 'dg-grid'); }
        ($W, $H) = (20 + $cols * $c, 20 + $rows * $c);
    }
    return (svg($W, $H, $a->{iso} ? 'Isometric dot paper for drawing' : 'Square grid for drawing', $b));
}

sub draw_squares {
    my ($a) = @_;
    my @sh = map { [split /x/i, $_] } list($a->{shapes}, qr/\s*;\s*/);
    my @lab = list($a->{labels}, qr/\s*;\s*/);
    my $maxh = max(map { $_->[1] } @sh);
    my $c = $a->{cell} // max(8, min(18, int(130 / max($maxh, 1))));
    my $b = '';
    my $x = 12;
    my $base = 12 + $maxh * $c;
    for my $i (0 .. $#sh) {
        my ($w, $h) = @{ $sh[$i] };
        my $sqr = $w == $h;
        my $label = $lab[$i] // "$w × $h";
        my $slot = max($w * $c, tw(plain($label), 13) + 8);
        my $sx = $x + ($slot - $w * $c) / 2;
        for my $r (0 .. $h - 1) { for my $k (0 .. $w - 1) { $b .= rect($sx + $k * $c, $base - ($r + 1) * $c, $c, $c, $sqr ? 'dg-fill-accent' : 'dg-fill-sun'); } }
        $b .= rect($sx, $base - $h * $c, $w * $c, $h * $c, 'dg-outline');
        $b .= T($x + $slot / 2, $base + 18, $label, anchor => 'middle', cls => 'dg-label');
        $x += $slot + 22;
    }
    return (svg($x, $base + 28, 'Rectangles of unit squares: ' . join(', ', map { "$_->[0] by $_->[1]" } @sh), $b));
}

# ═════════════════════════════════════════════════════════════════════════
# STATISTICS & PROBABILITY
# ═════════════════════════════════════════════════════════════════════════

sub axes_chart {
    my ($a, $kind) = @_;
    my @d = items($a->{data});
    my @v = map { num($_->[1]) // 0 } @d;
    my $ymin = $a->{ymin} // 0;
    my $ymax = $a->{ymax} // do { my $m = max(@v); my $st = $m <= 10 ? 1 : $m <= 50 ? 5 : $m <= 100 ? 10 : 10 ** (length(int($m)) - 1); ceil($m / $st) * $st };
    my $ystep = $a->{ystep} // do { my $r = $ymax - $ymin; $r <= 10 ? 1 : $r <= 20 ? 2 : $r <= 50 ? 5 : $r <= 100 ? 10 : $r <= 200 ? 20 : $r <= 500 ? 50 : 100 };
    my ($ml, $mt, $mb) = (58, $a->{title} ? 34 : 14, 46);
    my $gh = $a->{height} // 200;
    my $n = @d;
    my $slot = $a->{slot} // max(46, min(80, int(420 / max($n, 1))));
    my $gw = $n * $slot;
    my $Y = sub { $mt + $gh - ($_[0] - $ymin) / (($ymax - $ymin) || 1) * $gh };
    my $b = '';
    $b .= T($ml + $gw / 2, 20, $a->{title}, anchor => 'middle', cls => 'dg-title') if $a->{title};
    for (my $t = $ymin; $t <= $ymax + 1e-9; $t += $ystep) {
        $b .= line($ml, $Y->($t), $ml + $gw, $Y->($t), 'dg-grid');
        $b .= T($ml - 6, $Y->($t) + 4, fmt($t), anchor => 'end', cls => 'dg-label-sm');
    }
    $b .= line($ml, $mt - 4, $ml, $mt + $gh, 'dg-line') . line($ml, $mt + $gh, $ml + $gw + 8, $mt + $gh, 'dg-line');
    if ($a->{break} && $ymin > 0) {
        my $yb = $mt + $gh + 0;
        $b .= sprintf('<path d="M%.1f,%.1f l6,-4 l-12,-6 l6,-4" class="dg-line"/>', $ml, $yb - 4);
    }
    my @widths = list($a->{widths});
    my %hi = map { $_ => 1 } list($a->{highlight}, qr/\s*;\s*/);
    my @pts;
    for my $i (0 .. $n - 1) {
        my $cx = $ml + $slot * ($i + 0.5);
        my $label = $d[$i][0];
        $b .= T($cx, $mt + $gh + 16, $label, anchor => 'middle', cls => 'dg-label-sm');
        if ($kind eq 'bar') {
            my $bw = $slot * 0.56 * ($widths[$i] // 1);
            my $top = $Y->(max($v[$i], $ymin));
            $b .= rect($cx - $bw / 2, $top, $bw, $mt + $gh - $top, $hi{$label} ? 'dg-fill-hot' : 'dg-fill-accent');
            $b .= T($cx, $top - 5, $d[$i][1], anchor => 'middle', cls => 'dg-label-sm') if $a->{values};
        } else {
            push @pts, [$cx, $Y->($v[$i])];
        }
    }
    if ($kind eq 'line') {
        $b .= '<path d="M' . join(' L', map { sprintf('%.1f,%.1f', @$_) } @pts) . '" class="dg-accent"/>';
        $b .= circ(@$_, 4, 'dg-point-accent') for @pts;
        if ($a->{values}) { for my $i (0 .. $n - 1) { $b .= T($pts[$i][0], $pts[$i][1] - 9, $d[$i][1], anchor => 'middle', cls => 'dg-label-sm'); } }
    }
    $b .= T($ml + $gw / 2, $mt + $gh + 36, $a->{xlabel}, anchor => 'middle', cls => 'dg-label') if $a->{xlabel};
    if ($a->{ylabel}) {
        my $yy = $mt + $gh / 2;
        $b .= sprintf('<g transform="translate(14,%.1f) rotate(-90)">', $yy) . T(0, 0, $a->{ylabel}, anchor => 'middle', cls => 'dg-label') . '</g>';
    }
    my $W = $ml + $gw + 20;
    my $H = $mt + $gh + ($a->{xlabel} ? $mb : 26);
    my $aria = ($kind eq 'bar' ? 'Bar graph' : 'Line graph') . ($a->{title} ? ": $a->{title}" : '') . '. ' . join(', ', map { plain("$_->[0]: $_->[1]") } @d) . '. Vertical axis from ' . fmt($ymin) . ' to ' . fmt($ymax) . '.';
    return (svg($W, $H, $aria, $b));
}
sub draw_bar  { return axes_chart($_[0], 'bar'); }
sub draw_line { return axes_chart($_[0], 'line'); }

my @WEDGE = ('dg-fill-accent', 'dg-fill-sun', 'dg-fill-water', 'dg-fill-plant', 'dg-fill-hot', 'dg-fill-earth', 'dg-fill-soft', 'dg-fill-cold');

sub draw_pie {
    my ($a) = @_;
    my @d = items($a->{data});
    my $tot = sum(map { num($_->[1]) // 0 } @d) || 1;
    my ($cx, $cy, $r) = (190, ($a->{title} ? 56 : 26) + 100, 100);
    my $b = '';
    $b .= T($cx, 22, $a->{title}, anchor => 'middle', cls => 'dg-title') if $a->{title};
    my $ang = -$PI / 2;
    for my $i (0 .. $#d) {
        my $f = (num($d[$i][1]) // 0) / $tot;
        my $a2 = $ang + $f * 2 * $PI;
        my ($x1, $y1, $x2, $y2) = ($cx + $r * cos($ang), $cy + $r * sin($ang), $cx + $r * cos($a2), $cy + $r * sin($a2));
        my $large = $f > 0.5 ? 1 : 0;
        $b .= sprintf('<path d="M%.1f,%.1f L%.1f,%.1f A%d,%d 0 %d 1 %.1f,%.1f Z" class="%s"/>', $cx, $cy, $x1, $y1, $r, $r, $large, $x2, $y2, $WEDGE[$i % @WEDGE]);
        my $mid = ($ang + $a2) / 2;
        my ($lx, $ly) = ($cx + ($r + 14) * cos($mid), $cy + ($r + 14) * sin($mid));
        my $anchor = cos($mid) > 0.15 ? 'start' : cos($mid) < -0.15 ? 'end' : 'middle';
        $b .= T($lx, $ly + 4, $d[$i][0], anchor => $anchor, cls => 'dg-label');
        my ($px, $py) = ($cx + $r * 0.62 * cos($mid), $cy + $r * 0.62 * sin($mid));
        $b .= T($px, $py + 4, $d[$i][2] // ($d[$i][1] =~ /%|\[\[/ ? $d[$i][1] : "$d[$i][1]%"), anchor => 'middle', cls => 'dg-label') if $f >= 0.05;
        $ang = $a2;
    }
    return (svg(400, $cy + $r + 30, 'Circle graph' . ($a->{title} ? ": $a->{title}" : '') . '. ' . join(', ', map { plain("$_->[0] $_->[1]") } @d), $b));
}

sub icon {
    my ($kind, $x, $y, $s, $frac) = @_;
    $frac //= 1;
    my $out = '';
    if ($kind eq 'square') { $out .= rect($x, $y, $s * $frac, $s, 'dg-solid-accent'); $out .= rect($x, $y, $s, $s, 'dg-outline') if $frac < 1; }
    else {
        if ($frac >= 1) { $out .= circ($x + $s / 2, $y + $s / 2, $s / 2, 'dg-solid-accent'); }
        else { $out .= sprintf('<path d="M%.1f,%.1f A%.1f,%.1f 0 0 0 %.1f,%.1f Z" class="dg-solid-accent"/>', $x + $s / 2, $y, $s / 2, $s / 2, $x + $s / 2, $y + $s); $out .= circ($x + $s / 2, $y + $s / 2, $s / 2, 'dg-outline'); }
    }
    return $out;
}

sub draw_picto {
    my ($a) = @_;
    my @d = items($a->{data});
    my $kind = $a->{icon} // 'circle';
    my $b = '';
    my $lw = max(map { tw($_->[0], 12) } @d) + 22;
    my $top = $a->{title} ? 34 : 10;
    $b .= T(10, 20, $a->{title}, cls => 'dg-title') if $a->{title};
    if (($a->{mode} // 'icons') eq 'scaled') {
        my $vmax = max(map { num($_->[1]) } @d);
        my $x = 20;
        my $base = $top + 150;
        for my $q (@d) {
            my $s = 140 * (num($q->[1]) / $vmax);
            $b .= icon($kind, $x, $base - $s, $s);
            $b .= T($x + $s / 2, $base + 18, $q->[0], anchor => 'middle');
            $x += $s + 40;
        }
        return (svg($x, $base + 30, 'Pictograph where each picture is drawn bigger instead of repeated: ' . join(', ', map { "$_->[0] $_->[1]" } @d), $b));
    }
    my $s = 22;
    my $y = $top;
    my $maxn = 0;
    for my $q (@d) {
        my $v = num($q->[1]);
        $b .= T(10, $y + 16, $q->[0]);
        my $full = floor($v + 1e-9);
        $b .= icon($kind, $lw + $_ * ($s + 6), $y, $s) for 0 .. $full - 1;
        $b .= icon($kind, $lw + $full * ($s + 6), $y, $s, $v - $full) if $v - $full > 0.01;
        $maxn = max($maxn, ceil($v));
        $y += $s + 12;
    }
    if ($a->{per}) { $b .= icon($kind, 10, $y + 4, 16); $b .= T(32, $y + 17, "= $a->{per}", cls => 'dg-label'); $y += 26; }
    return (svg(max($lw + $maxn * ($s + 6) + 16, 220, tw($a->{title} // '', 13.5) + 30), $y + 8, 'Pictograph: ' . join(', ', map { "$_->[0] $_->[1] pictures" } @d) . ($a->{per} ? ". Each picture = $a->{per}" : ''), $b));
}

sub draw_tree {
    my ($a) = @_;
    my @f = list($a->{first});
    my @s = list($a->{second});
    my @p1 = list($a->{p1});
    my @p2 = list($a->{p2});
    my $out = $a->{outcomes} // 'show';
    my $leaf_h = 26;
    my $n = @f * @s;
    my $H = 20 + $n * $leaf_h + 10;
    my ($x0, $x1, $x2, $x3) = (20, 140, 290, 360);
    my $b = '';
    my $root_y = $H / 2;
    $b .= circ($x0, $root_y, 4, 'dg-point');
    my $k = 0;
    for my $i (0 .. $#f) {
        my $y1 = 20 + ($i + 0.5) * @s * $leaf_h;
        $b .= line($x0 + 4, $root_y, $x1 - 12, $y1, 'dg-line');
        $b .= T($x1, $y1 + 5, $f[$i], anchor => 'middle', cls => 'dg-label-accent');
        $b .= T(($x0 + $x1) / 2, ($root_y + $y1) / 2 - 4, $p1[$i], anchor => 'middle', cls => 'dg-label-sm') if defined $p1[$i];
        for my $j (0 .. $#s) {
            my $y2 = 20 + ($k + 0.5) * $leaf_h;
            $b .= line($x1 + 12, $y1, $x2 - 14, $y2, 'dg-line');
            $b .= T($x2, $y2 + 5, $s[$j], anchor => 'middle', cls => 'dg-label-accent');
            $b .= T($x1 + 12 + 0.68 * ($x2 - 14 - $x1 - 12), $y1 + 0.68 * ($y2 - $y1) - 4, $p2[$j], anchor => 'middle', cls => 'dg-label-sm') if defined $p2[$j];
            my $o = plain($f[$i]) . plain($s[$j]);
            if ($out ne 'none') {
                $b .= T($x3, $y2 + 5, $out eq 'blank' ? "[[$o]]" : $o, cls => 'dg-label');
            }
            $k++;
        }
    }
    $b .= T($x3, 14, 'Outcome', cls => 'dg-label-sm') if $out ne 'none';
    return (svg($x3 + 70, $H, 'Tree diagram. First: ' . join(', ', map { plain($_) } @f) . '. Second: ' . join(', ', map { plain($_) } @s) . ". $n outcomes.", $b));
}

my %COLOUR = (red => 'dg-fill-hot', blue => 'dg-fill-cold', green => 'dg-fill-plant', yellow => 'dg-fill-sun', orange => 'dg-fill-earth', purple => 'dg-fill-accent');

sub draw_spinner {
    my ($a) = @_;
    my @sec = list($a->{sections});
    my ($cx, $cy, $r) = (110, 110, 92);
    my $b = '';
    my $n = @sec;
    for my $i (0 .. $n - 1) {
        my ($a1, $a2) = (-$PI / 2 + $i * 2 * $PI / $n, -$PI / 2 + ($i + 1) * 2 * $PI / $n);
        my $cls = $COLOUR{ lc $sec[$i] } // $WEDGE[$i % @WEDGE];
        $b .= sprintf('<path d="M%d,%d L%.1f,%.1f A%d,%d 0 %d 1 %.1f,%.1f Z" class="%s"/>', $cx, $cy, $cx + $r * cos($a1), $cy + $r * sin($a1), $r, $r, ($n == 1 ? 1 : 0), $cx + $r * cos($a2), $cy + $r * sin($a2), $cls);
        my $mid = ($a1 + $a2) / 2;
        $b .= T($cx + $r * 0.62 * cos($mid), $cy + $r * 0.62 * sin($mid) + 4, $sec[$i], anchor => 'middle', cls => 'dg-label');
    }
    $b .= circ($cx, $cy, $r, 'dg-outline');
    $b .= arrow($cx, $cy, $cx + 52, $cy - 38, 'plain');
    $b .= circ($cx, $cy, 5, 'dg-point');
    return (svg(220, 220, "Spinner with $n equal parts: " . join(', ', @sec), $b));
}

sub draw_outcomes {
    my ($a) = @_;
    my @r = list($a->{rows});
    my @c = list($a->{cols});
    my %hi = map { $_ => 1 } list($a->{highlight}, qr/\s*;\s*/);
    my ($cw, $ch) = (max(40, max(map { tw($_, 12) } @r) + max(map { tw($_, 12) } @c) + 16), 28);
    my ($x0, $y0) = (max(map { tw($_, 12) } @r, tw($a->{rowlabel} // '', 11)) + 24, 44);
    my $b = '';
    $b .= T($x0 + @c * $cw / 2, 14, $a->{collabel}, anchor => 'middle', cls => 'dg-label-accent') if $a->{collabel};
    $b .= T(8, 14, $a->{rowlabel}, cls => 'dg-label-accent') if $a->{rowlabel};
    for my $j (0 .. $#c) { $b .= T($x0 + $j * $cw + $cw / 2, $y0 - 8, $c[$j], anchor => 'middle', cls => 'dg-label-accent'); }
    for my $i (0 .. $#r) {
        $b .= T($x0 - 10, $y0 + $i * $ch + 19, $r[$i], anchor => 'end', cls => 'dg-label-accent');
        for my $j (0 .. $#c) {
            my $o = $r[$i] . $c[$j];
            $b .= rect($x0 + $j * $cw, $y0 + $i * $ch, $cw, $ch, $hi{$o} ? 'dg-fill-sun' : 'dg-fill-soft');
            $b .= rect($x0 + $j * $cw, $y0 + $i * $ch, $cw, $ch, 'dg-outline');
            $b .= T($x0 + $j * $cw + $cw / 2, $y0 + $i * $ch + 19, $a->{blank} ? "[[$o]]" : $o, anchor => 'middle', cls => 'dg-label');
        }
    }
    return (svg($x0 + @c * $cw + 12, $y0 + @r * $ch + 12, 'Outcome table, ' . scalar(@r) . ' rows by ' . scalar(@c) . ' columns: ' . (@r * @c) . ' outcomes', $b));
}

sub wrap2 {
    my ($s, $max) = @_;
    my $len = sub { my $x = shift; $x =~ s/\[\[(.*?)\]\]/'x' x (length($1) + 3)/ge; return length $x; };
    return ($s) if $len->($s) <= $max;
    # keep [[…]] blanks whole when splitting into words
    my @w = $s =~ /(\[\[.*?\]\]\S*|\S+)/g;
    my ($l1, $l2) = ('', '');
    for my $w (@w) { if ($len->($l1 . ' ' . $w) <= $max && $l2 eq '') { $l1 = $l1 ne '' ? "$l1 $w" : $w; } else { $l2 = $l2 ne '' ? "$l2 $w" : $w; } }
    return ($l1, $l2);
}

sub draw_flow {
    my ($a) = @_;
    my @st = split /\s*\|\s*/, $a->{steps} // '';
    my $n = @st;
    my $W = $a->{width} // 600;
    my $gap = 22;
    my $bw = ($W - 20 - ($n - 1) * $gap) / $n;
    my $maxc = int($bw / 7.2);
    my $b = '';
    for my $i (0 .. $n - 1) {
        my $x = 10 + $i * ($bw + $gap);
        $b .= rect($x, 22, $bw, 64, 'dg-fill-soft', 8) . rect($x, 22, $bw, 64, 'dg-outline', 8);
        $b .= circ($x + $bw / 2, 22, 12, 'dg-solid-accent');
        $b .= T($x + $bw / 2, 27, $i + 1, anchor => 'middle', cls => 'dg-label-white');
        my @l = wrap2($st[$i], $maxc);
        if (@l == 1) { $b .= T($x + $bw / 2, 62, $l[0], anchor => 'middle'); }
        else { $b .= T($x + $bw / 2, 54, $l[0], anchor => 'middle') . T($x + $bw / 2, 70, $l[1], anchor => 'middle'); }
        $b .= arrow($x + $bw + 3, 54, $x + $bw + $gap - 3, 54, 'accent') if $i < $n - 1;
    }
    return (svg($W, 96, 'Steps: ' . join(', then ', map { plain($_) } @st), $b));
}

sub draw_receipt {
    my ($a) = @_;
    my @it = items($a->{items});
    my $W = 300;
    my $b = '';
    my $y = 24;
    my $H = 40 + @it * 26 + ($a->{title} ? 24 : 0);
    $b .= sprintf('<path d="M10,8 L290,8 L290,%d l-10,6 l-10,-6 l-10,6 l-10,-6 l-10,6 l-10,-6 l-10,6 l-10,-6 l-10,6 l-10,-6 l-10,6 l-10,-6 l-10,6 l-10,-6 l-10,6 l-10,-6 l-10,6 l-10,-6 l-10,6 l-10,-6 l-10,6 l-10,-6 l-10,6 l-10,-6 l-10,6 l-10,-6 l-10,6 l-10,-6 Z" class="dg-boundary"/>', $H - 14);
    if ($a->{title}) { $b .= T($W / 2, $y + 4, $a->{title}, anchor => 'middle', cls => 'dg-title'); $y += 24; }
    for my $i (0 .. $#it) {
        my $last = $i == $#it;
        $b .= line(24, $y - 4, $W - 24, $y - 4, 'dg-line') if $last && @it > 1;
        $b .= T(24, $y + 14, $it[$i][0], cls => $last ? 'dg-title' : 'dg-label');
        $b .= T($W - 24, $y + 14, $it[$i][1], anchor => 'end', cls => $last ? 'dg-title' : 'dg-label');
        $y += 26;
    }
    return (svg($W, $H, 'Receipt: ' . join('; ', map { plain("$_->[0] $_->[1]") } @it), $b));
}

# ═════════════════════════════════════════════════════════════════════════
# GRADE 7 (draft 2026 curriculum) — added for Math 7; Math 8 types above are unchanged
# ═════════════════════════════════════════════════════════════════════════

sub numsort { return sort { $a <=> $b } @_; }

# Arc path from angle t1 to t2 (degrees, counterclockwise from +x, y up) around (cx,cy).
sub arcpath {
    my ($cx, $cy, $r, $t1, $t2) = @_;
    my ($a1, $a2) = map { $_ * $PI / 180 } ($t1, $t2);
    my ($x1, $y1) = ($cx + $r * cos($a1), $cy - $r * sin($a1));
    my ($x2, $y2) = ($cx + $r * cos($a2), $cy - $r * sin($a2));
    my $large = (($t2 - $t1) % 360) > 180 ? 1 : 0;
    return sprintf('M%.1f,%.1f A%.1f,%.1f 0 %d 0 %.1f,%.1f', $x1, $y1, $r, $r, $large, $x2, $y2);
}
sub at_angle { my ($cx, $cy, $r, $t) = @_; my $a = $t * $PI / 180; return ($cx + $r * cos($a), $cy - $r * sin($a)); }

# circle: show=r|d|rd|none rlabel dlabel clabel centre="O" shade=1 title size=78
#   also: fill=accent|plant|sun|water|soft  half=1 (a semicircle on its diameter)  box=1 boxlabel (a square around it)
#   rsq=1 rsqlabel="r²" (an r-by-r square on the radius)  spokes=8 (more radii)  chord=1 chordlabel (a line across, not
#   through the centre)  alabel (inside, under the centre)  and a second circle to the right with
#   size2 show2 rlabel2 dlabel2 clabel2 title2 alabel2 rsq2 rsqlabel2 fill2 shade2 centre2 spokes2
# width of a label as drawn (a [[blank]] is a box on the student copy)
sub lab_w {
    my ($s, $fs) = @_;
    return 0 unless defined $s && $s ne '';
    my $w = 0;
    for my $seg (grep { $_ ne '' } split /(\[\[.*?\]\])/, $s) {
        $w += $seg =~ /^\[\[(.*)\]\]$/ ? max(30, tw($1, $fs) + 16) : tw($seg, $fs);
    }
    return $w;
}

sub circle_one {
    my ($a, $x0, $cy) = @_;
    my $R = $a->{size} // 78;
    my $show = $a->{show} // 'r';
    my $cx = $x0 + 40 + $R;
    my $b = '';
    my $rextra = 0;
    my $fill = $a->{fill} ? "dg-fill-$a->{fill}" : $a->{shade} ? 'dg-fill-accent' : 'dg-outline';
    $b .= T($cx, 20, $a->{title}, anchor => 'middle', cls => 'dg-title') if $a->{title};
    if ($a->{box}) {
        $b .= rect($cx - $R, $cy - $R, 2 * $R, 2 * $R, 'dg-fill-soft');
        $b .= T($cx, $cy + $R + 18, $a->{boxlabel}, anchor => 'middle', cls => 'dg-label') if defined $a->{boxlabel};
    }
    if ($a->{half}) {
        $b .= sprintf('<path d="M%.1f,%.1f A%.1f,%.1f 0 0 1 %.1f,%.1f Z" class="%s"/>', $cx - $R, $cy, $R, $R, $cx + $R, $cy, $fill);
        $b .= sprintf('<path d="M%.1f,%.1f A%.1f,%.1f 0 0 1 %.1f,%.1f" class="dg-accent"/>', $cx - $R, $cy, $R, $R, $cx + $R, $cy) if defined $a->{clabel};
    } else {
        $b .= circ($cx, $cy, $R, $fill);
        $b .= sprintf('<circle cx="%.1f" cy="%.1f" r="%.1f" class="dg-accent"/>', $cx, $cy, $R) if defined $a->{clabel};
    }
    if ($a->{rsq}) {
        $b .= rect($cx, $cy - $R, $R, $R, 'dg-fill-sun');
        $b .= T($cx + $R / 2, $cy - $R / 2 + 5, $a->{rsqlabel} // 'r²', anchor => 'middle', cls => 'dg-math');
    }
    if ($a->{spokes}) {
        my $n = $a->{spokes};
        for my $k (1 .. $n - 1) {
            my ($ex, $ey) = at_angle($cx, $cy, $R, 40 + $k * 360 / $n);
            next if $a->{half} && $ey > $cy + 0.1;
            $b .= line($cx, $cy, $ex, $ey, 'dg-line') . circ($ex, $ey, 3, 'dg-point');
        }
    }
    if ($a->{chord}) {
        my ($x1, $y1) = at_angle($cx, $cy, $R, 215);
        my ($x2, $y2) = at_angle($cx, $cy, $R, 325);
        $b .= line($x1, $y1, $x2, $y2, 'dg-line') . circ($x1, $y1, 3, 'dg-point') . circ($x2, $y2, 3, 'dg-point');
        $b .= T($cx, $y1 - 7, $a->{chordlabel}, anchor => 'middle', cls => 'dg-label-sm') if defined $a->{chordlabel};
    }
    if ($show =~ /d/) {
        $b .= line($cx - $R, $cy, $cx + $R, $cy, 'dg-line');
        my $dw = lab_w($a->{dlabel} // 'diameter', 11);
        my $dx = min($cx, max($cx - $R / 2 + 4, $cx - $R + $dw / 2 + 8));
        $b .= T($dx, $cy + 18, $a->{dlabel} // 'diameter', anchor => 'middle', cls => 'dg-label-cold') if $show eq 'd' || defined $a->{dlabel};
    }
    if ($show =~ /r/) {
        if ($a->{rsq}) {   # the radius runs along the bottom of the square
            $b .= sprintf('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" class="dg-accent"/>', $cx, $cy, $cx + $R, $cy);
            $b .= T($cx + $R / 2, $cy + 17, $a->{rlabel} // 'r', anchor => 'middle', cls => 'dg-label-accent');
        } else {
            my ($ex, $ey) = at_angle($cx, $cy, $R, 40);
            $b .= sprintf('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" class="dg-accent"/>', $cx, $cy, $ex, $ey);
            my ($lx, $ly) = at_angle($cx, $cy, $R * 0.5, 40);
            my $rw = lab_w($a->{rlabel} // 'radius', 11);
            my $hw = sqrt(max(0, $R * $R - ($ly - 12 - $cy) ** 2));   # half-width of the circle at the label
            if ($lx - 6 - $rw < $cx - $hw + 4) {   # too long to sit inside: put it past the end of the radius
                $b .= T($ex + 6, $ey - 2, $a->{rlabel} // 'radius', anchor => 'start', cls => 'dg-label-accent');
                $rextra = max(0, $ex + 6 + $rw + 8 - ($cx + $R + 40));
            } else {
                $b .= T($lx - 6, $ly - 8, $a->{rlabel} // 'radius', anchor => 'end', cls => 'dg-label-accent');
            }
        }
    }
    $b .= circ($cx, $cy, 3.5, 'dg-point');
    $b .= T($cx + 6, $cy + 16, $a->{centre}, cls => 'dg-label') if defined $a->{centre};
    $b .= T($cx, $cy + $R * 0.5 + 4, $a->{alabel}, anchor => 'middle', cls => 'dg-label') if defined $a->{alabel} && !$a->{half};
    $b .= T($cx, $cy - $R * 0.3, $a->{alabel}, anchor => 'middle', cls => 'dg-label') if defined $a->{alabel} && $a->{half};
    $b .= T($cx + $R * 0.72 + 10, $cy - $R * 0.72 - 6, $a->{clabel}, cls => 'dg-label-accent') if defined $a->{clabel};
    my $W = 2 * $R + 80 + (defined $a->{clabel} ? max(0, lab_w($a->{clabel}, 11) - 30) : 0) + $rextra;
    $W = max($W, 40 + $R + lab_w($a->{boxlabel}, 12) / 2 + 10) if $a->{box} && defined $a->{boxlabel};
    $W = max($W, 40 + $R + lab_w($a->{alabel}, 12) / 2 + 10) if defined $a->{alabel};
    $W = max($W, 40 + $R + lab_w($a->{title}, 13) / 2 + 10) if defined $a->{title};
    my $bottom = $a->{half} ? $cy + 26 : $cy + $R + ($a->{box} && defined $a->{boxlabel} ? 30 : 26);
    my @bits = (($a->{half} ? 'A semicircle' : 'A circle') . ($a->{centre} ? " with centre $a->{centre}" : ''));
    push @bits, 'inside a square' . ($a->{boxlabel} ? ' with sides ' . plain($a->{boxlabel}) : '') if $a->{box};
    push @bits, 'radius labelled ' . plain($a->{rlabel} // ($a->{rsq} ? 'r' : 'radius')) if $show =~ /r/;
    push @bits, "$a->{spokes} radii" if $a->{spokes};
    push @bits, 'diameter labelled ' . plain($a->{dlabel} // 'diameter') if $show =~ /d/;
    push @bits, 'a line across that misses the centre' . ($a->{chordlabel} ? ', labelled ' . plain($a->{chordlabel}) : '') if $a->{chord};
    push @bits, 'circumference labelled ' . plain($a->{clabel}) if defined $a->{clabel};
    push @bits, 'a square on the radius labelled ' . plain($a->{rsqlabel} // 'r²') if $a->{rsq};
    push @bits, 'inside: ' . plain($a->{alabel}) if defined $a->{alabel};
    return ($b, $W, $bottom, join(', ', @bits));
}

sub draw_circle {
    my ($a) = @_;
    my %o2;
    if (defined $a->{size2}) {
        for my $k (qw(size show rlabel dlabel clabel title alabel rsq rsqlabel fill shade centre spokes)) {
            $o2{$k} = $a->{"${k}2"} if defined $a->{"${k}2"};
        }
    }
    my $R1 = $a->{size} // 78;
    my $Rm = max($R1, %o2 ? $o2{size} : 0);
    my $cy = 30 + $Rm + (($a->{title} || $o2{title}) ? 18 : 0);
    $cy = 30 + $Rm if $a->{half} && !$a->{title};
    my ($b, $W, $bot, $aria) = circle_one($a, 0, $cy);
    if (%o2) {
        my ($b2, $W2, $bot2, $aria2) = circle_one(\%o2, $W, $cy);
        return (svg($W + $W2, max($bot, $bot2), "Two circles. Left: $aria. Right: $aria2", $b . $b2));
    }
    return (svg($W, $bot, $aria, $b));
}

# circlearea: sectors=8 blabel hlabel — a circle cut into sectors, rearranged into a near-parallelogram
sub draw_circlearea {
    my ($a) = @_;
    my $n = $a->{sectors} // 8; $n++ if $n % 2;
    my $R = 62;
    my $th = 360 / $n;
    my ($cx, $cy) = (24 + $R, 30 + $R);
    my $b = '';
    for my $k (0 .. $n - 1) {
        my ($t1, $t2) = ($k * $th + 90, ($k + 1) * $th + 90);
        my ($x1, $y1) = at_angle($cx, $cy, $R, $t1);
        my ($x2, $y2) = at_angle($cx, $cy, $R, $t2);
        $b .= sprintf('<path d="M%.1f,%.1f L%.1f,%.1f A%.1f,%.1f 0 0 0 %.1f,%.1f Z" class="%s"/>', $cx, $cy, $x1, $y1, $R, $R, $x2, $y2, $k % 2 ? 'dg-fill-sun' : 'dg-fill-accent');
    }
    my $ax0 = $cx + $R + 22;
    $b .= arrow($ax0, $cy, $ax0 + 40, $cy, 'accent');
    my $half = $th / 2 * $PI / 180;
    my $c = 2 * $R * sin($half);
    my $h = $R * cos($half);
    my $x0 = $ax0 + 66 + tw(plain($a->{hlabel} // 'r'), 11);
    my $y0 = $cy - $h / 2;
    for my $j (0 .. $n / 2 - 1) {
        # up-apex sector: apex on top, arc on the bottom
        my $ax = $x0 + $j * $c + $c / 2;
        $b .= sprintf('<path d="M%.1f,%.1f L%.1f,%.1f A%.1f,%.1f 0 0 0 %.1f,%.1f Z" class="dg-fill-accent"/>', $ax, $y0, $ax - $c / 2, $y0 + $h, $R, $R, $ax + $c / 2, $y0 + $h);
        # down-apex sector: apex on the bottom, arc on top
        my $dx = $x0 + ($j + 1) * $c;
        $b .= sprintf('<path d="M%.1f,%.1f L%.1f,%.1f A%.1f,%.1f 0 0 1 %.1f,%.1f Z" class="dg-fill-sun"/>', $dx, $y0 + $h, $dx - $c / 2, $y0, $R, $R, $dx + $c / 2, $y0);
    }
    my $wide = ($n / 2) * $c + $c / 2;
    $b .= sprintf('<path d="M%.1f,%.1f L%.1f,%.1f" class="dg-dashed"/>', $x0 + $c / 2, $y0, $x0 + $c / 2, $y0 + $h);
    $b .= T($x0 - 10, $y0 + $h / 2 + 4, $a->{hlabel} // 'r', anchor => 'end', cls => 'dg-label-accent');
    $b .= T($x0 + $wide / 2, $y0 + $h + 22, $a->{blabel} // 'half the circumference', anchor => 'middle', cls => 'dg-label-accent');
    $b .= T($x0 + $wide / 2, $y0 - 12, $a->{tlabel}, anchor => 'middle', cls => 'dg-label-sm') if defined $a->{tlabel};
    my $W = max($x0 + $wide + 20, $x0 + $wide / 2 + tw(plain($a->{blabel} // 'half the circumference'), 11) / 2 + 16);
    return (svg($W, $cy + $R + 26, "A circle cut into $n equal slices. The slices are rearranged, tip up and tip down, into a shape close to a parallelogram. Its height is " . plain($a->{hlabel} // 'r') . ' and its base is ' . plain($a->{blabel} // 'half the circumference') . '.', $b));
}

# lines: items="line:A,B;ray:C,D;segment:E,F;angle:P,Q,R" labels="…;…" (one picture per item)
# lines: items="line:A,B;ray:C,D;segment:E,F;angle:P,Q,R" (an angle may add a size: angle:P,Q,R,120)
#        labels="…;…" (under each item) sym=1 (draw the symbol under each: AB with ↔, → or a bar; ∠PQR) notitle=1
sub draw_lines {
    my ($a) = @_;
    my @it = map { [split /\s*:\s*/, $_, 2] } list($a->{items}, qr/\s*;\s*/);
    my @lab = list($a->{labels}, qr/\s*;\s*/);
    my $sym = $a->{sym};
    my $cw = 168;
    my $b = '';
    my @aria;
    my $top = !$a->{notitle} ? 46 : (grep { $_->[0] eq 'angle' } @it) ? 34 : 8;
    my $ly = $top + 76 + ($sym ? 26 : 0);   # baseline of the labels row
    for my $i (0 .. $#it) {
        my ($kind, $pts) = @{ $it[$i] };
        my @p = list($pts);
        my $x = 14 + $i * $cw;
        my $y = $top;
        if ($kind eq 'angle') {
            my $deg = $p[3] // 40;
            my $L = $deg > 50 ? 60 : 74;
            my $vx = $x + 30 + max(0, -$L * cos($deg * $PI / 180));
            my $vy = $y + 26 + ($deg > 50 ? 8 : 0);
            my ($p1x, $p1y) = ($x + 140, $vy);
            my ($p2x, $p2y) = at_angle($vx, $vy, $L, $deg);
            $b .= arrow($vx, $vy, $p1x, $p1y, 'plain') . arrow($vx, $vy, $p2x, $p2y, 'plain');
            $b .= $deg == 90 ? sprintf('<path d="M%.1f,%.1f h12 v-12 h-12" class="dg-right-angle"/>', $vx, $vy)
                             : '<path d="' . arcpath($vx, $vy, 24, 0, $deg) . '" class="dg-accent"/>';
            $b .= circ($vx, $vy, 3.5, 'dg-point') . circ($p1x - 30, $p1y, 3.5, 'dg-point');
            my ($qx, $qy) = at_angle($vx, $vy, $L - 20, $deg);
            $b .= circ($qx, $qy, 3.5, 'dg-point');
            $b .= T($vx - 6, $vy + 16, $p[1] // '', anchor => 'end') . T($p1x - 30, $p1y + 18, $p[2] // '', anchor => 'middle');
            $b .= $deg > 90 ? T($qx + 8, $qy + 2, $p[0] // '') : T($qx - 8, $qy + 2, $p[0] // '', anchor => 'end');
            $b .= T($x + 84, $y + 76, "\x{2220}" . join('', @p[0 .. 2]), anchor => 'middle', cls => 'dg-math') if $sym;
            push @aria, 'angle ' . join('', @p[0 .. 2]);
        } else {
            my ($x1, $x2) = ($x + 22, $x + $cw - 30);
            my ($q1, $q2) = $kind eq 'segment' ? ($x1, $x2) : ($x1 + 12, $x2 - 22);
            my $start = $kind eq 'line' ? $x1 - 14 : $kind eq 'ray' ? $q1 : $x1;
            $b .= line($start, $y + 26, $x2 + ($kind eq 'segment' ? 0 : 14), $y + 26, 'dg-line');
            $b .= poly('dg-head plain', $x2 + 20, $y + 26, $x2 + 11, $y + 21.5, $x2 + 11, $y + 30.5) if $kind ne 'segment';
            $b .= poly('dg-head plain', $x1 - 20, $y + 26, $x1 - 11, $y + 21.5, $x1 - 11, $y + 30.5) if $kind eq 'line';
            $b .= circ($q1, $y + 26, 4, $kind eq 'line' ? 'dg-point' : 'dg-point-accent') . circ($q2, $y + 26, 4, $kind eq 'segment' ? 'dg-point-accent' : 'dg-point');
            $b .= T($q1, $y + 46, $p[0] // '', anchor => 'middle') . T($q2, $y + 46, $p[1] // '', anchor => 'middle');
            if ($sym) {   # the two letters, with ↔ (line), → (ray) or a bar (segment) drawn above them
                my ($cx, $by) = ($x + $cw / 2 - 8, $y + 78);
                my $txt = join('', @p[0 .. 1]);
                my $hw = tw($txt, 15) / 2 + 3;
                $b .= T($cx, $by, $txt, anchor => 'middle', cls => 'dg-math');
                my $sy = $by - 17;
                $b .= line($cx - $hw, $sy, $cx + $hw, $sy, 'dg-line');
                $b .= poly('dg-head plain', $cx + $hw + 2, $sy, $cx + $hw - 4, $sy - 3.2, $cx + $hw - 4, $sy + 3.2) if $kind ne 'segment';
                $b .= poly('dg-head plain', $cx - $hw - 2, $sy, $cx - $hw + 4, $sy - 3.2, $cx - $hw + 4, $sy + 3.2) if $kind eq 'line';
            }
            push @aria, "$kind " . join('', @p);
        }
        $b .= T($x + $cw / 2 - 8, 22, $kind, anchor => 'middle', cls => 'dg-title') unless $a->{notitle};
        $b .= T($x + $cw / 2 - 8, $ly, $lab[$i], anchor => 'middle', cls => 'dg-math') if defined $lab[$i] && $lab[$i] ne '';
    }
    return (svg(14 + @it * $cw, $top + (@lab ? 88 : 58) + ($sym ? 26 : 0), 'Geometric objects: ' . join('; ', @aria), $b));
}

# angles: kind=intersect a=40 tilt=20 labels="1;2;3;4" (regions anticlockwise from the a-angle on the right; 1&3 and 2&4 are opposite)
#         kind=transversal a=60 labels="1;…;8" (at each crossing: top-left, top-right, bottom-left, bottom-right) parallel=1 highlight="2,6"
#         kind=perp | kind=parallel   names="m,n" (line names)
sub draw_angles {
    my ($a) = @_;
    my $kind = $a->{kind} // 'intersect';
    my @lab = list($a->{labels}, qr/\s*;\s*/);
    my %hi = map { $_ => 1 } list($a->{highlight});
    my @nm = list($a->{names});
    my $b = '';
    my $lab = sub {
        my ($cx, $cy, $t1, $t2, $txt, $idx) = @_;
        my $mid = ($t1 + $t2) / 2;
        $b .= '<path d="' . arcpath($cx, $cy, 20, $t1, $t2) . '" class="dg-accent"/>' if $hi{$idx};
        my ($lx, $ly) = at_angle($cx, $cy, 34 + max(0, 75 - abs($t2 - $t1)) * 0.9, $mid);
        $b .= T($lx, $ly + 4, $txt, anchor => 'middle', cls => $hi{$idx} ? 'dg-label-accent' : 'dg-label') if defined $txt && $txt ne '';
    };
    my $long = sub { my ($cx, $cy, $t, $L, $cls) = @_; my ($x1, $y1) = at_angle($cx, $cy, $L, $t); my ($x2, $y2) = at_angle($cx, $cy, $L, $t + 180); return line($x1, $y1, $x2, $y2, $cls // 'dg-line'); };
    if ($kind eq 'intersect') {
        my ($A, $t0) = ($a->{a} // 40, $a->{tilt} // 15);
        my ($cx, $cy) = (170, 100);
        $b .= $long->($cx, $cy, $t0, 130) . $long->($cx, $cy, $t0 + $A, 130);
        my @r = ([$t0, $t0 + $A], [$t0 + $A, $t0 + 180], [$t0 + 180, $t0 + 180 + $A], [$t0 + 180 + $A, $t0 + 360]);
        $lab->($cx, $cy, @{ $r[$_] }, $lab[$_], $_ + 1) for 0 .. 3;
        $b .= circ($cx, $cy, 3.5, 'dg-point');
        return (svg(340, 200, 'Two straight lines crossing. Angles: ' . join(', ', map { plain($_) } @lab), $b));
    }
    if ($kind eq 'transversal') {
        my $A = $a->{a} // 60;
        my $par = $a->{parallel} // 1;
        my ($y1, $y2) = (60, 150);
        my $cot = cos($A * $PI / 180) / sin($A * $PI / 180);
        my ($x1, $x2) = (200 + 45 * $cot, 200 - 45 * $cot);
        $b .= line(30, $y1, 380, $y1, 'dg-line');
        if ($par) { $b .= line(30, $y2, 380, $y2, 'dg-line'); }
        else { $b .= line(30, $y2 + 14, 380, $y2 - 14, 'dg-line'); }
        for my $yy (($a->{marks} // 1) ? ($par ? ($y1, $y2) : ($y1)) : ()) { $b .= sprintf('<path d="M%.1f,%.1f l7,5 l-7,5" class="dg-accent" transform="translate(0,-5)"/>', 330, $yy); }
        my ($tx1, $ty1) = at_angle($x1, $y1, 55, $A);
        my ($tx2, $ty2) = at_angle($x2, $y2, 55, $A + 180);
        $b .= line($tx1, $ty1, $tx2, $ty2, 'dg-line');
        my $tilt2 = $par ? 0 : atan2(28, 350) * 180 / $PI;
        my ($X2, $Y2) = ($x2, $y2);
        unless ($par) {   # where the transversal meets the tilted line y = y2 + 14 - 28(x - 30)/350
            my ($ca, $sa) = (cos($A * $PI / 180), sin($A * $PI / 180));
            my $t = ($y1 - $y2 - 14 + 28 * ($x1 - 30) / 350) / ($sa - 28 * $ca / 350);
            ($X2, $Y2) = ($x1 + $t * $ca, $y1 - $t * $sa);
            ($tx2, $ty2) = at_angle($X2, $Y2, 55, $A + 180);
            $b =~ s{<line x1="[^"]*" y1="[^"]*" x2="[^"]*" y2="[^"]*" class="dg-line"/>$}{};
            $b .= line($tx1, $ty1, $tx2, $ty2, 'dg-line');
        }
        for my $k (0, 1) {
            my ($cx, $cy, $base) = $k ? ($X2, $Y2, $tilt2) : ($x1, $y1, 0);
            my @r = ([$A, 180 + $base], [$base, $A], [180 + $base, 180 + $A], [180 + $A, 360 + $base]);
            $lab->($cx, $cy, @{ $r[$_] }, $lab[$k * 4 + $_], $k * 4 + $_ + 1) for 0 .. 3;
        }
        $b .= T(390, $y1 + 4, $nm[0], cls => 'dg-label') if @nm;
        $b .= T(390, $y2 + 4 - ($par ? 0 : 14), $nm[1], cls => 'dg-label') if @nm > 1;
        $b .= T($tx1 + 6, $ty1, $nm[2], cls => 'dg-label') if @nm > 2;
        return (svg(420, 210, ($par ? 'Two parallel lines' : 'Two lines that are not parallel') . ' cut by a transversal. Angles: ' . join(', ', map { plain($_) } @lab), $b));
    }
    if ($kind eq 'perp') {
        my ($cx, $cy) = (130, 100);
        $b .= line(30, $cy, 230, $cy, 'dg-line') . line($cx, 16, $cx, 184, 'dg-line');
        $b .= sprintf('<path d="M%.1f,%.1f h14 v-14" class="dg-right-angle"/>', $cx, $cy - 14) =~ s/h14 v-14/h14 v14/r;
        $b .= T(236, $cy + 4, $nm[0], cls => 'dg-label') . T($cx + 6, 22, $nm[1], cls => 'dg-label') if @nm;
        return (svg(max(270, 244 + tw($nm[0] // '', 12)), 200, 'Two perpendicular lines meeting at a right angle, marked with a small square.', $b));
    }
    # parallel
    $b .= line(30, 50, 300, 50, 'dg-line') . line(30, 120, 300, 120, 'dg-line');
    $b .= sprintf('<path d="M%.1f,%.1f l8,6 l-8,6" class="dg-accent"/>', 160, 44) . sprintf('<path d="M%.1f,%.1f l8,6 l-8,6" class="dg-accent"/>', 160, 114);
    $b .= T(308, 54, $nm[0], cls => 'dg-label') . T(308, 124, $nm[1] // '', cls => 'dg-label') if @nm;
    return (svg(max(340, 316 + max(tw($nm[0] // '', 12), tw($nm[1] // '', 12))), 160, 'Two parallel lines, each marked with the same arrowhead.', $b));
}

# polygon: pts="0,0;4,0;4,3" names="A,B,C" ticks="1,2,0" arcs="1,0,2" sides="5 cm;;3 cm" angles="40°;;" right="1"
#          pts2 names2 ticks2 arcs2 sides2 angles2 right2 (a second shape beside the first) unit=28
sub poly_one {
    my ($a, $sfx, $ox, $oy, $u) = @_;
    my @p = map { [map { $_ + 0 } split /\s*,\s*/] } list($a->{"pts$sfx"}, qr/\s*;\s*/);
    my ($minx, $maxy) = (min(map { $_->[0] } @p), max(map { $_->[1] } @p));
    my @s = map { [$ox + ($_->[0] - $minx) * $u, $oy + ($maxy - $_->[1]) * $u] } @p;
    my @nm = list($a->{"names$sfx"});
    my @tk = list($a->{"ticks$sfx"});
    my @ar = list($a->{"arcs$sfx"});
    my @sd = list($a->{"sides$sfx"}, qr/\s*;\s*/);
    my @an = list($a->{"angles$sfx"}, qr/\s*;\s*/);
    my %rt = map { $_ => 1 } list($a->{"right$sfx"});
    my $n = @s;
    my ($gx, $gy) = (sum(map { $_->[0] } @s) / $n, sum(map { $_->[1] } @s) / $n);
    my @pr = list($a->{"par$sfx"});
    my $b = $a->{"open$sfx"}
        ? '<polyline points="' . join(' ', map { sprintf('%.1f,%.1f', @$_) } @s) . '" class="dg-line" fill="none"/>'
        : poly($sfx ? 'dg-fill-sun' : 'dg-fill-accent', map { @$_ } @s);
    for my $i (0 .. $n - 1) {
        my ($P, $Q) = ($s[$i], $s[($i + 1) % $n]);
        my ($dx, $dy) = ($Q->[0] - $P->[0], $Q->[1] - $P->[1]);
        my $L = sqrt($dx * $dx + $dy * $dy) || 1;
        my ($ux, $uy) = ($dx / $L, $dy / $L);
        my ($nx, $ny) = (-$uy, $ux);
        my ($mx, $my) = (($P->[0] + $Q->[0]) / 2, ($P->[1] + $Q->[1]) / 2);
        if (($mx + $nx - $gx) ** 2 + ($my + $ny - $gy) ** 2 < ($mx - $gx) ** 2 + ($my - $gy) ** 2) { ($nx, $ny) = (-$nx, -$ny); }
        my $t = $tk[$i] // 0;
        for my $k (0 .. $t - 1) {
            my $off = ($k - ($t - 1) / 2) * 5;
            my ($cx, $cy) = ($mx + $ux * $off, $my + $uy * $off);
            $b .= sprintf('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" class="dg-accent"/>', $cx - $nx * 6, $cy - $ny * 6, $cx + $nx * 6, $cy + $ny * 6);
        }
        if (my $c = $pr[$i]) {   # parallel marks: matching arrowheads, all pointing right (or up)
            my ($vx, $vy) = ($ux, $uy);
            ($vx, $vy) = (-$vx, -$vy) if $vx < -0.01 || (abs($vx) <= 0.01 && $vy > 0);
            for my $k (0 .. $c - 1) {
                my $off = ($k - ($c - 1) / 2) * 7 + 3;
                my ($tx, $ty) = ($mx + $vx * $off, $my + $vy * $off);
                $b .= sprintf('<path d="M%.1f,%.1f L%.1f,%.1f L%.1f,%.1f" class="dg-accent" fill="none"/>', $tx - $vx * 6 + $vy * 5, $ty - $vy * 6 - $vx * 5, $tx, $ty, $tx - $vx * 6 - $vy * 5, $ty - $vy * 6 + $vx * 5);
            }
        }
        $b .= T($mx + $nx * 16, $my + $ny * 16 + 4, $sd[$i], anchor => abs($nx) < 0.3 ? 'middle' : $nx > 0 ? 'start' : 'end', cls => 'dg-label-sm') if defined $sd[$i] && $sd[$i] ne '';
    }
    for my $i (0 .. $n - 1) {
        my ($V, $A, $B) = ($s[$i], $s[($i - 1) % $n], $s[($i + 1) % $n]);
        my @u = map { my ($dx, $dy) = ($_->[0] - $V->[0], $_->[1] - $V->[1]); my $L = sqrt($dx * $dx + $dy * $dy) || 1; [$dx / $L, $dy / $L] } ($A, $B);
        my ($bx, $by) = ($u[0][0] + $u[1][0], $u[0][1] + $u[1][1]);
        my $bl = sqrt($bx * $bx + $by * $by) || 1;
        ($bx, $by) = ($bx / $bl, $by / $bl);
        if ($rt{$i + 1}) {
            my $r = 11;
            $b .= sprintf('<path d="M%.1f,%.1f L%.1f,%.1f L%.1f,%.1f" class="dg-right-angle"/>', $V->[0] + $u[0][0] * $r, $V->[1] + $u[0][1] * $r, $V->[0] + ($u[0][0] + $u[1][0]) * $r, $V->[1] + ($u[0][1] + $u[1][1]) * $r, $V->[0] + $u[1][0] * $r, $V->[1] + $u[1][1] * $r);
        }
        my $m = $ar[$i] // 0;
        for my $k (0 .. $m - 1) {
            my $r = 13 + 4 * $k;
            my ($sx, $sy, $ex, $ey) = ($V->[0] + $u[0][0] * $r, $V->[1] + $u[0][1] * $r, $V->[0] + $u[1][0] * $r, $V->[1] + $u[1][1] * $r);
            my $cross = $u[0][0] * $u[1][1] - $u[0][1] * $u[1][0];
            $b .= sprintf('<path d="M%.1f,%.1f A%.1f,%.1f 0 0 %d %.1f,%.1f" class="dg-accent"/>', $sx, $sy, $r, $r, $cross > 0 ? 1 : 0, $ex, $ey);
        }
        $b .= T($V->[0] + $bx * 30, $V->[1] + $by * 30 + 4, $an[$i], anchor => 'middle', cls => 'dg-label-sm') if defined $an[$i] && $an[$i] ne '';
        $b .= T($V->[0] - $bx * 13, $V->[1] - $by * 13 + 5, $nm[$i], anchor => 'middle', cls => 'dg-label') if defined $nm[$i];
    }
    my $w = (max(map { $_->[0] } @p) - $minx) * $u;
    my $h = ($maxy - min(map { $_->[1] } @p)) * $u;
    $b .= T($ox + $w / 2, $oy + $h + 34, $a->{"cap$sfx"}, anchor => 'middle', cls => 'dg-label') if defined $a->{"cap$sfx"};
    my $aria = 'Polygon' . (@nm ? ' ' . join('', @nm) : '') . (grep { $_ } @tk ? ', equal sides marked with matching ticks' : '') . (grep { $_ } @ar ? ', equal angles marked with matching arcs' : '');
    return ($b, $w, $h, $aria);
}
sub draw_polygon {
    my ($a) = @_;
    my $u = $a->{unit} // 28;
    my $L = 40 + max(0, map { tw($_, 11) - 22 } list($a->{sides}, qr/\s*;\s*/));   # room for a long label on a left side
    my ($b1, $w1, $h1, $ar1) = poly_one($a, '', $L, 34, $u);
    my ($W, $H, $b, $aria) = ($w1 + 80 + $L, $h1 + 70, $b1, $ar1);
    if ($a->{pts2}) {
        my $gap = 70 + ((($a->{sides} // '') . ($a->{sides2} // '')) =~ /[^;\s]/ ? 40 : 0);   # room for side labels between the shapes
        my ($b2, $w2, $h2, $ar2) = poly_one($a, '2', $L + $w1 + $gap, 34, $u);
        $b .= $b2; $W += $w2 + $gap; $H = max($H, $h2 + 70); $aria .= "; $ar2";
    }
    $b .= T($W / 2, $H - 6, $a->{label}, anchor => 'middle', cls => 'dg-math') if defined $a->{label};
    $H += 10 if defined $a->{label};
    $H += 14 if defined $a->{cap} || defined $a->{cap2};
    return (svg($W, $H, $aria, $b));
}

# tiles: terms="2x;-3" or left="2x;+3" right="x;+7" (algebra tiles: tall = x, small square = 1; red = negative)
sub tile_terms {
    my ($s, $x0, $y0) = @_;
    my $b = ''; my $x = $x0;
    for my $t (list($s, qr/\s*;\s*/)) {
        (my $u = $t) =~ s/[−–]/-/g; $u =~ s/\s+//g;
        my ($sign, $c, $v) = $u =~ /^([+-]?)(\d*)(x?)$/ or next;
        $c = $c eq '' ? 1 : $c;
        my $neg = $sign eq '-';
        for (1 .. $c) {
            if ($v) { $b .= rect($x, $y0, 18, 50, $neg ? 'dg-fill-hot' : 'dg-fill-cold', 2) . T($x + 9, $y0 + 30, $neg ? '−x' : 'x', anchor => 'middle', cls => 'dg-label-sm'); $x += 24; }
            else { $b .= rect($x, $y0 + 32, 18, 18, $neg ? 'dg-fill-hot' : 'dg-fill-sun', 2) . T($x + 9, $y0 + 45, $neg ? '−' : '+', anchor => 'middle', cls => 'dg-label-sm'); $x += 24; }
        }
        $x += 12;
    }
    return ($b, $x - $x0);
}
sub draw_tiles {
    my ($a) = @_;
    my $b = '';
    my $W;
    if (defined $a->{left}) {
        my ($bl, $wl) = tile_terms($a->{left}, 20, 20);
        my $ex = 20 + $wl + 6;
        my ($br, $wr) = tile_terms($a->{right}, $ex + 34, 20);
        $b = $bl . T($ex + 14, 54, '=', anchor => 'middle', cls => 'dg-math-lg') . $br;
        $W = $ex + 34 + $wr + 10;
        return (svg($W, 84, 'Algebra tiles: ' . plain($a->{left}) . ' equals ' . plain($a->{right}), $b));
    }
    my ($bt, $wt) = tile_terms($a->{terms}, 20, 20);
    $b = $bt;
    $W = 20 + $wt + 10;
    $b .= T(20, 98, $a->{label}, cls => 'dg-math') if defined $a->{label};
    return (svg(max($W, 40 + tw(plain($a->{label} // ''), 15)), defined $a->{label} ? 108 : 84, 'Algebra tiles: ' . plain($a->{terms}), $b));
}

# dotplot: data="3,4,4,5" min max step title xlabel marks="mean:4.5;median:4" highlight="4"
sub draw_dotplot {
    my ($a) = @_;
    my @d = map { num($_) } list($a->{data});
    my ($min, $max) = ($a->{min} // min(@d), $a->{max} // max(@d));
    my $step = $a->{step} // 1;
    my $n = ($max - $min) / $step;
    my $cell = $a->{cell} // max(22, min(46, int(460 / max($n, 1))));
    my %cnt; $cnt{fmt($_)}++ for @d;
    my $top = max(values %cnt) || 1;
    my ($ml, $mt) = (30, $a->{title} ? 36 : 14);
    my $base = $mt + $top * 18 + 10;
    my $X = sub { $ml + ($_[0] - $min) / $step * $cell };
    my %hi = map { fmt(num($_)) => 1 } list($a->{highlight});
    my $b = '';
    $b .= T($X->(($min + $max) / 2), 22, $a->{title}, anchor => 'middle', cls => 'dg-title') if $a->{title};
    $b .= line($X->($min) - 12, $base, $X->($max) + 12, $base, 'dg-line');
    for (my $v = $min; $v <= $max + 1e-9; $v += $step) {
        $b .= line($X->($v), $base, $X->($v), $base + 6, 'dg-line') . T($X->($v), $base + 20, fmt($v), anchor => 'middle', cls => 'dg-label-sm');
    }
    for my $k (keys %cnt) {   # every value gets its dots, on a tick or between ticks
        my $v = num($k);
        $b .= circ($X->($v), $base - 10 - 18 * $_, 6.5, $hi{$k} ? 'dg-fill-hot' : 'dg-fill-accent') for 0 .. $cnt{$k} - 1;
    }
    my $H = $base + 30;
    my $k = 0;
    for my $m (items($a->{marks})) {
        my $v = num($m->[1]);
        next unless defined $v;
        my $x = $X->($v);
        $b .= sprintf('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" class="dg-dashed"/>', $x, $mt - 2, $x, $base + 26 + 14 * $k);
        $b .= T($x + 4, $base + 38 + 14 * $k, "$m->[0] = $m->[1]", cls => 'dg-label-accent');
        $k++;
    }
    $H += 14 * $k + ($k ? 8 : 0);
    $b .= T($X->(($min + $max) / 2), $H + 4, $a->{xlabel}, anchor => 'middle', cls => 'dg-label') if $a->{xlabel};
    $H += $a->{xlabel} ? 14 : 0;
    return (svg($X->($max) + 30, $H, 'Dot plot' . ($a->{title} ? ' of ' . plain($a->{title}) : '') . ': ' . join(', ', map { fmt($_) } numsort(@d)), $b));
}

# mapping: in="1,2,3" out="2,4,6" arrows="1>2;2>4;3>6" inlabel outlabel (a mapping diagram for a relation)
sub draw_mapping {
    my ($a) = @_;
    my @in = list($a->{in}); my @out = list($a->{out});
    my $rows = max(scalar @in, scalar @out);
    my $H = 60 + $rows * 30;
    my ($lx, $rx) = (80, 260);
    my $b = '';
    $b .= sprintf('<ellipse cx="%d" cy="%.1f" rx="42" ry="%.1f" class="dg-fill-cold"/>', $lx, 30 + $rows * 15 + 6, $rows * 15 + 14);
    $b .= sprintf('<ellipse cx="%d" cy="%.1f" rx="42" ry="%.1f" class="dg-fill-sun"/>', $rx, 30 + $rows * 15 + 6, $rows * 15 + 14);
    my $yi = sub { 36 + ($rows - @{ $_[1] }) * 15 + $_[0] * 30 + 6 };
    my (%iy, %oy);
    for my $i (0 .. $#in) { my $y = $yi->($i, \@in); $iy{$in[$i]} = $y; $b .= T($lx, $y + 5, $in[$i], anchor => 'middle', cls => 'dg-math'); }
    for my $i (0 .. $#out) { my $y = $yi->($i, \@out); $oy{$out[$i]} = $y; $b .= T($rx, $y + 5, $out[$i], anchor => 'middle', cls => 'dg-math'); }
    for my $ar (list($a->{arrows}, qr/\s*;\s*/)) {
        my ($f, $t) = split /\s*>\s*/, $ar;
        next unless defined $iy{$f} && defined $oy{$t};
        $b .= arrow($lx + 22, $iy{$f}, $rx - 24, $oy{$t}, 'accent');
    }
    $b .= T($lx, $H + 8, $a->{inlabel} // 'input', anchor => 'middle', cls => 'dg-label');
    $b .= T($rx, $H + 8, $a->{outlabel} // 'output', anchor => 'middle', cls => 'dg-label');
    return (svg(340, $H + 13, 'Mapping diagram from ' . plain($a->{inlabel} // 'input') . ' to ' . plain($a->{outlabel} // 'output') . ': ' . join(', ', map { s/>/ to /r } list($a->{arrows}, qr/\s*;\s*/)), $b));
}

# people: n=40 cols=10 pick="1,5,9" groups="1-20:cold;21-40:hot" title (population / sample icons)
sub draw_people {
    my ($a) = @_;
    my $n = $a->{n} // 30; my $cols = $a->{cols} // 10;
    my %pick = map { $_ => 1 } list($a->{pick});
    my %grp;
    for my $g (items($a->{groups})) { my ($s, $e) = split /-/, $g->[0]; $grp{$_} = $g->[1] for $s .. ($e // $s); }
    my ($dx, $dy) = (26, $a->{numbers} ? 46 : 36);
    my $mt = $a->{title} ? 30 : 8;
    my $b = '';
    $b .= T(10 + $cols * $dx / 2, 20, $a->{title}, anchor => 'middle', cls => 'dg-title') if $a->{title};
    for my $i (1 .. $n) {
        my ($c, $r) = (($i - 1) % $cols, int(($i - 1) / $cols));
        my ($x, $y) = (16 + $c * $dx, $mt + 10 + $r * $dy);
        my $cls = $pick{$i} ? 'dg-solid-accent' : $grp{$i} ? "dg-fill-$grp{$i}" : 'dg-fill-soft';
        $b .= circ($x, $y, 5, $cls) . sprintf('<path d="M%.1f,%.1f a8,8 0 0 1 16,0 v6 h-16 Z" class="%s"/>', $x - 8, $y + 15, $cls);
        $b .= T($x, $y + 33, $i, anchor => 'middle', cls => 'dg-label-sm') if $a->{numbers};
    }
    my $rows = ceil($n / $cols);
    my $H = $mt + $rows * $dy + ($a->{numbers} ? 14 : 4);
    $b .= T(10, $H + 10, $a->{label}, cls => 'dg-label') if defined $a->{label};
    $H += 16 if defined $a->{label};
    return (svg(20 + $cols * $dx, $H, "$n people" . (%pick ? ', ' . scalar(keys %pick) . ' chosen for the sample (dark)' : '') . (defined $a->{label} ? '. ' . plain($a->{label}) : ''), $b));
}

# cube: n=3 label — a perfect cube built from n × n × n unit cubes
sub draw_cube {
    my ($a) = @_;
    my $n = $a->{n} // 3;
    my $h = join ';', map { join ',', ($n) x $n } 1 .. $n;
    my ($svg) = draw_blocks({ heights => $h, views => 'none', front => 0 });
    my $lab = $a->{label} // "$n × $n × $n";
    $svg =~ s{</svg>$}{};
    my ($W, $H) = $svg =~ /viewBox="0 0 (\d+) (\d+)"/;
    my $nh = $H + 26;
    $svg =~ s/viewBox="0 0 $W $H" width="$W" height="$H"/viewBox="0 0 $W $nh" width="$W" height="$nh"/;
    $svg .= T($W / 2, $H + 14, $lab, anchor => 'middle', cls => 'dg-math') . "\n</svg>";
    $svg =~ s/aria-label="[^"]*"/aria-label="A cube built from $n by $n by $n small cubes"/;
    return ($svg, "cube $n");
}

# thermo: min=-30 max=20 step=10 values="-12,5" labels="night;day" (vertical thermometers)
sub draw_thermo {
    my ($a) = @_;
    my ($min, $max, $step) = ($a->{min} // -20, $a->{max} // 20, $a->{step} // 5);
    my @v = map { num($_) } list($a->{values});
    my @lab = list($a->{labels}, qr/\s*;\s*/);
    my $gh = 200;
    my $Y = sub { 20 + ($max - $_[0]) / (($max - $min) || 1) * $gh };
    my $b = '';
    for (my $t = $min; $t <= $max + 1e-9; $t += $step) {
        $b .= line(44, $Y->($t), 52, $Y->($t), 'dg-line') . T(40, $Y->($t) + 4, fmt($t) . '°', anchor => 'end', cls => 'dg-label-sm');
        $b .= line(52, $Y->($t), 52 + 70 * max(1, scalar @v), $Y->($t), 'dg-grid');
    }
    $b .= line(52, $Y->(0), 52 + 70 * max(1, scalar @v), $Y->(0), 'dg-line') if $min < 0 && $max > 0;
    for my $i (0 .. $#v) {
        my $x = 76 + 70 * $i;
        $b .= rect($x, 14, 18, $gh + 12, 'dg-fill-soft', 9);
        $b .= rect($x + 4, $Y->($v[$i]), 10, $gh + 20 - $Y->($v[$i]) + 4, $v[$i] < 0 ? 'dg-fill-cold' : 'dg-fill-hot');
        $b .= circ($x + 9, $gh + 34, 13, $v[$i] < 0 ? 'dg-fill-cold' : 'dg-fill-hot');
        $b .= T($x + 9, $gh + 66, $lab[$i], anchor => 'middle', cls => 'dg-label-sm') if defined $lab[$i];
    }
    return (svg(70 + 70 * max(1, scalar @v) + 20, $gh + 76, 'Thermometers reading ' . join(', ', map { fmt($_) . ' degrees' } @v), $b));
}

# layers: l=4 w=3 h=2 (a box of unit cubes; one layer shown beside it)
sub draw_layers {
    my ($a) = @_;
    my ($l, $w, $h) = ($a->{l} // 4, $a->{w} // 3, $a->{h} // 2);
    my ($s1) = draw_blocks({ heights => join(';', map { join ',', ($h) x $l } 1 .. $w), views => 'none', front => 0 });
    my ($s2) = draw_blocks({ heights => join(';', map { join ',', (1) x $l } 1 .. $w), views => 'none', front => 0 });
    my ($w1, $h1) = $s1 =~ /viewBox="0 0 (\d+) (\d+)"/;
    my ($w2, $h2) = $s2 =~ /viewBox="0 0 (\d+) (\d+)"/;
    s{^<svg[^>]*>\n?|</svg>\s*$}{}g for $s1, $s2;
    my $H = max($h1, $h2) + 30;
    my $b = qq{<g transform="translate(0,0)">$s2</g>} . T($w2 / 2, $H - 8, $a->{llabel} // "one layer: $l × $w = " . ($l * $w), anchor => 'middle', cls => 'dg-label-accent');
    $b .= arrow($w2 + 4, $H / 2, $w2 + 40, $H / 2, 'accent');
    $b .= qq{<g transform="translate(} . ($w2 + 44) . qq{,0)">$s1</g>} . T($w2 + 44 + $w1 / 2, $H - 8, $a->{blabel} // "$h layers", anchor => 'middle', cls => 'dg-label-accent');
    return (svg($w2 + 44 + $w1 + 10, $H, "One layer of $l by $w cubes, and a box built from $h of those layers", $b));
}

# vline: a vertical number line (up = bigger). zero= draws a dashed line at 0
# across the picture; water=1 shades below 0. Point labels sit to the right.
sub draw_vline {
    my ($A) = @_;
    my ($min, $max) = ($A->{min} // -10, $A->{max} // 10);
    my $step = $A->{step} // 1;
    my $gh = $A->{height} // 240;
    my $W = $A->{width} // 320;
    my $unit = $A->{unit} // '';
    my $pre = $A->{prefix} // '';
    my ($ax, $top) = (64, 18);
    my $Y = sub { $top + ($max - $_[0]) / (($max - $min) || 1) * $gh };
    my $nt = ($max - $min) / $step;
    my $every = $A->{every} // ($nt <= 12 ? $step : $nt <= 24 ? 2 * $step : 5 * $step);
    my $B = '';
    if ($A->{water} && $min < 0) {
        my $y0 = $Y->(min(0, $max));
        $B .= rect($ax, $y0, $W - $ax - 6, $Y->($min) + 8 - $y0, 'dg-fill-water');
    }
    $B .= line($ax, $top - 12, $ax, $Y->($min) + 12, 'dg-line');
    $B .= poly('dg-head plain', $ax, $top - 18, $ax - 5, $top - 8, $ax + 5, $top - 8);
    $B .= poly('dg-head plain', $ax, $Y->($min) + 18, $ax - 5, $Y->($min) + 8, $ax + 5, $Y->($min) + 8);
    for (my $i = 0; $i <= $nt + 1e-9; $i++) {
        my $v = $min + $i * $step;
        my $lab = abs(($v - $min) / $every - floor(($v - $min) / $every + 1e-9)) < 1e-6;
        $B .= line($ax - ($lab ? 7 : 4), $Y->($v), $ax + ($lab ? 7 : 4), $Y->($v), 'dg-line');
        my $tl = fmt($v); $tl =~ s/^(−?)/$1$pre/;
        $B .= T($ax - 12, $Y->($v) + 4, $tl . $unit, anchor => 'end', cls => 'dg-label-sm') if $lab;
    }
    if (defined $A->{zero} && $min <= 0 && $max >= 0) {
        $B .= line($ax, $Y->(0), $W - 6, $Y->(0), 'dg-dashed');
        $B .= T($W - 8, $Y->(0) - 6, $A->{zero}, anchor => 'end', cls => 'dg-label-sm');
    }
    $B .= T($W - 8, $top + 4, $A->{above}, anchor => 'end', cls => 'dg-label-hot') if $A->{above};
    $B .= T($W - 8, $Y->($min) + 2, $A->{below}, anchor => 'end', cls => 'dg-label-cold') if $A->{below};
    my @pts = items($A->{points});
    push @pts, items($A->{keypoints}) if $KEY;
    @pts = grep { defined num($_->[0]) } @pts;
    my @ord = sort { num($pts[$b][0]) <=> num($pts[$a][0]) } 0 .. $#pts;
    @pts = @pts[@ord];
    my $last = -1e9;
    for my $p (@pts) {
        my $y = $Y->(num($p->[0]));
        $B .= circ($ax, $y, 5.5, 'dg-point-accent');
        next unless defined $p->[1] && $p->[1] ne '';
        my $ly = max($y + 4, $last + 17);
        $B .= line($ax + 7, $y, $ax + 20, $ly - 4, 'dg-line') if abs($ly - 4 - $y) > 3;
        $B .= T($ax + 24, $ly, $p->[1], cls => 'dg-label-accent');
        $last = $ly;
    }
    my $H = max($Y->($min) + 26, $last + 10);
    return (svg($W, $H, 'Vertical number line from ' . fmt($min) . " to " . fmt($max) . (@pts ? ', marked: ' . join(', ', map { fmt(num($_->[0])) . ($_->[1] ? ' (' . plain($_->[1]) . ')' : '') } @pts) : ''), $B));
}

# chips: a chip mat for adding and subtracting integers (Integers topic).
# pos/neg = the chips you start with (top row +, bottom row −).
# add=3 puts 3 zero pairs to the right, in an accent box (addlabel, default
# "+3 zero pairs"). xpos=/xneg= cross out that many + or − chips, counting
# from the right (taken away). pairs=2 circles the first 2 zero pairs of the
# start chips. title above, result below.
sub draw_chips {
    my ($A) = @_;
    my ($p, $n) = (num($A->{pos}) // 0, num($A->{neg}) // 0);
    my $add = num($A->{add}) // 0;
    my ($xp, $xn) = (num($A->{xpos}) // 0, num($A->{xneg}) // 0);
    my $pairs = num($A->{pairs}) // 0;
    my $c0 = max($p, $n);
    my $gap = ($add && $c0) ? 18 : 0;
    my $top = 10 + ($A->{title} ? 20 : 0) + ($add ? 20 : 0);
    my ($y1, $y2) = ($top + 18, $top + 48);
    my $X = sub { my $i = shift; return 24 + $i * 28 + ($i >= $c0 ? $gap : 0); };
    my $b = '';
    $b .= T(10, 16, $A->{title}, cls => 'dg-title') if $A->{title};
    my @P = ((map { $X->($_) } 0 .. $p - 1), (map { $X->($c0 + $_) } 0 .. $add - 1));
    my @N = ((map { $X->($_) } 0 .. $n - 1), (map { $X->($c0 + $_) } 0 .. $add - 1));
    $y2 = $y1 unless @P;   # no yellow chips at all: red chips take the top row
    for my $i (0 .. min($pairs, $p, $n) - 1) { $b .= rect($X->($i) - 14, $top + 3, 28, 60, 'dg-dashed', 12); }
    if ($add) {
        my ($xa, $xb) = ($X->($c0) - 16, $X->($c0 + $add - 1) + 16);
        $b .= rect($xa, $top + 1, $xb - $xa, 64, 'dg-accent', 10);
        $b .= T(($xa + $xb) / 2, $top - 6, $A->{addlabel} // "+$add zero pairs", anchor => 'middle', cls => 'dg-label-accent');
    }
    my $gone = sub { my ($x, $y, $sg) = @_; return '<g opacity="0.4">' . chip($x, $y, $sg) . '</g>'
        . sprintf('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" class="dg-accent"/>', $x - 11, $y + 11, $x + 11, $y - 11); };
    $b .= ($_ >= @P - $xp ? $gone->($P[$_], $y1, 1) : chip($P[$_], $y1, 1)) for 0 .. $#P;
    $b .= ($_ >= @N - $xn ? $gone->($N[$_], $y2, -1) : chip($N[$_], $y2, -1)) for 0 .. $#N;
    my $last = max(@P ? $P[-1] : 0, @N ? $N[-1] : 0, 0);
    my $W = max($last + 24, 200, $A->{title} ? tw(plain($A->{title}), 13) + 20 : 0,
                $add ? $X->($c0 + $add - 1) + 16 + 10 : 0);
    my $yb = (@N ? $y2 : $y1);   # no red chips at all: drop the empty bottom row
    my $H = $yb + 22;
    if (defined $A->{result}) {
        $b .= T(10, $yb + 44, $A->{result}, cls => 'dg-math');
        $H = $yb + 54;
        $W = max($W, tw(plain($A->{result}), 15) + 40);
    }
    my $aria = "Chips: $p positive and $n negative" . ($add ? ", plus $add zero pairs added" : '')
             . ($xp ? ", $xp positive taken away" : '') . ($xn ? ", $xn negative taken away" : '')
             . ($pairs ? ", $pairs zero pairs circled" : '') . (defined $A->{result} ? ': ' . plain($A->{result}) : '');
    return (svg($W, $H, $aria, $b));
}

# vjumps: a vertical number line (up = bigger) with jump arrows beside it, for
# elevators, temperatures, elevations and bank balances. Axis args as vline
# (min max step every unit prefix zero water above below height width), plus
# jumps="-3>2>-1" jumplabels="+5;−3" (; or , between labels) and
# points="v:label;…" (labels in a column to the right; keypoints in the key).
sub draw_vjumps {
    my ($A) = @_;
    my ($min, $max) = ($A->{min} // -10, $A->{max} // 10);
    my $step = $A->{step} // 1;
    my $gh = $A->{height} // 240;
    my $unit = $A->{unit} // '';
    my $pre = $A->{prefix} // '';
    my ($ax, $top) = (64, 22);
    my $Y = sub { $top + ($max - $_[0]) / (($max - $min) || 1) * $gh };
    my $nt = ($max - $min) / $step;
    my $every = $A->{every} // ($nt <= 12 ? $step : $nt <= 24 ? 2 * $step : 5 * $step);
    my @jumps = map { num($_) } list($A->{jumps}, qr/\s*>\s*/);
    my $js = $A->{jumplabels} // '';
    my @jl = $js =~ /;/ ? list($js, qr/\s*;\s*/) : list($js);
    my $nj = max(0, $#jumps);
    my @bulge = map { 34 + 22 * $_ } 0 .. $nj;
    my $jlw = max(0, map { tw(plain($_), 12) } @jl);
    my $jx = $ax + 8 + ($nj ? $bulge[$nj - 1] / 2 : 0) + 10;   # jump labels sit right of every curve
    my $lx = $nj ? $jx + $jlw + 16 : $ax + 28;
    my @pts = items($A->{points});
    push @pts, items($A->{keypoints}) if $KEY;
    @pts = grep { defined num($_->[0]) } @pts;
    my $plw = max(0, map { tw(plain($_->[1] // ''), 12) } @pts);
    my $W = max($A->{width} // 0, $lx + $plw + 30, 200);
    my $B = '';
    if ($A->{water} && $min < 0) {
        my $y0 = $Y->(min(0, $max));
        $B .= rect($ax, $y0, $W - $ax - 6, $Y->($min) + 8 - $y0, 'dg-fill-water');
    }
    $B .= line($ax, $top - 12, $ax, $Y->($min) + 12, 'dg-line');
    $B .= poly('dg-head plain', $ax, $top - 18, $ax - 5, $top - 8, $ax + 5, $top - 8);
    $B .= poly('dg-head plain', $ax, $Y->($min) + 18, $ax - 5, $Y->($min) + 8, $ax + 5, $Y->($min) + 8);
    for (my $i = 0; $i <= $nt + 1e-9; $i++) {
        my $v = $min + $i * $step;
        my $lab = abs(($v - $min) / $every - floor(($v - $min) / $every + 1e-9)) < 1e-6;
        $B .= line($ax - ($lab ? 7 : 4), $Y->($v), $ax + ($lab ? 7 : 4), $Y->($v), 'dg-line');
        my $tl = fmt($v); $tl =~ s/^(−?)/$1$pre/;
        $B .= T($ax - 12, $Y->($v) + 4, $tl . $unit, anchor => 'end', cls => 'dg-label-sm') if $lab;
    }
    if (defined $A->{zero} && $min <= 0 && $max >= 0) {
        $B .= line($ax, $Y->(0), $W - 6, $Y->(0), 'dg-dashed');
        $B .= T($W - 8, $Y->(0) - 6, $A->{zero}, anchor => 'end', cls => 'dg-label-sm') if $A->{zero} ne '';
    }
    $B .= T($W - 8, $top - 6, $A->{above}, anchor => 'end', cls => 'dg-label-hot') if $A->{above};
    $B .= T($W - 8, $Y->($min) + 14, $A->{below}, anchor => 'end', cls => 'dg-label-cold') if $A->{below};
    for my $i (0 .. $#jumps - 1) {
        my ($ya, $yb) = ($Y->($jumps[$i]), $Y->($jumps[$i + 1]));
        my ($x0, $bx) = ($ax + 8, $ax + 8 + $bulge[$i]);
        my $my = ($ya + $yb) / 2;
        my ($dx, $dy) = ($x0 - $bx, $yb - $my);
        my $len = sqrt($dx * $dx + $dy * $dy) || 1;
        my ($ux, $uy) = ($dx / $len, $dy / $len);
        my ($hx, $hy) = ($x0 - $ux * 8, $yb - $uy * 8);
        my ($px, $py) = (-$uy * 4.4, $ux * 4.4);
        $B .= sprintf('<path d="M%.1f,%.1f Q%.1f,%.1f %.1f,%.1f" class="dg-arrow accent"/>', $x0, $ya, $bx, $my, $hx + $ux * 1.5, $hy + $uy * 1.5);
        $B .= poly('dg-head accent', $x0, $yb, $hx + $px, $hy + $py, $hx - $px, $hy - $py);
        $B .= T($jx, $my + 4, $jl[$i], cls => 'dg-label-accent') if defined $jl[$i];
    }
    $B .= circ($ax, $Y->($_), 5.5, 'dg-point-accent') for @jumps;
    my @ord = sort { num($pts[$b][0]) <=> num($pts[$a][0]) } 0 .. $#pts;
    @pts = @pts[@ord];
    my $last = -1e9;
    for my $p (@pts) {
        my $y = $Y->(num($p->[0]));
        $B .= circ($ax, $y, 5.5, 'dg-point-accent');
        next unless defined $p->[1] && $p->[1] ne '';
        my $ly = max($y + 4, $last + 17);
        $B .= line($ax + 8, $y, $lx - 4, $ly - 4, 'dg-grid');
        $B .= T($lx, $ly, $p->[1], cls => 'dg-label');
        $last = $ly;
    }
    my $H = max($Y->($min) + 30, $last + 10);
    my $aria = 'Vertical number line from ' . fmt($min) . ' to ' . fmt($max);
    $aria .= ', jumps ' . join(' then ', map { fmt($jumps[$_]) . ' to ' . fmt($jumps[$_ + 1]) } 0 .. $#jumps - 1) if @jumps > 1;
    $aria .= ', marked: ' . join(', ', map { fmt(num($_->[0])) . ($_->[1] ? ' (' . plain($_->[1]) . ')' : '') } @pts) if @pts;
    return (svg($W, $H, $aria, $B));
}


# sqside: n=5 side="5 m" labels="Area = [[25]] m²;Perimeter = [[20]] m" fence=1 fill=plant grid=0 cell title
# (a square of n × n unit squares; the side label sits under and left of it; labels sit to the right)
sub draw_sqside {
    my ($a) = @_;
    my $n = $a->{n} // 4;
    my $c = $a->{cell} // max(9, min(24, int(150 / max($n, 1))));
    my $S = $n * $c;
    my $side = $a->{side} // $n;
    my @lab = list($a->{labels}, qr/\s*;\s*/);
    my $ty = defined $a->{title} ? 22 : 0;
    my ($x0, $y0) = (18 + tw(plain($side), 13), 12 + $ty);
    my $b = '';
    $b .= rect($x0, $y0, $S, $S, 'dg-fill-' . ($a->{fill} // 'accent'));
    if ($a->{grid} // 1) {
        for my $k (1 .. $n - 1) { $b .= line($x0 + $k * $c, $y0, $x0 + $k * $c, $y0 + $S, 'dg-grid') . line($x0, $y0 + $k * $c, $x0 + $S, $y0 + $k * $c, 'dg-grid'); }
    }
    $b .= rect($x0, $y0, $S, $S, $a->{fence} ? 'dg-accent' : 'dg-outline');
    $b .= T($x0 + $S / 2, $y0 + $S + 18, $side, anchor => 'middle', cls => 'dg-label');
    $b .= T($x0 - 7, $y0 + $S / 2 + 4, $side, anchor => 'end', cls => 'dg-label');
    my $lx = $x0 + $S + 18;
    my $lw = max(0, map { tw(plain($_), 12.5) + (/\[\[/ ? 26 : 0) } @lab);
    my $ly = $y0 + $S / 2 - (@lab - 1) * 11 + 4;
    for my $i (0 .. $#lab) { $b .= T($lx, $ly + 22 * $i, $lab[$i], cls => 'dg-label-accent'); }
    my $W = max($lx + $lw + 10, $x0 + $S + 20);
    $b .= T($W / 2, 16, $a->{title}, anchor => 'middle', cls => 'dg-title') if defined $a->{title};
    return (svg($W, $y0 + $S + 28, "A square of $n by $n unit squares, side " . plain($side) . (@lab ? '. ' . join('. ', map { plain($_) } @lab) : ''), $b));
}


# tilerows: rows of algebra tiles, one row per step (or per group for the
# distributive property). rows="2x;+3 = x;+7 | x!;x;+3 = x!;+7" (| between rows,
# " = " between the sides, lined up), labels="…;…" (left of each row),
# notes="…;…" (right of each row, may hold [[answers]]), title.
# A term ending in ! is drawn faded and crossed out (zero pair or a term taken
# from both sides). "0" draws a 0.
sub tilerow_terms {
    my ($s, $x0, $y0) = @_;
    my $b = ''; my $x = $x0;
    for my $t (list($s, qr/\s*;\s*/)) {
        (my $u = $t) =~ s/[−–]/-/g; $u =~ s/\s+//g;
        my $gone = ($u =~ s/!$//);
        if ($u eq '0') { $b .= T($x + 8, $y0 + 34, '0', anchor => 'middle', cls => 'dg-math-lg'); $x += 28; next; }
        my ($sign, $c, $v) = $u =~ /^([+-]?)(\d*)(x?)$/ or next;
        $c = $c eq '' ? 1 : $c;
        my $neg = $sign eq '-';
        for (1 .. $c) {
            my ($g, $yt, $h);
            if ($v) { ($yt, $h) = ($y0, 50); $g = rect($x, $y0, 18, 50, $neg ? 'dg-fill-hot' : 'dg-fill-cold', 2) . T($x + 9, $y0 + 30, $neg ? '−x' : 'x', anchor => 'middle', cls => 'dg-label-sm'); }
            else { ($yt, $h) = ($y0 + 32, 18); $g = rect($x, $y0 + 32, 18, 18, $neg ? 'dg-fill-hot' : 'dg-fill-sun', 2) . T($x + 9, $y0 + 45, $neg ? '−' : '+', anchor => 'middle', cls => 'dg-label-sm'); }
            $b .= $gone ? '<g opacity="0.35">' . $g . '</g>' . line($x - 3, $yt + $h + 3, $x + 21, $yt - 3, 'dg-accent') : $g;
            $x += 24;
        }
        $x += 12;
    }
    return ($b, $x > $x0 ? $x - $x0 - 12 : 0);
}
sub tilerow_tw {
    my ($s, $fs) = @_; my $w = 0;
    for my $seg (grep { $_ ne '' } split /(\[\[.*?\]\])/, $s // '') {
        $w += $seg =~ /^\[\[(.*)\]\]$/ ? ($KEY ? tw($1, $fs) : max(30, tw($1, $fs) + 16)) : tw($seg, $fs);
    }
    return $w;
}
sub draw_tilerows {
    my ($A) = @_;
    my @rows = list($A->{rows}, qr/\s*\|\s*/);
    my @lab = list($A->{labels} // '', qr/\s*;\s*/);
    my @not = list($A->{notes} // '', qr/\s*;\s*/);
    my $lw = max(0, map { tilerow_tw($_, 13) } @lab);
    $lw += 14 if $lw;
    my $top = defined $A->{title} ? 30 : 8;
    my $rh = 64;
    my (@L, @R, $ml, $mr);
    ($ml, $mr) = (0, 0);
    for my $r (@rows) {
        my ($l, $rr) = split /\s+=\s+/, $r, 2;
        push @L, $l; push @R, $rr;
        my (undef, $wl) = tilerow_terms($l, 0, 0); $ml = max($ml, $wl);
        if (defined $rr) { my (undef, $wr) = tilerow_terms($rr, 0, 0); $mr = max($mr, $wr); }
    }
    my $x0 = 10 + $lw;
    my $eqx = $x0 + $ml + 16;
    my $rx = (grep { defined } @R) ? $eqx + 18 : $x0;
    my $nx = (grep { defined } @R) ? $rx + $mr + 22 : $x0 + $ml + 22;
    my $b = '';
    $b .= T(10, 18, $A->{title}, cls => 'dg-title') if defined $A->{title};
    my $wn = 0;
    for my $i (0 .. $#rows) {
        my $y = $top + $i * $rh;
        $b .= line(8, $y - 6, $nx - 12, $y - 6, 'dg-grid') if $i > 0;
        $b .= T(10, $y + 32, $lab[$i], cls => 'dg-label') if defined $lab[$i] && $lab[$i] ne '';
        my ($bl) = tilerow_terms($L[$i], $x0, $y); $b .= $bl;
        if (defined $R[$i]) {
            $b .= T($eqx, $y + 33, '=', anchor => 'middle', cls => 'dg-math-lg');
            my ($br) = tilerow_terms($R[$i], $rx, $y); $b .= $br;
        }
        if (defined $not[$i] && $not[$i] ne '') { $b .= T($nx, $y + 33, $not[$i], cls => 'dg-math'); $wn = max($wn, tilerow_tw($not[$i], 15)); }
    }
    my $W = max($nx + $wn + 10, defined $A->{title} ? tw(plain($A->{title}), 13) + 20 : 0);
    my $H = $top + @rows * $rh - 4;
    my $aria = 'Algebra tiles: ' . join('; then ', map { my $t = plain($rows[$_]); $t =~ s/!//g; $t . (defined $not[$_] && $not[$_] ne '' ? ' (' . plain($not[$_]) . ')' : '') } 0 .. $#rows);
    return (svg($W, $H, $aria, $b));
}


# machine: function machine. in="3" rule="× 4" out="[[12]]"; several rows with in="1;2;3" out="…;…;…".
sub draw_machine {
    my ($a) = @_;
    my @in  = split /\s*;\s*/, ($a->{in} // 'input');
    my @out = split /\s*;\s*/, ($a->{out} // '?');
    my $n = max(scalar @in, scalar @out);
    my $rule = $a->{rule} // 'rule';
    my $bw = max(52, map { tw(plain($_), 15) + 26 } @in);
    my $ow = max(52, map { tw(plain($_), 15) + 30 } @out);
    my $mw = max(110, tw(plain($rule), 15) + 44);
    my $rh = 36;
    my $top = defined $a->{title} ? 28 : 10;
    my $mh = max(56, $n * $rh);
    my $b = '';
    $b .= T(10, 17, $a->{title}, cls => 'dg-title') if defined $a->{title};
    my $x1 = 10; my $x2 = $x1 + $bw + 46; my $x3 = $x2 + $mw + 46;
    my $cy = $top + $mh / 2;
    my $ry = sub { $cy + ($_[0] - ($n - 1) / 2) * $rh };
    $b .= rect($x2, $top, $mw, $mh, 'dg-fill-soft', 12) . rect($x2, $top, $mw, $mh, 'dg-outline', 12);
    $b .= circ($x2 + 14, $top + 12, 4, 'dg-solid-muted') . circ($x2 + $mw - 14, $top + 12, 4, 'dg-solid-muted');
    $b .= T($x2 + $mw / 2, $cy + 6, $rule, anchor => 'middle', cls => 'dg-math');
    for my $i (0 .. $#in) {
        my $y = $ry->($i);
        $b .= rect($x1, $y - 13, $bw, 26, 'dg-fill-cold', 6);
        $b .= T($x1 + $bw / 2, $y + 5, $in[$i], anchor => 'middle', cls => 'dg-math');
        $b .= arrow($x1 + $bw + 4, $y, $x2 - 4, $cy + ($y - $cy) * 0.35, 'accent');
    }
    for my $i (0 .. $#out) {
        my $y = $ry->($i);
        $b .= rect($x3, $y - 13, $ow, 26, 'dg-fill-sun', 6);
        $b .= T($x3 + $ow / 2, $y + 5, $out[$i], anchor => 'middle', cls => 'dg-math');
        $b .= arrow($x2 + $mw + 4, $cy + ($y - $cy) * 0.35, $x3 - 4, $y, 'accent');
    }
    my $ly = $top + $mh + 18;
    $b .= T($x1 + $bw / 2, $ly, $a->{inlabel} // 'input', anchor => 'middle', cls => 'dg-label-sm');
    $b .= T($x2 + $mw / 2, $ly, $a->{rulelabel} // 'rule', anchor => 'middle', cls => 'dg-label-sm');
    $b .= T($x3 + $ow / 2, $ly, $a->{outlabel} // 'output', anchor => 'middle', cls => 'dg-label-sm');
    my $W = max($x3 + $ow + 10, defined $a->{title} ? tw(plain($a->{title}), 13) + 20 : 0);
    return (svg($W, $ly + 8, 'Function machine: ' . join(', ', map { plain($in[$_]) . ' goes in, ' . plain($out[$_] // '?') . ' comes out' } 0 .. $#in) . '. Rule: ' . plain($rule), $b));
}

# curve: a smooth graph on a grid, no dots at the corners. path="x,y;…" (several with |), circle="cx,cy,r",
# points (dots with labels), open circles, vline (vertical line test), hits / keyhits (rings where it meets).
sub draw_curve {
    my ($a) = @_;
    my %o = (xmin => $a->{xmin} // 0, xmax => $a->{xmax} // 10, ymin => $a->{ymin} // 0, ymax => $a->{ymax} // 10,
             xstep => $a->{xstep} // 1, ystep => $a->{ystep} // 1, xevery => $a->{xevery}, yevery => $a->{yevery},
             xlabel => $a->{xlabel}, ylabel => $a->{ylabel});
    my $nx = ($o{xmax} - $o{xmin}) / $o{xstep};
    my $ny = ($o{ymax} - $o{ymin}) / $o{ystep};
    $o{cell} = $a->{cell} // max(14, min(30, int(($a->{width} // 420) / $nx), int(320 / $ny)));
    my ($b, $X, $Y, $W, $H) = grid_frame(%o);
    my $smooth = $a->{smooth} // 1;
    for my $p (split /\s*\|\s*/, $a->{path} // '') {
        my @s = map { my ($x, $y) = split /\s*,\s*/; [$X->(num($x)), $Y->(num($y))] } list($p, qr/\s*;\s*/);
        next unless @s > 1;
        my $d = sprintf('M%.1f,%.1f', @{ $s[0] });
        for my $i (0 .. $#s - 1) {
            if (!$smooth) { $d .= sprintf(' L%.1f,%.1f', @{ $s[$i + 1] }); next; }
            my ($p0, $p1, $p2, $p3) = ($s[$i > 0 ? $i - 1 : $i], $s[$i], $s[$i + 1], $s[$i + 2 <= $#s ? $i + 2 : $i + 1]);
            $d .= sprintf(' C%.1f,%.1f %.1f,%.1f %.1f,%.1f',
                $p1->[0] + ($p2->[0] - $p0->[0]) / 6, $p1->[1] + ($p2->[1] - $p0->[1]) / 6,
                $p2->[0] - ($p3->[0] - $p1->[0]) / 6, $p2->[1] - ($p3->[1] - $p1->[1]) / 6, @$p2);
        }
        $b .= qq{<path d="$d" class="dg-accent"/>};
    }
    if (defined $a->{circle}) {
        my ($cx, $cy, $r) = map { num($_) } split /\s*,\s*/, $a->{circle};
        $b .= sprintf('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" class="dg-accent"/>', $X->($cx), $Y->($cy), $r / $o{xstep} * $o{cell}, $r / $o{ystep} * $o{cell});
    }
    if (defined $a->{vline}) {
        my $vx = $X->(num($a->{vline}));
        $b .= sprintf('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" class="dg-dashed"/>', $vx, $Y->($o{ymax}), $vx, $Y->($o{ymin}));
    }
    if (defined $a->{hline}) {   # hline=4: a dashed flat line (two inputs, one output)
        my $hy = $Y->(num($a->{hline}));
        $b .= sprintf('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" class="dg-dashed"/>', $X->($o{xmin}), $hy, $X->($o{xmax}), $hy);
    }
    for my $q (map { my ($x, $y) = split /\s*,\s*/; [num($x), num($y)] } list(join(';', grep { defined && $_ ne '' } $a->{hits}, ($KEY ? $a->{keyhits} : undef)), qr/\s*;\s*/)) {
        $b .= circ($X->($q->[0]), $Y->($q->[1]), 7, 'dg-fill-hot');
    }
    for my $q (map { my ($x, $y) = split /\s*,\s*/; [num($x), num($y)] } list($a->{open}, qr/\s*;\s*/)) {
        $b .= sprintf('<circle cx="%.1f" cy="%.1f" r="4.5" fill="#fff" class="dg-accent"/>', $X->($q->[0]), $Y->($q->[1]));
    }
    for my $q (map { my ($xy, $lab) = split /\s*:\s*/, $_, 2; my ($x, $y) = split /\s*,\s*/, $xy; [num($x), num($y), $lab] } list($a->{points}, qr/\s*;\s*/)) {
        $b .= circ($X->($q->[0]), $Y->($q->[1]), 4.5, 'dg-point-accent');
        $b .= T($X->($q->[0]) + 8, $Y->($q->[1]) - 8, $q->[2], cls => 'dg-label-accent') if defined $q->[2] && $q->[2] ne '';
    }
    return (svg($W, $H, 'Graph' . ($a->{xlabel} ? ", x: " . plain($a->{xlabel}) : '') . ($a->{ylabel} ? ", y: " . plain($a->{ylabel}) : '') . (defined $a->{circle} ? '. A circle' : '') . (defined $a->{vline} ? '. Dashed vertical line at x = ' . $a->{vline} : ''), $b));
}

# wheel: dlabel="d" clabel="one turn = circumference" seglabel="d" bitlabel="a bit more" size=34 title
#        (a wheel rolled along the ground for one turn: the track is 3 diameters and a bit)
sub draw_wheel {
    my ($a) = @_;
    my $R = $a->{size} // 34;
    my $d = 2 * $R;
    my $C = $PI * $d;
    (my $dl = $a->{dlabel} // 'd') =~ s/\[\[(.*?)\]\]/$1    /g;
    my $x0 = max(34 + $R, $R + 22 + tw($dl, 11));
    my $top = 30 + ($a->{title} ? 20 : 0);
    my $base = $top + 2 * $R + 8;
    my $b = '';
    $b .= T($x0 + $C / 2, 20, $a->{title}, anchor => 'middle', cls => 'dg-title') if $a->{title};
    $b .= line($x0 - $R - 14, $base, $x0 + $C + $R + 14, $base, 'dg-line');
    $b .= sprintf('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" class="dg-accent"/>', $x0, $base, $x0 + $C, $base);
    # the wheel at the start, with its diameter, and where it ends up after one turn
    $b .= circ($x0, $base - $R, $R, 'dg-fill-soft');
    $b .= line($x0, $base - 2 * $R, $x0, $base, 'dg-line');
    $b .= T($x0 - 6, $base - $R + 4, $a->{dlabel} // 'd', anchor => 'end', cls => 'dg-label-cold');
    $b .= circ($x0, $base, 4.5, 'dg-point-accent');
    $b .= sprintf('<circle cx="%.1f" cy="%.1f" r="%.1f" class="dg-dashed"/>', $x0 + $C, $base - $R, $R);
    $b .= circ($x0 + $C, $base, 4.5, 'dg-point-accent');
    $b .= carrow($x0 + $R + 8, $base - $R, $x0 + $C - $R - 8, $base - $R, -22, 'accent');
    $b .= T($x0 + $C / 2, $base - 2 * $R - 2, $a->{clabel} // 'one turn = circumference', anchor => 'middle', cls => 'dg-label-accent');
    # diameters marked along the track
    my $seg = $a->{seglabel} // 'd';
    for my $k (0 .. 3) { $b .= line($x0 + $k * $d, $base - 6, $x0 + $k * $d, $base + 6, 'dg-line'); }
    $b .= line($x0 + $C, $base - 6, $x0 + $C, $base + 6, 'dg-line');
    for my $k (0 .. 2) { $b .= T($x0 + ($k + 0.5) * $d, $base + 20, $seg, anchor => 'middle', cls => 'dg-label-cold'); }
    my $bx = $x0 + 3 * $d + ($C - 3 * $d) / 2;
    $b .= line($bx, $base + 6, $bx + 10, $base + 26, 'dg-line');
    $b .= T($bx + 12, $base + 38, $a->{bitlabel} // 'a bit more', anchor => 'middle', cls => 'dg-label-sm');
    my $W = max($x0 + $C + $R + 20, $bx + 12 + tw(plain($a->{bitlabel} // 'a bit more'), 11.5) / 2 + 10);
    return (svg($W, $base + 46, 'A wheel with diameter ' . plain($a->{dlabel} // 'd') . ' rolls along the ground for one full turn. The track it rolls out is ' . plain($a->{clabel} // 'one turn = circumference') . '. It is 3 diameters and ' . plain($a->{bitlabel} // 'a bit more') . '.', $b));
}

# compass: rlabel="3 cm" r=3 (cm on the ruler) centre="O" steps="1. …|2. …|3. …" (drawing a circle with a compass, three pictures)
sub draw_compass {
    my ($a) = @_;
    my $cm = 20;
    my $r = $a->{r} // 3;
    my $rp = $r * $cm;
    my @st = list($a->{steps} // '1. Open to the radius|2. Point on the centre|3. Turn all the way around', qr/\s*\|\s*/);
    my $PW = 190;
    my $yR = 116;
    my $rq = min($rp, 60);   # pictures 2 and 3 are drawn at most 3 cm wide
    my $b = '';
    my $tool = sub {   # a compass with its point at (nx, y) and its pencil at (px, y)
        my ($nx, $px, $y) = @_;
        my ($hx, $hy) = (($nx + $px) / 2, $y - 70);
        my $s = line($hx, $hy, $nx, $y - 2, 'dg-line') . line($hx, $hy, $px, $y - 10, 'dg-line');
        $s .= poly('dg-fill-sun', $px - 4, $y - 12, $px + 4, $y - 12, $px, $y);
        $s .= rect($hx - 3, $hy - 14, 6, 14, 'dg-fill-soft', 2) . circ($hx, $hy, 3.5, 'dg-point');
        return $s;
    };
    # 1: open it to the radius on a ruler
    my $x = 10;
    my $z = $x + 24;
    $b .= rect($x + 12, $yR, 160, 24, 'dg-fill-soft', 2);
    for my $k (0 .. 7) {
        my $tx = $z + $k * $cm;
        last if $tx > $x + 168;
        $b .= line($tx, $yR, $tx, $yR + 8, 'dg-line');
        $b .= T($tx, $yR + 20, $k, anchor => 'middle', cls => 'dg-label-sm');
    }
    $b .= $tool->($z, $z + $rp, $yR);
    $b .= T($z + $rp / 2, $yR - 14, $a->{rlabel} // "$r cm", anchor => 'middle', cls => 'dg-label-accent');
    # 2: point on the centre, start the circle
    $x += $PW;
    my $c2 = $x + 40;
    $b .= '<path d="' . arcpath($c2, $yR, $rq, -35, 0) . '" class="dg-accent"/>';
    $b .= $tool->($c2, $c2 + $rq, $yR);
    $b .= circ($c2, $yR, 3.5, 'dg-point') . T($c2 - 8, $yR + 16, $a->{centre} // 'O', anchor => 'end', cls => 'dg-label');
    # 3: the finished circle
    $x += $PW;
    my ($c3, $cy3) = ($x + $PW / 2 - 6, $yR - 36);
    $b .= sprintf('<circle cx="%.1f" cy="%.1f" r="%.1f" class="dg-accent"/>', $c3, $cy3, $rq);
    $b .= line($c3, $cy3, $c3 + $rq, $cy3, 'dg-line') . circ($c3, $cy3, 3.5, 'dg-point');
    $b .= T($c3 + $rq / 2, $cy3 - 6, $a->{rlabel} // "$r cm", anchor => 'middle', cls => 'dg-label-accent');
    $b .= T($c3 - 8, $cy3 + 16, $a->{centre} // 'O', anchor => 'end', cls => 'dg-label');
    my $ra = $rq + 12;   # a turning arrow just outside the circle, 40° → 140°
    $b .= '<path d="' . arcpath($c3, $cy3, $ra, 40, 136) . '" class="dg-arrow accent"/>';
    my ($ex, $ey) = at_angle($c3, $cy3, $ra, 136);
    my ($ux, $uy) = (-sin(136 * $PI / 180), -cos(136 * $PI / 180));
    $b .= poly('dg-head accent', $ex + $ux * 8, $ey + $uy * 8, $ex - $uy * 4.6, $ey + $ux * 4.6, $ex + $uy * 4.6, $ey - $ux * 4.6);
    for my $i (0 .. 2) { $b .= T(10 + $i * $PW + $PW / 2 - 4, $yR + 62, $st[$i] // '', anchor => 'middle', cls => 'dg-label'); }
    return (svg(10 + 3 * $PW, $yR + 72, 'Drawing a circle with a compass in three steps: ' . join('; ', map { plain($_) } @st) . '. The radius is ' . plain($a->{rlabel} // "$r cm") . '.', $b));
}

# solid: a right prism or cylinder in any position, with both bases shaded.
# kind=box (base=bottom|front|side picks which pair of faces are the bases;
# l w h edge labels, lv wv hv numbers) · kind=tri (b th l labels, bv thv lv
# numbers; along=x lying long, along=z tent seen from the door, along=y
# standing; right=1 right triangle) · kind=ngon n=5 sv=2 hv=4 (regular base,
# along=y) · kind=cyl (r h labels, rv hv; lying=1 axis left-right; diameter=1).
# blabel on the visible base (both=1 also on the hidden one, shown faintly
# through the solid); lateral="…" on the biggest side face; slices=N layer
# lines parallel to the base; ground=1 groundlabel; fill=accent|sun|plant|cold|water|earth; size=190.
sub draw_solid {
    my ($a) = @_;
    my $kind = $a->{kind} // 'box';
    return solid_cyl($a) if $kind eq 'cyl';
    my $fc = ($a->{shade} // 1) ? 'dg-fill-' . ($a->{fill} // 'accent') : 'dg-fill-soft';   # shade=0: bases look like the other faces
    $a->{ghost} //= 0 unless $a->{shade} // 1;
    my ($kx, $ky) = (0.5, 0.32);
    my (@poly, $along, $len, $ax, $thv);
    my ($L, $W, $H);
    if ($kind eq 'box') {
        ($L, $W, $H) = ($a->{lv} // num($a->{l}) // 6, $a->{wv} // num($a->{w}) // 3, $a->{hv} // num($a->{h}) // 4);
        my $base = $a->{base} // 'bottom';
        if    ($base eq 'front') { $along = 'z'; @poly = ([0,0],[$L,0],[$L,$H],[0,$H]); $len = $W; }
        elsif ($base eq 'side')  { $along = 'x'; @poly = ([0,0],[$W,0],[$W,$H],[0,$H]); $len = $L; }
        else                     { $along = 'y'; @poly = ([0,0],[$L,0],[$L,$W],[0,$W]); $len = $H; }
    } elsif ($kind eq 'tri') {
        my $bv = $a->{bv} // num($a->{b}) // 4;
        $thv = $a->{thv} // num($a->{th}) // 3;
        $len = $a->{lv} // num($a->{l}) // 8;
        $along = $a->{along} // 'x';
        $ax = $a->{right} ? 0 : $bv / 2;
        @poly = ([0,0],[$bv,0],[$ax,$thv]);
    } else {
        my $n = $a->{n} // 5; my $r = $a->{sv} // 2;
        $len = $a->{hv} // $a->{lv} // num($a->{h}) // 4;
        $along = $a->{along} // 'y';
        my @p = map { my $t = 2 * $PI * $_ / $n + $PI / 2 - ($n % 2 ? 0 : $PI / $n); [$r * cos($t), $r * sin($t)] } 0 .. $n - 1;
        my $mu = min(map { $_->[0] } @p); my $mv = min(map { $_->[1] } @p);
        @poly = map { [$_->[0] - $mu, $_->[1] - $mv] } @p;
    }
    # a lying prism (along=x) is drawn with its base face-on and the length going back at a shallow angle
    if ($kind ne 'box' && $along eq 'x') { $along = 'z'; ($kx, $ky) = (0.8, 0.28); }
    elsif ($kind ne 'box' && $along eq 'y') { ($kx, $ky) = (0.42, 0.5); }
    my $to3 = sub { my ($u, $v) = @_; return $along eq 'x' ? [0, $v, $u] : $along eq 'y' ? [$u, 0, $v] : [$u, $v, 0]; };
    my @E = $along eq 'x' ? ($len, 0, 0) : $along eq 'y' ? (0, $len, 0) : (0, 0, $len);
    my $add = sub { my ($p, $t) = @_; return [$p->[0] + $t * $E[0], $p->[1] + $t * $E[1], $p->[2] + $t * $E[2]]; };
    my @B0 = map { $to3->(@$_) } @poly;
    my @B1 = map { $add->($_, 1) } @B0;
    my $n = @B0;
    # raw projection, then scale to fit
    my $pr0 = sub { my ($p) = @_; return ($p->[0] + $kx * $p->[2], -($p->[1] + $ky * $p->[2])); };
    my @all = map { [$pr0->($_)] } @B0, @B1;
    my ($minx, $maxx) = (min(map { $_->[0] } @all), max(map { $_->[0] } @all));
    my ($miny, $maxy) = (min(map { $_->[1] } @all), max(map { $_->[1] } @all));
    my $s = ($a->{size} // 190) / max($maxx - $minx, ($maxy - $miny) * 1.1, 0.001);
    my $P = sub { my ($p) = @_; my ($x, $y) = $pr0->($p); return ($x * $s, $y * $s); };
    # faces: [points, kind] ; outward normals for visibility
    my @faces = ([\@B0, 'base'], [\@B1, 'base']);
    for my $i (0 .. $n - 1) { my $j = ($i + 1) % $n; push @faces, [[$B0[$i], $B0[$j], $B1[$j], $B1[$i]], 'lat']; }
    my @c = (0, 0, 0); for my $p (@B0, @B1) { $c[$_] += $p->[$_] / (2 * $n) for 0 .. 2; }
    my @vis;
    for my $f (@faces) {
        my @q = @{ $f->[0] }; my @nn = (0, 0, 0); my @fc = (0, 0, 0);
        for my $k (0 .. $#q) {
            my ($p, $r) = ($q[$k], $q[($k + 1) % @q]);
            $nn[0] += ($p->[1] - $r->[1]) * ($p->[2] + $r->[2]);
            $nn[1] += ($p->[2] - $r->[2]) * ($p->[0] + $r->[0]);
            $nn[2] += ($p->[0] - $r->[0]) * ($p->[1] + $r->[1]);
            $fc[$_] += $p->[$_] / @q for 0 .. 2;
        }
        my $out = sum(map { $nn[$_] * ($fc[$_] - $c[$_]) } 0 .. 2);
        @nn = map { -$_ } @nn if $out < 0;
        push @vis, ($nn[0] * $kx + $nn[1] * $ky - $nn[2] > 1e-9) ? 1 : 0;
    }
    # edges: [p, q, face a, face b]
    my @edges;
    for my $i (0 .. $n - 1) {
        my $j = ($i + 1) % $n;
        push @edges, [$B0[$i], $B0[$j], 0, 2 + $i], [$B1[$i], $B1[$j], 1, 2 + $i], [$B0[$i], $B1[$i], 2 + ($i - 1) % $n, 2 + $i];
    }
    my $evis = sub { my ($e) = @_; return $vis[$e->[2]] || $vis[$e->[3]]; };
    my @proj = map { [$P->($_)] } @B0, @B1;
    my ($cx, $cy) = (sum(map { $_->[0] } @proj) / @proj, sum(map { $_->[1] } @proj) / @proj);
    my @bb = (min(map { $_->[0] } @proj), min(map { $_->[1] } @proj), max(map { $_->[0] } @proj), max(map { $_->[1] } @proj));
    my $grow = sub { my ($x1, $y1, $x2, $y2) = @_; $bb[0] = min($bb[0], $x1); $bb[1] = min($bb[1], $y1); $bb[2] = max($bb[2], $x2); $bb[3] = max($bb[3], $y2); };
    my $lab = sub {   # text at x,y with anchor; grows the box
        my ($x, $y, $t, $anc, $cls) = @_;
        return '' unless defined $t && $t ne '';
        $cls ||= 'dg-label-accent';
        my $w = tw(plain($t), $FS{$cls} || 12) + ($t =~ /\[\[/ ? 22 : 0);
        my $x1 = $anc eq 'start' ? $x : $anc eq 'end' ? $x - $w : $x - $w / 2;
        $grow->($x1, $y - 14, $x1 + $w, $y + 5);
        (my $o = T($x, $y, $t, anchor => $anc, cls => $cls)) =~ s/<text /<text style="paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round" /g;
        return $o;
    };
    my $elab = sub {  # label an edge, pushed away from the solid's centre
        my ($p, $q, $t) = @_;
        my ($x1, $y1) = $P->($p); my ($x2, $y2) = $P->($q);
        my ($mx, $my) = (($x1 + $x2) / 2, ($y1 + $y2) / 2);
        my ($ex, $ey) = ($x2 - $x1, $y2 - $y1); my $el = sqrt($ex * $ex + $ey * $ey) || 1;
        my ($nx, $ny) = (-$ey / $el, $ex / $el);
        ($nx, $ny) = (-$nx, -$ny) if $nx * ($mx - $cx) + $ny * ($my - $cy) < 0;
        my $anc = $nx > 0.35 ? 'start' : $nx < -0.35 ? 'end' : 'middle';
        my $y = $my + $ny * 9 + ($ny > 0.5 ? 10 : $ny < -0.5 ? -2 : 4);
        return $lab->($mx + $nx * 8, $y, $t, $anc);
    };
    my $poly2 = sub { my ($cls, $pts, $extra) = @_; my $s2 = join ' ', map { sprintf '%.1f,%.1f', $P->($_) } @$pts; return qq{<polygon points="$s2" class="$cls"} . ($extra // '') . '/>'; };
    my $b = '';
    for my $k (2 .. $#faces) { $b .= $poly2->('dg-fill-soft', $faces[$k][0]) if $vis[$k]; }
    for my $e (@edges) { next if $evis->($e); $b .= line($P->($e->[0]), $P->($e->[1]), 'dg-dashed'); }   # hidden edges show through
    if (my $N = $a->{slices}) {
        for my $m (1 .. $N - 1) {
            for my $i (0 .. $n - 1) {
                next unless $vis[2 + $i];
                $b .= line($P->($add->($B0[$i], $m / $N)), $P->($add->($B0[($i + 1) % $n], $m / $N)), 'dg-grid');
            }
        }
    }
    for my $e (@edges) { $b .= line($P->($e->[0]), $P->($e->[1]), 'dg-line') if $evis->($e); }
    my @vb = grep { $vis[$_] } 0, 1;
    my @hb = grep { !$vis[$_] } 0, 1;
    $b .= $poly2->($fc, $faces[$_][0]) for @vb;
    $b .= $poly2->($fc, $faces[$_][0], ' style="stroke-dasharray:5 3"') for ($a->{ghost} // 1) ? @hb : ();
    my $cent = sub { my @q = map { [$P->($_)] } @{ $faces[$_[0]][0] }; return (sum(map { $_->[0] } @q) / @q, sum(map { $_->[1] } @q) / @q); };
    my $bshift = 0;   # keep the base label off the triangle's height line
    if ($kind eq 'tri' && (defined $a->{th} || $a->{showth})) { my ($x1) = $P->($to3->(0, 0)); my ($x2) = $P->($to3->($poly[1][0], 0)); $bshift = ($a->{right} ? 0.14 : -0.2) * abs($x2 - $x1); }
    for my $k (@vb, ($a->{both} ? @hb : ())) { my ($x, $y) = $cent->($k); $b .= $lab->($x + $bshift, $y + 4, $a->{blabel}, 'middle'); }
    if (defined $a->{lateral}) {
        my ($best, $ba) = (undef, -1);
        for my $k (2 .. $#faces) {
            next unless $vis[$k];
            my @q = map { [$P->($_)] } @{ $faces[$k][0] }; my $ar = 0;
            for my $i (0 .. $#q) { my $j = ($i + 1) % @q; $ar += $q[$i][0] * $q[$j][1] - $q[$j][0] * $q[$i][1]; }
            ($best, $ba) = ($k, abs($ar)) if abs($ar) > $ba;
        }
        if (defined $best) { my ($x, $y) = $cent->($best); $b .= $lab->($x, $y + 4, $a->{lateral}, 'middle', 'dg-label-sm'); }
    }
    my $first = sub { for (@_) { return $_ if $evis->($_); } return $_[0]; };
    if ($kind eq 'box') {
        $b .= $elab->([0,0,0], [$L,0,0], $a->{l}) if defined $a->{l};
        $b .= $elab->([0,0,0], [0,$H,0], $a->{h}) if defined $a->{h};
        $b .= $elab->([$L,0,0], [$L,0,$W], $a->{w}) if defined $a->{w};
    } elsif ($kind eq 'tri') {
        my $eb = $first->($edges[0], $edges[1]);
        $b .= $elab->($eb->[0], $eb->[1], $a->{b}) if defined $a->{b};
        my $el = $first->($edges[5], $edges[2], $edges[8]);
        $b .= $elab->($el->[0], $el->[1], $a->{l} // $a->{h}) if defined($a->{l} // $a->{h});
        my $t = $vis[0] ? 0 : 1;
        my ($F, $A) = ($to3->($ax, 0), $to3->($ax, $thv));
        ($F, $A) = ($add->($F, 1), $add->($A, 1)) if $t;
        my ($fx, $fy) = $P->($F); my ($px, $py) = $P->($A);
        my ($bx, $by) = $P->($t ? $add->($to3->($ax + 1, 0), 1) : $to3->($ax + 1, 0));
        my ($ux, $uy) = ($bx - $fx, $by - $fy); my $ul = sqrt($ux * $ux + $uy * $uy) || 1; ($ux, $uy) = ($ux / $ul * 8, $uy / $ul * 8);
        my ($vx, $vy) = ($px - $fx, $py - $fy); my $vl = sqrt($vx * $vx + $vy * $vy) || 1; ($vx, $vy) = ($vx / $vl * 8, $vy / $vl * 8);
        if (defined $a->{th} || $a->{showth}) {
            $b .= line($fx, $fy, $px, $py, 'dg-dashed') unless $a->{right};
            $b .= sprintf('<polyline points="%.1f,%.1f %.1f,%.1f %.1f,%.1f" class="dg-right-angle"/>', $fx + $ux, $fy + $uy, $fx + $ux + $vx, $fy + $uy + $vy, $fx + $vx, $fy + $vy);
        }
        if (defined $a->{th}) {
            if ($a->{right}) { $b .= $elab->($F, $A, $a->{th}); }
            else { $b .= $lab->($fx + ($px - $fx) * 0.22 + 5, $fy + ($py - $fy) * 0.22 + 4, $a->{th}, 'start'); }
        }
    }
    if ($a->{ground}) {
        my $gy = max(map { $_->[1] } @proj) + 1;
        $b .= line($bb[0] - 14, $gy, $bb[2] + 14, $gy, 'dg-line');
        $b .= $lab->(($bb[0] + $bb[2]) / 2, $gy + 30, $a->{groundlabel}, 'middle', 'dg-label-sm') if defined $a->{groundlabel};
        $grow->($bb[0] - 14, $gy, $bb[2] + 14, $gy + 2);
    }
    my ($ox, $oy) = (10 - $bb[0], 10 - $bb[1]);
    my $name = $kind eq 'box' ? 'Rectangular prism' : $kind eq 'tri' ? 'Triangular prism' : ($a->{n} // 5) . '-sided prism';
    my $aria = "$name with its two bases shaded" . join('', map { defined $a->{$_} ? ', ' . plain($a->{$_}) : '' } qw(l w h b th blabel lateral)) . '.';
    return (svg($bb[2] - $bb[0] + 20, $bb[3] - $bb[1] + 20, $aria, qq{<g transform="translate($ox,$oy)">$b</g>}));
}

sub solid_cyl {
    my ($a) = @_;
    my $fc = ($a->{shade} // 1) ? 'dg-fill-' . ($a->{fill} // 'accent') : 'dg-fill-soft';   # shade=0: bases look like the other faces
    $a->{ghost} //= 0 unless $a->{shade} // 1;
    my ($rv, $hv) = ($a->{rv} // num($a->{r}) // 3, $a->{hv} // num($a->{h}) // 6);
    my $size = $a->{size} // 170;
    my $b = '';
    my @bb;
    my $grow = sub { my ($x1, $y1, $x2, $y2) = @_; @bb = @bb ? (min($bb[0], $x1), min($bb[1], $y1), max($bb[2], $x2), max($bb[3], $y2)) : ($x1, $y1, $x2, $y2); };
    my $lab = sub {
        my ($x, $y, $t, $anc, $cls) = @_;
        return '' unless defined $t && $t ne '';
        $cls ||= 'dg-label-accent';
        my $w = tw(plain($t), $FS{$cls} || 12) + ($t =~ /\[\[/ ? 22 : 0);
        my $x1 = $anc eq 'start' ? $x : $anc eq 'end' ? $x - $w : $x - $w / 2;
        $grow->($x1, $y - 14, $x1 + $w, $y + 5);
        (my $o = T($x, $y, $t, anchor => $anc, cls => $cls)) =~ s/<text /<text style="paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round" /g;
        return $o;
    };
    my $ghost = $a->{ghost} // 1;
    if ($a->{lying}) {
        my $s = $size / max($hv + 0.64 * $rv, 2 * $rv, 0.001);
        my ($R, $Lx) = ($rv * $s, $hv * $s); my $e = $R * 0.32;
        my ($x0, $cy, $x1) = (0, 0, $Lx);
        $grow->($x0 - $e, $cy - $R, $x1 + $e, $cy + $R);
        $b .= sprintf('<path d="M%.1f,%.1f L%.1f,%.1f A%.1f,%.1f 0 0 0 %.1f,%.1f L%.1f,%.1f A%.1f,%.1f 0 0 1 %.1f,%.1f Z" class="dg-fill-soft"/>',
            $x0, $cy - $R, $x1, $cy - $R, $e, $R, $x1, $cy + $R, $x0, $cy + $R, $e, $R, $x0, $cy - $R);
        if (my $N = $a->{slices}) { for my $m (1 .. $N - 1) { my $x = $x0 + $Lx * $m / $N; $b .= sprintf('<path d="M%.1f,%.1f A%.1f,%.1f 0 0 0 %.1f,%.1f" class="dg-grid"/>', $x, $cy - $R, $e, $R, $x, $cy + $R); } }
        $b .= sprintf('<path d="M%.1f,%.1f A%.1f,%.1f 0 0 1 %.1f,%.1f" class="dg-dashed"/>', $x0, $cy - $R, $e, $R, $x0, $cy + $R);
        $b .= sprintf('<path d="M%.1f,%.1f A%.1f,%.1f 0 0 0 %.1f,%.1f" class="dg-line"/>', $x0, $cy - $R, $e, $R, $x0, $cy + $R);
        $b .= line($x0, $cy - $R, $x1, $cy - $R) . line($x0, $cy + $R, $x1, $cy + $R);
        $b .= sprintf('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" class="%s"/>', $x1, $cy, $e, $R, $fc);
        $b .= sprintf('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" class="%s" style="stroke-dasharray:5 3"/>', $x0, $cy, $e, $R, $fc) if $ghost;
        $b .= circ($x1, $cy, 2.5, 'dg-point');
        if (defined $a->{r}) {
            if ($a->{diameter}) { $b .= line($x1, $cy - $R, $x1, $cy + $R, 'dg-accent'); $b .= $lab->($x1 + $e + 6, $cy + 4, $a->{r}, 'start'); }
            else { $b .= line($x1, $cy, $x1, $cy - $R, 'dg-accent'); $b .= $lab->($x1 + $e * 0.6 + 6, $cy - $R / 2 + 4, $a->{r}, 'start'); }
        }
        $b .= $lab->($x1, $cy + $R * 0.55 + 4, $a->{blabel}, 'middle');
        $b .= $lab->($x0, $cy + $R * 0.55 + 4, $a->{blabel}, 'middle') if $a->{both};
        $b .= $lab->(($x0 + $x1) / 2, $cy + $R + 18, $a->{h}, 'middle');
        $b .= $lab->(($x0 + $x1) / 2, $cy + 4, $a->{lateral}, 'middle', 'dg-label-sm');
        if ($a->{ground}) { $b .= line($bb[0] - 14, $cy + $R + 1, $bb[2] + 14, $cy + $R + 1, 'dg-line'); $grow->($bb[0] - 14, $cy + $R, $bb[2] + 14, $cy + $R + 2); }
    } else {
        my $s = $size / max(2 * $rv, $hv, 0.001);
        my ($R, $Hh) = ($rv * $s, $hv * $s); my $e = $R * 0.32;
        my ($cx, $top) = (0, 0); my $bot = $top + $Hh;
        $grow->($cx - $R, $top - $e, $cx + $R, $bot + $e);
        $b .= sprintf('<path d="M%.1f,%.1f L%.1f,%.1f A%.1f,%.1f 0 0 0 %.1f,%.1f L%.1f,%.1f A%.1f,%.1f 0 0 1 %.1f,%.1f Z" class="dg-fill-soft"/>',
            $cx - $R, $top, $cx - $R, $bot, $R, $e, $cx + $R, $bot, $cx + $R, $top, $R, $e, $cx - $R, $top);
        if (my $N = $a->{slices}) { for my $m (1 .. $N - 1) { my $y = $top + $Hh * $m / $N; $b .= sprintf('<path d="M%.1f,%.1f A%.1f,%.1f 0 0 0 %.1f,%.1f" class="dg-grid"/>', $cx - $R, $y, $R, $e, $cx + $R, $y); } }
        $b .= sprintf('<path d="M%.1f,%.1f A%.1f,%.1f 0 0 1 %.1f,%.1f" class="dg-dashed"/>', $cx - $R, $bot, $R, $e, $cx + $R, $bot);
        $b .= sprintf('<path d="M%.1f,%.1f A%.1f,%.1f 0 0 0 %.1f,%.1f" class="dg-line"/>', $cx - $R, $bot, $R, $e, $cx + $R, $bot);
        $b .= line($cx - $R, $top, $cx - $R, $bot) . line($cx + $R, $top, $cx + $R, $bot);
        $b .= sprintf('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" class="%s" style="stroke-dasharray:5 3"/>', $cx, $bot, $R, $e, $fc) if $ghost;
        $b .= sprintf('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" class="%s"/>', $cx, $top, $R, $e, $fc);
        $b .= circ($cx, $top, 2.5, 'dg-point');
        if (defined $a->{r}) {
            if ($a->{diameter}) { $b .= line($cx - $R, $top, $cx + $R, $top, 'dg-accent'); $b .= $lab->($cx, $top - $e - 6, $a->{r}, 'middle'); }
            else { $b .= line($cx, $top, $cx + $R, $top, 'dg-accent'); $b .= $lab->($cx + $R / 2, $top - $e - 5, $a->{r}, 'middle'); }
        }
        my $by = $a->{diameter} ? $top + $e - 2 : $top + 5;
        $b .= $lab->($a->{diameter} ? $cx : $cx - $R * 0.45, $by, $a->{blabel}, 'middle');
        $b .= $lab->($cx, $bot + 5, $a->{blabel}, 'middle') if $a->{both};
        $b .= $lab->($cx + $R + 8, ($top + $bot) / 2 + 4, $a->{h}, 'start');
        $b .= $lab->($cx, ($top + $bot) / 2 + $e + 4, $a->{lateral}, 'middle', 'dg-label-sm');
        if ($a->{ground}) { $b .= line($bb[0] - 14, $bot + $e + 1, $bb[2] + 14, $bot + $e + 1, 'dg-line'); $grow->($bb[0] - 14, $bot + $e, $bb[2] + 14, $bot + $e + 2); }
    }
    my ($ox, $oy) = (10 - $bb[0], 10 - $bb[1]);
    my $aria = 'Cylinder' . ($a->{lying} ? ' lying on its side' : '') . ' with its two circle bases shaded' . join('', map { defined $a->{$_} ? ', ' . plain($a->{$_}) : '' } qw(r h blabel lateral)) . '.';
    return (svg($bb[2] - $bb[0] + 20, $bb[3] - $bb[1] + 20, $aria, qq{<g transform="translate($ox,$oy)">$b</g>}));
}

# ── Samples & Statistics (topic 11) ──────────────────────────────────────

# Width of a label that may hold [[blanks]] (student copy: blank boxes).
sub st_w {
    my ($s, $fs) = @_; my $w = 0;
    for my $seg (grep { $_ ne '' } split /(\[\[.*?\]\])/, $s // '') {
        $w += $seg =~ /^\[\[(.*)\]\]$/ ? ($KEY ? tw($1, $fs) : max(30, tw($1, $fs) + 16)) : tw($seg, $fs);
    }
    return $w;
}

# levelling: data="2,5,3,6" labels="G1;G2;G3;G4" after=1 meanline=1 meanlabel="mean = [[4]]"
# beforelabel afterlabel arrowlabel="share out" cell=16 title fill=accent
# Towers of cubes for the mean. after=1 draws the towers evened out, each the mean tall.
sub draw_levelling {
    my ($a) = @_;
    my @d = map { num($_) // 0 } list($a->{data});
    my @lab = list($a->{labels}, qr/\s*;\s*/);
    my $n = @d || 1;
    my $c = $a->{cell} // 16;
    my $mean = (sum(@d) // 0) / $n;
    my $top = max(@d, 1);
    my $fill = 'dg-fill-' . ($a->{fill} // 'accent');
    my $col = max($c + 12, map { tw(plain($_), 11.5) + 8 } @lab);
    my $mt = defined $a->{title} ? 30 : 12;
    my $base = $mt + $top * $c;
    my $pw = $n * $col;
    my $b = '';
    my $panel = sub {
        my ($x0, $hs, $line, $mlab) = @_;
        for my $i (0 .. $n - 1) {
            my $x = $x0 + $i * $col + ($col - $c) / 2;
            my $h = $hs->[$i];
            my $k = 0;
            for (; $k + 1 <= $h + 1e-9; $k++) { $b .= rect($x, $base - ($k + 1) * $c, $c, $c, $fill); }
            my $part = $h - $k;
            $b .= rect($x, $base - $k * $c - $part * $c, $c, $part * $c, $fill) if $part > 0.01;
            $b .= T($x + $c / 2, $base + 15, $lab[$i], anchor => 'middle', cls => 'dg-label-sm') if defined $lab[$i];
        }
        $b .= line($x0 - 4, $base, $x0 + $pw + 4, $base, 'dg-line');
        if ($line) {
            my $y = $base - $mean * $c;
            $b .= line($x0 - 6, $y, $x0 + $pw + 6, $y, 'dg-dashed');
            $b .= T($x0 + $pw + 10, $y + 4, $mlab, cls => 'dg-label-accent') if defined $mlab;
        }
    };
    my $x0 = 14;
    my $ml = $a->{meanlabel};
    my $mlw = defined $ml ? st_w($ml, 12.5) + 14 : 0;
    $panel->($x0, \@d, $a->{meanline}, $a->{after} ? undef : $ml);
    my $W = $x0 + $pw + ($a->{after} ? 0 : $mlw) + 10;
    my $by = $base + (@lab ? 34 : 20);
    $b .= T($x0 + $pw / 2, $by, $a->{beforelabel}, anchor => 'middle', cls => 'dg-label') if defined $a->{beforelabel};
    if ($a->{after}) {
        my $ax = $x0 + $pw + 16;
        my $al = $a->{arrowlabel} // 'share out';
        my $aw = max(60, tw($al, 11.5) + 10);
        $b .= arrow($ax, $base - $top * $c / 2, $ax + $aw, $base - $top * $c / 2, 'accent');
        $b .= T($ax + $aw / 2, $base - $top * $c / 2 - 8, $al, anchor => 'middle', cls => 'dg-label-sm');
        my $x1 = $ax + $aw + 16;
        $panel->($x1, [($mean) x $n], 1, $ml);
        $b .= T($x1 + $pw / 2, $by, $a->{afterlabel}, anchor => 'middle', cls => 'dg-label') if defined $a->{afterlabel};
        $W = $x1 + $pw + $mlw + 10;
    }
    $b .= T($W / 2, 18, $a->{title}, anchor => 'middle', cls => 'dg-title') if defined $a->{title};
    my $H = $by + ((defined $a->{beforelabel} || defined $a->{afterlabel}) ? 8 : -6);
    return (svg($W, $H, 'Towers of cubes: ' . join(', ', map { (defined $lab[$_] ? plain($lab[$_]) . ' ' : '') . fmt($d[$_]) } 0 .. $#d)
        . ($a->{after} ? '. Evened out, each tower is the same height.' : '') . (defined $ml ? ' ' . plain($ml) : ''), $b));
}

# numstrip: rows="18,7,25 | 7,18,25" labels="As given;In order" notes=";median = [[18]]"
# ring="2:2" (row:positions, rings the middle) hot="1:3,5" (row:positions, shaded) cell title
# A strip of numbers in boxes, one strip per row; [[blanks]] allowed in cells and notes.
sub draw_numstrip {
    my ($a) = @_;
    my @rows = map { [list($_)] } list($a->{rows}, qr/\s*\|\s*/);
    my @lab = list($a->{labels}, qr/\s*;\s*/);
    my @notes = list($a->{notes}, qr/\s*;\s*/);
    my (%ring, %hot);
    for my $r (items($a->{ring})) { $ring{"$r->[0]:$_"} = 1 for list($r->[1]); }
    for my $r (items($a->{hot}))  { $hot{"$r->[0]:$_"} = 1 for list($r->[1]); }
    my $cw = $a->{cell} // max(32, map { st_w($_, 15) + 12 } map { @$_ } @rows);
    my $lw = @lab ? max(map { tw(plain($_), 12.5) } @lab) + 14 : 0;
    my $mt = defined $a->{title} ? 30 : 8;
    my $rh = 46;
    my $x0 = 8 + $lw;
    my $b = '';
    my $wmax = 0;
    for my $r (0 .. $#rows) {
        my $y = $mt + $r * $rh + 6;
        my @v = @{ $rows[$r] };
        $b .= T(8, $y + 20, $lab[$r], cls => 'dg-label') if defined $lab[$r];
        for my $i (0 .. $#v) {
            my $x = $x0 + $i * $cw;
            my $k = ($r + 1) . ':' . ($i + 1);
            $b .= rect($x, $y, $cw, 30, $hot{$k} ? 'dg-fill-hot' : 'dg-boundary');
            $b .= T($x + $cw / 2, $y + 20, $v[$i], anchor => 'middle', cls => 'dg-math');
            $b .= sprintf('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" class="dg-accent"/>', $x + $cw / 2, $y + 15, $cw / 2 + 3, 20) if $ring{$k};
        }
        my $xe = $x0 + @v * $cw;
        my $nw = 0;
        if (defined $notes[$r] && $notes[$r] ne '') { $b .= T($xe + 14, $y + 20, $notes[$r], cls => 'dg-label-accent'); $nw = st_w($notes[$r], 12.5) + 14; }
        $wmax = max($wmax, $xe + $nw + 10);
    }
    $b .= T($wmax / 2, 18, $a->{title}, anchor => 'middle', cls => 'dg-title') if defined $a->{title};
    return (svg($wmax, $mt + @rows * $rh + 6, 'Number strips. ' . join('. ', map { (defined $lab[$_] ? plain($lab[$_]) . ': ' : '') . join(', ', map { plain($_) } @{ $rows[$_] }) . (defined $notes[$_] && $notes[$_] ne '' ? ' (' . plain($notes[$_]) . ')' : '') } 0 .. $#rows), $b));
}

# dotplot2: data="…" data2="…" min max step label="Class A" label2="Class B" marks="mean:3;median:3"
# marks2="…" highlight highlight2 xlabel title cell
# Two dot plots stacked on the same scale, to compare two samples. A mark value
# in [[ ]] shows only its label (a blank) on the student copy, not its line.
sub draw_dotplot2 {
    my ($a) = @_;
    my @sets = ([ [map { num($_) } list($a->{data})], $a->{label}, $a->{marks}, $a->{highlight} ],
                [ [map { num($_) } list($a->{data2})], $a->{label2}, $a->{marks2}, $a->{highlight2} ]);
    my @all = map { @{ $_->[0] } } @sets;
    my ($min, $max) = ($a->{min} // min(@all), $a->{max} // max(@all));
    my $step = $a->{step} // 1;
    my $nn = ($max - $min) / $step;
    my $cell = $a->{cell} // max(22, min(42, int(420 / max($nn, 1))));
    my $ml = 30;
    my $X = sub { $ml + ($_[0] - $min) / $step * $cell };
    my $W = $X->($max) + 30;
    my $y = defined $a->{title} ? 30 : 6;
    my $b = '';
    $b .= T($W / 2, 18, $a->{title}, anchor => 'middle', cls => 'dg-title') if defined $a->{title};
    my @aria;
    for my $s (@sets) {
        my ($d, $lab, $marks, $hl) = @$s;
        my %cnt; $cnt{fmt($_)}++ for @$d;
        my $top = max(values %cnt) || 1;
        my %hi = map { fmt(num($_)) => 1 } list($hl);
        $b .= T(8, $y + 14, $lab, cls => 'dg-label-accent') if defined $lab;
        $y += 22;
        my $base = $y + $top * 18 + 4;
        $b .= line($X->($min) - 12, $base, $X->($max) + 12, $base, 'dg-line');
        for (my $v = $min; $v <= $max + 1e-9; $v += $step) {
            $b .= line($X->($v), $base, $X->($v), $base + 6, 'dg-line') . T($X->($v), $base + 20, fmt($v), anchor => 'middle', cls => 'dg-label-sm');
        }
        my %seen;
        for my $v (grep { !$seen{fmt($_)}++ } @$d) {
            my $c = $cnt{fmt($v)};
            $b .= circ($X->($v), $base - 10 - 18 * $_, 6.5, $hi{fmt($v)} ? 'dg-fill-hot' : 'dg-fill-accent') for 0 .. $c - 1;
        }
        my $k = 0; my @ml;
        for my $m (items($marks)) {
            my $blank = $m->[1] =~ /\[\[/;
            my $v = num($m->[1]);
            my $lx = $ml - 22;
            if (defined $v && (!$blank || $KEY)) {
                my $x = $X->($v);
                $b .= sprintf('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" class="dg-dashed"/>', $x, $y - 4, $x, $base + 26 + 14 * $k);
                $lx = $x + 4;
            }
            $b .= T($lx, $base + 38 + 14 * $k, "$m->[0] = $m->[1]", cls => 'dg-label-accent');
            push @ml, plain("$m->[0] = $m->[1]");
            $k++;
        }
        push @aria, (defined $lab ? plain($lab) . ': ' : '') . join(', ', map { fmt($_) } numsort(@$d)) . (@ml ? ' (' . join(', ', @ml) . ')' : '');
        $y = $base + 28 + 14 * $k + ($k ? 10 : 0);
    }
    $b .= T($W / 2, $y + 6, $a->{xlabel}, anchor => 'middle', cls => 'dg-label') if defined $a->{xlabel};
    $y += defined $a->{xlabel} ? 14 : 0;
    return (svg($W, $y, 'Two dot plots on the same scale. ' . join('. ', @aria), $b));
}

# hat: names="Ava,Sam,Noor,…" (slips in the hat) out="Leo;Mia;[[ ]]" (slips drawn out)
# label="all 120 names" outlabel="the sample" title
# Names (or numbers) on slips of paper in a hat, a few drawn out: simple random sampling.
sub draw_hat {
    my ($a) = @_;
    my @in = list($a->{names});
    my @out = list($a->{out}, qr/\s*;\s*/);
    my $mt = defined $a->{title} ? 30 : 10;
    my ($cx, $y0) = (100, $mt + 58);
    my $b = '';
    # slips sticking out of the hat
    my @ang = (-8, 6, -4, 9, -10);
    my @dx = (-27, 27, -54, 0, 54);
    my @dy = (-42, -42, -22, -22, -22);
    for my $i (0 .. min($#in, 4)) {
        my ($sx, $sy) = ($cx + $dx[$i], $y0 + $dy[$i]);
        $b .= sprintf('<g transform="rotate(%d %.1f %.1f)">', $ang[$i], $sx, $sy) . rect($sx - 23, $sy - 11, 46, 20, 'dg-boundary', 2)
            . T($sx, $sy + 3, $in[$i], anchor => 'middle', cls => 'dg-label-sm') . '</g>';
    }
    # the hat: brim, crown, band
    $b .= sprintf('<path d="M%.1f,%.1f L%.1f,%.1f L%.1f,%.1f L%.1f,%.1f Z" class="dg-fill-cold"/>', $cx - 62, $y0, $cx + 62, $y0, $cx + 52, $y0 + 86, $cx - 52, $y0 + 86);
    $b .= sprintf('<ellipse cx="%.1f" cy="%.1f" rx="62" ry="11" class="dg-boundary"/>', $cx, $y0);
    $b .= rect($cx - 59, $y0 + 18, 118, 14, 'dg-fill-hot');
    $b .= sprintf('<ellipse cx="%.1f" cy="%.1f" rx="84" ry="10" class="dg-fill-cold"/>', $cx, $y0 + 88);
    $b .= T($cx, $y0 + 62, $a->{label}, anchor => 'middle', cls => 'dg-label') if defined $a->{label};
    my $W = 200; my $H = $y0 + 106;
    if (@out) {
        my $ax = $cx + 92;
        $b .= arrow($ax, $y0 + 20, $ax + 46, $y0 + 20, 'accent');
        $b .= T($ax + 23, $y0 + 10, 'draw', anchor => 'middle', cls => 'dg-label-sm');
        my $sw = max(54, map { st_w($_, 12) + 16 } @out);
        my $ox = $ax + 58;
        my $sy = $y0 + 20 - (@out * 26) / 2;
        $sy = $mt + 4 if $sy < $mt + 4;
        for my $i (0 .. $#out) {
            $b .= rect($ox, $sy + $i * 26, $sw, 22, 'dg-fill-sun', 2) . T($ox + $sw / 2, $sy + $i * 26 + 15, $out[$i], anchor => 'middle', cls => 'dg-label');
        }
        my $ly = $sy + @out * 26 + 14;
        $b .= T($ox + $sw / 2, $ly, $a->{outlabel}, anchor => 'middle', cls => 'dg-label-accent') if defined $a->{outlabel};
        $W = max($ox + $sw + 10, $ox + $sw / 2 + tw(plain($a->{outlabel} // ''), 12.5) / 2 + 10);
        $H = max($H, $ly + 8);
    }
    $b .= T($W / 2, 18, $a->{title}, anchor => 'middle', cls => 'dg-title') if defined $a->{title};
    return (svg($W, $H, 'Names on slips of paper in a hat' . (defined $a->{label} ? ' (' . plain($a->{label}) . ')' : '')
        . (@out ? '. Drawn out: ' . join(', ', map { plain($_) } @out) : ''), $b));
}


# ── Grade 7 probability types ───────────────────────────────────────────

my %PIPS = (1 => [[.5, .5]], 2 => [[.27, .27], [.73, .73]], 3 => [[.27, .27], [.5, .5], [.73, .73]],
            4 => [[.27, .27], [.73, .27], [.27, .73], [.73, .73]], 5 => [[.27, .27], [.73, .27], [.5, .5], [.27, .73], [.73, .73]],
            6 => [[.28, .24], [.28, .5], [.28, .76], [.72, .24], [.72, .5], [.72, .76]]);

# dice: values="1,2,3,4,5,6" hot="5,6" size=34 labels="…;…" label title
sub draw_dice {
    my ($a) = @_;
    my @v = list($a->{values} // '1,2,3,4,5,6');
    my %hot = map { $_ => 1 } list($a->{hot});
    my @lab = list($a->{labels}, qr/\s*;\s*/);
    my $s = $a->{size} // 34;
    my $gap = max(10, @lab ? max(map { st_w($_, 11) } @lab) - $s + 6 : 0);
    my $mt = defined $a->{title} ? 28 : 6;
    my $b = '';
    my $x = 8;
    for my $i (0 .. $#v) {
        my $val = $v[$i];
        $b .= rect($x, $mt, $s, $s, $hot{$val} ? 'dg-fill-sun' : 'dg-fill-soft', 6) . rect($x, $mt, $s, $s, 'dg-outline', 6);
        if ($PIPS{$val}) { $b .= circ($x + $_->[0] * $s, $mt + $_->[1] * $s, max(2.2, $s * 0.085), 'dg-point') for @{ $PIPS{$val} }; }
        else { $b .= T($x + $s / 2, $mt + $s / 2 + 5, $val, anchor => 'middle', cls => 'dg-label'); }
        $b .= T($x + $s / 2, $mt + $s + 16, $lab[$i], anchor => 'middle', cls => 'dg-label-sm') if defined $lab[$i] && $lab[$i] ne '';
        $x += $s + $gap;
    }
    my $W = max($x - $gap + 8, tw(plain($a->{label} // ''), 12) + 16, tw($a->{title} // '', 13) + 16);
    my $H = $mt + $s + (@lab ? 22 : 6);
    if (defined $a->{label}) { $b .= T($W / 2, $H + 12, $a->{label}, anchor => 'middle', cls => 'dg-label-accent'); $H += 20; }
    $b .= T($W / 2, 18, $a->{title}, anchor => 'middle', cls => 'dg-title') if defined $a->{title};
    return (svg($W, $H, 'Die faces: ' . join(', ', map { plain($_) } @v) . (%hot ? '. Shaded: ' . join(', ', sort keys %hot) : ''), $b));
}

# bag: counters="red:3;blue:2;yellow:1" letters=0 out="red" outlabel label title cols
sub draw_bag {
    my ($a) = @_;
    my @c = items($a->{counters});
    my @all;
    for my $q (@c) { push @all, ($q->[0]) x (num($q->[1]) // 1); }
    my $n = @all;
    my $cols = $a->{cols} // ($n <= 6 ? 3 : $n <= 12 ? 4 : $n <= 20 ? 5 : 6);
    my $rows = ceil($n / $cols) || 1;
    my $d = 26;
    my $mt = defined $a->{title} ? 28 : 6;
    my ($x0, $y0) = (10, $mt);
    my $bw = $cols * $d + 28;
    my $neck = 20;
    my $bh = $rows * $d + 26;
    my $b = '';
    # neck (gathered top) and tie, then the body
    $b .= poly('dg-fill-earth', $x0 + $bw * 0.3, $y0 + $neck + 2, $x0 + $bw * 0.22, $y0, $x0 + $bw * 0.78, $y0, $x0 + $bw * 0.7, $y0 + $neck + 2);
    $b .= rect($x0, $y0 + $neck, $bw, $bh, 'dg-fill-earth', 18);
    $b .= rect($x0 + $bw * 0.28, $y0 + $neck - 6, $bw * 0.44, 8, 'dg-fill-hot', 3);
    my $letters = $a->{letters} // 1;
    for my $k (0 .. $n - 1) {
        my ($r, $q) = (floor($k / $cols), $k % $cols);
        my $inrow = $r == $rows - 1 ? $n - $r * $cols : $cols;
        my $cx = $x0 + 14 + ($cols - $inrow) * $d / 2 + $q * $d + $d / 2;
        my $cy = $y0 + $neck + 14 + $r * $d + $d / 2;
        my $cls = $COLOUR{ lc $all[$k] } // 'dg-fill-soft';
        $b .= circ($cx, $cy, 11, 'dg-boundary') . circ($cx, $cy, 11, $cls);
        $b .= T($cx, $cy + 4, uc substr($all[$k], 0, 1), anchor => 'middle', cls => 'dg-label-sm') if $letters;
    }
    my $W = $x0 + $bw + 10;
    my $H = $y0 + $neck + $bh + 6;
    if (defined $a->{out}) {
        my $ax = $x0 + $bw + 8;
        my $ay = $y0 + $neck + $bh / 2;
        $b .= arrow($ax, $ay, $ax + 40, $ay, 'accent');
        $b .= T($ax + 20, $ay - 9, 'draw', anchor => 'middle', cls => 'dg-label-sm');
        my $cx = $ax + 60;
        my $cls = $COLOUR{ lc $a->{out} } // 'dg-fill-soft';
        if ($a->{out} =~ /\[\[|\?/) { $b .= circ($cx, $ay, 13, 'dg-dashed') . T($cx, $ay + 4, $a->{out} =~ /\?/ ? '?' : $a->{out}, anchor => 'middle', cls => 'dg-label'); }
        else { $b .= circ($cx, $ay, 13, 'dg-boundary') . circ($cx, $ay, 13, $cls) . T($cx, $ay + 4, uc substr($a->{out}, 0, 1), anchor => 'middle', cls => 'dg-label-sm'); }
        $b .= T($cx, $ay + 30, $a->{outlabel}, anchor => 'middle', cls => 'dg-label-sm') if defined $a->{outlabel};
        $W = max($W, $cx + 20, $cx + tw(plain($a->{outlabel} // ''), 11) / 2 + 8);
    }
    if (defined $a->{label}) { $b .= T($x0 + $bw / 2, $H + 12, $a->{label}, anchor => 'middle', cls => 'dg-label-accent'); $H += 20;
        $W = max($W, $x0 + $bw / 2 + st_w($a->{label}, 11) / 2 + 8); }
    if (defined $a->{title}) { $W = max($W, tw($a->{title}, 13) + 20); $b .= T($W / 2, 18, $a->{title}, anchor => 'middle', cls => 'dg-title'); }
    return (svg($W, $H, 'A bag of counters: ' . join(', ', map { "$_->[1] $_->[0]" } @c) . ". $n in all." . (defined $a->{out} ? ' One is drawn out.' : ''), $b));
}

# spin: sections="red:2;blue:1;yellow:1" size=150 guides=1 arrow=0 label title
sub draw_spin {
    my ($a) = @_;
    my @sec = items($a->{sections});
    my @w = map { num($_->[1]) // 1 } @sec;
    my $tot = sum(@w) || 1;
    my $S = $a->{size} // 150;
    my $r = $S / 2 - 6;
    my $mt = defined $a->{title} ? 28 : 4;
    my $W = max($S + 8, tw(plain($a->{label} // ''), 11) + 16, tw($a->{title} // '', 13) + 16);
    my ($cx, $cy) = ($W / 2, $mt + $S / 2);
    my $b = '';
    my $ang = -$PI / 2;
    my @lab;
    for my $i (0 .. $#sec) {
        my $f = $w[$i] / $tot;
        my $a2 = $ang + $f * 2 * $PI;
        my $cls = $COLOUR{ lc $sec[$i][0] } // $WEDGE[$i % @WEDGE];
        if ($f >= 0.999) { $b .= circ($cx, $cy, $r, $cls); }
        else {
            $b .= sprintf('<path d="M%.1f,%.1f L%.1f,%.1f A%.1f,%.1f 0 %d 1 %.1f,%.1f Z" class="%s"/>', $cx, $cy, $cx + $r * cos($ang), $cy + $r * sin($ang), $r, $r, $f > 0.5 ? 1 : 0, $cx + $r * cos($a2), $cy + $r * sin($a2), $cls);
        }
        if ($a->{guides} && $w[$i] > 1 && $w[$i] == int($w[$i])) {
            for my $g (1 .. $w[$i] - 1) { my $ga = $ang + $g * 2 * $PI / $tot; $b .= sprintf('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" class="dg-dashed"/>', $cx, $cy, $cx + $r * cos($ga), $cy + $r * sin($ga)); }
        }
        if ($a->{guides} && $w[$i] > 1 && $w[$i] == int($w[$i])) {
            # one label in each equal piece
            for my $g (0 .. $w[$i] - 1) { my $m = $ang + ($g + 0.5) * 2 * $PI / $tot; push @lab, [$cx + $r * 0.6 * cos($m), $cy + $r * 0.6 * sin($m) + 4, $sec[$i][0]]; }
        } else {
            my $mid = ($ang + $a2) / 2;
            push @lab, [$cx + $r * 0.6 * cos($mid), $cy + $r * 0.6 * sin($mid) + 4, $sec[$i][0]];
        }
        $ang = $a2;
    }
    $b .= T($_->[0], $_->[1], $_->[2], anchor => 'middle', cls => 'dg-label') for @lab;
    $b .= circ($cx, $cy, $r, 'dg-outline');
    unless (defined $a->{arrow} && !$a->{arrow}) { $b .= arrow($cx, $cy, $cx + $r * 0.34 * cos(-0.35), $cy + $r * 0.34 * sin(-0.35), 'plain') . circ($cx, $cy, 4, 'dg-point'); }
    my $H = $mt + $S + 2;
    if (defined $a->{label}) { $b .= T($W / 2, $H + 12, $a->{label}, anchor => 'middle', cls => 'dg-label-accent'); $H += 20; }
    $b .= T($W / 2, 18, $a->{title}, anchor => 'middle', cls => 'dg-title') if defined $a->{title};
    my $eq = (grep { $_ != $w[0] } @w) ? 'unequal' : 'equal';
    return (svg($W, $H, "Spinner with $eq parts: " . join(', ', map { plain($_->[0]) . (($eq eq 'unequal') ? ' (' . fmt(100 * (num($_->[1]) // 1) / $tot) . '%)' : '') } @sec), $b));
}

# flips: items="H,H,T,[[ ]]" kind=coin|card hot="1,3" under="1st;2nd;…" label title
sub draw_flips {
    my ($a) = @_;
    my @it = list($a->{items}, qr/\s*,\s*/);
    my %hot = map { $_ => 1 } list($a->{hot});
    my @under = list($a->{under}, qr/\s*;\s*/);
    my $card = ($a->{kind} // 'coin') eq 'card';
    my ($iw, $ih) = $card ? (34, 48) : (34, 34);
    my $slot = max($iw + 10, @under ? max(map { tw($_, 11) } @under) + 8 : 0);
    my $mt = defined $a->{title} ? 28 : 6;
    my $b = '';
    my $x = 8;
    for my $i (0 .. $#it) {
        my $t = $it[$i];
        my $cx = $x + $slot / 2;
        my $blank = $t =~ /\[\[/ || $t eq '?';
        my $cls = $blank ? 'dg-dashed' : $hot{$i + 1} ? 'dg-fill-sun' : 'dg-fill-soft';
        if ($card) { $b .= rect($cx - $iw / 2, $mt, $iw, $ih, $cls, 4); $b .= rect($cx - $iw / 2, $mt, $iw, $ih, 'dg-outline', 4) unless $blank; }
        else { $b .= circ($cx, $mt + $ih / 2, $iw / 2, $cls); $b .= circ($cx, $mt + $ih / 2, $iw / 2 - 3, 'dg-outline') unless $blank; }
        my $tc = $t =~ /[♥♦]/ ? 'dg-label-hot' : 'dg-label';
        $b .= T($cx, $mt + $ih / 2 + 5, $t, anchor => 'middle', cls => $tc) unless $t eq '';
        $b .= T($cx, $mt + $ih + 15, $under[$i], anchor => 'middle', cls => 'dg-label-sm') if defined $under[$i] && $under[$i] ne '';
        $x += $slot;
    }
    my $W = max($x + 8, tw(plain($a->{label} // ''), 12) + 16, tw($a->{title} // '', 13) + 16);
    my $H = $mt + $ih + (@under ? 22 : 6);
    if (defined $a->{label}) { $b .= T($W / 2, $H + 12, $a->{label}, anchor => 'middle', cls => 'dg-label-accent'); $H += 20; }
    $b .= T($W / 2, 18, $a->{title}, anchor => 'middle', cls => 'dg-title') if defined $a->{title};
    return (svg($W, $H, ($card ? 'Cards: ' : 'Coin flips: ') . join(', ', map { plain($_) } @it), $b));
}

# trials: data="10:0.7;50:0.56" theory=0.5 theorylabel ymin ymax ystep percent=1 xlabel ylabel title width
sub draw_trials {
    my ($a) = @_;
    my @d = items($a->{data});
    my ($ymin, $ymax) = ($a->{ymin} // 0, $a->{ymax} // 1);
    my $ystep = $a->{ystep} // 0.1;
    my $pc = $a->{percent};
    my $tl = $a->{theorylabel} // (defined $a->{theory} ? 'theory' : '');
    my ($ml, $mt) = (52, defined $a->{title} ? 32 : 12);
    my $mr = max(20, st_w($tl, 11) + 14);
    my $gh = $a->{height} // 160;
    my $W = $a->{width} // 440;
    my $gw = $W - $ml - $mr;
    my $n = @d || 1;
    my $X = sub { $ml + ($_[0] + 0.5) / $n * $gw };
    my $Y = sub { $mt + $gh - ($_[0] - $ymin) / (($ymax - $ymin) || 1) * $gh };
    my $b = '';
    for (my $t = $ymin; $t <= $ymax + 1e-9; $t += $ystep) {
        $b .= line($ml, $Y->($t), $ml + $gw, $Y->($t), 'dg-grid');
        my $k = ($t - $ymin) / ($a->{yevery} // 2 * $ystep);
        $b .= T($ml - 6, $Y->($t) + 4, $pc ? fmt(100 * $t) . '%' : fmt($t), anchor => 'end', cls => 'dg-label-sm') if abs($k - sprintf('%.0f', $k)) < 1e-6;
    }
    $b .= line($ml, $mt - 4, $ml, $mt + $gh, 'dg-line') . line($ml, $mt + $gh, $ml + $gw + 6, $mt + $gh, 'dg-line');
    if (defined $a->{theory}) {
        my $ty = $Y->(num($a->{theory}));
        $b .= sprintf('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" class="dg-dashed"/>', $ml, $ty, $ml + $gw, $ty);
        $b .= T($ml + $gw + 6, $ty + 4, $tl, cls => 'dg-label-accent');
    }
    my @pts;
    for my $i (0 .. $#d) {
        $b .= T($X->($i), $mt + $gh + 16, $d[$i][0], anchor => 'middle', cls => 'dg-label-sm');
        my $v = num($d[$i][1]);
        push @pts, [$X->($i), $Y->($v)] if defined $v && $d[$i][1] !~ /\[\[/;
    }
    $b .= '<path d="M' . join(' L', map { sprintf('%.1f,%.1f', @$_) } @pts) . '" class="dg-accent"/>' if @pts > 1;
    $b .= circ(@$_, 4, 'dg-point-accent') for @pts;
    my $H = $mt + $gh + 24;
    if (defined $a->{xlabel}) { $b .= T($ml + $gw / 2, $H + 10, $a->{xlabel}, anchor => 'middle', cls => 'dg-label'); $H += 20; }
    if (defined $a->{ylabel}) { $b .= sprintf('<g transform="translate(13,%.1f) rotate(-90)">', $mt + $gh / 2) . T(0, 0, $a->{ylabel}, anchor => 'middle', cls => 'dg-label-sm') . '</g>'; }
    $b .= T($ml + $gw / 2, 20, $a->{title}, anchor => 'middle', cls => 'dg-title') if defined $a->{title};
    return (svg($W, $H, 'Line graph of experimental probability as the number of trials grows: ' . join(', ', map { plain("$_->[0] trials: $_->[1]") } @d)
        . (defined $a->{theory} ? '. Dashed line at the theoretical probability, ' . plain($tl) : ''), $b));
}

1;
