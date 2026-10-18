// Grade 6 Science prereq practice questions, used by sci6-<unit>-prereq-practice-v1.html.
// Question fields are described at the top of practice.js. Every skill needs at least two questions.
(function () {
'use strict';

// Prereqs for Grade 6 Science come from earlier grades and Grade 5:
// see "comesFrom" and "assumed" in src/content/parent-guides/science6/.

const state = (thing, a, why) =>
  ({ q: `Is ${thing} a solid, a liquid or a gas?`, a, choices: ['solid', 'liquid', 'gas'], why });

const pushPull = (action, a, why) => PrereqPractice.sortQ(action, ['a push', 'a pull'], `a ${a}`, why);

const living = (thing, a, why) => PrereqPractice.sortQ(thing, ['living', 'non-living'], a, why);

window.PracticeBank = { units: [
  {
    id: 'matter', name: 'Matter', num: 1,
    summary: 'States of matter, reading a thermometer, water at 0 °C and 100 °C, measuring mass',
    skills: [
      {
        name: 'Solids, liquids and gases',
        hint: 'A solid keeps its shape. A liquid takes the shape of its container. A gas spreads out to fill any space.',
        items: [
          state('an ice cube', 'solid', 'An ice cube keeps its own shape, so it is a solid.'),
          state('orange juice', 'liquid', 'Juice pours and takes the shape of the glass, so it is a liquid.'),
          state('the air inside a balloon', 'gas', 'Air spreads out to fill the whole balloon, so it is a gas.'),
          state('steam from a kettle', 'gas', 'Steam is water as a gas. It spreads out into the room.'),
          state('a wooden spoon', 'solid', 'A spoon keeps its shape whatever it sits in, so it is a solid.'),
          state('maple syrup', 'liquid', 'Syrup is thick, but it still pours and takes the shape of its container. It is a liquid.'),
        ],
      },
      {
        name: 'Reading a thermometer',
        hint: 'Find a numbered line, then count the small lines up (warmer) or down (colder). Check how many degrees each small line is worth.',
        items: [
          { q: 'Each small line on a thermometer is 2 °C. The red liquid stops 3 lines above 20 °C. What is the temperature in °C?', a: '26 °C', n: 26, why: '3 lines × 2 °C = 6 °C.\n20 + 6 = 26 °C.' },
          { q: 'Each small line is 1 °C. The red liquid stops 4 lines below 0 °C. What is the temperature in °C?', a: '−4 °C', n: -4, why: 'Below zero means negative.\n4 lines × 1 °C = 4 °C below zero, so −4 °C.' },
          { q: 'Each small line is 5 °C. The red liquid stops 2 lines above 30 °C. What is the temperature in °C?', a: '40 °C', n: 40, why: '2 lines × 5 °C = 10 °C.\n30 + 10 = 40 °C.' },
          { q: 'Which is colder: −5 °C or 2 °C?', a: '−5 °C', choices: ['−5 °C', '2 °C'], why: 'Below zero is colder than above zero. −5 °C is 7 degrees colder than 2 °C.' },
        ],
      },
      {
        name: 'Water freezes and boils',
        hint: 'Water freezes at 0 °C and boils at 100 °C.',
        items: [
          { q: 'At what temperature does water freeze, in °C?', a: '0 °C', n: 0, why: 'Pure water freezes (turns to ice) at 0 °C.' },
          { q: 'At what temperature does water boil, in °C?', a: '100 °C', n: 100, why: 'Water boils (turns quickly to steam) at 100 °C at sea level.' },
          { q: 'A glass of water sits in a room at 20 °C. Is the water a solid, a liquid or a gas?', a: 'liquid', choices: ['solid', 'liquid', 'gas'], why: '20 °C is between 0 °C and 100 °C, so water is a liquid.' },
          { q: 'A puddle is at −10 °C. Is the water a solid, a liquid or a gas?', a: 'solid', choices: ['solid', 'liquid', 'gas'], why: '−10 °C is colder than 0 °C, the freezing point, so the puddle is ice, a solid.' },
          { q: 'What do we call it when liquid water turns into ice?', a: 'freezing', accept: ['freeze', 'freezes', 'solidifying'], why: 'Liquid → solid is freezing. Solid → liquid is melting.' },
        ],
      },
      {
        name: 'Measuring mass',
        hint: 'Mass is how much matter is in something. We measure it in grams (g) and kilograms (kg).',
        items: [
          { q: 'What tool do we use to measure mass?', a: 'a scale or balance', accept: ['scale', 'balance', 'kitchen scale', 'balance scale', 'scales', 'pan balance', 'triple beam balance'], why: 'A scale or a balance measures mass.' },
          { q: 'How many grams are in 1 kilogram?', a: '1000 g', n: 1000, why: '"Kilo" means one thousand, so 1 kg = 1000 g.' },
          { q: 'Which has more mass: 1 kg of feathers or 500 g of rocks?', a: '1 kg of feathers', choices: ['1 kg of feathers', '500 g of rocks'], why: '1 kg = 1000 g, and 1000 g is more than 500 g. The material does not matter, only the amount.' },
          { q: 'Which unit would you use for the mass of an apple?', a: 'grams', choices: ['grams', 'kilometres', 'litres', 'degrees Celsius'], why: 'Mass is measured in grams or kilograms. An apple is about 150 g.\nKilometres measure distance, litres measure volume, and degrees measure temperature.' },
        ],
      },
    ],
  },
  {
    id: 'forces', name: 'Forces', num: 2,
    summary: 'Pushes and pulls, gravity, friction, reading arrows, strong shapes',
    skills: [
      {
        name: 'Pushes and pulls',
        hint: 'A push moves something away from you. A pull moves something toward you.',
        items: [
          pushPull('opening a drawer', 'pull', 'You bring the drawer toward you, so it is a pull.'),
          pushPull('kicking a soccer ball', 'push', 'Your foot sends the ball away from you, so it is a push.'),
          pushPull('a magnet picking up a paper clip', 'pull', 'The magnet draws the clip toward itself, so it is a pull.'),
          pushPull('pressing an elevator button', 'push', 'Your finger presses away from you, so it is a push.'),
          pushPull('a dog tugging on its leash', 'pull', 'The dog drags the leash (and you) toward itself, so it is a pull.'),
        ],
      },
      {
        name: 'Gravity',
        hint: 'Gravity pulls things toward Earth, all the time, even when they are not moving.',
        items: [
          { q: 'You let go of a ball. Which way does gravity pull it?', a: 'down, toward Earth', choices: ['down, toward Earth', 'up, toward the sky', 'sideways', 'Gravity only works on moving things'], why: 'Gravity pulls everything down, toward the centre of Earth.' },
          { q: 'A book is sitting still on a table. Is gravity still pulling on it?', a: 'yes', choices: ['yes', 'no'], why: 'Gravity never switches off. The table pushes up on the book, so the book does not fall.' },
          { q: 'What force pulls you back down after you jump?', a: 'gravity', accept: ['the force of gravity', 'earths gravity', "earth's gravity"], why: 'Gravity pulls you back toward Earth.' },
        ],
      },
      {
        name: 'Friction',
        hint: 'Friction happens when two surfaces rub. Rough surfaces make more friction than smooth ones.',
        items: [
          { q: 'A hockey puck slides across the ice and slowly stops. Which force slows it down?', a: 'friction', accept: ['friction force', 'force of friction'], why: 'The puck rubs on the ice. That rubbing is friction, and it slows the puck.' },
          { q: 'Which surface has more friction: ice or sandpaper?', a: 'sandpaper', choices: ['ice', 'sandpaper'], why: 'Sandpaper is rough, so it grips more. Ice is smooth and slippery.' },
          { q: 'Why do winter boots have deep, bumpy soles?', a: 'to make more friction so you don’t slip', choices: ['to make more friction so you don’t slip', 'to make the boots lighter', 'to make less friction so you slide', 'to keep your feet warm'], why: 'Bumpy soles grip the snow and ice. More friction means less slipping.' },
        ],
      },
      {
        name: 'Reading arrow diagrams',
        hint: 'In a force diagram, the arrow points the way the push or pull goes. A longer arrow means a stronger force.',
        items: [
          { q: 'On a force diagram, arrow A is 2 cm long and arrow B is 4 cm long. Which arrow shows the stronger force?', a: 'arrow B', choices: ['arrow A', 'arrow B'], why: 'A longer arrow shows a stronger force. B is twice as long, so it is twice as strong.' },
          { q: 'An arrow on a box points to the right. Which way is the box being pushed or pulled?', a: 'to the right', choices: ['to the left', 'to the right', 'up', 'down'], why: 'The arrow shows the direction of the force.' },
          { q: 'You want to show gravity pulling on an apple. Which way should the arrow point?', a: 'down', choices: ['up', 'down', 'left', 'right'], why: 'Gravity pulls toward Earth, so the arrow points down.' },
        ],
      },
      {
        name: 'Strong shapes',
        hint: 'Think about which shapes hold their shape when you press on a corner.',
        items: [
          { q: 'Which shape makes the strongest frame for a bridge: a square or a triangle?', a: 'a triangle', choices: ['a square', 'a triangle'], why: 'A triangle cannot be squashed out of shape without bending a side. A square can lean into a diamond.' },
          { q: 'You built a tower of paper that keeps tipping over. What change would most likely help?', a: 'make the base wider', choices: ['make the base wider', 'make the top heavier', 'make it taller', 'use fewer pieces'], why: 'A wider base makes a structure more stable, so it is harder to tip over.' },
        ],
      },
    ],
  },
  {
    id: 'living-systems', name: 'Living Systems', num: 3,
    summary: 'Living vs. non-living, what plants need, what animals eat, reading food chains, habitats',
    skills: [
      {
        name: 'Living or non-living',
        hint: 'Living things grow, need food and water, and make more of their own kind.',
        items: [
          living('a mushroom', 'living', 'A mushroom is a fungus. It grows, takes in food and makes spores, so it is living.'),
          living('a rock', 'non-living', 'A rock does not grow, eat or reproduce. It is non-living.'),
          living('sunlight', 'non-living', 'Sunlight is energy from the Sun. It is not alive, but living things need it.'),
          living('moss on a tree', 'living', 'Moss is a small plant. It grows and makes more moss, so it is living.'),
          living('a puddle of water', 'non-living', 'Water is not alive, but every living thing needs it.'),
        ],
      },
      {
        name: 'What plants need',
        hint: 'Plants need light, water, air and space to grow.',
        items: [
          { q: 'A plant is left in a dark closet for two weeks. What will most likely happen?', a: 'It turns pale and weak.', choices: ['It turns pale and weak.', 'It grows faster.', 'Nothing changes.', 'It grows flowers.'], why: 'Plants need light to make food. Without it they turn pale and weak, and can die.' },
          { q: 'Name one thing a plant needs to grow.', a: 'light, water, air or space', accept: ['light', 'sunlight', 'sun', 'water', 'air', 'carbon dioxide', 'co2', 'space', 'soil', 'nutrients', 'minerals'], why: 'Plants need light, water, air (carbon dioxide) and space. Most also take nutrients from soil.' },
          { q: 'Which part of a plant takes in water from the soil?', a: 'the roots', accept: ['roots', 'root'], why: 'Roots take in water and nutrients from the soil.' },
        ],
      },
      {
        name: 'What animals eat',
        hint: 'Herbivores eat plants. Carnivores eat animals. Omnivores eat both.',
        items: [
          { q: 'A deer eats only plants. What kind of eater is it?', a: 'herbivore', choices: ['herbivore', 'carnivore', 'omnivore'], why: 'An animal that eats only plants is a herbivore.' },
          { q: 'A wolf eats deer, rabbits and other animals. What kind of eater is it?', a: 'carnivore', choices: ['herbivore', 'carnivore', 'omnivore'], why: 'An animal that eats other animals is a carnivore.' },
          { q: 'A black bear eats berries, roots, fish and insects. What kind of eater is it?', a: 'omnivore', choices: ['herbivore', 'carnivore', 'omnivore'], why: 'An animal that eats both plants and animals is an omnivore.' },
        ],
      },
      {
        name: 'Reading a food chain',
        hint: 'In a food chain, each arrow points from the food to the animal that eats it.',
        items: [
          { q: 'grass → rabbit → fox\nWhat does the rabbit eat?', a: 'grass', why: 'The arrow goes from grass to rabbit, so the rabbit eats the grass.' },
          { q: 'grass → rabbit → fox\nWhat eats the rabbit?', a: 'the fox', accept: ['fox', 'a fox'], why: 'The arrow goes from rabbit to fox, so the fox eats the rabbit.' },
          { q: 'In a food chain, the arrow points from the food to…', a: 'the eater', choices: ['the eater', 'the food', 'the Sun', 'the ground'], why: 'Arrows show where the energy goes: from the food into the animal that eats it.' },
          { q: 'algae → minnow → trout → osprey\nWhich living thing is eaten by the trout?', a: 'the minnow', accept: ['minnow', 'minnows'], why: 'The arrow goes from minnow to trout, so the trout eats the minnow.' },
        ],
      },
      {
        name: 'Habitats and adaptations',
        hint: 'An adaptation is a body part or behaviour that helps a living thing survive where it lives.',
        items: [
          { q: 'A polar bear has thick fur and a layer of fat. Which habitat is it suited to?', a: 'a cold Arctic habitat', choices: ['a cold Arctic habitat', 'a hot desert', 'a rainforest', 'a pond'], why: 'Thick fur and fat keep heat in, which is what an animal needs in the cold.' },
          { q: 'A cactus stores water in its thick stem. Which habitat is it suited to?', a: 'a dry desert', choices: ['a dry desert', 'a wetland', 'the ocean floor', 'a snowy forest'], why: 'Storing water helps a plant survive where it rarely rains.' },
          { q: 'A snowshoe hare turns white in winter. How does this help it?', a: 'It blends in with the snow.', choices: ['It blends in with the snow.', 'It keeps it cooler.', 'It helps it find food.', 'It makes it run faster.'], why: 'White fur in winter is camouflage. Predators have a harder time seeing it.' },
        ],
      },
    ],
  },
  {
    id: 'climate', name: 'Climate', num: 4,
    summary: 'Reading data, the seasons, the Sun warms Earth, air is gases, weather tools',
    skills: [
      {
        name: 'Reading temperature data',
        hint: 'Read the numbers carefully. For "how much warmer", subtract the smaller number from the bigger one.',
        items: [
          { q: 'Average temperatures in Calgary:\nJanuary −7 °C, April 6 °C, July 17 °C, October 6 °C.\nWhich month is warmest?', a: 'July', accept: ['jul'], why: '17 °C is the highest number in the list, so July is warmest.' },
          { q: 'Average temperatures in Calgary:\nApril 6 °C, July 17 °C.\nHow many degrees warmer is July than April?', a: '11 °C', n: 11, why: '17 − 6 = 11 °C warmer.' },
          { q: 'A bar graph shows rain each month. The bar for June reaches 90 mm and the bar for March reaches 20 mm. How many more millimetres fell in June?', a: '70 mm', n: 70, why: '90 − 20 = 70 mm more in June.' },
          { q: 'The temperature goes from −3 °C in the morning to 5 °C in the afternoon. How many degrees did it rise?', a: '8 °C', n: 8, why: 'From −3 up to 0 is 3 degrees. From 0 up to 5 is 5 more.\n3 + 5 = 8 °C.' },
        ],
      },
      {
        name: 'The seasons',
        hint: 'In Alberta, summer has the longest days and winter has the shortest.',
        items: [
          { q: 'In Alberta, which season has the longest days?', a: 'summer', choices: ['spring', 'summer', 'fall', 'winter'], why: 'In summer the Sun rises early and sets late. In late June Calgary gets about 16 hours of daylight.' },
          { q: 'Which season comes right after fall?', a: 'winter', choices: ['spring', 'summer', 'winter'], why: 'The order is spring, summer, fall, winter.' },
          { q: 'In Alberta, which season has the fewest hours of daylight?', a: 'winter', choices: ['spring', 'summer', 'fall', 'winter'], why: 'In winter the Sun rises late and sets early. In late December Edmonton gets about 7½ hours of daylight.' },
        ],
      },
      {
        name: 'The Sun warms Earth',
        hint: 'Almost all of Earth’s heat and light comes from the Sun.',
        items: [
          { q: 'Where does Earth get almost all of its heat and light?', a: 'the Sun', accept: ['sun', 'sunlight', 'from the sun', 'the sun'], why: 'The Sun’s energy warms the land, water and air.' },
          { q: 'Why is a black car hotter than a white car after sitting in the sun?', a: 'Dark colours soak up more sunlight.', choices: ['Dark colours soak up more sunlight.', 'Black cars have bigger engines.', 'White cars make their own cool air.', 'Black paint is thicker.'], why: 'Dark colours absorb more of the Sun’s light and turn it into heat. Light colours reflect more.' },
          { q: 'Why is it usually warmer at 2 p.m. than at sunrise?', a: 'The Sun has been heating the ground for hours.', choices: ['The Sun has been heating the ground for hours.', 'The Sun is closer to Earth in the afternoon.', 'Clouds make heat in the afternoon.', 'The wind is warmer in the afternoon.'], why: 'The Sun is higher in the afternoon and has had hours to warm the ground, which then warms the air.' },
        ],
      },
      {
        name: 'Air is made of gases',
        hint: 'Air is a mix of gases. You can’t see it, but it is matter: it takes up space and has mass.',
        items: [
          { q: 'Air is a mixture of…', a: 'gases', choices: ['gases', 'liquids', 'solids', 'nothing'], why: 'Air is mostly nitrogen and oxygen gas, with small amounts of other gases.' },
          { q: 'Which gas in the air do people need to breathe?', a: 'oxygen', accept: ['o2', 'oxygen gas'], why: 'We breathe in oxygen. Our bodies use it to get energy from food.' },
          { q: 'Is air matter?', a: 'yes', choices: ['yes', 'no'], why: 'Air takes up space (it fills a balloon) and has mass, so it is matter.' },
        ],
      },
      {
        name: 'Weather tools',
        hint: 'Each tool measures one thing about the weather.',
        items: [
          { q: 'Which tool measures air temperature?', a: 'thermometer', choices: ['thermometer', 'rain gauge', 'wind vane', 'anemometer'], why: 'A thermometer measures temperature.' },
          { q: 'Which tool measures how much rain fell?', a: 'rain gauge', choices: ['thermometer', 'rain gauge', 'wind vane', 'anemometer'], why: 'A rain gauge collects rain so you can measure how deep it is, in millimetres.' },
          { q: 'Which tool shows which way the wind is blowing?', a: 'wind vane', choices: ['thermometer', 'rain gauge', 'wind vane', 'anemometer'], why: 'A wind vane (weather vane) turns to point into the wind.' },
          { q: 'Which tool measures how fast the wind is blowing?', a: 'anemometer', choices: ['thermometer', 'rain gauge', 'wind vane', 'anemometer'], why: 'An anemometer has spinning cups. The faster they spin, the faster the wind.' },
        ],
      },
    ],
  },
  {
    id: 'energy-resources', name: 'Energy Resources', num: 5,
    summary: 'What energy does, things that run out, electricity at home, natural resources, pros and cons',
    skills: [
      {
        name: 'What energy does',
        hint: 'Energy makes things happen: it makes light, heat, sound and movement.',
        items: [
          { q: 'A light bulb uses electricity to make light. What else does it give off?', a: 'heat', choices: ['heat', 'water', 'wind', 'nothing'], why: 'Light bulbs also give off heat. Touch an old bulb that has been on and you can feel it.' },
          { q: 'A speaker uses electricity. What kind of energy does it give off that you can hear?', a: 'sound', choices: ['sound', 'light', 'heat', 'movement'], why: 'Speakers turn electrical energy into sound. Their cone shakes the air, and your ears pick it up.' },
          { q: 'Where does your body get the energy to run?', a: 'food', accept: ['from food', 'the food i eat', 'eating', 'food we eat'], why: 'Food is your body’s fuel. Your body breaks it down to release energy.' },
        ],
      },
      {
        name: 'Things that can run out',
        hint: 'Ask: will nature make more of it in a human lifetime?',
        items: [
          { q: 'Which of these could run out one day?', a: 'coal', choices: ['coal', 'sunlight', 'wind', 'river water flowing downhill'], why: 'Coal took millions of years to form. Once we dig it up and burn it, it is gone.' },
          { q: 'Which of these will NOT run out, no matter how much we use?', a: 'sunlight', choices: ['sunlight', 'oil', 'natural gas', 'coal'], why: 'The Sun shines every day. Oil, gas and coal took millions of years to form.' },
          { q: 'Oil was formed from ancient plants and animals over millions of years. Can nature make more oil in your lifetime?', a: 'no', choices: ['yes', 'no'], why: 'Oil takes millions of years to form, so what we use is not replaced in our lifetime.' },
        ],
      },
      {
        name: 'Electricity at home',
        hint: 'Electricity flows only around a complete loop, called a circuit.',
        items: [
          { q: 'Which of these does NOT need electricity to work?', a: 'a bicycle', choices: ['a bicycle', 'a fridge', 'a TV', 'a microwave'], why: 'You power a bicycle with your legs. The others plug into the wall.' },
          { q: 'You flip a light switch to OFF. What does the switch do?', a: 'It breaks the circuit so electricity stops flowing.', choices: ['It breaks the circuit so electricity stops flowing.', 'It uses up the electricity.', 'It sends the electricity back to the power plant.', 'It cools the bulb down.'], why: 'A switch opens a gap in the circuit. With a gap, electricity cannot flow, so the light goes off.' },
          { q: 'Electricity can flow around a circuit only if the circuit is…', a: 'complete (closed)', choices: ['complete (closed)', 'broken (open)', 'cold', 'made of plastic'], why: 'Electricity needs an unbroken loop to flow.' },
        ],
      },
      {
        name: 'Natural resources',
        hint: 'A natural resource comes from nature, not from a factory.',
        items: [
          { q: 'Which of these is a natural resource?', a: 'wood', choices: ['wood', 'plastic', 'a glass bottle', 'a nylon rope'], why: 'Wood comes from trees. The others are made in factories (though from natural resources).' },
          { q: 'Trees, water, soil and oil are all natural resources because they…', a: 'come from nature', choices: ['come from nature', 'are made in factories', 'are all alive', 'never run out'], why: 'Natural resources are things from nature that people use.' },
          { q: 'Alberta pumps a lot of a natural resource from deep underground that is made into gasoline. What is it?', a: 'oil', accept: ['crude oil', 'petroleum', 'crude'], why: 'Crude oil is pumped from underground and refined into gasoline, diesel and other products.' },
        ],
      },
      {
        name: 'Pros and cons',
        hint: 'An advantage is a good point. A disadvantage is a bad point.',
        items: [
          { q: 'Biking to school instead of riding in a car. Which is a DISADVANTAGE of biking?', a: 'It is hard in a snowstorm.', choices: ['It is hard in a snowstorm.', 'It is good exercise.', 'It costs no gas.', 'It makes no air pollution.'], why: 'The other three are advantages. Bad weather is a real downside of biking.' },
          { q: 'A family buys a big pickup truck. Which is an ADVANTAGE?', a: 'It can carry heavy loads.', choices: ['It can carry heavy loads.', 'It uses more fuel.', 'It is harder to park.', 'It costs more to buy.'], why: 'Carrying heavy loads is a good point. The others are disadvantages.' },
        ],
      },
    ],
  },
  {
    id: 'space', name: 'Space', num: 6,
    summary: 'Day and night, a year, the Moon, gravity, very large numbers',
    skills: [
      {
        name: 'Day and night',
        hint: 'Earth spins like a top. One full spin takes one day.',
        items: [
          { q: 'What causes day and night?', a: 'Earth spinning', choices: ['Earth spinning', 'The Sun moving around Earth', 'The Moon blocking the Sun', 'Clouds covering the Sun'], why: 'Earth spins once a day. The side facing the Sun has day, and the side facing away has night.' },
          { q: 'How many hours does Earth take to spin around once?', a: '24 hours', n: 24, why: 'One full spin of Earth is one day: about 24 hours.' },
          { q: 'It is daytime in Alberta. Is it daytime or night-time on the other side of Earth?', a: 'night-time', choices: ['daytime', 'night-time'], why: 'The other side of Earth is facing away from the Sun, so it is night there.' },
        ],
      },
      {
        name: 'One year',
        hint: 'A year is the time Earth takes to travel once around the Sun.',
        items: [
          { q: 'About how many days does Earth take to travel once around the Sun?', a: '365 days', n: 365, why: 'One trip around the Sun takes about 365¼ days. That is one year.' },
          { q: 'What does Earth travel around once every year?', a: 'the Sun', accept: ['sun', 'the sun'], why: 'Earth orbits the Sun. One orbit is one year.' },
          { q: 'Earth spins and Earth orbits. Which one gives us one year?', a: 'orbiting the Sun', choices: ['spinning', 'orbiting the Sun'], why: 'Spinning gives us day and night. Orbiting the Sun gives us a year.' },
        ],
      },
      {
        name: 'The Moon',
        hint: 'The Moon orbits Earth about once a month. It has no light of its own.',
        items: [
          { q: 'What does the Moon travel around?', a: 'Earth', accept: ['the earth', 'earth'], why: 'The Moon orbits Earth.' },
          { q: 'Why does the Moon shine at night?', a: 'It reflects light from the Sun.', choices: ['It reflects light from the Sun.', 'It makes its own light.', 'It is on fire.', 'It reflects light from cities on Earth.'], why: 'The Moon makes no light. Sunlight bounces off it, like light off a mirror.' },
          { q: 'About how long does the Moon take to go once around Earth?', a: 'about a month', choices: ['a day', 'a week', 'about a month', 'a year'], why: 'The Moon orbits Earth about every 27 days, and its phases repeat about every 29½ days. The word "month" comes from "Moon".' },
        ],
      },
      {
        name: 'Gravity',
        hint: 'Gravity is a pull between objects. Bigger objects pull harder.',
        items: [
          { q: 'What force keeps the Moon travelling around Earth?', a: 'gravity', accept: ['earths gravity', "earth's gravity", 'the force of gravity'], why: 'Earth’s gravity pulls on the Moon and keeps it in orbit.' },
          { q: 'Gravity pulls objects…', a: 'toward each other', choices: ['toward each other', 'away from each other', 'only downward on Earth', 'only when they move'], why: 'Gravity is a pull between objects. On Earth it feels like "down" because we are pulled toward Earth’s centre.' },
          { q: 'Which pulls harder with gravity: the Sun or the Moon?', a: 'the Sun', choices: ['the Sun', 'the Moon'], why: 'The Sun is far, far bigger than the Moon. More mass means a stronger pull. That pull keeps all the planets in orbit.' },
        ],
      },
      {
        name: 'Very large numbers',
        hint: 'One thousand is 1000. One million is 1 000 000, a thousand thousands.',
        items: [
          { q: 'Write one million as a number.', a: '1 000 000', n: 1000000, why: 'One million = 1 000 000 (six zeros).' },
          { q: 'How many thousands make one million?', a: '1000', n: 1000, why: '1000 × 1000 = 1 000 000.' },
          { q: 'Which is bigger: 150 million or 15 million?', a: '150 million', choices: ['150 million', '15 million'], why: '150 million is ten times bigger than 15 million.' },
          { q: 'The Moon is about 384 000 km from Earth. Round that to the nearest hundred thousand.', a: '400 000 km', n: 400000, why: '384 000 is between 300 000 and 400 000. It is closer to 400 000.' },
        ],
      },
    ],
  },
] };
})();
