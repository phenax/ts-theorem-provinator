import { Add, Multiply, Succ, _0 } from './nat';
import { Op, Rewrite, ChainRewrites, Flip, Equation, Refl } from './util';

export namespace addition {
  export type Identity<A extends Op> = Rewrite<Add<A, _0>, A>;
  export type IdentityR<A extends Op> = Rewrite<Add<_0, A>, A>;

  export type SumSucc1<A extends Op, B extends Op> = Rewrite<Add<Succ<A>, B>, Succ<Add<A, B>>>
  export type SumSucc2<A extends Op, B extends Op> = Rewrite<Add<A, Succ<B>>, Succ<Add<A, B>>>

  /// Sum commutativity
  export type Commutativity<A extends Op, B extends Op> = Rewrite<Add<A, B>, Add<B, A>>;
  export interface Comm_Base<B extends Op> {
    type: 'rewrite',
    left: Equation<Add<_0, B>, Add<B, _0>>; // 0 + b = b + 0
    right: ChainRewrites<[
      IdentityR<B>,        // b = b + 0
      Flip<Identity<B>>,   // b + 0 = b + 0
      Refl<Add<B, _0>>,    // true
    ], this['left']>;
  };
  export interface Comm_Inductive<A extends Op, B extends Op> {
    type: 'rewrite',
    left: Equation<Add<Succ<A>, B>, Add<B, Succ<A>>>;  // succ(a) + b = b + succ(a)
    right: ChainRewrites<[
      SumSucc1<A, B>,         // succ(a + b) = b + succ(a)
      Commutativity<A, B>,    // succ(b + a) = b + succ(a)
      SumSucc2<B, A>,         // succ(b + a) = succ(b + a)
      Refl<Succ<Add<B, A>>>,  // true
    ], this['left']>;
  };

  // Sum associativity
  export type Associativity<A extends Op, B extends Op, C extends Op> = Rewrite<Add<Add<A, B>, C>, Add<A, Add<B, C>>>;
  export interface Assoc_Base<B extends Op, C extends Op> {
    type: 'rewrite',
    left: Equation<Add<Add<'0', B>, C>, Add<'0', Add<B, C>>>; // (0 + b) + c = 0 + (b + c)
    right: ChainRewrites<[
      Commutativity<'0', B>,  // (b + 0) + c = 0 + (b + c)
      Identity<B>,            // b + c = 0 + (b + c)
      IdentityR<Add<B, C>>,   // b + c = b + c
      Refl<Add<B, C>>,        // true
    ], this['left']>;
  };
  export interface Assoc_Inductive<A extends Op, B extends Op, C extends Op> {
    type: 'rewrite',
    left: Equation<Add<Add<Succ<A>, B>, C>, Add<Succ<A>, Add<B, C>>>; // (succ(a) + b) + c = succ(a) + (b + c)
    right: ChainRewrites<[
      SumSucc1<A, B>,                  // succ(a + b) + c = succ(a) + (b + c)
      SumSucc1<A, Add<B, C>>,          // succ(a + b) + c = succ(a + (b + c))
      SumSucc1<Add<A, B>, C>,          // succ((a + b) + c) = succ(a + (b + c))
      Associativity<A, B, C>,          // succ(a + (b + c)) = succ(a + (b + c))
      Refl<Succ<Add<A, Add<B, C>>>>,   // true
    ], this['left']>;
  };
}

