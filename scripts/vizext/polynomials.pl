package Math8Viz;
use strict;
use warnings;
use utf8;
use List::Util qw(max);
our %DOC;

# Polynomials (Math 8, topic 4): algebra tiles with x² tiles, a labelled term,
# like-term sorting bins and a vertical (column) sum.

$DOC{potiles} = 'rows="x2;2x;+3 | -x2!;x2!;-1" (| between rows; " = " splits sides; terms x2/x²/3x2, 2x, +3, -1; ! crosses a term out; "0" draws 0) labels="…;…" notes="…;[[…]]" title (algebra tiles with x² squares: green x², blue x, yellow 1, red negative)';
$DOC{poterm}  = 'c="3" v="x" e="2" (e="" or "1" hides the exponent) clabel="coefficient" vlabel="variable" elabel="exponent" expand="= 3 · x · x" note="degree [[2]]" (one big term with arrows naming its parts)';
$DOC{posort}  = 'bins="x² terms:3x²,−x²;x terms:2x,5x;numbers:4,−1" totals="[[2x²]];[[7x]];[[3]]" title (like-term bins: one column per kind, a total under each)';
$DOC{postack} = 'heads="x²;x;1" rows="3x²;+2x;−5 | x²;−4x;+1" op="+" result="[[4x²]];[[−2x]];[[−4]]" title (column sum: like terms lined up)';

