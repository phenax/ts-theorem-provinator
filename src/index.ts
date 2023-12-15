import { Add, Multiply, Succ, _0, _1, _3 } from './nat';
import { Op, Rewrite, ChainRewrites, Sym, Equation, Refl, VerifyEquation, assert } from './util';

export namespace addition {
  // Identity
  export type Identity<A extends Op> = Rewrite<Add<A, _0>, A>;
  export type IdentityR<A extends Op> = Rewrite<Add<_0, A>, A>;

  export type SumSucc<A extends Op, B extends Op> = Rewrite<Add<Succ<A>, B>, Succ<Add<A, B>>>
  export type SumSuccR<A extends Op, B extends Op> = Rewrite<Add<A, Succ<B>>, Succ<Add<A, B>>>

  // Commutativity
  export type Commutativity<A extends Op, B extends Op> = Rewrite<Add<A, B>, Add<B, A>>;
  export interface Comm_Base_Proof<B extends Op> {
    type: 'rewrite',
    left: Equation<Add<_0, B>, Add<B, _0>>; // 0 + b = b + 0
    right: ChainRewrites<[
      IdentityR<B>,         // b = b + 0
      Sym<Identity<B>>,     // b + 0 = b + 0
      Refl,
    ], this['left']>;
  };
  export interface Comm_Inductive_Proof<A extends Op, B extends Op> {
    type: 'rewrite',
    left: Equation<Add<Succ<A>, B>, Add<B, Succ<A>>>;  // succ(a) + b = b + succ(a)
    right: ChainRewrites<[
      SumSucc<A, B>,          // succ(a + b) = b + succ(a)
      Commutativity<A, B>,    // succ(b + a) = b + succ(a)
      SumSuccR<B, A>,         // succ(b + a) = succ(b + a)
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
      Commutativity<_0, B>,   // (b + 0) + c = 0 + (b + c)
      Identity<B>,            // b + c = 0 + (b + c)
      IdentityR<Add<B, C>>,   // b + c = b + c
      Refl,
    ], this['left']>;
  };
  export interface Assoc_Inductive_Proof<A extends Op, B extends Op, C extends Op> {
    type: 'rewrite',
    left: Equation<Add<Add<Succ<A>, B>, C>, Add<Succ<A>, Add<B, C>>>; // (succ(a) + b) + c = succ(a) + (b + c)
    right: ChainRewrites<[
      SumSucc<A, B>,                   // succ(a + b) + c = succ(a) + (b + c)
      SumSucc<A, Add<B, C>>,           // succ(a + b) + c = succ(a + (b + c))
      SumSucc<Add<A, B>, C>,           // succ((a + b) + c) = succ(a + (b + c))
      Associativity<A, B, C>,          // succ(a + (b + c)) = succ(a + (b + c))
      Refl,
    ], this['left']>;
  };

  export namespace spec {
    export type associativity = [
      assert<VerifyEquation<Assoc_Base_Proof<'A', 'B'>>>,
      assert<VerifyEquation<Assoc_Inductive_Proof<'A', 'B', 'C'>>>,
    ]
  }
}

export namespace multiplication {
  // Identity
  export type Identity<A extends Op> = Rewrite<Multiply<A, _1>, A>;
  export type IdentityR<A extends Op> = Rewrite<Multiply<_1, A>, A>;

  export type MulSucc<A extends Op, B extends Op> = Rewrite<Multiply<Succ<A>, B>, Add<B, Multiply<A, B>>>;
  export type MulSuccR<A extends Op, B extends Op> = Rewrite<Multiply<A, Succ<B>>, Add<A, Multiply<A, B>>>;

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
      MulSucc<A, B>,                     // b + a*b = b*succ(a)
      MulSuccR<B, A>,                    // b + a*b = b + b*a
      Commutativity<B, A>,               // b + a*b = b + a*b
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
      IdentityR<C>,                       // (1 + b)*c = c + b*c
      addition.SumSucc<_0, B>,            // succ(0 + b)*c = c + b*c
      addition.IdentityR<B>,              // succ(b)*c = c + b*c
      MulSucc<B, C>,                      // c + b*c = c + b*c
      Refl,
    ], this['left']>;
  };
  export interface Dist_Inductive_Proof<A extends Op, B extends Op, C extends Op> {
    type: 'rewrite',
    left: Equation<Multiply<Add<Succ<A>, B>, C>, Add<Multiply<Succ<A>, C>, Multiply<B, C>>>; // (succ(a) + b)*c = succ(a)*c + b*c
    right: ChainRewrites<[
      addition.SumSucc<A, B>,                                       // succ(a + b)*c = succ(a)*c + b*c
      MulSucc<Add<A, B>, C>,                                        // c + (a + b)*c = succ(a)*c + b*c
      MulSucc<A, C>,                                                // c + (a + b)*c = (c + a*c) + b*c
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
      MulSucc<A, B>,                            // (b + a*b)*c = succ(a) * (b*c)
      Distributivity<B, Multiply<A, B>, C>,     // b*c + (a*b)*c = succ(a) * (b*c)
      MulSucc<A, Multiply<B, C>>,               // b*c + (a*b)*c = b*c + a*(b*c)
      Associativity<A, B, C>,                   // b*c + a*(b*c) = b*c + a*(b*c)
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

