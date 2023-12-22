import { Op, Rewrite, ChainRewrites, Sym, Equation, VerifyEquation, assert, SubstEq } from './utils/theorem';

export namespace equation {
  type F<X extends Op> = { op: 'F', a: X };

  export type Reflexivity<A extends Op> = Rewrite<Equation<A, A>, 'true'>;

  export type Commutativity<A extends Op, B extends Op> = Rewrite<Equation<A, B>, Equation<B, A>>;

  export type Congruence<A extends Op, B extends Op> = Rewrite<Equation<A, B>, Equation<F<A>, F<B>>>;

  export namespace proof {
    export interface SubstituteEq_Proof<A extends Op, B extends Op> {
      type: 'rewrite',
      known: {
        'a = b': Equation<A, B>,
      },
      left: Equation<F<A>, F<B>>; // f(a) = f(b)
      right: ChainRewrites<[
        Sym<Congruence<A, B>>,                   // a = b
        SubstEq<this['known']['a = b']>,         // b = b
        Reflexivity<B>,
      ], this['left']>;
    };
    export type substitution = [
      assert<VerifyEquation<SubstituteEq_Proof<'A', 'B'>>>,
    ]
  }

  export namespace proof {
    export interface Transitivity_Proof<A extends Op, B extends Op, C extends Op> {
      type: 'rewrite',
      known: {
        'a = b': Equation<A, B>,
        'b = c': Equation<B, C>,
      },
      left: Equation<A, C>; // a = c
      right: ChainRewrites<[
        SubstEq<this['known']['a = b']>,                   // b = c
        Rewrite<this['known']['b = c'], 'true'>,           // true
      ], this['left']>;
    };
    export type transitivity = [
      assert<VerifyEquation<Transitivity_Proof<'A', 'B', 'C'>>>,
    ]
  }
}
