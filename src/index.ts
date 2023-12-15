import { Add, Multiply, Succ, _0, _1, _3 } from './nat';
import { Op, Rewrite, ChainRewrites, Sym, Equation, Refl, VerifyEquation, assert, Subst, ApplyRewrite, Evaluate, OpToStr } from './util';

export namespace addition {
  // Identity
  export type Identity<A extends Op> = Rewrite<Add<A, _0>, A>;
  export type IdentityR<A extends Op> = Rewrite<Add<_0, A>, A>;

  export type SuccLemma<A extends Op, B extends Op> = Rewrite<Add<Succ<A>, B>, Succ<Add<A, B>>>
  export type SuccLemmaR<A extends Op, B extends Op> = Rewrite<Add<A, Succ<B>>, Succ<Add<A, B>>>

  // Commutativity
  export type Commutativity<A extends Op, B extends Op> = Rewrite<Add<A, B>, Add<B, A>>;
  export interface Comm_Base_Proof<B extends Op> {
    type: 'rewrite',
    left: Equation<Add<_0, B>, Add<B, _0>>; // 0 + b = b + 0
    right: ChainRewrites<[
      IdentityR<B>,           // b = b + 0
      Sym<Identity<B>>,       // b + 0 = b + 0
      Refl,
    ], this['left']>;
  };
  export interface Comm_Inductive_Proof<A extends Op, B extends Op> {
    type: 'rewrite',
    left: Equation<Add<Succ<A>, B>, Add<B, Succ<A>>>;  // succ(a) + b = b + succ(a)
    right: ChainRewrites<[
      SuccLemma<A, B>,          // succ(a + b) = b + succ(a)
      Commutativity<A, B>,      // succ(b + a) = b + succ(a)
      SuccLemmaR<B, A>,         // succ(b + a) = succ(b + a)
      Refl,
    ], this['left']>;
  };
  export namespace spec {
    export type commutativity = [
      assert<VerifyEquation<Comm_Base_Proof<'B'>>>,
      assert<VerifyEquation<Comm_Inductive_Proof<'A', 'B'>>>,
    ]
  }

  // Associativity
  export type Associativity<A extends Op, B extends Op, C extends Op> = Rewrite<Add<Add<A, B>, C>, Add<A, Add<B, C>>>;
  export interface Assoc_Base_Proof<B extends Op, C extends Op> {
    type: 'rewrite',
    left: Equation<Add<Add<_0, B>, C>, Add<_0, Add<B, C>>>; // (0 + b) + c = 0 + (b + c)
    right: ChainRewrites<[
      Commutativity<_0, B>,      // (b + 0) + c = 0 + (b + c)
      Identity<B>,               // b + c = 0 + (b + c)
      IdentityR<Add<B, C>>,      // b + c = b + c
      Refl,
    ], this['left']>;
  };
  export interface Assoc_Inductive_Proof<A extends Op, B extends Op, C extends Op> {
    type: 'rewrite',
    left: Equation<Add<Add<Succ<A>, B>, C>, Add<Succ<A>, Add<B, C>>>; // (succ(a) + b) + c = succ(a) + (b + c)
    right: ChainRewrites<[
      SuccLemma<A, B>,               // succ(a + b) + c = succ(a) + (b + c)
      SuccLemma<A, Add<B, C>>,       // succ(a + b) + c = succ(a + (b + c))
      SuccLemma<Add<A, B>, C>,       // succ((a + b) + c) = succ(a + (b + c))
      Associativity<A, B, C>,        // succ(a + (b + c)) = succ(a + (b + c))
      Refl,
    ], this['left']>;
  };

  export namespace spec {
    export type associativity = [
      assert<VerifyEquation<Assoc_Base_Proof<'A', 'B'>>>,
      assert<VerifyEquation<Assoc_Inductive_Proof<'A', 'B', 'C'>>>,
    ]
  }

  // Rearrange
  export interface Rearrange_Proof<A extends Op, B extends Op, C extends Op, D extends Op> {
    type: 'rewrite',
    left: Equation<Add<Add<A, B>, Add<C, D>>, Add<A, Add<Add<B, C>, D>>>; // (a + b) + (c + d) = a + ((b + c) + d)
    right: ChainRewrites<[
      Associativity<A, B, Add<C, D>>,   // a + (b + (c + d)) = a + ((b + c) + d)
      Associativity<B, C, D>,           // a + (b + (c + d)) = a + (b + (c + d))
      Refl,
    ], this['left']>;
  };
  export namespace spec {
    export type rearrange = [
      assert<VerifyEquation<Rearrange_Proof<'A', 'B', 'C', 'D'>>>,
    ]
  }
}

export namespace multiplication {
  // Identity
  export type Identity<A extends Op> = Rewrite<Multiply<A, _1>, A>;
  export type IdentityR<A extends Op> = Rewrite<Multiply<_1, A>, A>;

  export type SuccLemma<A extends Op, B extends Op> = Rewrite<Multiply<Succ<A>, B>, Add<B, Multiply<A, B>>>;
  export type SuccLemmaR<A extends Op, B extends Op> = Rewrite<Multiply<A, Succ<B>>, Add<A, Multiply<A, B>>>;

