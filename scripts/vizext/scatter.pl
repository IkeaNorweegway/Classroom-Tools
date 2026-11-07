package Math8Viz;
# Scatter plots (Math 9 Statistics, also usable in Math 7/8): scatter.
# x and y have their own scales, so real data fits without square cells.
use strict;
use warnings;
use utf8;
use List::Util qw(max min);
our (%DOC, $KEY);

$DOC{scatter} = 'xmin xmax ymin ymax xstep ystep (grid) xevery yevery (number labels) ticks=0 (no numbers) xlabel ylabel '
  . 'pw=330 ph=180 (plot size in px) points="x,y;…" outlier="x,y:label" outnote="small text under the label" '
  . 'fit="m,b" or fit="p:x1,y1,x2,y2" fitcolor=accent|hot fitfrom fitto (solid between, dashed beyond) '
  . 'band="20,34" (shaded x-range) bandlabel curve="x,y;…" (smooth, green) '
  . 'text="x,y:words:accent|hot|plant|cold|sm|label|title;…" (at data coordinates; add <, > or | after the colour for end/start/middle) '
  . 'title note (small text under the plot) aria="…" (description for screen readers)';

my %SC_COL = (accent => 'dg-label-accent', hot => 'dg-label-hot', plant => 'dg-label-plant', cold => 'dg-label-cold',
              sm => 'dg-label-sm', label => 'dg-label', title => 'dg-title');

