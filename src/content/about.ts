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
  stats: [
    { key: 'projects', value: '[?]+', icon: 'FolderGit2' },
    { key: 'years', value: '[?]+', icon: 'CalendarDays' },
    { key: 'apis', value: '[?]+', icon: 'Server' },
    { key: 'skills', value: '[?]+', icon: 'Zap' },
  ],
} as const
