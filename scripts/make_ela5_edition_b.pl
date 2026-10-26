#!/usr/bin/env perl
# Write the Edition B (scaffolded) source for a Grade 5 ELA anchor-notes,
# notebook or cold-read source written as Edition A.
#
#   perl scripts/make_ela5_edition_b.pl worksheets/grade-5-ela/<unit>/ela5-<unit>-notebook-v1.md
#   -> worksheets/grade-5-ela/<unit>/ela5-<unit>-notebook-scaffolded-v1.md (overwritten)
#
# What it adds (Edition B keeps the texts, questions and numbering of A):
#   %% frame: text      -> a "Sentence starters" box at that spot
#   %% words: a, b, c   -> a word box at that spot
#   anchor notes (kind: notes): a word box per page from that page's [[answers]],
#                       placed after the learning target, unless the page has %% nowords
#   notebook: in every chart with 2+ answer rows, the first row
#                       is filled in as a model and marked ✎
#   cold reads: a generic evidence frame under every question that has
#                       answer lines and no %% frame of its own
# The B file is generated: edit A (and its %% hints), then re-run this.
use strict;
use warnings;
use utf8;
use open qw(:std :encoding(UTF-8));

our $CER = 'I think ___ . In paragraph ___ , the text says "___ ." This shows ___ .';

for my $path (@ARGV) {
    open my $fh, '<', $path or die "$path: $!"; local $/; my $s = <$fh>; close $fh;
    $s =~ s/\r\n/\n/g;
    my ($fm, $body) = $s =~ /^(---\n.*?\n---\n)(.*)$/s or die "$path: no front matter\n";
    my ($kind) = $fm =~ /^kind:\s*(\S+)/m; $kind //= '';
    $fm =~ s/^edition: A/edition: B/m;
    $fm =~ s/^key: yes/key: no/m;

    # Poems are cited by stanza, not paragraph.
    local $CER = $CER;
    $CER =~ s/In paragraph ___ , the text says/In stanza ___ , the poem says/ if $body =~ /^::: poem/m;
    $CER =~ s/In paragraph ___ , the text says/In the line where ___ speaks, the script says/ if $body =~ /^::: script/m;
    my @pages = split /\n---page---\n/, $body, -1;
    for my $pg (@pages) {
        # Word box per anchor-notes page.
        if ($kind eq 'notes' && $pg !~ /^%% nowords/m) {
            my %seen; my @w = grep { !$seen{lc $_}++ } map { my $x = $_; $x =~ s{ / .*}{}; $x } $pg =~ /\[\[(.+?)\]\]/g;
            if (@w) {
                my $wb = "::: wordbank\n" . join("\n", sort { lc $a cmp lc $b } @w) . "\n:::\n";
                $pg =~ s/(\*\*Learning target:\*\*[^\n]*\n)/$1\n$wb/ or $pg = "$wb\n$pg";
            }
        }
        # Model row in charts (notebook, cold reads).
        if ($kind eq 'notebook') {
            my @l = split /\n/, $pg, -1;
            my $i = 0;
            while ($i < @l) {
                if ($l[$i] =~ /^\|/) {
                    my $j = $i; $j++ while $j < @l && $l[$j] =~ /^\|/;
                    my @data = grep { $l[$_] !~ /^\|\s*:?-{2,}/ } ($i + 1 .. $j - 1);
                    my @ans = grep { $l[$_] =~ /\[\[/ } @data;
                    if (@ans >= 2) { my $k = $ans[0]; $l[$k] =~ s/\[\[(.+?)\]\]/$1/g; $l[$k] =~ s/^\| /| ✎ /; }
                    $i = $j;
                } else { $i++; }
            }
            $pg = join "\n", @l;
        }
        # Generic frame under cold-read questions.
        if ($kind eq 'coldread') {
            $pg =~ s/(\n\*\*\d+\.\*\*[^\n]*\n\n)(?!%% frame)(\(lines)/$1%% frame: $CER\n\n$2/g;
        }
        # Hints -> blocks.
        $pg =~ s/^%% frame:\s*(.*)$/::: frame\n$1\n:::/mg;
        $pg =~ s/^%% words:\s*(.*)$/"::: wordbank\n" . join("\n", split m{\s*,\s*}, $1) . "\n:::"/mge;
        $pg =~ s/^%%.*\n?//mg;
    }
    $body = join "\n---page---\n", @pages;
    my $note = $kind eq 'notebook'
        ? "::: note How this edition works\nCharts start with a filled-in model row (✎). Word boxes and sentence starters help you begin: cross out a starter once you don't need it.\n:::\n\n"
        : "::: note How this edition works\nWord boxes and sentence starters help you begin your answers. Cross out a starter once you don't need it.\n:::\n\n";
    $body =~ s/^(\s*)/$1$note/ if $kind ne 'notes';
    (my $out = $path) =~ s/-v(\d+)\.md$/-scaffolded-v$1.md/;
    open my $o, '>', $out or die "$out: $!"; print $o $fm, $body; close $o;
    print "wrote $out\n";
}
