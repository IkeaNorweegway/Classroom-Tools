package Math8Viz;
# Linear Functions (Math 8, topic 7) diagram types: lfgraph, lfslope, lfhill.
use strict;
use warnings;
use utf8;
use POSIX qw(floor ceil);
use List::Util qw(max min);
our (%DOC, $KEY);

$DOC{lfgraph} = 'xmin xmax ymin ymax xstep ystep xevery yevery xlabel ylabel width cell lines="2,1;-1/2,3;x=3" (each m,b for y = mx + b, or x=a; drawn across the whole grid) keylines="…" (key only) labels="y = 2x + 1;…" (one per line, lines then keylines) lpos="0.85;0.2" (where along each line the label sits, 0–1) dashed="2" (line numbers drawn dashed) points="x,y:label;…" keypoints open="x,y;…" steps="x1,y1,x2,y2;…" rise="[[3]];…" run="[[2]];…" (rise/run right-angle steps between two points) title';
$DOC{lfslope} = 'pts="1,2;3,5" (two points; the full line through them) names="A;B" coords=1 (label points with (x, y)) rise="[[3]]" run="[[2]]" full=0 (only the segment) line=0 (no line, just the step) xmin xmax ymin ymax xstep ystep xevery yevery xlabel ylabel width cell label="…" (on the line) title (slope picture: two points, run across then rise up, right angle at the corner)';
$DOC{lfhill} = 'kind=hill|ramp|roof rv=3 runv=12 (numbers for the shape, drawn to scale) rise="30 m" run="120 m" slope="slope = [[1/4]]" title  (+ rv2 runv2 rise2 run2 slope2 title2 kind2 for a second shape at the same scale) (side view: ski hill, wheelchair ramp or roof with rise and run)';

my @LF_COL = ('var(--dg-accent)', 'var(--viz-hot)', 'var(--viz-cold)', 'var(--viz-earth)', 'var(--viz-plant)');

sub lf_num {
    my ($s) = @_; $s //= 0; $s =~ s/[−–]/-/g; $s =~ s/\s+//g;
    return $1 / $2 if $s =~ m{^(-?\d+(?:\.\d+)?)/(-?\d+(?:\.\d+)?)$};
    return $s + 0;
}

# Clip the line through (px, py) with direction (dx, dy) to the box. Returns (x0, y0, x1, y1) or ().
sub lf_clip {
    my ($px, $py, $dx, $dy, $xmin, $xmax, $ymin, $ymax) = @_;
    my ($t0, $t1) = (-1e9, 1e9);
    for my $c ([$dx, $px, $xmin, $xmax], [$dy, $py, $ymin, $ymax]) {
        my ($d, $p, $lo, $hi) = @$c;
        if (abs($d) < 1e-12) { return () if $p < $lo - 1e-9 || $p > $hi + 1e-9; next; }
        my ($a, $b) = (($lo - $p) / $d, ($hi - $p) / $d);
        ($a, $b) = ($b, $a) if $a > $b;
        $t0 = max($t0, $a); $t1 = min($t1, $b);
    }
    return () if $t0 > $t1;
    return ($px + $t0 * $dx, $py + $t0 * $dy, $px + $t1 * $dx, $py + $t1 * $dy);
}

sub lf_T { my $t = T(@_); $t =~ s/<text /<text style="paint-order:stroke;stroke:#fff;stroke-width:3.5px;stroke-linejoin:round" /g; return $t; }

