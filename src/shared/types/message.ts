import type {BuyCommand, OKCommand} from '../command/command.ts'
import type {Player, PostSeed} from '../save.ts'

/**
 * a message from blocks to the iframe. Init always arrived first, usually
 * followed by Connected.
 */
export type DevvitMessage =
  | InitDevvitMessage
  | {type: 'Connected'}
  | {type: 'Disconnected'}
  | {peer: Player; type: 'PeerConnected'}
  | {peer: Player; type: 'PeerDisconnected'}
  | PeerMessage

export type InitDevvitMessage = {
  /**
   * configure iframe lifetime debug mode. this is by request in devvit but that
   * granularity doesn't make sense in the iframe.
   */
  debug: boolean
  p1: Player
  seed: PostSeed
  type: 'Init'
}

/** the devvit API wraps all messages from blocks to the iframe. */
export type DevvitSystemMessage = {
  data: {message: DevvitMessage}
  type?: 'devvit-message'
}

/** a message from the iframe to devvit. */
export type WebViewMessage =
  /** iframe has registered a message listener. */
  | {type: 'Registered'}
  | {p1: Player; type: 'NewGame'}
  | {p1: Player; type: 'Save'}
  | PeerPaintMessage

/** a realtime message from another instance. */
export type PeerMessage =
  | (RealtimeMessage & {
      type: 'PeerComment'
      comment: BuyCommand | OKCommand | {msg: string}
    })
  | PeerPaintMessage

export type PeerPaintMessage = RealtimeMessage & {type: 'PeerPaint'}

/** base realtime message sent or received. */
export type RealtimeMessage = {
  peer: Player
  /** message schema version. */
  version: number
}

/** message versions supported by this instance. */
export const realtimeVersion: number = 0
