import awsCcpBadge from '../assets/badges/aws-ccp.png'
import awsDvaBadge from '../assets/badges/aws-dva.png'
import awsSaaBadge from '../assets/badges/aws-saa.png'
import az900Badge from '../assets/badges/az-900.svg'

// Language-independent facts for the Certifications section, most recent first.
// The description of each lives in the messages files under certifications.items.<key>.
export type Certification = {
  key: 'awsDva' | 'awsSaa' | 'az900' | 'awsCcp'
  title: string
  issuer: string
  issued: string // YYYY-MM
  expires?: string // YYYY-MM; omit for certifications that never expire
  skills: readonly string[]
  // Badge or certificate scan; without one the card shows the hatched placeholder.
  image?: string
  credentialId?: string
  credentialUrl?: string
}

export const certifications: readonly Certification[] = [
  {
    key: 'awsDva',
    title: 'AWS Certified Developer – Associate',
    issuer: 'Amazon Web Services',
    issued: '2026-08',
    expires: '2029-08',
    skills: ['AWS', 'Cloud Computing'],
    image: awsDvaBadge,
    credentialUrl: 'https://www.credly.com/badges/cb525af8-6261-45be-aa6f-592306e818f4/public_url',
  },
  {
    key: 'awsSaa',
    title: 'AWS Certified Solutions Architect – Associate',
    issuer: 'Amazon Web Services',
    issued: '2026-07',
    expires: '2029-07',
    skills: ['AWS', 'Cloud Computing'],
    image: awsSaaBadge,
    credentialUrl: 'https://www.credly.com/badges/a3a54123-a916-4cd8-97e7-ce4b973000dc/public_url',
  },
  {
    key: 'az900',
    title: 'Microsoft Certified: Azure Fundamentals (AZ-900)',
    issuer: 'Microsoft',
    issued: '2025-02',
    skills: ['Azure', 'Cloud Computing'],
    image: az900Badge,
    credentialId: 'C13D7A-FAF989',
    credentialUrl: 'https://learn.microsoft.com/api/credentials/share/pt-br/luucasdinoo/80D222E1C7717305?sharingId=A4D9975795375631',
  },
  {
    key: 'awsCcp',
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    issued: '2024-08',
    expires: '2027-08',
    skills: ['AWS', 'Cloud Computing'],
    image: awsCcpBadge,
    credentialUrl: 'https://www.credly.com/badges/2817b42f-0106-4e33-8a0c-e7b5240dc1a1/public_url',
  },
]
