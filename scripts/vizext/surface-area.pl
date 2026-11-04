package Math8Viz;
use strict;
use warnings;
use utf8;
use List::Util qw(max min);
our (%DOC, $KEY);

# Surface Area (Math 8, topic 10): pyramids, cones and spheres, a pyramid net,
# cube-net patterns on a grid, a triangular-prism net with words inside each
# face, and a can's label unrolled into a rectangle.

$DOC{sasolid} = 'kind=pyr|tripyr|cone|sphere b w s h (labels: base edge, depth edge, slant height, height) bv wv hv (numbers for shape) slant=1 (draw the slant height, dashed, to the front edge) height=1 (draw the height inside) blabel (on the base) fill=accent|sun|plant|earth|cold size=170 title (a right pyramid, cone or sphere)';
$DOC{sapnet}  = 'bv=4 wv=4 sv=5 s2v (numbers: base edges and slant heights; s2v for the side triangles) b w s s2 (labels) n1 (in the base) n2 n3 n4 n5 (in the triangles: top, right, bottom, left) size=260 title (net of a square- or rectangle-based pyramid: a base with 4 triangles)';
$DOC{sacube}  = 'cells="0,1;1,1;2,1;3,1;1,0;1,2" (col,row of each square) letters="A,B,…" (in cell order) hot="2,5" (cells to shade, 1-based) label (under it; may hold [[…]]) unit=26 (a pattern of squares: is it a cube net?)';
$DOC{satnet}  = 'av=5 bv=6 cv=5 lv=10 (triangle sides left, base, right; prism length) la lb lc l th (labels) n1 n2 n3 (in the rectangles: left, middle, right) n4 n5 (in the top and bottom triangles) size=300 title (net of a triangular prism with any triangle)';
$DOC{saunroll} = 'rv=4 hv=10 r h c (labels: radius or diameter, height, rectangle length) diameter=1 inside="label" (words in the rectangle) size=300 title (a can and its label unrolled into a rectangle as long as the circumference)';

