package Math8Viz;
# Math 8 Independent & Dependent Events (topic 12): tree diagrams whose
# second-stage branches can change (without replacement) and can have three
# stages; a two-dice table; a bag before and after one draw.
use strict;
use warnings;
use utf8;
use POSIX qw(ceil floor);
use List::Util qw(max min sum);
our %DOC;
our $KEY;

$DOC{cptree} = 'first="R,B" p1="3/5,2/5" second="R,B" (same under every branch) or "R,B|R,B" (one list per first branch) p2="2/4,2/4|3/4,1/4" (per branch with |, or one list for all) third="H,T" p3="1/2,1/2" (optional 3rd stage, same under every branch) outcomes=show|blank|none probs="6/20;[[6/20]];…" (one per leaf, column headed P) hot="RR;BB" (shade those leaves) sep="," (between the parts of an outcome name) ow=64 (width of the outcome column) title (tree diagram for two or three events)';
$DOC{cpsum}  = 'rows="1,2,3,4,5,6" cols="1,2,3,4,5,6" op=sum|pair|product hot="7" (shade cells with these values) blank=1 (every cell a blank) rowlabel="red die" collabel="blue die" (two-dice table)';
$DOC{cpdraw} = 'before="red:3;blue:2" take="red" (the counter drawn and kept out) after="red:2;blue:2" (default: before minus take) beforelabel="5 counters" afterlabel="[[4]] left" takelabel="1st draw" title (a bag before and after one draw without replacement)';

my %CPCOL = (red => 'dg-fill-hot', blue => 'dg-fill-cold', green => 'dg-fill-plant', yellow => 'dg-fill-sun', orange => 'dg-fill-earth', purple => 'dg-fill-accent', white => 'dg-fill-soft', black => 'dg-solid-accent');

