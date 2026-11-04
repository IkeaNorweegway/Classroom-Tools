package Math8Viz;
use strict;
use warnings;
use utf8;
use List::Util qw(max min);
our (%DOC, $KEY);

# Triangle Theorems (Math 8, topic 9): torn corners on a line, three straws,
# right-triangle scenes (ladder, guy-wire, ramp, field, TV, park) and a range
# on a number line for a missing side.

$DOC{tttear}   = 'angles="50,60,70" labels="a;b;c" (wedge labels, may hold [[…]]) sum="a + b + c = [[180°]]" line=1 (also draw the torn corners lined up on a straight line) title (a triangle with its three corners coloured)';
$DOC{ttstraws} = 'a=3 b=4 c=6 (lengths) la="3 cm" lb lc (labels) show=1|key|0 (try to build the triangle; key = only in the answer key) arcs=1 (dashed swing arcs) unit=22 title (three straws: do they make a triangle?)';
$DOC{ttscene}  = 'kind=ladder|wire|ramp|field|tv|park w=3 h=8 (shape numbers) a="8 m" (vertical label) b="3 m" (horizontal label) c="[[…]]" (slanted label) title (a right-triangle problem picture)';
$DOC{ttrange}  = 'min=0 max=14 lo=3 hi=11 show=1|key label="[[3]] < x < [[11]]" title (a number line with open dots at lo and hi, shaded between)';

sub tt_pt { my ($V, $r, $th) = @_; return ($V->[0] + $r * cos($th), $V->[1] - $r * sin($th)); }
sub tt_wedge {   # sector at V from angle t1 to t2 (radians, counter-clockwise on screen)
    my ($V, $r, $t1, $t2, $cls) = @_;
    my ($x1, $y1) = tt_pt($V, $r, $t1);
    my ($x2, $y2) = tt_pt($V, $r, $t2);
    my $large = ($t2 - $t1) > 3.14159265 ? 1 : 0;
    return sprintf('<path d="M%.1f,%.1f L%.1f,%.1f A%.1f,%.1f 0 %d 0 %.1f,%.1f Z" class="%s"/>', @$V, $x1, $y1, $r, $r, $large, $x2, $y2, $cls);
}
sub tt_stick {   # a thick straw from (x1,y1) to (x2,y2)
    my ($x1, $y1, $x2, $y2, $cls) = @_;
    my ($dx, $dy) = ($x2 - $x1, $y2 - $y1);
    my $L = sqrt($dx * $dx + $dy * $dy) || 1;
    my ($nx, $ny) = (-$dy / $L * 3.5, $dx / $L * 3.5);
    return poly($cls, $x1 + $nx, $y1 + $ny, $x2 + $nx, $y2 + $ny, $x2 - $nx, $y2 - $ny, $x1 - $nx, $y1 - $ny);
}

