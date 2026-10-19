// Grade 7 Social Studies materials manifest. Files are flat in public/materials/.
import type { CourseManifest } from './manifest';
import { socialUnit } from './social8';

export const social7: CourseManifest = {
  course: 'social7',
  noun: 'unit',
  units: [
    socialUnit('soc7', 'state-building', 'Building the Canadian State', [['boundaries', 'Canada’s changing map'], ['treaties', 'Treaties and the West']]),
    socialUnit('soc7', 'confederation-government', 'Creating Canada’s Government', [['branches', 'The three branches'], ['powers', 'Federal or provincial?']]),
    socialUnit('soc7', 'building-economy', 'Building Canada’s Economy', [['tariffs', 'Tariffs and free trade'], ['regions', 'Regional economies']]),
    socialUnit('soc7', 'immigration', 'Immigration After Confederation', [['push-pull', 'Why settlers came'], ['fact-opinion', 'Fact or opinion?']]),
    socialUnit('soc7', 'armed-forces', 'Armed Forces and Sovereignty', [['timeline', 'From the NWMP to Vimy'], ['memorials', 'Reading a memorial']]),
  ],
  studentHref: (slug) => `social7/materials/${slug}`,
  parentHref: (slug) => `social7/parents/${slug}`,
  teacherHref: (slug) => `social7/teacher#${slug}`,
  viewHref: (slug, doc) => `social7/view/${slug}/${doc}`,
};
