import { Op } from './util';

export type Add<A extends Op, B extends Op> = { op: '+'; a: A; b: B };
export type Multiply<A extends Op, B extends Op> = { op: '*'; a: A; b: B };
export type Succ<A extends Op> = { op: 'succ', a: A };

export type _0 = '0'
export type _1 = Succ<_0>
export type _2 = Succ<_1>
export type _3 = Succ<_2>
