import {
  siAngular,
  siBamboo,
  siBitbucket,
  siDocker,
  siGit,
  siHibernate,
  siJunit5,
  siMongodb,
  siMysql,
  siNodedotjs,
  siOpenjdk,
  siPostman,
  siPython,
  siSonarqubeserver,
  siSpring,
  siSpringboot,
  siSwagger,
  siTypescript,
} from 'simple-icons'

// Keycap colour per category; blues and neutrals only, as the design system asks.
export type SkillCategory = 'backend' | 'data' | 'devops' | 'quality' | 'frontend'

export type Skill = {
  key: string
  name: string
  category: SkillCategory
  // Physical key that presses this keycap; the layout mirrors the keyboard's own rows.
  hotkey: string
  // SVG path on a 24×24 grid (simple-icons). Brands without an icon there show `label` instead.
  icon?: string
  label?: string
}

// Rows of five, top to bottom, matching the 1–5 / Q–T / A–G / Z–B blocks of a real keyboard.
// Description text lives in the messages files under skills.items.<key>.
export const skills = [
  { key: 'java', name: 'Java', category: 'backend', hotkey: '1', icon: siOpenjdk.path },
  { key: 'springBoot', name: 'Spring Boot', category: 'backend', hotkey: '2', icon: siSpringboot.path },
  { key: 'springCloud', name: 'Spring Cloud', category: 'backend', hotkey: '3', icon: siSpring.path },
  { key: 'hibernate', name: 'Hibernate / JPA', category: 'backend', hotkey: '4', icon: siHibernate.path },
  { key: 'junit', name: 'JUnit 5', category: 'quality', hotkey: '5', icon: siJunit5.path },

  { key: 'sqlServer', name: 'SQL Server', category: 'data', hotkey: 'q', label: 'SQL' },
  { key: 'mysql', name: 'MySQL', category: 'data', hotkey: 'w', icon: siMysql.path },
  { key: 'mongodb', name: 'MongoDB', category: 'data', hotkey: 'e', icon: siMongodb.path },
  { key: 'openapi', name: 'Swagger / OpenAPI', category: 'backend', hotkey: 'r', icon: siSwagger.path },
  { key: 'postman', name: 'Postman', category: 'quality', hotkey: 't', icon: siPostman.path },

  { key: 'docker', name: 'Docker', category: 'devops', hotkey: 'a', icon: siDocker.path },
  { key: 'aws', name: 'AWS', category: 'devops', hotkey: 's', label: 'aws' },
  { key: 'git', name: 'Git', category: 'devops', hotkey: 'd', icon: siGit.path },
  { key: 'bitbucket', name: 'Bitbucket', category: 'devops', hotkey: 'f', icon: siBitbucket.path },
  { key: 'bamboo', name: 'Bamboo', category: 'devops', hotkey: 'g', icon: siBamboo.path },

  { key: 'sonarqube', name: 'SonarQube', category: 'quality', hotkey: 'z', icon: siSonarqubeserver.path },
  { key: 'typescript', name: 'TypeScript', category: 'frontend', hotkey: 'x', icon: siTypescript.path },
  { key: 'angular', name: 'Angular', category: 'frontend', hotkey: 'c', icon: siAngular.path },
  { key: 'nodejs', name: 'Node.js', category: 'backend', hotkey: 'v', icon: siNodedotjs.path },
  { key: 'python', name: 'Python', category: 'backend', hotkey: 'b', icon: siPython.path },
] as const satisfies readonly Skill[]

export type SkillKey = (typeof skills)[number]['key']

export const skillColumns = 5
