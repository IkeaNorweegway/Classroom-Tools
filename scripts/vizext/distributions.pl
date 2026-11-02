package Math8Viz;
# Math 8 Distributions & Circle Graphs (topic 11): histogram, double bar graph,
# distribution shape sketch, circle graph with degree labels.
use strict;
use warnings;
use utf8;
use POSIX qw(ceil);
use List::Util qw(max min sum);
our %DOC;
our $KEY;

my $DPI = 3.14159265358979;

$DOC{dihist}   = 'data="0–9:3;10–19:7;20–29:5" (interval:frequency; bars touch) edges="0,10,20,30" (label the bar edges instead of the intervals) ymax ystep title xlabel ylabel="frequency" values=1 highlight="10–19" empty=1 (axes only on the student copy; bars on the key) width';
$DOC{didouble} = 'cats="Mon;Tue;Wed" data="3,5,4" data2="4,6,2" label label2 (series names in a key above) ymax ystep title xlabel ylabel values=1 (double bar graph; gaps between groups)';
$DOC{dishape}  = 'shape=symmetric|left|right|uniform|bimodal or heights="1,3,5" bars=1 curve=1 marks=1 (mean and median lines, worked out from the bars) meanlabel medianlabel tail=1 (labels the tail) title label (under the graph) width';
$DOC{dipie}    = 'data="Bus:40;Walk:25;Car:35" (percents, or counts: shares are worked out) show=pct|deg|both|count|none labels="Bus:[[144°]];…" (inner label for a sector) title r=100 arc="Bus" (draws the centre angle of that sector) total (count in the whole, shown under the title)';

sub di_steps {
    my ($m) = @_;
    my $st = $m <= 10 ? 1 : $m <= 20 ? 2 : $m <= 50 ? 5 : $m <= 100 ? 10 : $m <= 200 ? 20 : $m <= 500 ? 50 : 100;
    return ($st, ceil($m / $st) * $st);
}

# Frame with gridlines and a y axis. Returns (svg, Y-sub).
sub di_axes {
    my ($ml, $mt, $gw, $gh, $ymax, $ystep) = @_;
    my $Y = sub { $mt + $gh - $_[0] / ($ymax || 1) * $gh };
    my $b = '';
    for (my $t = 0; $t <= $ymax + 1e-9; $t += $ystep) {
        $b .= line($ml, $Y->($t), $ml + $gw, $Y->($t), 'dg-grid');
        $b .= T($ml - 6, $Y->($t) + 4, fmt($t), anchor => 'end', cls => 'dg-label-sm');
    }
    $b .= line($ml, $mt - 4, $ml, $mt + $gh, 'dg-line') . line($ml, $mt + $gh, $ml + $gw + 8, $mt + $gh, 'dg-line');
    return ($b, $Y);
}

sub di_ylabel {
    my ($s, $mt, $gh) = @_;
    return '' unless defined $s && $s ne '';
    return sprintf('<g transform="translate(14,%.1f) rotate(-90)">', $mt + $gh / 2) . T(0, 0, $s, anchor => 'middle', cls => 'dg-label') . '</g>';
}

