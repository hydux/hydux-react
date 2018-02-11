/// <reference types="react" />
/// <reference types="lru-cache" />
import * as LRUCache from 'lru-cache';
export default function memoize<A, Res>(callback: (a: A, evt: React.SyntheticEvent<any>) => Res, a: A): (evt: any) => Res;
export default function memoize<A, B, Res>(callback: (a: A, b: B, evt: React.SyntheticEvent<any>) => Res, a: A, b: B): Res;
export default function memoize<A, B, C, Res>(callback: (a: A, b: B, c: C, evt: React.SyntheticEvent<any>) => Res, a: A, b: B, c: C): (evt: any) => Res;
export default function memoize<A, B, C, D, Res>(callback: (a: A, b: B, c: C, d: D, evt: React.SyntheticEvent<any>) => Res, a: A, b: B, c: C, d: D): (evt: any) => Res;
export default function memoize<A, B, C, D, E, Res>(callback: (a: A, b: B, c: C, d: D, e: E, evt: React.SyntheticEvent<any>) => Res, a: A, b: B, c: C, d: D, e: E): (evt: any) => Res;
export default function memoize<A, B, C, D, E, F, Res>(callback: (a: A, b: B, c: C, d: D, e: E, f: F, evt: React.SyntheticEvent<any>) => Res, a: A, b: B, c: C, d: D, e: E, f: F): (evt: any) => Res;
export declare function setCacheOptions(opts: LRUCache.Options): void;
