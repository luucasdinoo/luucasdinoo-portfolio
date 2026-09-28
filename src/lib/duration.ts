function parts(iso: string): [number, number] {
  const [year, month] = iso.split('-').map(Number)
  return [year, month]
}

// LinkedIn-style span: Jan–Jul counts as 6 months, never less than 1.
export function monthsElapsed(start: string, end: string | null): number {
  const [sy, sm] = parts(start)
  const now = new Date()
  const [ey, em] = end ? parts(end) : [now.getFullYear(), now.getMonth() + 1]
  return Math.max((ey - sy) * 12 + (em - sm), 1)
}
