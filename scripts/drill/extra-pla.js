<script>
window.EXTRA = ok => {
  const M = MODEL;
  let clash = true, four = true;
  for (let i = 0; i < 400; i++) { const it = M.genFlower(); if (it.opts.length !== 4 || !it.opts.includes(it.a)) four = false; (M.CLASH[it.a] || []).forEach(c => { if (it.opts.includes(c)) clash = false; }); }
  ok(four && clash, 'flower: 4 choices with the answer, never a part with its whole');
  let ph = true, soil = 0; for (let i = 0; i < 400; i++) { const it = M.genPhoto(); if (it.opts.length !== 4 || !it.opts.includes(it.a)) ph = false; if (it.opts.includes('soil')) soil++; }
  ok(ph && soil > 150, 'photosynthesis: 4 choices with the answer; soil offered often (' + soil + '/400)');
  ok(M.checkPhoto({ a: 'water' }, { v: 'soil' }).code === 'soil', 'photosynthesis: soil named');
  ok(M.checkTube({ form: 'tube', tube: 'phloem', a: 'sugar' }, { v: 'soil' }).code === 'soil-food', 'tubes: food from the soil named');
  ok(M.checkTube({ form: 'cargo', a: 'xylem' }, { v: 'phloem' }).code === 'xylem', 'tubes: xylem cue');
  ok(M.checkJob({ t: "Makes the plant's food", a: 'leaf' }, { v: 'root' }).code === 'root-food', 'jobs: roots taking in food named');
  ok(M.checkKind({ a: 'plant', onion: true }, { v: 'animal' }).cue.indexOf('still plant') >= 0, 'plant/animal: onion cell cue');
  let cells = true; for (let i = 0; i < 200; i++) { const it = M.genCell(); if (it.opts.length !== 4 || !it.opts.includes(it.a)) cells = false; }
  ok(cells, 'cell parts: 4 choices with the answer');
  ok(document.querySelectorAll('.tab').length === 8, 'eight tabs');
};
</script>
