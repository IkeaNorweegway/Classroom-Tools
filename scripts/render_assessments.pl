#!/usr/bin/env perl
# Render exit tickets, quizzes and unit tests (markdown) to printable HTML.
#
# Perl port of render_assessments.py: same rules, same output. Perl runs
# here (Git Bash) and Python does not.
#
# Sources:  tests-quizzes/**/*-exits-v1.md, *-quiz-v1.md, and the
#           unreleased *-test-* and *-answers-* files (only with --out).
# Output:   public/materials/<same name>.html  (flat, like the course's other files)
#
# Run from the repo root:
#   perl scripts/render_assessments.pl                          # every released source
#   perl scripts/render_assessments.pl path/to/file.md ...      # just these
#   perl scripts/render_assessments.pl --out DIR path/to/file.md
#     Unit tests and answer keys are unreleased. They are skipped unless --out
#     names a folder outside the repo, so they never land in public/materials/.
#
# Handles: "# Title" (page title), "## Heading" (one section per ticket or part),
# "**LO 1:** ..." lines, "**N.** question" lines, *italic*, **bold**, answer
# lines made of underscores, and "---" dividers. HTML comments are dropped.
# Anything else becomes a plain paragraph.
use strict;
use warnings;
use utf8;
use open qw(:std :encoding(UTF-8));
use Cwd qw(abs_path getcwd);
use File::Basename qw(dirname basename);
use File::Path qw(make_path);
use File::Spec;

my $SCRIPT = abs_path($0);
my $ROOT   = dirname(dirname($SCRIPT));
my $OUT    = File::Spec->catdir($ROOT, 'public', 'materials');

my @SOURCES = (
    'tests-quizzes/*/*/*-exits-v1.md',
    'tests-quizzes/*/*/*-quiz-v1.md',
);

# Accent for the page header: course colour, same family as the home practice sheets.
my %ACCENT = (
    sci6  => '#1d7486',
    sci7  => '#2e7d55',
    soc7  => '#4a6680',
    soc8  => '#8a4a78',
    soc9  => '#a6452f',
    math9 => '#4f46e5',
);

my $CSS = <<'CSS';
body { font-family: Georgia, 'Times New Roman', serif; font-size: 15px; line-height: 1.7;
       color: #1e293b; max-width: 820px; margin: 0 auto; padding: 2rem 1.5rem; background: #fff; }
h1 { font-family: system-ui, sans-serif; font-size: 1.6rem; color: #0f172a; margin-bottom: 0.25rem; }
.sub { font-family: system-ui, sans-serif; font-size: 0.85rem; color: #64748b; margin-bottom: 1.5rem; }
h2 { font-family: system-ui, sans-serif; font-size: 1rem; font-weight: 700; color: #fff;
     background: var(--accent); padding: 0.5rem 0.9rem; border-radius: 0.35rem; margin: 2rem 0 0.75rem; }
.lo { font-family: system-ui, sans-serif; font-size: 0.88rem; background: #f1f5f9;
      border-left: 4px solid var(--accent); padding: 0.5rem 0.8rem; margin: 0.5rem 0 1rem; }
.q { margin: 1rem 0 0.25rem; }
.ans { border-bottom: 1.5px solid #94a3b8; height: 1.8rem; margin: 0.3rem 0; }
hr { border: none; border-top: 1px dashed #cbd5e1; margin: 1.5rem 0; }
@media print { body { padding: 0; } h2 { break-before: auto; } .ticket { break-inside: avoid; } }
CSS

# Escape &, < and > (same as Python's html.escape with quote=False).
sub esc {
    my ($s) = @_;
    $s =~ s/&/&amp;/g;
    $s =~ s/</&lt;/g;
    $s =~ s/>/&gt;/g;
    return $s;
}

# Escape, then turn **bold** and *italic* into tags.
sub inline {
    my ($text) = @_;
    my $s = esc($text);
    $s =~ s/\*\*(.+?)\*\*/<strong>$1<\/strong>/g;
    $s =~ s/\*(.+?)\*/<em>$1<\/em>/g;
    return $s;
}

sub trim {
    my ($s) = @_;
    $s =~ s/^\s+//;
    $s =~ s/\s+$//;
    return $s;
}

sub render {
    my ($md, $key) = @_;
    my $accent = exists $ACCENT{$key} ? $ACCENT{$key} : '#334155';

    (my $text = $md) =~ s/<!--.*?-->//gs;

    my $title      = '';
    my @body;
    my $in_section = 0;

    for my $raw (split /\n/, $text) {
        my $line = trim($raw);
        next if $line eq '';

        if ($line =~ /^# /) {
            $title = trim(substr($line, 2));
        } elsif ($line =~ /^## /) {
            push @body, '</div>' if $in_section;
            push @body, '<div class="ticket"><h2>' . inline(trim(substr($line, 3))) . '</h2>';
            $in_section = 1;
        } elsif ($line eq '---') {
            push @body, '<hr>';
        } elsif ($line =~ /^\*\*LO\b/) {
            push @body, '<p class="lo">' . inline($line) . '</p>';
        } elsif ($line =~ /^\*\*\d+\.\*\*/) {
            push @body, '<p class="q">' . inline($line) . '</p>';
        } elsif ($line =~ /^_{5,}$/ || $line =~ /^[_\s]+$/) {
            push @body, '<div class="ans"></div>';
        } else {
            push @body, '<p>' . inline($line) . '</p>';
        }
    }
    push @body, '</div>' if $in_section;

    my $t = esc($title);
    return <<"HTML";
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>$t</title>
<style>:root { --accent: $accent; }
$CSS</style>
</head>
<body>
<h1>$t</h1>
@{[ join("\n", @body) ]}
</body>
</html>
HTML
}

sub sources {
    my (@args) = @_;
    return map { File::Spec->rel2abs($_) } @args if @args;

    chdir $ROOT or die "cannot chdir to $ROOT: $!\n";
    my @found;
    for my $pattern (@SOURCES) {
        push @found, map { File::Spec->rel2abs($_) } glob($pattern);
    }
    return sort @found;
}

sub main {
    my @args;
    my $out_arg;
    while (@ARGV) {
        my $a = shift @ARGV;
        if ($a eq '--out') {
            $out_arg = shift @ARGV;
            die "--out needs a folder\n" unless defined $out_arg;
        } else {
            push @args, $a;
        }
    }

    my $out = $OUT;
    if (defined $out_arg) {
        make_path($out_arg);
        $out = abs_path($out_arg);
    }
    my $released_dir = abs_path($OUT) // $OUT;

    for my $src (sources(@args)) {
        my $name       = basename($src);
        my $unreleased = ($name =~ /-test-/ || $name =~ /-answers-/) ? 1 : 0;
        if ($unreleased && $out eq $released_dir) {
            my $rel = File::Spec->abs2rel($src, $ROOT);
            print "skipped (unreleased, pass --out): $rel\n";
            next;
        }

        # File names are sci6-matter-exits-v1.md, so the first part is the course key.
        my $key = (split /-/, $name)[0];
        (my $stem = $name) =~ s/\.md$//;
        my $target = File::Spec->catfile($out, "$stem.html");

        open my $in, '<:encoding(UTF-8)', $src or die "cannot read $src: $!\n";
        my $md = do { local $/; <$in> };
        close $in;

        open my $fh, '>:encoding(UTF-8)', $target or die "cannot write $target: $!\n";
        print {$fh} render($md, $key);
        close $fh;

        my $rel = File::Spec->abs2rel($src, $ROOT);
        print "$rel -> $target\n";
    }
}

main();
