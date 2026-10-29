#!/usr/bin/env perl
# Render home practice sheets (markdown) for the parent pages to printable HTML.
#
# Perl port of render_home_practice.py: same format, same output. Perl runs
# here (Git Bash) and Python does not.
#
# Sources and output, by course (front matter `course:`, default math9):
#   math9:   worksheets/math-9/home/<topic>/*.md  ->  public/materials/math-9/home/<topic>/
#   math8:   worksheets/math-8/home/<topic>/*.md  ->  public/materials/math-8/home/<topic>/ (strand colours, as Math 9)
#   others:  worksheets/<course folder>/<unit>/*-home-*.md and steam/grade-N/home/*.md
#            ->  public/materials/ (flat, like the course's other materials)
#
# Run from the repo root:
#   perl scripts/render_home_practice.pl                       # every sheet
#   perl scripts/render_home_practice.pl path/to/sheet.md ...  # just these
#
# Optional front matter `notes:` (a notes viewer path, as in the site URL after
# /Classroom-Tools/) and `sections:` (ids such as s2, s3) add a line under the
# header linking to those sections of the class notes. On a key, point `notes:`
# at the notes answer key and the line says "filled-in class notes". The notes
# HTML must be in public/materials and have those ids, or the render stops.
#
# After rendering, run scripts/stack_fractions.py on the Math 8 and Math 9 output.
#
# The format is the one in templates/home-practice-template.md. Keep the two
# scripts in step: a change to one belongs in the other.
use strict;
use warnings;
use utf8;
use open qw(:std :encoding(UTF-8));
use Cwd qw(abs_path);
use File::Basename qw(dirname basename);
use File::Path qw(make_path);
use File::Spec;
use File::Find qw(find);
use File::Glob qw(:bsd_glob);   # glob() must not split "Classroom tools" at the space

my $ROOT = dirname(dirname(abs_path($0)));
my $MATERIALS = File::Spec->catdir($ROOT, 'public', 'materials');

my %STRAND = (
    'number'                 => ['Number',                   '#1d4ed8', '#eff6ff', '#3b82f6'],
    'algebra'                => ['Algebra',                  '#7c3aed', '#f5f3ff', '#8b5cf6'],
    'measurement-geometry'   => ['Measurement & Geometry',   '#16a34a', '#f0fdf4', '#22c55e'],
    'statistics-probability' => ['Statistics & Probability', '#0d9488', '#f0fdfa', '#14b8a6'],
);

# (header label, accent, light, mid). Accents match src/styles/global.css.
my %COURSE = (
    'science'  => ['Grade 6 Science',        '#1d7486', '#e8f2f4', '#4f9aa8'],
    'science7' => ['Grade 7 Science',        '#2e7d55', '#e9f3ed', '#5fa37f'],
    'social7'  => ['Grade 7 Social Studies', '#4a6680', '#ecf1f5', '#7f97ad'],
    'social8'  => ['Grade 8 Social Studies', '#8a4a78', '#f4eaf1', '#b07aa2'],
    'social9'  => ['Grade 9 Social Studies', '#a6452f', '#f7ebe7', '#c97a66'],
    'steam'    => ['STEAM',                  '#6650c2', '#efecf9', '#9483d8'],
    'ela5'     => ['Grade 5 English Language Arts', '#b4235a', '#fbeaf0', '#d0688d'],
);

my $SITE_BASE = '/Classroom-Tools/';   # the site's base path (astro.config.mjs)

my %BOX_LABEL = (example => 'Worked example', tip => '', check => 'Check yourself', answer => '');

