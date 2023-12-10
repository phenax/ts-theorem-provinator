import { Op, Rewrite, ChainRewrites, Flip } from './util';

export type Add<A extends Op, B extends Op> = { op: '+'; a: A; b: B };
export type Succ<A extends Op> = Add<'1', A>;

export type Identity<A extends Op> = Rewrite<Add<A, '0'>, A>;
export type Commutativity<A extends Op, B extends Op> = Rewrite<Add<A, B>, Add<B, A>>;

export interface Assoc0<A extends Op, B extends Op> {
  type: 'rewrite',
  left: Add<Add<'0', A>, B>; // (0 + a) + b
  right: ChainRewrites<[
    Commutativity<'0', A>, // = (a + 0) + b
    Identity<A>, // = a + b
    Flip<Identity<Add<A, B>>>, // = (a + b) + 0
    Commutativity<Add<A, B>, '0'>, // = 0 + (a + b)
  ], this['left']>;
};

export type Assoc1<A extends Op, B extends Op> = Rewrite<Add<Succ<A>, B>, Succ<Add<A, B>>>;

export interface Assoc<A extends Op, B extends Op, C extends Op> {
  type: 'rewrite',
  left: Add<Add<A, B>, C>; // (a + b) + c
  right: ChainRewrites<[
    Rewrite<A, Succ<A>>, // = CHEATING
    Assoc1<A, B>, // = succ(a + b) + c
    Assoc1<Add<A, B>, C>, // = succ(a + b + c)
    Rewrite<A, '0'>, // CHEATING. TODO: figure out recursion
    Assoc0<B, C>,  // Induction base case
    Rewrite<'0', A>, // CHEATING
    Flip<Assoc1<A, Add<B, C>>>, // = succ(a) + (b + c)
    Rewrite<Succ<A>, A>, // = CHEATING
  ], this['left']>;
};

// type _x = ApplyRewrite<Add<Add<'A', 'B'>, 'C'>, AssocN<'A', 'B', 'C'>>

/*
Assoc: (a + b) + c = a + (b + c)

For a = 0,
(0 + b) + c
= (b + 0) + c -- comm
= b + c -- id
= (b + c) + 0 -- flip id
= 0 + (b + c) -- comm

For a' = succ(a),
(succ(a) + b) + c
= succ(a + b) + c
= succ((a + b) + c)
----- rec
= succ(a + (b + c))
= succ(a) + (b + c)
*/

