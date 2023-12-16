import { Op, Rewrite, ChainRewrites, Sym, Equation, VerifyEquation, assert, ApplyRewrite, Evaluate, OpToStr, SubstEq } from './utils/theorem';

export namespace equation {
  type F<X extends Op> = { op: 'F', a: X };

  export type Reflexivity<A extends Op> = Rewrite<Equation<A, A>, 'true'>;

  export type Symmetry<A extends Op, B extends Op> = Rewrite<Equation<A, B>, Equation<B, A>>;

  export type Congruence<A extends Op, B extends Op> = Rewrite<Equation<A, B>, Equation<F<A>, F<B>>>;

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
  export namespace spec {
    export type substitution = [
      assert<VerifyEquation<SubstituteEq_Proof<'A', 'B'>>>,
    ]
  }

  export interface Transitivity_Proof<A extends Op, B extends Op, C extends Op> {
    type: 'rewrite',
    known: {
      'a = b': Equation<A, B>,
      'b = c': Equation<B, C>,
    },
    left: Equation<Equation<A, B>, Equation<B, C>>; // (a = b) = (b = c)
    right: ChainRewrites<[
      SubstEq<this['known']['a = b']>,                                 // (b = b) = (b = c)
      SubstEq<ApplyRewrite<this['known']['b = c'], Symmetry<B, C>>>,   // (b = b) = (c = b)
      Reflexivity<B>,                                                       // true = (b = b)
      Reflexivity<B>,                                                       // true = true
      Reflexivity<'true'>,
    ], this['left']>;
  };
  export namespace spec {
    export type transitivity = [
      assert<VerifyEquation<Transitivity_Proof<'A', 'B', 'C'>>>,
    ]
  }
}
