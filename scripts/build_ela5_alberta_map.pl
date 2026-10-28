#!/usr/bin/env perl
# Build the Alberta natural regions map for the Grade 5 ELA Information Report.
#
# Writes worksheets/grade-5-ela/_visuals/alberta-regions-map.html: an HTML
# fragment (style + map SVG + region icon cards). render_ela5.pl pulls it into
# a source with `::: visual alberta-regions-map`.
#
# Reads:
#   scripts/data/natural-earth/admin1-50m.geojson   Alberta's outline (public domain)
#   scripts/data/game-icons/ela5-alberta-icons.json  icon paths (CC BY 3.0, game-icons.net)
#
# Region edges are simplified from the Natural Regions of Alberta map and kept
# true to the reader (Calgary in the Parkland, Foothills just east of the
# mountains, Boreal more than half, Shield a small northeast corner). They are
# drawn as broad shapes and clipped to the real outline.
#
# Run from the repo root:  perl scripts/build_ela5_alberta_map.pl
# Then re-render the pages that use it, e.g.
#   perl scripts/render_ela5.pl worksheets/grade-5-ela/information-report/ela5-information-report-reader-v2.md
use strict;
use warnings;
use utf8;
use open qw(:std :encoding(UTF-8));
use Cwd qw(abs_path);
use File::Basename qw(dirname);
use File::Path qw(make_path);
use JSON::PP;

my $ROOT = dirname(dirname(abs_path($0)));
sub slurp { my ($p) = @_; open my $fh, '<:raw', $p or die "$p: $!"; local $/; my $s = <$fh>; close $fh; return $s; }

