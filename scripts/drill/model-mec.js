/* ===================== MODEL START (no DOM) ===================== */
const MODEL = (() => {
  const { rnd, chance } = Q;
  const mk = (a, list) => list.map(([t, i, why]) => ({ t, i, a, why }));

  /* §1 the downward spiral (the notes diagram, in order) */
  const SPIRAL = [
    ['Factories overproduce', '🏭'], ['Goods sit unsold, prices fall', '📦'], ['Workers laid off', '📉'],
    ['Families have less to spend', '👛'], ['Consumer demand falls', '🛒']
  ].map(([t, i]) => ({ t, i }));

  /* §1 the four causes */
  const CAUSE = mk('over', [
    ['Farms grow more wheat than anyone buys', '🌾'], ['Factories make more cars than people want', '🚗'],
    ['Warehouses full of unsold goods', '📦'], ['Too many radios made, too few buyers', '📻']
  ]).concat(mk('dem', [
    ['Families stop buying new furniture', '🛋️'], ['People save every cent instead of shopping', '🐷'],
    ['Fewer customers in the stores', '🛒'], ['Laid-off workers can\'t afford new clothes', '👕']
  ])).concat(mk('trade', [
    ['Countries add high taxes on imports', '🚧'], ['Canada can\'t sell its wheat overseas', '🚢'],
    ['Exports dry up', '🏜️'], ['Other countries stop buying Canadian lumber', '🌲']
  ])).concat(mk('fin', [
    ['The stock market crashes in 1929', '📉'], ['Banks fail and savings vanish', '🏦'],
    ['People can\'t repay their loans', '💳'], ['Investors lose fortunes overnight', '💸']
  ]));
  const CAUSE_CUES = { over: 'Too much made: overproduction', dem: 'People buy less: falling demand', trade: 'Selling abroad stops: trade collapse', fin: 'Banks and markets: financial instability' };

  /* §2 the three government tools */
  const TOOL = mk('pw', [
    ['Government pays workers to build a highway', '🛣️'], ['A government-funded dam creates jobs', '🏗️'],
    ['Building a post office to hire workers', '🏤'], ['Paying crews to build a bridge', '🌉']
  ]).concat(mk('sw', [
    ['Relief payments to hungry families', '🍞'], ['Direct support for people with no income', '💵'],
    ['Food vouchers for the unemployed', '🎟️'], ['Help for seniors in need', '👵']
  ])).concat(mk('def', [
    ['Government spends more than it collects', '⚖️'], ['Borrowing money to get the economy moving', '🏦'],
    ['Running a deficit on purpose', '📝'], ['Spending now, paying back later', '⏳']
  ]));
  const TOOL_CUES = { pw: 'Building projects that make jobs', sw: 'Direct help to people: welfare', def: 'Spending more than it collects' };

  /* §2 deficit or not: what government collects (revenue) and spends, in billions */
  function genDef() {
    const rev = rnd(6, 12) * 5, kind = rnd(0, 2);
    const sp = kind === 0 ? rev + rnd(1, 4) * 5 : kind === 1 ? rev - rnd(1, 4) * 5 : rev;
    return { rev, sp, a: sp > rev ? 'def' : 'no', big: sp >= 50 };
  }
  const checkDef = (it, r) => r.v === it.a ? { ok: true }
    : it.a === 'def' ? { code: 'def', cue: 'Spends more than it collects' }
      : it.big ? { code: 'big', cue: 'Big spending isn\'t a deficit' } : { code: 'no', cue: 'It spends no more than it collects' };

  /* §3 the four growing sectors */
  const SECT = mk('auto', [
    ['Cars built in southern Ontario', '🚗'], ['The 1965 Auto Pact', '📜'], ['Truck assembly lines in Oakville', '🚚'], ['Car parts shipped to Detroit', '🔩']
  ]).concat(mk('pet', [
    ['Leduc No. 1 strikes oil, 1947', '🛢️'], ['Natural gas wells in Alberta', '🔥'], ['Refineries near Edmonton', '🏭'], ['Gas stations for a country of drivers', '⛽']
  ])).concat(mk('paper', [
    ['Newsprint shipped to US newspapers', '🗞️'], ['Pulp mills in BC and Quebec', '🌲'], ['Lumber for new suburbs', '🪵'], ['Logging in northern Ontario', '🪓']
  ])).concat(mk('hydro', [
    ['Big dams in Quebec', '🌊'], ['Electricity from Manitoba rivers', '⚡'], ['Power for homes from BC dams', '💡'], ['Generating stations at Niagara', '💧']
  ]));
  const SECT_CUES = { auto: 'Cars and the Auto Pact', pet: 'Oil and gas, mainly Alberta', paper: 'Trees, pulp, lumber, newsprint', hydro: 'Electricity from big dams' };

  /* §4 free trade or not. Pairs on the same good (cars, lumber, steel, food). */
  const FT = mk('yes', [
    ['Canadian cars sold in the US with no tariff', '🚗'], ['Lumber crosses the border duty-free', '🌲'], ['NAFTA removes taxes on trade', '📜'],
    ['Steel moves both ways with no tax', '🔩'], ['US stores sell Canadian food tax-free', '🍁'], ['Companies invest across the border freely', '💼']
  ]).concat(mk('no', [
    ['A 25% tax on imported cars', '🧾'], ['A limit on lumber sold to the US', '🚧'], ['A duty on American shoes', '👟'],
    ['A tax on imported steel', '⚙️'], ['A ban on importing a food product', '🚫'], ['A tariff to protect local farmers', '🌾']
  ]));
  const FT_CUES = { yes: 'No tariff or limit: free trade', no: 'A tax or limit: not free' };

  /* §1–4 timeline */
  const ORDER = [
    ['Stock market crash', '📉', 1929], ['Worst year of the Depression', '🍞', 1933], ['Second World War ends', '🕊️', 1945],
    ['Leduc No. 1 strikes oil', '🛢️', 1947], ['The Auto Pact', '🚗', 1965], ['Canada–US Free Trade Agreement', '🤝', 1989],
    ['NAFTA', '📜', 1994], ['CUSMA replaces NAFTA', '🔄', 2020]
  ].map(([t, i, y]) => ({ t, i, y, yl: String(y) }));

  return { SPIRAL, CAUSE, CAUSE_CUES, TOOL, TOOL_CUES, genDef, checkDef, SECT, SECT_CUES, FT, FT_CUES, ORDER };
})();
/* ===================== MODEL END ===================== */
