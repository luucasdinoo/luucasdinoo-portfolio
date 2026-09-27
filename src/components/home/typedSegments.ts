export type Segment = { text: string; accent?: boolean }

/** Splits "Desenvolvedor <accent>back-end</accent>" into styled segments. */
export function parseAccent(raw: string): Segment[] {
  return raw
    .split(/(<accent>.*?<\/accent>)/)
    .filter(Boolean)
    .map((part) => {
      const match = /^<accent>(.*)<\/accent>$/.exec(part)
      return match ? { text: match[1], accent: true } : { text: part }
    })
}

export function segmentsLength(segments: Segment[]) {
  return segments.reduce((sum, s) => sum + [...s.text].length, 0)
}
