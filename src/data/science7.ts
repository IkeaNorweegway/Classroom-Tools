// Grade 7 Science materials manifest. Student unit pages, parent guides and
// the viewer read it. Files are flat in public/materials/.
import { getReady, homeSheets, type CourseManifest, type CourseUnit, type Doc } from './manifest';

const accessible = { badge: 'Accessible' };
const nonReader = { badge: 'Non-reader' };

// Narrow concept trainers: one per unit, practice after the lesson. Rules: _sims-context.md (rules 19–25).
// Built by scripts/drill/build.sh; edit the parts there, not the HTML.
const trainers: Record<string, string> = {
  'interactions-ecosystems': 'Ecosystems Trainer (biotic or abiotic, roles, food chains and webs, the 10% rule, biodiversity, change)',
  'plants-food-fibre': 'Plants Trainer (cell parts, plant or animal cell, part jobs, xylem and phloem, photosynthesis, flowers, reproduction, biotech)',
  'heat-temperature': 'Heat Trainer (°C and K, heat or temperature, heat flow, particles, conduction, convection, radiation, insulation)',
  'structures-forces': 'Structures Trainer (structure types, loads, internal forces, beams, stability, levers, mechanical advantage, machines)',
  'planet-earth': 'Planet Earth Trainer (layers, rock types, crystals, plate boundaries, earthquakes, volcanoes, weathering, rock layers)',
};

// Teacher guide version per unit; every guide is v2 except heat, which is v3.
const guideVersion: Record<string, number> = { 'heat-temperature': 3 };

function unit(slug: string, label: string, sheets: [string, string][], more: { heading: string; items: Doc[] }[] = [], moreKeys: Doc[] = []): CourseUnit {
  return {
    slug,
    label,
    teacherGuide: `sci7-${slug}-teacherguide-v${guideVersion[slug] ?? 2}`,
    path: [
      { hint: 'Start here. You fill these in during class.', items: [{ label: 'Guided Notes', doc: `sci7-${slug}-notes-v1`, type: 'notes' }] },
      { hint: 'Practice that mixes up everything in the unit.', items: [{ label: 'Workbook', doc: `sci7-${slug}-workbook-v1`, type: 'workbook' }] },
      { hint: 'Quick checks to see if you’ve got it.', items: [{ label: 'Exit Tickets', doc: `sci7-${slug}-exits-v1`, badge: 'Formative', type: 'exit' }] },
    ],
    extras: [
      getReady(`sci7-${slug}-prereq-practice-v1`),
      ...(trainers[slug] ? [{ heading: 'Practice after the lesson', items: [{ label: trainers[slug], doc: `sci7-${slug}-trainer-v1`, type: 'interactive' as const }] }] : []),
      ...more,
      {
        heading: 'Quizzes and tests',
        items: [
          { label: 'Mid-Unit Quiz', doc: `sci7-${slug}-quiz-v1`, type: 'assessment' },
          { label: 'Unit Test', doc: `sci7-${slug}-test-v1`, type: 'assessment' },
        ],
      },
    ],
    keys: [
      { label: 'Notes Answer Key', doc: `sci7-${slug}-notes-answers-v2` },
      { label: 'Workbook Answer Key', doc: `sci7-${slug}-workbook-answers-v1` },
      { label: 'Assessment Answer Key', doc: `sci7-${slug}-assessment-answers-v1` },
      ...moreKeys,
    ],
    home: homeSheets('sci7', slug, sheets),
  };
}

export const science7: CourseManifest = {
  course: 'science7',
  noun: 'unit',
  units: [
    unit('interactions-ecosystems', 'Interactions and Ecosystems',
      [['food-webs', 'Food chains and food webs'], ['human-impact', 'Human impacts on ecosystems']]),
    unit('plants-food-fibre', 'Plants for Food and Fibre',
      [['photosynthesis', 'Photosynthesis'], ['plant-parts', 'Plant parts and their jobs']],
      [
        {
          heading: 'Simulations and games',
          items: [
            { label: 'Plant Lab (Photosynthesis Simulation)', doc: 'sci7-photosynthesis-sim-v2', type: 'interactive' },
            { label: 'Flower Lab (Flower Reproduction Simulation)', doc: 'sci7-flower-reproduction-sim-v2', type: 'interactive' },
            { label: 'Flower Field (Seed Reproduction Game)', doc: 'sci7-flower-field-game-v2', badge: 'Game', type: 'interactive' },
            { label: 'Clone Field (Asexual Reproduction Game)', doc: 'sci7-clone-field-game-v2', badge: 'Game', type: 'interactive' },
            { label: 'Seed to Seed (Grow and Breed a Plant Game)', doc: 'sci7-seed-to-seed-game-v2', badge: 'Game', type: 'interactive' },
          ],
        },
        {
          heading: 'Activities',
          items: [
            { label: 'Plant Hunt (Outdoor Sketch)', doc: 'sci7-plant-hunt-outdoor-v1', badge: 'Outdoor' },
            { label: 'Plant Hunt (Outdoor Sketch)', doc: 'sci7-plant-hunt-outdoor-ipp-v1', ...accessible },
            { label: 'Lily Lab (Dissect + Press)', doc: 'sci7-lily-dissection-lab-v1', badge: 'Lab' },
            { label: 'Lily Lab (Dissect + Press)', doc: 'sci7-lily-dissection-lab-ipp-v1', ...accessible },
          ],
        },
        {
          heading: 'Graphic organizers',
          items: [
            { label: 'Plant Systems', doc: 'sci7-plant-systems-organizer-ipp-v1', ...accessible },
            { label: 'Plant Cells', doc: 'sci7-plant-cells-organizer-ipp-v1', ...accessible },
            { label: 'Photosynthesis', doc: 'sci7-photosynthesis-organizer-ipp-v1', ...accessible },
            { label: 'Plant Reproduction', doc: 'sci7-reproduction-organizer-ipp-v1', ...accessible },
            { label: 'Photosynthesis — Picture Cards', doc: 'sci7-photosynthesis-organizer-nonreader-cards-v1', ...nonReader },
            { label: 'Photosynthesis — Circle It', doc: 'sci7-photosynthesis-organizer-nonreader-circle-v1', ...nonReader },
            { label: 'Plant Systems — Picture Cards', doc: 'sci7-plant-systems-organizer-nonreader-cards-v1', ...nonReader },
            { label: 'Plant Systems — Circle It', doc: 'sci7-plant-systems-organizer-nonreader-circle-v1', ...nonReader },
          ],
        },
      ],
      [{ label: 'Lily Lab Teacher Notes + Key', doc: 'sci7-lily-dissection-lab-teachernotes-v1' }]),
    unit('heat-temperature', 'Heat and Temperature',
      [['heat-vs-temperature', 'Heat versus temperature'], ['heat-transfer', 'Conduction, convection and radiation']]),
    unit('structures-forces', 'Structures and Forces',
      [['structure-types', 'Types of structures'], ['loads-forces', 'Loads and internal forces']]),
    unit('planet-earth', 'Planet Earth',
      [['rock-cycle', 'The rock cycle'], ['plates', 'Plate tectonics']]),
  ],
  studentHref: (slug) => `science7/materials/${slug}`,
  parentHref: (slug) => `science7/parents/${slug}`,
  teacherHref: (slug) => `science7/teacher#${slug}`,
  viewHref: (slug, doc) => `science7/view/${slug}/${doc}`,
};
