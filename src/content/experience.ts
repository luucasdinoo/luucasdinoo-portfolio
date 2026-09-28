// Language-independent facts for the Experience section. Most recent first.
// Role, location and bullet text live in the messages files under experience.jobs.<key>.
export const experience = {
  jobs: [
    {
      key: 'capgemini',
      company: 'Capgemini',
      start: '2025-07',
      end: null,
      stack: [
        'Java 7/8',
        'Java 21',
        'Spring Boot',
        'Spring Cloud',
        'Spring Data',
        'SpringDoc',
        'Lombok',
        'SQL Server',
        'Docker',
        'JUnit',
        'Mockito',
        'IBM ACE',
        'REST',
        'SOAP',
        'Bitbucket',
        'Bamboo',
        'SonarQube',
      ],
    },
    {
      key: 'avanade',
      company: 'Avanade',
      start: '2025-01',
      end: '2025-07',
      stack: ['Java', 'Spring Boot', 'TypeScript', 'Angular'],
    },
    {
      key: 'compassuol',
      company: 'Compass UOL',
      start: '2024-04',
      end: '2024-09',
      stack: ['Java', 'Spring Boot', 'Microservices', 'AWS'],
    },
  ],
} as const