  // Commutativity
  export type Commutativity<A extends Op, B extends Op> = Rewrite<Multiply<A, B>, Multiply<B, A>>;
  export interface Comm_Base_Proof<B extends Op> {
    type: 'rewrite',
    left: Equation<Multiply<_1, B>, Multiply<B, _1>>; // 1 * b = b * 1
    right: ChainRewrites<[
      IdentityR<B>,        // b = b * 1
      Identity<B>,         // b = b
      Refl,
    ], this['left']>;
  };
  export interface Comm_Inductive_Proof<A extends Op, B extends Op> {
    type: 'rewrite',
    left: Equation<Multiply<Succ<A>, B>, Multiply<B, Succ<A>>>; // succ(a)*b = b*succ(a)
    right: ChainRewrites<[
      SuccLemma<A, B>,             // b + a*b = b*succ(a)
      SuccLemmaR<B, A>,            // b + a*b = b + b*a
      Commutativity<B, A>,         // b + a*b = b + a*b
      Refl,
    ], this['left']>;
  };
  export namespace spec {
    export type commutativity = [
      assert<VerifyEquation<Comm_Base_Proof<'B'>>>,
      assert<VerifyEquation<Comm_Inductive_Proof<'A', 'B'>>>,
    ]
  }

  // Distributivity
  export type Distributivity<A extends Op, B extends Op, C extends Op> =
    Rewrite<Multiply<Add<A, B>, C>, Add<Multiply<A, C>, Multiply<B, C>>>;
  export interface Dist_Base_Proof<B extends Op, C extends Op> {
    type: 'rewrite',
    left: Equation<Multiply<Add<_1, B>, C>, Add<Multiply<_1, C>, Multiply<B, C>>>; // (1 + b)*c = 1*c + b*c
    right: ChainRewrites<[
      IdentityR<C>,                    // (1 + b)*c = c + b*c
      addition.SuccLemma<_0, B>,       // succ(0 + b)*c = c + b*c
      addition.IdentityR<B>,           // succ(b)*c = c + b*c
      SuccLemma<B, C>,                 // c + b*c = c + b*c
      Refl,
    ], this['left']>;
  };
  export interface Dist_Inductive_Proof<A extends Op, B extends Op, C extends Op> {
    type: 'rewrite',
    left: Equation<Multiply<Add<Succ<A>, B>, C>, Add<Multiply<Succ<A>, C>, Multiply<B, C>>>; // (succ(a) + b)*c = succ(a)*c + b*c
    right: ChainRewrites<[
      addition.SuccLemma<A, B>,                                     // succ(a + b)*c = succ(a)*c + b*c
      SuccLemma<Add<A, B>, C>,                                      // c + (a + b)*c = succ(a)*c + b*c
      SuccLemma<A, C>,                                              // c + (a + b)*c = (c + a*c) + b*c
      Distributivity<A, B, C>,                                      // c + (a*c + b*c) = (c + a*c) + b*c
      addition.Associativity<C, Multiply<A, C>, Multiply<B, C>>,    // (c + a*c) + b*c = (c + a*c) + b*c
      Refl,
    ], this['left']>;
  };
  export namespace spec {
    export type distributivity = [
      assert<VerifyEquation<Dist_Base_Proof<'B', 'C'>>>,
      assert<VerifyEquation<Dist_Inductive_Proof<'A', 'B', 'C'>>>,
    ]
  }

  // Associativity
  export type Associativity<A extends Op, B extends Op, C extends Op> =
    Rewrite<Multiply<Multiply<A, B>, C>, Multiply<A, Multiply<B, C>>>;
  export interface Assoc_Base_Proof<B extends Op, C extends Op> {
    type: 'rewrite',
    left: Equation<Multiply<Multiply<_1, B>, C>, Multiply<_1, Multiply<B, C>>>; // (1*b)*c = 1*(b*c)
    right: ChainRewrites<[
      IdentityR<B>,                     // b*c = 1*(b*c)
      IdentityR<Multiply<B, C>>,        // b*c = b*c
      Refl,
    ], this['left']>;
  };
  export interface Assoc_Inductive_Proof<A extends Op, B extends Op, C extends Op> {
    type: 'rewrite',
    left: Equation<Multiply<Multiply<Succ<A>, B>, C>, Multiply<Succ<A>, Multiply<B, C>>>; // (succ(a)*b)*c = succ(a)*(b*c)
    right: ChainRewrites<[
      SuccLemma<A, B>,                         // (b + a*b)*c = succ(a) * (b*c)
      Distributivity<B, Multiply<A, B>, C>,    // b*c + (a*b)*c = succ(a) * (b*c)
      SuccLemma<A, Multiply<B, C>>,            // b*c + (a*b)*c = b*c + a*(b*c)
      Associativity<A, B, C>,                  // b*c + a*(b*c) = b*c + a*(b*c)
      Refl,
    ], this['left']>;
  };
  export namespace spec {
    export type associativity = [
      assert<VerifyEquation<Assoc_Base_Proof<'B', 'C'>>>,
      assert<VerifyEquation<Assoc_Inductive_Proof<'A', 'B', 'C'>>>,
    ]
  }
}

export namespace equation {
  type F<X extends Op> = { op: 'F', a: X };

  export type Reflexivity<A extends Op> = Rewrite<Equation<A, A>, 'true'>;

  export type Symmetry<A extends Op, B extends Op> = Rewrite<Equation<A, B>, Equation<B, A>>;

  export type Congruence<A extends Op, B extends Op> = Rewrite<Equation<A, B>, Equation<F<A>, F<B>>>;

  export type SubstituteEq<O extends Equation<Op, Op>> = Rewrite<O['a'], O['b']>
  export interface SubstituteEq_Proof<A extends Op, B extends Op> {
    type: 'rewrite',
    known: {
      'a = b': Equation<A, B>,
    },
    left: Equation<F<A>, F<B>>; // f(a) = f(b)
    right: ChainRewrites<[
      Sym<Congruence<A, B>>,                   // a = b
      SubstituteEq<this['known']['a = b']>,    // b = b
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
      SubstituteEq<this['known']['a = b']>,                                 // (b = b) = (b = c)
      SubstituteEq<ApplyRewrite<this['known']['b = c'], Symmetry<B, C>>>,   // (b = b) = (c = b)
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
