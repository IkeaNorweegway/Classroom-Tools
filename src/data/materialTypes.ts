// Material types shown on topic pages. Each type has its own icon and hue so a
// student can tell notes from a workbook from a test at a glance. Hues are
// space-separated RGB channels, read by .mcard in global.css as --t / --t-soft.

export type MaterialType =
  | 'notes' | 'reference' | 'workbook' | 'challenge' | 'interactive'
  | 'exit' | 'assessment' | 'journal' | 'key' | 'other';

interface TypeStyle {
  label: string;
  rgb: string;
  soft: string;
  icon: string;
}

export const materialTypes: Record<MaterialType, TypeStyle> = {
  notes: {
    label: 'Notes', rgb: '52 103 170', soft: '232 239 249',
    icon: '<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M9 8.5h6M9 12h6M9 15.5h3.5"/>',
  },
  reference: {
    label: 'Reference', rgb: '62 120 132', soft: '231 242 244',
    icon: '<path d="M4 5.5c2.6-1.1 5.3-1 8 1 2.7-2 5.4-2.1 8-1V19c-2.6-1.1-5.3-1-8 1-2.7-2-5.4-2.1-8-1Z"/><path d="M12 6.5V20"/>',
  },
  workbook: {
    label: 'Practice', rgb: '176 116 26', soft: '250 241 224',
    icon: '<path d="M15.5 4.5l4 4L9 19l-4.5 1 1-4.5Z"/><path d="M13.5 6.5l4 4"/>',
  },
  challenge: {
    label: 'Challenge', rgb: '196 86 42', soft: '251 236 227',
    icon: '<path d="M12 4l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16.4l-4.8 2.5.9-5.4-3.9-3.8 5.4-.8Z"/>',
  },
  interactive: {
    label: 'Interactive', rgb: '112 84 196', soft: '240 236 251',
    icon: '<path d="M5 8h8.5M18.5 8H19M5 16h2.5M12.5 16H19"/><circle cx="16" cy="8" r="2.25"/><circle cx="10" cy="16" r="2.25"/>',
  },
  exit: {
    label: 'Exit ticket', rgb: '44 128 88', soft: '230 244 236',
    icon: '<path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5V10a2 2 0 0 0 0 4v2.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5V14a2 2 0 0 0 0-4Z"/><path d="M14.5 7v1.5M14.5 11.25v1.5M14.5 15.5V17"/>',
  },
  assessment: {
    label: 'Assessment', rgb: '178 60 74', soft: '249 233 236',
    icon: '<rect x="5.5" y="5" width="13" height="15.5" rx="2"/><path d="M9.5 3.5h5v3h-5z"/><path d="M9 13.25l2 2 4-4"/>',
  },
  journal: {
    label: 'Design journal', rgb: '146 82 158', soft: '246 236 247',
    icon: '<path d="M6 4.5h10.5A1.5 1.5 0 0 1 18 6v13.5H7.5A1.5 1.5 0 0 1 6 18Z"/><path d="M6 18a1.5 1.5 0 0 1 1.5-1.5H18"/><path d="M10 9.75l2-2 2 2-2 2z"/>',
  },
  key: {
    label: 'Answer key', rgb: '107 102 93', soft: '240 238 233',
    icon: '<circle cx="8.5" cy="12" r="3.5"/><path d="M12 12h8M17 12v3M20 12v2"/>',
  },
  other: {
    label: 'Material', rgb: 'var(--accent)', soft: 'var(--accent-soft)',
    icon: '<path d="M7 3.5h7l4 4v13H7Z"/><path d="M14 3.5v4h4"/>',
  },
};

const rules: [RegExp, MaterialType][] = [
  [/answer|corrigé|\bkeys?\b/, 'key'],
  [/journal/, 'journal'],
  [/simulat|interactive|explorer/, 'interactive'],
  [/quiz|test|assessment|évaluation|exam/, 'assessment'],
  [/exit|billet/, 'exit'],
  [/challenge|défi|★★/, 'challenge'],
  [/concept|reference|référence|glossary|vocab/, 'reference'],
  [/workbook|cahier|worksheet|practice|exercice|exercise/, 'workbook'],
  [/notes?\b|guide|booklet|livret/, 'notes'],
];

const match = (text: string): MaterialType | null => {
  const t = text.toLowerCase();
  for (const [re, type] of rules) if (re.test(t)) return type;
  return null;
};

/** The item's own label wins; the section heading is the fallback. */
export function inferType(label: string, heading = ''): MaterialType {
  return match(label) ?? match(heading) ?? 'other';
}
