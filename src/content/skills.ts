import {
  siAngular,
  siDocker,
  siGit,
  siJunit5,
  siKubernetes,
  siMongodb,
  siNodedotjs,
  siOpenjdk,
  siPostgresql,
  siSpring,
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
// Description text lives in the messages files under skills.items.<key>; skills.names.<key> overrides `name` where it needs translating.
export const skills = [
  { key: 'java', name: 'Java', category: 'backend', hotkey: '1', icon: siOpenjdk.path },
  { key: 'typescript', name: 'TypeScript', category: 'frontend', hotkey: '2', icon: siTypescript.path },
  { key: 'spring', name: 'Spring', category: 'backend', hotkey: '3', icon: siSpring.path },
  { key: 'angular', name: 'Angular', category: 'frontend', hotkey: '4', icon: siAngular.path },
  { key: 'nodejs', name: 'Node.js', category: 'backend', hotkey: '5', icon: siNodedotjs.path },

  { key: 'junit', name: 'JUnit 5', category: 'quality', hotkey: 'q', icon: siJunit5.path },
  { key: 'aws', name: 'AWS', category: 'devops', hotkey: 'w', label: 'aws' },
  { key: 'azure', name: 'Azure', category: 'devops', hotkey: 'e', label: 'Azure' },
  { key: 'mockito', name: 'Mockito', category: 'quality', hotkey: 'r', label: 'Mock' },
  { key: 'sql', name: 'SQL', category: 'data', hotkey: 't', label: 'SQL' },

  { key: 'docker', name: 'Docker', category: 'devops', hotkey: 'a', icon: siDocker.path },
  { key: 'kubernetes', name: 'Kubernetes', category: 'devops', hotkey: 's', icon: siKubernetes.path },
  { key: 'git', name: 'Git', category: 'devops', hotkey: 'd', icon: siGit.path },
  { key: 'postgresql', name: 'PostgreSQL', category: 'data', hotkey: 'f', icon: siPostgresql.path },
  { key: 'mongodb', name: 'MongoDB', category: 'data', hotkey: 'g', icon: siMongodb.path },

  { key: 'cicd', name: 'CI/CD', category: 'devops', hotkey: 'z', label: 'CI/CD' },
  { key: 'rest', name: 'REST', category: 'backend', hotkey: 'x', label: 'REST' },
  { key: 'soap', name: 'SOAP', category: 'backend', hotkey: 'c', label: 'SOAP' },
  { key: 'ace', name: 'IBM App Connect Enterprise', category: 'backend', hotkey: 'v', label: 'ACE' },
  { key: 'messaging', name: 'Mensageria', category: 'backend', hotkey: 'b', label: 'MQ' },
] as const satisfies readonly Skill[]

export type SkillKey = (typeof skills)[number]['key']

export const skillColumns = 5
