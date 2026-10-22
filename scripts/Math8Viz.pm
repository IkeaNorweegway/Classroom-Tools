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
    coord      => 'xmin xmax ymin ymax xstep ystep xevery yevery xlabel ylabel points="x,y:label;…" line=1 dashed=1 width',
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

1;
