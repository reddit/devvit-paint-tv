import {V4, noV4} from './v4.ts'

/** session / screen identity. reset on app (re)load. */
export type SID = `sid-${V4}`

export const noSID: SID = `sid-${noV4}`

export function SID(): SID {
  return `sid-${V4()}`
}
