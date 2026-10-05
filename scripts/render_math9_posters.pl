#!/usr/bin/perl
# Grade 9 Math concept posters -- condensed, wall-poster version of the
# concept reference sheets. Each poster is a 17x33in canvas tiled across six
# 8.5x11in printable pages (2 cols x 3 rows) with alignment marks so the
# sheets can be taped together into one poster.
use strict;
use warnings;
use utf8;
binmode(STDOUT, ':utf8');

my $BASE = "/d/Classroom tools/worksheets/math-9";

my @UNITS = (
  {
    dir => "$BASE/algebra/linear-equations", slug => 'linear-equations',
    course_label => 'Grade 9 Mathematics &middot; Algebra',
    title => 'Linear Equations<br>&amp; Inequalities',
    accent => '#7c3aed', accent_light => '#f5f3ff', accent_mid => '#8b5cf6', accent_dark => '#5b21b6',
    big_idea => 'Every equation is a balance. Whatever you do to one side, you must do to the other &mdash; until <em>x</em> stands alone.',
    key_rule_label => 'Six Steps to Solve',
    key_rule_html => q{
      <ol>
        <li><strong>Distribute</strong> &mdash; expand any brackets</li>
        <li><strong>Combine like terms</strong> on the same side</li>
        <li><strong>Move variables</strong> to one side</li>
        <li><strong>Move constants</strong> to the other side</li>
        <li><strong>Divide</strong> to isolate the variable</li>
        <li><strong>Verify</strong> by substituting back</li>
      </ol>
      <p class="rule-note">Inequalities: solve exactly the same way &mdash; <strong>except</strong> flip the sign when you multiply or divide by a negative.</p>
    },
    example_title => 'Solve: 4(x &minus; 3) = 2x + 6',
    example_html => q{
      <p>Distribute: &nbsp; 4x &minus; 12 = 2x + 6</p>
      <p>Move variables: &nbsp; 2x &minus; 12 = 6</p>
      <p>Move constants: &nbsp; 2x = 18</p>
      <p>Divide: &nbsp; <strong>x = 9</strong></p>
      <p>Verify: &nbsp; 4(6) = 24 &nbsp;&nbsp; 2(9)+6 = 24 &#10003;</p>
    },
    mistakes => [
      ['Distributing to only the first term', 'Multiply <strong>every</strong> term inside the brackets'],
      ['Not verifying the answer', 'Always substitute back into the original equation'],
      ['Flipping the sign when adding or subtracting', 'Only flip when multiplying or dividing by a <strong>negative</strong>'],
    ],
    self_check => 'Can you solve 2(3x &minus; 1) = &minus;(x + 4) and verify? Can you solve &minus;5x &lt; 20 and graph it?',
  },
  {
    dir => "$BASE/algebra/linear-relations", slug => 'linear-relations',
    course_label => 'Grade 9 Mathematics &middot; Algebra',
    title => 'Linear Relations',
    accent => '#7c3aed', accent_light => '#f5f3ff', accent_mid => '#8b5cf6', accent_dark => '#5b21b6',
    big_idea => 'A linear relation is a straight line. <strong>Slope</strong> tells you the rate of change &mdash; <strong>y-intercept</strong> tells you the starting value.',
    key_rule_label => 'The Two Formulas That Run This Unit',
    key_rule_html => q{
      <p class="formula">m = (y&#8322; &minus; y&#8321;) / (x&#8322; &minus; x&#8321;)</p>
      <p class="rule-note">slope from two points</p>
      <p class="formula">y = mx + b</p>
      <p class="rule-note">m = slope &nbsp;&middot;&nbsp; b = y-intercept</p>
    },
    example_title => 'Two points: (1, 3) and (4, 12)',
    example_html => q{
      <p>Slope: &nbsp; m = (12&minus;3)/(4&minus;1) = 9/3 = <strong>3</strong></p>
      <p>Use y = mx + b: &nbsp; 3 = 3(1) + b &rarr; b = <strong>0</strong></p>
      <p>Equation: &nbsp; <strong>y = 3x</strong> &nbsp; (direct variation &mdash; passes through the origin)</p>
    },
    mistakes => [
      ['&ldquo;y-intercept is where the line crosses the x-axis&rdquo;', 'It crosses the <strong>y-axis</strong>, at x = 0'],
      ['&ldquo;Slope is always positive&rdquo;', 'Slope is negative when the line falls left to right'],
      ['&ldquo;y = 3x is partial variation&rdquo;', 'No constant term means <strong>direct</strong> variation'],
    ],
    self_check => 'Given y = &minus;4x + 7, can you state the slope, y-intercept, and what both mean in a real context?',
  },
  {
    dir => "$BASE/algebra/polynomials", slug => 'polynomials',
    course_label => 'Grade 9 Mathematics &middot; Algebra',
    title => 'Polynomials',
    accent => '#7c3aed', accent_light => '#f5f3ff', accent_mid => '#8b5cf6', accent_dark => '#5b21b6',
    big_idea => 'Only <strong>like terms</strong> combine &mdash; same variable, same exponent. Everything else stays separate.',
    key_rule_label => 'Subtracting Polynomials',
    key_rule_html => q{
      <p class="rule-note">Distribute the negative sign to <strong>every</strong> term in the second bracket, then collect like terms.</p>
      <p class="formula">(a &minus; b) &minus; (c &minus; d) = a &minus; b &minus; c + d</p>
      <p class="rule-note">Multiplying binomials: every term in the first bracket &times; every term in the second (4 partial products &mdash; use the area model).</p>
    },
    example_title => 'Find: (4x&sup2; + 3x &minus; 1) &minus; (2x&sup2; &minus; x + 6)',
    example_html => q{
      <p>Distribute the negative: &nbsp; 4x&sup2; + 3x &minus; 1 <strong>&minus; 2x&sup2; + x &minus; 6</strong></p>
      <p>Collect: &nbsp; (4&minus;2)x&sup2; + (3+1)x + (&minus;1&minus;6)</p>
      <p>Result: &nbsp; <strong>2x&sup2; + 4x &minus; 7</strong></p>
    },
    mistakes => [
      ['(x + 2)(x + 3) = x&sup2; + 6', 'Needs 4 partial products: x&sup2; + 5x + 6'],
      ['x &times; x = 2x', 'x &times; x = <strong>x&sup2;</strong>'],
      ['&minus;(2x&sup2; &minus; x) = &minus;2x&sup2; &minus; x', 'Flip <strong>all</strong> the signs: &minus;2x&sup2; + x'],
    ],
    self_check => 'Can you expand (2x &minus; 3)(x + 5) using the area model? Can you subtract (4x&sup2; &minus; x + 2) from (6x&sup2; + 3x &minus; 1)?',
  },
  {
    dir => "$BASE/measurement-geometry/circle-geometry", slug => 'circle-geometry',
    course_label => 'Grade 9 Mathematics &middot; Measurement &amp; Geometry',
    title => 'Circle Geometry',
    accent => '#16a34a', accent_light => '#f0fdf4', accent_mid => '#22c55e', accent_dark => '#166534',
    big_idea => 'Every circle problem comes back to one of four properties &mdash; and the inscribed angle theorem is the one you&rsquo;ll use most.',
    key_rule_label => 'Inscribed Angle Theorem',
    key_rule_html => q{
      <p class="formula">inscribed angle = &frac12; &times; central angle</p>
      <p class="rule-note">(same arc)</p>
      <p class="rule-note">Special case: if the chord is a <strong>diameter</strong>, the inscribed angle is always <strong>90&deg;</strong>.</p>
    },
    example_title => 'Central angle AOB = 110&deg;',
    example_html => q{
      <p>Inscribed angle APB = 110&deg; &divide; 2 = <strong>55&deg;</strong></p>
      <p>Major arc = 360&deg; &minus; 110&deg; = 250&deg;</p>
      <p>Inscribed angle AQB (major arc) = 250&deg; &divide; 2 = <strong>125&deg;</strong></p>
    },
    mistakes => [
      ['&ldquo;All inscribed angles equal 90&deg;&rdquo;', 'Only ones that subtend a <strong>diameter</strong>'],
      ['&ldquo;Inscribed angle = central angle&rdquo;', 'Inscribed angle is <strong>half</strong> the central angle'],
      ['Forgetting the right angle at the tangent point', 'Tangent &perp; radius &mdash; mark it before using Pythagorean theorem'],
    ],
    self_check => 'If a central angle is 84&deg;, what is the inscribed angle on the minor arc? On the major arc?',
  },
  {
    dir => "$BASE/measurement-geometry/measurement", slug => 'measurement',
    course_label => 'Grade 9 Mathematics &middot; Measurement &amp; Geometry',
    title => 'Surface Area<br>&amp; Volume',
    accent => '#16a34a', accent_light => '#f0fdf4', accent_mid => '#22c55e', accent_dark => '#166534',
    big_idea => '<strong>Surface area</strong> measures the skin, in cm&sup2;. <strong>Volume</strong> measures the space inside, in cm&sup3;. Never mix the units.',
    key_rule_label => 'Slant Height vs. Perpendicular Height',
    key_rule_html => q{
      <p class="rule-note">Use <strong>perpendicular height (h)</strong> for volume.</p>
      <p class="rule-note">Use <strong>slant height (l)</strong> for surface area of pyramids and cones.</p>
      <p class="formula">l&sup2; = r&sup2; + h&sup2;</p>
    },
    example_title => 'Cone: r = 3 cm, h = 4 cm',
    example_html => q{
      <p>Slant height: &nbsp; l = &radic;(3&sup2;+4&sup2;) = &radic;25 = <strong>5 cm</strong></p>
      <p>SA = &pi;r&sup2; + &pi;rl = 9&pi; + 15&pi; = <strong>24&pi; &asymp; 75.4 cm&sup2;</strong></p>
      <p>V = &#8531;&pi;r&sup2;h = <strong>12&pi; &asymp; 37.7 cm&sup3;</strong></p>
    },
    mistakes => [
      ['Using slant height in the volume formula', 'Volume always uses <strong>perpendicular</strong> height'],
      ['&ldquo;Cone volume is half the cylinder&rdquo;', 'It&rsquo;s <strong>one third</strong> the cylinder (same base and height)'],
      ['Forgetting to subtract hidden joined faces', 'Every joined face disappears from <strong>both</strong> shapes'],
    ],
    self_check => 'Can you state all five SA and V formulas without looking? Can you find slant height from r and h?',
  },
  {
    dir => "$BASE/measurement-geometry/similarity", slug => 'similarity',
    course_label => 'Grade 9 Mathematics &middot; Measurement &amp; Geometry',
    title => 'Similarity<br>&amp; Scale',
    accent => '#16a34a', accent_light => '#f0fdf4', accent_mid => '#22c55e', accent_dark => '#166534',
    big_idea => 'Similar figures are the same shape at a different size &mdash; angles match exactly, sides scale by the same factor.',
    key_rule_label => 'Two Polygons Are Similar Only If',
    key_rule_html => q{
      <ol>
        <li>All corresponding angles are <strong>equal</strong>, AND</li>
        <li>All corresponding sides are <strong>proportional</strong></li>
      </ol>
      <p class="rule-note">Triangles shortcut &mdash; <strong>AA</strong>: two pairs of equal angles is enough (the third must match too).</p>
    },
    example_title => '&#9651;ABC ~ &#9651;DEF &nbsp; AB=6, BC=9, AC=12, DE=4',
    example_html => q{
      <p>Scale factor = DE &divide; AB = 4/6 = <strong>2/3</strong></p>
      <p>EF = 9 &times; 2/3 = <strong>6</strong></p>
      <p>DF = 12 &times; 2/3 = <strong>8</strong></p>
    },
    mistakes => [
      ['&ldquo;Similar means congruent&rdquo;', 'Similar means proportional &mdash; <strong>not</strong> equal in size'],
      ['Setting up the ratio backwards', 'Match image-to-image, original-to-original'],
      ['Measuring shadows at different times', 'Sun angle must stay constant &mdash; measure simultaneously'],
    ],
    self_check => 'If &#9651;PQR ~ &#9651;XYZ with scale factor 3/2, and PQ = 4 cm, what is XY?',
  },
  {
    dir => "$BASE/number/powers-exponents", slug => 'powers-exponents',
    course_label => 'Grade 9 Mathematics &middot; Number',
    title => 'Powers<br>&amp; Exponents',
    accent => '#1d4ed8', accent_light => '#eff6ff', accent_mid => '#3b82f6', accent_dark => '#1e3a8a',
    big_idea => 'Exponent laws are shortcuts for counting repeated multiplication &mdash; <strong>add</strong> exponents when multiplying, <strong>subtract</strong> when dividing.',
    key_rule_label => 'The Three Laws You Use Most',
    key_rule_html => q{
      <p class="formula">a<sup>m</sup> &times; a<sup>n</sup> = a<sup>m+n</sup></p>
      <p class="formula">a<sup>m</sup> &divide; a<sup>n</sup> = a<sup>m&minus;n</sup></p>
      <p class="formula">(a<sup>m</sup>)<sup>n</sup> = a<sup>mn</sup></p>
      <p class="rule-note">Negative exponent = reciprocal: &nbsp; a<sup>&minus;n</sup> = 1/a<sup>n</sup></p>
    },
    example_title => 'Simplify: x&#8309; &times; x&sup3; &divide; x&sup2;',
    example_html => q{
      <p>x&#8309; &times; x&sup3; = x<sup>(5+3)</sup> = x&#8312; &nbsp;&larr; add exponents</p>
      <p>x&#8312; &divide; x&sup2; = x<sup>(8&minus;2)</sup> = <strong>x&#8310;</strong> &nbsp;&larr; subtract exponents</p>
    },
    mistakes => [
      ['2&sup3; &times; 2&#8308; = 2&sup1;&sup2;', 'Add exponents when multiplying: <strong>2&#8311;</strong>'],
      ['(2&sup3;)&#8308; = 2&#8311;', 'Multiply exponents for a power of a power: <strong>2&sup1;&sup2;</strong>'],
      ['3&#8315;&sup2; = &minus;9', 'Negative exponent = reciprocal: <strong>1/9</strong>'],
    ],
    self_check => 'Can you write all seven laws from memory? Can you tell apart 2&sup3; &times; 2&#8308; from (2&sup3;)&#8308; without looking?',
  },
  {
    dir => "$BASE/number/rational-numbers", slug => 'rational-numbers',
    course_label => 'Grade 9 Mathematics &middot; Number',
    title => 'Rational Numbers',
    accent => '#1d4ed8', accent_light => '#eff6ff', accent_mid => '#3b82f6', accent_dark => '#1e3a8a',
    big_idea => 'You can&rsquo;t add or subtract fractions until the pieces are the same size &mdash; find the <strong>LCD</strong> first.',
    key_rule_label => 'Adding, Subtracting, Dividing',
    key_rule_html => q{
      <p class="rule-note">Adding/subtracting: find the LCD, then add or subtract <strong>numerators only</strong>.</p>
      <p class="rule-note">Dividing: multiply by the <strong>reciprocal</strong> of the divisor.</p>
      <p class="rule-note">Sign rule: negative &times; negative = <strong>positive</strong></p>
    },
    example_title => 'Find: &minus;3/4 + 5/6',
    example_html => q{
      <p>LCD of 4 and 6 = <strong>12</strong></p>
      <p>Rewrite: &nbsp; &minus;9/12 + 10/12</p>
      <p>Result: &nbsp; <strong>1/12</strong></p>
    },
    mistakes => [
      ['1/2 + 1/3 = 2/5', 'Find the LCD first: 3/6 + 2/6 = <strong>5/6</strong>'],
      ['&ldquo;Dividing always makes it smaller&rdquo;', 'Dividing by a fraction less than 1 gives a <strong>larger</strong> result'],
      ['(&minus;2/3)&sup2; is negative', 'Even power &rarr; always positive: <strong>4/9</strong>'],
    ],
    self_check => 'Can you explain why 1/2 + 1/3 &ne; 2/5 in two sentences? Can you explain what happens when you divide by 1/2?',
  },
  {
    dir => "$BASE/number/square-roots", slug => 'square-roots',
    course_label => 'Grade 9 Mathematics &middot; Number',
    title => 'Square Roots<br>&amp; Radicals',
    accent => '#1d4ed8', accent_light => '#eff6ff', accent_mid => '#3b82f6', accent_dark => '#1e3a8a',
    big_idea => '&radic; always means the <strong>positive</strong> root &mdash; and the Pythagorean theorem only works on right triangles.',
    key_rule_label => 'Pythagorean Theorem',
    key_rule_html => q{
      <p class="formula">a&sup2; + b&sup2; = c&sup2;</p>
      <p class="rule-note">c = hypotenuse (opposite the right angle, always the longest side)</p>
      <p class="rule-note">&radic;(a &times; b) = &radic;a &times; &radic;b &nbsp; &#10003; &nbsp;&nbsp;&nbsp; &radic;(a + b) &ne; &radic;a + &radic;b &nbsp; &#10007;</p>
    },
    example_title => 'Right triangle: legs 7 cm and 24 cm',
    example_html => q{
      <p>7&sup2; + 24&sup2; = c&sup2;</p>
      <p>49 + 576 = 625</p>
      <p>c = &radic;625 = <strong>25 cm</strong></p>
    },
    mistakes => [
      ['&radic;9 = &plusmn;3', 'The principal root is positive only: <strong>3</strong>'],
      ['&radic;(9 + 16) = 3 + 4 = 7', 'Roots don&rsquo;t distribute over addition: &radic;25 = <strong>5</strong>'],
      ['&ldquo;&radic;2 = 1.414... exactly&rdquo;', 'That&rsquo;s an approximation &mdash; the exact value is &radic;2'],
    ],
    self_check => 'Can you estimate &radic;70 without a calculator? Can you find a missing side in a right triangle?',
  },
  {
    dir => "$BASE/statistics-probability/probability", slug => 'probability',
    course_label => 'Grade 9 Mathematics &middot; Statistics &amp; Probability',
    title => 'Probability',
    accent => '#0d9488', accent_light => '#f0fdfa', accent_mid => '#14b8a6', accent_dark => '#115e59',
    big_idea => '<strong>Independent</strong> events have no memory. Past results never change the next probability.',
    key_rule_label => 'Independent vs. Dependent',
    key_rule_html => q{
      <p class="formula">P(A) = favourable &divide; total</p>
      <p class="rule-note">Independent: &nbsp; P(A and B) = P(A) &times; P(B)</p>
      <p class="rule-note">Dependent: recalculate the total <strong>after each draw</strong></p>
    },
    example_title => 'Bag: 3 red, 5 blue &mdash; draw twice, no replacement',
    example_html => q{
      <p>P(red on draw 1) = 3/8</p>
      <p>After removing 1 red: 2 red left, 7 total left</p>
      <p>P(red then red) = 3/8 &times; 2/7 = <strong>3/28</strong></p>
    },
    mistakes => [
      ['Gambler&rsquo;s fallacy &mdash; &ldquo;heads is due&rdquo;', 'Every independent event starts fresh'],
      ['Not updating the sample space (dependent events)', 'Recalculate the total <strong>and</strong> favourable count after each draw'],
      ['Forgetting to list all outcomes', 'Use a tree diagram or organized list to be complete'],
    ],
    self_check => 'A bag has 4 red and 6 green. Two drawn without replacement. Can you find P(red then green)?',
  },
  {
    dir => "$BASE/statistics-probability/statistics", slug => 'statistics',
    course_label => 'Grade 9 Mathematics &middot; Statistics &amp; Probability',
    title => 'Statistics<br>&amp; Data Analysis',
    accent => '#0d9488', accent_light => '#f0fdfa', accent_mid => '#14b8a6', accent_dark => '#115e59',
    big_idea => 'Correlation is not causation &mdash; and predictions <strong>inside</strong> your data range are far more reliable than predictions beyond it.',
    key_rule_label => 'Line of Best Fit &mdash; Rules',
    key_rule_html => q{
      <ol>
        <li>Drawn through the <strong>middle</strong> of the data</li>
        <li>Follows the <strong>direction</strong> of the trend</li>
        <li>Does NOT need to touch the origin or any data point</li>
      </ol>
    },
    example_title => 'Study hours vs. test score, line through (1,52) and (6,90)',
    example_html => q{
      <p>Slope: &nbsp; m = (90&minus;52)/(6&minus;1) = <strong>7.6</strong></p>
      <p>Equation: &nbsp; <strong>y = 7.6x + 44.4</strong></p>
      <p>Predict 3.5 h: 71.0% (inside range &mdash; reliable)</p>
      <p>Predict 10 h: 120.4% &mdash; impossible, <strong>unreliable extrapolation</strong></p>
    },
    mistakes => [
      ['&ldquo;The line must pass through the origin&rdquo;', 'The line of best fit can have any y-intercept'],
      ['&ldquo;Strong correlation proves causation&rdquo;', 'Correlation is one piece of evidence, not proof'],
      ['&ldquo;Extrapolation is just as reliable&rdquo;', 'It grows increasingly uncertain beyond the data range'],
    ],
    self_check => 'Can you describe the correlation in a scatter plot using direction and strength? Can you find the equation of a line of best fit from two points?',
  },
);

sub mistakes_html {
  my ($mistakes) = @_;
  my $out = '';
  for my $m (@$mistakes) {
    my ($mistake, $fix) = @$m;
    $out .= qq{
      <div class="mistake-row">
        <div class="mistake-col"><span class="mm-label">MISTAKE</span>$mistake</div>
        <div class="fix-col"><span class="mm-label">FIX</span>$fix</div>
      </div>};
  }
  return $out;
}

sub poster_canvas_html {
  my ($u) = @_;
  return qq{
    <div class="poster-canvas">
      <div class="header-band">
        <div class="course-label">$u->{course_label}</div>
        <h1>$u->{title}</h1>
        <div class="header-rule"></div>
      </div>
      <div class="big-idea">
        <div class="section-tag">THE BIG IDEA</div>
        <p>$u->{big_idea}</p>
      </div>
      <div class="key-rule">
        <div class="section-tag">$u->{key_rule_label}</div>
        $u->{key_rule_html}
      </div>
      <div class="worked-example">
        <div class="section-tag">WORKED EXAMPLE</div>
        <p class="example-title">$u->{example_title}</p>
        $u->{example_html}
      </div>
      <div class="mistakes-block">
        <div class="section-tag watch-tag">&#9888; WATCH OUT FOR</div>
        @{[ mistakes_html($u->{mistakes}) ]}
      </div>
      <div class="self-check">
        <div class="section-tag check-tag">&#9989; SELF-CHECK</div>
        <p>$u->{self_check}</p>
      </div>
    </div>
  };
}

# 2 cols x 3 rows, tile = 8.5in x 11in, canvas = 17in x 33in
my @TILES = (
  { key => 'r1c1', left => '0in',    top => '0in',   label => 'row 1, left'  },
  { key => 'r1c2', left => '-8.5in', top => '0in',   label => 'row 1, right' },
  { key => 'r2c1', left => '0in',    top => '-11in', label => 'row 2, left'  },
  { key => 'r2c2', left => '-8.5in', top => '-11in', label => 'row 2, right' },
  { key => 'r3c1', left => '0in',    top => '-22in', label => 'row 3, left'  },
  { key => 'r3c2', left => '-8.5in', top => '-22in', label => 'row 3, right' },
);

sub render_poster {
  my ($u) = @_;
  my $canvas = poster_canvas_html($u);
  my $flat_title = $u->{title};
  $flat_title =~ s{<br>}{ }g;

  my $tiles = '';
  my $n = 0;
  for my $t (@TILES) {
    $n++;
    my $is_last = ($n == scalar(@TILES)) ? '' : '; page-break-after: always;';
    $tiles .= qq{
<div class="tile">
  <div class="canvas-shift" style="left:$t->{left}; top:$t->{top};">
    $canvas
  </div>
  <div class="assembly-label label-tl">Tile $n of 6 &middot; $t->{label}<br>$flat_title poster &mdash; tape to matching edges</div>
  <div class="align-mark mark-tl"></div>
  <div class="align-mark mark-tr"></div>
  <div class="align-mark mark-bl"></div>
  <div class="align-mark mark-br"></div>
</div>};
  }

  return qq{<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>$flat_title &mdash; Wall Poster | Grade 9 Mathematics</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --accent: $u->{accent}; --accent-light: $u->{accent_light};
    --accent-mid: $u->{accent_mid}; --accent-dark: $u->{accent_dark};
  }
  html { font-family: 'Segoe UI', system-ui, sans-serif; color: #1e293b; }
  body { background: #fff; }

  \@page { size: 8.5in 11in; margin: 0; }

  .tile {
    width: 8.5in; height: 11in; position: relative; overflow: hidden;
    background: #fff; page-break-after: always;
  }
  .tile:last-child { page-break-after: auto; }

  .canvas-shift { position: absolute; width: 17in; height: 33in; }

  .poster-canvas { width: 17in; height: 33in; padding: 0.7in 0.8in; position: relative; }

  .header-band { margin-bottom: 0.55in; }
  .course-label {
    font-size: 20pt; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 0.15in;
  }
  h1 { font-size: 92pt; font-weight: 800; line-height: 1.05; color: #0f172a; }
  .header-rule { height: 10px; background: var(--accent); margin-top: 0.35in; border-radius: 5px; }

  .section-tag {
    display: inline-block; font-size: 18pt; font-weight: 800; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--accent-dark); background: var(--accent-light);
    padding: 0.08in 0.22in; border-radius: 8px; margin-bottom: 0.28in;
  }
  .watch-tag { color: #991b1b; background: #fee2e2; }
  .check-tag { color: #166534; background: #f0fdf4; }

  .big-idea { margin-bottom: 0.65in; }
  .big-idea p { font-size: 44pt; font-weight: 700; line-height: 1.35; color: #0f172a; }
  .big-idea strong { color: var(--accent-dark); }
  .big-idea em { font-style: normal; color: var(--accent-dark); }

  .key-rule {
    background: var(--accent-light); border: 3px solid var(--accent-mid); border-radius: 18px;
    padding: 0.45in 0.55in; margin-bottom: 0.65in;
  }
  .key-rule ol { margin-left: 0.55in; font-size: 28pt; line-height: 1.65; }
  .key-rule li { margin-bottom: 0.12in; }
  .key-rule .formula {
    font-size: 42pt; font-weight: 800; color: var(--accent-dark); margin: 0.15in 0;
    font-family: 'Cambria Math', Georgia, serif;
  }
  .key-rule .rule-note { font-size: 24pt; color: #334155; margin: 0.12in 0 0.25in; }
  .key-rule .rule-note strong { color: var(--accent-dark); }

  .worked-example {
    border: 3px solid #cbd5e1; border-left: 12px solid var(--accent-mid); border-radius: 0 18px 18px 0;
    background: #f8fafc; padding: 0.45in 0.55in; margin-bottom: 0.65in;
  }
  .worked-example .example-title { font-size: 28pt; font-weight: 700; margin-bottom: 0.25in; color: #0f172a; }
  .worked-example p { font-size: 28pt; line-height: 1.6; font-family: 'Cambria Math', Georgia, serif; }
  .worked-example strong { color: var(--accent-dark); }

  .mistakes-block {
    border: 4px solid #fecaca; background: #fef2f2; border-radius: 18px; padding: 0.45in 0.55in;
    margin-bottom: 0.65in;
  }
  .mistake-row {
    display: flex; gap: 0.4in; padding: 0.28in 0; border-bottom: 2px dashed #fecaca; align-items: flex-start;
  }
  .mistake-row:last-child { border-bottom: none; }
  .mistake-col, .fix-col { flex: 1; font-size: 23pt; line-height: 1.45; }
  .mistake-col { color: #991b1b; }
  .fix-col { color: #166534; }
  .mm-label {
    display: block; font-size: 13pt; font-weight: 800; letter-spacing: 0.1em; margin-bottom: 0.06in;
  }
  .fix-col strong { color: #14532d; }
  .mistake-col strong { color: #7f1d1d; }

  .self-check {
    border: 3px solid var(--accent-mid); border-radius: 18px; padding: 0.4in 0.55in;
  }
  .self-check p { font-size: 26pt; line-height: 1.5; color: #0f172a; }

  .assembly-label {
    position: absolute; font-size: 8pt; color: #cbd5e1; line-height: 1.3; width: 2.6in;
    top: 0.08in; left: 0.08in;
  }

  .align-mark { position: absolute; width: 0.3in; height: 0.3in; }
  .align-mark::before, .align-mark::after { content: ''; position: absolute; background: #e2e8f0; }
  .align-mark::before { width: 100%; height: 1px; top: 50%; left: 0; }
  .align-mark::after { width: 1px; height: 100%; left: 50%; top: 0; }
  .mark-tl { top: -0.15in; left: -0.15in; }
  .mark-tr { top: -0.15in; right: -0.15in; }
  .mark-bl { bottom: -0.15in; left: -0.15in; }
  .mark-br { bottom: -0.15in; right: -0.15in; }

  \@media print {
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head>
<body>
$tiles
</body>
</html>
};
}

for my $u (@UNITS) {
  my $out_html = "$u->{dir}/math9-$u->{slug}-poster-v1.html";
  open(my $fh, '>:encoding(UTF-8)', $out_html) or die "Cannot write $out_html: $!";
  print $fh render_poster($u);
  close($fh);
  print "wrote $out_html\n";
}