sub sa_fill { my ($a, $d) = @_; return 'dg-fill-' . ($a->{fill} // $d // 'accent'); }
sub sa_title { my ($a, $x) = @_; return $a->{title} ? T($x, 16, $a->{title}, cls => 'dg-title') : ''; }

sub draw_sasolid {
    my ($a) = @_;
    my $kind = $a->{kind} // 'pyr';
    my $size = $a->{size} // 170;
    my $top = $a->{title} ? 26 : 10;
    my $b = sa_title($a, 10);
    if ($kind eq 'sphere') {
        my $R = $size * 0.42;
        my ($cx, $cy) = (20 + $R, $top + 8 + $R);
        $b .= circ($cx, $cy, $R, sa_fill($a, 'soft')) . circ($cx, $cy, $R, 'dg-outline');
        $b .= sprintf('<path d="M%.1f,%.1f A%.1f,%.1f 0 0 0 %.1f,%.1f" class="dg-line"/>', $cx - $R, $cy, $R, $R * 0.3, $cx + $R, $cy);
        $b .= sprintf('<path d="M%.1f,%.1f A%.1f,%.1f 0 0 1 %.1f,%.1f" class="dg-dashed"/>', $cx - $R, $cy, $R, $R * 0.3, $cx + $R, $cy);
        return (svg(2 * $R + 40, $cy + $R + 14, 'A sphere: one curved surface, no flat faces.', $b));
    }
    if ($kind eq 'cone') {
        my ($rv, $hv) = ($a->{bv} // 3, $a->{hv} // 5);
        my $s = $size / max(2 * $rv, $hv, 1);
        my ($R, $H) = ($rv * $s, $hv * $s);
        my $e = $R * 0.32;
        my ($cx, $ap, $bot) = (20 + $R, $top + 8, $top + 8 + $H);
        $b .= sprintf('<path d="M%.1f,%.1f L%.1f,%.1f A%.1f,%.1f 0 0 0 %.1f,%.1f Z" class="%s"/>', $cx, $ap, $cx - $R, $bot, $R, $e, $cx + $R, $bot, sa_fill($a, 'soft'));
        $b .= line($cx, $ap, $cx - $R, $bot) . line($cx, $ap, $cx + $R, $bot);
        $b .= sprintf('<path d="M%.1f,%.1f A%.1f,%.1f 0 0 0 %.1f,%.1f" class="dg-line"/>', $cx - $R, $bot, $R, $e, $cx + $R, $bot);
        $b .= sprintf('<path d="M%.1f,%.1f A%.1f,%.1f 0 0 1 %.1f,%.1f" class="dg-dashed"/>', $cx - $R, $bot, $R, $e, $cx + $R, $bot);
        return (svg(2 * $R + 40, $bot + $e + 14, 'A cone: a circle base and one curved surface up to a point.', $b));
    }
    my ($bv, $wv, $hv) = ($a->{bv} // 4, $a->{wv} // $a->{bv} // 4, $a->{hv} // 4);
    my $s = $size / max($bv + $wv * 0.5, $hv + $wv * 0.32, 1);
    my ($B, $D, $Hp) = ($bv * $s, $wv * $s, $hv * $s);
    my ($dx, $dy) = ($D * 0.5, -$D * 0.32);
    my ($x0, $y0) = (24 + max(0, tw(plain($a->{s} // ''), 11) - 10), $top + 10 + $Hp - $dy);
    $x0 = 24 if $kind eq 'tripyr';
    my (@P, @C);
    if ($kind eq 'tripyr') {
        @P = ([$x0, $y0 + $dy * 0.9], [$x0 + $B * 0.45, $y0], [$x0 + $B + $dx * 0.4, $y0 + $dy * 0.8]);
        @C = (($P[0][0] + $P[1][0] + $P[2][0]) / 3, ($P[0][1] + $P[1][1] + $P[2][1]) / 3);
    } else {
        @P = ([$x0, $y0], [$x0 + $B, $y0], [$x0 + $B + $dx, $y0 + $dy], [$x0 + $dx, $y0 + $dy]);
        @C = ($x0 + $B / 2 + $dx / 2, $y0 + $dy / 2);
    }
    my @A = ($C[0], $C[1] - $Hp);
    my $fill = sa_fill($a);
    # faces seen from the front and the right
    $b .= poly('dg-fill-soft', @{ $P[0] }, @{ $P[1] }, @A);
    $b .= poly($fill, @{ $P[1] }, @{ $P[2] }, @A);
    # hidden edges
    if ($kind eq 'tripyr') {
        $b .= line(@{ $P[2] }, @{ $P[0] }, 'dg-dashed');
    } else {
        $b .= line(@{ $P[2] }, @{ $P[3] }, 'dg-dashed') . line(@{ $P[3] }, @{ $P[0] }, 'dg-dashed') . line(@A, @{ $P[3] }, 'dg-dashed');
    }
    $b .= line(@{ $P[0] }, @{ $P[1] }) . line(@{ $P[1] }, @{ $P[2] });
    $b .= line(@A, @{ $P[0] }) . line(@A, @{ $P[1] }) . line(@A, @{ $P[2] });
    $b .= circ(@A, 2.5, 'dg-point');
    my @M = ($x0 + $B / 2, $y0);
    if ($a->{slant}) {
        $b .= line(@A, @M, 'dg-accent');
        my ($ux, $uy) = ($A[0] - $M[0], $A[1] - $M[1]);
        my $L = sqrt($ux * $ux + $uy * $uy) || 1; ($ux, $uy) = ($ux / $L * 8, $uy / $L * 8);
        $b .= sprintf('<polyline points="%.1f,%.1f %.1f,%.1f %.1f,%.1f" class="dg-right-angle"/>', $M[0] - 8, $M[1], $M[0] - 8 + $ux, $M[1] + $uy, $M[0] + $ux, $M[1] + $uy);
        if (defined $a->{s}) {
            my ($qx, $qy) = (($A[0] + $M[0]) / 2, ($A[1] + $M[1]) / 2);
            my $t = ($qy - $A[1]) / (($y0 - $A[1]) || 1);
            my $ex = $A[0] + ($x0 - $A[0]) * $t;   # the left edge at that height
            $b .= line($ex - 4, $qy - 4, $qx, $qy, 'dg-accent');
            $b .= T($ex - 8, $qy, $a->{s}, anchor => 'end', cls => 'dg-label-accent');
        }
    }
    if ($a->{height}) {
        $b .= line(@A, @C, 'dg-dashed') . circ(@C, 2, 'dg-point');
        if (defined $a->{h}) {
            my $hy = $A[1] + $Hp * 0.45;
            my $rx = max(map { $_->[0] } @P) + 6;
            $b .= line($C[0], $hy, $rx - 2, $hy - 4, 'dg-accent');
            $b .= T($rx, $hy, $a->{h}, cls => 'dg-label-accent');
        }
    }
    $b .= T($x0 + $B / 2, $y0 + 18, $a->{b}, anchor => 'middle', cls => 'dg-label-accent') if defined $a->{b};
    $b .= T($P[1][0] + $dx / 2 + 8, $y0 + $dy / 2 + 12, $a->{w}, cls => 'dg-label-accent') if defined $a->{w} && $kind ne 'tripyr';
    $b .= T($C[0], $C[1] + 4, $a->{blabel}, anchor => 'middle', cls => 'dg-label-sm') if $a->{blabel};
    my $W = $x0 + $B + $dx + 24 + max(20, tw(plain($a->{w} // ''), 11), $a->{height} ? tw(plain($a->{h} // ''), 11) : 0);
    my $what = $kind eq 'tripyr' ? 'Triangular pyramid' : ($bv == $wv ? 'Square-based pyramid' : 'Rectangle-based pyramid');
    return (svg($W, $y0 + 28, "$what. Base edge " . plain($a->{b}) . ', slant height ' . plain($a->{s}) . '.', $b));
}

sub draw_sapnet {
    my ($a) = @_;
    my ($bv, $wv) = ($a->{bv} // 4, $a->{wv} // $a->{bv} // 4);
    my $sv = $a->{sv} // 5;
    my $s2v = $a->{s2v} // $sv;
    my $size = $a->{size} // 260;
    my $sc = $size / max($bv + 2 * $s2v, $wv + 2 * $sv, 1);
    my ($B, $Wd, $S, $S2) = ($bv * $sc, $wv * $sc, $sv * $sc, $s2v * $sc);
    my $top = $a->{title} ? 26 : 10;
    my ($x0, $y0) = (14 + $S2, $top + $S);
    my $b = sa_title($a, 10);
    # a size above the default is shown shrunk to fit the page, so grow the labels with it
    my $LF = defined $a->{size} && $a->{size} > 260 ? 11 * $a->{size} / 260 : 0;
    my $big = sub { my $t = shift; $t =~ s/<text /<text style="font-size:${LF}px" /g if $LF; $t };
    $b .= rect($x0, $y0, $B, $Wd, 'dg-fill-sun') . rect($x0, $y0, $B, $Wd, 'dg-outline');
    my @tri = (
        [$x0, $y0, $x0 + $B, $y0, $x0 + $B / 2, $y0 - $S],
        [$x0 + $B, $y0, $x0 + $B, $y0 + $Wd, $x0 + $B + $S2, $y0 + $Wd / 2],
        [$x0, $y0 + $Wd, $x0 + $B, $y0 + $Wd, $x0 + $B / 2, $y0 + $Wd + $S],
        [$x0, $y0, $x0, $y0 + $Wd, $x0 - $S2, $y0 + $Wd / 2],
    );
    for my $t (@tri) { $b .= poly('dg-fill-accent', @$t) . poly('dg-outline', @$t); }
    # slant height on the top triangle, dashed
    $b .= line($x0 + $B / 2, $y0, $x0 + $B / 2, $y0 - $S, 'dg-dashed') if defined $a->{s};
    # slant labels sit just outside the slanted edge, off the dashed line
    $b .= $big->(T($x0 + $B * 0.75 + 6, $y0 - $S * 0.5 + 4, $a->{s}, cls => 'dg-label-accent')) if defined $a->{s};
    if (defined $a->{s2}) {
        $b .= line($x0 + $B, $y0 + $Wd / 2, $x0 + $B + $S2, $y0 + $Wd / 2, 'dg-dashed');
        $b .= $big->(T($x0 + $B + $S2 * 0.27, $y0 + $Wd / 2 - 6, $a->{s2}, anchor => 'middle', cls => 'dg-label-accent'));
    }
    $b .= $big->(T($x0 + $B / 2, $y0 + ($LF || 11) + 5, $a->{b}, anchor => 'middle', cls => 'dg-label-accent')) if defined $a->{b};
    $b .= $big->(T($x0 + 5, $y0 + $Wd / 2 + 4, $a->{w}, cls => 'dg-label-accent')) if defined $a->{w};
    my $sh = defined $a->{s} ? $B * 0.2 : 0;
    my $sh2 = defined $a->{s2} ? 15 : 0;
    my @c = ([$x0 + $B / 2, $y0 + $Wd / 2 + 14], [$x0 + $B / 2 - $sh, $y0 - $S * 0.18], [$x0 + $B + $S2 * 0.3, $y0 + $Wd / 2 + 4 + $sh2],
             [$x0 + $B / 2, $y0 + $Wd + $S * 0.4], [$x0 - $S2 * 0.33, $y0 + $Wd / 2 + 4]);
    for my $i (1 .. 5) {
        my $t = $a->{"n$i"}; next unless defined $t;
        $b .= T($c[$i - 1][0], $c[$i - 1][1], $t, anchor => 'middle', cls => 'dg-label-sm');
    }
    return (svg($x0 + $B + $S2 + 14, $y0 + $Wd + $S + 12, 'Net of a pyramid: a base with a triangle on each of its 4 edges.', $b));
}

sub draw_sacube {
    my ($a) = @_;
    my @cells = map { [split /\s*,\s*/] } list($a->{cells} // '0,1;1,1;2,1;3,1;1,0;1,2', qr/\s*;\s*/);
    my @let = list($a->{letters});
    my %hot = map { $_ => 1 } list($a->{hot});
    my $u = $a->{unit} // 26;
    my $cols = max(map { $_->[0] } @cells) + 1;
    my $rows = max(map { $_->[1] } @cells) + 1;
    my ($x0, $y0) = (10, 10);
    my $b = '';
    for my $i (0 .. $#cells) {
        my ($c, $r) = @{ $cells[$i] };
        my $cls = $hot{$i + 1} ? 'dg-fill-hot' : 'dg-fill-accent';
        $b .= rect($x0 + $c * $u, $y0 + $r * $u, $u, $u, $cls) . rect($x0 + $c * $u, $y0 + $r * $u, $u, $u, 'dg-outline');
        $b .= T($x0 + ($c + 0.5) * $u, $y0 + ($r + 0.5) * $u + 4, $let[$i], anchor => 'middle', cls => 'dg-label-sm') if defined $let[$i] && $let[$i] ne '';
    }
    (my $lw = $a->{label} // '') =~ s/\[\[(.*?)\]\]/$1   /g;
    my $W = max(20 + $cols * $u, $a->{label} ? tw($lw, 11) + 24 : 0);
    my $H = 20 + $rows * $u;
    if ($a->{label}) { $b .= T($W / 2, $H + 8, $a->{label}, anchor => 'middle', cls => 'dg-label-sm'); $H += 18; }
    return (svg($W, $H, 'A pattern of ' . scalar(@cells) . ' squares. Does it fold into a cube?', $b));
}

sub draw_satnet {
    my ($a) = @_;
    my ($av, $bv, $cv, $lv) = ($a->{av} // 5, $a->{bv} // 6, $a->{cv} // 5, $a->{lv} // 10);
    my $px = ($bv * $bv + $av * $av - $cv * $cv) / (2 * $bv);
    my $th = sqrt(max($av * $av - $px * $px, 0.01));
    my $size = $a->{size} // 300;
    my $sc = $size / max($av + $bv + $cv, $lv + 2 * $th, 1);
    my ($A, $Bw, $Cw, $L, $TH, $PX) = map { $_ * $sc } ($av, $bv, $cv, $lv, $th, $px);
    my $top = ($a->{title} ? 26 : 10) + 14;
    my ($x0, $y0) = (14, $top + $TH);
    my $b = sa_title($a, 10);
    my $LF = defined $a->{size} && $a->{size} > 300 ? 11 * $a->{size} / 300 : 0;
    my $big = sub { my $t = shift; $t =~ s/<text /<text style="font-size:${LF}px" /g if $LF; $t };
    my $x = $x0;
    my @rc;
    for my $w ($A, $Bw, $Cw) {
        $b .= rect($x, $y0, $w, $L, 'dg-fill-soft') . rect($x, $y0, $w, $L, 'dg-outline');
        push @rc, $x + $w / 2; $x += $w;
    }
    my $mx = $x0 + $A;
    my @t1 = ($mx, $y0, $mx + $Bw, $y0, $mx + $PX, $y0 - $TH);
    my @t2 = ($mx, $y0 + $L, $mx + $Bw, $y0 + $L, $mx + $PX, $y0 + $L + $TH);
    $b .= poly('dg-fill-sun', @t1) . poly('dg-outline', @t1) . poly('dg-fill-sun', @t2) . poly('dg-outline', @t2);
    if (defined $a->{th}) {
        $b .= line($mx + $PX, $y0, $mx + $PX, $y0 - $TH, 'dg-dashed');
        $b .= $big->(T($mx + $PX + 5, $y0 - $TH * 0.18, $a->{th}, cls => 'dg-label-accent'));
    }
    $b .= $big->(T($rc[0], $y0 - 6, $a->{la}, anchor => 'middle', cls => 'dg-label-accent')) if defined $a->{la};
    $b .= $big->(T($rc[2], $y0 - 6, $a->{lc}, anchor => 'middle', cls => 'dg-label-accent')) if defined $a->{lc};
    $b .= $big->(T($rc[1], $y0 + 16, $a->{lb}, anchor => 'middle', cls => 'dg-label-accent')) if defined $a->{lb};
    $b .= $big->(T($x + 6, $y0 + $L / 2 + 4, $a->{l}, cls => 'dg-label-accent')) if defined $a->{l};
    for my $i (1 .. 3) { $b .= T($rc[$i - 1], $y0 + $L / 2 + 4, $a->{"n$i"}, anchor => 'middle', cls => 'dg-label-sm') if defined $a->{"n$i"}; }
    $b .= T($mx + ($Bw + $PX) / 3 - ($a->{th} ? 5 : 0), $y0 - $TH / 4 + 4, $a->{n4}, anchor => ($a->{th} ? 'end' : 'middle'), cls => 'dg-label-sm') if defined $a->{n4};
    $b .= T($mx + $PX, $y0 + $L + $TH * 0.55, $a->{n5}, anchor => 'middle', cls => 'dg-label-sm') if defined $a->{n5};
    my $W = $x + 20 + max(20, tw(plain($a->{l} // ''), $LF || 11));
    return (svg($W, $y0 + $L + $TH + 12, 'Net of a triangular prism: three rectangles in a row with a triangle on each end of the middle one.', $b));
}

sub draw_saunroll {
    my ($a) = @_;
    my ($rv, $hv) = ($a->{rv} // 4, $a->{hv} // 10);
    my $size = $a->{size} // 300;
    my $C = 2 * 3.14159265 * $rv;
    my $sc = min($size / ($C + 2 * $rv + 2), 150 / max($hv, 1));
    my ($R, $Hh, $Cw) = ($rv * $sc, $hv * $sc, $C * $sc);
    my $e = $R * 0.32;
    my $top = ($a->{title} ? 26 : 10) + 18;
    my $b = sa_title($a, 10);
    my ($cx, $ty) = (14 + $R, $top + $e);
    my $by = $ty + $Hh;
    $b .= sprintf('<path d="M%.1f,%.1f L%.1f,%.1f A%.1f,%.1f 0 0 0 %.1f,%.1f L%.1f,%.1f" class="dg-fill-accent"/>', $cx - $R, $ty, $cx - $R, $by, $R, $e, $cx + $R, $by, $cx + $R, $ty);
    $b .= sprintf('<path d="M%.1f,%.1f A%.1f,%.1f 0 0 0 %.1f,%.1f" class="dg-line"/>', $cx - $R, $by, $R, $e, $cx + $R, $by);
    $b .= line($cx - $R, $ty, $cx - $R, $by) . line($cx + $R, $ty, $cx + $R, $by);
    $b .= sprintf('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" class="dg-fill-sun"/>', $cx, $ty, $R, $e);
    $b .= sprintf('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" class="dg-outline"/>', $cx, $ty, $R, $e);
    if ($a->{diameter}) { $b .= line($cx - $R, $ty, $cx + $R, $ty, 'dg-accent'); $b .= T($cx, $ty - $e - 6, $a->{r}, anchor => 'middle', cls => 'dg-label-accent') if defined $a->{r}; }
    else { $b .= line($cx, $ty, $cx + $R, $ty, 'dg-accent') . circ($cx, $ty, 2, 'dg-point'); $b .= T($cx + $R / 2, $ty - $e - 6, $a->{r}, anchor => 'middle', cls => 'dg-label-accent') if defined $a->{r}; }
    $b .= T($cx - $R - 6, ($ty + $by) / 2 + 4, $a->{h}, anchor => 'end', cls => 'dg-label-accent') if defined $a->{h};
    my $hw = tw(plain($a->{h} // ''), 11);
    if ($hw > 0) { my $shift = $hw + 4; $b = '<g transform="translate(' . sprintf('%.1f', $shift) . ',0)">' . $b . '</g>'; $cx += $shift; }
    my $ax = $cx + $R + 12;
    $b .= arrow($ax, ($ty + $by) / 2, $ax + 34, ($ty + $by) / 2, 'muted');
    $b .= T($ax + 17, ($ty + $by) / 2 - 8, 'unroll', anchor => 'middle', cls => 'dg-label-sm');
    my $rx = $ax + 46;
    $b .= rect($rx, $ty, $Cw, $Hh, 'dg-fill-accent') . rect($rx, $ty, $Cw, $Hh, 'dg-outline');
    $b .= T($rx + $Cw / 2, ($ty + $by) / 2 + 4, $a->{inside}, anchor => 'middle', cls => 'dg-label-sm') if defined $a->{inside};
    # length arrow under the rectangle
    $b .= line($rx, $by + 10, $rx + $Cw, $by + 10, 'dg-accent') . line($rx, $by + 5, $rx, $by + 15, 'dg-accent') . line($rx + $Cw, $by + 5, $rx + $Cw, $by + 15, 'dg-accent');
    $b .= T($rx + $Cw / 2, $by + 28, $a->{c}, anchor => 'middle', cls => 'dg-label-accent') if defined $a->{c};
    my $W = max($rx + $Cw + 14, $rx + $Cw / 2 + tw(plain($a->{c} // ''), 11) / 2 + 10);
    return (svg($W, $by + 36, 'A can and its label unrolled. The label is a rectangle as long as the circumference.', $b));
}

1;
