package Math8Viz; use strict; use warnings; use utf8; our %DOC; our $KEY;
use List::Util qw(max min sum);

# Solving Equations (Math 8, topic 5): multiply EVERY term by the same number,
# distribute a factor to every term in brackets, and a bar split into equal parts
# for a fraction coefficient. Labels may hold stacked fractions written {a/b}.

$DOC{semult} = 'top="{1/2}x;+ 3;=;5" by="× 2" bottom="x;+ 6;=;10" (terms split by ; and "=" is its own item; bottom items may be [[…]]) miss="2,4" (item numbers the arrow skips: a red ✗ box for the mistake) title (every term times the same number)';
$DOC{sedist} = 'factor="−2" terms="x;− 3" result="[[−2x]];[[+ 6]]" title (arrows from the factor to every term in the brackets)';
$DOC{sebar}  = 'parts=3 shade=1 value="4" (label in each shaded part) rest="[[4]]" (label in the other parts) whole="x" (brace label over the bar) note="x = [[12]]" title width=380 (a bar split into equal parts: a fraction of x)';

# ── fraction-aware text ──────────────────────────────────────────────────
sub se_segs { my ($s) = @_; return grep { $_ ne '' } split /(\[\[.*?\]\]|\{[^{}\/]+\/[^{}]+\})/, ($s // ''); }
sub se_fs { my ($cls) = @_; return $cls eq 'dg-math' || $cls eq 'dg-math-accent' ? 15 : $cls eq 'dg-title' ? 13 : 12; }
sub se_w {
    my ($s, $fs) = @_;
    my $w = 0;
    for my $g (se_segs($s)) {
        if ($g =~ /^\[\[(.*)\]\]$/) { $w += $KEY ? se_w($1, $fs) : max(30, se_w($1, $fs) + 16); }
        elsif ($g =~ m{^\{([^{}/]+)/([^{}]+)\}$}) { $w += max(length($1), length($2)) * $fs * 0.5 + 6; }
        else { $w += tw($g, $fs); }
    }
    return $w;
}
sub se_text {
    my ($x, $y, $s, %o) = @_;
    my $cls = $o{cls} || 'dg-math';
    my $fs = se_fs($cls);
    my $anchor = $o{anchor} || 'middle';
    my $total = se_w($s, $fs);
    my $cx = $anchor eq 'middle' ? $x - $total / 2 : $anchor eq 'end' ? $x - $total : $x;
    my $out = '';
    for my $g (se_segs($s)) {
        my $w = se_w($g, $fs);
        if ($g =~ /^\[\[(.*)\]\]$/) {
            my $in = $1;
            if ($KEY) { $out .= se_text($cx, $y, $in, cls => 'dg-math-accent', anchor => 'start'); }
            else { $out .= sprintf('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="3" class="dg-tag"/>', $cx + 2, $y - $fs - 1, $w - 4, $fs + 7); }
        } elsif ($g =~ m{^\{([^{}/]+)/([^{}]+)\}$}) {
            my ($n, $d) = ($1, $2);
            my $m = $cx + $w / 2;
            my $sc = $cls =~ /accent/ ? 'dg-label-accent' : 'dg-label';
            $out .= T($m, $y - 9, $n, anchor => 'middle', cls => $sc);
            $out .= line($cx + 2, $y - 5, $cx + $w - 2, $y - 5, 'dg-line');
            $out .= T($m, $y + 8, $d, anchor => 'middle', cls => $sc);
        } else {
            $out .= sprintf('<text x="%.1f" y="%.1f" text-anchor="start" class="%s">%s</text>', $cx, $y, $cls, xesc($g));
        }
        $cx += $w;
    }
    return $out;
}
sub se_plain { my ($s) = @_; $s = plain($s); $s =~ s{\{([^{}/]+)/([^{}]+)\}}{$1/$2}g; return $s; }

# ── semult ───────────────────────────────────────────────────────────────
sub draw_semult {
    my ($A) = @_;
    my @top = list($A->{top}, qr/\s*;\s*/);
    my @bot = list($A->{bottom}, qr/\s*;\s*/);
    my $by = $A->{by} // '× 2';
    my %miss = map { $_ => 1 } list($A->{miss});
    my $t0 = $A->{title} ? 24 : 4;
    my ($bh, $y1) = (40, $t0 + 6);
    my $y2 = $y1 + $bh + 52;
    my $b = '';
    $b .= T(8, 16, $A->{title}, cls => 'dg-title') if $A->{title};
    my $x = 14;
    my @cx;
    for my $i (0 .. $#top) {
        my $t = $top[$i];
        my $u = $bot[$i] // '';
        if ($t eq '=') {
            push @cx, $x + 14;
            $b .= T($x + 14, $y1 + 26, '=', anchor => 'middle', cls => 'dg-math');
            $b .= T($x + 14, $y2 + 26, '=', anchor => 'middle', cls => 'dg-math') if $u ne '';
            $x += 28; next;
        }
        my $w = max(se_w($t, 15), se_w($u, 15), tw($by, 12) + 10) + 22;
        my $c = $x + $w / 2;
        push @cx, $c;
        my $bad = $miss{$i + 1};
        $b .= rect($x, $y1, $w, $bh, 'dg-fill-soft', 6) . rect($x, $y1, $w, $bh, 'dg-outline', 6);
        $b .= se_text($c, $y1 + 26, $t);
        if ($u ne '') {
            $b .= rect($x, $y2, $w, $bh, $bad ? 'dg-fill-hot' : 'dg-fill-accent', 6) . rect($x, $y2, $w, $bh, 'dg-outline', 6);
            $b .= se_text($c, $y2 + 26, $u);
        }
        if ($bad) {
            $b .= line($c, $y1 + $bh + 4, $c, $y2 - 4, 'dg-dashed');
            $b .= T($c + 6, ($y1 + $bh + $y2) / 2 + 4, "✗ no $by", cls => 'dg-label-hot');
        } else {
            $b .= arrow($c, $y1 + $bh + 3, $c, $y2 - 3, 'accent');
            $b .= T($c + 6, ($y1 + $bh + $y2) / 2 + 4, $by, cls => 'dg-label-accent');
        }
        $x += $w + 6;
    }
    my $W = $x + 30;
    my $H = $y2 + $bh + 6;
    my $aria = 'Every term times ' . $by . ': ' . se_plain(join ' ', @top) . ' becomes ' . se_plain(join ' ', @bot);
    return (svg($W, $H, $aria, $b));
}

# ── sedist ───────────────────────────────────────────────────────────────
sub draw_sedist {
    my ($A) = @_;
    my $f = $A->{factor} // '2';
    my @t = list($A->{terms}, qr/\s*;\s*/);
    my @r = list($A->{result}, qr/\s*;\s*/);
    my $t0 = $A->{title} ? 22 : 0;
    my $y = $t0 + 74;
    my $b = '';
    $b .= T(8, 16, $A->{title}, cls => 'dg-title') if $A->{title};
    my $x = 20;
    my $fw = se_w($f, 15);
    my $fc = $x + $fw / 2;
    $b .= se_text($fc, $y, $f, cls => 'dg-math-accent');
    $x += $fw + 2;
    $b .= T($x, $y, '(', cls => 'dg-math'); $x += 10;
    my @tc;
    for my $i (0 .. $#t) {
        my $w = max(se_w($t[$i], 15), se_w($r[$i] // '', 15)) + 18;
        push @tc, $x + $w / 2;
        $b .= se_text($x + $w / 2, $y, $t[$i]);
        $x += $w;
    }
    $b .= T($x, $y, ')', cls => 'dg-math'); $x += 14;
    for my $i (0 .. $#tc) {
        $b .= carrow($fc, $y - 20, $tc[$i], $y - 22, -26 - 10 * $i, 'accent');
    }
    my $y2 = $y + 40;
    $b .= T($fc, $y2, '=', anchor => 'middle', cls => 'dg-math');
    for my $i (0 .. $#tc) { $b .= se_text($tc[$i], $y2, $r[$i] // ''); }
    my $W = max($x, $tc[-1] + 50) + 10;
    return (svg($W, $y2 + 14, 'Distribute ' . se_plain($f) . ' to every term: ' . se_plain(join ' ', @t) . ' gives ' . se_plain(join ' ', @r), $b));
}

# ── sebar ────────────────────────────────────────────────────────────────
sub draw_sebar {
    my ($A) = @_;
    my $n = num($A->{parts}) || 2;
    my $k = num($A->{shade}) // 1;
    my $W = num($A->{width}) // 380;
    my $t0 = $A->{title} ? 22 : 0;
    my ($x0, $y0, $bh) = (20, $t0 + 42, 38);
    my $bw = $W - 40;
    my $u = $bw / $n;
    my $b = '';
    $b .= T(8, 16, $A->{title}, cls => 'dg-title') if $A->{title};
    if (defined $A->{whole}) {
        $b .= sprintf('<path d="M%.1f,%.1f Q%.1f,%.1f %.1f,%.1f L%.1f,%.1f Q%.1f,%.1f %.1f,%.1f Q%.1f,%.1f %.1f,%.1f L%.1f,%.1f Q%.1f,%.1f %.1f,%.1f" class="dg-arrow muted"/>',
            $x0, $y0 - 4, $x0, $y0 - 12, $x0 + 10, $y0 - 12, $x0 + $bw / 2 - 8, $y0 - 12, $x0 + $bw / 2, $y0 - 12, $x0 + $bw / 2, $y0 - 20,
            $x0 + $bw / 2, $y0 - 12, $x0 + $bw / 2 + 8, $y0 - 12, $x0 + $bw - 10, $y0 - 12, $x0 + $bw, $y0 - 12, $x0 + $bw, $y0 - 4);
        $b .= se_text($x0 + $bw / 2, $y0 - 24, $A->{whole});
    }
    for my $j (0 .. $n - 1) {
        my $xx = $x0 + $j * $u;
        $b .= rect($xx, $y0, $u, $bh, $j < $k ? 'dg-fill-accent' : 'dg-fill-soft');
        $b .= rect($xx, $y0, $u, $bh, 'dg-outline');
        my $lab = $j < $k ? $A->{value} : $A->{rest};
        $b .= se_text($xx + $u / 2, $y0 + 25, $lab) if defined $lab && $lab ne '';
    }
    my $H = $y0 + $bh + 8;
    if (defined $A->{note} && $A->{note} ne '') { $b .= se_text($x0 + $bw / 2, $H + 16, $A->{note}); $H += 26; }
    return (svg($W, $H, "Bar split into $n equal parts, $k shaded" . (defined $A->{value} ? ', each shaded part is ' . se_plain($A->{value}) : ''), $b));
}

1;
