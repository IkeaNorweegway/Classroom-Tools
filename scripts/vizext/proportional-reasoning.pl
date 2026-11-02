package Math8Viz; use strict; use warnings; use utf8; our %DOC;
use List::Util qw(max min);

# Proportional Reasoning (Math 8, topic 3): "times as many" comparison bars,
# a ratio table with × k arrows from each first term to its second term,
# and a workers-and-days array picture for inverse proportion.

$DOC{prtimes} = 'rows="Ben:1;Ava:3" (name:number of blocks; decimals draw a part block) value="4" (written in each block) down="× 3" (arrow from row 1 to row 2) up="× 1/3" (arrow from row 2 to row 1) total="12;4" (a total after each row, ; between) title (times-as-many comparison bars)';
sub draw_prtimes {
    my ($A) = @_;
    my @rows = items($A->{rows});
    my @tot = list($A->{total}, qr/\s*;\s*/);
    my $maxc = max(map { num($_->[1]) // 1 } @rows);
    $maxc = int($maxc - 1e-9) + 1 if $maxc - int($maxc + 1e-9) > 0.01;   # a part block's dashed full block needs room too
    my $lw = max(map { tw($_->[0] // '', 12) } @rows) + 20;
    my $u = min(60, int(360 / ($maxc || 1)));
    my ($bh, $gap) = (32, 22);
    my $top = $A->{title} ? 28 : 10;
    my $b = '';
    $b .= T(8, 16, $A->{title}, cls => 'dg-title') if $A->{title};
    my $y = $top;
    my @ymid;
    my $xr = $lw + $maxc * $u;
    for my $i (0 .. $#rows) {
        my ($name, $c) = @{ $rows[$i] };
        $c = num($c) // 1;
        $b .= T(10, $y + $bh / 2 + 5, $name);
        my $full = int($c + 1e-9);
        my $part = $c - $full;
        for my $j (0 .. $full - 1) {
            $b .= rect($lw + $j * $u, $y, $u, $bh, $i % 2 ? 'dg-fill-sun' : 'dg-fill-accent');
            $b .= rect($lw + $j * $u, $y, $u, $bh, 'dg-outline');
            $b .= T($lw + $j * $u + $u / 2, $y + $bh / 2 + 5, $A->{value}, anchor => 'middle', cls => 'dg-label-sm') if defined $A->{value};
        }
        if ($part > 0.01) {
            my $x = $lw + $full * $u;
            $b .= rect($x, $y, $u * $part, $bh, $i % 2 ? 'dg-fill-sun' : 'dg-fill-accent');
            $b .= rect($x, $y, $u * $part, $bh, 'dg-outline');
            $b .= rect($x, $y, $u, $bh, 'dg-dashed');
        }
        $b .= T($xr + 12, $y + $bh / 2 + 5, $tot[$i], cls => 'dg-label') if defined $tot[$i] && $tot[$i] ne '';
        push @ymid, $y + $bh / 2;
        $y += $bh + $gap;
    }
    my $tw = max(map { tw(plain($_), 12) } (@tot, ''));
    my $W = $xr + ($tw ? $tw + 24 : 10);
    if (@rows >= 2 && (defined $A->{down} || defined $A->{up})) {
        my $x = $W + 14;
        if (defined $A->{down}) {
            $b .= arrow($x, $ymid[0] - 4, $x, $ymid[1] + 4, 'accent');
            $b .= T($x + 8, ($ymid[0] + $ymid[1]) / 2 + 5, $A->{down}, cls => 'dg-label-accent');
            $x += 22 + tw(plain($A->{down}), 11) + ($A->{down} =~ /\[\[/ ? 24 : 0);
        }
        if (defined $A->{up}) {
            $b .= arrow($x, $ymid[1] + 4, $x, $ymid[0] - 4, 'accent');
            $b .= T($x + 8, ($ymid[0] + $ymid[1]) / 2 + 5, $A->{up}, cls => 'dg-label-accent');
            $x += 22 + tw(plain($A->{up}), 11) + ($A->{up} =~ /\[\[/ ? 24 : 0);
        }
        $W = $x + 4;
    }
    my $aria = 'Comparison bars: ' . join('; ', map { "$_->[0] $_->[1] blocks" } @rows)
        . (defined $A->{value} ? ', each block ' . plain($A->{value}) : '') . '.';
    return (svg($W, $y - $gap + 8, $aria, $b));
}

$DOC{prk} = 'top="2,4,6" bottom="5,10,15" toplabel="concentrate" bottomlabel="water" k="× 2.5" one=1 (label only the first arrow) title (ratio table with a × k arrow from each first term down to its second term)';
sub draw_prk {
    my ($A) = @_;
    my @top = list($A->{top});
    my @bot = list($A->{bottom});
    my $n = max(scalar @top, scalar @bot);
    my $lw = max(tw($A->{toplabel} // '', 12), tw($A->{bottomlabel} // '', 12)) + 20;
    my $cw = max(64, map { tw(plain($_), 12) + 30 } @top, @bot);
    my $top = $A->{title} ? 28 : 8;
    my ($rh, $gap) = (32, 52);
    my ($y1, $y2) = ($top, $top + $rh + $gap);
    my $b = '';
    $b .= T(8, 16, $A->{title}, cls => 'dg-title') if $A->{title};
    $b .= rect(4, $y1, $lw, $rh, 'dg-fill-soft') . rect(4, $y2, $lw, $rh, 'dg-fill-soft');
    $b .= T(12, $y1 + 21, $A->{toplabel}, cls => 'dg-label-accent') if $A->{toplabel};
    $b .= T(12, $y2 + 21, $A->{bottomlabel}, cls => 'dg-label-accent') if $A->{bottomlabel};
    for my $i (0 .. $n - 1) {
        my $x = 4 + $lw + $i * $cw;
        $b .= rect($x, $y1, $cw, $rh, 'dg-fill-accent') . rect($x, $y2, $cw, $rh, 'dg-fill-sun');
        $b .= rect($x, $y1, $cw, $rh, 'dg-outline') . rect($x, $y2, $cw, $rh, 'dg-outline');
        $b .= T($x + $cw / 2, $y1 + 21, $top[$i], anchor => 'middle', cls => 'dg-math') if defined $top[$i];
        $b .= T($x + $cw / 2, $y2 + 21, $bot[$i], anchor => 'middle', cls => 'dg-math') if defined $bot[$i];
        my $ax = $x + 16;
        $b .= arrow($ax, $y1 + $rh + 4, $ax, $y2 - 4, 'accent');
        $b .= T($ax + 7, $y1 + $rh + $gap / 2 + 5, $A->{k}, cls => 'dg-label-accent') if defined $A->{k} && (!$A->{one} || $i == 0);
    }
    $b .= rect(4, $y1, $lw + $n * $cw, $rh, 'dg-outline') . rect(4, $y2, $lw + $n * $cw, $rh, 'dg-outline');
    my $W = 8 + $lw + $n * $cw;
    my $aria = 'Ratio table. ' . ($A->{toplabel} // 'First') . ': ' . join(', ', map { plain($_) } @top) . '. '
        . ($A->{bottomlabel} // 'Second') . ': ' . join(', ', map { plain($_) } @bot) . '. Arrows down: ' . plain($A->{k} // 'k') . '.';
    return (svg($W, $y2 + $rh + 6, $aria, $b));
}

$DOC{prwork} = 'cases="2,6;4,3;3,4" (workers,days: one array each, a row per worker, a square per day of work) labels="2 × 6 = 12;4 × [[3]] = 12;…" (a label with a blank also blanks the top label of that array) rowlabel="workers" collabel="days" note="…" title (inverse proportion: the total squares stay the same)';
sub draw_prwork {
    my ($A) = @_;
    my @cases = map { [map { num($_) // 1 } split /\s*,\s*/] } list($A->{cases}, qr/\s*;\s*/);
    my @labs = list($A->{labels}, qr/\s*;\s*/);
    my $maxr = max(map { $_->[0] } @cases);
    my $sumc = 0; $sumc += $_->[1] for @cases;
    my $gapx = 44;
    my $head = 18;   # room for a worker icon at the left of each row
    my $s = min(20, int((600 - @cases * ($gapx + $head)) / ($sumc || 1)), int(150 / ($maxr || 1)));
    $s = max($s, 9);
    my $top = $A->{title} ? 30 : 10;
    $top += 16 if $A->{collabel};
    my $b = '';
    $b .= T(8, 16, $A->{title}, cls => 'dg-title') if $A->{title};
    my $x = 8;
    my $gh = $maxr * $s;
    for my $i (0 .. $#cases) {
        my ($r, $c) = @{ $cases[$i] };
        my $x0 = $x + $head;
        my $hd = "$c " . ($A->{collabel} // '');
        $hd = "[[$hd]]" if defined $labs[$i] && $labs[$i] =~ /\[\[/;   # the label asks for it: hide it
        $b .= T($x0 + $c * $s / 2, $top - 6, $hd, anchor => 'middle', cls => 'dg-label-sm') if $A->{collabel};
        for my $row (0 .. $r - 1) {
            my $yy = $top + $row * $s;
            # worker icon: head and body
            $b .= circ($x + 8, $yy + $s * 0.32, max(2.5, $s * 0.18), 'dg-fill-earth');
            $b .= line($x + 8, $yy + $s * 0.5, $x + 8, $yy + $s * 0.92, 'dg-line');
            for my $col (0 .. $c - 1) {
                $b .= rect($x0 + $col * $s, $yy, $s, $s, $row % 2 ? 'dg-fill-cold' : 'dg-fill-accent');
                $b .= rect($x0 + $col * $s, $yy, $s, $s, 'dg-outline');
            }
        }
        my $lab = $labs[$i] // ("$r × $c = " . ($r * $c));
        my $lx = $x0 + $c * $s / 2;
        $b .= T($lx, $top + $gh + 18, "$r " . ($A->{rowlabel} // ''), anchor => 'middle', cls => 'dg-label-sm') if $A->{rowlabel};
        $b .= T($lx, $top + $gh + ($A->{rowlabel} ? 36 : 18), $lab, anchor => 'middle', cls => 'dg-label-accent');
        my $lwid = max($c * $s, tw(plain($lab), 11) + ($lab =~ /\[\[/ ? 30 : 0), tw("$r " . ($A->{rowlabel} // ''), 11));
        $x = $x0 + max($c * $s, $lwid - ($lwid - $c * $s) / 2) + $gapx;
    }
    my $W = $x - $gapx + 30;
    my $H = $top + $gh + ($A->{rowlabel} ? 44 : 26);
    if ($A->{note}) { $b .= T(8, $H + 8, $A->{note}, cls => 'dg-label'); $H += 18; }
    my $aria = 'Arrays of squares, one row per ' . ($A->{rowlabel} // 'worker') . ': '
        . join('; ', map { "$_->[0] by $_->[1]" } @cases) . '.';
    return (svg($W, $H, $aria, $b));
}

1;
