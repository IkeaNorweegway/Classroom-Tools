import { sortQ, type PracticeUnit } from './types';

// Prereqs for Social Studies 8 come from Grades 6 and 7:
// see "comesFrom" and "assumed" in src/content/parent-guides/social8/.

const ruleOrLaw = (thing: string, a: 'a rule' | 'a law', why: string) => sortQ(thing, ['a rule', 'a law'], a, why);
const needWant = (thing: string, a: 'a need' | 'a want', why: string) => sortQ(thing, ['a need', 'a want'], a, why);
const goodService = (thing: string, a: 'a good' | 'a service', why: string) => sortQ(thing, ['a good', 'a service'], a, why);
const rightResp = (thing: string, a: 'a right' | 'a responsibility', why: string) => sortQ(thing, ['a right', 'a responsibility'], a, why);

const mainIdea = (text: string, a: string, others: string[], why: string) =>
  ({ q: `Read the text. What is the main idea?\n\n"${text}"`, a, choices: [a, ...others], why });

export const social8Practice: PracticeUnit[] = [
  {
    id: 'ideologies', name: 'Ideologies', num: 1,
    summary: 'Democracy, rights, rules and laws, finding the main idea',
    skills: [
      {
        name: 'Democracy',
        hint: 'In a democracy, the people choose their leaders by voting.',
        items: [
          { q: 'In a democracy, who chooses the leaders?', a: 'the people, by voting', choices: ['the people, by voting', 'the king or queen', 'the army', 'the richest families'], why: 'Democracy means "rule by the people". Citizens vote to choose who leads.' },
          { q: 'Canada chooses its leaders in elections. What kind of country is Canada?', a: 'a democracy', choices: ['a democracy', 'a dictatorship', 'an empire'], why: 'Canadians vote in free elections, so Canada is a democracy.' },
          { q: 'What do citizens do in an election?', a: 'vote', accept: ['they vote', 'voting', 'vote for leaders', 'cast a ballot', 'cast ballots'], why: 'In an election, citizens vote for the people they want to represent them.' },
        ],
      },
      {
        name: 'Rights',
        hint: 'A right is a freedom that everyone has and that the law protects.',
        items: [
          { q: 'Which of these is a right that people in Canada have?', a: 'freedom of speech', choices: ['freedom of speech', 'free video games', 'skipping school', 'driving at age 10'], why: 'Freedom of speech, the freedom to say what you think, is protected in Canada.' },
          { q: 'Saying what you think about the government without being arrested is called freedom of…', a: 'speech (expression)', accept: ['speech', 'expression', 'freedom of speech', 'freedom of expression', 'free speech'], why: 'Freedom of speech, also called freedom of expression, protects people who share their opinions.' },
          { q: 'Being able to follow any religion, or none, is called…', a: 'freedom of religion', choices: ['freedom of religion', 'freedom of speech', 'the right to vote', 'equality'], why: 'Freedom of religion lets people choose their own beliefs.' },
        ],
      },
      {
        name: 'Rules and laws',
        hint: 'A law is made by a government and applies to everyone. A rule is set by a family, school, team or business.',
        items: [
          ruleOrLaw('"No hats in the classroom"', 'a rule', 'A school sets it, and it only applies at that school. That makes it a rule.'),
          ruleOrLaw('"Drivers must stop at a red light"', 'a law', 'A government made it, and it applies to every driver. That makes it a law.'),
          ruleOrLaw('"Bedtime is 9:30 on school nights"', 'a rule', 'A family sets it, and it only applies in that home. That makes it a rule.'),
          ruleOrLaw('"You may not steal from a store"', 'a law', 'Stealing is against the law everywhere in Canada.'),
          { q: 'Why do communities have laws?', a: 'to keep people safe and treat them fairly', choices: ['to keep people safe and treat them fairly', 'to make the government rich', 'so leaders never have to listen', 'to stop people from having fun'], why: 'Laws organise how a community works and protect people and their rights.' },
        ],
      },
      {
        name: 'Finding the main idea',
        hint: 'The main idea is what the whole text is mostly about, not just one detail.',
        items: [
          mainIdea('In ancient Athens, citizens met to vote on laws themselves. But only free men could take part. Women, enslaved people and people born outside Athens had no vote.', 'Athens had democracy, but only some people could take part.', ['Athens had many enslaved people.', 'Women in Athens were happy.', 'Athens was a large city.'], 'Every sentence is about who could and could not take part in Athens’ democracy.'),
          mainIdea('Some people think the community matters most and that we should share. Others think each person should be free to make their own choices. Many big arguments in politics come from these two views.', 'People disagree about whether the group or the individual should come first.', ['Sharing is always good.', 'Politics is boring.', 'Everyone agrees about freedom.'], 'The text sets out two views (group first, individual first) and says they cause arguments.'),
          mainIdea('Canada’s Charter of Rights and Freedoms protects freedom of speech, freedom of religion and the right to vote. It became law in 1982. Courts use it to decide if other laws are fair.', 'The Charter protects people’s rights in Canada.', ['The Charter was written in 1982.', 'Courts are important.', 'Canada has many laws.'], 'The year and the courts are details. The main idea is that the Charter protects rights.'),
        ],
      },
    ],
  },
  {
    id: 'economic-systems', name: 'Economic Systems', num: 2,
    summary: 'Needs and wants, goods and services, government services, reading graphs',
    skills: [
      {
        name: 'Needs and wants',
        hint: 'A need is something you must have to live safely. A want is something nice to have.',
        items: [
          needWant('clean drinking water', 'a need', 'You cannot live without water, so it is a need.'),
          needWant('a new video game', 'a want', 'A game is fun, but you can live without it, so it is a want.'),
          needWant('a warm winter coat in Alberta', 'a need', 'Alberta winters can drop below −30 °C. A warm coat keeps you safe.'),
          needWant('a concert ticket', 'a want', 'A concert is fun, but you can live without it.'),
          needWant('a safe place to live', 'a need', 'Shelter is a basic need.'),
        ],
      },
      {
        name: 'Goods and services',
        hint: 'A good is a thing you can hold. A service is work someone does for you.',
        items: [
          goodService('a haircut', 'a service', 'A barber does work for you. You don’t take home an object.'),
          goodService('a loaf of bread', 'a good', 'Bread is a thing you can hold and take home.'),
          goodService('a bus ride', 'a service', 'The driver does the work of taking you somewhere.'),
          goodService('a pair of running shoes', 'a good', 'Shoes are a thing you can hold.'),
          { q: 'People trade money for goods and…', a: 'services', accept: ['service'], why: 'Money buys goods (things) and services (work people do for us).' },
        ],
      },
      {
        name: 'What governments provide',
        hint: 'Governments use tax money to pay for things everyone shares.',
        items: [
          { q: 'Who pays for public schools, hospitals and highways?', a: 'governments, using taxes', choices: ['governments, using taxes', 'the students', 'only rich people', 'nobody, they are free to build'], why: 'Governments collect taxes and use that money to pay for shared services.' },
          { q: 'Which of these is NOT usually paid for by government?', a: 'a video game console', choices: ['a video game console', 'a public school', 'a hospital', 'a highway'], why: 'People buy game consoles for themselves. Schools, hospitals and highways are shared services.' },
          { q: 'Money that people and businesses pay to the government is called…', a: 'taxes', accept: ['tax', 'taxes'], why: 'Taxes pay for government services.' },
        ],
      },
      {
        name: 'Reading graphs',
        hint: 'Read each value carefully. For "how many more", subtract.',
        items: [
          { q: 'A bar graph shows lemonade cups sold:\nMon 12, Tue 18, Wed 9, Thu 15.\nWhich day sold the most?', a: 'Tuesday', accept: ['tue', 'tues'], why: '18 is the tallest bar, so Tuesday sold the most.' },
          { q: 'A bar graph shows lemonade cups sold:\nMon 12, Tue 18, Wed 9, Thu 15.\nHow many more cups sold on Tuesday than on Wednesday?', a: '9', n: 9, why: '18 − 9 = 9 more cups.' },
          { q: 'A line graph shows the price of a movie ticket:\n2000: $8, 2010: $11, 2020: $13.\nIs the price going up or down?', a: 'up', choices: ['up', 'down', 'staying the same'], why: 'Each number is bigger than the one before, so the line goes up.' },
          { q: 'A line graph shows the price of a movie ticket:\n2000: $8, 2020: $13.\nBy how many dollars did the price rise?', a: '$5', n: 5, why: '13 − 8 = $5.' },
        ],
      },
    ],
  },
  {
    id: 'political-systems', name: 'Political Systems', num: 3,
    summary: 'Leaders in Canada, elections, rules and laws, Canada and the U.S.',
    skills: [
      {
        name: 'Leaders in Canada',
        hint: 'Each level of government has its own leader: Canada, the province, and the city or town.',
        items: [
          { q: 'What is the leader of Canada’s government called?', a: 'the prime minister', choices: ['the prime minister', 'the premier', 'the president', 'the mayor'], why: 'Canada’s government is led by the prime minister.' },
          { q: 'What is the leader of Alberta’s government called?', a: 'the premier', choices: ['the prime minister', 'the premier', 'the governor', 'the mayor'], why: 'Each province’s government is led by a premier.' },
          { q: 'What is the leader of a city council called?', a: 'the mayor', choices: ['the prime minister', 'the premier', 'the mayor', 'the chief justice'], why: 'A city or town council is led by a mayor (in some places, a reeve).' },
        ],
      },
      {
        name: 'Elections',
        hint: 'In an election, voters choose people to represent them.',
        items: [
          { q: 'In an election, people vote for a…', a: 'candidate', accept: ['candidate', 'person', 'representative', 'politician'], why: 'A candidate is a person who is running in the election.' },
          { q: 'Why is voting done in secret, behind a screen?', a: 'so no one can pressure you about your choice', choices: ['so no one can pressure you about your choice', 'so voting is faster', 'so the government can save paper', 'because it is a tradition with no reason'], why: 'A secret ballot means no one can punish or reward you for how you voted.' },
          { q: 'Three candidates run. A gets 400 votes, B gets 650, C gets 300. Who wins?', a: 'B', choices: ['A', 'B', 'C'], why: 'In Canadian elections, the candidate with the most votes wins. 650 is the most.' },
        ],
      },
      {
        name: 'Rules and laws',
        hint: 'A law is made by a government and applies to everyone. A rule is set by a family, school, team or business.',
        items: [
          ruleOrLaw('"The speed limit on this street is 50 km/h"', 'a law', 'A government sets speed limits, and police can give a ticket for breaking them.'),
          ruleOrLaw('"No phones at the dinner table"', 'a rule', 'A family sets it for their own home.'),
          ruleOrLaw('"Only 5 players per team on the court"', 'a rule', 'A sports league sets it for its own games.'),
          { q: 'What can happen if someone breaks a law?', a: 'They can be fined or charged by police.', choices: ['They can be fined or charged by police.', 'Nothing at all.', 'Their teacher gives them a detention.', 'They must move to another country.'], why: 'Laws are enforced by police and courts. Breaking one can lead to a fine or a criminal charge.' },
        ],
      },
      {
        name: 'Canada and the United States',
        hint: 'Canada and the U.S. are both democracies, but their governments are set up differently.',
        items: [
          { q: 'What is the leader of the United States called?', a: 'the president', choices: ['the president', 'the prime minister', 'the premier', 'the king'], why: 'The U.S. is led by a president.' },
          { q: 'Does Canada have a president?', a: 'no', choices: ['yes', 'no'], why: 'Canada has a prime minister, not a president.' },
          { q: 'What is the capital city of Canada?', a: 'Ottawa', accept: ['ottawa'], why: 'Ottawa, Ontario, is where Parliament meets.' },
          { q: 'The U.S. is divided into states. What is Canada divided into?', a: 'provinces and territories', choices: ['provinces and territories', 'states', 'counties only', 'kingdoms'], why: 'Canada has 10 provinces and 3 territories.' },
        ],
      },
    ],
  },
  {
    id: 'civic-engagement', name: 'Civic Engagement', num: 4,
    summary: 'Democracy, rights and responsibilities, solving community problems, reliable sources',
    skills: [
      {
        name: 'Democracy in Canada',
        hint: 'In a democracy, citizens have a say in decisions.',
        items: [
          { q: 'In a democracy, how do citizens choose their leaders?', a: 'by voting', accept: ['voting', 'vote', 'elections', 'by elections', 'in elections', 'by voting in elections'], why: 'Citizens vote in elections to choose who represents them.' },
          { q: 'Which of these is a way citizens take part in a democracy?', a: 'voting in an election', choices: ['voting in an election', 'ignoring the news', 'never paying taxes', 'letting one person decide everything'], why: 'Voting is the best-known way. You will learn many more ways in this unit.' },
          { q: 'Who makes decisions about local parks, garbage pick-up and bus routes?', a: 'the city or town council', choices: ['the city or town council', 'the prime minister', 'the King', 'the school principal'], why: 'Local services are decided by the municipal (city or town) council.' },
        ],
      },
      {
        name: 'Rights and responsibilities',
        hint: 'A right is something you are free to do or have. A responsibility is something you should do for others.',
        items: [
          rightResp('freedom of religion', 'a right', 'You are free to follow any religion, or none.'),
          rightResp('obeying the law', 'a responsibility', 'Everyone has a duty to follow the law.'),
          rightResp('respecting other people’s rights', 'a responsibility', 'Your rights come with a duty to respect everyone else’s.'),
          rightResp('a fair trial', 'a right', 'Anyone charged with a crime has the right to a fair trial.'),
          rightResp('serving on a jury when called', 'a responsibility', 'Jury duty is a civic responsibility. Citizens help decide court cases.'),
        ],
      },
      {
        name: 'Working together on problems',
        hint: 'Look for the choice where people work together to fix the problem.',
        items: [
          { q: 'The park near your school is full of litter. Which is an example of people working together to fix it?', a: 'Students and neighbours hold a clean-up day.', choices: ['Students and neighbours hold a clean-up day.', 'Everyone stops going to the park.', 'One person complains online.', 'People wait for it to fix itself.'], why: 'A clean-up day brings people together to solve the problem.' },
          { q: 'A busy street near a school has no crosswalk. What is a good first step?', a: 'Write to city council asking for one.', choices: ['Write to city council asking for one.', 'Paint a crosswalk yourself.', 'Do nothing; it’s not your job.', 'Run across quickly.'], why: 'The city council decides on crosswalks. Writing to them is a safe, effective way to take part.' },
        ],
      },
      {
        name: 'Reliable sources',
        hint: 'A reliable source has a named author or organisation, a date, and a reason to get the facts right.',
        items: [
          { q: 'You want facts about who can vote in Canada. Which source is most reliable?', a: 'the Elections Canada website', choices: ['the Elections Canada website', 'a TikTok video with no source', 'a blog with no author', 'an ad for a political party'], why: 'Elections Canada runs federal elections, so it has the official facts.' },
          { q: 'Which is a sign a website might NOT be reliable?', a: 'No author, no date, and lots of ads', choices: ['No author, no date, and lots of ads', 'It names its author', 'It lists its sources', 'It is run by a government or university'], why: 'Without an author, date or sources, you can’t check who wrote it or if it is up to date.' },
          { q: 'Two websites disagree about a fact. What should you do?', a: 'Check a third reliable source.', choices: ['Check a third reliable source.', 'Believe the one you saw first.', 'Believe the one with more pictures.', 'Give up.'], why: 'Comparing several reliable sources helps you find out which one is right.' },
        ],
      },
    ],
  },
];
