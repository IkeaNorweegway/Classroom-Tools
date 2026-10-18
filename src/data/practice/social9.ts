import { sortQ, type PracticeUnit } from './types';

// Prereqs for Social Studies 9 come from Grades 6–8 and from earlier Grade 9
// units: see "comesFrom" and "assumed" in src/content/parent-guides/social9/.

const ruleOrLaw = (thing: string, a: 'a rule' | 'a law', why: string) => sortQ(thing, ['a rule', 'a law'], a, why);
const rightResp = (thing: string, a: 'a right' | 'a responsibility', why: string) => sortQ(thing, ['a right', 'a responsibility'], a, why);
const importExport = (trade: string, a: 'an import' | 'an export', why: string) =>
  ({ q: `${trade} For Canada, is this an import or an export?`, a, choices: ['an import', 'an export'], why });

const timelineHint = 'To find the years between two dates, subtract the earlier year from the later one.';

export const social9Practice: PracticeUnit[] = [
  {
    id: 'urbanization-industry', name: 'Urbanization and Industry', num: 1,
    summary: 'Why people move, cities and rural areas, reading data, opinions with reasons',
    skills: [
      {
        name: 'Why people move',
        hint: 'People move for jobs, for safety, to join family, or for a better life.',
        items: [
          { q: 'A family leaves their country because a war has started. What is their main reason for moving?', a: 'safety', choices: ['safety', 'a job', 'joining family', 'better weather'], why: 'War makes home dangerous. Moving to stay safe is one of the strongest reasons people move.' },
          { q: 'An engineer moves to Edmonton after an oil company offers her work. What is her main reason?', a: 'a job', choices: ['safety', 'a job', 'joining family', 'school'], why: 'A job offer is pulling her to the new place.' },
          { q: 'A grandfather moves to Canada to live with his daughter’s family. What is his main reason?', a: 'joining family', choices: ['safety', 'a job', 'joining family', 'cheaper land'], why: 'He is moving to be with family.' },
        ],
      },
      {
        name: 'Cities, towns and rural areas',
        hint: 'Rural means the countryside: farms, ranches and open land outside towns and cities.',
        items: [
          { q: 'Land outside towns and cities, with farms and open space, is called…', a: 'rural', accept: ['rural', 'rural area', 'the countryside', 'countryside'], why: 'Rural areas are the countryside. Urban areas are towns and cities.' },
          { q: 'Which usually has more people: a town or a city?', a: 'a city', choices: ['a town', 'a city'], why: 'Cities are larger than towns. Calgary has over a million people. Most Alberta towns have a few thousand.' },
          { q: 'People moving from farms into cities is called…', a: 'urbanization', choices: ['urbanization', 'immigration', 'industry', 'confederation'], why: 'Urbanization means a growing share of people live in cities. "Urban" means city.' },
        ],
      },
      {
        name: 'Reading data',
        hint: 'Compare the numbers one step at a time. For "how much", subtract.',
        items: [
          { q: 'Alberta’s population:\n1941: 0.8 million\n1961: 1.3 million\n1981: 2.2 million\nDid it grow more from 1941 to 1961, or from 1961 to 1981?', a: '1961 to 1981', choices: ['1941 to 1961', '1961 to 1981'], why: '1941–1961: 1.3 − 0.8 = 0.5 million.\n1961–1981: 2.2 − 1.3 = 0.9 million.\nIt grew more from 1961 to 1981.' },
          { q: 'Oil was struck at Leduc, near Edmonton, in 1947. How many years after the end of the Second World War (1945) was that?', a: '2 years', n: 2, hint: timelineHint, why: '1947 − 1945 = 2 years.' },
          { q: 'A graph shows Calgary’s population:\n1951: 129 000\n1971: 403 000\nAbout how many people were added?', a: 'about 274 000', n: 274000, why: '403 000 − 129 000 = 274 000 people.' },
        ],
      },
      {
        name: 'Opinions with reasons',
        hint: 'A strong opinion says what you think AND gives a reason or evidence.',
        items: [
          { q: 'Which statement gives an opinion AND a reason?', a: 'Cities should build more bike lanes because they cut traffic and pollution.', choices: ['Cities should build more bike lanes because they cut traffic and pollution.', 'Cities should build more bike lanes.', 'Calgary has bike lanes.', 'Bike lanes are painted green.'], why: 'The first one says what should happen and why. The second has no reason. The last two are facts, not opinions.' },
          { q: 'Which of these is a fact, not an opinion?', a: 'Edmonton is the capital of Alberta.', choices: ['Edmonton is the capital of Alberta.', 'Edmonton is the best city in Alberta.', 'Suburbs are ugly.', 'Everyone should live downtown.'], why: 'A fact can be checked and proven. The others are opinions: people can disagree.' },
          { q: '"Building the pipeline was a good idea." Which is the best evidence to support this opinion?', a: 'It created thousands of jobs, according to government data.', choices: ['It created thousands of jobs, according to government data.', 'My uncle likes pipelines.', 'Pipelines are long.', 'Everybody knows it was good.'], why: 'Evidence is a fact from a source you can check. The other choices are feelings or not related.' },
        ],
      },
      {
        name: 'Economic questions (Grade 8)',
        hint: 'Every economy must decide what to make, how to make it, and who gets it.',
        items: [
          { q: 'Which is one of the three questions every economy must answer?', a: 'What should we produce?', choices: ['What should we produce?', 'Who is the prime minister?', 'What is the weather?', 'How many provinces are there?'], why: 'The three economic questions: What to produce? How to produce it? Who gets it?' },
          { q: 'Canada has some free markets and some government programs. What kind of economy is that?', a: 'a mixed economy', choices: ['a mixed economy', 'a command economy', 'a traditional economy', 'a pure market economy'], why: 'A mixed economy combines private businesses with government services and rules.' },
        ],
      },
    ],
  },
  {
    id: 'independence-democratic-rights', name: 'Independence and Democratic Rights', num: 2,
    summary: 'Canada and Britain, laws and courts, timelines, democratic rights',
    skills: [
      {
        name: 'Canada and Britain',
        hint: 'Canada began as British colonies that joined together in 1867.',
        items: [
          { q: 'Before 1867, the colonies that became Canada were ruled by which country?', a: 'Britain', accept: ['britain', 'great britain', 'england', 'the united kingdom', 'uk', 'the uk', 'united kingdom', 'the british'], why: 'They were British colonies, part of the British Empire.' },
          { q: 'In what year did Confederation create Canada?', a: '1867', n: 1867, why: 'Confederation happened on July 1, 1867, which is why we celebrate Canada Day on July 1.' },
          { q: 'Who was Canada’s first prime minister?', a: 'John A. Macdonald', accept: ['john a macdonald', 'macdonald', 'sir john a macdonald', 'john macdonald', 'sir john a'], why: 'Sir John A. Macdonald became prime minister in 1867.' },
        ],
      },
      {
        name: 'Laws and courts',
        hint: 'Parliament and legislatures make laws. Courts decide what laws mean when people disagree.',
        items: [
          { q: 'When people disagree about what a law means, who decides?', a: 'the courts (judges)', choices: ['the courts (judges)', 'the police', 'the newspaper', 'the people who are arguing'], why: 'Judges interpret laws and settle disputes about them.' },
          { q: 'Who makes Canada’s federal laws?', a: 'Parliament', choices: ['Parliament', 'the courts', 'the police', 'the Governor General alone'], why: 'Parliament (the House of Commons and the Senate) passes federal laws.' },
          { q: 'What is the highest court in Canada?', a: 'the Supreme Court of Canada', accept: ['supreme court', 'the supreme court', 'supreme court of canada'], why: 'The Supreme Court of Canada has the final say on what laws mean.' },
        ],
      },
      {
        name: 'Reading a timeline',
        hint: timelineHint,
        items: [
          { q: 'Which came first: the First World War starting (1914), Confederation (1867), or the Statute of Westminster (1931)?', a: 'Confederation (1867)', choices: ['Confederation (1867)', 'First World War (1914)', 'Statute of Westminster (1931)'], why: '1867 is the earliest year on the list.' },
          { q: 'How many years passed between Confederation (1867) and the Statute of Westminster (1931)?', a: '64 years', n: 64, why: '1931 − 1867 = 64 years.' },
          { q: 'The First World War lasted from 1914 to 1918. How many years is that?', a: '4 years', n: 4, why: '1918 − 1914 = 4 years.' },
        ],
      },
      {
        name: 'Democratic rights',
        hint: 'Democratic rights are about taking part in government, such as voting and running in elections.',
        items: [
          { q: 'Which of these is a democratic right?', a: 'voting in an election', choices: ['voting in an election', 'owning a pet', 'choosing your job', 'going to the movies'], why: 'Democratic rights let citizens choose and take part in government.' },
          { q: 'Today, who can vote in a Canadian federal election?', a: 'citizens who are 18 or older', choices: ['citizens who are 18 or older', 'only men who own land', 'anyone who lives in Canada, any age', 'only people born in Canada'], why: 'Every Canadian citizen 18 or older can vote. It was not always that way, as this unit shows.' },
          { q: 'How do Canadians choose the prime minister?', a: 'The leader of the party that wins the most seats usually becomes PM.', choices: ['The leader of the party that wins the most seats usually becomes PM.', 'Everyone votes directly for the prime minister.', 'The King picks whoever he likes.', 'The Supreme Court chooses.'], why: 'Canadians elect MPs. The party with the most seats usually forms government, and its leader becomes PM.' },
        ],
      },
    ],
  },
  {
    id: 'canada-in-wwii', name: 'Canada in WWII', num: 3,
    summary: 'The war at a glance, Remembrance Day, the map of Europe, perspectives, totalitarianism',
    skills: [
      {
        name: 'The war at a glance',
        hint: 'The Second World War lasted from 1939 to 1945. The Allies fought Nazi Germany and its partners.',
        items: [
          { q: 'In what year did the Second World War begin?', a: '1939', n: 1939, why: 'Germany invaded Poland on September 1, 1939. Britain and France declared war two days later, and Canada on September 10.' },
          { q: 'Which side was Canada on?', a: 'the Allies', choices: ['the Allies', 'the Axis', 'neither side'], why: 'Canada fought with the Allies: Britain, France, and later the Soviet Union and the United States.' },
          { q: 'Which country was led by Adolf Hitler and the Nazi Party?', a: 'Germany', accept: ['germany', 'nazi germany'], why: 'Hitler led Nazi Germany from 1933 to 1945.' },
        ],
      },
      {
        name: 'Remembrance Day',
        hint: 'Remembrance Day honours people who served and died in war.',
        items: [
          { q: 'On what date is Remembrance Day?', a: 'November 11', accept: ['november 11', 'nov 11', '11 november', 'november 11th', 'nov 11th', '11/11'], why: 'The First World War fighting stopped at 11 a.m. on November 11, 1918. We pause at that time every year.' },
          { q: 'What flower do Canadians wear for Remembrance Day?', a: 'the poppy', accept: ['poppy', 'poppies', 'a red poppy', 'red poppy'], why: 'The poppy comes from the poem "In Flanders Fields", written by Canadian doctor John McCrae.' },
          { q: 'Why do Canadians mark Remembrance Day?', a: 'to honour people who served and died in war', choices: ['to honour people who served and died in war', 'to celebrate winning wars', 'to mark the start of winter', 'to celebrate Confederation'], why: 'It is a day to remember the cost of war and the people who served.' },
        ],
      },
      {
        name: 'The map of Europe',
        hint: 'Picture Europe: Britain is an island in the northwest; France is just south across the English Channel.',
        items: [
          { q: 'Which country is just across the English Channel from Britain?', a: 'France', choices: ['France', 'Italy', 'Poland', 'Spain'], why: 'France is just south of Britain across the Channel. D-Day landed in Normandy, France, in 1944.' },
          { q: 'Italy is in which part of Europe?', a: 'the south', choices: ['the south', 'the far north', 'the far east', 'the west coast of Britain'], why: 'Italy is a boot-shaped peninsula reaching into the Mediterranean Sea in southern Europe.' },
          { q: 'The Netherlands is a small country on the North Sea. Which large country borders it to the east?', a: 'Germany', choices: ['Germany', 'Spain', 'Italy', 'Russia'], why: 'Germany borders the Netherlands to the east. Canadians helped free the Netherlands in 1945.' },
        ],
      },
      {
        name: 'Different perspectives',
        hint: 'People can see the same event differently because of who they are and what happened to them.',
        items: [
          { q: 'A soldier and a factory worker at home both describe 1943 very differently. Why?', a: 'They had different experiences of the war.', choices: ['They had different experiences of the war.', 'One of them must be lying.', 'People forget everything after the war.', 'Only soldiers know what happened.'], why: 'Each person saw a different part of the war, so both accounts can be true.' },
          { q: 'Why is it useful to read more than one account of an event?', a: 'Each account shows a different part of what happened.', choices: ['Each account shows a different part of what happened.', 'It makes the essay longer.', 'Two accounts always agree.', 'It isn’t useful.'], why: 'Comparing accounts gives a fuller picture and shows whose voices might be missing.' },
        ],
      },
      {
        name: 'Totalitarianism (Grade 8)',
        hint: 'Totalitarian governments try to control every part of people’s lives.',
        items: [
          { q: 'A government that controls almost every part of people’s lives, with no free elections, is called…', a: 'totalitarian', choices: ['totalitarian', 'democratic', 'federal', 'multicultural'], why: 'Totalitarian governments allow no opposition and control the media, schools and jobs.' },
          { q: 'Nazi Germany was an example of…', a: 'a totalitarian dictatorship', choices: ['a totalitarian dictatorship', 'a democracy', 'a constitutional monarchy like Canada', 'a traditional economy'], why: 'Hitler’s Nazi Party banned other parties, controlled the media and persecuted Jewish people and many other groups.' },
        ],
      },
    ],
  },
  {
    id: 'postwar-canada', name: 'Post-War Canada', num: 4,
    summary: 'Government programs, allies, First Nations, Métis and Inuit, comparing viewpoints',
    skills: [
      {
        name: 'Government programs',
        hint: 'A government program is a service paid for with tax money.',
        items: [
          { q: 'Which of these is a government program?', a: 'public schools', choices: ['public schools', 'a movie theatre', 'a pizza restaurant', 'a sports team'], why: 'Public schools are run and paid for by government, using taxes.' },
          { q: 'Where does the money for government programs come from?', a: 'taxes', accept: ['tax', 'taxes', 'taxpayers', 'from taxes', 'tax money'], why: 'Governments collect taxes from people and businesses to pay for programs.' },
          { q: 'When a government spends more than it collects in one year, it has a…', a: 'deficit', choices: ['deficit', 'surplus', 'profit', 'treaty'], why: 'Spending more than you collect is a deficit. Collecting more than you spend is a surplus.' },
        ],
      },
      {
        name: 'Allies and partners',
        hint: 'An ally is a country that agrees to support another, especially in war.',
        items: [
          { q: 'What is an ally?', a: 'a country that agrees to help and support another', choices: ['a country that agrees to help and support another', 'an enemy country', 'a type of army', 'a small town'], why: 'Allies work together, often agreeing to defend each other.' },
          { q: 'Which country is Canada’s closest neighbour and biggest trading partner?', a: 'the United States', choices: ['the United States', 'Mexico', 'Britain', 'China'], why: 'Canada and the U.S. share the world’s longest border and trade more with each other than with anyone else.' },
          { q: 'Canada joined the United Nations in 1945. What is the UN’s main goal?', a: 'to keep peace between countries', choices: ['to keep peace between countries', 'to run Canada’s government', 'to organise the Olympics', 'to sell goods'], why: 'The UN was founded after the Second World War to prevent another world war.' },
        ],
      },
      {
        name: 'First Nations, Métis and Inuit',
        hint: 'Canada’s Constitution recognises three groups of Indigenous peoples: First Nations, Métis and Inuit.',
        items: [
          { q: 'Which Indigenous people have lived in the Arctic for thousands of years?', a: 'Inuit', choices: ['Inuit', 'Métis', 'Cree', 'Blackfoot'], why: 'Inuit homelands are in the Arctic, including Nunavut.' },
          { q: 'Treaties are agreements between First Nations and…', a: 'the Crown (the Canadian government)', choices: ['the Crown (the Canadian government)', 'other First Nations only', 'the United States', 'private companies'], why: 'The numbered treaties were signed between First Nations and the Crown.' },
          { q: 'Edmonton is on the land of which treaty?', a: 'Treaty 6', choices: ['Treaty 6', 'Treaty 7', 'Treaty 8', 'Treaty 1'], why: 'Edmonton is in Treaty 6 territory (1876). Calgary is in Treaty 7, and northern Alberta is in Treaty 8.' },
          { q: 'The Métis are a distinct people. Their roots come from…', a: 'both First Nations and European ancestors', choices: ['both First Nations and European ancestors', 'only French settlers', 'the Arctic only', 'people who arrived after 1945'], why: 'The Métis Nation grew in the fur trade era, especially around Red River, with its own language (Michif) and culture.' },
        ],
      },
      {
        name: 'Comparing viewpoints',
        hint: 'Ask: who is speaking, and how does the event affect them?',
        items: [
          { q: 'A new dam floods a valley. An electricity company and a First Nation that hunted in the valley see it very differently. What best explains this?', a: 'The dam affects each group in different ways.', choices: ['The dam affects each group in different ways.', 'One group doesn’t understand dams.', 'Only the company’s view matters.', 'People always disagree for no reason.'], why: 'The company gains power to sell. The First Nation loses land it relied on. Their viewpoints come from how the change affects them.' },
          { q: 'You are comparing two viewpoints. Which question should you ask first?', a: 'Who is speaking, and what do they gain or lose?', choices: ['Who is speaking, and what do they gain or lose?', 'Which one is longer?', 'Which one agrees with me?', 'Which one is older?'], why: 'Knowing who is speaking and what is at stake for them helps you understand why they see it that way.' },
        ],
      },
    ],
  },
  {
    id: 'modern-economy', name: 'Building a Modern Economy', num: 5,
    summary: 'Supply and demand, taxes and deficits, imports and exports, reading a line graph',
    skills: [
      {
        name: 'Scarcity, supply and demand',
        hint: 'If more people want something (demand) and there isn’t more of it (supply), the price usually goes up.',
        items: [
          { q: 'There is never enough of everything for everyone to have all they want. This is called…', a: 'scarcity', choices: ['scarcity', 'a surplus', 'inflation', 'a tariff'], why: 'Scarcity is why every economy has to make choices.' },
          { q: 'A new phone comes out and everyone wants one, but stores have only a few. What usually happens to the price?', a: 'It goes up.', choices: ['It goes up.', 'It goes down.', 'It stays exactly the same.'], why: 'High demand and low supply push prices up.' },
          { q: 'A farm harvest is huge and stores have far more apples than people want. What usually happens to apple prices?', a: 'They go down.', choices: ['They go up.', 'They go down.', 'They stay exactly the same.'], why: 'When supply is bigger than demand, sellers lower prices to sell what they have.' },
        ],
      },
      {
        name: 'Taxes, deficits and debt',
        hint: 'Deficit: spending more than you collect in one year. Debt: the total owed from all the years added up.',
        items: [
          { q: 'A government collects $50 billion and spends $55 billion this year. Does it have a surplus or a deficit?', a: 'a deficit', choices: ['a surplus', 'a deficit'], why: 'It spent $5 billion more than it collected, so it has a $5 billion deficit.' },
          { q: 'A government collects more than it spends in a year. That is a…', a: 'surplus', choices: ['surplus', 'deficit', 'debt', 'tax'], why: 'Money left over at the end of the year is a surplus.' },
          { q: 'The total amount a government owes from all its past deficits is its…', a: 'debt', choices: ['debt', 'deficit', 'surplus', 'budget'], why: 'Each deficit adds to the debt. A deficit is one year; the debt is the running total.' },
        ],
      },
      {
        name: 'Imports and exports',
        hint: 'Export: Canada sells it to another country. Import: Canada buys it from another country.',
        items: [
          importExport('Alberta sells oil to the United States.', 'an export', 'Canada is selling, so it is an export.'),
          importExport('A grocery store in Red Deer buys bananas from Ecuador.', 'an import', 'Canada is buying from another country, so it is an import.'),
          importExport('A Saskatchewan farm sells wheat to Japan.', 'an export', 'Canada is selling, so it is an export.'),
          importExport('A Canadian family buys a car built in Germany.', 'an import', 'The car is made in another country and bought here, so it is an import.'),
        ],
      },
      {
        name: 'Reading a line graph',
        hint: 'Find each year on the graph, then compare the values.',
        items: [
          { q: 'A line graph shows the share of Canadian workers without a job:\n1929: 3%   1933: 19%   1939: 11%\nIn which year was unemployment highest?', a: '1933', n: 1933, why: '19% is the highest value, in 1933, the worst year of the Great Depression.' },
          { q: 'Unemployment in Canada:\n1929: 3%   1933: 19%\nBy how many percentage points did it rise?', a: '16', n: 16, why: '19 − 3 = 16 percentage points.' },
          { q: 'Unemployment in Canada:\n1933: 19%   1939: 11%\nIs the line going up or down between 1933 and 1939?', a: 'down', choices: ['up', 'down'], why: '11 is less than 19, so the line slopes down. Fewer people were out of work.' },
        ],
      },
      {
        name: 'Economic systems (Grade 8)',
        hint: 'Market: buyers and sellers decide. Command: the government decides. Mixed: some of both.',
        items: [
          { q: 'In which kind of economy does the government decide what is made and what it costs?', a: 'a command economy', choices: ['a command economy', 'a market economy', 'a traditional economy'], why: 'In a command economy, government planners decide.' },
          { q: 'Canada has private businesses and also public health care. What kind of economy does Canada have?', a: 'a mixed economy', choices: ['a mixed economy', 'a pure market economy', 'a command economy', 'a traditional economy'], why: 'Canada mixes free markets with government programs and rules.' },
        ],
      },
    ],
  },
  {
    id: 'system-of-government', name: 'System of Government', num: 6,
    summary: 'Federal and provincial governments, MPs and the PM, rules and laws, rights, local government',
    skills: [
      {
        name: 'Federal and provincial governments',
        hint: 'The federal government is in Ottawa. Each province has its own government in its capital.',
        items: [
          { q: 'In which city does Canada’s federal government meet?', a: 'Ottawa', accept: ['ottawa'], why: 'Parliament meets on Parliament Hill in Ottawa.' },
          { q: 'In which city does Alberta’s provincial government meet?', a: 'Edmonton', accept: ['edmonton'], why: 'Edmonton is Alberta’s capital. The Legislature Building is there.' },
          { q: 'Who leads Alberta’s provincial government?', a: 'the premier', choices: ['the premier', 'the prime minister', 'the mayor', 'the Governor General'], why: 'A province is led by a premier. Canada is led by the prime minister.' },
        ],
      },
      {
        name: 'MPs and the prime minister',
        hint: 'Canadians elect MPs. The leader of the party with the most MPs usually becomes prime minister.',
        items: [
          { q: 'What are the people elected to the House of Commons called?', a: 'Members of Parliament (MPs)', accept: ['mps', 'mp', 'members of parliament', 'member of parliament'], why: 'Each riding elects one Member of Parliament.' },
          { q: 'Do Canadians vote directly for the prime minister?', a: 'no', choices: ['yes', 'no'], why: 'Canadians vote for their local MP. The leader of the party with the most seats usually becomes PM.' },
          { q: 'A group of people who share ideas and run candidates in elections is called a…', a: 'political party', accept: ['party', 'political party', 'a party'], why: 'Examples include the Liberal, Conservative and New Democratic parties.' },
        ],
      },
      {
        name: 'Rules and laws',
        hint: 'A law is made by a government and applies to everyone. A rule is set by a family, school, team or business.',
        items: [
          ruleOrLaw('"You must be at least 14 to get a learner’s licence in Alberta"', 'a law', 'Alberta’s government sets licensing ages for everyone in the province.'),
          ruleOrLaw('"Library books are due in two weeks"', 'a rule', 'The library sets it for its own borrowers.'),
          ruleOrLaw('"Everyone must wear a seatbelt in a moving car"', 'a law', 'It is set by government and enforced by police.'),
        ],
      },
      {
        name: 'Rights in Canada',
        hint: 'The Canadian Charter of Rights and Freedoms (1982) lists the rights everyone in Canada has.',
        items: [
          { q: 'Which document protects rights like freedom of speech in Canada?', a: 'the Canadian Charter of Rights and Freedoms', choices: ['the Canadian Charter of Rights and Freedoms', 'the Indian Act', 'the Criminal Code', 'the Treaty of Paris'], why: 'The Charter became part of Canada’s Constitution in 1982.' },
          { q: 'Saying what you think about the government without being punished is called freedom of…', a: 'expression (speech)', accept: ['expression', 'speech', 'freedom of expression', 'freedom of speech', 'free speech'], why: 'The Charter calls it freedom of expression.' },
        ],
      },
      {
        name: 'Local government (Grade 6)',
        hint: 'Cities and towns have their own council, led by a mayor.',
        items: [
          { q: 'Who leads a city council?', a: 'the mayor', accept: ['mayor', 'a mayor', 'the mayor'], why: 'The mayor leads the city council.' },
          { q: 'Which level of government usually fixes potholes on city streets?', a: 'municipal (city or town)', choices: ['municipal (city or town)', 'provincial', 'federal'], why: 'Local streets are a municipal job. Highways are usually provincial.' },
        ],
      },
    ],
  },
  {
    id: 'evolving-citizenship', name: 'Evolving Citizenship', num: 7,
    summary: 'Rights and responsibilities, official languages, why people come to Canada, timelines, earlier units',
    skills: [
      {
        name: 'Rights and responsibilities',
        hint: 'A right is something you are free to do or have. A responsibility is something you should do for others.',
        items: [
          rightResp('voting in elections', 'a right', 'Voting is a democratic right for citizens 18 and over. Many also see it as a responsibility.'),
          rightResp('obeying Canada’s laws', 'a responsibility', 'Everyone in Canada has a duty to follow the law.'),
          rightResp('freedom of religion', 'a right', 'The Charter protects freedom of religion.'),
          rightResp('serving on a jury when called', 'a responsibility', 'Jury duty is a responsibility of citizens.'),
        ],
      },
      {
        name: 'Official languages',
        hint: 'Canada has two official languages.',
        items: [
          { q: 'What are Canada’s two official languages?', a: 'English and French', choices: ['English and French', 'English and Spanish', 'French and Cree', 'English and Mandarin'], why: 'English and French are Canada’s official languages. Many other languages, including Indigenous languages, are spoken here too.' },
          { q: 'Which province has the most French speakers?', a: 'Quebec', choices: ['Quebec', 'Alberta', 'British Columbia', 'Nova Scotia'], why: 'Most people in Quebec speak French as their first language.' },
        ],
      },
      {
        name: 'Why people come to Canada',
        hint: 'People come to Canada for work, for family, to study, or to escape danger.',
        items: [
          { q: 'A family leaves Syria because of a war and is welcomed to Canada. What is their main reason for coming?', a: 'safety', choices: ['safety', 'a job', 'school', 'a holiday'], why: 'They are escaping danger. People who flee war or persecution may be accepted as refugees.' },
          { q: 'A nurse from the Philippines moves to Calgary because hospitals need nurses. What is her main reason?', a: 'work', choices: ['safety', 'work', 'family', 'a holiday'], why: 'A job opportunity is pulling her to Canada.' },
          { q: 'A student from India comes to study at the University of Alberta for four years. What is her main reason?', a: 'school', choices: ['safety', 'work', 'school', 'family'], why: 'She is coming to study.' },
        ],
      },
      {
        name: 'Reading a timeline',
        hint: timelineHint,
        items: [
          { q: 'Which came first: the Charter (1982), the Persons Case (1929), or the Official Languages Act (1969)?', a: 'the Persons Case (1929)', choices: ['the Persons Case (1929)', 'the Official Languages Act (1969)', 'the Charter (1982)'], why: '1929 is the earliest year.' },
          { q: 'How many years passed between the end of the Second World War (1945) and the Charter (1982)?', a: '37 years', n: 37, why: '1982 − 1945 = 37 years.' },
          { q: 'Canada’s multiculturalism policy began in 1971. How many years before the Charter (1982) was that?', a: '11 years', n: 11, why: '1982 − 1971 = 11 years.' },
        ],
      },
      {
        name: 'Earlier units',
        hint: 'Think back to the Persons Case and post-war immigration.',
        items: [
          { q: 'In the Persons Case (1929), what was decided?', a: 'Women are "persons" under the law and can be appointed to the Senate.', choices: ['Women are "persons" under the law and can be appointed to the Senate.', 'Women can vote in federal elections.', 'Canada became independent.', 'Everyone became a Canadian citizen.'], why: 'Women in most of Canada could already vote. The Persons Case meant women could hold offices like Senator.' },
          { q: 'A policy that supports people keeping their cultures and languages while being Canadian is called…', a: 'multiculturalism', choices: ['multiculturalism', 'urbanization', 'confederation', 'free trade'], why: 'Canada adopted a multiculturalism policy in 1971.' },
        ],
      },
    ],
  },
];
