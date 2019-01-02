
import hash from './hash'
import * as LRUCache from 'lru-cache'

let cache = new LRUCache<string, Function>({
  max: 100,
  maxAge: 10 * 60 * 1000
})

export default function memoize<A, Res>(
  callback: (a: A, evt: React.SyntheticEvent<any>) => Res,
  a: A,
): (evt: any) => Res
export default function memoize<A, B, Res>(
  callback: (a: A, b: B, evt: React.SyntheticEvent<any>) => Res,
   a: A, b: B,
): Res
export default function memoize<A, B, C, Res>(
  callback: (a: A, b: B, c: C, evt: React.SyntheticEvent<any>) => Res,
  a: A, b: B, c: C,
): (evt: any) => Res
export default function memoize<A, B, C, D, Res>(
  callback: (a: A, b: B, c: C, d: D, evt: React.SyntheticEvent<any>) => Res,
  a: A, b: B, c: C, d: D,
): (evt: any) => Res
export default function memoize<A, B, C, D, E, Res>(
  callback: (a: A, b: B, c: C, d: D, e: E, evt: React.SyntheticEvent<any>) => Res,
  a: A, b: B, c: C, d: D, e: E,
): (evt: any) => Res
export default function memoize<A, B, C, D, E, F, Res>(
  callback: (a: A, b: B, c: C, d: D, e: E, f: F, evt: React.SyntheticEvent<any>) => Res,
  a: A, b: B, c: C, d: D, e: E, f: F,
): (evt: any) => Res
/**
 * @deprecated Deprecated for React.useCallback
 * @param callback
 * @param args
 */
export default function memoize(callback: (...args: any[]) => any, ...args) {
  const hashStr = args.concat(callback).map(hash).join('|')
  let cached = cache.get(hashStr)
  if (!cached) {
    cached = e => callback(...args, e)
    cache.set(hashStr, cached)
  }
  return cached
}

export function setCacheOptions(opts: LRUCache.Options) {
  cache = new LRUCache(opts)
}
