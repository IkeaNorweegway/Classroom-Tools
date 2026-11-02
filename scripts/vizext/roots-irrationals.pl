package Math8Viz; use strict; use warnings; use utf8; our (%DOC, $KEY);
use List::Util qw(max min);

# Square Roots & Irrational Numbers (Math 8, topic 2): the real numbers as
# rational (natural ⊂ integers ⊂ rational) beside irrational, and a benchmark
# ladder for estimating a square root between two perfect squares.

$DOC{srreal} = 'nat="1;9" int="0;−4" rat="½;0.{bar:3}" irr="√2;π" (examples in each box, ; between) hot=nat|int|rat|irr (shade one box) note="…" title width=600 (real numbers: the rational boxes nested on the left, irrational on the right)';
sub draw_srreal {
    my ($A) = @_;
    my $W = num($A->{width}) // 600;
    my $top = $A->{title} ? 26 : 6;
    my @nat = list($A->{nat}, qr/\s*;\s*/);
    my @int = list($A->{int}, qr/\s*;\s*/);
    my @rat = list($A->{rat}, qr/\s*;\s*/);
    my @irr = list($A->{irr}, qr/\s*;\s*/);
    my $rows = max(scalar @nat, scalar @int, scalar @rat, scalar @irr - 1, 2);
    my $hN = 46 + $rows * 26;
    my $hI = $hN + 46;
    my $hQ = $hI + 42;
    my $hR = $hQ + 46;
    my $hot = $A->{hot} // '';
    my $wR = $W - 12;
    my $xQ = 18; my $wQ = ($wR - 24) * 0.66;
    my $xI = $xQ + 14; my $wI = $wQ * 0.70;
    my $xN = $xI + 14; my $wN = $wQ * 0.38;
    my $xP = $xQ + $wQ + 12; my $wP = $wR + 6 - 12 - $xP;
    my ($yR, $yQ, $yI, $yN) = ($top, $top + 32, $top + 62, $top + 92);
    my $fill = sub { $hot eq $_[0] ? 'dg-fill-sun' : $_[1] };
    my $b = '';
    $b .= T(8, 16, $A->{title}, cls => 'dg-title') if $A->{title};
    $b .= rect(6, $yR, $wR, $hR, 'dg-outline', 28);
    $b .= T(22, $yR + 21, 'Real numbers', cls => 'dg-title');
    $b .= rect($xQ, $yQ, $wQ, $hQ, $fill->('rat', 'dg-fill-soft'), 24);
    $b .= rect($xI, $yI, $wI, $hI, $fill->('int', 'dg-fill-cold'), 20);
    $b .= rect($xN, $yN, $wN, $hN, $fill->('nat', 'dg-fill-plant'), 16);
    $b .= rect($xP, $yQ, $wP, $hQ, $fill->('irr', 'dg-fill-hot'), 24);
    $b .= rect($xQ, $yQ, $wQ, $hQ, 'dg-outline', 24);
    $b .= rect($xI, $yI, $wI, $hI, 'dg-outline', 20);
    $b .= rect($xN, $yN, $wN, $hN, 'dg-outline', 16);
    $b .= rect($xP, $yQ, $wP, $hQ, 'dg-outline', 24);
    $b .= T($xQ + 14, $yQ + 20, 'Rational', cls => 'dg-title');
    $b .= T($xI + 12, $yI + 20, 'Integers', cls => 'dg-title');
    $b .= T($xN + 10, $yN + 20, 'Natural', cls => 'dg-title');
    $b .= T($xP + $wP / 2, $yQ + 20, 'Irrational', cls => 'dg-title', anchor => 'middle');
    my $put = sub {
        my ($x, $y0, @v) = @_;
        my $s = '';
        for my $i (0 .. $#v) { $s .= T($x, $y0 + $i * 26, $v[$i], cls => 'dg-math', anchor => 'middle'); }
        return $s;
    };
    $b .= $put->($xN + $wN / 2, $yN + 46, @nat);
    $b .= $put->(($xN + $wN + $xI + $wI) / 2, $yN + 46, @int);
    $b .= $put->(($xI + $wI + $xQ + $wQ) / 2, $yN + 46, @rat);
    $b .= $put->($xP + $wP / 2, $yQ + 50, @irr);
    my $H = $yR + $hR + 6;
    if (defined $A->{note} && $A->{note} ne '') {
        $b .= T($W / 2, $H + 14, $A->{note}, cls => 'dg-label-accent', anchor => 'middle');
        $H += 24;
    }
    my $aria = 'Real numbers: rational numbers (natural numbers inside integers inside rational) beside irrational numbers. '
        . 'Natural: ' . join(', ', map { plain($_) } @nat) . '. Integers: ' . join(', ', map { plain($_) } @int)
        . '. Rational: ' . join(', ', map { plain($_) } @rat) . '. Irrational: ' . join(', ', map { plain($_) } @irr) . '.';
    $aria =~ s{\{bar:([^{}]+)\}}{$1 repeating}g;
    return (svg($W, $H, $aria, $b));
}

$DOC{srbench} = 'lo=7 hi=8 n=50 nlabel="50" est="√50 ≈ [[7.1]]" keydot=1 (dot and drop line for √n only in the key) dot=0 (no dot at all) mid=1 (label the halfway root) title width=560 (two number lines: perfect squares lo² to hi² on top, their roots lo to hi in tenths below; dashed lines join each square to its root)';
sub draw_srbench {
    my ($A) = @_;
    my ($lo, $hi) = (num($A->{lo}) // 7, num($A->{hi}) // 8);
    my $n = num($A->{n});
    my $W = num($A->{width}) // 560;
    my ($L, $R) = (110, $W - 30);
    my $top = $A->{title} ? 24 : 0;
    my ($y1, $y2) = ($top + 46, $top + 136);
    my ($s0, $s1) = ($lo * $lo, $hi * $hi);
    my $Xs = sub { $L + ($_[0] - $s0) / ($s1 - $s0) * ($R - $L) };
    my $Xr = sub { $L + ($_[0] - $lo) / ($hi - $lo) * ($R - $L) };
    my $b = '';
    $b .= T(8, 16, $A->{title}, cls => 'dg-title') if $A->{title};
    $b .= T(8, $y1 + 5, 'number', cls => 'dg-label');
    $b .= T(8, $y2 + 5, 'square root', cls => 'dg-label');
    $b .= line($L - 12, $y1, $R + 12, $y1, 'dg-line');
    $b .= line($L - 12, $y2, $R + 12, $y2, 'dg-line');
    my $span = $s1 - $s0;
    my $tstep = $span <= 30 ? 1 : 2;
    for (my $v = $s0; $v <= $s1 + 1e-9; $v += $tstep) { my $x = $Xs->($v); $b .= line($x, $y1 - 4, $x, $y1 + 4, 'dg-line'); }
    for my $i (0 .. 10) {
        my $v = $lo + $i * ($hi - $lo) / 10; my $x = $Xr->($v);
        my $big = ($i == 0 || $i == 10 || $i == 5);
        $b .= line($x, $y2 - ($big ? 7 : 4), $x, $y2 + ($big ? 7 : 4), 'dg-line');
    }
    # benchmarks
    for my $pair ([$s0, $lo], [$s1, $hi]) {
        my ($sq, $rt) = @$pair;
        my $x = $Xs->($sq);
        $b .= circ($x, $y1, 5, 'dg-point-accent');
        $b .= T($x, $y1 - 14, fmt($sq) . ' = ' . fmt($rt) . '²', anchor => 'middle', cls => 'dg-label');
        $b .= sprintf('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" class="dg-line" stroke-dasharray="4 4"/>', $x, $y1 + 6, $Xr->($rt), $y2 - 8);
        $b .= circ($Xr->($rt), $y2, 5, 'dg-point-accent');
        $b .= T($Xr->($rt), $y2 + 24, '√' . fmt($sq) . ' = ' . fmt($rt), anchor => 'middle', cls => 'dg-label');
    }
    $b .= T($Xr->(($lo + $hi) / 2), $y2 + 24, fmt(($lo + $hi) / 2), anchor => 'middle', cls => 'dg-label-sm') if $A->{mid};
    if (defined $n) {
        my $xs = $Xs->($n);
        $b .= circ($xs, $y1, 5.5, 'dg-point-accent');
        $b .= T($xs, $y1 + 22, $A->{nlabel} // fmt($n), anchor => 'middle', cls => 'dg-label-accent');
        my $show = !($A->{dot} // '1') ? 0 : $A->{keydot} ? $KEY : 1;
        if ($show) {
            my $xr = $Xr->(sqrt($n));
            $b .= sprintf('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" class="dg-accent" stroke-dasharray="3 3"/>', $xs, $y1 + 28, $xr, $y2 - 8);
            $b .= circ($xr, $y2, 5.5, 'dg-point-accent');
        }
        my $ex = $show ? $Xr->(sqrt($n)) : $xs;
        $b .= T($ex, $y2 + 46, $A->{est}, anchor => 'middle', cls => 'dg-label-accent') if defined $A->{est};
    }
    my $H = $y2 + (defined $A->{est} ? 56 : 34);
    my $aria = 'Two number lines. Top: numbers from ' . fmt($s0) . ' to ' . fmt($s1) . '. Bottom: square roots from ' . fmt($lo) . ' to ' . fmt($hi)
        . '.' . (defined $n ? ' The number ' . plain($A->{nlabel} // fmt($n)) . ' is marked' . (defined $A->{est} ? ': ' . plain($A->{est}) : '') . '.' : '');
    return (svg($W, $H, $aria, $b));
}

1;
