#!/usr/bin/env perl
# Render Social Studies notes packages, workbooks and teacher guides
# (markdown) to the printable HTML the Social 8 and 9 units use.
#
# One source gives both copies: a notes or workbook source renders the
# student page and its answer key, because the answers sit in the source
# next to the blanks they fill. Perl runs on this machine; Python does not.
#
# Sources:  notes-packages/grade-*-social/*/*-notes-v1.md
#           worksheets/grade-*-social/*/*-workbook-v1.md
#           lesson-plans/grade-*-social/*/*-teacherguide-v1.md
# Output:   public/materials/<stem>.html, and <prefix>-answers-v1.html for
#           notes and workbooks.
# Styles:   scripts/social-css/<kind>.css, the Social 8 styles with the unit
#           colour as {{UNIT}}, {{UNIT_DARK}}, {{UNIT_LIGHT}}, {{UNIT_BORDER}}.
#
# Run from the repo root:
#   perl scripts/render_social.pl                  # every source above
#   perl scripts/render_social.pl path/to/file.md  # just these
#
# ── Source format ─────────────────────────────────────────────────────────
# Front matter (--- … ---): title, course ("Grade 7 Social Studies"), lo, gq,
# colour (amber, indigo, blue, teal, rose), and for workbooks a `rubric:` list
# ("- cluster" lines). Teacher guides also take `subtitle`.
#
# Inline: **bold**, *italic*, [[answer]] is a blank (filled in the key),
# ___ is a blank with no answer. A line `(lines N)` gives N answer lines.
# Lines starting `=> ` are the answer to the question above (key only).
#
# Blocks are fenced with `::: kind` … `:::`:
#   html          raw HTML (diagrams). [[x]] shows as a blank, or x in the key.
#   misconception WRONG: / WHY: / RIGHT: lines (refutation-first box)
#   note          plain note box          connection  connection prompt
#   retrieval     numbered questions with => answers; ★ marks a stretch item
#   teacher       key-only discussion box; first line `label: …`
#   wordbank      one line of terms       quote       quoted claim or source
#   overview, assessment, closing          teacher guide boxes
#   lab Heading   teacher guide activity box
#
# Notes:      "## Pre-Knowledge Check", then "## Section N: Title" sections,
#             "Learning target: …", "### Vocabulary" + "- Term" lines,
#             "#### Heading" for sub-headings. "## Unit Synthesis" closes.
# Workbook:   "## Q3 core | Section 2 — topic" (core, ext or stretch; the part
#             after | is the key's "opens after" note), "## CHECKIN".
# Teacher:    "## Heading", "### Section — title (N classes)" week blocks,
#             "#### Lesson title" cards with SHOW:/SAY:/CUE:/NOTES: lines.
use strict;
use warnings;
use utf8;
use open qw(:std :encoding(UTF-8));
use Cwd qw(abs_path);
use File::Basename qw(dirname basename);
use File::Spec;

my $ROOT = dirname(dirname(abs_path($0)));
my $OUT  = File::Spec->catdir($ROOT, 'public', 'materials');

my %PALETTE = (
    amber  => ['#92400e', '#78350f', '#fffbeb', '#fde68a'],
    indigo => ['#4338ca', '#3730a3', '#eef2ff', '#c7d2fe'],
    blue   => ['#1d4ed8', '#1e40af', '#eff6ff', '#bfdbfe'],
    teal   => ['#0f766e', '#115e59', '#f0fdfa', '#99f6e4'],
    rose   => ['#9f1239', '#881337', '#fff1f2', '#fecdd3'],
);