sub cp_leafname { my $s = shift; $s = plain($s); $s =~ s/\s+//g; return $s; }

sub draw_cptree {
    my ($a) = @_;
    my @f = list($a->{first});
    my @p1 = list($a->{p1});
    my @sec = split /\s*\|\s*/, ($a->{second} // '');
    my @s = map { [list($sec[@sec > 1 ? $_ : 0])] } 0 .. $#f;
    my @pp = split /\s*\|\s*/, ($a->{p2} // '');
    my @p2 = map { [list($pp[@pp > 1 ? $_ : 0] // '')] } 0 .. $#f;
    my @t = list($a->{third});
    my @p3 = list($a->{p3});
    my @probs = list($a->{probs}, qr/\s*;\s*/);
    my %hot = map { $_ => 1 } list($a->{hot}, qr/\s*;\s*/);
    my $out = $a->{outcomes} // 'show';
    my $three = @t > 0;
    my $leaf_h = $three ? 27 : 28;
    my $nleaf = 0;
    for my $i (0 .. $#f) { $nleaf += @{ $s[$i] } * ($three ? scalar(@t) : 1); }
    my $mt = defined $a->{title} ? 40 : 24;
    my $H = $mt + $nleaf * $leaf_h + 8;
    my @x = $three ? (16, 110, 220, 330) : (16, 130, 270);
    my $xo = $x[-1] + 40;
    my $xp = $xo + ($a->{ow} // ($three ? 70 : 64));
    my $b = '';
    $b .= T(($xp + 60) / 2, 18, $a->{title}, anchor => 'middle', cls => 'dg-title') if defined $a->{title};
    my $root = $mt + $nleaf * $leaf_h / 2;
    $b .= circ($x[0], $root, 4, 'dg-point');
    my $plab = sub {   # probability label part-way along a branch, above the line
        my ($xa, $ya, $xb, $yb, $p, $f) = @_;
        return '' unless defined $p && $p ne '';
        my ($px, $py) = ($xa + $f * ($xb - $xa), $ya + $f * ($yb - $ya));
        my $dy = $yb < $ya ? -5 : $yb > $ya ? 13 : -5;
        $dy = -6 if abs($yb - $ya) < 6;
        return T($px, $py + $dy, $p, anchor => 'middle', cls => 'dg-label-sm');
    };
    my $k = 0;
    for my $i (0 .. $#f) {
        my $n1 = @{ $s[$i] } * ($three ? scalar(@t) : 1);
        my $y1 = $mt + ($k + $n1 / 2) * $leaf_h;
        $b .= line($x[0] + 4, $root, $x[1] - 14, $y1, 'dg-line');
        $b .= $plab->($x[0] + 4, $root, $x[1] - 14, $y1, $p1[$i], 0.5);
        $b .= T($x[1], $y1 + 4, $f[$i], anchor => 'middle', cls => 'dg-label-accent');
        for my $j (0 .. $#{ $s[$i] }) {
            my $n2 = $three ? scalar(@t) : 1;
            my $y2 = $mt + ($k + $n2 / 2) * $leaf_h;
            $b .= line($x[1] + 14, $y1, $x[2] - 14, $y2, 'dg-line');
            $b .= $plab->($x[1] + 14, $y1, $x[2] - 14, $y2, $p2[$i][$j], 0.55);
            $b .= T($x[2], $y2 + 4, $s[$i][$j], anchor => 'middle', cls => 'dg-label-accent');
            my @leaves = $three ? map { [$_, $t[$_]] } 0 .. $#t : ([undef, undef]);
            for my $L (@leaves) {
                my $y3 = $mt + ($k + 0.5) * $leaf_h;
                my $sep = $a->{sep} // '';
                my $name = cp_leafname($f[$i]) . $sep . cp_leafname($s[$i][$j]);
                if ($three) {
                    $b .= line($x[2] + 14, $y2, $x[3] - 12, $y3, 'dg-line');
                    $b .= $plab->($x[2] + 14, $y2, $x[3] - 12, $y3, $p3[$L->[0]], 0.6);
                    $b .= T($x[3], $y3 + 4, $L->[1], anchor => 'middle', cls => 'dg-label-accent');
                    $name .= $sep . cp_leafname($L->[1]);
                }
                $b .= rect($xo - 6, $y3 - $leaf_h / 2 + 2, $xp - $xo + (@probs ? 70 : 0), $leaf_h - 4, 'dg-fill-sun', 4) if $hot{$name};
                $b .= T($xo, $y3 + 4, $out eq 'blank' ? "[[$name]]" : $name, cls => 'dg-label') if $out ne 'none';
                $b .= T($xp, $y3 + 4, $probs[$k], cls => 'dg-label') if defined $probs[$k];
                $k++;
            }
        }
    }
    $b .= T($xo, $mt - 8, 'Outcome', cls => 'dg-label-sm') if $out ne 'none';
    $b .= T($xp, $mt - 8, 'P', cls => 'dg-label-sm') if @probs;
    my $W = (@probs ? $xp + 80 : $xo + 70);
    return (svg($W, $H, "Tree diagram with $nleaf outcomes. First: " . join(', ', map { plain($_) } @f) . '.', $b));
}

sub draw_cpsum {
    my ($a) = @_;
    my @r = list($a->{rows} // '1,2,3,4,5,6');
    my @c = list($a->{cols} // '1,2,3,4,5,6');
    my $op = $a->{op} // 'sum';
    my %hot = map { $_ => 1 } list($a->{hot}, qr/\s*[;,]\s*/);
    my ($cw, $ch) = ($op eq 'pair' ? 46 : 34, 26);
    my $x0 = 34 + (defined $a->{rowlabel} ? 18 : 0);
    my $y0 = 30 + (defined $a->{collabel} ? 16 : 0);
    my $b = '';
    $b .= T($x0 + @c * $cw / 2, 14, $a->{collabel}, anchor => 'middle', cls => 'dg-label-accent') if defined $a->{collabel};
    if (defined $a->{rowlabel}) {
        $b .= sprintf('<g transform="translate(14,%.1f) rotate(-90)">', $y0 + @r * $ch / 2) . T(0, 0, $a->{rowlabel}, anchor => 'middle', cls => 'dg-label-accent') . '</g>';
    }
    my $sym = $op eq 'product' ? '×' : $op eq 'sum' ? '+' : '';
    $b .= T($x0 - 12, $y0 - 9, $sym, anchor => 'middle', cls => 'dg-label') if $sym;
    for my $j (0 .. $#c) { $b .= T($x0 + $j * $cw + $cw / 2, $y0 - 9, $c[$j], anchor => 'middle', cls => 'dg-label-accent'); }
    for my $i (0 .. $#r) {
        $b .= T($x0 - 12, $y0 + $i * $ch + 18, $r[$i], anchor => 'middle', cls => 'dg-label-accent');
        for my $j (0 .. $#c) {
            my ($u, $v) = (num($r[$i]), num($c[$j]));
            my $val = $op eq 'pair' ? "$r[$i],$c[$j]" : $op eq 'product' ? $u * $v : $u + $v;
            my $x = $x0 + $j * $cw; my $y = $y0 + $i * $ch;
            $b .= rect($x, $y, $cw, $ch, $hot{$val} ? 'dg-fill-sun' : 'dg-fill-soft') . rect($x, $y, $cw, $ch, 'dg-outline');
            $b .= T($x + $cw / 2, $y + 18, $a->{blank} ? "[[$val]]" : $val, anchor => 'middle', cls => 'dg-label');
        }
    }
    return (svg($x0 + @c * $cw + 10, $y0 + @r * $ch + 10, 'Table of ' . (@r * @c) . " outcomes for two dice, showing the $op of each pair", $b));
}

sub cp_bag {
    my ($x0, $y0, $list, $label) = @_;
    my @all = @$list;
    my $n = @all;
    my $cols = $n <= 4 ? 2 : $n <= 9 ? 3 : 4;
    my $rows = ceil($n / $cols) || 1;
    my $d = 26;
    my $bw = $cols * $d + 24;
    my $bh = $rows * $d + 22;
    my $b = poly('dg-fill-earth', $x0 + $bw * 0.3, $y0 + 18, $x0 + $bw * 0.22, $y0, $x0 + $bw * 0.78, $y0, $x0 + $bw * 0.7, $y0 + 18);
    $b .= rect($x0, $y0 + 16, $bw, $bh, 'dg-fill-earth', 16);
    $b .= rect($x0 + $bw * 0.28, $y0 + 11, $bw * 0.44, 8, 'dg-fill-hot', 3);
    for my $k (0 .. $n - 1) {
        my ($r, $q) = (floor($k / $cols), $k % $cols);
        my $inrow = $r == $rows - 1 ? $n - $r * $cols : $cols;
        my $cx = $x0 + 12 + ($cols - $inrow) * $d / 2 + $q * $d + $d / 2;
        my $cy = $y0 + 16 + 11 + $r * $d + $d / 2;
        $b .= circ($cx, $cy, 11, 'dg-boundary') . circ($cx, $cy, 11, $CPCOL{ lc $all[$k] } // 'dg-fill-soft');
        $b .= T($cx, $cy + 4, uc substr($all[$k], 0, 1), anchor => 'middle', cls => 'dg-label-sm');
    }
    $b .= T($x0 + $bw / 2, $y0 + 16 + $bh + 18, $label, anchor => 'middle', cls => 'dg-label') if defined $label;
    return ($b, $bw, 16 + $bh + 24);
}

sub draw_cpdraw {
    my ($a) = @_;
    my @bef; for my $q (items($a->{before})) { push @bef, ($q->[0]) x (num($q->[1]) // 1); }
    my $take = $a->{take} // $bef[0];
    my @aft;
    if (defined $a->{after}) { for my $q (items($a->{after})) { push @aft, ($q->[0]) x (num($q->[1]) // 1); } }
    else { my $gone = 0; @aft = grep { !(!$gone && lc $_ eq lc $take && ($gone = 1)) } @bef; }
    my $mt = defined $a->{title} ? 28 : 6;
    my ($b1, $w1, $h1) = cp_bag(10, $mt, \@bef, $a->{beforelabel} // 'before');
    my $ax = 10 + $w1 + 12;
    my $cy = $mt + 16 + ($h1 - 24) / 2;
    my $b = $b1;
    $b .= arrow($ax, $cy, $ax + 84, $cy, 'accent');
    $b .= circ($ax + 42, $cy - 24, 12, 'dg-boundary') . circ($ax + 42, $cy - 24, 12, $CPCOL{ lc $take } // 'dg-fill-soft');
    $b .= T($ax + 42, $cy - 20, uc substr($take, 0, 1), anchor => 'middle', cls => 'dg-label-sm');
    $b .= T($ax + 42, $cy + 18, $a->{takelabel} // 'take one out', anchor => 'middle', cls => 'dg-label-sm');
    $b .= T($ax + 42, $cy + 32, 'keep it out', anchor => 'middle', cls => 'dg-label-sm') unless defined $a->{takelabel};
    my ($b2, $w2, $h2) = cp_bag($ax + 96, $mt, \@aft, $a->{afterlabel} // 'after');
    $b .= $b2;
    $b = T(($ax + 96 + $w2 + 10) / 2, 18, $a->{title}, anchor => 'middle', cls => 'dg-title') . $b if defined $a->{title};
    return (svg($ax + 96 + $w2 + 12, $mt + max($h1, $h2) + 4, 'A bag of ' . scalar(@bef) . " counters. One $take counter is taken out and kept out. " . scalar(@aft) . ' counters are left.', $b));
}

1;
