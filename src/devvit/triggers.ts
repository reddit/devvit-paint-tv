import {Devvit} from '@devvit/public-api'
import {commandParse} from '../shared/command/command.ts'
import {type PeerMessage, realtimeVersion} from '../shared/types/message.ts'
import {noSID} from '../shared/types/sid.ts'
import {T1, T2, T3, isT1} from '../shared/types/tid.ts'
import {redisQueryPostSave, redisQueryProfile} from './redis.ts'

Devvit.addTrigger({
  event: 'CommentSubmit', // don't wait for CommentCreate. assume valid.
  async onEvent(ev, ctx): Promise<void> {
    if (!ev.comment) throw Error('no comment')

    const t3 = T3(ev.comment.postId)
    const post = await redisQueryPostSave(ctx.redis, t3)
    if (!post) return

    const t2 = T2(ev.comment.author)
    const profile = await redisQueryProfile(ctx, t2)

    const cmd = commandParse(ev.comment.body, {
      comment: T1(ev.comment.id),
      commenter: t2,
      parent: ev.comment.parentId
        ? isT1(ev.comment.parentId)
          ? ev.comment.parentId
          : T3(ev.comment.parentId)
        : undefined,
      post: t3,
      poster: post.author,
    })
    if (cmd?.type === 'Error' || cmd?.type === 'Help') return

    const msg: PeerMessage = {
      type: 'PeerComment',
      comment: cmd ?? {msg: ev.comment.body},
      peer: {profile, sid: noSID},
      version: realtimeVersion,
    }
    console.log(
      `${profile.username} trigger realtime ch=${t3} msg=${JSON.stringify(msg)}`,
    )
    ctx.realtime.send(t3, msg) // to-do: templatize send().
  },
})

// to-do: CommentDelete / CommentUpdate, mark with flair?
// to-do: Special behavior for PostDelete when a painting's original post is
//        gone. Maybe just update the provenance to indicate loss.