sub draw_tttear {
    my ($a) = @_;
    my $D = 3.14159265358979 / 180;
    my @g = map { num($_) } list($a->{angles} // '50,60,70');
    my @lab = list($a->{labels} // 'a;b;c', qr/\s*;\s*/);
    my @cls = ('dg-fill-hot', 'dg-fill-sun', 'dg-fill-cold');
    my @lcls = ('dg-label-hot', 'dg-label-earth', 'dg-label-cold');
    my ($al, $be) = ($g[0] * $D, $g[1] * $D);
    my $c = 200;
    my $ac = $c * sin($be) / sin($al + $be);
    my $top = 30 + ($a->{title} ? 18 : 0);
    my $hgt = $ac * sin($al);
    my $s = 150 / max($hgt, 1); $s = 1 if $s > 1;   # keep tall triangles short
    $c *= $s; $ac *= $s; $hgt *= $s;
    my @A = (30, $top + $hgt);
    my @B = (30 + $c, $top + $hgt);
    my @C = (30 + $ac * cos($al), $top);
    my $b = '';
    $b .= T(30, 18, $a->{title}, cls => 'dg-title') if $a->{title};
    $b .= poly('dg-fill-soft', @A, @B, @C);
    my $r = 28;
    my @v = ([\@A, 0, $al], [\@B, 180 * $D - $be, 180 * $D], [\@C, 180 * $D + $al, 360 * $D - $be]);
    for my $i (0 .. 2) {
        my ($V, $t1, $t2) = @{ $v[$i] };
        $b .= tt_wedge($V, $r, $t1, $t2, $cls[$i]);
        my ($lx, $ly) = tt_pt($V, $r + 14, ($t1 + $t2) / 2);
        $b .= T($lx, $ly + 4, $lab[$i], anchor => 'middle', cls => $lcls[$i]) if defined $lab[$i];
    }
    $b .= poly('dg-outline', @A, @B, @C);
    my $W = max($B[0], $C[0]) + 30;
    my $H = $A[1] + 24;
    if ($a->{line} // 1) {
        my $x0 = $W + 30;
        my $R = 54;
        my @O = ($x0 + $R + 20, $A[1]);
        $b .= T($x0 - 14, $O[1] - $R / 2, '→', anchor => 'middle', cls => 'dg-math-lg');
        my $t = 0;
        for my $i (0 .. 2) {
            my $w = $g[$i] * $D;
            $b .= tt_wedge(\@O, $R, $t, $t + $w, $cls[$i]);
            my ($lx, $ly) = tt_pt(\@O, $R * 0.62, $t + $w / 2);
            $b .= T($lx, $ly + 4, $lab[$i], anchor => 'middle', cls => $lcls[$i]) if defined $lab[$i];
            $t += $w;
        }
        $b .= line($O[0] - $R - 20, $O[1], $O[0] + $R + 20, $O[1], 'dg-line');
        $b .= circ(@O, 3, 'dg-point');
        $b .= T($O[0], $O[1] + 20, 'a straight line', anchor => 'middle', cls => 'dg-label-sm');
        $W = $O[0] + $R + 30;
    }
    if (defined $a->{sum}) { $H += 10; $b .= T($W / 2, $H, $a->{sum}, anchor => 'middle', cls => 'dg-math'); $H += 12; }
    return (svg($W, $H, 'A triangle with its three corners coloured' . (($a->{line} // 1) ? ', torn off and lined up along a straight line' : '') . '. Angles: ' . join(', ', map { plain($_) } @lab), $b));
}

sub draw_ttstraws {
    my ($a) = @_;
    my ($av, $bv, $cv) = (num($a->{a}) // 3, num($a->{b}) // 4, num($a->{c}) // 6);
    my ($la, $lb, $lc) = ($a->{la} // fmt($av), $a->{lb} // fmt($bv), $a->{lc} // fmt($cv));
    my $u = $a->{unit} // 24;
    my $show = $a->{show} // 1;
    $show = $KEY ? 1 : 0 if $show eq 'key';
    my $b = '';
    my $top = 14 + ($a->{title} ? 20 : 0);
    $b .= T(20, 18, $a->{title}, cls => 'dg-title') if $a->{title};
    my $x0 = 30;
    if (!$show) {   # three loose straws
        my $y = $top + 10;
        for my $s ([$av, $la, 'dg-fill-hot'], [$bv, $lb, 'dg-fill-cold'], [$cv, $lc, 'dg-fill-sun']) {
            $b .= rect($x0, $y, $s->[0] * $u, 8, $s->[2], 3);
            $b .= T($x0 + $s->[0] * $u + 10, $y + 8, $s->[1], cls => 'dg-label-accent');
            $y += 28;
        }
        my $W = $x0 + max($av, $bv, $cv) * $u + 30 + max(map { tw(plain($_), 12) } ($la, $lb, $lc)) + 20;
        return (svg($W, $y + 4, "Three straws: " . plain($la) . ', ' . plain($lb) . ', ' . plain($lc), $b));
    }
    my $C = $cv * $u;
    my $hmax = max($av, $bv) * $u;
    my $yb = $top + $hmax + 14;
    my @L = ($x0, $yb);
    my @R = ($x0 + $C, $yb);
    if ($a->{arcs} // 1) {
        for my $s ([\@L, $av * $u, 0, 1], [\@R, $bv * $u, 3.14159265, -1]) {
            my ($V, $r, $t0, $dir) = @$s;
            my ($x1, $y1) = tt_pt($V, $r, $t0);
            my ($x2, $y2) = tt_pt($V, $r, $t0 + $dir * 1.5708);
            $b .= sprintf('<path d="M%.1f,%.1f A%.1f,%.1f 0 0 %d %.1f,%.1f" class="dg-construction"/>', $x1, $y1, $r, $r, $dir > 0 ? 0 : 1, $x2, $y2);
        }
    }
    $b .= tt_stick(@L, @R, 'dg-fill-sun');
    $b .= T(($L[0] + $R[0]) / 2, $yb + 24, $lc, anchor => 'middle', cls => 'dg-label-accent');
    my $verdict;
    if ($av + $bv > $cv + 1e-9 && $av + $cv > $bv + 1e-9 && $bv + $cv > $av + 1e-9) {
        my $px = ($cv * $cv + $av * $av - $bv * $bv) / (2 * $cv);
        my $py = sqrt(max(0, $av * $av - $px * $px));
        my @P = ($x0 + $px * $u, $yb - $py * $u);
        $b .= tt_stick(@L, @P, 'dg-fill-hot') . tt_stick(@R, @P, 'dg-fill-cold');
        $b .= T(($L[0] + $P[0]) / 2 - 10, ($L[1] + $P[1]) / 2, $la, anchor => 'end', cls => 'dg-label-hot');
        $b .= T(($R[0] + $P[0]) / 2 + 10, ($R[1] + $P[1]) / 2, $lb, cls => 'dg-label-cold');
        $verdict = 'They meet: a triangle.';
    } else {   # too short (or exactly flat): lay them along the base
        my $ya = $yb - 12;
        my @Pa = ($x0 + $av * $u, $ya);
        my @Pb = ($x0 + $C - $bv * $u, $ya);
        $b .= tt_stick($L[0], $ya, @Pa, 'dg-fill-hot') . tt_stick($R[0], $ya, @Pb, 'dg-fill-cold');
        $b .= T(($L[0] + $Pa[0]) / 2, $ya - 10, $la, anchor => 'middle', cls => 'dg-label-hot');
        $b .= T(($R[0] + $Pb[0]) / 2, $ya - 10, $lb, anchor => 'middle', cls => 'dg-label-cold');
        if ($av + $bv < $cv - 1e-9) {
            $b .= T(($Pa[0] + $Pb[0]) / 2, $ya - 26, 'gap', anchor => 'middle', cls => 'dg-label');
            $b .= line($Pa[0] + 2, $ya - 22, $Pb[0] - 2, $ya - 22, 'dg-dashed');
            $verdict = 'Too short: they can\'t meet.';
        } else { $verdict = 'They meet only lying flat.'; }
    }
    $b .= T(($L[0] + $R[0]) / 2, $yb + 42, $verdict, anchor => 'middle', cls => 'dg-label') unless $a->{noverdict};
    my $W = $x0 + $C + 30 + 50;
    return (svg($W, $yb + 52, "Straws $la and $lb are joined to the ends of straw $lc. $verdict", $b));
}

sub draw_ttscene {
    my ($a) = @_;
    my $k = $a->{kind} // 'ladder';
    my ($wv, $hv) = (num($a->{w}) // 3, num($a->{h}) // 4);
    my $s = 200 / max($wv, $hv, 1);
    my ($Wp, $Hp) = (max(40, $wv * $s), max(40, $hv * $s));
    if ($k eq 'field' || $k eq 'tv' || $k eq 'park') { my $f = 240 / max($Wp, $Hp * 1.4); ($Wp, $Hp) = ($Wp * $f, $Hp * $f); }
    my $top = 22 + ($a->{title} ? 18 : 0);
    my $left = 30 + max(30, tw(plain($a->{a} // ''), 12.5) + 30);
    my $b = '';
    $b .= T(16, 18, $a->{title}, cls => 'dg-title') if $a->{title};
    my ($yg, $xw) = ($top + $Hp, $left);
    my $ra = sub { my ($x, $y, $sx, $sy) = @_; sprintf('<path d="M%.1f,%.1f L%.1f,%.1f L%.1f,%.1f" class="dg-right-angle"/>', $x + 12 * $sx, $y, $x + 12 * $sx, $y - 12 * $sy, $x, $y - 12 * $sy) };
    my ($W, $H);
    my $ldiag = sub {   # slanted label beside a segment, on the side away from (gx, gy)
        my ($x1, $y1, $x2, $y2, $gx, $gy, $txt) = @_;
        return '' unless defined $txt;
        my ($mx, $my) = (($x1 + $x2) / 2, ($y1 + $y2) / 2);
        my ($dx, $dy) = ($x2 - $x1, $y2 - $y1); my $L = sqrt($dx * $dx + $dy * $dy) || 1;
        my ($nx, $ny) = (-$dy / $L, $dx / $L);
        ($nx, $ny) = (-$nx, -$ny) if ($nx * ($gx - $mx) + $ny * ($gy - $my)) > 0;
        return T($mx + $nx * 16, $my + $ny * 16 + 4, $txt, anchor => $nx > 0.3 ? 'start' : $nx < -0.3 ? 'end' : 'middle', cls => 'dg-label-accent');
    };
    if ($k eq 'ladder' || $k eq 'wire') {
        my @Top = ($xw, $top); my @Foot = ($xw + $Wp, $yg);
        $b .= line($xw - 30, $yg, $xw + $Wp + 30, $yg, 'dg-line');
        $b .= line($xw - 30 + $_ * 12, $yg, $xw - 38 + $_ * 12, $yg + 8, 'dg-construction') for 0 .. int(($Wp + 60) / 12);
        if ($k eq 'ladder') {
            $b .= rect($xw - 18, $top - 14, 18, $Hp + 14, 'dg-fill-earth');
            for (my $y = $top - 4; $y < $yg; $y += 14) { $b .= line($xw - 18, $y, $xw, $y, 'dg-construction'); }
            # ladder: two rails and rungs
            my ($dx, $dy) = ($Foot[0] - $Top[0], $Foot[1] - $Top[1]); my $L = sqrt($dx * $dx + $dy * $dy);
            my ($nx, $ny) = (-$dy / $L * 5, $dx / $L * 5);
            $b .= line($Top[0] + $nx, $Top[1] + $ny, $Foot[0] + $nx, $Foot[1] + $ny, 'dg-accent');
            $b .= line($Top[0] - $nx, $Top[1] - $ny, $Foot[0] - $nx, $Foot[1] - $ny, 'dg-accent');
            for (my $t = 0.08; $t < 0.97; $t += 0.11) {
                my ($px, $py) = ($Top[0] + $dx * $t, $Top[1] + $dy * $t);
                $b .= line($px + $nx, $py + $ny, $px - $nx, $py - $ny, 'dg-accent');
            }
        } else {
            $b .= rect($xw - 6, $top - 10, 12, $Hp + 10, 'dg-fill-soft');
            for (my $y = $top; $y < $yg - 12; $y += 18) { $b .= line($xw - 6, $y, $xw + 6, $y + 18, 'dg-construction') . line($xw + 6, $y, $xw - 6, $y + 18, 'dg-construction'); }
            $b .= line(@Top, @Foot, 'dg-accent') . circ(@Foot, 3.5, 'dg-point') . circ(@Top, 3.5, 'dg-point');
            $xw += 6;
        }
        $b .= $ra->($xw, $yg, 1, 1);
        $b .= T($xw - ($k eq 'ladder' ? 26 : 16), ($top + $yg) / 2 + 4, $a->{a}, anchor => 'end', cls => 'dg-label-accent') if defined $a->{a};
        $b .= T(($xw + $Foot[0]) / 2, $yg + 24, $a->{b}, anchor => 'middle', cls => 'dg-label-accent') if defined $a->{b};
        $b .= $ldiag->(@Top, @Foot, $xw, $yg, $a->{c});
        $W = $Foot[0] + 40 + tw(plain($a->{c} // ''), 12.5) / 2; $H = $yg + 34;
    } elsif ($k eq 'ramp') {
        my @P = ($left, $yg); my @Q = ($left + $Wp, $yg); my @R = ($left + $Wp, $top);
        $b .= line($left - 20, $yg, $left + $Wp + 30, $yg, 'dg-line');
        $b .= poly('dg-fill-earth', @P, @Q, @R);
        $b .= $ra->($Q[0], $Q[1], -1, 1);
        $b .= T($Q[0] + 10, ($top + $yg) / 2 + 4, $a->{a}, cls => 'dg-label-accent') if defined $a->{a};
        $b .= T(($P[0] + $Q[0]) / 2, $yg + 20, $a->{b}, anchor => 'middle', cls => 'dg-label-accent') if defined $a->{b};
        $b .= $ldiag->(@P, @R, $Q[0], $Q[1], $a->{c});
        $W = $Q[0] + 30 + tw(plain($a->{a} // ''), 12.5); $H = $yg + 30;
    } else {   # field, tv, park: a rectangle with a diagonal
        my ($x1, $y1, $x2, $y2) = ($left, $top, $left + $Wp, $yg);
        if ($k eq 'tv') {
            $b .= rect($x1 - 8, $y1 - 8, $Wp + 16, $Hp + 16, 'dg-fill-soft', 4);
            $b .= rect($x1, $y1, $Wp, $Hp, 'dg-fill-cold');
            $b .= poly('dg-fill-soft', ($x1 + $x2) / 2 - 10, $y2 + 8, ($x1 + $x2) / 2 + 10, $y2 + 8, ($x1 + $x2) / 2 + 24, $y2 + 22, ($x1 + $x2) / 2 - 24, $y2 + 22);
        } else {
            $b .= rect($x1, $y1, $Wp, $Hp, 'dg-fill-plant');
            if ($k eq 'field') {
                $b .= line(($x1 + $x2) / 2, $y1, ($x1 + $x2) / 2, $y2, 'dg-construction');
                $b .= sprintf('<circle cx="%.1f" cy="%.1f" r="%.1f" class="dg-construction"/>', ($x1 + $x2) / 2, ($y1 + $y2) / 2, min($Wp, $Hp) / 6);
            } else {   # park: the long way round, two trees
                $b .= sprintf('<polyline points="%.1f,%.1f %.1f,%.1f %.1f,%.1f" class="dg-dashed" fill="none"/>', $x1, $y2 + 6, $x2 + 6, $y2 + 6, $x2 + 6, $y1);
                for my $t ([0.25, 0.3], [0.7, 0.75]) { my ($tx, $ty) = ($x1 + $Wp * $t->[0], $y1 + $Hp * $t->[1]); $b .= circ($tx, $ty, 9, 'dg-fill-plant') . circ($tx, $ty, 2, 'dg-point'); }
                $b .= circ($x1, $y2, 4, 'dg-point') . circ($x2, $y1, 4, 'dg-point');
                $b .= T($x1 - 6, $y2 + 18, $a->{from} // 'A', anchor => 'end', cls => 'dg-label');
                $b .= T($x2 + 10, $y1 - 4, $a->{to} // 'B', cls => 'dg-label');
            }
        }
        $b .= line($x1, $y2, $x2, $y1, 'dg-accent');
        $b .= $ra->($x2, $y2, -1, 1);
        $b .= T($x2 + 14, ($y1 + $y2) / 2 + 4, $a->{a}, cls => 'dg-label-accent') if defined $a->{a};
        $b .= T(($x1 + $x2) / 2, $y2 + ($k eq 'tv' ? 40 : 24), $a->{b}, anchor => 'middle', cls => 'dg-label-accent') if defined $a->{b};
        my ($mx, $my) = (($x1 + $x2) / 2, ($y1 + $y2) / 2);
        if (defined $a->{c}) {
            my $tw = tw(plain($a->{c}), 12.5) + ($a->{c} =~ /\[\[/ ? 20 : 0);
            $b .= rect($mx - $tw / 2 - 4, $my - 26, $tw + 8, 18, 'dg-fill-soft', 3);
            $b .= T($mx, $my - 13, $a->{c}, anchor => 'middle', cls => 'dg-label-accent');
        }
        $W = $x2 + 30 + tw(plain($a->{a} // ''), 12.5); $H = $y2 + ($k eq 'tv' ? 50 : 34);
    }
    my %what = (ladder => 'A ladder leans against a wall', wire => 'A guy-wire runs from the top of a tower to the ground', ramp => 'A ramp',
                field => 'A rectangular field with a diagonal', tv => 'A TV screen with its diagonal', park => 'A park with a shortcut along the diagonal');
    return (svg($W, $H, ($what{$k} // 'A right triangle') . '. Vertical: ' . plain($a->{a} // '') . '. Horizontal: ' . plain($a->{b} // '') . '. Slanted: ' . plain($a->{c} // '') . '.', $b));
}

sub draw_ttrange {
    my ($a) = @_;
    my ($min, $max) = (num($a->{min}) // 0, num($a->{max}) // 14);
    my ($lo, $hi) = (num($a->{lo}), num($a->{hi}));
    my $show = $a->{show} // 1; $show = $KEY ? 1 : 0 if $show eq 'key';
    my $cell = $a->{cell} // max(20, min(36, int(440 / max(1, $max - $min))));
    my $top = $a->{title} ? 34 : 16;
    my $y = $top + 16;
    my $X = sub { 26 + ($_[0] - $min) * $cell };
    my $b = '';
    $b .= T(20, 18, $a->{title}, cls => 'dg-title') if $a->{title};
    $b .= arrow($X->($min) - 4, $y, $X->($max) + 18, $y, 'plain') . arrow($X->($max) + 4, $y, $X->($min) - 18, $y, 'plain');
    my $step = $cell >= 22 ? 1 : int(24 / $cell) + ($cell * int(24 / $cell) < 24 ? 1 : 0);   # thin the numbers when ticks are close
    for my $v ($min .. $max) { $b .= line($X->($v), $y - 5, $X->($v), $y + 5, 'dg-line') . (($v - $min) % $step == 0 ? T($X->($v), $y + 22, fmt($v), anchor => 'middle', cls => 'dg-label-sm') : ''); }
    if ($show && defined $lo && defined $hi) {
        $b .= rect($X->($lo), $y - 3, $X->($hi) - $X->($lo), 6, 'dg-shade');
        $b .= circ($X->($_), $y, 6, 'dg-fill-soft') . sprintf('<circle cx="%.1f" cy="%.1f" r="6" class="dg-accent"/>', $X->($_), $y) for ($lo, $hi);
    }
    my $H = $y + 32;
    if (defined $a->{label}) {
        (my $lab = $a->{label}) =~ s/ /\x{00A0}/g;   # SVG collapses plain spaces, which pushes the blank boxes out of place
        $b .= T(($X->($min) + $X->($max)) / 2, $H + 14, $lab, anchor => 'middle', cls => 'dg-math'); $H += 24;
    }
    return (svg($X->($max) + 40, $H, 'Number line from ' . fmt($min) . ' to ' . fmt($max) . ($show && defined $lo ? ', open dots at ' . fmt($lo) . ' and ' . fmt($hi) . ' with the part between shaded' : '') . '. ' . plain($a->{label} // ''), $b));
}

1;
