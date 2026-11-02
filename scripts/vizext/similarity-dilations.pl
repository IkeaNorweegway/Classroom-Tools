package Math8Viz;
# Similarity & Dilations (Math 8, topic 8) diagram types: sddilate, sdmap.
use strict;
use warnings;
use utf8;
use POSIX qw(floor ceil);
use List::Util qw(max min);
our (%DOC, $KEY);

$DOC{sddilate} = 'pts="1,1;3,1;1,2" k=2 (or k=1/2) names="A,B,C" image=key|show|none rays=1 coords=1 (label vertices with (x, y); image coords in the key) ipts="…" (draw this image instead: a wrong one) range=N every=2 (dilation about (0, 0): rays from the origin through matching vertices)';
$DOC{sdmap} = 'a="Home" b="School" len=4 (cm on the map) angle=15 dist="[[4]] cm" scale="1 cm : 2 km" bar="0;2 km;4 km" river=1 title (a map with two places, the measured distance and a scale bar)';

sub sd_k { my ($s) = @_; $s //= 2; $s =~ s/[−–]/-/g; return $1 / $2 if $s =~ m{^\s*(-?\d+(?:\.\d+)?)\s*/\s*(\d+(?:\.\d+)?)\s*$}; return $s + 0; }

sub draw_sddilate {
    my ($a) = @_;
    my $k = sd_k($a->{k});
    my @p = map { [map { num($_) } split /\s*,\s*/] } list($a->{pts}, qr/\s*;\s*/);
    my @q = $a->{ipts} ? map { [map { num($_) } split /\s*,\s*/] } list($a->{ipts}, qr/\s*;\s*/) : map { [$_->[0] * $k, $_->[1] * $k] } @p;
    my @all = (@p, @q);
    my ($xmin, $xmax) = (min(0, floor(min(map { $_->[0] } @all))), max(1, ceil(max(map { $_->[0] } @all))));
    my ($ymin, $ymax) = (min(0, floor(min(map { $_->[1] } @all))), max(1, ceil(max(map { $_->[1] } @all))));
    $xmax = $a->{range} if $a->{range}; $ymax = $a->{range} if $a->{range};
    $xmax++ unless $a->{range}; $ymax++ unless $a->{range};
    $xmin-- if $xmin < 0; $ymin-- if $ymin < 0;
    my $span = max($xmax - $xmin, $ymax - $ymin);
    my $cell = $a->{cell} // max(16, min(30, int(320 / $span)));
    my $every = $a->{every} // ($span > 12 ? 2 : 1);
    my %o = (xmin => $xmin, xmax => $xmax, ymin => $ymin, ymax => $ymax, xstep => 1, ystep => 1, xevery => $every, yevery => $every, cell => $cell);
    my ($b, $X, $Y, $W, $H) = grid_frame(%o);
    my $image = $a->{image} // 'show';
    my $show = $image eq 'show' || ($image eq 'key' && $KEY);
    my @names = list($a->{names});
    if ($a->{rays}) {   # lines from the centre (0, 0) through each vertex
        for my $i (0 .. $#p) {
            my ($px, $py) = @{ $p[$i] };
            next if abs($px) < 1e-9 && abs($py) < 1e-9;
            my $t;
            if ($show) { $t = max(1, abs($k)) * 1.0; $t = max($t, (abs($q[$i][0]) + abs($q[$i][1])) / ((abs($px) + abs($py)) || 1)); }
            else {   # out to the edge of the grid
                my @c;
                push @c, $xmax / $px if $px > 0; push @c, $xmin / $px if $px < 0;
                push @c, $ymax / $py if $py > 0; push @c, $ymin / $py if $py < 0;
                $t = min(@c);
            }
            $b .= sprintf('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" class="dg-dashed"/>', $X->(0), $Y->(0), $X->($px * $t), $Y->($py * $t));
        }
        $b .= circ($X->(0), $Y->(0), 4, 'dg-point-accent');
    }
    my $coords = $a->{coords};
    my $draw = sub {
        my ($pts, $cls, $suffix, $lcls, $hide) = @_;
        my $s = poly($cls, map { ($X->($_->[0]), $Y->($_->[1])) } @$pts);
        my ($gx, $gy) = (0, 0);
        $gx += $_->[0] / @$pts for @$pts; $gy += $_->[1] / @$pts for @$pts;
        for my $i (0 .. $#$pts) {
            my ($x, $y) = @{ $pts->[$i] };
            $s .= circ($X->($x), $Y->($y), 3.2, 'dg-point');
            my $lab = defined $names[$i] ? $names[$i] . $suffix : '';
            $lab .= ($lab ne '' ? ' ' : '') . '(' . fmt($x) . ', ' . fmt($y) . ')' if $coords;
            next if $lab eq '';
            # label on the side of the ray from (0, 0) that is away from the shape
            my ($dx, $dy) = ($x - $gx, $y - $gy);
            if (abs($x) + abs($y) > 1e-9) {
                my ($px, $py) = (-$y, $x);
                ($px, $py) = (-$px, -$py) if $px * ($gx - $x) + $py * ($gy - $y) > 0;
                ($dx, $dy) = ($px, $py);
            }
            my $L = sqrt($dx * $dx + $dy * $dy) || 1;
            ($dx, $dy) = ($dx / $L, $dy / $L);
            my $anc = $dx > 0.35 ? 'start' : $dx < -0.35 ? 'end' : 'middle';
            $s .= T($X->($x) + $dx * 9, $Y->($y) - $dy * 11 + 4, $lab, anchor => $anc, cls => $lcls);
        }
        return $s;
    };
    $b .= $draw->(\@q, 'dg-fill-hot', '′', 'dg-label-hot') if $show;
    $b .= $draw->(\@p, 'dg-fill-accent', '', 'dg-label-accent');
    my $W2 = $W + ($coords ? 60 : 20);
    my $aria = 'Grid with shape ' . join(' ', @names) . ' at ' . join('; ', map { '(' . fmt($_->[0]) . ', ' . fmt($_->[1]) . ')' } @p)
        . ($show ? '. Image after a dilation about (0, 0) by ' . fmt($k) . ': ' . join('; ', map { '(' . fmt($_->[0]) . ', ' . fmt($_->[1]) . ')' } @q) : '. Dilation centre (0, 0)');
    return (svg($W2, $H, $aria, qq{<g transform="translate(20,0)">$b</g>}));
}

sub draw_sdmap {
    my ($a) = @_;
    my $cm = 48;   # pixels per map centimetre
    my $len = $a->{len} // 4;
    my $ang = ($a->{angle} // 12) * 3.14159265 / 180;
    my @bar = list($a->{bar}, qr/\s*;\s*/);
    my $bw = max(1, @bar - 1) * $cm;
    my $W = max($len * $cm * cos($ang) + 140, $bw + 80, 300);
    my $mt = $a->{title} ? 26 : 10;
    my $mh = max(130, $len * $cm * sin($ang) + 80);
    my $b = rect(10, $mt, $W - 20, $mh, 'dg-fill-soft', 6);
    $b .= T($W / 2, 18, $a->{title}, anchor => 'middle', cls => 'dg-title') if $a->{title};
    if ($a->{river}) {
        my $y0 = $mt + $mh * 0.55;
        $b .= sprintf('<path d="M10,%.1f C%.1f,%.1f %.1f,%.1f %.1f,%.1f S%.1f,%.1f %.1f,%.1f" class="dg-accent" fill="none" stroke-width="7" opacity="0.35"/>',
            $y0, $W * 0.25, $y0 - 40, $W * 0.4, $y0 + 40, $W * 0.6, $y0, $W * 0.85, $y0 - 30, $W - 10, $y0 + 10);
    }
    my ($x1, $y1) = (60, $mt + $mh - 30 - 0);
    $y1 = $mt + ($mh + $len * $cm * sin($ang)) / 2;
    my ($x2, $y2) = ($x1 + $len * $cm * cos($ang), $y1 - $len * $cm * sin($ang));
    $b .= sprintf('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" class="dg-dashed"/>', $x1, $y1, $x2, $y2);
    $b .= circ($x1, $y1, 5, 'dg-point-accent') . circ($x2, $y2, 5, 'dg-point-accent');
    $b .= T($x1 - 4, $y1 + 20, $a->{a}, anchor => 'start', cls => 'dg-label');
    $b .= T($x2, $y2 - 10, $a->{b}, anchor => 'middle', cls => 'dg-label');
    my ($mx, $my) = (($x1 + $x2) / 2, ($y1 + $y2) / 2);
    $b .= T($mx - sin($ang) * 12, $my - cos($ang) * 12, $a->{dist}, anchor => 'middle', cls => 'dg-label-accent') if defined $a->{dist};
    my $H = $mt + $mh + 14;
    if (@bar) {
        my $bx = 30;
        my $by = $H + 6;
        for my $i (0 .. $#bar - 1) { $b .= rect($bx + $i * $cm, $by, $cm, 8, $i % 2 ? 'dg-fill-accent' : 'dg-outline'); }
        $b .= rect($bx, $by, $bw, 8, 'dg-outline');
        for my $i (0 .. $#bar) { $b .= T($bx + $i * $cm, $by + 24, $bar[$i], anchor => 'middle', cls => 'dg-label-sm'); }
        $b .= T($bx + $bw + 26, $by + 9, $a->{scale}, anchor => 'start', cls => 'dg-math') if defined $a->{scale};
        $H = $by + 32;
    } elsif (defined $a->{scale}) {
        $b .= T(24, $H + 12, 'Scale ' . $a->{scale}, cls => 'dg-math');
        $H += 22;
    }
    return (svg($W, $H, 'Map with ' . plain($a->{a} // '') . ' and ' . plain($a->{b} // '') . ', ' . plain($a->{dist} // '') . ' apart on the map. Scale ' . plain($a->{scale} // ''), $b));
}

1;
