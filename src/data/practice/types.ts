// Question banks for the prereq practice pages (PrereqPractice.astro).
// Each unit lists the skills students need before it starts, drawn from the
// "comesFrom" and "assumed" fields of that unit's parent guide. A practice run
// takes one random question from each skill, so every skill needs at least two.

export interface PracticeItem {
  /** The question. A line break starts a new line. */
  q: string;
  /** The answer shown in feedback and on the printed key. For a choice
   *  question it must be one of `choices`. */
  a: string;
  /** Multiple choice. Two options keep their order (e.g. "biotic, abiotic");
   *  three or more are shuffled. Without it, the question is typed. */
  choices?: string[];
  /** Typed questions: other answers to accept. Matching ignores case,
   *  punctuation, a leading "a/an/the" and a trailing "s". */
  accept?: string[];
  /** Typed questions with a number answer: the first number in the student's
   *  answer must equal this (units and commas are ignored). */
  n?: number;
  /** Overrides the skill's hint. */
  hint?: string;
  /** The explanation shown after answering and on the printed key. */
  why: string;
}

export interface PracticeSkill {
  name: string;
  hint?: string;
  items: PracticeItem[];
}

export interface PracticeUnit {
  /** The unit slug used elsewhere on the site. */
  id: string;
  name: string;
  num: number;
  summary: string;
  skills: PracticeSkill[];
}

/** A two-way sort question, e.g. "Is a mushroom living or non-living?" */
export const sortQ = (
  thing: string,
  options: [string, string],
  a: string,
  why: string,
): PracticeItem => ({ q: `Is ${thing} ${options[0]} or ${options[1]}?`, a, choices: [...options], why });
