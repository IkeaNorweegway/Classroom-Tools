#!/usr/bin/env perl
# Render Math 8 and Math 7 materials (markdown) to printable HTML in the Math 9 layout.
# Math 7 sources sit in the same folders under math-7/ with math7- names and
# render to public/materials/math-7/ (same format, same diagrams).
#
# One source gives the student copy and its answer key: answers sit in the
# source beside the blanks they fill. Diagrams are `@viz` lines drawn by
# scripts/Math8Viz.pm. Perl runs on this machine (Git Bash); Python may not.
#
# Run from the repo root:
#   perl scripts/render_math8.pl                  # every Math 8 source
#   perl scripts/render_math8.pl path/to/file.md  # just these
#
# ── Sources and output (public/materials/math-8/…) ────────────────────────
#   notes-packages/math-8/<topic>/math8-<topic>-notes-v1.md
#       → notes/<topic>/math8-<topic>-notes-v1.html, -notes-answers-v1.html,
#         worksheets/<strand>/<topic>/math8-<topic>-concepts-v1.html
#   notes-packages/math-8/<topic>/math8-<topic>-teachernotes-v1.md → notes/<topic>/
#   worksheets/math-8/<strand>/<topic>/math8-<topic>-practice-v1.md
#       → worksheets/<strand>/<topic>/math8-<topic>-worksheet-{core,challenge}-v1.html (+ -answers-v1)
#   worksheets/math-8/<strand>/math8-<strand>-workbook-v1.md → worksheets/<strand>/ (+ -answers-v1)
#   tests-quizzes/math-8/<topic>/math8-<topic>-exits-v1.md → exits/<topic>/
#   tests-quizzes/math-8/<topic>/math8-<topic>-quiz-v1.md  → quizzes/<topic>/ (student copy only;
#       the answers stay in the markdown)
#
# ── Format ────────────────────────────────────────────────────────────────
# Front matter (--- … ---): title, topic, strand (number, algebra,
# measurement-geometry, statistics-probability). Workbooks: rubric: list.
#
# Inline: **bold**, *italic*, [[answer]] is a blank (filled in the key),
# ___ is a blank with no answer, {3/4} is a stacked fraction (also {[[3]]/4}).
# Lines: (lines N) ruled answer lines · (work N) a grid box N lines tall ·
# => answer (key only; several in a row make one answer) · @viz type args
# (a diagram; see Math8Viz.pm %DOC) with caption="…" · #### sub-heading ·
# markdown tables and lists. Student copy shows lines and boxes; the key
# shows answers instead.
#
# Blocks, fenced `::: kind [title]` … `:::`:
#   example Title   worked example        explain   self-explanation prompt (+ => answer)
#   try             "Your turn" practice  key       key-idea box (rule, formula)
#   misconception   WRONG: / WHY: / RIGHT: lines, then any prose or @viz
#   connection      connection prompt     hint      hint box
#   retrieval       numbered questions; "★" starts a stretch question
#   teacher         key-only teacher box (first line may be `label: …`)
#   html            raw HTML
#
# Notes:    "## Pre-Knowledge Check" (numbered lines), "## Section N: Title",
#           "Learning target: …", "### Vocabulary" with "- term :: meaning :: example"
#           lines (meaning and example show in the key), "## Unit Synthesis",
#           "## Concept Reference" (rendered as the separate concept sheet).
# Practice: "## Core" and "## Challenge"; each "### " line starts a question.
# Exits:    "## Section N: Title", "Target: …", then "### " questions.
# Quiz:     "### [CODE · marks] question".
# Workbook: "## core | TOPIC — section" or "## ext | …" or "## stretch | …"
#           (the part after | is the key's "opens after" note), "## CHECKIN".
# Teacher:  "## Heading", "### Lesson title (time)" cards with SHOW:/SAY:/
#           DO:/CUE:/WATCH: lines, ::: overview / ::: box Title blocks.
use strict;
use warnings;
use utf8;
use open qw(:std :encoding(UTF-8));
use Cwd qw(abs_path);
use File::Basename qw(dirname basename);
use File::Path qw(make_path);
use File::Spec;
use File::Glob qw(:bsd_glob);   # glob() must not split "Classroom tools" at the space
use lib dirname(abs_path($0));
use Math8Viz;

my $ROOT = dirname(dirname(abs_path($0)));
# Math 7 sources (…/math-7/…) use this same renderer: output goes to
# public/materials/math-7/ and the pages say Grade 7. Set per file in main.
my $OUT  = File::Spec->catdir($ROOT, 'public', 'materials', 'math-8');
my $GRADE = 'Grade 8 Mathematics';
my %STRAND7 = ('algebra' => 'Algebra & Functions', 'measurement-geometry' => 'Geometry & Measurement');

my %STRAND = (
    'number'                 => ['Number',                   '#1d4ed8', '#eff6ff', '#3b82f6'],
    'algebra'                => ['Algebra',                  '#6d28d9', '#f5f3ff', '#7c3aed'],
    'measurement-geometry'   => ['Measurement & Geometry',   '#15803d', '#f0fdf4', '#16a34a'],
    'statistics-probability' => ['Statistics & Probability', '#0f766e', '#f0fdfa', '#0d9488'],
);

sub slurp { my ($p) = @_; open my $fh, '<', $p or die "$p: $!"; local $/; my $s = <$fh>; close $fh; $s =~ s/\r\n/\n/g; return $s; }
# Student notes written this run. At the end, add_key_links.pl links each one
# to its answer key (written in the same run).
my @NOTES_WRITTEN;
END { local $?; system($^X, "$ROOT/scripts/add_key_links.pl", @NOTES_WRITTEN) if @NOTES_WRITTEN; }
sub spit  { my ($p, $s) = @_; push @NOTES_WRITTEN, $p if basename($p) =~ /notes/ && basename($p) !~ /-answers|teacher/; $s = section_ids($s) if basename($p) =~ /notes/; make_path(dirname($p)); open my $fh, '>', $p or die "$p: $!"; print $fh $s; close $fh; }
# Section ids on notes headings, so other pages can link to one section
# (file.html#s3). Same rules as scripts/add_section_ids.py; keep them in step.
sub section_ids {
    my ($html) = @_;
    my %used = map { $_ => 1 } $html =~ /\sid="([^"]+)"/g;
    $html =~ s{<h2(\s[^>]*)?>(.*?)</h2>}{
        my ($attrs, $inner) = ($1 // '', $2);
        my $t = $inner =~ s/<[^>]+>//gr;
        $t =~ s/&nbsp;|\x{00a0}/ /g; $t =~ s/^\s+|\s+$//g;
        my $id = $t =~ /^(?:Section|Concept|Part)\s+(\d+)\b/i ? "s$1"
               : $t =~ /^Unit[ée]?\s+(\d+)\b/i ? "u$1"
               : $t =~ /^(\d+)\s*·/ ? "s$1"
               : $t =~ /^(?:Pre-Knowledge Check|Before we start)/i ? 'pre-check'
               : $t =~ /^(?:Unit Synthesis|Synthèse|Unit Check|Unit Wrap-Up|Put it all together)/i ? 'synthesis'
               : $t =~ /^(?:Vocabulary|Words to know|New Words in This Unit)\s*$/i ? 'vocab'
               : undef;
        ($attrs =~ /\sid=/ || !defined $id || $used{$id}++) ? "<h2$attrs>$inner</h2>" : qq{<h2 id="$id"$attrs>$inner</h2>};
    }gse;
    return $html;
}

