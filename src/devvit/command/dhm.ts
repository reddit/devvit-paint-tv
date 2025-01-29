/** A duration in days, hours, and minutes. */
export type DHM = {d: number; h: number; m: number}

/** Days are >= 0, hours are [0, 23], minutes are [0, 59]; all are ints. */
export function dhmParse(duration: string): DHM | undefined {
  const [, ...dhm] = duration.match(/^(\d+d)?(\d+h)?(\d+m)?$/i) ?? []
  const [d, h, m] = dhm.map(x => (x == null ? undefined : Number.parseInt(x)))
  if (d == null && h == null && m == null) return
  if ((d && d < 0) || (h && h < 0) || (m && m < 0)) return
  // to-do: revisit this requirement.
  if ((h && h >= 24) || (m && m >= 60)) return
  return {d: d ?? 0, h: h ?? 0, m: m ?? 0}
}

/** Returns duration in milliseconds. */
export function dhmMillis(dhm: Readonly<DHM>): number {
  return (
    dhm.d * 24 * 60 * 60 * 1000 + +(dhm.h * 60 * 60 * 1000) + dhm.m * 60 * 1000
  )
}

export function dhmSerialize(dhm: Readonly<DHM>): string {
  if (!dhm.d && !dhm.h && !dhm.m) return '0m'
  return `${dhm.d ? `${dhm.d}d` : ''}${dhm.h ? `${dhm.h}h` : ''}${dhm.m ? `${dhm.m}m` : ''}`
}
