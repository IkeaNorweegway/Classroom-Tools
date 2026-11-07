#!/usr/bin/perl
# Draw @viz lines (one per line, stdin) with Math8Viz; print each SVG, separated by a
# line "<!--viz-split-->". --key draws the answer-key version ([[answers]] shown).
# Used by scripts/add_notes_visuals.py for fragments whose body is @viz lines.
use strict;
use warnings;
use utf8;
use FindBin;
use lib $FindBin::Bin;
use Math8Viz;

binmode(STDIN,  ':encoding(UTF-8)');
binmode(STDOUT, ':encoding(UTF-8)');
binmode(STDERR, ':encoding(UTF-8)');
$Math8Viz::KEY = 1 if grep { $_ eq '--key' } @ARGV;

my @out;
while (my $line = <STDIN>) {
    chomp $line;
    next unless $line =~ /\S/;
    my ($svg) = Math8Viz::draw($line);
    push @out, $svg;
}
print join("\n<!--viz-split-->\n", @out), "\n";
