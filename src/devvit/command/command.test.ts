import {describe, expect, test} from 'vitest'
import {type CommandThread, commandParse} from './command.js'

const thread: Readonly<CommandThread> = {
  comment: 't1_comment',
  commenter: 't2_commenter',
  parent: 't1_parent',
  post: 't3_post',
  poster: 't2_poster',
}

describe('general', () => {
  for (const comment of [
    '',
    ' ',
    '\n',
    'abc',
    'abc\ndef',
    'abc\n!tv buy $1 1d',
    'abc\n!tv buy $1 1d\ndef',
    'abc'.repeat(10),
    '!tv buyd $1 1d',
  ])
    test(`non-command comments are skipped: "${comment}"`, () => {
      expect(commandParse(comment, thread)).toBe(undefined)
    })

  for (const comment of [
    ' !tv buy $1 1d',
    '\n!tv buy $1 1d',
    '\n\n\n!tv buy $1 1d',
    '!tv buy $1 1d ',
    '!tv buy $1 1d\n',
    '!tv  buy   $1    1d     ',
    '\t!tv\tbuy\t$1\t1d\t',
  ])
    test(`whitespace is ignored: "${comment}"`, () =>
      expect(commandParse(comment, thread)).toStrictEqual({
        buyer: {t2: 't2_commenter', trade: 1},
        expiry: {d: 1, h: 0, m: 0},
        msg: '',
        seller: {t2: 't2_poster', trade: 't3_post'},
        t1: 't1_comment',
        type: 'Buy',
      }))

  for (const comment of [
    '!TV buy $1 1d',
    '!tV buy $1 1d',
    '!Tv buy $1 1d',
    '!tv Buy $1 1d',
    '!tv buy $1 1d',
    '!tv buy $1 1D',
  ])
    test(`casing is ignored: "${comment}"`, () =>
      expect(commandParse(comment, thread)).toStrictEqual({
        buyer: {t2: 't2_commenter', trade: 1},
        expiry: {d: 1, h: 0, m: 0},
        msg: '',
        seller: {t2: 't2_poster', trade: 't3_post'},
        t1: 't1_comment',
        type: 'Buy',
      }))
})