sub lf_core {
    my ($a, $extra) = @_;
    my %o = (xmin => $a->{xmin} // -6, xmax => $a->{xmax} // 6, ymin => $a->{ymin} // -6, ymax => $a->{ymax} // 6,
             xstep => $a->{xstep} // 1, ystep => $a->{ystep} // 1, xevery => $a->{xevery}, yevery => $a->{yevery},
             xlabel => $a->{xlabel}, ylabel => $a->{ylabel});
    my $nx = ($o{xmax} - $o{xmin}) / $o{xstep};
    my $ny = ($o{ymax} - $o{ymin}) / $o{ystep};
    $o{cell} = $a->{cell} // max(14, min(28, int(($a->{width} // 340) / $nx), int(320 / $ny)));
    my ($b, $X, $Y, $W, $H) = grid_frame(%o);
    my @aria;
    # lines
    my @spec = list($a->{lines}, qr/\s*;\s*/);
    my $nshow = @spec;
    push @spec, list($a->{keylines}, qr/\s*;\s*/) if $KEY;
    push @spec, @{ $extra->{lines} } if $extra && $extra->{lines};
    my @labels = list($a->{labels}, qr/\s*;\s*/);
    my @lpos = list($a->{lpos}, qr/\s*;\s*/);
    my %dash = map { $_ => 1 } list($a->{dashed});
    my ($bx0, $bx1, $by0, $by1) = ($o{xmin}, $o{xmax}, $o{ymin}, $o{ymax});
    for my $i (0 .. $#spec) {
        my $s = $spec[$i]; $s =~ s/[−–]/-/g;
        my @seg;
        if ($s =~ /^\s*x\s*=\s*(\S+)/) { my $xa = lf_num($1); @seg = ($xa, $by0, $xa, $by1) if $xa >= $bx0 - 1e-9 && $xa <= $bx1 + 1e-9; push @aria, $KEY ? "vertical line x = " . fmt($xa) : 'a vertical line'; }
        elsif ($s =~ /^\s*seg\s*:\s*(\S+?),(\S+?),(\S+?),(\S+)\s*$/) { @seg = map { lf_num($_) } ($1, $2, $3, $4); push @aria, 'segment'; }
        elsif ($s =~ /^\s*p\s*:\s*(\S+?),(\S+?),(\S+?),(\S+)\s*$/) {
            my ($x1, $y1, $x2, $y2) = map { lf_num($_) } ($1, $2, $3, $4);
            @seg = lf_clip($x1, $y1, $x2 - $x1, $y2 - $y1, $bx0, $bx1, $by0, $by1);
            push @aria, 'line through (' . fmt($x1) . ', ' . fmt($y1) . ') and (' . fmt($x2) . ', ' . fmt($y2) . ')';
        }
        else {
            my ($m, $c) = split /\s*,\s*/, $s;
            ($m, $c) = (lf_num($m), lf_num($c));
            @seg = lf_clip(0, $c, 1, $m, $bx0, $bx1, $by0, $by1);
            push @aria, $KEY ? 'line y = ' . fmt($m) . 'x + ' . fmt($c) : 'a line';
        }
        next unless @seg;
        my $col = $LF_COL[$i % @LF_COL];
        my $cls = $dash{$i + 1} ? 'dg-dashed' : 'dg-accent';
        $b .= sprintf('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" class="%s" style="stroke:%s"/>', $X->($seg[0]), $Y->($seg[1]), $X->($seg[2]), $Y->($seg[3]), $cls, $col);
        my $lab = $labels[$i];
        next unless defined $lab && $lab ne '';
        my $f = defined $lpos[$i] && $lpos[$i] ne '' ? $lpos[$i] : 0.85;
        my ($sx0, $sy0, $sx1, $sy1) = ($X->($seg[0]), $Y->($seg[1]), $X->($seg[2]), $Y->($seg[3]));
        my ($lx, $ly) = ($sx0 + ($sx1 - $sx0) * $f, $sy0 + ($sy1 - $sy0) * $f);
        my ($dx, $dy) = ($sx1 - $sx0, $sy1 - $sy0);
        my $L = sqrt($dx * $dx + $dy * $dy) || 1;
        my ($nx2, $ny2) = (-$dy / $L, $dx / $L);          # normal
        ($nx2, $ny2) = (-$nx2, -$ny2) if $ny2 > 0 || (abs($ny2) < 1e-6 && $nx2 < 0);   # put the label above / left
        my $anc = $nx2 > 0.3 ? 'start' : $nx2 < -0.3 ? 'end' : 'middle';
        my $cl = ('dg-label-accent', 'dg-label-hot', 'dg-label-cold', 'dg-label-earth', 'dg-label-accent')[$i % @LF_COL];
        my $tx = $lx + $nx2 * 9;
        (my $plainlab = $lab) =~ s/\[\[(.*?)\]\]/$1xxx/g;
        my $lw = tw($plainlab, 12);
        my $left = $anc eq 'start' ? $tx : $anc eq 'end' ? $tx - $lw : $tx - $lw / 2;
        $tx += ($W - 4 - $lw) - $left if $left + $lw > $W - 4;
        $tx += 4 - $left if $left < 4;
        $b .= lf_T($tx, $ly + $ny2 * 9 + 4, $lab, anchor => $anc, cls => $cl);
    }
    # rise/run steps
    my $maxx = 0;
    my @rise = list($a->{rise}, qr/\s*;\s*/);
    my @run = list($a->{run}, qr/\s*;\s*/);
    my @steps = list($a->{steps}, qr/\s*;\s*/);
    for my $k (0 .. $#steps) {
        my ($x1, $y1, $x2, $y2) = map { lf_num($_) } split /\s*,\s*/, $steps[$k];
        my ($ax, $ay, $cx, $cy, $ex, $ey) = ($X->($x1), $Y->($y1), $X->($x2), $Y->($y1), $X->($x2), $Y->($y2));
        $b .= arrow($ax, $ay, $cx, $cy, 'hot') if abs($cx - $ax) > 2;
        $b .= arrow($cx, $cy, $ex, $ey, 'accent') if abs($ey - $cy) > 2;
        if (abs($cx - $ax) > 2 && abs($ey - $cy) > 2) {   # right-angle mark at the corner
            my $sx = $ax < $cx ? -8 : 8; my $sy = $ey < $cy ? -8 : 8;
            $b .= sprintf('<path d="M%.1f,%.1f L%.1f,%.1f L%.1f,%.1f" class="dg-right-angle"/>', $cx + $sx, $cy, $cx + $sx, $cy + $sy, $cx, $cy + $sy);
        }
        my $rl = $run[$k] // ''; my $sl = $rise[$k] // '';
        if ($rl ne '') {
            my $below = $y2 > $y1 || abs($ey - $cy) <= 2;
            $b .= lf_T(($ax + $cx) / 2, $below ? $cy + 17 : $cy - 8, "run = $rl", anchor => 'middle', cls => 'dg-label-hot');
        }
        if ($sl ne '' && abs($ey - $cy) <= 2) { $b .= lf_T($cx, $cy - 10, "rise = $sl", anchor => 'middle', cls => 'dg-label-accent'); }
        elsif ($sl ne '') {
            my $right = $x2 >= $x1;
            $b .= lf_T($right ? $cx + 8 : $cx - 8, ($cy + $ey) / 2 + 4, "rise = $sl", anchor => $right ? 'start' : 'end', cls => 'dg-label-accent');
            (my $pl = $sl) =~ s/\[\[(.*?)\]\]/$1xxxx/g;
            $maxx = max($maxx, $cx + 14 + tw("rise = $pl", 12.5)) if $right;
        }
    }
    # points
    my $src = join ';', grep { defined && $_ ne '' } $a->{points}, ($KEY ? $a->{keypoints} : undef);
    for my $q (map { my ($xy, $lab) = split /\s*:\s*/, $_, 2; my ($x, $y) = split /\s*,\s*/, $xy; [lf_num($x), lf_num($y), $lab] } list($src, qr/\s*;\s*/)) {
        $b .= circ($X->($q->[0]), $Y->($q->[1]), 4.5, 'dg-point');
        my $lab = $q->[2] // '';
        my $lft = $lab =~ s/^<//;
        my $side = $a->{_side} ? 4 : -8;
        $b .= lf_T($X->($q->[0]) + ($lft ? -9 : 9), $Y->($q->[1]) + $side, $lab, anchor => $lft ? 'end' : 'start', cls => 'dg-label') if $lab ne '';
        $maxx = max($maxx, $X->($q->[0]) + 14 + tw($lab, 13)) if $lab ne '' && !$lft;
        push @aria, 'point (' . fmt($q->[0]) . ', ' . fmt($q->[1]) . ')';
    }
    for my $q (map { my ($x, $y) = split /\s*,\s*/; [lf_num($x), lf_num($y)] } list($a->{open}, qr/\s*;\s*/)) {
        $b .= sprintf('<circle cx="%.1f" cy="%.1f" r="4.5" fill="#fff" class="dg-accent"/>', $X->($q->[0]), $Y->($q->[1]));
    }
    $W = max($W, $maxx);
    my $top = 0;
    if ($a->{title}) { $b = qq{<g transform="translate(0,20)">$b</g>} . T($W / 2, 15, $a->{title}, anchor => 'middle', cls => 'dg-title'); $top = 20; }
    return svg($W, $H + $top, 'Coordinate grid' . (@aria ? ': ' . join('; ', @aria) : ''), $b);
}

