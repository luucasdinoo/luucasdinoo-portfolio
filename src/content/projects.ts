// Language-independent facts for the Projects section. First entry is the featured card.
// Summary, overview and screenshot captions live in the messages files under projects.items.<key>.
// MOCK: the three entries below are placeholders until the real projects arrive.
export type ProjectIcon = 'CreditCard' | 'Clapperboard' | 'BellRing'

export type Project = {
  key: 'payflow' | 'catalog' | 'notify'
  name: string
  year: number
  status: 'live' | 'building'
  icon: ProjectIcon
  stack: readonly string[]
  // One per caption in the messages file; a missing image renders the hatched placeholder.
  images: readonly string[]
  liveUrl?: string
  repoUrl?: string
}

export const projects: readonly Project[] = [
  {
    key: 'payflow',
    name: 'Payflow API',
    year: 2026,
    status: 'live',
    icon: 'CreditCard',
    stack: ['Java 21', 'Spring Boot', 'PostgreSQL', 'Kafka', 'Docker', 'JUnit', 'OpenAPI'],
    images: [],
    liveUrl: '#',
    repoUrl: '#',
  },
  {
    key: 'catalog',
    name: 'Catalog Service',
    year: 2025,
    status: 'live',
    icon: 'Clapperboard',
    stack: ['Java 17', 'Spring Boot', 'MySQL', 'RabbitMQ', 'Clean Architecture', 'Testcontainers'],
    images: [],
    repoUrl: '#',
  },
  {
    key: 'notify',
    name: 'Notify Hub',
    year: 2026,
    status: 'building',
    icon: 'BellRing',
    stack: ['Java 21', 'Spring Cloud', 'Redis', 'AWS SQS', 'Docker'],
    images: [],
    repoUrl: '#',
  },
]