sub draw_dihist {
    my ($a) = @_;
    my @d = items($a->{data});
    my @v = map { num($_->[1]) // 0 } @d;
    my $n = @d;
    my ($st0, $ym0) = di_steps(max(@v, 1));
    my $ymax = $a->{ymax} // $ym0;
    my $ystep = $a->{ystep} // $st0;
    my ($ml, $mt, $gh) = (58, ($a->{title} ? 34 : 16) + ($a->{values} ? 10 : 0), $a->{height} // 190);
    my $gw = $a->{width} // min(480, max(240, $n * 60));
    my $bw = $gw / max($n, 1);
    my ($b, $Y) = di_axes($ml, $mt, $gw, $gh, $ymax, $ystep);
    $b = T($ml + $gw / 2, 20, $a->{title}, anchor => 'middle', cls => 'dg-title') . $b if $a->{title};
    my %hi = map { $_ => 1 } list($a->{highlight}, qr/\s*;\s*/);
    my $show = !($a->{empty} && !$KEY);
    for my $i (0 .. $n - 1) {
        my $x = $ml + $i * $bw;
        if ($show) {
            my $top = $Y->($v[$i]);
            $b .= rect($x, $top, $bw, $mt + $gh - $top, $hi{$d[$i][0]} ? 'dg-fill-hot' : 'dg-fill-accent') if $v[$i] > 0;
            $b .= T($x + $bw / 2, $top - 5, $d[$i][1], anchor => 'middle', cls => 'dg-label-sm') if $a->{values};
        }
        $b .= T($x + $bw / 2, $mt + $gh + 16, $d[$i][0], anchor => 'middle', cls => 'dg-label-sm') unless $a->{edges};
    }
    if ($a->{edges}) {
        my @e = list($a->{edges});
        for my $j (0 .. $#e) {
            my $x = $ml + $j * $bw;
            $b .= line($x, $mt + $gh, $x, $mt + $gh + 4, 'dg-line') . T($x, $mt + $gh + 17, $e[$j], anchor => 'middle', cls => 'dg-label-sm');
        }
    }
    $b .= T($ml + $gw / 2, $mt + $gh + 36, $a->{xlabel}, anchor => 'middle', cls => 'dg-label') if $a->{xlabel};
    $b .= di_ylabel($a->{ylabel} // 'frequency', $mt, $gh);
    my $W = $ml + $gw + 24;
    my $H = $mt + $gh + ($a->{xlabel} ? 48 : 28);
    my $aria = 'Histogram' . ($a->{title} ? ": $a->{title}" : '') . '. ' . join(', ', map { plain("$_->[0]: $_->[1]") } @d) . '.';
    return (svg($W, $H, $aria, $b));
}

sub draw_didouble {
    my ($a) = @_;
    my @c = list($a->{cats}, qr/\s*;\s*/);
    my @v1 = list($a->{data});
    my @v2 = list($a->{data2});
    my $n = @c;
    my ($st0, $ym0) = di_steps(max(1, map { num($_) // 0 } @v1, @v2));
    my $ymax = $a->{ymax} // $ym0;
    my $ystep = $a->{ystep} // $st0;
    my ($ml, $gh) = (58, $a->{height} // 180);
    my $mt = ($a->{title} ? 34 : 12) + 26 + ($a->{values} ? 10 : 0);
    my $slot = $a->{slot} // max(64, min(96, int(460 / max($n, 1))));
    my $gw = $n * $slot;
    my ($b, $Y) = di_axes($ml, $mt, $gw, $gh, $ymax, $ystep);
    $b = T($ml + $gw / 2, 20, $a->{title}, anchor => 'middle', cls => 'dg-title') . $b if $a->{title};
    # key above the plot
    my $ky = $mt - 22;
    my $l1 = $a->{label} // 'Set 1';
    my $l2 = $a->{label2} // 'Set 2';
    my $kw = 18 + tw(plain($l1), 12) + 24 + 18 + tw(plain($l2), 12);
    my $kx = $ml + $gw / 2 - $kw / 2;
    $b .= rect($kx, $ky - 10, 12, 12, 'dg-fill-accent') . T($kx + 18, $ky, $l1, cls => 'dg-label');
    my $kx2 = $kx + 18 + tw(plain($l1), 12) + 24;
    $b .= rect($kx2, $ky - 10, 12, 12, 'dg-fill-sun') . T($kx2 + 18, $ky, $l2, cls => 'dg-label');
    my $bw = $slot * 0.32;
    for my $i (0 .. $n - 1) {
        my $cx = $ml + $slot * ($i + 0.5);
        for my $k (0, 1) {
            my $raw = ($k ? $v2[$i] : $v1[$i]) // 0;
            my $val = num($raw) // 0;
            my $x = $k ? $cx : $cx - $bw;
            my $top = $Y->($val);
            $b .= rect($x, $top, $bw, $mt + $gh - $top, $k ? 'dg-fill-sun' : 'dg-fill-accent');
            $b .= T($x + $bw / 2, $top - 5, $raw, anchor => 'middle', cls => 'dg-label-sm') if $a->{values};
        }
        $b .= T($cx, $mt + $gh + 16, $c[$i], anchor => 'middle', cls => 'dg-label-sm');
    }
    $b .= T($ml + $gw / 2, $mt + $gh + 36, $a->{xlabel}, anchor => 'middle', cls => 'dg-label') if $a->{xlabel};
    $b .= di_ylabel($a->{ylabel}, $mt, $gh);
    my $W = max($ml + $gw + 20, $kx + $kw + 10);
    my $H = $mt + $gh + ($a->{xlabel} ? 48 : 28);
    my $aria = 'Double bar graph' . ($a->{title} ? ": $a->{title}" : '') . ". $l1 and $l2. "
        . join(', ', map { plain("$c[$_]: " . ($v1[$_] // '') . ' and ' . ($v2[$_] // '')) } 0 .. $n - 1) . '.';
    return (svg($W, $H, plain($aria), $b));
}

my %SHAPE = (
    symmetric => [1, 2, 4, 6, 7, 6, 4, 2, 1],
    right     => [5, 9, 7, 4, 3, 2, 1.5, 1.2, 1, 0.8, 0.6],
    left      => [0.6, 0.8, 1, 1.2, 1.5, 2, 3, 4, 7, 9, 5],
    uniform   => [5, 5, 5, 5, 5, 5, 5, 5],
    bimodal   => [1, 4, 7, 4, 2, 4, 7, 4, 1],
);

sub draw_dishape {
    my ($a) = @_;
    my $shape = $a->{shape} // 'symmetric';
    my @h = $a->{heights} ? map { num($_) // 0 } list($a->{heights}) : @{ $SHAPE{$shape} || $SHAPE{symmetric} };
    my $n = @h;
    my $gw = $a->{width} // 260;
    my $gh = $a->{height} // 110;
    my ($ml, $mt) = (16, ($a->{title} ? 30 : 8) + ($a->{marks} ? 30 : 6));
    my $bw = $gw / $n;
    my $hm = max(@h) || 1;
    my $Y = sub { $mt + $gh - $_[0] / $hm * $gh };
    my $b = '';
    $b .= T($ml + $gw / 2, 18, $a->{title}, anchor => 'middle', cls => 'dg-title') if $a->{title};
    if ($a->{bars} // 1) {
        for my $i (0 .. $n - 1) { $b .= rect($ml + $i * $bw, $Y->($h[$i]), $bw, $mt + $gh - $Y->($h[$i]), 'dg-fill-accent') if $h[$i] > 0; }
    }
    if ($a->{curve}) {
        my @p = ([$ml, $mt + $gh], map({ [$ml + ($_ + 0.5) * $bw, $Y->($h[$_])] } 0 .. $n - 1), [$ml + $gw, $mt + $gh]);
        my $d = sprintf('M%.1f,%.1f', @{ $p[0] });
        for my $i (1 .. $#p) {
            my ($x0, $y0) = @{ $p[$i - 1] }; my ($x1, $y1) = @{ $p[$i] };
            my $mx = ($x0 + $x1) / 2;
            $d .= sprintf(' C%.1f,%.1f %.1f,%.1f %.1f,%.1f', $mx, $y0, $mx, $y1, $x1, $y1);
        }
        $b .= qq{<path d="$d" class="dg-accent"/>};
    }
    $b .= line($ml, $mt + $gh, $ml + $gw, $mt + $gh, 'dg-line');
    if ($a->{marks}) {
        my $tot = sum(@h) || 1;
        my $mean = sum(map { $h[$_] * ($_ + 0.5) } 0 .. $n - 1) / $tot;
        my ($cum, $med) = (0, $n / 2);
        for my $i (0 .. $n - 1) { if ($cum + $h[$i] >= $tot / 2) { $med = $i + ($tot / 2 - $cum) / ($h[$i] || 1); last; } $cum += $h[$i]; }
        my ($xm, $xd) = ($ml + $mean * $bw, $ml + $med * $bw);
        if (abs($xm - $xd) < 4) {
            $b .= line($xm, $mt - 8, $xm, $mt + $gh, 'dg-dashed');
            $b .= T($xm, $mt - 14, $a->{meanlabel} // 'mean = median', anchor => 'middle', cls => 'dg-label-hot');
        } else {
            my $lm = $xm > $xd;   # mean right of median
            $b .= line($xd, $mt - 22, $xd, $mt + $gh, 'dg-dashed') . line($xm, $mt - 8, $xm, $mt + $gh, 'dg-arrow hot');
            $b .= T($xd + ($lm ? -4 : 4), $mt - 26, $a->{medianlabel} // 'median', anchor => $lm ? 'end' : 'start', cls => 'dg-label');
            $b .= T($xm + ($lm ? 4 : -4), $mt - 11, $a->{meanlabel} // 'mean', anchor => $lm ? 'start' : 'end', cls => 'dg-label-hot');
        }
    }
    if ($a->{tail}) {
        my $tl = $a->{tail} eq '1' ? 'tail' : $a->{tail};
        my $ty = $mt + $gh - 0.28 * $gh;
        if ($shape eq 'right') { $b .= arrow($ml + $gw * 0.62, $ty, $ml + $gw * 0.96, $ty, 'muted') . T($ml + $gw * 0.79, $ty - 7, $tl, anchor => 'middle', cls => 'dg-label-sm'); }
        elsif ($shape eq 'left') { $b .= arrow($ml + $gw * 0.38, $ty, $ml + $gw * 0.04, $ty, 'muted') . T($ml + $gw * 0.21, $ty - 7, $tl, anchor => 'middle', cls => 'dg-label-sm'); }
    }
    my $H = $mt + $gh + 6;
    if (defined $a->{label}) { $b .= T($ml + $gw / 2, $H + 14, $a->{label}, anchor => 'middle', cls => 'dg-label'); $H += 22; }
    my $aria = 'Sketch of a distribution' . ($a->{heights} ? '' : ": $shape") . ($a->{label} ? '. ' . plain($a->{label}) : '') . ($a->{marks} ? '. Mean and median marked.' : '');
    return (svg($ml * 2 + $gw, $H, $aria, $b));
}

sub draw_dipie {
    my ($a) = @_;
    my @d = map { [split /\s*:\s*/, $_] } list($a->{data}, qr/\s*;\s*/);
    my %lab = map { @$_[0, 1] } items($a->{labels});
    my $tot = sum(map { num($_->[1]) // 0 } @d) || 1;
    my $show = $a->{show} // 'pct';
    my $r = $a->{r} // 100;
    my $top = ($a->{title} ? 30 : 6) + (defined $a->{total} ? 18 : 0) + 26;
    my ($cx, $cy) = (220, $top + $r);
    my $b = '';
    $b .= T($cx, 20, $a->{title}, anchor => 'middle', cls => 'dg-title') if $a->{title};
    $b .= T($cx, ($a->{title} ? 38 : 16), $a->{total}, anchor => 'middle', cls => 'dg-label-sm') if defined $a->{total};
    my @WED = ('dg-fill-accent', 'dg-fill-sun', 'dg-fill-water', 'dg-fill-plant', 'dg-fill-hot', 'dg-fill-earth', 'dg-fill-soft', 'dg-fill-cold');
    my $ang = -$DPI / 2;
    my ($minx, $maxx) = ($cx - $r, $cx + $r);
    for my $i (0 .. $#d) {
        my ($name, $raw) = @{ $d[$i] };
        my $f = (num($raw) // 0) / $tot;
        my $a2 = $ang + $f * 2 * $DPI;
        my ($x1, $y1, $x2, $y2) = ($cx + $r * cos($ang), $cy + $r * sin($ang), $cx + $r * cos($a2), $cy + $r * sin($a2));
        $b .= $f >= 0.9999 ? circ($cx, $cy, $r, $WED[0])
            : sprintf('<path d="M%.1f,%.1f L%.1f,%.1f A%d,%d 0 %d 1 %.1f,%.1f Z" class="%s"/>', $cx, $cy, $x1, $y1, $r, $r, $f > 0.5 ? 1 : 0, $x2, $y2, $WED[$i % @WED]);
        if (defined $a->{arc} && $a->{arc} eq $name) {
            my $ar = 22;
            $b .= sprintf('<path d="M%.1f,%.1f A%d,%d 0 %d 1 %.1f,%.1f" class="dg-accent"/>', $cx + $ar * cos($ang), $cy + $ar * sin($ang), $ar, $ar, $f > 0.5 ? 1 : 0, $cx + $ar * cos($a2), $cy + $ar * sin($a2));
        }
        my $mid = ($ang + $a2) / 2;
        my $deg = fmt($f * 360) . '°';
        my $pct = fmt($f * 100) . '%';
        my $inner = exists $lab{$name} ? $lab{$name}
            : $show eq 'deg' ? $deg : $show eq 'both' ? "$pct · $deg" : $show eq 'count' ? $raw : $show eq 'none' ? '' : $pct;
        my $anchor = cos($mid) > 0.2 ? 'start' : cos($mid) < -0.2 ? 'end' : 'middle';
        my ($lx, $ly) = ($cx + ($r + 12) * cos($mid), $cy + ($r + 12) * sin($mid) + 4 + (sin($mid) > 0.8 ? 8 : 0));
        my $small = $f < 0.08 || ($show eq 'both' && $f < 0.16);
        my $outer = $small && $inner ne '' ? "$name ($inner)" : $name;
        $b .= T($lx, $ly, $outer, anchor => $anchor, cls => 'dg-label');
        my $ow = tw(plain($outer), 13) + 16;
        if ($anchor eq 'start') { $maxx = max($maxx, $lx + $ow); } elsif ($anchor eq 'end') { $minx = min($minx, $lx - $ow); }
        else { $maxx = max($maxx, $lx + $ow / 2); $minx = min($minx, $lx - $ow / 2); }
        if (!$small && $inner ne '') {
            my $rr = $r * 0.6;
            $b .= T($cx + $rr * cos($mid), $cy + $rr * sin($mid) + 4, $inner, anchor => 'middle', cls => 'dg-label');
        }
        $ang = $a2;
    }
    $b .= circ($cx, $cy, 2.5, 'dg-point');
    my $shift = $minx < 6 ? 6 - $minx : 0;
    my $W = $maxx + $shift + 6;
    my $aria = 'Circle graph' . ($a->{title} ? ": $a->{title}" : '') . '. ' . join(', ', map { plain("$_->[0] $_->[1]") } @d) . '.';
    $b = sprintf('<g transform="translate(%.1f,0)">', $shift) . $b . '</g>' if $shift;
    return (svg(max($W, 2 * $cx), $cy + $r + 30, $aria, $b));
}


$DOC{dirow} = 'shapes="symmetric|right|left" (a shape name, or heights like "1 3 5 2") labels="A|B|C" marks=1 tail=1 cols=5 w=150 (small shape sketches in a row)';

sub draw_dirow {
    my ($a) = @_;
    my @s = list($a->{shapes}, qr/\s*\|\s*/);
    my @l = list($a->{labels}, qr/\s*\|\s*/);
    my $w = $a->{w} // 150;
    my $cols = $a->{cols} // min(scalar(@s), 5);
    my ($b, $x, $y, $rowh, $maxw) = ('', 0, 0, 0, 0);
    for my $i (0 .. $#s) {
        my %o = (width => $w, height => $a->{height} // 70, label => $l[$i] // '');
        if ($s[$i] =~ /\d/) { $o{heights} = join(',', split ' ', $s[$i]); } else { $o{shape} = $s[$i]; }
        $o{marks} = 1 if $a->{marks};
        $o{tail} = 1 if $a->{tail} && ($s[$i] eq 'left' || $s[$i] eq 'right');
        my ($svg) = draw_dishape(\%o);
        my ($sw, $sh) = $svg =~ /viewBox="0 0 (\d+) (\d+)"/;
        $svg =~ s/^<svg[^>]*>//; $svg =~ s/<\/svg>\s*$//;
        if ($i && $i % $cols == 0) { $y += $rowh + 8; $x = 0; $rowh = 0; }
        $b .= sprintf('<g transform="translate(%.1f,%.1f)">%s</g>', $x, $y, $svg);
        $x += $sw + 6; $rowh = max($rowh, $sh); $maxw = max($maxw, $x);
    }
    my $aria = 'Shape sketches: ' . join(', ', map { plain($l[$_] // $s[$_]) } 0 .. $#s);
    return (svg($maxw, $y + $rowh, $aria, $b));
}

1;