# ── Projection: sinusoidal centred on 115°W, so meridians lean in to the north
my ($LON0, $K, $PI) = (-115, 60, 4 * atan2(1, 1));
my ($XMIN, $YTOP) = (-232, 60.55);   # left edge (px), latitude of the top edge (with margin)
sub P {
    my ($lat, $lon) = @_;
    my $x = ($lon - $LON0) * cos($lat * $PI / 180) * $K;
    return ($x - $XMIN, ($YTOP - $lat) * $K + 0);
}
my $W = 470;                               # viewBox width
my $H = int(($YTOP - 48.25) * $K);         # viewBox height
sub f1 { my $v = sprintf('%.1f', $_[0]); $v =~ s/\.0$//; return $v; }

# ── Alberta outline
my $geo = decode_json(slurp("$ROOT/scripts/data/natural-earth/admin1-50m.geojson"));
my ($ab) = grep { ($_->{properties}{name} // '') eq 'Alberta' } @{ $geo->{features} };
die "Alberta not found\n" unless $ab;
my $ring = $ab->{geometry}{coordinates}[0];
my $AB_D = 'M' . join('L', map { my ($x, $y) = P($_->[1], $_->[0]); f1($x) . ',' . f1($y) } @$ring) . 'Z';

# ── Smooth paths (Catmull-Rom as cubic Béziers). A point given as ['s', lat, lon]
# is a sharp corner; plain [lat, lon] points are smoothed.
sub path_d {
    my ($pts, $closed) = @_;
    my @p = map { my $s = $_->[0] eq 's'; my ($x, $y) = $s ? P($_->[1], $_->[2]) : P(@$_); [$x, $y, $s] } @$pts;
    my $n = @p;
    my $at = sub { my $i = shift; return $closed ? $p[$i % $n] : $p[$i < 0 ? 0 : $i >= $n ? $n - 1 : $i]; };
    my $d = 'M' . f1($p[0][0]) . ',' . f1($p[0][1]);
    my $last = $closed ? $n : $n - 1;
    for my $i (0 .. $last - 1) {
        my ($a, $b, $c, $e) = ($at->($i - 1), $at->($i), $at->($i + 1), $at->($i + 2));
        my @c1 = $b->[2] ? @$b[0, 1] : ($b->[0] + ($c->[0] - $a->[0]) / 6, $b->[1] + ($c->[1] - $a->[1]) / 6);
        my @c2 = $c->[2] ? @$c[0, 1] : ($c->[0] - ($e->[0] - $b->[0]) / 6, $c->[1] - ($e->[1] - $b->[1]) / 6);
        $d .= 'C' . join(' ', map { f1($_) } @c1, @c2, $c->[0], $c->[1]);
    }
    return $d . ($closed ? 'Z' : '');
}

# ── Regions, in drawing order (later ones cover earlier ones)
my %R = (
    boreal    => { name => 'Boreal Forest',   fill => '#a7d3b1', ink => '#1d5a33' },
    parkland  => { name => 'Parkland',        fill => '#d5e6a0', ink => '#4a641a' },
    grassland => { name => 'Grassland',       fill => '#f4da84', ink => '#775600' },
    foothills => { name => 'Foothills',       fill => '#e6bf98', ink => '#7a4718' },
    rocky     => { name => 'Rocky Mountain',  fill => '#c9c5ea', ink => '#433d82' },
    shield    => { name => 'Canadian Shield', fill => '#f0b8c7', ink => '#8a2a48' },
);
my @SHAPES = (
    # Parkland band (and everything south of it; Grassland, Foothills and Rockies cover their parts)
    [parkland => [['s', 47.8, -122], ['s', 47.8, -108.3], ['s', 53.85, -108.3], [53.8, -109.6], [53.75, -110.4],
        [53.85, -111.2], [53.95, -112.0], [53.92, -112.7], [53.98, -113.4], [53.72, -114.0], [53.45, -114.25], [53.0, -114.2], [52.5, -114.35], [52.0, -114.72], ['s', 51.7, -115.2], ['s', 51.7, -122]]],
    # Peace River Parkland
    [parkland => [[55.15, -118.6], [55.25, -119.25], [55.6, -119.35], [55.95, -118.7], [56.25, -117.9], [56.35, -117.35],
        [56.15, -117.1], [55.85, -117.6], [55.45, -118.15]]],
    [grassland => [['s', 47.8, -113.55], [49.0, -113.55], [49.5, -113.85], [50.0, -114.05], [50.5, -114.2], [50.85, -114.17],
        [50.97, -113.85], [51.4, -113.4], [51.8, -112.95], [52.15, -112.35], [52.35, -111.6], [52.45, -110.6], [52.5, -109.6],
        ['s', 52.55, -108.3], ['s', 47.8, -108.3]]],
    [foothills => [['s', 50.3, -115.6], [50.55, -114.6], [51.0, -114.58], [51.5, -114.75], [52.0, -114.85], [52.5, -114.8],
        [53.0, -114.85], [53.4, -114.75], [53.75, -115.0], [54.1, -115.1], [54.5, -114.95], [54.85, -115.25], [55.0, -115.9],
        [54.95, -116.8], [55.05, -117.8], [55.0, -118.6], [54.85, -119.4], [54.75, -120.2], ['s', 54.75, -122], ['s', 50.3, -122]]],
    [rocky => [['s', 47.8, -113.8], [49.0, -113.8], [49.5, -114.25], [50.0, -114.45], [50.55, -114.64], [51.0, -114.95],
        [51.5, -115.3], [52.0, -115.85], [52.5, -116.4], [53.0, -117.1], [53.25, -117.6], [53.6, -118.25], [53.9, -119.05],
        [54.15, -119.75], [54.3, -120.2], ['s', 54.4, -122], ['s', 47.8, -122]]],
    [shield => [['s', 60.8, -111.8], [60.0, -111.75], [59.5, -111.55], [59.0, -111.35], [58.8, -111.2], [58.88, -110.85],
        [59.02, -110.4], [59.15, -110.0], ['s', 59.2, -108.3], ['s', 60.8, -108.3]]],
);

# Lakes (closed, smoothed)
my @LAKES = (
    ['Lake Athabasca', [[58.72, -111.35], [58.79, -111.05], [58.9, -110.75], [59.03, -110.35], [59.16, -109.9],
        [59.3, -109.4], [59.2, -109.3], [59.0, -109.85], [58.85, -110.35], [58.66, -110.8], [58.52, -111.1], [58.56, -111.33]]],
    ['Lesser Slave Lake', [[55.42, -116.15], [55.52, -115.85], [55.47, -115.4], [55.38, -115.0], [55.3, -114.72],
        [55.25, -114.85], [55.33, -115.3], [55.37, -115.8]]],
);
# Small Shield lakes ("dotted with lakes"): lat, lon, rx, ry, rotation
my @PONDS = ([59.78, -110.4, 4, 2.2, 15], [59.35, -110.55, 3.4, 2, -40],
    [59.88, -110.95, 3.6, 2, 30], [59.62, -110.25, 3, 1.8, -10], [59.95, -110.62, 2.6, 1.6, 0]);

# Rivers (open, smoothed): name, label position [lat, lon, rotate], points
my @RIVERS = (
    ['Bow River', [50.62, -112.3, 25], [[51.68, -116.45], [51.43, -116.18], [51.18, -115.57], [51.09, -115.35], [51.18, -114.75],
        [51.17, -114.47], [51.05, -114.07], [50.93, -113.8], [50.84, -113.3], [50.75, -112.6], [50.5, -112.1], [50.1, -111.85], [49.93, -111.7]]],
    ['', undef, [[49.93, -111.7], [49.95, -111.1], [50.04, -110.68], [50.35, -110.3], [50.62, -109.9]]],
    ['Red Deer River', [51.66, -112.82, 62], [[51.65, -116.0], [51.75, -115.3], [51.85, -114.6], [52.08, -114.15], [52.27, -113.81],
        [52.12, -113.3], [51.85, -112.95], [51.46, -112.71], [51.1, -112.05], [50.76, -111.5], [50.85, -110.6], [50.93, -109.9]]],
    ['North Saskatchewan River', undef, [[52.15, -116.9], [52.45, -116.1], [52.4, -115.3], [52.37, -114.92], [52.8, -114.45],
        [53.2, -113.95], [53.54, -113.49], [53.8, -113.0], [53.95, -112.2], [53.85, -111.4], [53.62, -110.6], [53.55, -109.9]]],
    ['Athabasca River', [55.45, -112.15, -68], [[52.2, -117.25], [52.6, -117.85], [52.88, -118.08], [53.15, -117.95], [53.4, -117.55],
        [53.65, -117.0], [53.85, -116.5], [54.14, -115.68], [54.4, -114.6], [54.72, -113.29], [55.05, -112.85], [55.6, -112.45],
        [56.2, -111.6], [56.73, -111.38], [57.2, -111.6], [57.8, -111.55], [58.3, -111.4], [58.6, -111.2]]],
    ['Peace River', [57.75, -116.7, -50], [[56.1, -120.3], [56.15, -119.0], [56.1, -118.0], [56.23, -117.29], [56.8, -117.4],
        [57.5, -117.1], [58.0, -116.5], [58.39, -116.0], [58.45, -115.1], [58.75, -114.3], [59.05, -113.2], [59.12, -112.43], [59.0, -111.45]]],
    ['Slave River', undef, [[59.0, -111.45], [59.4, -111.55], [59.87, -111.6], [60.2, -111.85]]],
    ['Milk River', [49.3, -112.35, 0], [[49.0, -113.25], [49.1, -112.6], [49.15, -112.08], [49.08, -111.62], [49.05, -111.0], [48.9, -110.5]]],
);

# ── Icons
my $IC = decode_json(slurp("$ROOT/scripts/data/game-icons/ela5-alberta-icons.json"));
# A hoodoo (not in the icon set): a pillar of soft rock under a flat cap stone
$IC->{icons}{hoodoo} = ['M196 138h120c22 0 40 12 40 27v8c0 10-12 18-28 20l-12 2c-4 0-6 3-6 7 0 30 10 60 22 92 14 38 30 82 34 138H146c4-56 20-100 34-138 12-32 22-62 22-92 0-4-2-7-6-7l-12-2c-16-2-28-10-28-20v-8c0-15 18-27 40-27z',
    'M70 432h372v32H70z'];
sub symbol_defs {
    my %used = @_;
    return join '', map {
        my $n = $_; my $paths = $IC->{icons}{$n} or die "icon $n missing\n";
        qq{<symbol id="rm-$n" viewBox="0 0 512 512">} . join('', map { qq{<path d="$_"/>} } @$paths) . '</symbol>'
    } sort keys %used;
}

# ── Region cards: icon, label (facts from the reader, texts 1–7)
my @CARDS = (
    [grassland => 'The southeast · about 1/7 of Alberta', 'Texts 2, 3', [
        ['high-grass', 'Deep-rooted grasses'], ['thermometer-hot', 'Hot, dry summers'],
        ['windy-stripes', 'Wind and chinooks'], ['hoodoo', 'Badlands, hoodoos'],
        ['owl', 'Burrowing owls'], ['wheat', 'Ranches and farms']]],
    [parkland => 'A band across the middle', 'Text 4', [
        ['birch-trees', 'Aspen groves'], ['wheat', 'Rich soil, crops'],
        ['modern-city', 'Most people live here'], ['bison', 'Bison at Elk Island']]],
    [rocky => 'The western edge · the highest land', 'Texts 3, 5', [
        ['peaks', 'Highest land, 3,747 m'], ['frozen-block', 'Glaciers, icefields'],
        ['snowflake-2', 'Coldest, deep snow'], ['ram-profile', 'Bighorn sheep'],
        ['goat', 'Mountain goats'], ['hiking', 'Banff, Jasper parks']]],
    [foothills => 'Just east of the mountains · about 1/10', 'Text 7', [
        ['hills', 'Rolling hills'], ['pine-tree', 'Lodgepole pine'],
        ['bear-head', 'Grizzly bears'], ['deer', 'Elk and moose'],
        ['logging', 'Forestry'], ['oil-pump', 'Oil and gas']]],
    [boreal => 'The north · more than half of Alberta', 'Text 4', [
        ['forest', 'Spruce, pine, aspen'], ['swamp', 'Muskeg and lakes'],
        ['thermometer-cold', 'Long, cold winters'], ['wolf-head', 'Wolves, lynx, caribou'],
        ['nest-birds', 'Nesting birds'], ['wildfires', 'Fire renews forest']]],
    [shield => 'A small corner in the far northeast', 'Text 6', [
        ['rock', 'Very old bare rock'], ['waves', 'Thousands of lakes'], ['frozen-block', 'Scraped by ice']]],
);

# ── Icons on the map: region, icon, lat, lon
my @MAPICONS = (
    [grassland => 'wheat', 50.3, -110.6], [grassland => 'high-grass', 51.4, -110.7], [grassland => 'owl', 49.45, -110.6],
    [grassland => 'thermometer-hot', 49.5, -111.9],
    [parkland => 'birch-trees', 52.75, -111.25], [parkland => 'wheat', 52.15, -112.7],
    [rocky => 'peaks', 51.85, -116.25], [rocky => 'ram-profile', 53.45, -118.45],
    [foothills => 'pine-tree', 54.45, -117.3], [foothills => 'oil-pump', 53.55, -116.2], [foothills => 'bear-head', 54.35, -119.15],
    [boreal => 'forest', 58.75, -118.1], [boreal => 'swamp', 56.9, -113.3], [boreal => 'wolf-head', 56.3, -115.4],
    [boreal => 'thermometer-cold', 59.45, -115.6], [boreal => 'wildfires', 55.45, -111.0], [boreal => 'nest-birds', 57.6, -119.25],
    [shield => 'rock', 59.6, -110.8],
);
# Landmarks (icon pins with a label): icon, lat, lon, label lines, label dx, dy, anchor
my @LANDMARKS = (
    ['frozen-block', 52.15, -117.43, ['Mount Columbia', '3,747 m'], -16, -6, 'end'],
    ['hoodoo', 50.76, -111.5, ['Badlands'], 15, 4, 'start'],
    ['bison', 53.62, -112.75, ['Elk Island'], 15, 4, 'start'],
);
# Places: name, lat, lon, kind (capital | city | town), label dx, dy, anchor
my @PLACES = (
    ['Edmonton', 53.546, -113.49, 'capital', -9, -5, 'end'],
    ['Calgary', 51.045, -114.06, 'city', 7, 13, 'start'],
    ['Red Deer', 52.27, -113.81, 'city', 7, -5, 'start'],
    ['Banff', 51.178, -115.57, 'town', -6, -3, 'end'],
    ['Jasper', 52.877, -118.08, 'town', -6, 3, 'end'],
    ['Hinton', 53.40, -117.58, 'town', 6, 9, 'start'],
    ['Pincher Creek', 49.49, -113.95, 'town', 6, 10, 'start'],
    ["Writing-on-Stone (Áísínai'pi)", 49.08, -111.62, 'site', 0, 15, 'middle'],
);
# Region names on the map: key, lat, lon, rotate, lines
my @RLABELS = (
    [boreal => 57.55, -114.8, 0, ['BOREAL', 'FOREST']],
    [grassland => 50.05, -111.9, 0, ['GRASSLAND']],
    [parkland => 53.15, -111.6, -8, ['PARKLAND']],
    [parkland => 55.78, -118.35, -30, ['Parkland'], 's'],
    [foothills => 53.95, -116.65, -42, ['FOOTHILLS']],
    [rocky => 51.0, -115.15, -54, ['ROCKY MOUNTAIN']],
);

# ── Draw the map
my %need;
$need{$_->[1]}++ for @MAPICONS; $need{$_->[0]}++ for @LANDMARKS; $need{'windy-stripes'}++;
for my $c (@CARDS) { $need{$_->[0]}++ for @{ $c->[3] } }

my $svg = qq{<svg class="rm-svg" viewBox="0 0 $W $H" role="img" aria-labelledby="rm-t rm-d">}
    . qq{<title id="rm-t">Map of Alberta's six natural regions</title>}
    . qq{<desc id="rm-d">Alberta divided into six natural regions. The Boreal Forest covers the north, more than half the province. }
    . qq{The Canadian Shield is a small corner in the far northeast beside Lake Athabasca. The Rocky Mountain region runs along the southwest edge, }
    . qq{with the Foothills just east of it. The Parkland is a band across the middle, from Calgary to Edmonton and east to Saskatchewan, with a small piece near the Peace River. }
    . qq{The Grassland covers the southeast. Icons show each region's land, weather, plants, animals and work.</desc>}
    . '<defs>' . symbol_defs(%need)
    . qq{<clipPath id="rm-ab"><path d="$AB_D"/></clipPath>}
    . qq{<marker id="rm-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#b45309"/></marker>}
    . '</defs>';

# neighbours
$svg .= qq{<rect x="0" y="0" width="$W" height="$H" fill="#f3f1ec"/>};
my $nl = sub { my ($lat, $lon, $t, $rot, $anchor) = @_; my ($x, $y) = P($lat, $lon);
    return qq{<text class="rm-nb" x="} . f1($x) . qq{" y="} . f1($y) . qq{" text-anchor="} . ($anchor // 'middle') . '"'
        . ($rot ? qq{ transform="rotate($rot } . f1($x) . ' ' . f1($y) . ')"' : '') . ">$t</text>"; };
$svg .= $nl->(60.2, -115.0, 'NORTHWEST TERRITORIES');
$svg .= $nl->(48.5, -113.6, 'MONTANA (USA)');
$svg .= $nl->(55.0, -109.35, 'SASKATCHEWAN', 90);
{ my (undef, $by) = P(52.95, -120); $svg .= qq{<text class="rm-nb" x="8" y="} . f1($by) . qq{"><tspan x="8">BRITISH</tspan><tspan x="8" dy="1.2em">COLUMBIA</tspan></text>}; }

# regions
$svg .= qq{<g clip-path="url(#rm-ab)"><path d="$AB_D" fill="$R{boreal}{fill}"/>};
for my $s (@SHAPES) { $svg .= qq{<path d="} . path_d($s->[1], 1) . qq{" fill="$R{$s->[0]}{fill}"/>}; }
# lakes and rivers
for my $l (@LAKES) { $svg .= qq{<path class="rm-lake" d="} . path_d($l->[1], 1) . '"/>'; }
for my $p (@PONDS) { my ($x, $y) = P($p->[0], $p->[1]);
    $svg .= qq{<ellipse class="rm-lake" cx="} . f1($x) . qq{" cy="} . f1($y) . qq{" rx="$p->[2]" ry="$p->[3]" transform="rotate($p->[4] } . f1($x) . ' ' . f1($y) . ')"/>'; }
for my $r (@RIVERS) { $svg .= qq{<path class="rm-river" d="} . path_d($r->[2], 0) . '"/>'; }
$svg .= '</g>';
$svg .= qq{<path d="$AB_D" fill="none" stroke="#3f3b35" stroke-width="1.6" stroke-linejoin="round"/>};

# river and lake labels
for my $r (@RIVERS) { next unless $r->[1]; my ($lat, $lon, $rot) = @{ $r->[1] }; my ($x, $y) = P($lat, $lon);
    $svg .= qq{<text class="rm-wl" x="} . f1($x) . qq{" y="} . f1($y) . qq{" text-anchor="middle" transform="rotate($rot } . f1($x) . ' ' . f1($y) . qq{)">$r->[0]</text>}; }
{ my ($x, $y) = P(58.36, -110.55); $svg .= qq{<text class="rm-wl" x="} . f1($x) . qq{" y="} . f1($y) . qq{" text-anchor="middle" transform="rotate(-28 } . f1($x) . ' ' . f1($y) . qq{)">Lake Athabasca</text>}; }

# chinook arrow
{ my $d = path_d([[49.95, -114.75], [50.2, -114.05], [50.3, -113.2]], 0);
  my ($x, $y) = P(49.83, -113.75);
  $svg .= qq{<path d="$d" fill="none" stroke="#b45309" stroke-width="2.4" stroke-dasharray="6 4" marker-end="url(#rm-arr)"/>}
       . qq{<text class="rm-ch" x="} . f1($x) . qq{" y="} . f1($y) . qq{" text-anchor="middle">chinook</text>}; }

# region names
for my $l (@RLABELS) {
    my ($k, $lat, $lon, $rot, $lines, $small) = @$l; my ($x, $y) = P($lat, $lon);
    my $t = qq{<text class="rm-rn} . ($small ? ' rm-rn-s' : '') . qq{" fill="$R{$k}{ink}" x="} . f1($x) . qq{" y="} . f1($y) . '" text-anchor="middle"'
        . ($rot ? qq{ transform="rotate($rot } . f1($x) . ' ' . f1($y) . ')"' : '') . '>';
    my $i = 0; $t .= join '', map { '<tspan x="' . f1($x) . '" dy="' . ($i++ ? '1.05em' : '0') . qq{">$_</tspan>} } @$lines;
    $svg .= "$t</text>";
}
# Canadian Shield name sits outside the outline with a leader line
{ my ($x, $y) = P(59.62, -110.75); my ($lx, $ly) = ($W - 6, $y + 52);
  $svg .= qq{<path d="M} . f1($x + 10) . ',' . f1($y + 8) . 'L' . f1($lx - 30) . ',' . f1($ly - 12) . qq{" stroke="$R{shield}{ink}" stroke-width="1.2" fill="none"/>}
       . qq{<text class="rm-rn rm-rn-s" fill="$R{shield}{ink}" x="$lx" y="} . f1($ly) . qq{" text-anchor="end"><tspan x="$lx">CANADIAN</tspan><tspan x="$lx" dy="1.05em">SHIELD</tspan></text>}; }

# icons on the map
my $badge = sub { my ($k, $icon, $x, $y, $r) = @_; $r //= 12; my $s = $r * 1.45;
    return qq{<g class="rm-badge"><circle cx="} . f1($x) . qq{" cy="} . f1($y) . qq{" r="$r" fill="#fff" stroke="$R{$k}{ink}" stroke-width="1.4"/>}
        . qq{<use href="#rm-$icon" x="} . f1($x - $s / 2) . qq{" y="} . f1($y - $s / 2) . qq{" width="} . f1($s) . qq{" height="} . f1($s) . qq{" fill="$R{$k}{ink}"/></g>}; };
$svg .= $badge->($_->[0], $_->[1], P($_->[2], $_->[3])) for @MAPICONS;

# places
for my $p (@PLACES) {
    my ($name, $lat, $lon, $kind, $dx, $dy, $anchor) = @$p; my ($x, $y) = P($lat, $lon);
    if ($kind eq 'capital') {
        my @pt; for my $i (0 .. 9) { my $a = $PI / 2 + $i * $PI / 5; my $rr = $i % 2 ? 2.9 : 7; push @pt, f1($x + $rr * cos($a)) . ',' . f1($y - $rr * sin($a)); }
        $svg .= '<polygon points="' . join(' ', @pt) . '" fill="#b91c1c" stroke="#fff" stroke-width="1"/>';
    } elsif ($kind eq 'site') {
        $svg .= qq{<rect x="} . f1($x - 4) . qq{" y="} . f1($y - 4) . qq{" width="8" height="8" transform="rotate(45 } . f1($x) . ' ' . f1($y) . qq{)" fill="#7c2d12" stroke="#fff" stroke-width="1"/>};
    } else {
        my $r = $kind eq 'city' ? 4.2 : 3;
        $svg .= qq{<circle cx="} . f1($x) . qq{" cy="} . f1($y) . qq{" r="$r" fill="#1f1d1a" stroke="#fff" stroke-width="1.2"/>};
    }
    my $cls = $kind eq 'town' || $kind eq 'site' ? 'rm-pl rm-pl-t' : 'rm-pl';
    $svg .= qq{<text class="$cls" x="} . f1($x + $dx) . qq{" y="} . f1($y + $dy) . qq{" text-anchor="$anchor">$name</text>};
}
# landmarks
for my $l (@LANDMARKS) {
    my ($icon, $lat, $lon, $lines, $dx, $dy, $anchor) = @$l; my ($x, $y) = P($lat, $lon);
    my $k = $icon eq 'hoodoo' ? 'grassland' : $icon eq 'bison' ? 'parkland' : 'rocky';
    $svg .= $badge->($k, $icon, $x, $y, 12);
    my $i = 0;
    $svg .= qq{<text class="rm-pl rm-pl-t" x="} . f1($x + $dx) . qq{" y="} . f1($y + $dy) . qq{" text-anchor="$anchor">}
        . join('', map { '<tspan x="' . f1($x + $dx) . '" dy="' . ($i++ ? '1.1em' : '0') . qq{">$_</tspan>} } @$lines) . '</text>';
}

# ── Map key, compass and scale (in British Columbia, beside the southern Rockies)
{
    my $kx = 6;
    my (undef, $ky) = P(51.85, -115);
    my $k = qq{<g class="rm-key" transform="translate($kx } . f1($ky) . ')">';
    $k .= '<rect x="0" y="0" width="136" height="212" rx="8" fill="#fff" stroke="#c9c4b9"/>';
    $k .= '<text class="rm-kh" x="10" y="20">Map key</text>';
    # compass, top right of the key
    $k .= '<g transform="translate(110 26)"><circle r="15" fill="#fff" stroke="#c9c4b9"/>'
        . '<path d="M0 -11L4.5 2L0 -1.5L-4.5 2Z" fill="#1f1d1a"/><path d="M0 11L4.5 2L0 5L-4.5 2Z" fill="#fff" stroke="#1f1d1a" stroke-width="1"/>'
        . '<text class="rm-kn" x="-23" y="4" text-anchor="middle">N</text></g>';
    my $row = 50;
    my $item = sub { my ($sym, $txt) = @_; my $s = qq{<g transform="translate(10 $row)">$sym<text class="rm-kt" x="30" y="4">$txt</text></g>}; $row += 17; return $s; };
    my @star; for my $i (0 .. 9) { my $a = $PI / 2 + $i * $PI / 5; my $rr = $i % 2 ? 2.9 : 7; push @star, f1(10 + $rr * cos($a)) . ',' . f1(0 - $rr * sin($a)); }
    $k .= $item->('<polygon points="' . join(' ', @star) . '" fill="#b91c1c"/>', 'Capital city');
    $k .= $item->('<circle cx="10" cy="0" r="4.2" fill="#1f1d1a"/>', 'City');
    $k .= $item->('<circle cx="10" cy="0" r="3" fill="#1f1d1a"/>', 'Town');
    $k .= $item->('<rect x="6" y="-4" width="8" height="8" transform="rotate(45 10 0)" fill="#7c2d12"/>', 'Special place');
    $k .= $item->('<path class="rm-river" d="M0 0C6 -5 14 5 20 0"/>', 'River');
    $k .= $item->('<ellipse class="rm-lake" cx="10" cy="0" rx="10" ry="5"/>', 'Lake');
    $k .= $item->('<path d="M0 0H20" stroke="#b45309" stroke-width="2.4" stroke-dasharray="5 3"/>', 'Chinook wind');
    $k .= $item->('<circle cx="10" cy="0" r="8" fill="#fff" stroke="#6b665d" stroke-width="1.2"/><use href="#rm-pine-tree" x="3.5" y="-6.5" width="13" height="13" fill="#6b665d"/>', 'What it is like');
    # scale bar: 100 km
    my $px = 100 / 111.2 * $K;
    $k .= qq{<g transform="translate(10 } . ($row + 4) . ')"><rect x="0" y="0" width="' . f1($px / 2) . '" height="5" fill="#1f1d1a"/><rect x="' . f1($px / 2) . '" y="0" width="' . f1($px / 2) . '" height="5" fill="#fff" stroke="#1f1d1a" stroke-width="1"/>'
        . '<text class="rm-kt" x="0" y="17">0</text><text class="rm-kt" x="' . f1($px) . '" y="17" text-anchor="middle">100 km</text></g>';
    $k .= '</g>';
    $svg .= $k;
}
$svg .= '</svg>';

# ── Region cards
my $cards = '';
for my $c (@CARDS) {
    my ($k, $where, $texts, $items) = @$c;
    $cards .= qq{<div class="rm-card" style="--rf:$R{$k}{fill};--ri:$R{$k}{ink}">}
        . qq{<div class="rm-ch-h"><span class="rm-sw"></span><span class="rm-cn">$R{$k}{name}</span><span class="rm-tx">$texts</span></div>}
        . qq{<div class="rm-where">$where</div><div class="rm-items">}
        . join('', map { qq{<div class="rm-it"><svg class="rm-ic" viewBox="0 0 512 512" aria-hidden="true"><use href="#rm-$_->[0]"/></svg><span>$_->[1]</span></div>} } @$items)
        . '</div></div>';
}

my $css = <<'CSS';
<style>
  .rm { display: grid; grid-template-columns: 58fr 42fr; gap: 14px; align-items: start; margin: 6px 0 4px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  @media (max-width: 640px) { .rm { grid-template-columns: minmax(0, 1fr); } }
  .rm > * { min-width: 0; }
  .rm-map { margin: 0; break-inside: avoid; }
  .rm-svg { display: block; width: 100%; height: auto; border: 1.5px solid #c9c4b9; border-radius: 10px; }
  .rm-svg text { font-family: var(--font-body, system-ui, sans-serif); }
  .rm-nb { font-size: 9.5px; font-weight: 700; letter-spacing: .14em; fill: #8d877c; }
  .rm-rn { font-size: 14px; font-weight: 800; letter-spacing: .06em; paint-order: stroke; stroke: rgba(255,255,255,.85); stroke-width: 3.5px; stroke-linejoin: round; }
  .rm-rn-s { font-size: 11px; }
  .rm-pl { font-size: 11px; font-weight: 700; fill: #1f1d1a; paint-order: stroke; stroke: #fff; stroke-width: 3px; stroke-linejoin: round; }
  .rm-pl-t { font-size: 9.5px; font-weight: 600; }
  .rm-wl { font-size: 8.5px; font-style: italic; fill: #1d5f99; paint-order: stroke; stroke: rgba(255,255,255,.8); stroke-width: 2.5px; }
  .rm-ch { font-size: 10px; font-weight: 700; font-style: italic; fill: #b45309; paint-order: stroke; stroke: #fff; stroke-width: 3px; }
  .rm-lake { fill: #9ccbec; stroke: #3b82c4; stroke-width: .8; }
  .rm-river { fill: none; stroke: #3b82c4; stroke-width: 1.6; stroke-linecap: round; }
  .rm-kh { font-size: 11px; font-weight: 800; fill: #1f1d1a; }
  .rm-kt { font-size: 9.5px; fill: #3f3b35; }
  .rm-kn { font-size: 11px; font-weight: 800; fill: #1f1d1a; }
  .rm-cards { display: grid; gap: 7px; }
  .rm-card { border: 1.5px solid var(--ri); border-left: 7px solid var(--ri); border-radius: 0 10px 10px 0; background: #fff; padding: 6px 9px 7px; break-inside: avoid; }
  .rm-ch-h { display: flex; align-items: center; gap: 7px; }
  .rm-sw { width: 14px; height: 14px; border-radius: 4px; background: var(--rf); border: 1.5px solid var(--ri); flex: 0 0 auto; }
  .rm-cn { font-family: var(--font-display, Georgia, serif); font-weight: 700; font-size: 12.5pt; color: var(--ri); line-height: 1.15; }
  .rm-tx { margin-left: auto; font-size: 8pt; font-weight: 700; color: #6b665d; white-space: nowrap; }
  .rm-where { font-size: 8.5pt; color: #3f3b35; margin: 1px 0 4px; }
  .rm-items { display: grid; grid-template-columns: 1fr 1fr; gap: 3px 8px; }
  .rm-it { display: flex; align-items: center; gap: 6px; font-size: 8.8pt; line-height: 1.2; }
  .rm-ic { width: 22px; height: 22px; flex: 0 0 22px; fill: var(--ri); background: var(--rf); border-radius: 6px; padding: 2px; }
  .rm-src { font-size: 8pt; color: #6b665d; margin: 6px 0 0; }
  @media print {
    .rm { grid-template-columns: 52fr 48fr; gap: 10px; }
    .rm-cards { gap: 5px; }
    .rm-card { padding: 4px 8px 5px; }
    .rm-cn { font-size: 11.5pt; }
    .rm-where { margin-bottom: 3px; }
    .rm-it { font-size: 8.4pt; }
    .rm-ic { width: 19px; height: 19px; flex-basis: 19px; }
  }
  body.ed-c .rm-it { font-size: 10.5pt; } body.ed-c .rm-where { font-size: 10pt; }
  @media print { body.ed-c .rm-it { font-size: 9pt; } body.ed-c .rm-where { font-size: 9pt; } }
</style>
CSS

my $html = "<!-- Built by scripts/build_ela5_alberta_map.pl. Do not edit by hand. -->\n$css"
    . qq{<div class="rm"><figure class="rm-map">$svg</figure><div class="rm-cards">$cards</div></div>\n}
    . qq{<p class="rm-src">Region edges are simplified. Outline: Natural Earth (public domain). Icons: game-icons.net, by Lorc, Delapouite and others (CC BY 3.0).</p>\n};

my $dir = "$ROOT/worksheets/grade-5-ela/_visuals";
make_path($dir);
open my $fh, '>', "$dir/alberta-regions-map.html" or die $!; print $fh $html; close $fh;
print "wrote worksheets/grade-5-ela/_visuals/alberta-regions-map.html (", length($html), " chars)\n";

# ── Region shares (a check against the reader: Grassland ~1/7, Foothills ~1/10, Boreal > 1/2)
sub inpoly { my ($lat, $lon, $poly) = @_; my $in = 0; my $n = @$poly;
    for (my ($i, $j) = (0, $n - 1); $i < $n; $j = $i++) { my ($ai, $bi) = @{ $poly->[$i] }[-2, -1]; my ($aj, $bj) = @{ $poly->[$j] }[-2, -1];
        $in = !$in if (($ai > $lat) != ($aj > $lat)) && ($lon < ($bj - $bi) * ($lat - $ai) / ($aj - $ai) + $bi); }
    return $in; }
my @abp = map { [$_->[1], $_->[0]] } @$ring;
my (%area, $tot);
for (my $lat = 49.0; $lat <= 60.0; $lat += 0.05) { for (my $lon = -120.0; $lon <= -110.0; $lon += 0.05) {
    next unless inpoly($lat, $lon, \@abp);
    my $w = cos($lat * $PI / 180); my $who = 'boreal';
    for my $s (@SHAPES) { $who = $s->[0] if inpoly($lat, $lon, $s->[1]); }
    $area{$who} += $w; $tot += $w; } }
printf "  %-10s %5.1f%%\n", $_, 100 * $area{$_} / $tot for sort { $area{$b} <=> $area{$a} } keys %area;
