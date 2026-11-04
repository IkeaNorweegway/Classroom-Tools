#!/usr/bin/env perl
# viz_gallery.pl — draw every use of one Math 7/8 diagram type, for review.
#
#   perl scripts/viz_gallery.pl --list                 types, how often each is used, file that draws it
#   perl scripts/viz_gallery.pl TYPE [--key] [--out DIR] [--max N]
#   perl scripts/viz_gallery.pl TYPE --compare [--key] [--out DIR]
#
# Reads every `@viz TYPE …` line in the markdown sources (Math 7, Math 8, home
# practice), draws each distinct line once, and writes HTML pages plus PNG
# screenshots (headless Chrome) to DIR (default: the scratchpad or /tmp).
# --compare puts the last committed library (git HEAD) on the left and the
# working copy on the right, marks the diagrams whose SVG changed, and prints
# how many changed. --key draws the answer-key version (answers filled in).
# Diagrams show at print size; pages are cut so each PNG is at most about
# 1800 px tall. Each item says WORDS CHANGED if its labels or numbers differ.
#
# Nothing in the repo is written. Used by the image-polish agent.
use strict;
use warnings;
use utf8;
use File::Basename qw(dirname);
use Cwd qw(abs_path);
use File::Path qw(make_path remove_tree);
use File::Temp qw(tempdir);
use POSIX qw(ceil);
binmode STDOUT, ':utf8';

my $ROOT = abs_path(dirname(abs_path($0)) . '/..');
my %o = (max => 0);
my @pos;
while (@ARGV) {
    my $a = shift @ARGV;
    if    ($a eq '--list')    { $o{list} = 1 }
    elsif ($a eq '--key')     { $o{key} = 1 }
    elsif ($a eq '--compare') { $o{compare} = 1 }
    elsif ($a eq '--out')     { $o{out} = shift @ARGV }
    elsif ($a eq '--max')     { $o{max} = shift @ARGV }
    elsif ($a eq '--lib')     { $o{lib} = shift @ARGV }    # internal: draw with the library in this folder
    elsif ($a eq '--dump')    { $o{dump} = 1 }             # internal: print the SVGs, one per record
    else                      { push @pos, $a }
}
my $TYPE = $pos[0];

# ── sources ───────────────────────────────────────────────────────────────
sub uses {
    my ($type) = @_;
    my @files = grep { !m{/node_modules/|/public/|/\.git/} } split /\n/, `cd '$ROOT' && grep -rlE '^\\s*\@viz ' --include='*.md' . 2>/dev/null`;
    my (%seen, @u);
    for my $f (sort @files) {
        open my $fh, '<:utf8', "$ROOT/$f" or next;
        while (my $l = <$fh>) {
            next unless $l =~ /^\s*\@viz\s+(\w+)/;
            my $t = $1;
            next if defined $type && $t ne $type;
            chomp $l; $l =~ s/^\s+//;
            (my $where = $f) =~ s{^\./}{};
            if ($seen{$l}) { $seen{$l}{n}++; next; }
            push @u, $seen{$l} = { line => $l, type => $t, where => "$where:$.", n => 1 };
        }
    }
    return @u;
}

