package Math8Viz; use strict; use warnings; use utf8; our %DOC;
use List::Util qw(max min);

# Rational Numbers (Math 8, topic 1): nested number sets and long division
# that shows a decimal ending or repeating.

$DOC{rnsets} = 'nat="1;2;17" int="0;−3;−40" rat="½;−0.75;0.3̅" (examples in each ring, ; between) hot=nat|int|rat (shade one ring) note="5 = 5/1" title width=520 (natural ⊂ integers ⊂ rational, as nested boxes)';
sub draw_rnsets {
    my ($A) = @_;
    my $W = num($A->{width}) // 520;
    my $top = $A->{title} ? 26 : 6;
    my @nat = list($A->{nat}, qr/\s*;\s*/);
    my @int = list($A->{int}, qr/\s*;\s*/);
    my @rat = list($A->{rat}, qr/\s*;\s*/);
    my $rows = max(scalar @nat, scalar @int, scalar @rat, 3);
    my $hN = 50 + $rows * 26;            # natural box height
    my $hI = $hN + 50;                   # integers box
    my $hR = $hI + 44;                   # rational box
    my $hot = $A->{hot} // '';
    my ($xR, $xI, $xN) = (6, 22, 40);
    my $wR = $W - 12;
    my $wI = $wR * 0.70;
    my $wN = $wR * 0.38;
    my ($yR, $yI, $yN) = ($top, $top + 30, $top + 62);
    my $b = '';
    $b .= T(8, 16, $A->{title}, cls => 'dg-title') if $A->{title};
    $b .= rect($xR, $yR, $wR, $hR, $hot eq 'rat' ? 'dg-fill-sun' : 'dg-fill-soft', 26);
    $b .= rect($xI, $yI, $wI, $hI, $hot eq 'int' ? 'dg-fill-sun' : 'dg-fill-cold', 22);
    $b .= rect($xN, $yN, $wN, $hN, $hot eq 'nat' ? 'dg-fill-sun' : 'dg-fill-plant', 18);
    $b .= rect($xR, $yR, $wR, $hR, 'dg-outline', 26);
    $b .= rect($xI, $yI, $wI, $hI, 'dg-outline', 22);
    $b .= rect($xN, $yN, $wN, $hN, 'dg-outline', 18);
    $b .= T($xR + 16, $yR + 20, 'Rational numbers', cls => 'dg-title');
    $b .= T($xI + 16, $yI + 20, 'Integers', cls => 'dg-title');
    $b .= T($xN + 14, $yN + 20, 'Natural numbers', cls => 'dg-title');
    my $put = sub {
        my ($x, $y0, @v) = @_;
        my $s = '';
        for my $i (0 .. $#v) { $s .= T($x, $y0 + $i * 26, $v[$i], cls => 'dg-math', anchor => 'middle'); }
        return $s;
    };
    $b .= $put->($xN + $wN / 2, $yN + 48, @nat);
    $b .= $put->(($xN + $wN + $xI + $wI) / 2, $yN + 48, @int);
    $b .= $put->(($xI + $wI + $xR + $wR) / 2, $yN + 48, @rat);
    my $H = $yR + $hR + 6;
    if (defined $A->{note} && $A->{note} ne '') {
        $b .= T($W / 2, $H + 14, $A->{note}, cls => 'dg-label-accent', anchor => 'middle');
        $H += 24;
    }
    my $aria = 'Nested boxes: natural numbers inside integers inside rational numbers. '
        . 'Natural: ' . join(', ', map { plain($_) } @nat) . '. Integers: ' . join(', ', map { plain($_) } @int)
        . '. Rational: ' . join(', ', map { plain($_) } @rat) . '.';
    return (svg($W, $H, $aria, $b));
}

$DOC{rndiv} = 'a=2 b=11 steps=6 blank=1 (digits and remainders are blanks) result="2/11 = 0.1̅8̅" (long division as rows: bring down a 0, divide, write the digit, keep the remainder; stops when the remainder is 0; rings a remainder that comes back) title';
sub draw_rndiv {
    my ($A) = @_;
    my ($a, $d) = (num($A->{a}) // 1, num($A->{b}) // 3);
    my $max = num($A->{steps}) // 6;
    my $blank = $A->{blank};
    my @rows; my %seen; my $r = $a % $d; my $rep;
    my $whole = int($a / $d);
    $seen{$r} = 0;
    for my $i (1 .. $max) {
        my $n = $r * 10;
        my $q = int($n / $d);
        my $nr = $n % $d;
        push @rows, [$n, $q, $nr];
        $r = $nr;
        last if $r == 0;
        if (exists $seen{$r} && !defined $rep) { $rep = $i; }
        $seen{$r} //= $i;
    }
    my $top = $A->{title} ? 30 : 10;
    my @cx = (20, 120, 230, 330);
    my $b = '';
    $b .= T(10, 18, $A->{title}, cls => 'dg-title') if $A->{title};
    my @hd = ('Bring down 0', "÷ $d", 'Digit', 'Remainder');
    for my $j (0 .. 3) { $b .= T($cx[$j], $top + 12, $hd[$j], cls => 'dg-label-sm'); }
    $b .= line(10, $top + 20, 420, $top + 20, 'dg-line');
    my $y = $top + 42;
    my $blk = sub { my $v = shift; return $blank ? "[[$v]]" : $v; };
    for my $i (0 .. $#rows) {
        my ($n, $q, $nr) = @{ $rows[$i] };
        $b .= T($cx[0], $y, "$n", cls => 'dg-math');
        $b .= T($cx[1], $y, "$n ÷ $d", cls => 'dg-math');
        $b .= T($cx[2] + 10, $y, $blk->($q), cls => 'dg-math-accent');
        $b .= T($cx[3] + 10, $y, $blk->($nr), cls => 'dg-math');
        if (defined $rep && $i + 1 == $rep) {
            $b .= circ($cx[3] + 18, $y - 5, 16, 'dg-accent');
            $b .= T($cx[3] + 42, $y, 'back again!', cls => 'dg-label-accent');
        }
        if ($nr == 0) { $b .= T($cx[3] + 42, $y, 'ends', cls => 'dg-label-accent'); }
        $y += 28;
    }
    my $H = $y - 6;
    if (defined $A->{result}) {
        $b .= T(20, $y + 8, $A->{result}, cls => 'dg-math');
        $H = $y + 22;
    }
    my $aria = "Long division of $a by $d, one row per digit" . (defined $A->{result} ? ': ' . plain($A->{result}) : '');
    return (svg(max(460, defined $A->{result} ? tw(plain($A->{result}), 15) + 40 : 0), $H, $aria, $b));
}

1;