# Key-only additions to the shared styles.
my $EXTRA_CSS = <<'CSS';
  svg .ak { fill: #166534; font-weight: 700; }
  .ak-fill { color: #166534; font-weight: 700; border-bottom: 2px solid #86efac; padding: 0 0.15rem; }
  .ak-list li { margin-bottom: 0.35rem; }
  .q-parts { margin: 0.3rem 0 0.5rem 1.4rem; }
CSS

sub slurp { my ($p) = @_; open my $fh, '<', $p or die "$p: $!"; local $/; my $s = <$fh>; close $fh; return $s; }
sub spit  { my ($p, $s) = @_; open my $fh, '>', $p or die "$p: $!"; print $fh $s; close $fh; }

sub esc {
    my ($s) = @_;
    $s =~ s/&(?![#a-zA-Z0-9]+;)/&amp;/g;
    $s =~ s/</&lt;/g; $s =~ s/>/&gt;/g;
    return $s;
}

# Front matter: key: value, and "- item" lists under a key.
sub front {
    my ($text) = @_;
    $text =~ s/\r\n/\n/g;
    $text =~ s/^---\n(.*?)\n---\n//s or die "missing front matter\n";
    my %m; my $list;
    for (split /\n/, $1) {
        if (/^(\w+):\s*(.*)$/) { $list = $1; $m{$1} = $2 eq '' ? [] : unq($2); }
        elsif (/^\s*-\s+(.*)$/ && $list) { $m{$list} = [] unless ref $m{$list}; push @{ $m{$list} }, unq($1); }
    }
    return (\%m, $text);
}
sub unq { my ($s) = @_; $s =~ s/^"(.*)"$/$1/; return $s; }

# Inline markdown. $key: 1 renders [[x]] as the answer, 0 as a blank.
sub inline {
    my ($s, $key, $answers) = @_;
    my @a;
    $s =~ s/\[\[(.+?)\]\]/push @a, $1; "\x{1}" . $#a . "\x{2}"/ge;
    $s = esc($s);
    $s =~ s/\*\*(.+?)\*\*/<strong>$1<\/strong>/g;
    $s =~ s/(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])/<em>$1<\/em>/g;
    $s =~ s/_{3,}/<span class="b b-md">&nbsp;<\/span>/g;
    $s =~ s{\x{1}(\d+)\x{2}}{
        my $x = $a[$1]; push @$answers, $x if $answers;
        $key ? '<span class="ak-fill">' . esc($x) . '</span>'
             : '<span class="b ' . (length($x) > 14 ? 'b-xl' : length($x) > 9 ? 'b-lg' : 'b-md') . '">&nbsp;</span>'
    }ge;
    return $s;
}

# A plain-text version of a line with every blank as ___ (for key tables).
sub prompt_text { my ($s) = @_; $s =~ s/\[\[.+?\]\]/___/g; $s =~ s/\*\*?//g; return esc($s); }

sub lines_html { my ($n, $cls) = @_; return join '', map { qq{<div class="$cls"></div>} } 1 .. $n; }

# Split a body into blocks: fenced ::: blocks become [kind, arg, [lines]];
# other lines stay strings.
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

# Paragraphs, lists, tables, (lines N), => answers, #### headings.
sub prose {
    my ($lines, $key, $o) = @_;
    $o ||= {};
    my (@out, @para, @items, $kind, @rows);
    my $line_cls = $o->{line_cls} || 'al';
    my $flush = sub {
        if (@para) {
            my $p = join ' ', @para;
            push @out, '<p>' . inline($p, $key, $o->{answers}) . '</p>';
            push @{ $o->{sentences} }, $p if $o->{sentences} && $p =~ /\[\[/;
            @para = ();
        }
        if (@items) {
            push @out, "<$kind" . ($kind eq 'ol' && $o->{ol_class} ? qq{ class="$o->{ol_class}"} : '') . '>'
                . join('', map { '<li>' . inline($_, $key, $o->{answers}) . '</li>' } @items) . "</$kind>";
            push @{ $o->{sentences} }, grep { /\[\[/ } @items if $o->{sentences};
            @items = (); $kind = undef;
        }
        if (@rows) {
            my @r = map { my $x = $_; $x =~ s/^\s*\|//; $x =~ s/\|\s*$//; [map { s/^\s+|\s+$//gr } split /\|/, $x] } @rows;
            @r = grep { !(@$_ && $_->[0] =~ /^:?-{2,}/) } @r;
            my $head = shift @r;
            my $t = '<div class="vocab-wrap"><table><thead><tr>' . join('', map { '<th>' . inline($_, $key) . '</th>' } @$head) . '</tr></thead><tbody>';
            for my $row (@r) {
                $t .= '<tr>' . join('', map { '<td>' . ($_ eq '' ? '&nbsp;' : inline($_, $key, $o->{answers})) . '</td>' } @$row) . '</tr>';
                push @{ $o->{sentences} }, join(' — ', @$row) if $o->{sentences} && grep { /\[\[/ } @$row;
            }
            push @out, $t . '</tbody></table></div>';
            @rows = ();
        }
    };
    for my $l (@$lines) {
        my $s = $l; $s =~ s/^\s+|\s+$//g;
        if ($s eq '') { $flush->(); }
        elsif ($s =~ /^\|/) { $flush->() if @para || @items; push @rows, $s; }
        elsif ($s =~ /^\(lines (\d+)\)$/) { $flush->(); push @out, $key ? '' : ($line_cls eq 'resp-line' ? '<div class="resp">' . lines_html($1, 'resp-line') . '</div>' : lines_html($1, $line_cls)); }
        elsif ($s =~ /^=>\s*(.*)$/) { $flush->(); push @out, '<p class="ak-fill" style="border:0">' . inline($1, 1) . '</p>' if $key && !$o->{skip_answers}; push @{ $o->{qa} }, $1 if $o->{qa}; }
        elsif ($s =~ /^####\s+(.*)$/) { $flush->(); push @out, '<h4>' . inline($1, $key) . '</h4>'; }
        elsif ($s =~ /^([-*]|\d+[.)]|[a-z][.)])\s+(.*)$/) {
            my ($mark, $item) = ($1, $2);
            my $want = $mark =~ /^[-*]$/ ? 'ul' : 'ol';
            $flush->() if @para || ($kind && $kind ne $want);
            $kind = $want; push @items, $item;
        }
        else { $flush->() if @items; push @para, $s; }
    }
    $flush->();
    return join "\n", grep { $_ ne '' } @out;
}

# Raw HTML with [[x]] as a blank (student) or the answer (key).
sub raw_html {
    my ($lines, $key) = @_;
    my $h = join "\n", @$lines;
    $h =~ s{\[\[(.+?)\]\]}{ $key ? qq{<tspan class="dg-tag-answer">$1</tspan>} : ('_' x (length($1) < 6 ? 8 : int(length($1) * 1.3))) }ge;
    return $h;
}

sub css_for {
    my ($kind, $colour) = @_;
    my $p = $PALETTE{$colour || 'indigo'} or die "unknown colour $colour\n";
    my $css = slurp(File::Spec->catfile($ROOT, 'scripts', 'social-css', "$kind.css"));
    $css =~ s/\{\{UNIT\}\}/$p->[0]/g; $css =~ s/\{\{UNIT_DARK\}\}/$p->[1]/g;
    $css =~ s/\{\{UNIT_LIGHT\}\}/$p->[2]/g; $css =~ s/\{\{UNIT_BORDER\}\}/$p->[3]/g;
    return $css . $EXTRA_CSS;
}

sub page {
    my ($title, $css, $body) = @_;
    return qq{<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>} . esc($title) . qq{</title>\n<style>\n$css</style>\n</head>\n<body>\n\n$body\n\n</body>\n</html>\n};
}

my $NAME_LINE = qq{  <div class="name-line">\n    <span>Name:</span>\n    <span>Date started:</span>\n    <span>Block:</span>\n  </div>};

sub key_cover {
    my ($m, $what) = @_;
    return qq{<div class="cover">\n  <h1>} . esc($m->{title}) . qq{</h1>\n  <p>} . esc($m->{course}) . qq{ &nbsp;·&nbsp; $what &nbsp;·&nbsp; Alberta Draft Curriculum 2026</p>\n  <p><strong>Teacher Copy — Not for Students</strong></p>\n</div>\n\n<p class="guiding-q"><strong>Learning Outcome:</strong> } . esc($m->{lo}) . qq{</p>\n<p class="guiding-q">Guiding Question: } . esc($m->{gq}) . "</p>\n";
}

# Split "## " headings into [heading, [lines]].
sub sections {
    my ($text) = @_;
    $text =~ s/\r\n/\n/g;
    # Drop authoring comments, but keep the "<!-- tikz: … -->" tag each diagram needs.
    $text =~ s/<!--(?!\s*tikz:).*?-->//gs;
    my @secs; my $cur = ['', []];
    for (split /\n/, $text) {
        if (/^## (.*)$/) { push @secs, $cur; $cur = [$1, []]; }
        else { push @{ $cur->[1] }, $_; }
    }
    push @secs, $cur;
    return grep { $_->[0] ne '' || grep { /\S/ } @{ $_->[1] } } @secs;
}

# ── Notes ─────────────────────────────────────────────────────────────────
sub render_notes {
    my ($path) = @_;
    my ($m, $text) = front(slurp($path));
    my $stem = basename($path, '.md');
    (my $kstem = $stem) =~ s/-notes-v(\d+)$/-notes-answers-v$1/;
    my (@S, @K);
    push @S, qq{<div class="cover">\n  <h1>} . esc($m->{title}) . qq{</h1>\n  <p>} . esc($m->{course}) . qq{ &nbsp;·&nbsp; Guided Notes Package &nbsp;·&nbsp; Alberta Draft Curriculum 2026</p>\n  <p class="lo-line"><strong>Learning Outcome:</strong> } . esc($m->{lo}) . qq{</p>\n  <p class="lo-line"><strong>Guiding Question:</strong> } . esc($m->{gq}) . qq{</p>\n$NAME_LINE\n</div>\n};
    push @S, qq{<div class="instructions">\n  <p>Fill in the blanks as you learn, but think before you write. After each section, cover your notes and try the <strong>Retrieval Check</strong> from memory. The first time is supposed to be hard. That difficulty is the learning.</p>\n</div>\n};
    push @K, key_cover($m, 'Notes Answer Key');

    for my $sec (sections($text)) {
        my ($h, $lines) = @$sec;
        if ($h =~ /^Pre-Knowledge/i) {
            my @q = map { s/^\d+\.\s*//r } grep { /^\d+\.\s/ } @$lines;
            push @S, qq{<div class="section">\n<div class="pre-knowledge">\n  <div class="label">Pre-Knowledge Check — Before instruction begins</div>\n  <p><em>No notes. No wrong answers. Just write what you think.</em></p>\n}
                . join('', map { '  <p>' . ($_ + 1) . '. ' . inline($q[$_], 0) . qq{</p>\n  <div class="al"></div>\n} } 0 .. $#q)
                . qq{  <p style="margin-top:0.75rem; font-size:0.85rem; color:#544f47;"><em>Keep these answers. You will revisit them at the end of the unit.</em></p>\n</div>\n</div>\n};
            next;
        }
        my $title = $h; $title =~ s/^(Section \d+):\s*/$1 &nbsp;·&nbsp; /;
        push @S, qq{<!-- ═══ } . esc($h) . qq{ ═══ -->\n<div class="section">\n<h2 class="section-title">} . inline($title, 0) . "</h2>\n";
        push @K, qq{<hr class="section-break">\n<h2 class="section-title">} . inline($h, 1) . "</h2>\n";
        my (@sent, @kextra);
        my $o = { sentences => \@sent };
        my @buf;
        my $flush = sub { if (@buf) { push @S, prose([@buf], 0) . "\n"; prose([@buf], 1, $o); @buf = (); } };
        my @bl = blocks_of(@$lines);
        while (@bl) {
            my $b = shift @bl;
            if (!ref $b) {
                if ($b =~ /^Learning target:\s*(.*)$/) { $flush->(); push @S, qq{<p class="learning-target"><strong>Learning target:</strong> } . inline($1, 0) . "</p>\n"; }
                elsif ($b =~ /^###\s+Vocabulary/) {
                    $flush->();
                    my @terms;
                    while (@bl && !ref $bl[0] && $bl[0] =~ /^\s*(-\s+.*)?$/) { my $x = shift @bl; push @terms, $1 if $x =~ /^\s*-\s+(.*)$/; }
                    push @S, qq{<h3>Vocabulary</h3>\n<div class="vocab-wrap">\n  <table>\n    <thead><tr><th style="width:22%">Term</th><th style="width:43%">Definition in your own words</th><th style="width:35%">One example</th></tr></thead>\n    <tbody>\n}
                        . join('', map { '      <tr><td>' . esc($_) . qq{</td><td>&nbsp;</td><td>&nbsp;</td></tr>\n} } @terms) . qq{    </tbody>\n  </table>\n</div>\n};
                }
                else { push @buf, $b; }
                next;
            }
            $flush->();
            my ($kind, $arg, $in) = @$b;
            if ($kind eq 'html') {
                push @S, raw_html($in, 0) . "\n";
                push @K, qq{<figure class="viz">\n<p class="viz-ak-note">Diagram — answers</p>\n} . (raw_html($in, 1) =~ s/^\s*<figure[^>]*>|<\/figure>\s*$//gr) . "\n</figure>\n"
                    if join('', @$in) =~ /\[\[/;
            }
            elsif ($kind eq 'misconception') {
                my %f; for (@$in) { $f{$1} = $2 if /^(WRONG|WHY|RIGHT):\s*(.*)$/; }
                push @S, qq{<div class="misconception">\n  <div class="m-label">Misconception</div>\n  <p class="m-wrong">} . inline($f{WRONG} // '', 0) . qq{</p>\n  <p><strong>Why this fails:</strong> } . inline($f{WHY} // '', 0) . qq{</p>\n  <p><strong>Correct understanding:</strong> } . inline($f{RIGHT} // '', 0) . qq{</p>\n</div>\n};
                push @K, qq{<div class="misconception">\n  <div class="m-label">Misconception Target</div>\n  <p>} . inline($f{WRONG} // '', 1) . qq{ — refuted at this point in the section, before the correct idea is taught.</p>\n</div>\n};
                push @sent, $f{RIGHT} if ($f{RIGHT} // '') =~ /\[\[/;
            }
            elsif ($kind eq 'note') { push @S, '<div class="note-box">' . inline(join(' ', @$in), 0) . "</div>\n"; push @sent, join(' ', @$in) if join(' ', @$in) =~ /\[\[/; }
            elsif ($kind eq 'connection') {
                push @S, qq{<div class="connection">\n  <div class="c-label">Connection Prompt</div>\n  <p>} . inline(join(' ', grep { !/^\(lines/ } @$in), 0) . qq{</p>\n  <div class="al"></div><div class="al"></div>\n</div>\n};
            }
            elsif ($kind eq 'teacher') {
                my @t = @$in; my $label = 'Teacher Note';
                $label = $1 if @t && $t[0] =~ /^label:\s*(.*)$/ && shift @t;
                push @kextra, qq{<div class="discussion">\n  <div class="d-label">} . esc($label) . "</div>\n" . prose(\@t, 1) . "\n</div>\n";
            }
            elsif ($kind eq 'retrieval') {
                my (@q, @ans);
                for (@$in) {
                    if (/^\s*\d+\.\s+(.*)$/) { push @q, [$1, 1, []]; }
                    elsif (/^\s*=>\s*(.*)$/ && @q) { push @{ $q[-1][2] }, $1; }
                    elsif (/^\s*\(lines (\d+)\)/ && @q) { $q[-1][1] = $1; }
                }
                my $ol = '';
                my $n = 0;
                for my $q (@q) {
                    $n++;
                    my ($t, $nl, $a) = @$q;
                    my $star = $t =~ s/^★\s*(Stretch:?)?\s*//;
                    $ol .= '    <li>' . ($star ? '<span class="stretch-label">★ Stretch</span> ' : '') . inline($t, 0) . lines_html($star && $nl < 2 ? 2 : $nl, 'al') . "</li>\n";
                    push @ans, '  <li><strong>Q' . $n . '</strong>' . ($star ? ' <em>★ Stretch</em>' : '') . ': ' . inline(join(' ', @$a), 1) . "</li>\n" if @$a;
                }
                push @S, qq{<div class="retrieval">\n  <div class="r-label">Retrieval Check — notes closed</div>\n  <ol>\n$ol  </ol>\n</div>\n};
                push @S, qq{<div class="self-check">\n  <strong>Self-check:</strong> &nbsp;\n  <label><input type="checkbox"> I could teach it</label> &nbsp;&nbsp;\n  <label><input type="checkbox"> Getting there</label> &nbsp;&nbsp;\n  <label><input type="checkbox"> Not yet — I need to re-read this section</label>\n</div>\n};
                push @kextra, "<p><strong>Retrieval Check answers:</strong></p>\n<ul class=\"ak-list\">\n" . join('', @ans) . "</ul>\n" if @ans;
            }
            elsif ($kind eq 'quote') { push @S, '<div class="note-box"><em>' . inline(join(' ', @$in), 0) . "</em></div>\n"; }
            else { die "$path: unknown block '$kind'\n"; }
        }
        $flush->();
        push @S, "</div>\n";
        if (@sent) {
            push @K, qq{<div class="vocab-wrap"><table>\n<thead><tr><th>Blank / Prompt</th><th>Expected Answer</th></tr></thead>\n<tbody>\n};
            for my $p (@sent) {
                for my $s (split /(?<=[.!?])\s+(?=[A-Z"“])/, $p) {
                    my @a = $s =~ /\[\[(.+?)\]\]/g or next;
                    push @K, '<tr><td>' . prompt_text($s) . '</td><td>' . join(' · ', map { esc($_) } @a) . "</td></tr>\n";
                }
            }
            push @K, "</tbody></table></div>\n";
        }
        push @K, @kextra;
    }
    my $css_s = css_for('notes', $m->{colour});
    my $css_k = css_for('notes-answers', $m->{colour});
    my $out_s = File::Spec->catfile($OUT, "$stem.html");
    my $out_k = File::Spec->catfile($OUT, "$kstem.html");
    spit($out_s, page("$m->{course} — $m->{title}: Guided Notes", $css_s, join "\n", @S));
    spit($out_k, page("$m->{course} — $m->{title}: Notes Answer Key", $css_k, join "\n", @K));
    return ($out_s, $out_k);
}

# ── Workbook ──────────────────────────────────────────────────────────────
sub render_workbook {
    my ($path) = @_;
    my ($m, $text) = front(slurp($path));
    my $stem = basename($path, '.md');
    (my $kstem = $stem) =~ s/-workbook-v(\d+)$/-workbook-answers-v$1/;
    my (@S, @K, @core, @stretch);
    push @S, qq{<!-- ══ COVER ══ -->\n<div class="cover">\n  <div class="page">\n    <div class="cover-grid">\n      <div>\n        <h1>} . esc("$m->{course} — $m->{title}") . qq{</h1>\n        <h2>Practice Workbook</h2>\n        <div class="sub">Questions are mixed on purpose. Figuring out what each question is asking is part of the learning.</div>\n        <div class="lo">Learning Outcome: } . esc($m->{lo}) . qq{</div>\n      </div>\n      <div class="cover-fields">\n        <div class="cover-field">\n          <label>Name</label>\n          <div class="field-line"></div>\n        </div>\n        <div class="cover-field">\n          <label>Date started</label>\n          <div class="field-line"></div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n\n<div class="page">\n};
    push @S, qq{<div class="instr-box">\n  <h3>How this workbook works</h3>\n  <p>Questions from across the unit are mixed together on purpose. Your job is to figure out what each question is asking before you answer it. That thinking is where the learning happens.</p>\n  <div class="star-legend">\n    <div class="sl-item"><span class="badge badge-core">★ Core</span> For everyone. Try these first.</div>\n    <div class="sl-item"><span class="badge badge-ext">★★ Extended</span> More challenging. Try after Core, or as a challenge.</div>\n  </div>\n  <p style="margin-top:0.6rem">Show your thinking. A correct answer with no explanation earns part marks on Extended questions.</p>\n</div>\n};
    push @S, qq{<div class="meta-block">\n  <h4>Before you begin — forethought</h4>\n  <p>Look over the first six questions. Which one do you think will be hardest for you? Write the question number and why.</p>\n  <p>Hardest question: Q _____ &nbsp;&nbsp;&nbsp;&nbsp; Why: <span class="fill fill-lg">&nbsp;</span></p>\n</div>\n};
    my $stretch_started = 0;
    for my $sec (sections($text)) {
        my ($h, $lines) = @$sec;
        if ($h =~ /^CHECKIN/) {
            push @S, qq{<div class="meta-block">\n  <h4>Halfway check-in</h4>\n  <p>Look back at the questions so far. Which one are you least sure about? Q <span class="fill fill-sm">&nbsp;</span></p>\n  <p>What will you do about it: re-read the notes section, ask a partner, or ask the teacher?</p>\n  <div class="resp"><div class="resp-line"></div></div>\n</div>\n};
            next;
        }
        $h =~ /^(S?\d+)\s+(core|ext|stretch)\s*(?:\|\s*(.*))?$/ or die "$path: bad question heading '$h'\n";
        my ($num, $lvl, $ctx) = ($1, $2, $3 // '');
        if ($lvl eq 'stretch' && !$stretch_started++) {
            push @S, qq{<h2 class="section-title" style="margin-top:2rem">Challenge Zone</h2>\n<p style="font-size:0.9rem">Try these after the core and extended questions. Each one asks you to pull ideas from more than one part of the unit.</p>\n};
        }
        my $badge = $lvl eq 'core' ? '<span class="badge badge-core">★ Core</span>' : $lvl eq 'ext' ? '<span class="badge badge-ext">★★ Extended</span>' : '<span class="badge badge-ext">★★</span>';
        my $cls = $lvl eq 'core' ? 'question' : $lvl eq 'ext' ? 'question ext' : 'question stretch';
        my (@qa, $body_s, $body_k);
        my @parts;
        for my $b (blocks_of(@$lines)) {
            if (!ref $b) { push @parts, ['p', $b]; next; }
            push @parts, $b;
        }
        my (@s, @k, @buf);
        my $flush = sub {
            return unless @buf;
            push @s, prose([@buf], 0, { line_cls => 'resp-line', ol_class => 'q-parts' });
            prose([@buf], 1, { qa => \@qa, skip_answers => 1 });
            @buf = ();
        };
        for my $p (@parts) {
            if ($p->[0] eq 'p') { push @buf, $p->[1]; next; }
            $flush->();
            my ($kind, $arg, $in) = @$p;
            if    ($kind eq 'wordbank') { push @s, '<div class="word-bank"><span class="word-bank-label">Word bank</span> <span class="word-bank-terms">' . inline(join(' ', @$in), 0) . '</span></div>'; }
            elsif ($kind eq 'quote')    { push @s, '<div class="quote-block">' . inline(join(' ', @$in), 0) . '</div>'; }
            elsif ($kind eq 'html')     { push @s, '<div class="diagram">' . raw_html($in, 0) . '</div>'; }
            else { die "$path: unknown block '$kind' in Q$num\n"; }
        }
        $flush->();
        push @S, "<!-- Q$num $lvl — " . esc($ctx) . qq{ -->\n<div class="$cls">\n  <div class="q-header"><span class="q-num">$num</span>$badge</div>\n  <div class="q-body">\n} . join("\n", @s) . "\n  </div>\n</div>\n";
        my $card = $lvl eq 'core' ? 'q-card' : 'q-card extended';
        my $kb = $lvl eq 'core' ? '<span class="badge badge-core">★ Core</span>' : '<span class="badge badge-ext">★★ Extended</span>';
        my $entry = qq{<div class="$card">\n  <div class="q-header"><span class="q-num">Q$num</span>$kb</div>\n  <div class="q-context">} . ($ctx ? 'Opens after ' . inline($ctx, 1) : '') . qq{</div>\n  <div class="answer"><span class="a-label">Answer</span>} . join('<br>', map { inline($_, 1) } @qa) . "</div>\n</div>\n";
        if ($lvl eq 'stretch') { push @stretch, $entry; } else { push @core, $entry; }
    }
    push @S, qq{<div class="meta-block">\n  <h4>After this session — self-reflection</h4>\n  <p>1. Which questions did you find hardest today? Q <span class="fill fill-md">&nbsp;</span></p>\n  <p>2. Was it hard because you <em>didn't know the idea</em> or because <em>the question asked it in a new way</em>? Circle one and explain:</p>\n  <div class="resp"><div class="resp-line"></div></div>\n  <p>3. What is one thing you will do before the next workbook session?</p>\n  <div class="resp"><div class="resp-line"></div></div>\n  <p>4. Rate your understanding of your toughest idea today: <strong>1</strong> (lost) — <strong>2</strong> (partly) — <strong>3</strong> (got it) — <strong>4</strong> (could teach it)</p>\n  <p>My rating: <span class="fill fill-sm">&nbsp;</span> &nbsp; One piece of evidence: <span class="fill fill-lg">&nbsp;</span></p>\n</div>\n};
    my $rub = ref $m->{rubric} ? $m->{rubric} : [];
    push @S, qq{<div class="rubric">\n  <div class="rubric-header">\n    <h3>Self-Assessment Rubric</h3>\n    <p>Complete after your last workbook session. Use it to decide what to review before the unit test.</p>\n  </div>\n  <table>\n    <tr><th style="width:55%">Big idea</th><th>I can explain this without notes</th><th>One question I still have</th></tr>\n}
        . join('', map { '    <tr><td>' . inline($_, 0) . qq{</td><td class="rating">Yes / Getting there / Not yet</td><td></td></tr>\n} } @$rub) . "  </table>\n</div>\n\n</div>\n";

    push @K, key_cover($m, 'Practice Workbook — Answer Key');
    push @K, qq{<div class="overview-box">\n  <p><strong>Model answers and marking notes for every question.</strong> Each card says which notes section must be taught before the question opens. The student copy shows no section labels: announce which questions are open each session.</p>\n  <p>For opinion and judgement questions, the model answer is one strong example. Accept any position backed by accurate evidence from the unit.</p>\n</div>\n};
    push @K, qq{<hr class="section-break">\n<h2 class="section-title">Part A — Core and Extended Questions</h2>\n}, @core;
    push @K, qq{<hr class="section-break">\n<h2 class="section-title">Part B — Challenge Zone</h2>\n}, @stretch if @stretch;
    my $out_s = File::Spec->catfile($OUT, "$stem.html");
    my $out_k = File::Spec->catfile($OUT, "$kstem.html");
    # The workbook styles call blanks "fill", not "b".
    my $student = join "\n", @S;
    $student =~ s/class="b b-(?:md|sm)"/class="fill fill-md"/g;
    $student =~ s/class="b b-(?:lg|xl)"/class="fill fill-lg"/g;
    spit($out_s, page("$m->{course} — $m->{title}: Practice Workbook", css_for('workbook', $m->{colour}), $student));
    spit($out_k, page("$m->{course} — $m->{title}: Workbook Answer Key", css_for('workbook-answers', $m->{colour}), join "\n", @K));
    return ($out_s, $out_k);
}

# ── Teacher guide ─────────────────────────────────────────────────────────
sub render_guide {
    my ($path) = @_;
    my ($m, $text) = front(slurp($path));
    my $stem = basename($path, '.md');
    my @B;
    push @B, qq{<div class="teacher-header">\n  <span class="teacher-badge">Teacher Guide</span>\n  <h1>} . esc($m->{title}) . qq{</h1>\n  <p class="subtitle">} . esc($m->{course}) . ' &nbsp;·&nbsp; ' . esc($m->{subtitle} // '') . "</p>\n</div>\n";
    my %PILL = (SHOW => 'pill-show">Show', CUE => 'pill-cue">Cue', NOTES => 'pill-note">Notes');
    for my $sec (sections($text)) {
        my ($h, $lines) = @$sec;
        push @B, '<h2 class="section-heading">' . inline($h, 1) . "</h2>\n" if $h ne '';
        my ($in_week, $in_card) = (0, 0);
        my @buf;
        my $flush = sub { if (@buf) { my $x = prose([@buf], 1); $x =~ s/<div class="vocab-wrap"><table>/<div class="vocab-wrap"><table class="guide-table">/g; push @B, $x . "\n"; @buf = (); } };
        my $close_card = sub { if ($in_card) { push @B, "</div><!-- /lesson-card -->\n"; $in_card = 0; } };
        my $close_week = sub { $close_card->(); if ($in_week) { push @B, "</div><!-- /week-block -->\n"; $in_week = 0; } };
        for my $b (blocks_of(@$lines)) {
            if (ref $b) {
                $flush->();
                my ($kind, $arg, $in) = @$b;
                if    ($kind eq 'overview')   { push @B, qq{<div class="overview-box">\n} . prose($in, 1) . "\n</div>\n"; }
                elsif ($kind eq 'assessment') { push @B, qq{<div class="assessment-box">\n} . prose($in, 1) . "\n</div>\n"; }
                elsif ($kind eq 'closing')    { push @B, qq{<div class="closing-note">\n} . prose($in, 1) . "\n</div>\n"; }
                elsif ($kind eq 'lab')        { push @B, qq{<div class="lab-box">\n<h4>} . inline($arg, 1) . "</h4>\n" . prose($in, 1) . "\n</div>\n"; }
                else { die "$path: unknown block '$kind'\n"; }
                next;
            }
            if ($b =~ /^###\s+(.*?)\s*(\(([^)]*)\))?\s*$/) {
                $flush->(); $close_week->();
                push @B, qq{<div class="week-block">\n<div class="week-header">} . inline($1, 1) . ($3 ? qq{ <span class="class-count">($3)</span>} : '') . "</div>\n";
                $in_week = 1;
            }
            elsif ($b =~ /^####\s+(.*)$/) { $flush->(); $close_card->(); push @B, qq{<div class="lesson-card">\n<div class="lesson-title">} . inline($1, 1) . "</div>\n"; $in_card = 1; }
            elsif ($in_card && $b =~ /^(SHOW|SAY|CUE|NOTES):\s*(.*)$/) {
                push @B, $1 eq 'SAY' ? '<div class="step-line say-line">Say <em>' . inline($2, 1) . "</em></div>\n"
                                     : qq{<div class="step-line"><span class="pill $PILL{$1}</span> } . inline($2, 1) . "</div>\n";
            }
            else { push @buf, $b; }
        }
        $flush->(); $close_week->();
    }
    my $out = File::Spec->catfile($OUT, "$stem.html");
    spit($out, page("$m->{course} — $m->{title}: Teacher Guide", css_for('teacherguide', $m->{colour}), join "\n", @B));
    return ($out);
}

my @files = @ARGV ? @ARGV : (
    glob("$ROOT/notes-packages/grade-*-social/*/*-notes-v1.md"),
    glob("$ROOT/worksheets/grade-*-social/*/*-workbook-v1.md"),
    glob("$ROOT/lesson-plans/grade-*-social/*/*-teacherguide-v1.md"),
);
for my $f (@files) {
    next if $f =~ /-answers-/;
    # Social 8 and 9 renders were built another way; only sources in this format are rendered.
    next unless slurp($f) =~ /\A---\r?\n/;
    my @out = $f =~ /-notes-v\d+\.md$/ ? render_notes($f)
            : $f =~ /-workbook-v\d+\.md$/ ? render_workbook($f)
            : $f =~ /-teacherguide-v\d+\.md$/ ? render_guide($f)
            : die "$f: not a notes, workbook or teacher guide source\n";
    print File::Spec->abs2rel($_, $ROOT), "\n" for @out;
}
