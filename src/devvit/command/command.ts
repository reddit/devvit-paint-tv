import type {T1, T2, T3} from '../../shared/types/tid.ts'
import {type DHM, dhmParse, dhmSerialize} from './dhm.ts'

export type Command = BuyCommand | OKCommand | HelpCommand
export type CommandError = {type: 'Error'; msg: string}
export type CommandThread = {
  comment: T1
  commenter: T2
  parent: T1 | undefined
  post: T3
  poster: T2
}

export type BuyCommand = {
  buyer: {t2: T2; trade: number}
  /** [5m, 1d]; may exceed auction. */
  expiry: DHM
  msg: string
  seller: {t2: T2; trade: T3}
  t1: T1
  type: 'Buy'
}

/** Print documentation for all commands. */
export type HelpCommand = {type: 'Help'}

/** Accept a buy. */
export type OKCommand = {msg: string; t1: T1; type: 'OK'}

export function commandParse(
  comment: string,
  thread: Readonly<CommandThread>,
): Command | CommandError | undefined {
  const [, cmd, rest] =
    comment.match(/^[\s\n]*!tv\s+(buy|ok|help)\b[\s\n]*((?:.|\n)*)$/i) ?? []
  switch (cmd?.toLowerCase()) {
    case 'buy':
      return buyCommandParse(rest ?? '', thread)
    case 'ok':
      return okCommandParse(rest ?? '', thread)
    case 'help':
      return {type: 'Help'}
  }
}

export function commandSerialize(cmd: Readonly<Command>): string {
  switch (cmd.type) {
    case 'Buy':
      return `!tv buy $${cmd.buyer.trade} ${dhmSerialize(cmd.expiry)}`
    case 'Help':
      return '!tv help'
    case 'OK':
      return `!tv ok ${cmd.msg}`
  }
}

function buyCommandParse(
  args: string,
  thread: Readonly<CommandThread>,
): BuyCommand | CommandError {
  const [, $Str, duration, msg] =
    args?.match(/^\$(\d+)\s+((?:\d+[dhm]){1,3})\b[\s\n]*((?:.|\n)*)$/i) ?? []

  if ($Str == null || duration == null)
    return {
      type: 'Error',
      msg: 'Missing arguments; comment `!tv help` for documentation.',
    }

  const $ = Number.parseInt($Str)
  if (!$ || $ < 0) return {type: 'Error', msg: 'Offer not int >= $0.'}

  const expiry = dhmParse(duration)
  if (!expiry) return {type: 'Error', msg: 'Expiry not #d#h#m.'}
  if ((!expiry.d && !expiry.h && expiry.m < 5) || expiry.d > 1)
    return {type: 'Error', msg: 'Expiry not int in [5m, 1d].'}

  return {
    buyer: {t2: thread.commenter, trade: $},
    expiry,
    msg: msg ?? '',
    seller: {t2: thread.poster, trade: thread.post},
    t1: thread.comment,
    type: 'Buy',
  }
}

function okCommandParse(
  args: string,
  thread: Readonly<CommandThread>,
): OKCommand | CommandError {
  if (!thread.parent) return {type: 'Error', msg: 'No buyer.'}
  return {t1: thread.parent, msg: args, type: 'OK'}
}
