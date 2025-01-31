import {type Context, Devvit, type JobContext} from '@devvit/public-api'
import {App} from './devvit/components/app.js'
import {r2CreatePost, r2QueryProfile} from './devvit/r2.jsx'
import {redisSetPostSave} from './devvit/redis.js'
import {PostSave, PostSeedFromNothing} from './shared/save.js'
import {T2} from './shared/types/tid.js'

import './devvit/triggers.js'

Devvit.addCustomPostType({name: '', height: 'regular', render: App})

Devvit.addMenuItem({
  forUserType: ['moderator'], // to-do: allow users to posts too.
  label: 'Start Paint TV channel', // to-do: different label.
  location: 'subreddit',
  onPress: async (_ev, ctx) => createPost(ctx, 'UI'),
})

async function createPost(
  ctx: Context | JobContext,
  mode: 'UI' | 'NoUI',
): Promise<void> {
  const username = ctx.userId
    ? (await r2QueryProfile(ctx.reddit, T2(ctx.userId))).username
    : 'painttv'
  const seed = PostSeedFromNothing()
  const r2Post = await r2CreatePost(ctx, seed, username)
  await redisSetPostSave(ctx.redis, PostSave(r2Post, seed))
  if (mode === 'UI' && 'ui' in ctx) ctx.ui.navigateTo(r2Post)
}

export default Devvit
