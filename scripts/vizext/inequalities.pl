package Math8Viz; use strict; use warnings; use utf8; our %DOC; our $KEY;
use List::Util qw(max min);
use POSIX qw(floor ceil);

# Inequalities (Math 8, topic 6): an inequality number line (open or closed
# dot at the boundary, ray to the right or left) and signs that state a limit.

$DOC{iqline} = 'value=3 dir=right|left closed=0|1 min=-2 max=8 step=1 every label="x > 3" (above the boundary; may hold [[…]]) blank=dot|dir|1 (student copy hides the dot type, the ray, or both; the key shows them) whole=1 (dots at whole numbers only, then …) marks="2:✓;5:✗" (test values: a small dot and a label under the line) nodot=1 width=520 (inequality on a number line)';
$DOC{iqsign} = 'kind=speed|height|limit value="110" top="MAXIMUM" unit="km/h" (limit: a plain sign, e.g. top="ELEVATOR" value="1000 kg" unit="MAXIMUM LOAD") caption (a road sign, a ride height marker or a posted limit)';

sub _iq_by_value { my @m = @_; my @i = (0 .. $#m); return sort { (num($m[$a][0]) // 0) <=> (num($m[$b][0]) // 0) } @i; }

sub draw_iqline {
    my ($a) = @_;
    my ($min, $max) = ($a->{min} // -2, $a->{max} // 8);
    my $step = $a->{step} // 1;
    my $W = $a->{width} // 520;
    my $v = num($a->{value} // 0);
    my $dir = ($a->{dir} // 'right') =~ /^l/i ? -1 : 1;
    my $closed = $a->{closed} ? 1 : 0;
    my $blank = $a->{blank} // '';
    my $hide_dot = !$KEY && ($blank eq 'dot' || $blank eq '1' || $blank eq 'both');
    my $hide_dir = !$KEY && ($blank eq 'dir' || $blank eq '1' || $blank eq 'both');
    my @marks = items($a->{marks});
    my $m = 30;
    my $top = defined $a->{label} && $a->{label} ne '' ? 30 : 12;
    my $y = $top + 26;
    my $X = sub { $m + ($_[0] - $min) / (($max - $min) || 1) * ($W - 2 * $m) };
    my $nt = ($max - $min) / $step;
    my $every = $a->{every} // ($nt <= 14 ? $step : 2 * $step);
    my $b = '';
    # axis
    $b .= line($m - 18, $y, $W - $m + 18, $y, 'dg-line');
    $b .= poly('dg-head plain', $m - 24, $y, $m - 14, $y - 5, $m - 14, $y + 5);
    $b .= poly('dg-head plain', $W - $m + 24, $y, $W - $m + 14, $y - 5, $W - $m + 14, $y + 5);
    for (my $i = 0; $i <= $nt + 1e-9; $i++) {
        my $t = $min + $i * $step;
        my $x = $X->($t);
        my $lab = abs(($t - $min) / $every - floor(($t - $min) / $every + 1e-9)) < 1e-6;
        $b .= line($x, $y - ($lab ? 7 : 4), $x, $y + ($lab ? 7 : 4), 'dg-line');
        $b .= T($x, $y + 24, fmt($t), anchor => 'middle') if $lab;
    }
    my $bx = $X->($v);
    # solution: ray, or dots at whole numbers
    unless ($hide_dir) {
        if ($a->{whole}) {
            my $start = $closed ? $v : $v + $dir;
            for (my $t = $start; $dir > 0 ? $t <= $max + 1e-9 : $t >= $min - 1e-9; $t += $dir) {
                next if !$closed && abs($t - $v) < 1e-9;
                $b .= circ($X->($t), $y, 5.5, 'dg-point-accent');
            }
            $b .= T($W - $m + 4, $y - 12, '…', anchor => 'middle', cls => 'dg-label-accent') if $dir > 0;
        } else {
            my $end = $dir > 0 ? $W - $m + 20 : $m - 20;
            $b .= sprintf('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" class="dg-accent" style="stroke-width:5px"/>', $bx, $y, $end - 8 * $dir, $y);
            $b .= poly('dg-head accent', $end + 4 * $dir, $y, $end - 9 * $dir, $y - 8, $end - 9 * $dir, $y + 8);
        }
    }
    # boundary dot
    unless ($a->{nodot}) {
        if ($hide_dot) {
            $b .= sprintf('<circle cx="%.1f" cy="%.1f" r="8" class="dg-tag"/>', $bx, $y);
        } elsif ($closed) {
            $b .= circ($bx, $y, 7, 'dg-point-accent');
        } else {
            $b .= sprintf('<circle cx="%.1f" cy="%.1f" r="6.5" class="dg-accent" style="fill:#fff"/>', $bx, $y);
        }
    }
    $b .= T($bx, $y - 18, $a->{label}, anchor => 'middle', cls => 'dg-math') if defined $a->{label} && $a->{label} ne '';
    # test values (a label that would touch its neighbour drops to a second row)
    my %row;
    my $rows = 1;
    my ($lastx, $lastrow) = (-1e9, 1);
    for my $i (_iq_by_value(@marks)) {
        my $t = num($marks[$i][0]); next unless defined $t;
        my $x = $X->($t);
        $row{$i} = ($x - $lastx < 34 && $lastrow == 0) ? 1 : 0;
        $rows = 2 if $row{$i};
        ($lastx, $lastrow) = ($x, $row{$i});
    }
    for my $i (0 .. $#marks) {
        my $p = $marks[$i];
        my $t = num($p->[0]); next unless defined $t;
        my $x = $X->($t);
        my $dy = ($row{$i} // 0) * 16;
        $b .= circ($x, $y, 3.5, 'dg-point') if abs($t - $v) > 1e-9;
        $b .= line($x, $y + 30, $x, $y + 34 + $dy, 'dg-line');
        $b .= T($x, $y + 48 + $dy, $p->[1] // '', anchor => 'middle', cls => 'dg-label-accent');
    }
    my $H = $y + (@marks ? 56 + ($rows - 1) * 16 : 34);
    my $aria = 'Number line: ' . ($a->{label} ? plain($a->{label}) . ', ' : '')
        . ($hide_dot ? 'blank dot at ' : ($closed ? 'closed dot at ' : 'open dot at ')) . fmt($v)
        . ($hide_dir ? ', direction blank' : ($a->{whole} ? ', whole-number dots to the ' : ', ray to the ') . ($dir > 0 ? 'right' : 'left'))
        . (@marks ? '; test values ' . join(', ', map { fmt(num($_->[0])) } @marks) : '');
    return (svg($W, $H, $aria, $b));
}

sub draw_iqsign {
    my ($a) = @_;
    my $kind = $a->{kind} // 'speed';
    my $val = $a->{value} // '110';
    my $b = '';
    my ($W, $H, $aria);
    if ($kind eq 'height') {
        # a ride height marker: a ruler post with a bar at the limit
        ($W, $H) = (230, 230);
        my ($x0, $yb, $yt) = (60, 210, 20);          # post from 0 cm (yb) to 160 cm (yt)
        my $cm = num($val) // 122;
        my $Y = sub { $yb - $_[0] / 160 * ($yb - $yt) };
        $b .= rect($x0, $yt, 26, $yb - $yt, 'dg-fill-sun', 3);
        for (my $c = 0; $c <= 160; $c += 10) {
            my $long = $c % 50 == 0;
            $b .= line($x0, $Y->($c), $x0 + ($long ? 12 : 7), $Y->($c), 'dg-line');
            $b .= T($x0 - 6, $Y->($c) + 4, $c, anchor => 'end', cls => 'dg-label-sm') if $long;
        }
        my $yl = $Y->($cm);
        $b .= rect($x0 - 4, $yl - 3, 120, 6, 'dg-solid-accent');
        $b .= T($x0 + 34, $yl - 10, ($a->{top} // 'You must be'), cls => 'dg-label');
        $b .= T($x0 + 34, $yl + 20, ($a->{unit} // "at least $val cm"), cls => 'dg-label-accent');
        $b .= line(20, $yb, 210, $yb, 'dg-line');
        $aria = "Ride height marker at $val cm";
    } else {
        my $top = $a->{top} // ($kind eq 'speed' ? 'MAXIMUM' : 'LIMIT');
        my $unit = $a->{unit} // ($kind eq 'speed' ? 'km/h' : '');
        my $big = $kind eq 'speed' ? 'dg-math-lg' : 'dg-math';
        $W = max(130, tw(plain($val), 20) + 50, tw($top, 12) + 40, tw($unit, 12) * 1.25 + 40);
        $H = 150;
        $b .= rect(6, 6, $W - 12, $H - 12, 'dg-boundary', 10);
        $b .= rect(13, 13, $W - 26, $H - 26, 'dg-outline', 6);
        $b .= T($W / 2, 42, $top, anchor => 'middle', cls => 'dg-title');
        $b .= sprintf('<g transform="translate(%.1f,92) scale(%s) translate(%.1f,-92)">', $W / 2, $kind eq 'speed' ? 1.8 : 1.2, -$W / 2)
            . T($W / 2, 92, $val, anchor => 'middle', cls => $big) . '</g>';
        $b .= T($W / 2, 124, $unit, anchor => 'middle', cls => 'dg-label') if $unit ne '';
        $aria = "Sign: $top " . plain($val) . " $unit";
    }
    return (svg($W, $H, $aria, $b));
}

1;