sub draw_lfgraph { my ($a) = @_; return lf_core($a); }

sub draw_lfslope {
    my ($a) = @_;
    my @p = map { [map { lf_num($_) } split /\s*,\s*/] } list($a->{pts}, qr/\s*;\s*/);
    my ($x1, $y1, $x2, $y2) = (@{ $p[0] }, @{ $p[1] });
    my %b = %$a;
    my @xs = ($x1, $x2); my @ys = ($y1, $y2);
    $b{xmin} //= min(0, floor(min(@xs)) - 1); $b{xmax} //= max(1, ceil(max(@xs)) + 1);
    $b{ymin} //= min(0, floor(min(@ys)) - 1); $b{ymax} //= max(1, ceil(max(@ys)) + 1);
    my $line = $a->{line} // 1;
    my $full = $a->{full} // 1;
    my $ls = $full ? "p:$x1,$y1,$x2,$y2" : "seg:$x1,$y1,$x2,$y2";
    $b{lines} = $line ? $ls : '';
    $b{labels} = $a->{label} // '';
    $b{lpos} = $a->{lpos} // ($full ? '0.88' : '0.5');
    $b{steps} = "$x1,$y1,$x2,$y2";
    my @names = list($a->{names}, qr/\s*;\s*/);
    my @pt;
    for my $i (0, 1) {
        my ($x, $y) = @{ $p[$i] };
        my $lab = $names[$i] // '';
        $lab .= ($lab ne '' ? ' ' : '') . '(' . fmt($x) . ', ' . fmt($y) . ')' if $a->{coords};
        # label away from the step: first point to the left
        $lab = "<$lab" if $lab ne '' && $i == 0;
        push @pt, "$x,$y" . ($lab ne '' ? ":$lab" : '');
    }
    $b{points} = join ';', @pt;
    $b{_side} = 1;
    delete $b{keypoints};
    return lf_core(\%b);
}

