#!/usr/bin/env perl
# Link a student notes package to its answer key.
#
# Adds, on screen only (hidden in print):
#   - "Answer key →" under the title, to the top of the key
#   - "Check your answers for Section 3 →" at the end of each section,
#     to the same section of the key (file.html#s3, ids from add_section_ids.py)
#
# The key is found beside the notes file:
#   <stem>-answers-vN.html, a later key version, or the key of the plain
#   edition for -ef, -scaffolded and -gr6 copies. French (-fr) notes, teacher
#   notes and notes with no key are left alone. A section gets a check link
#   only if the key has the same section id.
#
# Links are relative (math8-integers-notes-answers-v1.html#s2), so they work
# when the file is opened on its own. The site's viewer pages turn them into
# viewer links that open in the whole window.
#
# Safe to re-run: old links are removed first. render_math8.pl,
# render_ela5.pl and render_social.pl run this on the notes they write.
#
# Usage: perl scripts/add_key_links.pl [--dry-run] [FILE...]
# No files: every student *notes*.html under public/materials/.
use strict;
use warnings;
use utf8;
use open qw(:std :encoding(UTF-8));
use Cwd qw(abs_path);
use File::Basename qw(dirname basename);
use File::Find qw(find);

my $ROOT = dirname(dirname(abs_path($0)));
my $dry = @ARGV && $ARGV[0] eq '--dry-run' ? shift @ARGV : 0;

my $CSS = <<'CSS';
<style id="key-link-css">
  .key-link { margin: 6px 0 14px; font-size: 0.9rem; font-weight: 600; }
  .key-link a { color: inherit; text-decoration: underline; text-underline-offset: 2px; opacity: 0.85; }
  .key-link a:hover { opacity: 1; }
  .key-check { text-align: right; margin: 14px 0 6px; }
  @media print { .key-link { display: none !important; } }
</style>
CSS

sub slurp { my ($p) = @_; open my $fh, '<', $p or die "$p: $!"; local $/; my $s = <$fh>; close $fh; return $s; }

# The key file beside $path, or undef.
sub key_for {
    my ($path) = @_;
    my $dir = dirname($path);
    my $name = basename($path, '.html');
    return undef if $name =~ /-answers|teacher|-home-|-fr(?:-|$)/;
    my ($base, $v) = $name =~ /^(.*)-(v\d+)$/ or return undef;
    my @bases = ($base);
    (my $plain = $base) =~ s/-(?:ef|scaffolded|gr6)\b//g;
    push @bases, $plain if $plain ne $base;
    for my $b (@bases) {
        for my $c ("$b-answers-$v", map { "$b-answers-v$_" } reverse 1 .. 9) {
            return "$c.html" if -f "$dir/$c.html";
        }
    }
    return undef;
}

sub ids_of { my ($s) = @_; my %h; $h{$1} = 1 while $s =~ /<h2 id="([^"]+)"/g; return \%h; }

# Move back from position $i over things that belong to the start of the
# next section: blank space, comments, rules, page breaks, section wrappers.
sub back_up {
    my ($s, $i) = @_;
    while (1) {
        my $head = substr($s, 0, $i);
        if ($head =~ /(\s+|<!--(?:(?!-->).)*-->|<hr\b[^>]*>|<div class="pb"><\/div>|<div class="section[^"]*">|<section\b[^>]*>)\z/s) {
            $i -= length $1;
        } else { last; }
    }
    return $i;
}

sub add_links {
    my ($s, $key) = @_;
    # Remove links from an earlier run.
    $s =~ s{<style id="key-link-css">.*?</style>\n}{}s;
    $s =~ s{\n<p class="key-link[^"]*">.*?</p>}{}g;

    my $key_ids = ids_of(slurp($key->{path}));
    my $href = $key->{file};
    my @h2 = ();
    push @h2, [$-[0], $1, $2] while $s =~ /<h2 id="([^"]+)"[^>]*>(.*?)<\/h2>/gs;
    my @inserts;   # [position, html]
    for my $n (0 .. $#h2) {
        my ($pos, $id, $inner) = @{ $h2[$n] };
        next unless $id =~ /^[su](\d+)$/ && $key_ids->{$id};
        my $num = $1;
        (my $text = $inner) =~ s/<[^>]+>//g;
        $text =~ s/&nbsp;|\x{a0}/ /g;
        my ($word) = $text =~ /^\s*(Section|Concept|Part|Unit)\b/i;
        $word = $word ? ucfirst lc $word : 'Section';
        # The section ends where the next headed part begins; the last one
        # before the footer or the end of the page.
        my $end;
        if ($n < $#h2) { $end = $h2[$n + 1][0]; }
        else {
            my $tail = index($s, '<footer', $pos);
            $end = $tail >= 0 ? $tail : rindex($s, '</body>');
        }
        $end = back_up($s, $end);
        push @inserts, [$end, qq{\n<p class="key-link key-check"><a href="$href#$id">Check your answers for $word $num &rarr;</a></p>}];
    }
    my $checks = @inserts;
    return ($s, 0) unless $checks;

    # Under the title: after </h1> and a subtitle right below it.
    if ($s =~ /<\/h1>(\s*<(p|div) class="sub">.*?<\/\2>|\s*<p>(?:(?!<\/p>).)*<\/p>)?/s) {
        push @inserts, [$+[0], qq{\n<p class="key-link key-top"><a href="$href">Answer key &rarr;</a></p>}];
    }
    for my $ins (sort { $b->[0] <=> $a->[0] } @inserts) {
        substr($s, $ins->[0], 0) = $ins->[1];
    }
    $s =~ s{</head>}{$CSS</head>};
    return ($s, $checks);
}

my @files = @ARGV;
unless (@files) {
    find(sub { push @files, $File::Find::name if /notes.*\.html\z/ }, "$ROOT/public/materials");
    @files = sort @files;
}
my ($done, $links) = (0, 0);
for my $path (@files) {
    my $file = key_for($path) or next;
    my $s = slurp($path);
    my ($new, $n) = add_links($s, { file => $file, path => dirname($path) . "/$file" });
    next unless $n;
    $done++; $links += $n;
    next if $dry || $new eq $s;
    open my $o, '>', $path or die "$path: $!"; print $o $new; close $o;
}
print(($dry ? '[dry run] ' : '') . "$done notes files, $links section links\n");
