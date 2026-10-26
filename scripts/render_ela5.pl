#!/usr/bin/env perl
# Render Grade 5 English Language Arts materials (markdown) to printable HTML.
#
# One source gives both copies: a source with `key: yes` renders the student
# page and its answer key (<stem>-answers-v1.html), because the answers sit in
# the source beside the blanks they fill. Perl runs on this machine.
#
# Sources:  worksheets/grade-5-ela/*/*.md          (student materials)
#           lesson-plans/grade-5-ela/*/*.md        (teacher guides)
#           Home practice sheets (…/home/) are NOT rendered here: use
#           scripts/render_home_practice.pl with `course: ela5`.
# Output:   public/materials/grade-5-ela/<stem>.html (+ <stem minus -vN>-answers-vN.html)
#
# Run from the repo root:
#   perl scripts/render_ela5.pl                  # every source above
#   perl scripts/render_ela5.pl path/to/file.md  # just these
#
# ── Source format ─────────────────────────────────────────────────────────
# Front matter (--- … ---):
#   title, subtitle, unit ("Tall Tales"), kind (notes | reader | notebook |
#   wordwork | fluency | exits | coldread | rubric | teacherguide),
#   edition (A | B | C; C uses the easy-read layout), key (yes | no),
#   name (yes | no: the name/date line; default yes except reader,
#   rubric, teacherguide).
#
# Inline: **bold**, *italic*, [[answer]] is a blank (filled in the key),
#   ___ is a blank with no answer, ☐ prints as a tick box.
#
# Lines:
#   ## / ### / ####  headings          ---page---   page break when printed
#   (lines N)   N answer lines          (write N)    N wide drafting lines
#   (box N)     a sketch/plan box N lines tall
#   => text     answer shown only in the key (student copy drops it)
#   - item / 1. item   lists           | a | b |    tables (first row = head;
#                                       an empty cell or (box) = writing space)
#
# Blocks, fenced with `::: kind [arg]` … `:::`:
#   passage Title | byline   reading text; blank-line paragraphs are numbered
#   script Title             reader's theatre: NAME: line; (stage direction)
#   strategy Title           mnemonic box: lines "**P** Pick my idea"
#   example Title            worked example / think-aloud box
#   model Title              mentor-text excerpt box
#   myth                     error pattern: WRONG: / WHY: / RIGHT: lines
#   frame                    sentence starters (a cognitive scaffold to fade)
#   wordbank                 one term per line, shown as chips
#   words                    word cards: term | meaning | example | non-example
#                            ([[x]] in any cell = blank in student copy)
#   talk                     talk moves box
#   check                    self-check: one "I can…" per line, with Yes / Not yet
#   teacher Label            key-only box (always shown in a teacher guide)
#   note Label               plain note box
#   support                  easy-read support strip (right column on screen)
#   pair                     two columns: main | support, split by a ||| line
#   card Title               boxed card with a cut line (exit tickets)
#   lesson N | Title | codes teacher-guide lesson card; LABEL: text lines
#   graph                    progress grid: "x: a, b, c" and "y: 160, 140, …"
#   fade                     teacher-facing note on how a scaffold fades
#                            (key and teacher guide only)
use strict;
use warnings;
use utf8;
use open qw(:std :encoding(UTF-8));
use Cwd qw(abs_path);
use File::Basename qw(dirname basename);
use File::Spec;
use File::Glob qw(:bsd_glob);

my $ROOT = dirname(dirname(abs_path($0)));
my $OUT  = File::Spec->catdir($ROOT, 'public', 'materials', 'grade-5-ela');

my $COURSE = 'Grade 5 English Language Arts';
my ($ACC, $ACC_DARK, $ACC_SOFT, $ACC_MID) = ('#b4235a', '#901c48', '#fbeaf0', '#e9a7bf');

sub slurp { my ($p) = @_; open my $fh, '<', $p or die "$p: $!"; local $/; my $s = <$fh>; close $fh; return $s; }
sub spit  { my ($p, $s) = @_; open my $fh, '>', $p or die "$p: $!"; print $fh $s; close $fh; }

