import { Op, Rewrite, ChainRewrites, Flip } from './util';

export type Add<A extends Op, B extends Op> = { op: '+'; a: A; b: B };

export type Identity<A extends Op> = Rewrite<Add<A, '0'>, A>;
export type Commutativity<A extends Op, B extends Op> = Rewrite<Add<A, B>, Add<B, A>>;

export interface Assoc0<A extends Op, B extends Op> {
  type: 'rewrite',
  left: Add<Add<'0', A>, B>;
  right: ChainRewrites<[
    Commutativity<'0', A>,
    Identity<A>,
    Flip<Identity<Add<A, B>>>,
    Commutativity<Add<A, B>, '0'>,
  ], this['left']>;
};

/*
Assoc: (a + b) + c = a + (b + c)

For a = 0,
(0 + b) + c
= (b + 0) + c -- comm
= b + c -- id
= (b + c) + 0 -- flip id
= 0 + (b + c) -- comm

For a = succ(),

*/

