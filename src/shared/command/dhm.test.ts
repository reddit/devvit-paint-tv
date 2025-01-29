import {describe, expect, test} from 'vitest'
import {dhmParse, dhmSerialize} from './dhm.js'

describe('dhmParse()', () => {
  for (const duration of [
    '',
    ' ',
    'a',
    '-1d',
    '-1h',
    '-1m',
    '60m',
    '61m',
    '24h',
    '25h',
    '1.1d',
    '1.1h',
    '1.1m',
    '1d ',
  ])
    test(`invalid duration: ${duration}`, () =>
      expect(dhmParse(duration)).toBe(undefined))

  test('valid durations', () => {
    expect(dhmParse('1d')).toStrictEqual({d: 1, h: 0, m: 0})
    expect(dhmParse('10d')).toStrictEqual({d: 10, h: 0, m: 0})
    expect(dhmParse('1d1h')).toStrictEqual({d: 1, h: 1, m: 0})
    expect(dhmParse('1d10h')).toStrictEqual({d: 1, h: 10, m: 0})
    expect(dhmParse('1d1m')).toStrictEqual({d: 1, h: 0, m: 1})
    expect(dhmParse('1d10m')).toStrictEqual({d: 1, h: 0, m: 10})
    expect(dhmParse('1d1h1m')).toStrictEqual({d: 1, h: 1, m: 1})
    expect(dhmParse('1d1h10m')).toStrictEqual({d: 1, h: 1, m: 10})
    expect(dhmParse('1h')).toStrictEqual({d: 0, h: 1, m: 0})
    expect(dhmParse('10h')).toStrictEqual({d: 0, h: 10, m: 0})
    expect(dhmParse('1h1m')).toStrictEqual({d: 0, h: 1, m: 1})
    expect(dhmParse('1h10m')).toStrictEqual({d: 0, h: 1, m: 10})
    expect(dhmParse('1m')).toStrictEqual({d: 0, h: 0, m: 1})
    expect(dhmParse('10m')).toStrictEqual({d: 0, h: 0, m: 10})
    expect(dhmParse('0d0h0m')).toStrictEqual({d: 0, h: 0, m: 0})
    expect(dhmParse('0D0H0M')).toStrictEqual({d: 0, h: 0, m: 0})
  })
})

test('dhmSerialize()', () => {
  expect(dhmSerialize({d: 0, h: 0, m: 0})).toBe('0m')
  expect(dhmSerialize({d: 1, h: 0, m: 0})).toBe('1d')
  expect(dhmSerialize({d: 0, h: 1, m: 0})).toBe('1h')
  expect(dhmSerialize({d: 0, h: 0, m: 1})).toBe('1m')
  expect(dhmSerialize({d: 1, h: 1, m: 1})).toBe('1d1h1m')
})
