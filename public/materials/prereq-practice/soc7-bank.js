// Social Studies 7 prereq practice questions, used by soc7-<unit>-prereq-practice-v1.html.
// Question fields are described at the top of practice.js. Every skill needs at least two questions.
(function () {
'use strict';

// Prereqs for Social Studies 7 come from Grades 5 and 6:
// see "comesFrom" and "assumed" in src/content/parent-guides/social7/.

const ruleOrLaw = (thing, a, why) => PrereqPractice.sortQ(thing, ['a rule', 'a law'], a, why);
const goodService = (thing, a, why) => PrereqPractice.sortQ(thing, ['a good', 'a service'], a, why);
const importExport = (thing, a, why) => PrereqPractice.sortQ(thing, ['an import', 'an export'], a, why);
const factOpinion = (thing, a, why) => PrereqPractice.sortQ(thing, ['a fact', 'an opinion'], a, why);
const policeArmy = (thing, a, why) => PrereqPractice.sortQ(thing, ['the police', 'the army'], a, why);

window.PracticeBank = { units: [
  {
    id: 'state-building', name: 'Building the Canadian State', num: 1,
    summary: 'Maps, timelines, colonies, and the first peoples of the West',
    skills: [
      {
        name: 'Reading a map',
        hint: 'A compass rose shows north, south, east and west. A legend (key) explains the symbols.',
        items: [
          { q: 'On a map of Canada, British Columbia is on the left and Newfoundland is on the right. Which direction is British Columbia from Newfoundland?', a: 'west', choices: ['west', 'east', 'north', 'south'], why: 'On most maps north is at the top, so left is west. British Columbia is west of Newfoundland.' },
          { q: 'What part of a map tells you what the symbols and colours mean?', a: 'the legend', accept: ['legend', 'the legend', 'key', 'the key', 'map key', 'a legend'], why: 'The legend, or key, explains what each symbol and colour on the map stands for.' },
          { q: 'Alberta is between British Columbia and Saskatchewan. Which province is east of Alberta?', a: 'Saskatchewan', choices: ['Saskatchewan', 'British Columbia', 'Yukon', 'Ontario'], why: 'Saskatchewan is Alberta\'s neighbour to the east. British Columbia is to the west.' },
        ],
      },
      {
        name: 'Timelines',
        hint: 'A timeline puts events in order. Smaller years come first (further left).',
        items: [
          { q: 'Which happened first: an event in 1867 or an event in 1905?', a: '1867', choices: ['1867', '1905'], why: '1867 is a smaller number, so it came earlier. It goes further left on a timeline.' },
          { q: 'How many years are there between 1867 and 1905?', a: '38', accept: ['38', '38 years', 'thirty-eight'], n: 38, why: '1905 − 1867 = 38 years.' },
          { q: 'Put in order from earliest to latest: 1949, 1870, 1905. Which comes in the middle?', a: '1905', choices: ['1905', '1870', '1949'], why: 'The order is 1870, 1905, 1949, so 1905 is in the middle.' },
        ],
      },
      {
        name: 'Colonies',
        hint: 'A colony is a place ruled by another country, often far away.',
        items: [
          { q: 'What is a colony?', a: 'a place ruled by another country', choices: ['a place ruled by another country', 'a big city', 'a group of islands', 'a kind of farm'], why: 'A colony is controlled by another country. Before 1867, the British colonies in North America were ruled from Britain.' },
          { q: 'Before Canada existed, which European country ruled most of North America north of the United States by the 1860s?', a: 'Britain', choices: ['Britain', 'Spain', 'Germany', 'Italy'], why: 'By the 1860s Britain ruled the colonies and territories that later became Canada.' },
          { q: 'Which European country first built New France along the St. Lawrence River?', a: 'France', accept: ['france'], why: 'France built New France. Britain took it over in 1763.' },
        ],
      },
      {
        name: 'First peoples of the West',
        hint: 'First Nations and Métis peoples lived across the West long before Canada existed.',
        items: [
          { q: 'Who lived on the Prairies before European settlers arrived?', a: 'First Nations and Métis peoples', choices: ['First Nations and Métis peoples', 'nobody', 'only fur traders from France', 'only settlers from Britain'], why: 'First Nations such as the Cree and Blackfoot, and later the Métis, lived, hunted and governed across the Prairies.' },
          { q: 'The Métis are a people with First Nations and ___ ancestry.', a: 'European', accept: ['european', 'french', 'scottish', 'french and scottish', 'british'], why: 'The Métis have First Nations and European (often French or Scottish) ancestry, with their own language and culture.' },
          { q: 'Which of these is a First Nation in Alberta?', a: 'Cree', choices: ['Cree', 'Vikings', 'Celts', 'Inca'], why: 'The Cree are one of many First Nations in Alberta, along with the Blackfoot, Dene, Stoney Nakoda, Tsuut\'ina and others.' },
        ],
      },
    ],
  },
  {
    id: 'confederation-government', name: 'Creating Canada’s Government', num: 2,
    summary: 'Leaders, voting, rules and laws, provinces',
    skills: [
      {
        name: 'Leaders',
        hint: 'Canada has a prime minister. Each province, like Alberta, has a premier.',
        items: [
          { q: 'What is the leader of Canada\'s government called?', a: 'the prime minister', accept: ['prime minister', 'the prime minister', 'pm', 'the pm'], why: 'The prime minister leads the federal government in Ottawa.' },
          { q: 'What is the leader of Alberta\'s government called?', a: 'the premier', choices: ['the premier', 'the prime minister', 'the mayor', 'the president'], why: 'Each province has a premier. A mayor leads a city or town.' },
          { q: 'Who leads a city or town government?', a: 'a mayor', choices: ['a mayor', 'a premier', 'a prime minister', 'a king'], why: 'Cities and towns elect a mayor and a council.' },
        ],
      },
      {
        name: 'Voting',
        hint: 'In an election, people vote for a candidate. The candidate with the most votes wins.',
        items: [
          { q: 'In an election, people vote for a…', a: 'candidate', accept: ['candidate', 'a candidate', 'person', 'leader', 'representative'], why: 'A candidate is a person running for office. Voters choose between candidates.' },
          { q: 'Three candidates get 120, 340 and 210 votes. Who wins?', a: 'the one with 340 votes', choices: ['the one with 340 votes', 'the one with 120 votes', 'the one with 210 votes', 'nobody'], why: 'The candidate with the most votes wins, and 340 is the most.' },
          { q: 'In Canada, how old must you be to vote in a federal election?', a: '18', accept: ['18', 'eighteen', '18 years old'], n: 18, why: 'You must be a Canadian citizen and at least 18 years old.' },
        ],
      },
      {
        name: 'Rules and laws',
        hint: 'A law is made by a government and applies to everyone. A rule is set by a family, school, team or business.',
        items: [
          ruleOrLaw('"No phones during class"', 'a rule', 'A school sets it, and it only applies at that school. That makes it a rule.'),
          ruleOrLaw('"Everyone must wear a seatbelt in a moving car"', 'a law', 'A government made it, and it applies to everyone. That makes it a law.'),
          ruleOrLaw('"Bedtime is at 9:30 on school nights"', 'a rule', 'A family sets it for its own home, so it is a rule.'),
        ],
      },
      {
        name: 'Provinces and territories',
        hint: 'Canada has 10 provinces and 3 territories.',
        items: [
          { q: 'How many provinces does Canada have today?', a: '10', accept: ['10', 'ten'], n: 10, why: 'Canada has 10 provinces and 3 territories.' },
          { q: 'Which of these is a territory, not a province?', a: 'Yukon', choices: ['Yukon', 'Alberta', 'Manitoba', 'Quebec'], why: 'Yukon, the Northwest Territories and Nunavut are the three territories.' },
          { q: 'What is the capital city of Canada?', a: 'Ottawa', accept: ['ottawa'], why: 'Ottawa, in Ontario, is Canada\'s capital, where Parliament meets.' },
        ],
      },
    ],
  },
  {
    id: 'building-economy', name: 'Building Canada’s Economy', num: 3,
    summary: 'Goods and services, imports and exports, taxes, banks',
    skills: [
      {
        name: 'Goods and services',
        hint: 'A good is a thing you can touch. A service is work someone does for you.',
        items: [
          goodService('a bag of flour', 'a good', 'You can hold a bag of flour, so it is a good.'),
          goodService('a haircut', 'a service', 'A haircut is work someone does for you, so it is a service.'),
          goodService('a train ride from Calgary to Vancouver', 'a service', 'The railway is doing the work of carrying you, so the ride is a service.'),
        ],
      },
      {
        name: 'Imports and exports',
        hint: 'An import comes into a country from another country. An export is sold to another country.',
        items: [
          importExport('Alberta oil sold to the United States', 'an export', 'It leaves Canada to be sold in another country, so it is an export.'),
          importExport('bananas from Ecuador sold in a Canadian store', 'an import', 'They come into Canada from another country, so they are an import.'),
          importExport('Prairie wheat shipped to Britain in 1900', 'an export', 'It left Canada to be sold in Britain, so it was an export.'),
        ],
      },
      {
        name: 'Taxes',
        hint: 'A tax is money people and businesses pay to the government, which uses it for services.',
        items: [
          { q: 'What is a tax?', a: 'money paid to the government', choices: ['money paid to the government', 'money a bank lends you', 'a price set by a store', 'a kind of coin'], why: 'Taxes are money paid to the government to pay for things like roads, schools and hospitals.' },
          { q: 'Which of these is paid for with taxes?', a: 'public schools', choices: ['public schools', 'your video games', 'a restaurant meal', 'your bike'], why: 'Governments use tax money for services everyone shares, like public schools.' },
          { q: 'A $10 item has a 5% tax. How much is the tax, in dollars?', a: '0.50', accept: ['0.5', '0.50', '$0.50', '50 cents', '$.50', '.50'], n: 0.5, why: '5% of $10 is 10 × 0.05 = $0.50.' },
        ],
      },
      {
        name: 'Banks',
        hint: 'Banks keep people\'s money safe, help them save, and lend money.',
        items: [
          { q: 'Which is a job that banks do?', a: 'keep money safe and lend money', choices: ['keep money safe and lend money', 'make laws', 'grow wheat', 'run schools'], why: 'Banks hold savings and lend money to people and businesses.' },
          { q: 'Money you put away to use later is called…', a: 'savings', accept: ['savings', 'saving', 'a saving', 'savings account'], why: 'Savings are money you keep for the future, often in a bank account.' },
          { q: 'When a bank lends you money, you usually pay back the loan plus extra. The extra is called…', a: 'interest', choices: ['interest', 'a tax', 'a tariff', 'a refund'], why: 'Interest is the extra money paid for borrowing.' },
        ],
      },
    ],
  },
  {
    id: 'immigration', name: 'Immigration After Confederation', num: 4,
    summary: 'Why people move, fairness, fact or opinion',
    skills: [
      {
        name: 'Why people move',
        hint: 'People move for many reasons: land, work, safety or family.',
        items: [
          { q: 'Which is a reason a family might move to a new country?', a: 'to find land or work', choices: ['to find land or work', 'because the weather report said so', 'to change their name', 'to stop eating'], why: 'Land, work, safety and family are common reasons people move.' },
          { q: 'A family leaves home because there is a war. Is the war a reason pushing them away or pulling them to a new place?', a: 'pushing them away', choices: ['pushing them away', 'pulling them to a new place'], why: 'A war at home pushes people to leave. Something good in the new place, like land, pulls them.' },
          { q: 'A country offers free farmland to newcomers. Is that a push or a pull?', a: 'a pull', choices: ['a pull', 'a push'], why: 'Free land draws people toward the new country, so it is a pull.' },
        ],
      },
      {
        name: 'Fair or unfair',
        hint: 'Treating people differently because of who they are, not what they do, is unfair.',
        items: [
          { q: 'A coach lets only students with brown hair join the team. Is that fair?', a: 'no', choices: ['no', 'yes'], why: 'Hair colour has nothing to do with playing well. Treating people differently because of who they are is unfair.' },
          { q: 'Treating someone unfairly because of their race, religion or where they come from is called…', a: 'discrimination', accept: ['discrimination', 'racism', 'prejudice'], why: 'Discrimination means treating people differently because of their ethnicity, religion, age, race or disability.' },
          { q: 'Which rule is fair to everyone?', a: 'Everyone gets one turn.', choices: ['Everyone gets one turn.', 'Only older students get a turn.', 'Only students from one street get a turn.'], why: 'A rule that treats everyone the same way is fair.' },
        ],
      },
      {
        name: 'Fact or opinion',
        hint: 'A fact can be checked. An opinion is what someone thinks or feels.',
        items: [
          factOpinion('"Alberta became a province in 1905."', 'a fact', 'You can check it in records, so it is a fact.'),
          factOpinion('"Alberta is the best province."', 'an opinion', 'It is what someone believes. Other people may disagree.'),
          factOpinion('"The railway reached the Pacific in 1885."', 'a fact', 'It can be checked in historical records.'),
        ],
      },
    ],
  },
  {
    id: 'armed-forces', name: 'Armed Forces and Sovereignty', num: 5,
    summary: 'Police and armies, Remembrance Day, timelines',
    skills: [
      {
        name: 'Police and armies',
        hint: 'Police keep order and enforce laws at home. An army defends the country.',
        items: [
          policeArmy('enforcing the law in a town', 'the police', 'Keeping order and enforcing laws at home is the job of the police.'),
          policeArmy('defending the country in a war', 'the army', 'Defending the country from attack is the army\'s job.'),
          { q: 'What do the letters RCMP stand for?', a: 'Royal Canadian Mounted Police', choices: ['Royal Canadian Mounted Police', 'Regular Canadian Military Patrol', 'Royal Crown Militia Police'], why: 'The RCMP is the Royal Canadian Mounted Police, Canada\'s national police force.' },
        ],
      },
      {
        name: 'Remembrance Day',
        hint: 'On November 11, Canadians remember people who served and died in wars.',
        items: [
          { q: 'On what date is Remembrance Day?', a: 'November 11', choices: ['November 11', 'July 1', 'December 25', 'September 1'], why: 'Remembrance Day is November 11, the day the First World War ended in 1918.' },
          { q: 'What flower do many Canadians wear for Remembrance Day?', a: 'a poppy', accept: ['poppy', 'a poppy', 'poppies', 'red poppy'], why: 'The red poppy comes from the poem "In Flanders Fields," written by a Canadian doctor in the First World War.' },
          { q: 'A war memorial (cenotaph) usually shows…', a: 'names of people who served', choices: ['names of people who served', 'store prices', 'bus times', 'sports scores'], why: 'Memorials list local people who served or died, so the community remembers them.' },
        ],
      },
      {
        name: 'Timelines',
        hint: 'A timeline puts events in order. Smaller years come first.',
        items: [
          { q: 'Which came first: the First World War (1914–1918) or Confederation (1867)?', a: 'Confederation', choices: ['Confederation', 'the First World War'], why: '1867 is earlier than 1914.' },
          { q: 'How many years after 1867 did the First World War begin in 1914?', a: '47', accept: ['47', '47 years', 'forty-seven'], n: 47, why: '1914 − 1867 = 47 years.' },
          { q: 'Put in order: 1910, 1873, 1931. Which comes first?', a: '1873', choices: ['1873', '1910', '1931'], why: '1873 is the smallest year, so it comes first.' },
        ],
      },
    ],
  },
] };
})();
