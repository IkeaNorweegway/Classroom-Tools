// Grade 5 English Language Arts materials manifest. Files live in
// public/materials/grade-5-ela/ (not flat), so the viewer reads that folder.
// Rendered by scripts/render_ela5.pl; course context in
// _courses/grade-5-ela/_context.md. Editions: A (standard), B (-scaffolded),
// C (-ef, easy read); the Edition A answer keys serve all three.
import type { CourseManifest, CourseUnit } from './manifest';
import { homeSheets } from './manifest';

/** Folder under public/materials/ that holds every Grade 5 ELA file. */
export const ela5Folder = 'grade-5-ela';

function ela5Unit(slug: string, label: string, sheets: [string, string][]): CourseUnit {
  const f = (kind: string) => `ela5-${slug}-${kind}-v1`;
  return {
    slug,
    label,
    path: [
      { hint: 'The tales we read together.', items: [{ label: 'Unit Reader', doc: f('reader'), type: 'reference' }] },
      { hint: 'One page per skill. Fill it in during the mini-lesson.', items: [{ label: 'Anchor Notes', doc: f('anchor-notes'), type: 'notes' }] },
      { hint: 'One page every lesson: write about what you read, then plan and write your own tale.', items: [{ label: "Reader's & Writer's Notebook", doc: f('notebook'), type: 'workbook' }] },
      { hint: 'Quick checks after each skill.', items: [{ label: 'Exit Tickets', doc: f('exits'), badge: 'Formative', type: 'exit' }] },
    ],
    extras: [
      {
        heading: 'Practice',
        items: [
          { label: 'Word Work (weekly)', doc: f('wordwork'), type: 'workbook' },
          { label: "Fluency Pack (reader's theatre)", doc: f('fluency'), type: 'other' },
          { label: 'Writing Rubric and Sample Stories', doc: f('rubric'), type: 'reference' },
        ],
      },
      { heading: 'Cold reads', items: [{ label: 'Cold Reads (mid-unit and end)', doc: f('coldreads'), type: 'assessment' }] },
      {
        heading: 'Other editions',
        items: [
          { label: 'Anchor Notes', doc: f('anchor-notes-scaffolded'), badge: 'Edition B', type: 'notes' },
          { label: 'Notebook', doc: f('notebook-scaffolded'), badge: 'Edition B', type: 'workbook' },
          { label: 'Cold Reads', doc: f('coldreads-scaffolded'), badge: 'Edition B', type: 'assessment' },
          { label: 'Unit Reader', doc: f('reader-ef'), badge: 'Edition C', type: 'reference' },
          { label: 'Anchor Notes', doc: f('anchor-notes-ef'), badge: 'Edition C', type: 'notes' },
          { label: 'Notebook', doc: f('notebook-ef'), badge: 'Edition C', type: 'workbook' },
          { label: 'Cold Reads', doc: f('coldreads-ef'), badge: 'Edition C', type: 'assessment' },
        ],
      },
    ],
    keys: [
      { label: 'Anchor Notes Answer Key', doc: f('anchor-notes-answers') },
      { label: 'Notebook Answer Key', doc: f('notebook-answers') },
      { label: 'Word Work Answer Key', doc: f('wordwork-answers') },
      { label: 'Exit Tickets Answer Key', doc: f('exits-answers') },
      { label: 'Cold Reads Answer Key', doc: f('coldreads-answers') },
    ],
    teacherGuide: f('teacherguide'),
    home: homeSheets('ela5', slug, sheets),
  };
}

export const ela5: CourseManifest = {
  course: 'ela5',
  noun: 'unit',
  units: [
    ela5Unit('tall-tales', 'Tall Tales', [['exaggeration', 'What does it really mean?'], ['summary', 'Telling a story short']]),
    ela5Unit('information-report', 'Information Report', [['features', 'Finding facts fast'], ['notes', 'Notes in my own words']]),
    ela5Unit('opinion', 'Opinion and Editorial', [['fact-opinion', 'Fact or opinion?'], ['reasons', 'Reasons and evidence']]),
    ela5Unit('science-fiction', 'Science Fiction', [['theme', 'Theme is a sentence'], ['what-if', 'What if…?']]),
    ela5Unit('lyric-poetry', 'Lyric Poetry', [['picture-it', 'Picture it: comparisons'], ['by-heart', 'Learning a poem by heart']]),
    ela5Unit('scripted-drama', 'Scripted Drama', [['story-to-script', 'From story to script'], ['voice', 'One line, many meanings']]),
  ],
  studentHref: (slug) => `ela5/materials/${slug}`,
  parentHref: (slug) => `ela5/parents/${slug}`,
  teacherHref: (slug) => `ela5/teacher#${slug}`,
  viewHref: (slug, doc) => `ela5/view/${slug}/${doc}`,
};

/** The year plan: built units link; planned ones show as coming later. */
export const ela5Year = [
  { slug: 'tall-tales', label: 'Tall Tales', when: 'Sep–Oct', genre: 'Narrative', description: 'Paul Bunyan, Sally Ann, John Henry, Big Joe Mufferaw and an Alberta tale. Plan and tell your own tall tale.' },
  { slug: 'information-report', label: 'Information Report', when: 'Nov–Dec', genre: 'Non-fiction', description: 'How the human body works: research a body system, take notes in your own words, and write a report with text features.' },
  { slug: 'opinion', label: 'Opinion and Editorial', when: 'Jan–Feb', genre: 'Persuasive', description: 'Should recess be longer? Read both sides, judge the evidence, and write a letter that makes your case.' },
  { slug: 'science-fiction', label: 'Science Fiction', when: 'Feb–Mar', genre: 'Fiction', description: 'Robots, domes and messages from the future: theme, point of view and flash-forwards in stories about technology and choices.' },
  { slug: 'lyric-poetry', label: 'Lyric Poetry', when: 'Apr', genre: 'Poetry', description: 'Poems of place and feeling, old and new: comparisons, stanzas, sound, and reciting from memory.' },
  { slug: 'scripted-drama', label: 'Scripted Drama', when: 'May–Jun', genre: 'Drama', description: 'Turn a story from this year into a play, write a scene, and perform it with voice, body and expression.' },
];
