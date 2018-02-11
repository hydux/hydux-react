import memoize from '../memoize'
import * as assert from 'assert'

describe('memoize', () => {
  it('number', () => {
    const action = (f: number) => f
    const cb1 = memoize(action, 1)
    const cb2 = memoize(action, 1)
    const cb3 = memoize(action, 2)
    assert.equal(cb1, cb2)
    assert.notEqual(cb1, cb3)
  })
  it('object + string', () => {
    const action = (f: object, str: string) => f
    const obj1 = {}
    const cb1 = memoize(action, obj1, 'aaa')
    const cb2 = memoize(action, obj1, 'aaa')
    const cb3 = memoize(action, {}, 'bbb')
    assert.equal(cb1, cb2)
    assert.notEqual(cb1, cb3)
  })
})