# ── --list ────────────────────────────────────────────────────────────────
if ($o{list}) {
    my %n; my %d;
    for my $u (uses()) { $n{$u->{type}} += $u->{n}; $d{$u->{type}}++; }
    my %def;
    for my $f ("$ROOT/scripts/Math8Viz.pm", glob("$ROOT/scripts/vizext/*.pl")) {
        open my $fh, '<', $f or next;
        while (<$fh>) { $def{$1} //= ($f =~ s{^\Q$ROOT\E/}{}r) . ":$." if /^sub draw_(\w+)/; }
    }
    printf "%-14s %5s %5s  %s\n", 'type', 'uses', 'disti', 'drawn in';
    printf "%-14s %5d %5d  %s\n", $_, $n{$_}, $d{$_}, $def{$_} // '?' for sort { $n{$b} <=> $n{$a} } keys %n;
    exit 0;
}
die "usage: viz_gallery.pl --list | TYPE [--key] [--compare] [--out DIR] [--max N]\n" unless $TYPE;

# ── --dump (child process: draw with one library) ─────────────────────────
if ($o{dump}) {
    unshift @INC, $o{lib} // "$ROOT/scripts";
    require Math8Viz;
    no warnings 'once';
    $Math8Viz::KEY = $o{key} ? 1 : 0;
    binmode STDOUT, ':utf8';
    for my $u (uses($TYPE)) {
        my ($svg, $cap) = eval { Math8Viz::draw($u->{line}) };
        $svg = "<p class='err'>ERROR: " . ($@ =~ s/</&lt;/gr) . "</p>" unless defined $svg;
        $svg =~ s/^<!--.*?-->\n//s;
        print "\x1e", $svg, "\x1f", ($cap // ''), "\n";
    }
    exit 0;
}

sub draw_all {
    my ($lib) = @_;
    my @cmd = ($^X, abs_path($0), $TYPE, '--dump', '--lib', $lib, ($o{key} ? '--key' : ()));
    open my $p, '-|:utf8', @cmd or die "cannot run dump: $!";
    local $/; my $all = <$p>; close $p;
    my @r = map { [split /\x1f/, $_, 2] } grep { length } split /\x1e/, $all;
    s/\n\z// for map { $_->[1] } @r;
    return @r;
}

my @U = uses($TYPE);
die "no \@viz $TYPE lines found\n" unless @U;
@U = @U[0 .. $o{max} - 1] if $o{max} && $o{max} < @U;

my @after = draw_all("$ROOT/scripts");
my @before;
if ($o{compare}) {
    my $old = tempdir(CLEANUP => 1);
    make_path("$old/vizext");
    system("cd '$ROOT' && git show HEAD:scripts/Math8Viz.pm > '$old/Math8Viz.pm'") == 0 or die "git show failed\n";
    for my $f (split /\n/, `cd '$ROOT' && git ls-tree --name-only HEAD scripts/vizext/`) {
        (my $b = $f) =~ s{.*/}{};
        system("cd '$ROOT' && git show 'HEAD:$f' > '$old/vizext/$b'");
    }
    @before = draw_all($old);
}

# ── page ──────────────────────────────────────────────────────────────────
my $src = do { open my $fh, '<:utf8', "$ROOT/scripts/render_math8.pl" or die; local $/; <$fh> };
my ($css) = $src =~ /my \$BASE_CSS = <<'CSS';\n(.*?)\nCSS\n/s or die "BASE_CSS not found in render_math8.pl\n";
my $fonts = "file://$ROOT/public/fonts";
my $head = <<"HTML";
<!doctype html><html><head><meta charset="utf-8"><style>
\@font-face { font-family: 'Atkinson Hyperlegible Next'; font-weight: 200 800; src: url('$fonts/atkinson-hyperlegible-next-latin-wght-normal.woff2') format('woff2-variations'); }
\@font-face { font-family: 'Fraunces'; font-weight: 100 900; src: url('$fonts/fraunces-latin-wght-normal.woff2') format('woff2-variations'); }
:root { --accent: #2f6f8f; --accent-light: #e6f0f4; --accent-mid: #9cc3d3; }
$css
body { margin: 12px; background: #fff; max-width: none !important; width: auto !important; padding: 0 !important; }
.g-item { border-bottom: 1px solid #ccc; padding: 6px 0 10px; break-inside: avoid; }
.g-meta { font: 12px/1.3 monospace; color: #555; margin-bottom: 4px; }
.g-meta b { color: #000; }
.g-meta .chg { background: #ffe08a; color: #000; padding: 0 4px; font-weight: bold; }
.g-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
.grid3 { display: grid; grid-template-columns: repeat(2, 620px); gap: 0 24px; }
.g-row .viz { margin: 0; }
.g-row .viz svg { max-width: 100%; height: auto; }
.g-side { font: bold 11px sans-serif; color: #888; }
.err { color: #b00; font: 12px monospace; }
</style></head><body>
HTML

my $COLW = 620;   # about the printed column width: diagrams show at print size
sub disp_h {
    my ($svg) = @_;
    my ($w, $h) = $svg =~ /viewBox="0 0 ([\d.]+) ([\d.]+)"/ ? ($1, $2) : (400, 200);
    return $h * ($w > $COLW ? $COLW / $w : 1);
}
sub words {   # every <text> string in order: what the diagram says
    my ($svg) = @_;
    my @t = $svg =~ m{<text\b[^>]*>(.*?)</text>}gs;
    s/<[^>]+>//g for @t;
    return join ' | ', grep { /\S/ } @t;
}
sub fig { my ($r) = @_; my $c = length $r->[1] ? "<figcaption>$r->[1]</figcaption>" : ''; return "<figure class='viz'>$r->[0]$c</figure>"; }

my $out = $o{out} // (-d '/tmp' ? "/tmp/viz-gallery/$TYPE" : "viz-gallery/$TYPE");
remove_tree($out); make_path($out);

my (@pages, $cur, $curh, $changed, @textdiff);
for my $i (0 .. $#U) {
    my $u = $U[$i];
    my $af = $after[$i] // ['<p class=err>missing</p>', ''];
    my $chg = $o{compare} && $before[$i] && $before[$i][0] ne $af->[0];
    $changed++ if $chg;
    my $wd = $chg && words($before[$i][0]) ne words($af->[0]);
    push @textdiff, $i + 1 if $wd;
    (my $line = $u->{line}) =~ s/&/&amp;/g; $line =~ s/</&lt;/g;
    $line = substr($line, 0, 200) . ' …' if length $line > 200;
    my $meta = sprintf("<div class='g-meta'><b>#%d</b> %s%s · used %d× · %s</div>", $i + 1,
        ($chg ? "<span class='chg'>CHANGED</span> " : '') . ($wd ? "<span class='chg' style='background:#f88'>WORDS CHANGED</span> " : ''), $u->{where}, $u->{n}, $line);
    my $row = $o{compare}
        ? "<div class='g-row'><div><div class='g-side'>BEFORE (HEAD)</div>" . fig($before[$i] // ['', '']) . "</div><div><div class='g-side'>AFTER</div>" . fig($af) . "</div></div>"
        : "<div class='g-row' style='display:block'>" . fig($af) . "</div>";
    my $ha = disp_h($af->[0]);
    my $hb = $o{compare} ? disp_h(($before[$i] // [''])->[0]) : 0;
    my $h = 76 + ($ha > $hb ? $ha : $hb) + (length $af->[1] ? 40 : 0);
    $h /= 2 unless $o{compare};   # two to a row
    if (!$cur || $curh + $h > 1800) { push @pages, $cur = []; $curh = 0; }
    push @$cur, "<div class='g-item'>$meta$row</div>";
    $curh += $h;
}

my $chrome = (grep { -x } map { "$_" } '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser')[0];
my $n = 0;
for my $p (@pages) {
    $n++;
    my $base = sprintf('%s/page-%02d', $out, $n);
    open my $fh, '>:utf8', "$base.html" or die; print $fh $head, ($o{compare} ? @$p : ("<div class='grid3'>", @$p, '</div>')), "</body></html>\n"; close $fh;
    next unless $chrome;
    system("'$chrome' --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1300,1900 --screenshot='$base.png' 'file://" . abs_path("$base.html") . "' >/dev/null 2>&1");
}

printf "%s: %d distinct diagrams (%d uses)%s → %d page(s) in %s%s\n", $TYPE, scalar @U, (eval { my $s = 0; $s += $_->{n} for @U; $s }),
    ($o{compare} ? sprintf(', %d changed', $changed // 0) : ''), $n, $out, ($chrome ? '' : ' (no Chrome: HTML only)');
if ($o{compare} && $changed) {
    my @c = grep { $before[$_] && $after[$_] && $before[$_][0] ne $after[$_][0] } 0 .. $#U;
    print "changed: #", join(', #', map { $_ + 1 } @c), "\n";
}
print "WORDS CHANGED (labels or numbers differ — not allowed): #", join(', #', @textdiff), "\n" if @textdiff;