sub draw_lfhill {
    my ($a) = @_;
    my @sh = ({ kind => $a->{kind} // 'hill', rv => lf_num($a->{rv} // 3), runv => lf_num($a->{runv} // 12), rise => $a->{rise}, run => $a->{run}, slope => $a->{slope}, title => $a->{title} });
    push @sh, { kind => $a->{kind2} // $sh[0]{kind}, rv => lf_num($a->{rv2}), runv => lf_num($a->{runv2}), rise => $a->{rise2}, run => $a->{run2}, slope => $a->{slope2}, title => $a->{title2} } if defined $a->{rv2};
    my $maxrun = max(map { $_->{runv} } @sh); my $maxrise = max(map { $_->{rv} } @sh);
    my $wide = @sh > 1 ? 210 : 280;
    my $s = min($wide / $maxrun, 150 / $maxrise);
    my ($b, $x0, $top) = ('', 20, ($a->{title} || $a->{title2}) ? 30 : 14);
    my $base = $top + $maxrise * $s + 20;
    for my $h (@sh) {
        my ($w, $ht) = ($h->{runv} * $s, $h->{rv} * $s);
        my $k = $h->{kind};
        my $left = $x0 + 60;   # room for the rise label
        my ($hx, $lx) = $k eq 'hill' ? ($left, $left + $w) : ($left + $w, $left);   # hx: side with the height
        my $fill = $k eq 'hill' ? 'dg-fill-cold' : $k eq 'roof' ? 'dg-fill-earth' : 'dg-fill-soft';
        $b .= poly($fill, $left, $base, $left + $w, $base, $hx, $base - $ht);
        $b .= line($left - 10, $base, $left + $w + 10, $base, 'dg-line');
        # right-angle mark at the foot of the height
        my $sx = $hx == $left ? 8 : -8;
        $b .= sprintf('<path d="M%.1f,%.1f L%.1f,%.1f L%.1f,%.1f" class="dg-right-angle"/>', $hx + $sx, $base, $hx + $sx, $base - 8, $hx, $base - 8);
        if ($k eq 'hill') {   # flag at the top, trees at the bottom
            $b .= line($hx, $base - $ht, $hx, $base - $ht - 18, 'dg-line') . poly('dg-fill-hot', $hx, $base - $ht - 18, $hx + 11, $base - $ht - 14, $hx, $base - $ht - 10);
            $b .= poly('dg-fill-plant', $lx + 4, $base, $lx + 12, $base - 16, $lx + 20, $base);
        } elsif ($k eq 'ramp') {   # landing and door at the top
            $b .= rect($hx, $base - $ht, 26, $ht, 'dg-fill-soft') . rect($hx + 6, $base - $ht - 30, 14, 30, 'dg-outline');
            $b .= circ($lx + $w * 0.35, $base - $ht * 0.35 - 8, 7, 'dg-outline');
        }
        # labels
        my $rx = $hx == $left ? $left - 6 : $left + $w + ($k eq 'ramp' ? 32 : 6);
        $b .= T($rx, $base - $ht / 2 + 4, $h->{rise}, anchor => $hx == $left ? 'end' : 'start', cls => 'dg-label-accent') if $h->{rise};
        $b .= T($left + $w / 2, $base + 17, $h->{run}, anchor => 'middle', cls => 'dg-label-hot') if $h->{run};
        if ($h->{slope}) {
            my ($mx, $my) = ($left + $w / 2, $base - $ht / 2);
            $b .= T($mx + ($k eq 'hill' ? 10 : -10), $my - 10, $h->{slope}, anchor => $k eq 'hill' ? 'start' : 'end', cls => 'dg-label');
        }
        $b .= T($left + $w / 2, 16, $h->{title}, anchor => 'middle', cls => 'dg-title') if $h->{title};
        $x0 = $left + $w + 70;
    }
    my $W = $x0 - 10 + ($sh[-1]{kind} eq 'ramp' && $sh[-1]{rise} ? 40 + tw($sh[-1]{rise}, 12) : 0); my $H = $base + 26;
    my $aria = join '. ', map { "$_->{kind}: rise $_->{rv}, run $_->{runv}" } @sh;
    return svg($W, $H, "Side view. $aria", $b);
}

$DOC{lfkinds} = 'lines="1,0;-1,0;0,1;x=1" (one small grid per line, m,b or x=a) titles="positive;negative;zero;undefined" (under each grid; [[ ]] allowed) range=3 cell=13 (a row of small grids: the kinds of slope)';

sub draw_lfkinds {
    my ($a) = @_;
    my @L = list($a->{lines} // '1,0;-1,0;0,1;x=1', qr/\s*;\s*/);
    my @tt = list($a->{titles} // 'positive;negative;zero;undefined', qr/\s*;\s*/);
    my $r = $a->{range} // 3; my $c = $a->{cell} // 13;
    my $g = 2 * $r * $c; my $gap = 34;
    my $b = '';
    for my $i (0 .. $#L) {
        my $ox = 10 + $i * ($g + $gap); my $oy = 10;
        my $X = sub { $ox + ($_[0] + $r) * $c }; my $Y = sub { $oy + ($r - $_[0]) * $c };
        for my $v (-$r .. $r) { $b .= line($X->($v), $Y->(-$r), $X->($v), $Y->($r), 'dg-grid') . line($X->(-$r), $Y->($v), $X->($r), $Y->($v), 'dg-grid'); }
        $b .= line($X->(-$r), $Y->(0), $X->($r), $Y->(0), 'dg-line') . line($X->(0), $Y->(-$r), $X->(0), $Y->($r), 'dg-line');
        my $s = $L[$i]; $s =~ s/[−–]/-/g; my @seg;
        if ($s =~ /^\s*x\s*=\s*(\S+)/) { my $xa = lf_num($1); @seg = ($xa, -$r, $xa, $r); }
        else { my ($m, $k) = map { lf_num($_) } split /\s*,\s*/, $s; @seg = lf_clip(0, $k, 1, $m, -$r, $r, -$r, $r); }
        $b .= sprintf('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" class="dg-accent"/>', $X->($seg[0]), $Y->($seg[1]), $X->($seg[2]), $Y->($seg[3])) if @seg;
        $b .= T($ox + $g / 2, $oy + $g + 18, $tt[$i] // '', anchor => 'middle', cls => 'dg-label');
    }
    my $W = 20 + @L * $g + (@L - 1) * $gap; my $H = 10 + $g + 28;
    return svg($W, $H, 'Small grids, one line each: ' . join(', ', map { plain($_) } @tt), $b);
}

1;
