// Language-independent facts for the Certifications section, most recent first.
// The description of each lives in the messages files under certifications.items.<key>.
// MOCK: the six entries below are placeholders until the real certifications arrive.
export type Certification = {
  key: 'awsSaa' | 'az204' | 'awsCcp' | 'az900' | 'ckad' | 'ocp17'
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
    key: 'awsSaa',
    title: 'AWS Certified Solutions Architect – Associate',
    issuer: 'Amazon Web Services',
    issued: '2026-06',
    expires: '2029-06',
    skills: ['EC2', 'VPC', 'RDS', 'Well-Architected'],
    credentialId: 'AWS-SAA-0000',
    credentialUrl: '#',
  },
  {
    key: 'az204',
    title: 'Azure Developer Associate (AZ-204)',
    issuer: 'Microsoft',
    issued: '2026-03',
    expires: '2027-03',
    skills: ['App Service', 'Functions', 'Cosmos DB'],
    credentialId: 'MS-AZ204-0000',
    credentialUrl: '#',
  },
  {
    key: 'awsCcp',
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    issued: '2025-10',
    expires: '2028-10',
    skills: ['IAM', 'S3', 'Billing', 'Shared Responsibility'],
    credentialId: 'AWS-CCP-0000',
    credentialUrl: '#',
  },
  {
    key: 'az900',
    title: 'Azure Fundamentals (AZ-900)',
    issuer: 'Microsoft',
    issued: '2025-06',
    skills: ['Cloud Concepts', 'Entra ID', 'Governance'],
    credentialId: 'MS-AZ900-0000',
    credentialUrl: '#',
  },
  {
    key: 'ckad',
    title: 'Certified Kubernetes Application Developer',
    issuer: 'The Linux Foundation',
    issued: '2025-02',
    expires: '2027-02',
    skills: ['Kubernetes', 'Helm', 'Probes'],
    credentialId: 'LF-CKAD-0000',
    credentialUrl: '#',
  },
  {
    key: 'ocp17',
    title: 'Oracle Certified Professional: Java SE 17 Developer',
    issuer: 'Oracle',
    issued: '2024-09',
    skills: ['Java 17', 'Streams', 'Concurrency'],
    credentialId: 'OCP-17-0000',
    credentialUrl: '#',
  },
]
