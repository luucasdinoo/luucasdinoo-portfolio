import { social } from '../config/site'

// Form service URL (Formspree, Web3Forms and the like take a JSON POST). Set VITE_CONTACT_ENDPOINT in .env.local;
// without it the form falls back to opening the visitor's mail app with the message filled in.
const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined

export const contactDelivery: 'endpoint' | 'mailto' = endpoint ? 'endpoint' : 'mailto'

type ContactMessage = {
  email: string
  message: string
  subject: string
}

export async function sendContact({ email, message, subject }: ContactMessage): Promise<void> {
  if (!endpoint) {
    const params = new URLSearchParams({ subject, body: `${message}\n\n— ${email}` })
    // URLSearchParams encodes spaces as "+", which mail apps show literally.
    window.location.href = `${social.email}?${params.toString().replace(/\+/g, '%20')}`
    return
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, message, _subject: subject, _replyto: email }),
  })
  if (!response.ok) throw new Error(`Contact endpoint answered ${response.status}`)
}