sub sc_num { my ($s) = @_; $s //= 0; $s =~ s/[−–]/-/g; $s =~ s/\s+//g; return $s + 0; }
sub sc_pair { my ($s) = @_; my ($x, $y) = split /\s*,\s*/, $s; return (sc_num($x), sc_num($y)); }
# Where y = mx + c crosses the plot box: (xa, ya, xb, yb), or () if it misses.
sub sc_clip {
    my ($m, $c, $xmin, $xmax, $ymin, $ymax) = @_;
    my ($lo, $hi) = ($xmin, $xmax);
    if (abs($m) > 1e-12) {
        my ($u, $v) = (($ymin - $c) / $m, ($ymax - $c) / $m);
        ($u, $v) = ($v, $u) if $u > $v;
        ($lo, $hi) = (max($lo, $u), min($hi, $v));
    } elsif ($c < $ymin || $c > $ymax) { return (); }
    return () if $lo > $hi;
    return ($lo, $m * $lo + $c, $hi, $m * $hi + $c);
}

sub sc_T { my $t = T(@_); $t =~ s/<text /<text style="paint-order:stroke;stroke:#fff;stroke-width:3.5px;stroke-linejoin:round" /g; return $t; }

sub draw_scatter {
    my ($a) = @_;
    my ($xmin, $xmax, $ymin, $ymax) = map { sc_num($a->{$_} // ($_ =~ /max/ ? 10 : 0)) } qw(xmin xmax ymin ymax);
    my ($xs, $ys) = (sc_num($a->{xstep} // 1), sc_num($a->{ystep} // 1));
    my ($xe, $ye) = (sc_num($a->{xevery} // $xs), sc_num($a->{yevery} // $ys));
    my $ticks = $a->{ticks} // 1;
    my ($pw, $ph) = (sc_num($a->{pw} // 330), sc_num($a->{ph} // 180));
    my $top = ($a->{title} ? 22 : 0) + ($a->{ylabel} ? 26 : 8);
    my $ml = $ticks ? 18 + 7 * max(map { length fmt($_) } $ymin, $ymax) : 10;
    my $X = sub { $ml + ($_[0] - $xmin) / (($xmax - $xmin) || 1) * $pw };
    my $Y = sub { $top + ($ymax - $_[0]) / (($ymax - $ymin) || 1) * $ph };
    my ($x0, $x1, $y0, $y1) = ($X->($xmin), $X->($xmax), $Y->($ymin), $Y->($ymax));
    my $W = $x1 + 12 + ($a->{xlabel} ? tw($a->{xlabel}, 12) + 4 : 0);
    my $b = '';
    my @aria;

    # shaded band (drawn first, under the grid)
    if (my $band = $a->{band}) {
        my ($bl, $br) = sc_pair($band);
        $b .= sprintf('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" class="dg-fill-accent"/>', $X->($bl), $y1, $X->($br) - $X->($bl), $y0 - $y1);
        $b .= sc_T(($X->($bl) + $X->($br)) / 2, $y1 + 15, $a->{bandlabel}, anchor => 'middle', cls => 'dg-label-accent') if $a->{bandlabel};
        push @aria, 'x from ' . fmt($bl) . ' to ' . fmt($br) . ' shaded';
    }
    # grid and axes
    for (my $v = $xmin; $v <= $xmax + 1e-9; $v += $xs) { $b .= line($X->($v), $y1, $X->($v), $y0, 'dg-grid'); }
    for (my $v = $ymin; $v <= $ymax + 1e-9; $v += $ys) { $b .= line($x0, $Y->($v), $x1, $Y->($v), 'dg-grid'); }
    $b .= line($x0, $y0, $x1 + 8, $y0, 'dg-line') . line($x0, $y0, $x0, $y1 - 8, 'dg-line');
    if ($ticks) {
        my $zero = abs($xmin) < 1e-9 && abs($ymin) < 1e-9;   # both start at 0: one 0 at the corner
        $b .= T($x0 - 5, $y0 + 14, '0', anchor => 'end', cls => 'dg-label-sm') if $zero;
        for (my $v = $xmin; $v <= $xmax + 1e-9; $v += $xe) {
            next if $zero && abs($v) < 1e-9;
            $b .= T($X->($v), $y0 + 14, fmt($v), anchor => 'middle', cls => 'dg-label-sm');
        }
        for (my $v = $ymin; $v <= $ymax + 1e-9; $v += $ye) {
            next if abs($v - $ymin) < 1e-9 && ($zero || abs($ymin) < 1e-9);   # leave the corner to the x numbers
            $b .= T($x0 - 5, $Y->($v) + 4, fmt($v), anchor => 'end', cls => 'dg-label-sm');
        }
    }
    $b .= T($x1 + 12, $y0 + 4, $a->{xlabel}, cls => 'dg-label') if $a->{xlabel};
    $b .= T($x0, $y1 - 13, $a->{ylabel}, anchor => 'middle', cls => 'dg-label') if $a->{ylabel};

    # line of best fit
    if (my $fit = $a->{fit}) {
        my ($m, $c);
        if ($fit =~ /^\s*p\s*:\s*(.+)$/) {
            my ($px1, $py1, $px2, $py2) = map { sc_num($_) } split /\s*,\s*/, $1;
            $m = ($py2 - $py1) / (($px2 - $px1) || 1); $c = $py1 - $m * $px1;
        } else { ($m, $c) = sc_pair($fit); }
        my @seg = sc_clip($m, $c, $xmin, $xmax, $ymin, $ymax);
        my $cls = ($a->{fitcolor} // 'accent') eq 'hot' ? 'dg-arrow hot' : 'dg-accent';
        if (@seg) {
            my ($sa, $sb) = ($seg[0], $seg[2]);
            my ($fa, $fb) = (defined $a->{fitfrom} ? max($sa, sc_num($a->{fitfrom})) : $sa, defined $a->{fitto} ? min($sb, sc_num($a->{fitto})) : $sb);
            my $L = sub { my ($u, $v, $k) = @_; return line($X->($u), $Y->($m * $u + $c), $X->($v), $Y->($m * $v + $c), $k); };
            $b .= $L->($sa, $fa, 'dg-dashed') if $fa > $sa + 1e-9;
            $b .= $L->($fb, $sb, 'dg-dashed') if $sb > $fb + 1e-9;
            $b .= $L->($fa, $fb, $cls);
        }
        push @aria, 'a line through the points';
    }
    # smooth curve (Catmull-Rom through the given points)
    if (my $cv = $a->{curve}) {
        my @p = map { [sc_pair($_)] } list($cv, qr/\s*;\s*/);
        my @q = map { [$X->($_->[0]), $Y->($_->[1])] } @p;
        my $d = sprintf('M%.1f,%.1f', @{ $q[0] });
        for my $i (0 .. $#q - 1) {
            my ($p0, $p1, $p2, $p3) = ($q[max(0, $i - 1)], $q[$i], $q[$i + 1], $q[min($#q, $i + 2)]);
            $d .= sprintf(' C%.1f,%.1f %.1f,%.1f %.1f,%.1f', $p1->[0] + ($p2->[0] - $p0->[0]) / 6, $p1->[1] + ($p2->[1] - $p0->[1]) / 6,
                          $p2->[0] - ($p3->[0] - $p1->[0]) / 6, $p2->[1] - ($p3->[1] - $p1->[1]) / 6, @$p2);
        }
        $b .= qq{<path d="$d" class="dg-arrow plant"/>};
        push @aria, 'a curve';
    }
    # points
    my @pts = map { [sc_pair($_)] } list($a->{points}, qr/\s*;\s*/);
    $b .= circ($X->($_->[0]), $Y->($_->[1]), 4, 'dg-point-accent') for @pts;
    push @aria, scalar(@pts) . ' points' if @pts;
    # outlier: hot dot, dashed ring, leader line out to a label right of the plot
    if (my $out = $a->{outlier}) {
        my ($xy, $lab) = split /\s*:\s*/, $out, 2;
        my ($ox, $oy) = sc_pair($xy);
        my ($cx, $cy) = ($X->($ox), $Y->($oy));
        $b .= circ($cx, $cy, 5, 'dg-solid-hot') . circ($cx, $cy, 13, 'dg-dashed');
        my $lx = $x1 + 30;
        $b .= line($cx + 14, $cy, $lx - 4, $cy, 'dg-line');
        $b .= T($lx, $cy + 4, $lab, cls => 'dg-label') if defined $lab;
        $b .= T($lx, $cy + 24, $a->{outnote}, cls => 'dg-label-sm') if $a->{outnote};
        $W = max($W, $lx + max(map { tw($_ // '', 12) } $lab, $a->{outnote}) + 24);
        push @aria, 'one point far from the others, circled';
    }
    # free text at data coordinates
    for my $t (list($a->{text}, qr/\s*;\s*/)) {
        my ($xy, $rest) = split /\s*:\s*/, $t, 2;
        my ($tx, $ty) = sc_pair($xy);
        my ($words, $col, $al) = $rest =~ /^(.*?)(?::(accent|hot|plant|cold|sm|label|title)([<>|]?))?$/;
        my $anc = ($al // '') eq '<' ? 'end' : ($al // '') eq '>' ? 'start' : 'middle';
        $b .= sc_T($X->($tx), $Y->($ty), $words, anchor => $anc, cls => $SC_COL{$col // 'label'});
    }
    my $H = $y0 + ($ticks || $a->{xlabel} ? 22 : 8);
    if ($a->{note}) { $b .= T(($x0 + $x1) / 2, $H + 4, $a->{note}, anchor => 'middle', cls => 'dg-label-sm'); $H += 18; }
    if ($a->{title}) { $b .= T(($x0 + $x1) / 2, 15, $a->{title}, anchor => 'middle', cls => 'dg-title'); }
    my $aria = $a->{aria} // ('Scatter plot' . ($a->{xlabel} ? ", x: $a->{xlabel}" : '') . ($a->{ylabel} ? ", y: $a->{ylabel}" : '') . (@aria ? ': ' . join('; ', @aria) : ''));
    return svg($W, $H, $aria, $b);
}

1;