sub esc {
    my ($s) = @_;
    $s =~ s/&(?![#a-zA-Z0-9]+;)/&amp;/g;
    $s =~ s/</&lt;/g; $s =~ s/>/&gt;/g;
    return $s;
}
sub unq { my ($s) = @_; $s =~ s/^"(.*)"$/$1/; return $s; }

sub front {
    my ($text) = @_;
    $text =~ s/\r\n/\n/g;
    $text =~ s/^---\n(.*?)\n---\n//s or die "missing front matter\n";
    my %m;
    for (split /\n/, $1) { $m{$1} = unq($2) if /^(\w+):\s*(.*?)\s*$/; }
    return (\%m, $text);
}

# Inline markdown. $key: 1 renders [[x]] as the answer, 0 as a blank.
sub inline {
    my ($s, $key) = @_;
    my @a;
    $s =~ s/\[\[(.+?)\]\]/push @a, $1; "\x{1}" . $#a . "\x{2}"/ge;
    $s = esc($s);
    $s =~ s/`([^`]+)`/<code>$1<\/code>/g;
    $s =~ s/\*\*(.+?)\*\*/<strong>$1<\/strong>/g;
    $s =~ s/(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])/<em>$1<\/em>/g;
    $s =~ s/_{3,}/<span class="b b-md">&nbsp;<\/span>/g;
    $s =~ s/☐/<span class="tick" aria-hidden="true"><\/span>/g;
    $s =~ s{\x{1}(\d+)\x{2}}{
        my $x = $a[$1];
        $key ? '<span class="ak">' . esc($x) . '</span>'
             : '<span class="b ' . (length($x) > 18 ? 'b-xl' : length($x) > 10 ? 'b-lg' : 'b-md') . '">&nbsp;</span>'
    }ge;
    return $s;
}

sub lines_html { my ($n, $cls) = @_; return '<div class="lines">' . join('', map { qq{<div class="$cls"></div>} } 1 .. $n) . '</div>'; }

# Split a body into blocks: ::: fences become [kind, arg, [lines]].
sub blocks_of {
    my (@lines) = @_;
    my @out;
    while (@lines) {
        my $l = shift @lines;
        if ($l =~ /^:::\s*(\w+)\s*(.*?)\s*$/) {
            my ($kind, $arg) = ($1, $2); my @in;
            while (@lines) { my $x = shift @lines; last if $x =~ /^:::\s*$/; push @in, $x; }
            push @out, [$kind, $arg, \@in];
        } else { push @out, $l; }
    }
    return @out;
}

sub table_html {
    my ($rows, $key) = @_;
    my @r = grep { $_ !~ /^\|\s*:?-{2,}/ } @$rows;
    my $html = $r[0] =~ /^\|\s*Text\s*\|/ ? '<table class="t t-read">' : '<table class="t">';
    my $first = 1;
    for my $row (@r) {
        my $x = $row; $x =~ s/^\|//; $x =~ s/\|\s*$//;
        my @cells = map { my $c = $_; $c =~ s/^\s+|\s+$//g; $c } split /\|/, $x, -1;
        if ($first && !grep { /\S/ } @cells) { $first = 0; $html .= '<tbody>'; next; }
        if ($first) { $html .= '<thead><tr>' . join('', map { '<th>' . inline($_, $key) . '</th>' } @cells) . '</tr></thead><tbody>'; $first = 0; next; }
        $html .= '<tr>' . join('', map {
            my $c = $_;
            if ($c eq '' || $c eq '(box)') { '<td class="wcell"></td>' }
            elsif (!$key && $c =~ /^\[\[[^\]]+\]\]$/ && length($c) > 16) { '<td class="wcell"></td>' }
            elsif ($c =~ /^\(box (\d+)\)$/) { '<td class="wcell" style="height:' . (12 * $1) . 'mm"></td>' }
            else { '<td>' . inline($c, $key) . '</td>' }
        } @cells) . '</tr>';
    }
    return $html . '</tbody></table>';
}

# Paragraphs, lists, tables, headings, special lines.
sub prose {
    my ($lines, $key) = @_;
    my (@out, @para, @items, $lk, @rows);
    my $flush = sub {
        if (@para) { push @out, '<p>' . inline(join(' ', @para), $key) . '</p>'; @para = (); }
        if (@items) { my $tag = $lk eq 'ol' ? 'ol' : 'ul'; push @out, "<$tag>" . join('', map { '<li>' . inline($_, $key) . '</li>' } @items) . "</$tag>"; @items = (); }
        if (@rows) { push @out, table_html([@rows], $key); @rows = (); }
    };
    for my $l (@$lines) {
        if ($l =~ /^\s*$/) { $flush->(); next; }
        if ($l =~ /^\|/) { if (@para || @items) { my @keep = @rows; @rows = (); $flush->(); @rows = @keep; } push @rows, $l; next; }
        if (@rows) { $flush->(); }
        if ($l =~ /^(#{2,4})\s+(.*)$/) { $flush->(); my $n = length $1; push @out, "<h$n>" . inline($2, $key) . "</h$n>"; next; }
        if ($l =~ /^---page---\s*$/) { $flush->(); push @out, '<div class="pb"></div>'; next; }
        if ($l =~ /^\(lines (\d+)\)\s*$/) { $flush->(); push @out, lines_html($1, 'ln'); next; }
        if ($l =~ /^\(write (\d+)\)\s*$/) { $flush->(); push @out, lines_html($1, 'wl'); next; }
        if ($l =~ /^\(box (\d+)\)\s*$/) { $flush->(); push @out, '<div class="sk" style="height:' . (12 * $1) . 'mm"></div>'; next; }
        if ($l =~ /^=>\s*(.*)$/) { $flush->(); push @out, '<p class="ans"><span class="ans-l">Answer</span> ' . inline($1, 1) . '</p>' if $key; next; }
        if ($l =~ /^\s*[-*]\s+(.*)$/) { if (@para || ($lk // '') ne 'ul') { $flush->(); } $lk = 'ul'; push @items, $1; next; }
        if ($l =~ /^\s*\d+[.)]\s+(.*)$/) { if (@para || ($lk // '') ne 'ol') { $flush->(); } $lk = 'ol'; push @items, $1; next; }
        if (@items) { $flush->(); }
        push @para, $l;
    }
    $flush->();
    return join "\n", @out;
}

sub box { my ($cls, $label, $inner) = @_; return qq{<div class="box $cls">} . ($label ne '' ? qq{<div class="lbl">$label</div>} : '') . $inner . '</div>'; }

sub render_block {
    my ($kind, $arg, $in, $key, $m) = @_;
    my $tg = ($m->{kind} // '') eq 'teacherguide';
    if ($kind eq 'passage') {
        my ($title, $by) = map { my $x = $_ // ''; $x =~ s/^\s+|\s+$//g; $x } split /\|/, $arg, 2;
        my (@paras, @cur);
        for (@$in) { if (/^\s*$/) { push @paras, join(' ', @cur) if @cur; @cur = (); } else { push @cur, $_; } }
        push @paras, join(' ', @cur) if @cur;
        my $n = 0;
        my $body = join '', map { $n++; qq{<p><span class="pn">$n</span>} . inline($_, $key) . '</p>' } @paras;
        return '<article class="passage"><h3 class="ptitle">' . inline($title, $key) . '</h3>' . ($by ne '' ? '<div class="pby">' . inline($by, $key) . '</div>' : '') . $body . '</article>';
    }
    if ($kind eq 'script') {
        my $body = '';
        for (@$in) {
            next if /^\s*$/;
            if (/^\((.*)\)\s*$/) { $body .= '<p class="sd">' . inline($1, $key) . '</p>'; next; }
            if (/^([A-Z][A-Z0-9 .'’-]+?):\s*(.*)$/) { $body .= '<p class="sl"><span class="sp">' . esc($1) . '</span>' . inline($2, $key) . '</p>'; next; }
            $body .= '<p>' . inline($_, $key) . '</p>';
        }
        return '<article class="script"><h3 class="ptitle">' . inline($arg, $key) . '</h3>' . $body . '</article>';
    }
    if ($kind eq 'strategy') {
        my $rows = join '', map {
            /^\*\*(.+?)\*\*\s*(.*)$/ ? '<div class="mn"><span class="mk">' . esc($1) . '</span><span>' . inline($2, $key) . '</span></div>' : ($_ =~ /\S/ ? '<p>' . inline($_, $key) . '</p>' : '')
        } @$in;
        return box('b-strategy', inline($arg, $key), $rows);
    }
    if ($kind eq 'myth') {
        my %lab = (WRONG => 'Watch out', WHY => 'Why it happens', RIGHT => 'Instead');
        my $rows = join '', map { /^(WRONG|WHY|RIGHT):\s*(.*)$/ ? qq{<p class="my-\L$1\E"><span class="ml">$lab{$1}</span> } . inline($2, $key) . '</p>' : '' } @$in;
        return box('b-myth', '', $rows);
    }
    if ($kind eq 'wordbank') {
        return '<div class="wb"><span class="wb-l">Word box</span>' . join('', map { '<span class="chip">' . inline($_, $key) . '</span>' } grep { /\S/ } @$in) . '</div>';
    }
    if ($kind eq 'words') {
        my $cards = '';
        for (grep { /\S/ } @$in) {
            my ($t, $mean, $ex, $non) = map { my $x = $_ // ''; $x =~ s/^\s+|\s+$//g; $x } split /\|/, $_;
            $cards .= '<div class="wcard"><div class="wt">' . inline($t, $key) . '</div>'
                . '<div class="wr"><span>Means</span>' . ($mean eq '' ? '<span class="wline"></span>' : inline($mean, $key)) . '</div>'
                . '<div class="wr"><span>Example</span>' . ($ex eq '' ? '<span class="wline"></span>' : inline($ex, $key)) . '</div>'
                . '<div class="wr"><span>Not an example</span>' . ($non eq '' ? '<span class="wline"></span>' : inline($non, $key)) . '</div></div>';
        }
        return qq{<div class="wcards">$cards</div>};
    }
    if ($kind eq 'check') {
        my $rows = join '', map { '<tr><td>' . inline($_, $key) . '</td><td class="yn"><span class="tick"></span> Yes</td><td class="yn"><span class="tick"></span> Not yet</td></tr>' } grep { /\S/ } @$in;
        return box('b-check', $arg ne '' ? inline($arg, $key) : 'Check yourself', qq{<table class="ck">$rows</table>});
    }
    if ($kind eq 'teacher' || $kind eq 'fade') {
        return '' unless $key || $tg;
        my $label = $kind eq 'fade' ? 'How this support fades' : ($arg ne '' ? inline($arg, 1) : 'For the teacher');
        return box('b-teacher', $label, prose($in, 1));
    }
    if ($kind eq 'pair') {
        my (@l, @r, $side);
        for (@$in) { if (/^\|\|\|\s*$/) { $side = 1; next; } $side ? push(@r, $_) : push(@l, $_); }
        return '<div class="pair"><div class="pmain">' . inner($key, $m, @l) . '</div><aside class="psup">' . inner($key, $m, @r) . '</aside></div>';
    }
    if ($kind eq 'support') { return '<aside class="psup solo">' . inner($key, $m, @$in) . '</aside>'; }
    if ($kind eq 'card') {
        return '<section class="card"><div class="card-h">' . inline($arg, $key) . '</div>' . inner($key, $m, @$in) . '</section>';
    }
    if ($kind eq 'lesson') {
        my ($n, $title, $codes) = map { my $x = $_ // ''; $x =~ s/^\s+|\s+$//g; $x } split /\|/, $arg, 3;
        my $body = '';
        my @buf;
        my $flush = sub { if (@buf) { $body .= prose([@buf], 1); @buf = (); } };
        for (@$in) {
            if (/^([A-Z][A-Z &]+):\s*(.*)$/) { $flush->(); $body .= '<p class="ll"><span class="lk">' . esc(ucfirst lc $1) . '</span>' . inline($2, 1) . '</p>'; next; }
            push @buf, $_;
        }
        $flush->();
        return '<section class="lesson"><div class="lesson-h"><span class="lnum">' . esc($n) . '</span><span class="ltitle">' . inline($title, 1) . '</span>' . ($codes ne '' ? '<span class="lcodes">' . esc($codes) . '</span>' : '') . '</div>' . $body . '</section>';
    }
    if ($kind eq 'graph') {
        my (@x, @y);
        for (@$in) { @x = split /\s*,\s*/, $1 if /^x:\s*(.*)$/; @y = split /\s*,\s*/, $1 if /^y:\s*(.*)$/; }
        my $h = '<table class="graph"><tbody>';
        for my $yv (@y) { $h .= '<tr><th>' . esc($yv) . '</th>' . join('', map { '<td></td>' } @x) . '</tr>'; }
        $h .= '<tr class="gx"><th></th>' . join('', map { '<th>' . esc($_) . '</th>' } @x) . '</tr></tbody></table>';
        return box('b-graph', inline($arg, $key), $h);
    }
    my %cls = (example => 'b-example', model => 'b-model', frame => 'b-frame', talk => 'b-talk', note => 'b-note');
    my %def = (example => 'Watch me', model => 'From the mentor text', frame => 'Sentence starters', talk => 'Talk moves', note => '');
    my $c = $cls{$kind} // 'b-note';
    return box($c, $arg ne '' ? inline($arg, $key) : ($def{$kind} // ''), inner($key, $m, @$in));
}

sub inner {
    my ($key, $m, @lines) = @_;
    my (@out, @buf);
    for my $b (blocks_of(@lines)) {
        if (ref $b) { push @out, prose([@buf], $key) if @buf; @buf = (); push @out, render_block(@$b, $key, $m); }
        else { push @buf, $b; }
    }
    push @out, prose([@buf], $key) if @buf;
    return join "\n", @out;
}

my $CSS = <<'CSS';
  @font-face { font-family: 'Atkinson Hyperlegible Next'; font-style: normal; font-weight: 200 800; font-display: swap; src: url('../../fonts/atkinson-hyperlegible-next-latin-wght-normal.woff2') format('woff2-variations'); }
  @font-face { font-family: 'Atkinson Hyperlegible Next'; font-style: italic; font-weight: 200 800; font-display: swap; src: url('../../fonts/atkinson-hyperlegible-next-latin-wght-italic.woff2') format('woff2-variations'); }
  @font-face { font-family: 'Fraunces'; font-style: normal; font-weight: 100 900; font-display: swap; src: url('../../fonts/fraunces-latin-wght-normal.woff2') format('woff2-variations'); }
  :root {
    --acc: {{ACC}}; --acc-dark: {{ACC_DARK}}; --acc-soft: {{ACC_SOFT}}; --acc-mid: {{ACC_MID}};
    --ink: #1f1d1a; --ink2: #3f3b35; --muted: #6b665d; --rule: #c9c4b9; --paper: #faf9f6; --line: #b8b2a7;
    --font-body: 'Atkinson Hyperlegible Next', system-ui, -apple-system, 'Segoe UI', sans-serif;
    --font-display: 'Fraunces', Georgia, 'Times New Roman', serif;
  }
  *, *::before, *::after { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; }
  body { margin: 0; background: #efece5; color: var(--ink); font-family: var(--font-body); font-size: 11.5pt; line-height: 1.55; font-kerning: normal; }
  .page { max-width: 820px; margin: 0 auto; background: #fff; padding: 34px 44px 56px; }
  @media (max-width: 640px) { .page { padding: 20px 16px 40px; } }
  h1, h2, h3, h4 { font-family: var(--font-display); color: var(--ink); line-height: 1.2; text-wrap: balance; }
  h1 { font-size: 23pt; font-weight: 650; margin: 2px 0 2px; }
  h2 { font-size: 15pt; font-weight: 650; margin: 26px 0 8px; padding-bottom: 4px; border-bottom: 2.5px solid var(--acc-mid); color: var(--acc-dark); break-after: avoid; }
  h3 { font-size: 12.5pt; font-weight: 650; margin: 16px 0 6px; break-after: avoid; }
  h4 { font-family: var(--font-body); font-size: 10.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); margin: 14px 0 4px; }
  p { margin: 0 0 8px; text-wrap: pretty; }
  ul, ol { margin: 4px 0 10px 24px; padding: 0; }
  li { margin-bottom: 4px; }
  .hdr { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; border-left: 6px solid var(--acc); background: var(--acc-soft); padding: 12px 18px; border-radius: 0 10px 10px 0; margin-bottom: 14px; }
  .hdr .course { font-size: 8.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--acc-dark); }
  .hdr .sub { color: var(--ink2); font-size: 10.5pt; }
  .ed { font-size: 8.5pt; color: var(--muted); white-space: nowrap; border: 1px solid var(--rule); border-radius: 999px; padding: 2px 9px; background: #fff; }
  .keyband { background: #ecfdf3; border: 1.5px solid #86c79e; color: #14532d; border-radius: 8px; padding: 7px 12px; font-weight: 700; font-size: 10pt; margin-bottom: 12px; }
  .namerow { display: flex; gap: 22px; font-size: 10.5pt; color: var(--muted); margin: 4px 0 16px; }
  .namerow span { display: flex; flex: 1; gap: 8px; align-items: baseline; }
  .namerow span::after { content: ''; flex: 1; border-bottom: 1.5px solid var(--ink2); }
  .namerow span.short { flex: 0 0 34%; }
  .b { display: inline-block; border-bottom: 1.6px solid var(--ink2); vertical-align: -2px; height: 1.5em; }
  .b-md { width: 92px; } .b-lg { width: 150px; } .b-xl { width: 230px; }
  .ak { color: #166534; font-weight: 700; border-bottom: 2px solid #86c79e; padding: 0 3px; }
  .ans { background: #f0fbf4; border-left: 4px solid #4ea56c; padding: 5px 10px; border-radius: 0 6px 6px 0; font-size: 10.5pt; }
  .ans-l { font-size: 8pt; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #166534; margin-right: 4px; }
  .tick { display: inline-block; width: .95em; height: .95em; border: 1.5px solid var(--ink2); border-radius: 3px; vertical-align: -2px; margin-right: 2px; }
  .lines { margin: 4px 0 12px; }
  .ln { height: 12mm; border-bottom: 1.2px solid var(--line); }
  .wl { height: 13mm; border-bottom: 1.2px solid var(--line); }
  .sk { border: 1.5px dashed var(--line); border-radius: 8px; margin: 6px 0 12px; }
  .pb { break-after: page; height: 0; }
  table.t { width: 100%; border-collapse: collapse; margin: 6px 0 14px; font-size: 10.5pt; break-inside: auto; }
  table.t th { background: var(--acc-soft); color: var(--acc-dark); text-align: left; font-weight: 700; padding: 6px 8px; border: 1px solid var(--rule); }
  table.t td { padding: 6px 8px; border: 1px solid var(--rule); vertical-align: top; }
  table.t td.wcell { height: 26mm; min-width: 170px; --rule-gap: 12mm;
    background-image: repeating-linear-gradient(to bottom, transparent 0, transparent calc(var(--rule-gap) - 1px), var(--line) calc(var(--rule-gap) - 1px), var(--line) var(--rule-gap));
    background-position: 0 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  table.t td .b-md { width: 52px; } table.t td .b-lg { width: 96px; } table.t td .b-xl { width: 150px; }
  table.t tr { break-inside: avoid; }
  table.t-read td { font-family: Georgia, 'Times New Roman', serif; font-size: 12.5pt; line-height: 1.6; }
  code { font-family: Consolas, 'Courier New', monospace; font-size: .9em; background: #f4f2ed; border-radius: 4px; padding: 0 4px; }
  .box { border-radius: 10px; padding: 10px 14px; margin: 10px 0 14px; break-inside: avoid; border: 1.5px solid var(--rule); background: var(--paper); }
  .box .lbl { font-size: 8.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; margin-bottom: 5px; color: var(--muted); }
  .box > :last-child { margin-bottom: 0; }
  .b-strategy { border: 2px solid var(--acc); background: var(--acc-soft); }
  .b-strategy .lbl { color: var(--acc-dark); }
  .mn { display: flex; gap: 12px; align-items: baseline; padding: 3px 0; }
  .mk { font-family: var(--font-display); font-weight: 800; font-size: 15pt; color: var(--acc-dark); min-width: 2.6em; }
  .b-example { border-color: #9cb8d9; background: #f2f6fb; } .b-example .lbl { color: #2f5d8a; }
  .b-model { border-left: 5px solid var(--acc); border-radius: 0 10px 10px 0; background: #fff; font-family: Georgia, 'Times New Roman', serif; font-size: 11.5pt; }
  .b-model .lbl { font-family: var(--font-body); }
  .b-frame { border-style: dashed; border-color: #b9a46a; background: #fffbef; } .b-frame .lbl { color: #7a5f12; }
  .b-talk { border-color: #8fbfb5; background: #f1f8f6; } .b-talk .lbl { color: #24675a; }
  .b-note { background: #fff; }
  .b-check { border-color: #93c5a4; background: #f3faf5; } .b-check .lbl { color: #22663a; }
  .b-teacher { border-color: #e2b354; background: #fffaeb; } .b-teacher .lbl { color: #8a5a00; }
  .b-graph { background: #fff; }
  .b-myth { border-color: #e7a5a5; background: #fff6f5; }
  .b-myth p { margin-bottom: 4px; }
  .ml { font-size: 8.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; margin-right: 6px; }
  .my-wrong .ml { color: #a12d2d; } .my-why .ml { color: #8a5a00; } .my-right .ml { color: #22663a; }
  table.ck { width: 100%; border-collapse: collapse; font-size: 10.5pt; }
  table.ck td { padding: 4px 4px; border-bottom: 1px dotted var(--rule); }
  table.ck td.yn { width: 76px; white-space: nowrap; color: var(--ink2); }
  .wb { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin: 8px 0 12px; padding: 8px 10px; border: 1.5px dashed var(--line); border-radius: 10px; }
  .wb-l { font-size: 8.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--muted); margin-right: 4px; }
  .chip { background: var(--acc-soft); border: 1px solid var(--acc-mid); border-radius: 999px; padding: 1px 10px; font-size: 10.5pt; }
  .wcards { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 8px 0 14px; }
  @media (max-width: 640px) { .wcards { grid-template-columns: 1fr; } }
  .wcard { border: 1.5px solid var(--rule); border-radius: 10px; padding: 8px 12px; break-inside: avoid; }
  .wt { font-family: var(--font-display); font-weight: 700; font-size: 13pt; color: var(--acc-dark); margin-bottom: 4px; }
  .wr { display: flex; gap: 8px; font-size: 10.5pt; padding: 3px 0; align-items: baseline; }
  .wr > span:first-child { flex: 0 0 92px; font-size: 8.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); }
  .wline { flex: 1; border-bottom: 1.2px solid var(--line); min-height: 11mm; }
  .passage, .script { font-family: Georgia, 'Times New Roman', serif; font-size: 12.5pt; line-height: 1.75; margin: 10px 0 20px; }
  .ptitle { font-family: var(--font-display); font-size: 16pt; margin: 6px 0 2px; color: var(--acc-dark); }
  .pby { font-family: var(--font-body); font-size: 9.5pt; color: var(--muted); margin-bottom: 10px; }
  .passage p { position: relative; padding-left: 34px; margin-bottom: 10px; }
  .pn { position: absolute; left: 0; top: .2em; font-family: var(--font-body); font-size: 8.5pt; font-weight: 700; color: var(--acc-dark); background: var(--acc-soft); border-radius: 4px; padding: 0 5px; line-height: 1.6; }
  .script p { margin-bottom: 6px; }
  .script .sl { padding-left: 120px; text-indent: -120px; }
  .script .sp { display: inline-block; width: 120px; text-indent: 0; font-family: var(--font-body); font-weight: 700; font-size: 10pt; letter-spacing: .04em; color: var(--acc-dark); }
  .script .sd { font-style: italic; color: var(--muted); padding-left: 120px; }
  @media (max-width: 640px) { .script .sl { padding-left: 0; text-indent: 0; } .script .sp { display: block; width: auto; } .script .sd { padding-left: 0; } }
  .pair { display: grid; grid-template-columns: 7fr 3fr; gap: 16px; margin: 6px 0 12px; align-items: start; }
  @media (max-width: 640px) { .pair { grid-template-columns: 1fr; } }
  .psup { border: 1.5px solid var(--acc-mid); background: var(--acc-soft); border-radius: 10px; padding: 10px 12px; font-size: 10.5pt; }
  .psup.solo { margin: 8px 0 12px; }
  .psup p { margin-bottom: 6px; }
  .card { border: 2px dashed var(--line); border-radius: 12px; padding: 12px 16px 6px; margin: 0 0 18px; break-inside: avoid; }
  .card-h { font-family: var(--font-display); font-weight: 700; font-size: 13pt; color: var(--acc-dark); margin-bottom: 6px; }
  .lesson { border: 1.5px solid var(--rule); border-radius: 10px; padding: 10px 14px; margin: 10px 0 14px; break-inside: avoid; }
  .lesson-h { display: flex; gap: 10px; align-items: baseline; flex-wrap: wrap; border-bottom: 1px solid var(--rule); padding-bottom: 6px; margin-bottom: 8px; }
  .lnum { font-family: var(--font-display); font-weight: 800; color: #fff; background: var(--acc); border-radius: 6px; padding: 0 8px; font-size: 11pt; }
  .ltitle { font-weight: 700; font-size: 12pt; flex: 1; }
  .lcodes { font-size: 8.5pt; color: var(--muted); font-weight: 700; letter-spacing: .04em; }
  .ll { display: flex; gap: 10px; margin-bottom: 5px; font-size: 10.5pt; }
  .lk { flex: 0 0 74px; font-size: 8pt; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--acc-dark); padding-top: 3px; }
  table.graph { border-collapse: collapse; margin: 4px 0; font-size: 9pt; }
  table.graph th { color: var(--muted); font-weight: 700; padding: 0 6px; text-align: right; }
  table.graph td { width: 46px; height: 9mm; border: 1px solid var(--rule); }
  table.graph tr.gx th { text-align: center; padding-top: 4px; }
  .foot { margin-top: 30px; padding-top: 8px; border-top: 1px solid var(--rule); font-size: 8.5pt; color: var(--muted); display: flex; justify-content: space-between; gap: 12px; }
  body.ed-c { font-size: 13.5pt; line-height: 2; }
  body.ed-c p, body.ed-c li { margin-bottom: 12px; }
  body.ed-c .passage { font-size: 14pt; line-height: 2.1; }
  body.ed-c .ln { height: 15mm; } body.ed-c .wl { height: 16mm; } body.ed-c table.t td.wcell { height: 32mm; --rule-gap: 15mm; }
  body.ed-c h2 { margin-top: 34px; }
  body.ed-c table.t { font-size: 12.5pt; } body.ed-c .psup { font-size: 12pt; }
  body.ed-c .box { padding: 12px 16px; }
  @page { size: letter; margin: 13mm 12mm 14mm; }
  @media print {
    body { background: #fff; }
    .page { max-width: none; padding: 0; }
    a { color: inherit; text-decoration: none; }
    .box, .card, .lesson, .wcard { break-inside: avoid; }
  }
CSS

my %KIND_LABEL = (
    notes => 'Anchor notes', reader => 'Unit reader', notebook => "Reader's & Writer's Notebook",
    wordwork => 'Word work', fluency => 'Fluency pack', exits => 'Exit tickets',
    coldread => 'Cold read', rubric => 'Writing rubric', teacherguide => 'Teacher guide',
);

sub page_html {
    my ($m, $body, $key, $stem) = @_;
    my $css = $CSS;
    $css =~ s/\{\{ACC\}\}/$ACC/g; $css =~ s/\{\{ACC_DARK\}\}/$ACC_DARK/g; $css =~ s/\{\{ACC_SOFT\}\}/$ACC_SOFT/g; $css =~ s/\{\{ACC_MID\}\}/$ACC_MID/g;
    my $kind = $m->{kind} // 'notebook';
    my $ed = uc($m->{edition} // 'A');
    my $unit = $m->{unit} // '';
    my $title = $m->{title} // $stem;
    my $doc_title = $title . ($key ? ' — Answer Key' : '');
    my $name_default = ($kind =~ /^(reader|rubric|teacherguide)$/) ? 'no' : 'yes';
    my $show_name = !$key && (($m->{name} // $name_default) eq 'yes');
    my $edtag = $kind eq 'teacherguide' ? 'For the teacher' : "Edition $ed";
    my $html = qq{<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>} . esc($doc_title) . qq{ · $COURSE</title>\n<style>\n$css</style>\n</head>\n<body class="ed-\L$ed\E">\n<div class="page">\n};
    $html .= '<header class="hdr"><div><div class="course">' . esc("$COURSE · $unit · " . ($KIND_LABEL{$kind} // '')) . '</div><h1>' . inline($title, 1) . '</h1>'
        . (($m->{subtitle} // '') ne '' ? '<div class="sub">' . inline($m->{subtitle}, 1) . '</div>' : '')
        . '</div><span class="ed">' . esc($edtag) . "</span></header>\n";
    $html .= qq{<div class="keyband">Answer key. Model answers show one strong response; accept others that are supported by the text.</div>\n} if $key;
    $html .= qq{<div class="namerow"><span>Name</span><span class="short">Date</span></div>\n} if $show_name;
    $html .= $body;
    $html .= qq{\n<footer class="foot"><span>} . esc("$COURSE · $unit") . '</span><span>' . esc($stem . ($key ? ' (key)' : '')) . qq{</span></footer>\n</div>\n</body>\n</html>\n};
    return $html;
}

sub render_file {
    my ($path) = @_;
    my ($m, $text) = front(slurp($path));
    my $stem = basename($path); $stem =~ s/\.md$//;
    my @lines = split /\n/, $text;
    for my $key (0, ($m->{key} // 'no') eq 'yes' ? (1) : ()) {
        my $body = inner($key, $m, @lines);
        my $out_stem = $stem;
        if ($key) { $out_stem =~ s/-v(\d+)$/-answers-v$1/ or $out_stem .= '-answers'; }
        my $out = File::Spec->catfile($OUT, "$out_stem.html");
        spit($out, page_html($m, $body, $key, $out_stem));
        print "wrote public/materials/grade-5-ela/$out_stem.html\n";
    }
}

my @files = @ARGV;
unless (@files) {
    @files = (bsd_glob("$ROOT/worksheets/grade-5-ela/*/*.md"), bsd_glob("$ROOT/lesson-plans/grade-5-ela/*/*.md"));
}
for my $f (@files) {
    my $p = File::Spec->rel2abs($f);
    next if basename($p) =~ /^_|-home-/;
    eval { render_file($p); 1 } or warn "skipped $f: $@";
}