describe('buy', () => {
  test('valid durations', () => {
    expect(commandParse('!tv buy $1 5m', thread)).toMatchInlineSnapshot(`
      {
        "buyer": {
          "t2": "t2_commenter",
          "trade": 1,
        },
        "expiry": {
          "d": 0,
          "h": 0,
          "m": 5,
        },
        "msg": "",
        "seller": {
          "t2": "t2_poster",
          "trade": "t3_post",
        },
        "t1": "t1_comment",
        "type": "Buy",
      }
    `)
    expect(commandParse('!tv buy $1 6m', thread)).toMatchInlineSnapshot(`
      {
        "buyer": {
          "t2": "t2_commenter",
          "trade": 1,
        },
        "expiry": {
          "d": 0,
          "h": 0,
          "m": 6,
        },
        "msg": "",
        "seller": {
          "t2": "t2_poster",
          "trade": "t3_post",
        },
        "t1": "t1_comment",
        "type": "Buy",
      }
    `)
    expect(commandParse('!tv buy $1 1h', thread)).toMatchInlineSnapshot(`
      {
        "buyer": {
          "t2": "t2_commenter",
          "trade": 1,
        },
        "expiry": {
          "d": 0,
          "h": 1,
          "m": 0,
        },
        "msg": "",
        "seller": {
          "t2": "t2_poster",
          "trade": "t3_post",
        },
        "t1": "t1_comment",
        "type": "Buy",
      }
    `)
    expect(commandParse('!tv buy $1 1d', thread)).toMatchInlineSnapshot(`
      {
        "buyer": {
          "t2": "t2_commenter",
          "trade": 1,
        },
        "expiry": {
          "d": 1,
          "h": 0,
          "m": 0,
        },
        "msg": "",
        "seller": {
          "t2": "t2_poster",
          "trade": "t3_post",
        },
        "t1": "t1_comment",
        "type": "Buy",
      }
    `)
    expect(commandParse('!tv buy $1 0d0h5m', thread)).toMatchInlineSnapshot(`
      {
        "buyer": {
          "t2": "t2_commenter",
          "trade": 1,
        },
        "expiry": {
          "d": 0,
          "h": 0,
          "m": 5,
        },
        "msg": "",
        "seller": {
          "t2": "t2_poster",
          "trade": "t3_post",
        },
        "t1": "t1_comment",
        "type": "Buy",
      }
    `)
    expect(commandParse('!tv buy $1 23h59m', thread)).toMatchInlineSnapshot(`
      {
        "buyer": {
          "t2": "t2_commenter",
          "trade": 1,
        },
        "expiry": {
          "d": 0,
          "h": 23,
          "m": 59,
        },
        "msg": "",
        "seller": {
          "t2": "t2_poster",
          "trade": "t3_post",
        },
        "t1": "t1_comment",
        "type": "Buy",
      }
    `)
  })

  for (const duration of [
    '',
    'a',
    '300s',
    '24h',
    '60m',
    '1m',
    '5.1m',
    '1441m',
    '25h',
    '2d',
    '24h1m',
  ])
    test(`invalid durations: ${duration}`, () =>
      expect(
        commandParse(`!tv buy $1 ${duration}`, thread)?.type,
      ).toStrictEqual('Error'))

  test('valid trades', () => {
    expect(commandParse('!tv buy $0 1d', thread)).toMatchInlineSnapshot(`
      {
        "msg": "Offer not int >= $0.",
        "type": "Error",
      }
    `)
    expect(commandParse('!tv buy $1 1d', thread)).toMatchInlineSnapshot(`
      {
        "buyer": {
          "t2": "t2_commenter",
          "trade": 1,
        },
        "expiry": {
          "d": 1,
          "h": 0,
          "m": 0,
        },
        "msg": "",
        "seller": {
          "t2": "t2_poster",
          "trade": "t3_post",
        },
        "t1": "t1_comment",
        "type": "Buy",
      }
    `)
    expect(commandParse('!tv buy $10 1d', thread)).toMatchInlineSnapshot(`
      {
        "buyer": {
          "t2": "t2_commenter",
          "trade": 10,
        },
        "expiry": {
          "d": 1,
          "h": 0,
          "m": 0,
        },
        "msg": "",
        "seller": {
          "t2": "t2_poster",
          "trade": "t3_post",
        },
        "t1": "t1_comment",
        "type": "Buy",
      }
    `)
    // expect(commandParse('!tv buy $1,1ibselq 1d', thread)).toMatchInlineSnapshot()
    // expect(commandParse('!tv buy 1ibselq 1d',thread)).toMatchInlineSnapshot()
    // expect(commandParse('!tv buy 1ibselq,1ibselq,1ibselq,$1 1d',thread)).toMatchInlineSnapshot()
    // expect(
    //   commandParse('!tv buy https://www.reddit.com/r/painttvoid/comments/1ibselq/paint_tv_ch_3 1d',thread),
    // ).toMatchInlineSnapshot()
    // expect(
    //   commandParse('!tv buy https://www.reddit.com/r/painttvoid/comments/1ibselq/paint_tv_ch_3/ 1d',thread),
    // ).toMatchInlineSnapshot()
    // expect(
    //   commandParse('!tv buy https://www.reddit.com/r/painttvoid/comments/1ibselq 1d',thread)
    // ).toMatchInlineSnapshot()
  })

  for (const trade of ['', 'a', '1', '$1.1', '-$1', '$-1', ',', ',$1', '$1,'])
    test(`invalid trade: ${trade}`, () =>
      expect(commandParse(`!tv buy ${trade} 1d`, thread)).toStrictEqual({
        msg: 'Missing arguments; comment `!tv help` for documentation.',
        type: 'Error',
      }))

  test('valid messages', () => {
    expect(commandParse('!tv buy $1 1d', thread)).toMatchInlineSnapshot(`
      {
        "buyer": {
          "t2": "t2_commenter",
          "trade": 1,
        },
        "expiry": {
          "d": 1,
          "h": 0,
          "m": 0,
        },
        "msg": "",
        "seller": {
          "t2": "t2_poster",
          "trade": "t3_post",
        },
        "t1": "t1_comment",
        "type": "Buy",
      }
    `)
    expect(commandParse('!tv buy $1 1d ', thread)).toMatchInlineSnapshot(`
      {
        "buyer": {
          "t2": "t2_commenter",
          "trade": 1,
        },
        "expiry": {
          "d": 1,
          "h": 0,
          "m": 0,
        },
        "msg": "",
        "seller": {
          "t2": "t2_poster",
          "trade": "t3_post",
        },
        "t1": "t1_comment",
        "type": "Buy",
      }
    `)
    expect(commandParse('!tv buy $1 1d a', thread)).toMatchInlineSnapshot(`
      {
        "buyer": {
          "t2": "t2_commenter",
          "trade": 1,
        },
        "expiry": {
          "d": 1,
          "h": 0,
          "m": 0,
        },
        "msg": "a",
        "seller": {
          "t2": "t2_poster",
          "trade": "t3_post",
        },
        "t1": "t1_comment",
        "type": "Buy",
      }
    `)
    expect(commandParse('!tv buy $1 1d a b c', thread)).toMatchInlineSnapshot(`
      {
        "buyer": {
          "t2": "t2_commenter",
          "trade": 1,
        },
        "expiry": {
          "d": 1,
          "h": 0,
          "m": 0,
        },
        "msg": "a b c",
        "seller": {
          "t2": "t2_poster",
          "trade": "t3_post",
        },
        "t1": "t1_comment",
        "type": "Buy",
      }
    `)
    expect(commandParse('!tv buy $1 1d a\n', thread)).toMatchInlineSnapshot(`
      {
        "buyer": {
          "t2": "t2_commenter",
          "trade": 1,
        },
        "expiry": {
          "d": 1,
          "h": 0,
          "m": 0,
        },
        "msg": "a
      ",
        "seller": {
          "t2": "t2_poster",
          "trade": "t3_post",
        },
        "t1": "t1_comment",
        "type": "Buy",
      }
    `)
    expect(commandParse('!tv buy $1 1d a\nb', thread)).toMatchInlineSnapshot(`
      {
        "buyer": {
          "t2": "t2_commenter",
          "trade": 1,
        },
        "expiry": {
          "d": 1,
          "h": 0,
          "m": 0,
        },
        "msg": "a
      b",
        "seller": {
          "t2": "t2_poster",
          "trade": "t3_post",
        },
        "t1": "t1_comment",
        "type": "Buy",
      }
    `)
    expect(commandParse('!tv buy $1 1d\n', thread)).toMatchInlineSnapshot(`
      {
        "buyer": {
          "t2": "t2_commenter",
          "trade": 1,
        },
        "expiry": {
          "d": 1,
          "h": 0,
          "m": 0,
        },
        "msg": "",
        "seller": {
          "t2": "t2_poster",
          "trade": "t3_post",
        },
        "t1": "t1_comment",
        "type": "Buy",
      }
    `)
    expect(commandParse('!tv buy $1 1d\na', thread)).toMatchInlineSnapshot(`
      {
        "buyer": {
          "t2": "t2_commenter",
          "trade": 1,
        },
        "expiry": {
          "d": 1,
          "h": 0,
          "m": 0,
        },
        "msg": "a",
        "seller": {
          "t2": "t2_poster",
          "trade": "t3_post",
        },
        "t1": "t1_comment",
        "type": "Buy",
      }
    `)
    expect(commandParse('!tv buy $1 1d\na\n', thread)).toMatchInlineSnapshot(`
      {
        "buyer": {
          "t2": "t2_commenter",
          "trade": 1,
        },
        "expiry": {
          "d": 1,
          "h": 0,
          "m": 0,
        },
        "msg": "a
      ",
        "seller": {
          "t2": "t2_poster",
          "trade": "t3_post",
        },
        "t1": "t1_comment",
        "type": "Buy",
      }
    `)
    expect(commandParse('!tv buy $1 1d\na\nb', thread)).toMatchInlineSnapshot(`
      {
        "buyer": {
          "t2": "t2_commenter",
          "trade": 1,
        },
        "expiry": {
          "d": 1,
          "h": 0,
          "m": 0,
        },
        "msg": "a
      b",
        "seller": {
          "t2": "t2_poster",
          "trade": "t3_post",
        },
        "t1": "t1_comment",
        "type": "Buy",
      }
    `)
    expect(
      commandParse(`!tv buy $1 1d ${'abc'.repeat(10)}`, thread),
    ).toMatchInlineSnapshot(`
      {
        "buyer": {
          "t2": "t2_commenter",
          "trade": 1,
        },
        "expiry": {
          "d": 1,
          "h": 0,
          "m": 0,
        },
        "msg": "abcabcabcabcabcabcabcabcabcabc",
        "seller": {
          "t2": "t2_poster",
          "trade": "t3_post",
        },
        "t1": "t1_comment",
        "type": "Buy",
      }
    `)
  })

  test('missing arguments', () => {
    expect(commandParse('!tv buy', thread)).toMatchInlineSnapshot(`
      {
        "msg": "Missing arguments; comment \`!tv help\` for documentation.",
        "type": "Error",
      }
    `)
    expect(commandParse('!tv buy $1', thread)).toMatchInlineSnapshot(`
      {
        "msg": "Missing arguments; comment \`!tv help\` for documentation.",
        "type": "Error",
      }
    `)
  })
})

test('accept', () => {
  expect(commandParse('!tv ok', thread)).toMatchInlineSnapshot(`
    {
      "msg": "",
      "t1": "t1_parent",
      "type": "OK",
    }
  `)
  expect(commandParse('!tv ok abc', thread)).toMatchInlineSnapshot(`
    {
      "msg": "abc",
      "t1": "t1_parent",
      "type": "OK",
    }
  `)
})

test('help', () => {
  expect(commandParse('!tv help', thread)).toMatchInlineSnapshot(`
    {
      "type": "Help",
    }
  `)
})
