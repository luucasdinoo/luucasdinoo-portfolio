import { experience } from './experience'
import { monthsElapsed } from '../lib/duration'

// Sum of each job's span (no overlap between them), so this stays correct as Capgemini's "present" role goes on.
const totalExperienceMonths = experience.jobs.reduce((sum, job) => sum + monthsElapsed(job.start, job.end), 0)
const yearsOfExperience = Math.floor(totalExperienceMonths / 12)

// Language-independent facts for the About section. Values in [brackets] are placeholders to fill in.
export const about = {
  name: 'Lucas Bernadino',
  initials: 'LB',
  location: {
    city: 'Recife',
    timeZone: 'America/Recife',
    lat: -8.05,
    lon: -34.9,
  },
  // Most recent first. `degree` and `status` are keys under about.education in the messages files.
  education: [
    { institution: 'UNINASSAU', degree: 'computerScience', status: 'inProgress', period: '2023 – 2027' },
    { institution: 'Universidade Católica de Pernambuco', degree: 'internetSystems', status: 'completed', period: '2023 – 2025' },
  ],
  stats: [
    { key: 'projects', value: '[?]+', icon: 'FolderGit2' },
    { key: 'years', value: `${yearsOfExperience}+`, icon: 'CalendarDays' },
    { key: 'apis', value: '[?]+', icon: 'Server' },
    { key: 'skills', value: '[?]+', icon: 'Zap' },
  ],
} as const
