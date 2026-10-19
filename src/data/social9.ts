// Grade 9 Social Studies materials manifest. Files are flat in public/materials/.
import type { CourseManifest } from './manifest';
import { socialUnit } from './social8';

export const social9: CourseManifest = {
  course: 'social9',
  noun: 'unit',
  units: [
    socialUnit('soc9', 'urbanization-industry', 'Urbanization and the Growth of Industry', [['push-pull', 'Push and pull factors'], ['cause-effect', 'Causes and effects']]),
    socialUnit('soc9', 'independence-democratic-rights', 'Canada’s Independence and Democratic Rights', [['timeline', 'Steps to independence'], ['rights', 'Rights and freedoms']]),
    socialUnit('soc9', 'canada-in-wwii', 'Canada in the Second World War', [['home-front', 'The home front'], ['perspectives', 'Different perspectives']]),
    socialUnit('soc9', 'postwar-canada', 'Post-War Canada: Change, Cooperation, and Conflict', [['change', 'What changed after the war'], ['sources', 'Reading a source']]),
    socialUnit('soc9', 'modern-economy', 'Building a Modern Economy', [['sectors', 'Parts of the economy'], ['trade', 'Trade and resources']]),
    socialUnit('soc9', 'system-of-government', 'Canada’s System of Government', [['levels', 'Levels of government'], ['bill', 'How a bill becomes law']]),
    socialUnit('soc9', 'evolving-citizenship', 'Evolving Citizenship and Rights', [['charter', 'The Charter in action'], ['citizenship', 'What citizenship means']]),
  ],
  studentHref: (slug) => `social9/materials/${slug}`,
  parentHref: (slug) => `social9/parents/${slug}`,
  teacherHref: (slug) => `social9/teacher#${slug}`,
  viewHref: (slug, doc) => `social9/view/${slug}/${doc}`,
};

social9.units[0].extras.unshift({ heading: 'Class slides', items: [{ label: 'Class Slides', doc: 'soc9-urbanization-industry-slides-v1', type: 'slides' }] });