my $CSS = <<'CSS';
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 11pt; line-height: 1.55; color: #1e293b; background: #fff; max-width: 780px; margin: 0 auto; padding: 28px 32px 48px; }
    h1 { font-size: 20pt; font-weight: 700; color: #1e293b; margin-bottom: 2px; }
    h2 { font-size: 13pt; font-weight: 700; color: var(--accent); margin: 18px 0 8px; border-bottom: 2px solid var(--accent-light); padding-bottom: 3px; }
    p { margin-bottom: 6px; }
    ul, ol { margin: 4px 0 8px 22px; }
    li { margin-bottom: 3px; }
    strong { font-weight: 700; }
    em { font-style: italic; color: #475569; }
    .b { display: inline-block; border-bottom: 1.5px solid #334155; width: 90px; vertical-align: bottom; }
    .al { display: block; border-bottom: 1px solid #cbd5e1; height: 1.7rem; }
    .work { margin: 4px 0 2px; }
    .header-strip { border-left: 5px solid var(--accent); padding: 10px 16px; margin-bottom: 14px; background: var(--accent-light); border-radius: 0 8px 8px 0; }
    .header-strip .course-label { font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--accent); margin-bottom: 4px; }
    .header-strip .meta { font-size: 9.5pt; color: #64748b; }
    .header-strip .notes-link { font-size: 9.5pt; color: #64748b; margin: 2px 0 0; }
    .notes-link a { color: var(--accent); font-weight: 600; }
    .name-row { display: flex; gap: 24px; margin: 8px 0 14px; font-size: 10.5pt; align-items: baseline; }
    .name-row span { color: #64748b; white-space: nowrap; }
    .name-row .b { flex: 1; width: auto; }
    .qgrid { display: grid; grid-template-columns: 1fr 1fr; column-gap: 28px; }
    .question { padding: 6px 0 4px; break-inside: avoid; }
    .question ul { list-style: none; margin-left: 0; }
    .question li { margin-bottom: 1px; }
    @media (max-width: 560px) { .qgrid { grid-template-columns: 1fr; } }
    .box { border-radius: 8px; padding: 10px 14px; margin: 8px 0 10px; break-inside: avoid; }
    .box .label { font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 4px; }
    .box-example { background: var(--accent-light); border: 1px solid var(--accent-mid); }
    .box-example .label { color: var(--accent); }
    .box-tip { background: #fffbeb; border: 1px solid #fde68a; font-size: 10pt; }
    .box-check { background: #f0fdf4; border: 1px solid #bbf7d0; }
    .box-check .label { color: #16a34a; }
    .box-answer { background: #f8fafc; border: 1px solid #e2e8f0; }
    @page { size: letter; margin: 11mm 13mm; }
    @media print {
      body { padding: 0; font-size: 10pt; line-height: 1.45; }
      .header-strip { padding: 7px 14px; margin-bottom: 8px; }
      h1 { font-size: 17pt; }
      h2 { margin: 10px 0 5px; }
      .name-row { margin: 4px 0 8px; }
      .box { padding: 7px 12px; margin: 5px 0 7px; }
      .question { padding: 4px 0 2px; }
      .al { height: 1.3rem; }
      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      h2 { break-after: avoid; }
    }
CSS

sub esc { my ($s) = @_; $s =~ s/&/&amp;/g; $s =~ s/</&lt;/g; $s =~ s/>/&gt;/g; return $s; }
sub escq { my ($s) = @_; $s = esc($s); $s =~ s/"/&quot;/g; $s =~ s/'/&#x27;/g; return $s; }

my %NOTES_FILES;   # notes file name -> paths under public/materials
my %ENT = (nbsp => ' ', amp => '&', lt => '<', gt => '>', quot => '"', apos => "'", rsquo => "\x{2019}", lsquo => "\x{2018}",
           rdquo => "\x{201d}", ldquo => "\x{201c}", mdash => "\x{2014}", ndash => "\x{2013}", middot => "\x{b7}");
sub decode_ent {
    my ($s) = @_;
    $s =~ s/&(?:#x([0-9a-f]+)|#(\d+)|(\w+));/defined $1 ? chr(hex $1) : defined $2 ? chr($2) : ($ENT{lc $3} \/\/ "&$3;")/gie;
    return $s;
}

# The "See the class notes" line, linking to sections of the unit's notes.
sub notes_line {
    my ($meta, $path) = @_;
    my $view = $meta->{notes} // '';
    $view =~ s{^[\s/]+|[\s/]+$}{}g;
    return '' if $view eq '';
    (my $name = $view) =~ s{.*/}{};
    my $base = basename($path);
    find(sub { push @{ $NOTES_FILES{ substr($_, 0, -5) } }, $File::Find::name if /notes.*\.html\z/ }, $MATERIALS) unless %NOTES_FILES;
    my $found = $NOTES_FILES{$name} // [];
    die "$base: notes $name.html found " . scalar(@$found) . " times in public/materials\n" if @$found != 1;
    open my $fh, '<', $found->[0] or die "$found->[0]: $!";
    my $text = do { local $/; <$fh> };
    close $fh;
    my %heads;
    $heads{$1} = $2 while $text =~ /<h2 id="([su]\d+)"[^>]*>(.*?)<\/h2>/gs;
    my @ids = ($meta->{sections} // '') =~ /([su]\d+)/g;
    die "$base: notes given but no sections\n" unless @ids;
    my @links;
    for my $sid (@ids) {
        die "$base: $name has no section $sid\n" unless exists $heads{$sid};
        (my $t = $heads{$sid}) =~ s/<[^>]+>//g;
        $t = decode_ent($t);
        $t =~ s/[\s\x{a0}]+/ /g;
        $t =~ s/^ | $//g;
        # "Section 2 · Sign rules", "2 · Fact", "Part 1: Energy" -> "Section 2: Sign rules"
        $t = ($1 // 'Section') . " $2: $3" if $t =~ /^(?:(Section|Concept|Part|Unit)\s+)?(\d+)(?:\s*[:\x{2014}\x{2013}\x{b7}.-]\s*|\s+)(.*)$/i;
        push @links, qq{<a href="$SITE_BASE} . escq($view) . qq{#$sid" target="_top">} . escq($t) . '</a>';
    }
    my $what = $name =~ /-answers/ ? 'filled-in class notes' : 'class notes';
    return qq{\n    <p class="notes-link">Need a reminder? See the $what: } . join(" \x{b7} ", @links) . '</p>';
}

sub inline {
    my ($s) = @_;
    $s = esc($s);
    $s =~ s/\*\*(.+?)\*\*/<strong>$1<\/strong>/g;
    $s =~ s/(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])/<em>$1<\/em>/g;
    $s =~ s/_{3,}/<span class="b"><\/span>/g;
    $s =~ s/( {2,})/'&emsp;' x int(length($1) \/ 2)/ge;
    return $s;
}

sub blocks {
    my (@lines) = @_;
    my (@out, @para, @items, $kind);
    my $flush = sub {
        if (@para) { push @out, '<p>' . join('<br>', map { inline($_) } @para) . '</p>'; @para = (); }
        if (@items) { push @out, "<$kind>" . join('', map { '<li>' . inline($_) . '</li>' } @items) . "</$kind>"; @items = (); $kind = undef; }
    };
    for my $line (@lines) {
        (my $s = $line) =~ s/^\s+|\s+$//g;
        if ($s eq '') { $flush->(); }
        elsif ($s =~ /^\(work(?: (\d))?\)$/) { $flush->(); push @out, '<div class="work">' . ('<span class="al"></span>' x ($1 // 4)) . '</div>'; }
        elsif ($s =~ /^([-*]|\d+\.) (.*)$/) {
            my ($mark, $item) = ($1, $2);
            my $want = $mark =~ /\d/ ? 'ol' : 'ul';
            $flush->() if @para || ($kind && $kind ne $want);
            $kind = $want; push @items, $item;
        }
        else { $flush->() if @items; push @para, $s; }
    }
    $flush->();
    return @out;
}

sub body_html {
    my ($text) = @_;
    $text =~ s/<!--.*?-->//gs;
    my (@out, @run);
    my ($in_q, $in_grid) = (0, 0);
    my @lines = split /\n/, $text, -1;
    my $end_run = sub { push @out, blocks(@run); @run = (); };
    my $end_question = sub { $end_run->(); if ($in_q) { push @out, '</div>'; $in_q = 0; } };
    my $end_grid = sub { $end_question->(); if ($in_grid) { push @out, '</div>'; $in_grid = 0; } };
    while (@lines) {
        my $line = shift @lines;
        (my $s = $line) =~ s/^\s+|\s+$//g;
        if ($s =~ /^:::\s*(\w+)\s*$/) {
            my $kind = $1;
            $end_grid->();
            my @inner;
            while (@lines) { my $x = shift @lines; last if $x =~ /^\s*:::\s*$/; push @inner, $x; }
            my $label = $BOX_LABEL{$kind} // '';
            push @out, qq{<div class="box box-$kind">} . ($label ? qq{<p class="label">$label</p>} : '') . join('', blocks(@inner)) . '</div>';
        }
        elsif ($s =~ /^## (.*)$/) { $end_grid->(); push @out, '<h2>' . inline($1) . '</h2>'; }
        elsif ($s =~ /^\*\*\d+\.\*\*/) {
            $end_question->();
            if (!$in_grid) { push @out, '<div class="qgrid">'; $in_grid = 1; }
            push @out, '<div class="question">'; $in_q = 1;
            push @run, $s;
        }
        else { push @run, $line; }
    }
    $end_grid->();
    return join "\n", @out;
}

sub render {
    my ($path) = @_;
    open my $fh, '<', $path or die "$path: $!"; local $/; my $text = <$fh>; close $fh;
    $text =~ s/\r\n/\n/g;
    $text =~ s/\A---\n(.*?)\n---\n//s or die "$path: missing front matter\n";
    my %meta = map { /^(\w+):\s*(.*)$/ ? ($1 => $2) : () } split /\n/, $1;
    my $course = $meta{course} // 'math9';
    my ($course_label, $accent, $light, $mid, $doc_suffix, $out);
    my $stem = basename($path, '.md');
    if ($course eq 'math9' || $course eq 'math8') {
        my $g = $course eq 'math8' ? 8 : 9;
        my $st = $STRAND{ $meta{strand} } or die "$path: unknown strand\n";
        ($accent, $light, $mid) = @$st[1 .. 3];
        $course_label = "Grade $g Math · $st->[0]";
        $doc_suffix = "Grade $g Mathematics";
        $out = File::Spec->catfile($MATERIALS, "math-$g", 'home', $meta{topic}, "$stem.html");
    } else {
        my $c = $COURSE{$course} or die "$path: unknown course $course\n";
        ($accent, $light, $mid) = @$c[1 .. 3];
        $course_label = "$c->[0] · $meta{unit}";
        $doc_suffix = $c->[0];
        $out = File::Spec->catfile($MATERIALS, ($course eq 'ela5' ? ('grade-5-ela') : ()), "$stem.html");
    }
    my $answers = $stem =~ /-answers-/;
    my $title = $meta{title} . ($answers ? ' — Answers' : '');
    my $name_row = $answers ? '' : '<div class="name-row"><span>Name</span><span class="b"></span><span>Date</span><span class="b" style="flex:0 0 120px"></span></div>';
    my $time = $meta{time} // 'about 15 minutes';
    my $doc = qq{<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>} . escq($title) . ' — Home Practice | ' . escq($doc_suffix) . qq{</title>
  <style>
    :root { --accent: $accent; --accent-light: $light; --accent-mid: $mid; }
$CSS  </style>
</head>
<body>
  <div class="header-strip">
    <p class="course-label">} . escq($course_label) . qq{ · Home practice</p>
    <h1>} . escq($title) . qq{</h1>
    <p class="meta">One skill: } . escq($meta{skill}) . ' · ' . escq($time) . qq{</p>} . notes_line(\%meta, $path) . qq{
  </div>
  $name_row
} . body_html($text) . qq{
</body>
</html>
};
    # Grade 5 handwriting is larger: wider work lines, on screen and in print.
    $doc =~ s{</style>}{    .al { height: 12mm !important; }\n  </style>} if $course eq 'ela5';
    make_path(dirname($out));
    open my $o, '>', $out or die "$out: $!"; print $o $doc; close $o;
    return $out;
}

my @paths = @ARGV ? @ARGV : sort(glob("$ROOT/worksheets/math-9/home/*/*.md"), glob("$ROOT/worksheets/math-8/home/*/*.md"), glob("$ROOT/worksheets/*/*/*-home-*.md"), glob("$ROOT/steam/grade-*/home/*.md"));
print File::Spec->abs2rel(render($_), $ROOT), "\n" for @paths;