sub po_terms {
    my ($s, $x0, $y0) = @_;
    my $b = ''; my $x = $x0;
    for my $t (list($s, qr/\s*;\s*/)) {
        (my $u = $t) =~ s/[−–]/-/g; $u =~ s/\s+//g; $u =~ s/²/2/g;
        my $gone = ($u =~ s/!$//);
        if ($u eq '0') { $b .= T($x + 8, $y0 + 34, '0', anchor => 'middle', cls => 'dg-math-lg'); $x += 28; next; }
        my ($sign, $c, $v) = $u =~ /^([+-]?)(\d*)(x2|x)?$/ or next;
        $v //= '';
        $c = $c eq '' ? 1 : $c;
        my $neg = $sign eq '-';
        for (1 .. $c) {
            my ($g, $yt, $w, $h);
            if ($v eq 'x2') {
                ($yt, $w, $h) = ($y0, 50, 50);
                $g = rect($x, $y0, 50, 50, $neg ? 'dg-fill-hot' : 'dg-fill-plant', 2) . T($x + 25, $y0 + 30, $neg ? '−x²' : 'x²', anchor => 'middle', cls => 'dg-label-sm');
            } elsif ($v eq 'x') {
                ($yt, $w, $h) = ($y0, 18, 50);
                $g = rect($x, $y0, 18, 50, $neg ? 'dg-fill-hot' : 'dg-fill-cold', 2) . T($x + 9, $y0 + 30, $neg ? '−x' : 'x', anchor => 'middle', cls => 'dg-label-sm');
            } else {
                ($yt, $w, $h) = ($y0 + 32, 18, 18);
                $g = rect($x, $y0 + 32, 18, 18, $neg ? 'dg-fill-hot' : 'dg-fill-sun', 2) . T($x + 9, $y0 + 45, $neg ? '−' : '+', anchor => 'middle', cls => 'dg-label-sm');
            }
            $b .= $gone ? '<g opacity="0.35">' . $g . '</g>' . line($x - 3, $yt + $h + 3, $x + $w + 3, $yt - 3, 'dg-accent') : $g;
            $x += $w + 6;
        }
        $x += 12;
    }
    return ($b, $x > $x0 ? $x - $x0 - 12 : 0);
}

sub draw_potiles {
    my ($A) = @_;
    my @rows = list($A->{rows} // $A->{terms}, qr/\s*\|\s*/);
    my @lab = list($A->{labels} // '', qr/\s*;\s*/);
    my @not = list($A->{notes} // '', qr/\s*;\s*/);
    my $lw = max(0, map { tilerow_tw($_, 13) } @lab);
    $lw += 14 if $lw;
    my $top = defined $A->{title} ? 30 : 8;
    my $rh = 64;
    my (@L, @R); my ($ml, $mr) = (0, 0);
    for my $r (@rows) {
        my ($l, $rr) = split /\s+=\s+/, $r, 2;
        push @L, $l; push @R, $rr;
        my (undef, $wl) = po_terms($l, 0, 0); $ml = max($ml, $wl);
        if (defined $rr) { my (undef, $wr) = po_terms($rr, 0, 0); $mr = max($mr, $wr); }
    }
    my $x0 = 10 + $lw;
    my $eqx = $x0 + $ml + 16;
    my $hasR = grep { defined } @R;
    my $rx = $hasR ? $eqx + 18 : $x0;
    my $nx = $hasR ? $rx + $mr + 22 : $x0 + $ml + 22;
    my $b = '';
    $b .= T(10, 18, $A->{title}, cls => 'dg-title') if defined $A->{title};
    my $wn = 0;
    for my $i (0 .. $#rows) {
        my $y = $top + $i * $rh;
        $b .= line(8, $y - 6, $nx - 12, $y - 6, 'dg-grid') if $i > 0;
        $b .= T(10, $y + 32, $lab[$i], cls => 'dg-label') if defined $lab[$i] && $lab[$i] ne '';
        my ($bl) = po_terms($L[$i], $x0, $y); $b .= $bl;
        if (defined $R[$i]) {
            $b .= T($eqx, $y + 33, '=', anchor => 'middle', cls => 'dg-math-lg');
            my ($br) = po_terms($R[$i], $rx, $y); $b .= $br;
        }
        if (defined $not[$i] && $not[$i] ne '') { $b .= T($nx, $y + 33, $not[$i], cls => 'dg-math'); $wn = max($wn, tilerow_tw($not[$i], 15)); }
    }
    my $W = max($nx + $wn + 10, defined $A->{title} ? tw(plain($A->{title}), 13) + 20 : 0);
    my $H = $top + @rows * $rh - 4;
    my $aria = 'Algebra tiles: ' . join('; then ', map { my $t = plain($rows[$_]); $t =~ s/!//g; $t =~ s/x2/x²/g; $t . (defined $not[$_] && $not[$_] ne '' ? ' (' . plain($not[$_]) . ')' : '') } 0 .. $#rows);
    return (svg($W, $H, $aria, $b));
}

# poterm: one big term (coefficient, variable, exponent) with arrows to the names.
sub draw_poterm {
    my ($A) = @_;
    my $c = $A->{c} // ''; my $v = $A->{v} // 'x'; my $e = $A->{e} // '';
    $e = '' if $e eq '1' && !defined $A->{showone};
    my $fs = 46;
    my $cw = length($c) * $fs * 0.56; my $vw = $fs * 0.52; my $ew = length($e) * 26 * 0.56;
    my $termw = $cw + $vw + $ew;
    my $W = max(400, $termw + 260);
    my $tx = ($W - $termw) / 2;
    my $base = 112;
    my $b = '';
    $b .= sprintf('<text x="%.1f" y="%.1f" class="dg-math" style="font-size:%dpx">%s</text>', $tx, $base, $fs, xesc($c)) if $c ne '';
    $b .= sprintf('<text x="%.1f" y="%.1f" class="dg-math" style="font-size:%dpx;font-style:italic">%s</text>', $tx + $cw, $base, $fs, xesc($v));
    $b .= sprintf('<text x="%.1f" y="%.1f" class="dg-math" style="font-size:26px">%s</text>', $tx + $cw + $vw + 2, $base - 24, xesc($e)) if $e ne '';
    my @aria = ("The term $c$v" . ($e ne '' ? "^$e" : ''));
    if (defined $A->{clabel} && $c ne '') {
        my $cx = $tx + $cw / 2;
        $b .= arrow(70, 150, $cx - 6, $base + 8, 'accent') . T(20, 166, $A->{clabel}, cls => 'dg-label-accent');
        push @aria, plain($A->{clabel});
    }
    if (defined $A->{vlabel}) {
        my $vx = $tx + $cw + $vw / 2;
        $b .= arrow($vx, 32, $vx, $base - 38, 'plain') . T($vx, 22, $A->{vlabel}, anchor => 'middle', cls => 'dg-label');
        push @aria, plain($A->{vlabel});
    }
    if (defined $A->{elabel} && $e ne '') {
        my $ex = $tx + $cw + $vw + 2 + $ew / 2;
        $b .= arrow($W - 70, 52, $ex + 8, $base - 40, 'accent') . T($W - 20, 46, $A->{elabel}, anchor => 'end', cls => 'dg-label-accent');
        push @aria, plain($A->{elabel});
    }
    my $H = 176;
    if (defined $A->{expand}) {
        $b .= T($W / 2, $H + 8, $A->{expand}, anchor => 'middle', cls => 'dg-math-lg'); $H += 22; push @aria, plain($A->{expand});
    }
    if (defined $A->{note}) {
        $b .= T($W / 2, $H + 14, $A->{note}, anchor => 'middle', cls => 'dg-math'); $H += 24; push @aria, plain($A->{note});
    }
    return (svg($W, $H + 4, join('. ', @aria), $b));
}

# posort: like-term bins.
sub draw_posort {
    my ($A) = @_;
    my @bins = map { my ($h, $l) = split /\s*:\s*/, $_, 2; [$h, [list($l // '', qr/\s*,\s*/)]] } list($A->{bins}, qr/\s*;\s*/);
    my @tot = list($A->{totals} // '', qr/\s*;\s*/);
    my @fill = ('dg-fill-plant', 'dg-fill-cold', 'dg-fill-sun', 'dg-fill-soft', 'dg-fill-accent');
    my $bw = 0;
    for my $i (0 .. $#bins) {
        $bw = max($bw, tilerow_tw($bins[$i][0], 13) + 24, (map { tilerow_tw($_, 15) + 24 } @{ $bins[$i][1] }), defined $tot[$i] ? tilerow_tw($tot[$i], 15) + 24 : 0, 96);
    }
    my $n = max(1, map { scalar @{ $_->[1] } } @bins);
    my $top = defined $A->{title} ? 30 : 8;
    my $bh = 34 + $n * 24 + 8;
    my $b = '';
    $b .= T(10, 18, $A->{title}, cls => 'dg-title') if defined $A->{title};
    my @aria;
    for my $i (0 .. $#bins) {
        my $x = 10 + $i * ($bw + 14);
        $b .= rect($x, $top, $bw, $bh, $fill[$i % @fill], 6);
        $b .= T($x + $bw / 2, $top + 20, $bins[$i][0], anchor => 'middle', cls => 'dg-title');
        $b .= line($x + 8, $top + 28, $x + $bw - 8, $top + 28, 'dg-grid');
        my $j = 0;
        for my $it (@{ $bins[$i][1] }) { $b .= T($x + $bw / 2, $top + 50 + $j * 24, $it, anchor => 'middle', cls => 'dg-math'); $j++; }
        if (defined $tot[$i] && $tot[$i] ne '') {
            $b .= arrow($x + $bw / 2, $top + $bh + 2, $x + $bw / 2, $top + $bh + 22, 'plain');
            $b .= T($x + $bw / 2, $top + $bh + 42, $tot[$i], anchor => 'middle', cls => 'dg-math');
        }
        push @aria, plain($bins[$i][0]) . ': ' . join(', ', map { plain($_) } @{ $bins[$i][1] }) . (defined $tot[$i] ? ' → ' . plain($tot[$i]) : '');
    }
    my $W = max(20 + @bins * ($bw + 14) - 14, defined $A->{title} ? tw(plain($A->{title}), 13) + 20 : 0);
    my $H = $top + $bh + (@tot ? 52 : 6);
    return (svg($W, $H, 'Like-term bins. ' . join('. ', @aria), $b));
}

# postack: like terms lined up in columns, then a line and the result.
sub draw_postack {
    my ($A) = @_;
    my @heads = list($A->{heads} // '', qr/\s*;\s*/);
    my @rows = map { [split /\s*;\s*/, $_, -1] } list($A->{rows}, qr/\s*\|\s*/);
    my @res = defined $A->{result} ? split(/\s*;\s*/, $A->{result}, -1) : ();
    my $nc = max(scalar @heads, scalar @res, map { scalar @$_ } @rows);
    my $cw = 0;
    for my $r (@rows, \@res, \@heads) { $cw = max($cw, map { tilerow_tw($_ // '', 15) + 22 } @$r); }
    $cw = max($cw, 70);
    my $top = defined $A->{title} ? 30 : 8;
    my $x0 = 40;
    my $b = '';
    $b .= T(10, 18, $A->{title}, cls => 'dg-title') if defined $A->{title};
    my $y = $top;
    if (@heads) {
        for my $j (0 .. $#heads) { $b .= T($x0 + $j * $cw + $cw / 2, $y + 14, $heads[$j], anchor => 'middle', cls => 'dg-label-accent'); }
        $y += 22;
    }
    for my $j (0 .. $nc - 1) { $b .= rect($x0 + $j * $cw + 3, $y - 4, $cw - 6, @rows * 30 + 6, 'dg-fill-soft', 4); }
    for my $i (0 .. $#rows) {
        $b .= T(14, $y + 20, $A->{op} // '+', cls => 'dg-math-lg') if $i == $#rows && @rows > 1;
        for my $j (0 .. $#{ $rows[$i] }) { $b .= T($x0 + $j * $cw + $cw / 2, $y + 19, $rows[$i][$j], anchor => 'middle', cls => 'dg-math'); }
        $y += 30;
    }
    $y += 6;
    $b .= line(10, $y, $x0 + $nc * $cw, $y, 'dg-line');
    $y += 6;
    if (@res) {
        for my $j (0 .. $#res) { $b .= T($x0 + $j * $cw + $cw / 2, $y + 20, $res[$j], anchor => 'middle', cls => 'dg-math'); }
        $y += 30;
    }
    my $W = max($x0 + $nc * $cw + 10, defined $A->{title} ? tw(plain($A->{title}), 13) + 20 : 0);
    my $aria = 'Column sum. ' . join(' ', map { join(' ', map { plain($_) } @$_) } @rows) . (@res ? ' gives ' . join(' ', map { plain($_) } @res) : '');
    return (svg($W, $y + 6, $aria, $b));
}

1;