sub esc {
    my ($s) = @_;
    $s //= '';
    $s =~ s/&(?![#a-zA-Z0-9]+;)/&amp;/g;
    $s =~ s/</&lt;/g; $s =~ s/>/&gt;/g;
    return $s;
}

sub front {
    my ($text) = @_;
    $text =~ s/^---\n(.*?)\n---\n//s or die "missing front matter\n";
    my %m; my $list;
    for (split /\n/, $1) {
        if (/^(\w+):\s*(.*)$/) { $list = $1; $m{$1} = $2 eq '' ? [] : unq($2); }
        elsif (/^\s*-\s+(.*)$/ && $list) { $m{$list} = [] unless ref $m{$list}; push @{ $m{$list} }, unq($1); }
    }
    return (\%m, $text);
}
sub unq { my ($s) = @_; $s =~ s/^"(.*)"$/$1/; return $s; }

# ── inline ────────────────────────────────────────────────────────────────
sub frac_html { my ($n, $d) = @_; return qq{<span class="frac"><span class="num">$n</span><span class="frac-slash">/</span><span class="den">$d</span></span>}; }

sub fracs { my ($s) = @_; $s =~ s{\{([^{}/]+)/([^{}/]+)\}}{frac_html($1, $2)}ge; return $s; }

sub plain_len { my ($s) = @_; $s =~ s/\{([^{}\/]+)\/([^{}\/]+)\}/$1$2/g; $s =~ s/\*//g; return length $s; }

sub inline {
    my ($s, $key) = @_;
    return '' unless defined $s;
    my @a;
    $s =~ s/\[\[(.+?)\]\]/push @a, $1; "\x{1}" . $#a . "\x{2}"/ge;
    $s = esc($s);
    $s = fracs($s);
    $s =~ s/\*\*(.+?)\*\*/<strong>$1<\/strong>/g;
    $s =~ s/(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])/<em>$1<\/em>/g;
    $s =~ s/_{3,}/<span class="b b-md"><\/span>/g;
    $s =~ s{\x{1}(\d+)\x{2}}{
        my $x = $a[$1];
        my $len = plain_len($x);
        $key ? '<span class="ak-fill">' . fracs(esc($x)) . '</span>'
             : '<span class="b ' . ($len > 18 ? 'b-xl' : $len > 10 ? 'b-lg' : $len > 4 ? 'b-md' : 'b-sm') . '"></span>'
    }ge;
    return $s;
}

# ── diagrams ──────────────────────────────────────────────────────────────
sub viz {
    my ($line, $key) = @_;
    local $Math8Viz::KEY = $key;
    my ($svg, $cap) = Math8Viz::draw($line);
    return qq{<figure class="viz">\n$svg\n} . (defined $cap && $cap ne '' ? '<figcaption>' . inline($cap, $key) . "</figcaption>\n" : '') . "</figure>";
}

# ── prose: paragraphs, lists, tables, lines, answers, diagrams ────────────
sub prose {
    my ($lines, $key, $o) = @_;
    $o ||= {};
    my (@out, @para, @items, $kind, @rows, @ans);
    my $flush_ans = sub {
        if (@ans) { push @out, '<div class="answer"><span class="a-label">Answer</span> ' . join('<br>', map { inline($_, 1) } @ans) . '</div>' if $key; @ans = (); }
    };
    my $flush = sub {
        if (@para) { push @out, '<p>' . inline(join(' ', @para), $key) . '</p>'; @para = (); }
        if (@items) {
            push @out, "<$kind class=\"" . ($kind eq 'ol' ? 'q-parts' : 'plain') . '">' . join('', map { '<li>' . $_ . '</li>' } @items) . "</$kind>";
            @items = (); $kind = undef;
        }
        if (@rows) {
            my @r = map { my $x = $_; $x =~ s/^\s*\|//; $x =~ s/\|\s*$//; [map { s/^\s+|\s+$//gr } split /(?<!\\)\|/, $x] } @rows;
            @r = grep { !(@$_ && $_->[0] =~ /^:?-{2,}/) } @r;
            my $head = shift @r;
            my $t = '<table><thead><tr>' . join('', map { '<th>' . inline($_, $key) . '</th>' } @$head) . '</tr></thead><tbody>';
            for my $row (@r) {
                $t .= '<tr>' . join('', map {
                    my $c = $_;
                    if ($c =~ /^\(write\)$/) { $key ? '<td></td>' : '<td class="write-cell"></td>' }
                    else { '<td>' . ($c eq '' ? '&nbsp;' : inline($c, $key)) . '</td>' }
                } @$row) . '</tr>';
            }
            push @out, $t . '</tbody></table>';
            @rows = ();
        }
        $flush_ans->();
    };
    for my $l (@$lines) {
        my $s = $l; $s =~ s/^\s+|\s+$//g;
        if ($s =~ /^=>\s*(.*)$/) { my $x = $1; if (@para || @items || @rows) { my @keep = @ans; @ans = (); $flush->(); @ans = @keep; } push @ans, $x; next; }
        $flush_ans->() if @ans;
        if ($s eq '') { $flush->(); }
        elsif ($s =~ /^\|/) { if (@para || @items) { $flush->(); } push @rows, $s; }
        elsif ($s =~ /^\(lines (\d+)\)$/) { $flush->(); push @out, '<div class="lines">' . ('<div class="al"></div>' x $1) . '</div>' unless $key; }
        elsif ($s =~ /^\(work (\d+)\)$/) { $flush->(); push @out, qq{<div class="response response-grid work-$1"></div>} unless $key; }
        elsif ($s =~ /^\@viz\s/) { $flush->(); push @out, viz($s, $key); }
        elsif ($s =~ /^####\s+(.*)$/) { $flush->(); push @out, '<h4>' . inline($1, $key) . '</h4>'; }
        elsif ($s =~ /^Hint:\s*(.*)$/) { $flush->(); push @out, '<div class="hint"><span class="hint-label">Hint</span> ' . inline($1, $key) . '</div>'; }
        elsif ($s =~ /^([-*]|\d+[.)]|[a-h][.)])\s+(.*)$/) {
            my ($mark, $item) = ($1, $2);
            my $want = $mark =~ /^[-*]$/ ? 'ul' : 'ol';
            if (@para || ($kind && $kind ne $want) || @rows) { $flush->(); }
            $kind = $want;
            my $label = $mark =~ /^[a-h]/ ? '<span class="part">' . substr($mark, 0, 1) . ')</span> '
                      : $mark =~ /^(\d+)/ ? qq{<span class="part">$1.</span> } : '';
            push @items, $label . inline($item, $key);
        }
        elsif (@items && $s =~ /^\s/ ) { $items[-1] .= ' ' . inline($s, $key); }
        else { $flush->(); push @para, $s; }   # each source line is its own paragraph (steps stay on separate lines)
    }
    $flush->();
    return join "\n", grep { $_ ne '' } @out;
}

# Split body lines into strings and [kind, arg, [lines]] blocks.
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

sub sections {
    my ($text, $level) = @_;
    $level ||= 2;
    $text =~ s/<!--.*?-->//gs;
    my $h = '#' x $level;
    my @secs; my $cur = ['', []];
    for (split /\n/, $text) {
        if (/^$h (.*)$/) { push @secs, $cur; $cur = [$1, []]; }
        else { push @{ $cur->[1] }, $_; }
    }
    push @secs, $cur;
    return grep { $_->[0] ne '' || grep { /\S/ } @{ $_->[1] } } @secs;
}

# Numbered questions inside a block: "1. text" then any lines until the next number.
sub numbered {
    my ($lines) = @_;
    my @q;
    for (@$lines) {
        if (/^\s*\d+\.\s+(.*)$/) { push @q, [$1, []]; }
        elsif (@q) { push @{ $q[-1][1] }, $_; }
    }
    return @q;
}

# One block → HTML.
sub block_html {
    my ($b, $key, $path) = @_;
    my ($kind, $arg, $in) = @$b;
    if ($kind eq 'example') {
        return qq{<div class="worked-example">\n<div class="we-label">} . inline($arg || 'Worked example', $key) . "</div>\n" . prose($in, $key) . "\n</div>";
    }
    if ($kind eq 'explain') {
        my @t = grep { !/^\s*=>/ && !/^\s*\(lines/ } @$in;
        my ($n) = map { /\((?:lines) (\d+)\)/ ? $1 : () } @$in;
        return qq{<div class="explain"><span class="explain-label">Explain it</span> } . inline(join(' ', map { s/^\s+|\s+$//gr } @t), $key)
            . ($key ? '' : '<div class="lines">' . ('<div class="al"></div>' x ($n // 2)) . '</div>')
            . ($key ? join('', map { /^\s*=>\s*(.*)$/ ? '<div class="answer"><span class="a-label">Answer</span> ' . inline($1, 1) . '</div>' : () } @$in) : '') . '</div>';
    }
    if ($kind eq 'try') {
        return qq{<div class="try">\n<div class="try-label">} . inline($arg || 'Your turn', $key) . "</div>\n" . prose($in, $key) . "\n</div>";
    }
    if ($kind eq 'key') {
        return qq{<div class="key-idea">\n<div class="ki-label">} . inline($arg || 'Key idea', $key) . "</div>\n" . prose($in, $key) . "\n</div>";
    }
    if ($kind eq 'hint') { return '<div class="hint"><span class="hint-label">Hint</span> ' . prose($in, $key) . '</div>'; }
    if ($kind eq 'misconception') {
        my %f; my @rest;
        for (@$in) { if (/^(WRONG|WHY|RIGHT):\s*(.*)$/) { $f{$1} = $2; } else { push @rest, $_; } }
        return qq{<div class="misconception">\n<div class="label">Watch out — a common mistake</div>\n<p class="m-wrong">} . inline($f{WRONG} // '', $key) . "</p>\n"
            . ($f{WHY} ? '<p><strong>Why it is wrong:</strong> ' . inline($f{WHY}, $key) . "</p>\n" : '')
            . (@rest ? prose(\@rest, $key) . "\n" : '')
            . ($f{RIGHT} ? '<p class="m-right"><strong>What is true:</strong> ' . inline($f{RIGHT}, $key) . "</p>\n" : '') . '</div>';
    }
    if ($kind eq 'connection') {
        my @t = grep { !/^\s*\((lines|work)/ && !/^\s*=>/ } @$in;
        return qq{<div class="connection">\n<div class="label">Connect it</div>\n<p>} . inline(join(' ', map { s/^\s+|\s+$//gr } @t), $key) . "</p>\n"
            . ($key ? join('', map { /^\s*=>\s*(.*)$/ ? '<div class="answer"><span class="a-label">Answer</span> ' . inline($1, 1) . '</div>' : () } @$in) : '<div class="lines"><div class="al"></div><div class="al"></div></div>') . "\n</div>";
    }
    if ($kind eq 'retrieval') {
        my $ol = '';
        for my $q (numbered($in)) {
            my ($t, $rest) = @$q;
            my $star = $t =~ s/^★\s*(Stretch:?)?\s*//;
            my @r = @$rest;
            push @r, '(lines 2)' unless grep { /^\s*\((lines|work)/ } @r;
            $ol .= '<li>' . ($star ? '<span class="stretch-label">★ Stretch</span> ' : '') . inline($t, $key) . prose(\@r, $key) . "</li>\n";
        }
        return qq{<div class="retrieval">\n<div class="retrieval-header">Retrieval check — close your notes</div>\n<ol>\n$ol</ol>\n</div>\n}
            . qq{<div class="self-check"><span class="label">Self-check</span> ☐ I could teach it &nbsp;&nbsp; ☐ Getting there &nbsp;&nbsp; ☐ Not yet</div>};
    }
    if ($kind eq 'teacher') {
        return '' unless $key;
        my @t = @$in; my $label = 'Teacher note';
        $label = $1 if @t && $t[0] =~ /^label:\s*(.*)$/ && shift @t;
        return qq{<div class="teacher-box"><div class="label">} . esc($label) . "</div>\n" . prose(\@t, 1) . '</div>';
    }
    if ($kind eq 'html') { return join "\n", @$in; }
    die "$path: unknown block '$kind'\n";
}

# A run of body lines (strings and blocks) → HTML.
sub body_html {
    my ($lines, $key, $path, $hooks) = @_;
    $hooks ||= {};
    my @out; my @buf;
    my $flush = sub { if (@buf) { push @out, prose([@buf], $key); @buf = (); } };
    my @bl = blocks_of(@$lines);
    while (@bl) {
        my $b = shift @bl;
        if (ref $b) { $flush->(); push @out, block_html($b, $key, $path); next; }
        if ($b =~ /^Learning target:\s*(.*)$/) { $flush->(); push @out, '<div class="learning-target"><strong>Learning target:</strong> ' . inline($1, $key) . '</div>'; next; }
        if ($b =~ /^###\s+Vocabulary/) {
            $flush->();
            my @terms;
            while (@bl && !ref $bl[0] && $bl[0] =~ /^\s*(-\s+.*)?$/) { my $x = shift @bl; push @terms, $1 if $x =~ /^\s*-\s+(.*)$/; }
            my $rows = '';
            for my $t (@terms) {
                my ($term, $mean, $ex) = split /\s*::\s*/, $t;
                $rows .= '<tr><td class="term">' . inline($term, 1) . '</td>'
                    . ($key ? '<td>' . inline($mean // '', 1) . '</td><td>' . inline($ex // '', 1) . '</td>' : '<td class="write-cell"></td><td class="write-cell"></td>') . "</tr>\n";
            }
            push @out, qq{<h3>Words to know</h3>\n<table class="vocab"><thead><tr><th style="width:24%">Word</th><th style="width:42%">What it means (in your own words)</th><th>Example or picture</th></tr></thead><tbody>\n$rows</tbody></table>};
            next;
        }
        if ($b =~ /^###\s+(.*)$/ && $hooks->{h3}) { $flush->(); push @out, $hooks->{h3}->($1); next; }
        if ($b =~ /^###\s+(.*)$/) { $flush->(); push @out, '<h3>' . inline($1, $key) . '</h3>'; next; }
        push @buf, $b;
    }
    $flush->();
    return join "\n", @out;
}

# ── CSS ───────────────────────────────────────────────────────────────────
sub fonts_css {
    my ($depth) = @_;
    my $up = '../' x $depth;
    return <<"CSS";
  \@font-face { font-family: 'Atkinson Hyperlegible Next'; font-style: normal; font-weight: 200 800; font-display: swap; src: url('${up}fonts/atkinson-hyperlegible-next-latin-wght-normal.woff2') format('woff2-variations'); }
  \@font-face { font-family: 'Atkinson Hyperlegible Next'; font-style: italic; font-weight: 200 800; font-display: swap; src: url('${up}fonts/atkinson-hyperlegible-next-latin-wght-italic.woff2') format('woff2-variations'); }
  \@font-face { font-family: 'Fraunces'; font-style: normal; font-weight: 100 900; font-display: swap; src: url('${up}fonts/fraunces-latin-wght-normal.woff2') format('woff2-variations'); }
CSS
}

my $BASE_CSS = <<'CSS';
:root {
  --font-body: 'Atkinson Hyperlegible Next', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-display: 'Fraunces', Georgia, 'Times New Roman', serif;
  --font-mono: Consolas, 'Courier New', monospace;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--font-body); font-size: 12pt; line-height: 1.6; color: #1f1d1a; background: #fff;
  max-width: 800px; margin: 0 auto; padding: 28px 32px 48px; font-kerning: normal; }
h1 { font-family: var(--font-display); font-size: 22pt; font-weight: 600; color: #1f1d1a; margin-bottom: 4px; text-wrap: balance; }
h2 { font-family: var(--font-display); font-size: 15pt; font-weight: 600; color: var(--accent); margin: 0 0 10px; border-bottom: 2px solid var(--accent-light); padding-bottom: 4px; text-wrap: balance; }
h3 { font-size: 11pt; font-weight: 700; color: #3f3b35; margin: 18px 0 6px; text-transform: uppercase; letter-spacing: .04em; }
h4 { font-size: 12pt; font-weight: 700; color: #3f3b35; margin: 14px 0 4px; }
p { margin-bottom: 8px; text-wrap: pretty; }
ul, ol { margin: 6px 0 10px 22px; }
li { margin-bottom: 5px; }
ol.q-parts { list-style: none; margin-left: 4px; }
.part { font-weight: 700; color: var(--accent); margin-right: 2px; }
strong { font-weight: 700; }
em { font-style: italic; color: #3f3b35; }
.b { display: inline-block; border-bottom: 2px solid #3f3b35; vertical-align: bottom; min-height: 1.25em; }
.b-sm { min-width: 60px; } .b-md { min-width: 110px; } .b-lg { min-width: 180px; } .b-xl { min-width: 260px; }
.ak-fill { color: #166534; font-weight: 700; border-bottom: 2px solid #86efac; padding: 0 2px; }
table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 11pt; }
th { background: var(--accent-light); color: #1f1d1a; font-weight: 700; text-align: left; padding: 7px 10px; border: 1px solid var(--accent-mid); }
td { padding: 8px 10px; border: 1px solid #c9c4b9; vertical-align: top; }
td.term { font-weight: 700; }
td .b-sm, td .b-md { min-width: 2.4em; } td .b-lg { min-width: 5em; }
.worked-example p, .key-idea p, .try p { margin-bottom: 5px; }
td.write-cell { height: 3.2em; }
.frac { display: inline-flex; flex-direction: column; text-align: center; vertical-align: middle; font-size: 0.9em; line-height: 1.15; margin: 0 2px; }
.frac .num { border-bottom: 1.5px solid currentColor; padding: 0 3px 1px; }
.frac .den { padding: 1px 3px 0; }
.frac .frac-slash { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.header-strip { border-left: 6px solid var(--accent); padding: 12px 18px; margin-bottom: 22px; background: var(--accent-light); border-radius: 0 10px 10px 0; }
.header-strip .course-label { font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--accent); margin-bottom: 4px; }
.header-strip .sub { font-size: 10.5pt; color: #3f3b35; margin: 2px 0 0; }
.name-row { display: flex; gap: 18px; margin: 14px 0 22px; font-size: 11pt; align-items: baseline; }
.name-row span { color: #544f47; white-space: nowrap; }
.name-row .b { flex: 1; }
.how { background: #faf9f6; border: 1px solid #c9c4b9; border-radius: 10px; padding: 12px 16px; margin: 0 0 18px; font-size: 11pt; }
.how ol { margin-bottom: 0; }
.answer-key-header { background: #1f1d1a; color: #fff; padding: 8px 14px; border-radius: 6px; margin: 0 0 16px; font-size: 9.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
.section { margin-bottom: 26px; }
.learning-target { font-size: 11pt; color: #3f3b35; margin: 0 0 12px; padding: 7px 12px; border-left: 3px solid var(--accent-mid); background: var(--accent-light); border-radius: 0 6px 6px 0; }
.worked-example { border-left: 4px solid var(--accent-mid); background: var(--accent-light); padding: 10px 14px; margin: 12px 0; border-radius: 0 8px 8px 0; }
.we-label, .try-label, .ki-label { font-size: 10.5pt; font-weight: 700; letter-spacing: .01em; color: var(--accent); margin-bottom: 6px; }
.try { border: 2px dashed var(--accent-mid); border-radius: 10px; padding: 10px 14px; margin: 14px 0; }
.key-idea { border: 2px solid var(--accent); border-radius: 10px; padding: 10px 14px; margin: 14px 0; background: #fff; }
.key-idea p:last-child { margin-bottom: 0; }
.explain { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 9px 14px; margin: 10px 0 14px; }
.explain-label { font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #92400e; margin-right: 6px; }
.hint { font-size: 10.5pt; color: #3f3b35; background: #f4f2ed; border-radius: 6px; padding: 6px 10px; margin: 6px 0; }
.hint-label { font-size: 8.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #6b665d; margin-right: 4px; }
.misconception { border-left: 4px solid #dc2626; background: #fef2f2; padding: 10px 14px; margin: 14px 0; border-radius: 0 8px 8px 0; }
.misconception .label { font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #b91c1c; margin-bottom: 4px; }
.misconception .m-wrong { font-weight: 700; }
.misconception .m-wrong::before { content: '✗ '; color: #b91c1c; }
.misconception .m-right::before { content: '✓ '; color: #15803d; font-weight: 700; }
.connection { border-left: 4px solid #f97316; background: #fff7ed; padding: 10px 14px; margin: 14px 0; border-radius: 0 8px 8px 0; }
.connection .label { font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #c2410c; margin-bottom: 4px; }
.retrieval { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 14px 18px; margin: 18px 0 8px; }
.retrieval-header { font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #1d4ed8; margin-bottom: 10px; }
.retrieval > ol { margin-left: 20px; }
.retrieval > ol > li { margin-bottom: 14px; }
.stretch-label { font-size: 8.5pt; font-weight: 700; color: #92400e; background: #fef3c7; border-radius: 4px; padding: 1px 6px; }
.self-check { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 8px 14px; margin: 8px 0 16px; font-size: 11pt; }
.self-check .label { font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #15803d; margin-right: 8px; }
.pre-knowledge { background: #faf9f6; border: 1px solid #c9c4b9; border-radius: 10px; padding: 16px 20px; margin: 12px 0; }
.pre-knowledge .label { font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #544f47; margin-bottom: 10px; }
.teacher-box { border: 1px solid #f59e0b; background: #fffbeb; border-radius: 8px; padding: 10px 14px; margin: 12px 0; font-size: 10.5pt; }
.teacher-box .label { font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #b45309; margin-bottom: 4px; }
.answer { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 8px 12px; margin: 8px 0; font-size: 11pt; }
.a-label { font-size: 8.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #15803d; margin-right: 6px; }
.lines { margin: 4px 0 8px; }
.al { display: block; border-bottom: 1.5px solid #8a8478; height: 2rem; }
.response { display: block; border: 1.5px solid #b8b2a7; border-radius: 6px; margin: 6px 0 10px; background: #fafbfc; }
.response-grid { background-image: radial-gradient(circle, #d6d1c7 0.8px, transparent 0.8px); background-size: 18px 18px; background-position: 9px 9px; }
.work-1 { min-height: 2.4rem; } .work-2 { min-height: 4rem; } .work-3 { min-height: 5.6rem; } .work-4 { min-height: 7.2rem; }
.work-5 { min-height: 8.8rem; } .work-6 { min-height: 10.4rem; } .work-7 { min-height: 12rem; } .work-8 { min-height: 13.6rem; }
.section-break { border: none; border-top: 2px dashed #c9c4b9; margin: 24px 0; }
.question { border: 1px solid #d6d1c7; border-radius: 10px; padding: 12px 16px; margin: 0 0 14px; }
.q-head { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.q-num { font-family: var(--font-display); font-weight: 700; font-size: 15pt; color: var(--accent); min-width: 1.6em; }
.badge { font-size: 8.5pt; font-weight: 700; border-radius: 999px; padding: 2px 9px; }
.badge-core { background: var(--accent-light); color: var(--accent); border: 1px solid var(--accent-mid); }
.badge-ext { background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; }
.badge-code { background: #f4f2ed; color: #544f47; border: 1px solid #c9c4b9; }
.marks { margin-left: auto; font-size: 10pt; color: #544f47; }
.q-context { font-size: 9.5pt; color: #6b665d; font-style: italic; margin-bottom: 4px; }
.ticket { border: 2px dashed #8a8478; border-radius: 12px; padding: 14px 18px; margin: 0 0 22px; }
.ticket h2 { font-size: 13pt; }
.meta-block { background: #faf9f6; border: 1px solid #c9c4b9; border-radius: 10px; padding: 12px 16px; margin: 16px 0; }
.meta-block h4 { margin-top: 0; color: var(--accent); }
.rubric table td.rating { font-size: 10pt; color: #544f47; white-space: nowrap; }
.legend { display: flex; gap: 18px; flex-wrap: wrap; font-size: 11pt; margin-top: 6px; }
@media print {
  body { padding: 10px 14px; font-size: 11.5pt; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .section { break-before: page; }
  .section:first-of-type { break-before: auto; }
  .question, .retrieval, .misconception, .connection, .self-check, .worked-example, .learning-target,
  .name-row, table, figure, .try, .key-idea, .explain, .ticket, .meta-block, .answer { break-inside: avoid; }
  .response { border-color: #6b665d; background-color: #fff; }
  h2, h3, h4 { break-after: avoid; }
  p:has(+ figure), p:has(+ table), p:has(+ .response), p:has(+ .lines) { break-after: avoid; }
  p { orphans: 3; widows: 3; }
  .ticket { break-inside: avoid; }
}
/* ── dg-* SVG classes and the viz kit (shared with Math 9 notes) ── */
:root { --dg-stroke: #3f3b35; --dg-fill: #faf9f6; --dg-accent: var(--accent); --dg-secondary: #544f47; --dg-muted: #6b665d;
  --viz-hot: #c2410c; --viz-cold: #1d4ed8; --viz-plant: #15803d; --viz-water: #0369a1; --viz-earth: #92400e; --viz-sun: #ca8a04; --viz-key: #15803d; }
.viz { margin: 0.9rem auto 1.1rem; text-align: center; break-inside: avoid; page-break-inside: avoid; }
.viz svg { display: block; margin: 0 auto; max-width: 100%; height: auto; }
.viz figcaption { font-size: 0.85rem; line-height: 1.4; color: #544f47; margin: 0.4rem auto 0; max-width: 40rem; font-style: italic; }
svg .dg-boundary, svg .dg-line, svg .dg-accent, svg .dg-dashed, svg .dg-right-angle, svg .dg-construction, svg .dg-grid, svg .dg-outline,
svg .dg-fill-accent, svg .dg-fill-hot, svg .dg-fill-cold, svg .dg-fill-plant, svg .dg-fill-water, svg .dg-fill-earth, svg .dg-fill-sun, svg .dg-fill-soft, svg .dg-arrow, svg .dg-tag { vector-effect: non-scaling-stroke; }
svg .dg-boundary    { stroke: var(--dg-stroke); fill: var(--dg-fill); stroke-width: 1.5px; }
svg .dg-line        { stroke: var(--dg-stroke); fill: none; stroke-width: 1.5px; }
svg .dg-accent      { stroke: var(--dg-accent); fill: none; stroke-width: 2.5px; }
svg .dg-dashed      { stroke: var(--dg-secondary); fill: none; stroke-width: 1.5px; stroke-dasharray: 5 3; }
svg .dg-right-angle { stroke: var(--dg-stroke); fill: none; stroke-width: 1px; }
svg .dg-construction{ stroke: var(--dg-muted); fill: none; stroke-width: 1px; stroke-dasharray: 2 3; }
svg .dg-grid        { stroke: var(--dg-muted); stroke-opacity: .45; fill: none; stroke-width: 1px; }
svg .dg-outline     { stroke: var(--dg-stroke); fill: none; stroke-width: 1.5px; }
svg .dg-point       { fill: var(--dg-stroke); stroke: none; }
svg .dg-point-accent{ fill: var(--dg-accent); stroke: none; }
svg .dg-shade       { fill: var(--dg-accent); fill-opacity: .42; stroke: none; }
svg .dg-fill-accent { fill: var(--dg-accent); fill-opacity: .16; stroke: var(--dg-accent); stroke-width: 1.5px; }
svg .dg-fill-hot    { fill: var(--viz-hot);   fill-opacity: .18; stroke: var(--viz-hot);   stroke-width: 1.5px; }
svg .dg-fill-cold   { fill: var(--viz-cold);  fill-opacity: .14; stroke: var(--viz-cold);  stroke-width: 1.5px; }
svg .dg-fill-plant  { fill: var(--viz-plant); fill-opacity: .18; stroke: var(--viz-plant); stroke-width: 1.5px; }
svg .dg-fill-water  { fill: var(--viz-water); fill-opacity: .16; stroke: var(--viz-water); stroke-width: 1.5px; }
svg .dg-fill-earth  { fill: var(--viz-earth); fill-opacity: .18; stroke: var(--viz-earth); stroke-width: 1.5px; }
svg .dg-fill-sun    { fill: var(--viz-sun);   fill-opacity: .26; stroke: var(--viz-sun);   stroke-width: 1.5px; }
svg .dg-fill-soft   { fill: #efece6; stroke: #a8a196; stroke-width: 1px; }
svg .dg-solid-accent{ fill: var(--dg-accent); stroke: none; }
svg .dg-solid-muted { fill: var(--dg-muted); stroke: none; }
svg .dg-arrow       { fill: none; stroke-width: 2px; stroke-linecap: round; }
svg .dg-arrow.plain { stroke: var(--dg-stroke); }  svg .dg-head.plain  { fill: var(--dg-stroke); }
svg .dg-arrow.accent{ stroke: var(--dg-accent); }  svg .dg-head.accent { fill: var(--dg-accent); }
svg .dg-arrow.hot   { stroke: var(--viz-hot); }    svg .dg-head.hot    { fill: var(--viz-hot); }
svg .dg-arrow.muted { stroke: var(--dg-muted); }   svg .dg-head.muted  { fill: var(--dg-muted); }
svg .dg-head        { stroke: none; }
svg .dg-tag         { fill: #fff; stroke: var(--dg-accent); stroke-width: 1.25px; stroke-dasharray: 4 2; }
svg .dg-tag-answer  { font-weight: 700; fill: var(--viz-key); }
svg .dg-label       { font: 13px/1.3 var(--font-body); fill: var(--dg-stroke); stroke: none; }
svg .dg-label-sm    { font: 11.5px/1.3 var(--font-body); fill: var(--dg-secondary); stroke: none; }
svg .dg-label-accent{ font: 600 12.5px/1.3 var(--font-body); fill: var(--dg-accent); stroke: none; }
svg .dg-label-hot   { font: 600 12px/1.3 var(--font-body); fill: var(--viz-hot); stroke: none; }
svg .dg-label-cold  { font: 600 12px/1.3 var(--font-body); fill: var(--viz-cold); stroke: none; }
svg .dg-label-earth { font: 600 12px/1.3 var(--font-body); fill: var(--viz-earth); stroke: none; }
svg .dg-label-white { font: 700 12px/1.3 var(--font-body); fill: #fff; stroke: none; }
svg .dg-title       { font: 700 13.5px/1.3 var(--font-body); fill: var(--dg-stroke); stroke: none; }
svg .dg-math        { font: 16px/1.3 var(--font-body); fill: var(--dg-stroke); stroke: none; }
svg .dg-math-lg     { font: 600 20px/1.2 var(--font-body); fill: var(--dg-stroke); stroke: none; }
CSS

my $GUIDE_CSS = <<'CSS';
.teacher-header { border-left: 6px solid #d97706; background: #fffbeb; padding: 14px 18px; border-radius: 0 10px 10px 0; margin-bottom: 20px; }
.teacher-badge { display: inline-block; background: #d97706; color: #fff; font-size: 8.5pt; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; border-radius: 4px; padding: 2px 8px; margin-bottom: 6px; }
.overview-box { border: 1px solid #c9c4b9; background: #faf9f6; border-radius: 10px; padding: 12px 16px; margin: 10px 0 16px; }
.lesson-card { border: 1px solid #d6d1c7; border-left: 5px solid var(--accent); border-radius: 0 10px 10px 0; padding: 12px 16px; margin: 14px 0; }
.lesson-title { font-family: var(--font-display); font-weight: 600; font-size: 13pt; color: var(--accent); margin-bottom: 6px; }
.lesson-time { font-family: var(--font-body); font-size: 10pt; color: #6b665d; font-weight: 400; }
.step-line { margin: 5px 0; font-size: 11pt; }
.pill { display: inline-block; font-size: 8pt; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; border-radius: 4px; padding: 1px 7px; margin-right: 6px; min-width: 52px; text-align: center; }
.pill-show { background: #dbeafe; color: #1e40af; } .pill-say { background: #dcfce7; color: #166534; }
.pill-do { background: #ede9fe; color: #5b21b6; } .pill-cue { background: #fef3c7; color: #92400e; }
.pill-watch { background: #fee2e2; color: #991b1b; }
.box { border: 1px solid #c9c4b9; border-radius: 10px; padding: 10px 14px; margin: 12px 0; }
.box h4 { margin-top: 0; }
CSS

sub page {
    my (%o) = @_;
    my $strand = $STRAND{ $o{strand} } or die "unknown strand $o{strand}\n";
    $strand = [strand_label($o{strand}), @$strand[1 .. 3]];
    my $css = fonts_css($o{depth}) . ":root { --accent: $strand->[1]; --accent-light: $strand->[2]; --accent-mid: $strand->[3]; }\n" . $BASE_CSS . ($o{extra_css} // '');
    my $header = $o{teacher} ? '' : qq{<div class="header-strip">\n  <div class="course-label">$GRADE · Alberta Curriculum · $strand->[0]</div>\n  <h1>} . esc($o{title}) . qq{</h1>\n  <p class="sub">} . esc($o{sub}) . "</p>\n</div>\n";
    $header .= qq{<div class="answer-key-header">Answer key · Teacher copy</div>\n} if $o{key};
    $header .= qq{<div class="name-row"><span>Name:</span><span class="b"></span><span>Date:</span><span class="b b-md" style="flex:0 0 130px"></span></div>\n} if $o{name};
    return qq{<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>} . esc($o{doc_title}) . qq{ | $GRADE</title>\n<style>\n$css</style>\n</head>\n<body>\n\n$header\n$o{body}\n\n</body>\n</html>\n};
}

sub strand_label { my ($k) = @_; return $GRADE =~ /Grade 7/ && $STRAND7{$k} ? $STRAND7{$k} : $STRAND{$k}[0]; }
sub out_path { return File::Spec->catfile($OUT, @_); }
sub depth_of { my ($p) = @_; my $rel = File::Spec->abs2rel($p, File::Spec->catdir($ROOT, 'public')); my @d = File::Spec->splitdir(dirname($rel)); return scalar @d; }

sub write_page {
    my ($path, %o) = @_;
    $o{depth} = depth_of($path);
    spit($path, page(%o));
    return $path;
}

# ── Notes ─────────────────────────────────────────────────────────────────
sub render_notes {
    my ($path) = @_;
    my ($m, $text) = front(slurp($path));
    my ($topic, $strand) = ($m->{topic}, $m->{strand});
    my (@S, @K, $concept);
    for my $sec (sections($text)) {
        my ($h, $lines) = @$sec;
        if ($h eq '') { next; }
        if ($h =~ /^Concept Reference/i) { $concept = $lines; next; }
        if ($h =~ /^Pre-Knowledge/i) {
            my @q = numbered($lines);
            my $body = join '', map {
                my ($t, $r) = @{ $q[$_] };
                my @r = @$r; push @r, '(lines 2)' unless grep { /\((lines|work)/ } @r;
                '<p><strong>' . ($_ + 1) . '.</strong> ' . inline($t, 0) . "</p>\n" . prose(\@r, 0) . "\n";
            } 0 .. $#q;
            my $html = qq{<div class="section">\n<h2>Before we start</h2>\n<div class="pre-knowledge">\n<div class="label">What do you think? No marks. No wrong answers.</div>\n$body<p><em>Keep this page. You will look at it again at the end.</em></p>\n</div>\n</div>};
            push @S, $html;
            push @K, qq{<div class="section">\n<h2>Before we start</h2>\n<p><em>No answers to mark. Read these to see what students already think. Look for the mistakes listed in the teacher notes.</em></p>\n</div>};
            next;
        }
        my $title = $h;
        $title =~ s/^(Section \d+):\s*/$1 · /;
        my $wrap = sub { my ($key) = @_; return qq{<div class="section">\n<h2>} . inline($title, $key) . "</h2>\n" . body_html($lines, $key, $path) . "\n</div>"; };
        if ($h =~ /^Unit Synthesis/i) {
            my @q = numbered($lines);
            my $mk = sub {
                my ($key) = @_;
                my $ol = join '', map { my ($t, $r) = @$_; my @r = @$r; push @r, '(lines 3)' unless grep { /\((lines|work)/ } @r; '<li>' . inline($t, $key) . prose(\@r, $key) . "</li>\n" } @q;
                return qq{<div class="section">\n<h2>Put it all together</h2>\n<div class="retrieval">\n<div class="retrieval-header">From memory — notes closed</div>\n<ol>\n$ol</ol>\n</div>\n</div>};
            };
            push @S, $mk->(0); push @K, $mk->(1);
            next;
        }
        push @S, $wrap->(0); push @K, $wrap->(1);
    }
    my $how = qq{<div class="how"><strong>How to use these notes</strong><ol><li>Fill in the blanks as we learn. Think first, then write.</li><li>Do the "Explain it" boxes. They help you remember.</li><li>At the end of each section, cover your notes. Try the retrieval check from memory.</li></ol></div>};
    my $stem = basename($path, '.md');
    (my $kstem = $stem) =~ s/-notes-v(\d+)$/-notes-answers-v$1/;
    my @out;
    push @out, write_page(out_path('notes', $topic, "$stem.html"), strand => $strand, title => $m->{title}, sub => 'Guided Notes', doc_title => "$m->{title} — Guided Notes", name => 1, body => $how . "\n" . join("\n", @S));
    push @out, write_page(out_path('notes', $topic, "$kstem.html"), strand => $strand, title => $m->{title}, sub => 'Guided Notes — Answer Key', doc_title => "$m->{title} — Notes Answer Key", key => 1, body => join("\n", @K));
    if ($concept) {
        (my $cstem = $stem) =~ s/-notes-v(\d+)$/-concepts-v$1/;
        push @out, write_page(out_path('worksheets', $strand, $topic, "$cstem.html"), strand => $strand, title => "$m->{title} — Concept Reference", sub => 'The key ideas on one page. Keep it beside you when you practise.', doc_title => "$m->{title} — Concept Reference", body => body_html($concept, 1, $path));
    }
    return @out;
}

# ── Practice worksheets (core + challenge) ────────────────────────────────
sub questions_of {
    my ($lines) = @_;
    my @q; my @pre;
    for (@$lines) {
        if (/^###\s+(.*)$/) { push @q, [$1, []]; }
        elsif (@q) { push @{ $q[-1][1] }, $_; }
        else { push @pre, $_; }
    }
    return (\@pre, @q);
}

sub question_html {
    my ($n, $stem, $lines, $key, %o) = @_;
    my $badge = $o{badge} // '';
    my $marks = $o{marks} ? qq{<span class="marks">$o{marks}</span>} : '';
    my $ctx = $key && $o{context} ? '<div class="q-context">' . inline($o{context}, 1) . '</div>' : '';
    return qq{<div class="question">\n<div class="q-head"><span class="q-num">$n</span>$badge$marks</div>\n$ctx<p>} . inline($stem, $key) . "</p>\n" . body_html($lines, $key, '') . "\n</div>";
}

sub render_practice {
    my ($path) = @_;
    my ($m, $text) = front(slurp($path));
    my ($topic, $strand) = ($m->{topic}, $m->{strand});
    my $stem = basename($path, '.md');
    $stem =~ s/-practice-v(\d+)$//;
    my $v = $1 // 1;
    my @out;
    for my $sec (sections($text)) {
        my ($h, $lines) = @$sec;
        next if $h eq '';
        my $tier = $h =~ /^Core/i ? 'core' : $h =~ /^Challenge/i ? 'challenge' : die "$path: section must be Core or Challenge\n";
        my ($pre, @q) = questions_of($lines);
        my $badge = $tier eq 'core' ? '<span class="badge badge-core">★ Core</span>' : '<span class="badge badge-ext">★★ Challenge</span>';
        for my $key (0, 1) {
            my $intro = $key ? '' : ($tier eq 'core'
                ? '<div class="how"><strong>Core practice ★</strong> These are for everyone. Show your steps. Use your notes or the concept sheet if you get stuck, then try the next one without them.</div>'
                : '<div class="how"><strong>Challenge ★★</strong> Ready for more? These ask you to explain, find mistakes and solve new problems. Show all your thinking.</div>');
            my $body = $intro . "\n" . body_html($pre, $key, $path) . "\n" . join("\n", map { question_html($_ + 1, $q[$_][0], $q[$_][1], $key, badge => $badge) } 0 .. $#q);
            my $file = "$stem-worksheet-$tier" . ($key ? '-answers' : '') . "-v$v.html";
            my $label = $tier eq 'core' ? 'Core Practice ★' : 'Challenge ★★';
            push @out, write_page(out_path('worksheets', $strand, $topic, $file), strand => $strand, title => $m->{title}, sub => $label . ($key ? ' — Answer Key' : ''), doc_title => "$m->{title} — $label" . ($key ? ' Answer Key' : ''), key => $key, name => !$key, body => $body);
        }
    }
    return @out;
}

# ── Exit tickets ──────────────────────────────────────────────────────────
sub render_exits {
    my ($path) = @_;
    my ($m, $text) = front(slurp($path));
    my ($topic, $strand) = ($m->{topic}, $m->{strand});
    my @T;
    for my $sec (sections($text)) {
        my ($h, $lines) = @$sec;
        next if $h eq '';
        my ($pre, @q) = questions_of($lines);
        my @pre = @$pre;
        my ($target) = map { /^Target:\s*(.*)$/ ? $1 : () } @pre;
        @pre = grep { !/^Target:/ } @pre;
        (my $title = $h) =~ s/^(Section \d+):\s*/$1 · /;
        my $qs = join "\n", map { '<p><strong>' . ($_ + 1) . '.</strong> ' . inline($q[$_][0], 0) . "</p>\n" . body_html($q[$_][1], 0, $path) } 0 .. $#q;
        push @T, qq{<div class="ticket">\n<h2>Exit ticket — } . inline($title, 0) . qq{</h2>\n<div class="name-row"><span>Name:</span><span class="b"></span><span>Date:</span><span class="b b-md" style="flex:0 0 110px"></span></div>\n}
            . ($target ? '<div class="learning-target"><strong>Target:</strong> ' . inline($target, 0) . "</div>\n" : '') . body_html(\@pre, 0, $path) . "\n$qs\n"
            . qq{<div class="self-check"><span class="label">How did it go?</span> ☐ I've got this &nbsp;&nbsp; ☐ Almost &nbsp;&nbsp; ☐ Not yet</div>\n</div>};
    }
    my $how = '<div class="how"><strong>For the teacher:</strong> print and cut. One ticket at the end of each section. Give 3–5 minutes. Read them before the next class and sort into three piles: got it, almost, not yet.</div>';
    my $stem = basename($path, '.md');
    return (write_page(out_path('exits', $topic, "$stem.html"), strand => $strand, title => $m->{title}, sub => 'Exit Tickets', doc_title => "$m->{title} — Exit Tickets", body => $how . "\n" . join("\n", @T)));
}

# ── Quiz ──────────────────────────────────────────────────────────────────
sub render_quiz {
    my ($path) = @_;
    my ($m, $text) = front(slurp($path));
    my ($topic, $strand) = ($m->{topic}, $m->{strand});
    $text =~ s/<!--.*?-->//gs;
    my ($pre, @q) = questions_of([split /\n/, $text]);
    my $total = 0;
    my @Q;
    for my $i (0 .. $#q) {
        my ($stem, $lines) = @{ $q[$i] };
        my ($code, $mk) = ('', '');
        if ($stem =~ s/^\[([A-Z]{2}\d)\s*·\s*(\d+)\]\s*//) { ($code, $mk) = ($1, $2); $total += $2; }
        push @Q, question_html($i + 1, $stem, $lines, 0, badge => ($code ? qq{<span class="badge badge-code">$code</span>} : ''), marks => ($mk ? "$mk mark" . ($mk == 1 ? '' : 's') : ''));
    }
    my $intro = qq{<div class="how"><strong>Mid-unit quiz.</strong> Show your steps. Marks: _____ / $total</div>\n} . body_html($pre, 0, $path);
    my $stem = basename($path, '.md');
    return (write_page(out_path('quizzes', $topic, "$stem.html"), strand => $strand, title => $m->{title}, sub => 'Mid-Unit Quiz', doc_title => "$m->{title} — Mid-Unit Quiz", name => 1, body => $intro . "\n" . join("\n", @Q)));
}

# ── Teacher notes ─────────────────────────────────────────────────────────
sub render_teacher {
    my ($path) = @_;
    my ($m, $text) = front(slurp($path));
    my ($topic, $strand) = ($m->{topic}, $m->{strand});
    my @B;
    push @B, qq{<div class="teacher-header">\n<span class="teacher-badge">Teacher notes</span>\n<h1>} . esc($m->{title}) . qq{</h1>\n<p class="sub">$GRADE · } . esc(strand_label($strand)) . ' · ' . esc($m->{subtitle} // '') . "</p>\n</div>";
    my %PILL = (SHOW => 'show', SAY => 'say', DO => 'do', CUE => 'cue', WATCH => 'watch');
    for my $sec (sections($text)) {
        my ($h, $lines) = @$sec;
        push @B, '<h2 style="margin-top:22px">' . inline($h, 1) . '</h2>' if $h ne '';
        my $in_card = 0;
        my @buf;
        my $flush = sub { if (@buf) { push @B, prose([@buf], 1); @buf = (); } };
        my $close = sub { if ($in_card) { push @B, '</div>'; $in_card = 0; } };
        for my $b (blocks_of(@$lines)) {
            if (ref $b) {
                $flush->();
                my ($kind, $arg, $in) = @$b;
                if ($kind eq 'overview') { push @B, '<div class="overview-box">' . prose($in, 1) . '</div>'; }
                elsif ($kind eq 'box') { push @B, '<div class="box"><h4>' . inline($arg, 1) . '</h4>' . prose($in, 1) . '</div>'; }
                else { push @B, block_html($b, 1, $path); }
                next;
            }
            if ($b =~ /^###\s+(.*?)\s*(?:\(([^)]*)\))?\s*$/) {
                $flush->(); $close->();
                push @B, '<div class="lesson-card"><div class="lesson-title">' . inline($1, 1) . ($2 ? qq{ <span class="lesson-time">· $2</span>} : '') . '</div>';
                $in_card = 1; next;
            }
            if ($b =~ /^(SHOW|SAY|DO|CUE|WATCH):\s*(.*)$/) {
                $flush->();
                push @B, qq{<div class="step-line"><span class="pill pill-$PILL{$1}">$1</span>} . ($1 eq 'SAY' ? '<em>' . inline($2, 1) . '</em>' : inline($2, 1)) . '</div>';
                next;
            }
            push @buf, $b;
        }
        $flush->(); $close->();
    }
    my $stem = basename($path, '.md');
    return (write_page(out_path('notes', $topic, "$stem.html"), strand => $strand, title => $m->{title}, doc_title => "$m->{title} — Teacher Notes", teacher => 1, extra_css => $GUIDE_CSS, body => join("\n", @B)));
}

# ── Strand workbook ───────────────────────────────────────────────────────
sub render_workbook {
    my ($path) = @_;
    my ($m, $text) = front(slurp($path));
    my $strand = $m->{strand};
    my (@S, @K);
    my $n = 0;
    my $stretch = 0;
    push @S, qq{<div class="how"><strong>How this workbook works</strong><ol><li>The questions are mixed up on purpose. First figure out what each question is asking. That is part of the learning.</li><li>Your teacher will tell you which questions are open today.</li><li>Show your thinking. A picture counts.</li></ol><div class="legend"><span><span class="badge badge-core">★ Core</span> for everyone</span><span><span class="badge badge-ext">★★ Extended</span> more challenge</span></div></div>};
    push @S, qq{<div class="meta-block"><h4>Before you begin</h4><p>Look at today's questions. Which one looks hardest? Why?</p><p>Question <span class="b b-sm"></span> because <span class="b b-xl"></span></p></div>};
    push @K, qq{<div class="how">Every card says which topic and notes section must be taught before the question opens. The student copy has no topic labels: tell students which questions are open each day. <strong>Misconception</strong> tags mark the questions built to catch a common mistake.</div>};
    for my $sec (sections($text)) {
        my ($h, $lines) = @$sec;
        next if $h eq '';
        if ($h =~ /^CHECKIN/) {
            push @S, qq{<div class="meta-block"><h4>Halfway check-in</h4><p>Which question so far are you least sure about? Question <span class="b b-sm"></span></p><p>What will you do about it? (re-read the notes · ask a partner · ask the teacher)</p><div class="lines"><div class="al"></div></div></div>};
            next;
        }
        $h =~ /^(core|ext|stretch)\s*(?:\|\s*(.*))?$/ or die "$path: bad question heading '$h'\n";
        my ($lvl, $ctx) = ($1, $2 // '');
        $n++;
        if ($lvl eq 'stretch' && !$stretch++) {
            my $z = qq{<h2 style="margin-top:26px">Challenge zone</h2><p>Try these after the others. Each one uses ideas from more than one topic.</p>};
            push @S, $z; push @K, $z;
        }
        my $badge = $lvl eq 'core' ? '<span class="badge badge-core">★ Core</span>' : '<span class="badge badge-ext">★★ Extended</span>';
        my ($stem, @rest) = @$lines;
        while (defined $stem && $stem !~ /\S/) { $stem = shift @rest; }
        push @S, question_html($n, $stem, \@rest, 0, badge => $badge);
        push @K, question_html($n, $stem, \@rest, 1, badge => $badge, context => ($ctx ? "Opens after: $ctx" : ''));
    }
    push @S, qq{<div class="meta-block"><h4>After each session</h4><ol><li>Which question was hardest today? Question <span class="b b-sm"></span></li><li>Was it hard because you did not know the idea, or because the question asked it in a new way? Circle one and explain.</li></ol><div class="lines"><div class="al"></div></div><ol start="3"><li>Rate the toughest idea: 1 (lost) · 2 (partly) · 3 (got it) · 4 (could teach it). My rating: <span class="b b-sm"></span></li></ol></div>};
    my $rub = ref $m->{rubric} ? $m->{rubric} : [];
    push @S, qq{<div class="meta-block rubric"><h4>Self-assessment — fill in after your last session</h4><table><thead><tr><th style="width:46%">Big idea</th><th>I can do this without notes</th><th>A question I still have</th></tr></thead><tbody>}
        . join('', map { '<tr><td>' . inline($_, 0) . '</td><td class="rating">Yes · Getting there · Not yet</td><td></td></tr>' } @$rub) . '</tbody></table></div>';
    my $stem = basename($path, '.md');
    (my $kstem = $stem) =~ s/-workbook-v(\d+)$/-workbook-answers-v$1/;
    return (
        write_page(out_path('worksheets', $strand, "$stem.html"), strand => $strand, title => $m->{title}, sub => 'Strand Workbook — mixed practice', doc_title => "$m->{title} — Strand Workbook", name => 1, body => join("\n", @S)),
        write_page(out_path('worksheets', $strand, "$kstem.html"), strand => $strand, title => $m->{title}, sub => 'Strand Workbook — Answer Key', doc_title => "$m->{title} — Workbook Answer Key", key => 1, body => join("\n", @K)),
    );
}

# ── main ──────────────────────────────────────────────────────────────────
my @files = @ARGV ? @ARGV : (
    glob("$ROOT/notes-packages/math-8/*/math8-*-notes-v1.md"),
    glob("$ROOT/notes-packages/math-8/*/math8-*-teachernotes-v1.md"),
    glob("$ROOT/worksheets/math-8/*/*/math8-*-practice-v1.md"),
    glob("$ROOT/worksheets/math-8/*/math8-*-workbook-v1.md"),
    glob("$ROOT/tests-quizzes/math-8/*/math8-*-exits-v1.md"),
    glob("$ROOT/tests-quizzes/math-8/*/math8-*-quiz-v1.md"),
    glob("$ROOT/notes-packages/math-7/*/math7-*-notes-v1.md"),
    glob("$ROOT/notes-packages/math-7/*/math7-*-teachernotes-v1.md"),
    glob("$ROOT/worksheets/math-7/*/*/math7-*-practice-v1.md"),
    glob("$ROOT/worksheets/math-7/*/math7-*-workbook-v1.md"),
    glob("$ROOT/tests-quizzes/math-7/*/math7-*-exits-v1.md"),
    glob("$ROOT/tests-quizzes/math-7/*/math7-*-quiz-v1.md"),
);
for my $f (@files) {
    my $g = $f =~ m{/math-7/|(?:^|/)math7-} ? 7 : 8;
    $OUT = File::Spec->catdir($ROOT, 'public', 'materials', "math-$g");
    $GRADE = "Grade $g Mathematics";
    my @out = $f =~ /-notes-v\d+\.md$/        ? render_notes($f)
            : $f =~ /-teachernotes-v\d+\.md$/ ? render_teacher($f)
            : $f =~ /-practice-v\d+\.md$/     ? render_practice($f)
            : $f =~ /-workbook-v\d+\.md$/     ? render_workbook($f)
            : $f =~ /-exits-v\d+\.md$/        ? render_exits($f)
            : $f =~ /-quiz-v\d+\.md$/         ? render_quiz($f)
            : die "$f: not a Math 7 or Math 8 source\n";
    print File::Spec->abs2rel($_, $ROOT), "\n" for @out;
}
