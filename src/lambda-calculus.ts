import { Op, Rewrite, ChainRewrites, Sym, Equation, Refl, VerifyEquation, assert, Subst, ApplyRewrite, Evaluate, OpToStr, SubstEq } from './utils/theorem';

export type Abs<x extends Op, o extends Op> = { op: '->', a: x, b: o }; // \x. o
export type Ap<F extends Op, x extends Op> = { op: '$', a: F, b: x }; // F(x)
export type Comp<F extends Op, G extends Op> = { op: '.', a: F, b: G }; // F . G
export type Id<x extends Op = 'x'> = Abs<x, x> // \x. x
export type Const<x extends Op = 'x', y extends Op = 'y'> = Abs<x, Abs<y, x>> // \x. \y. x
export type Inv<F extends Op> = { op: 'inv', a: F }

export namespace composition {
  export type Abstraction<x extends Op, y extends Op, v extends Op> = Rewrite<Ap<Abs<x, y>, v>, y>;

  export type Composition<F extends Op, G extends Op, x extends Op> = Rewrite<Ap<Comp<F, G>, x>, Ap<F, Ap<G, x>>>;

  // Identity
  export type Identity<x extends Op> = Rewrite<Ap<Id, x>, x>;
  export namespace proof {
    export interface Identity_Proof<x extends Op> {
      type: 'rewrite';
      left: Equation<Ap<Id<x>, x>, x>;  // id(x) = x
      right: ChainRewrites<[
        Abstraction<x, x, x>,  // x = x
        Refl,
      ], this['left']>;
    }

    export interface Identity_Composition_Proof<F extends Op, x extends Op> {
      type: 'rewrite';
      left: Equation<Ap<Comp<F, Id>, x>, Ap<F, x>>;  // (f . id)(x) = f(x)
      right: ChainRewrites<[
        Composition<F, Id, x>,    // f(id(x)) = f(x)
        Identity<x>,              // f(x) = f(x)
        Refl,
      ], this['left']>;
    }

    export type identity = [
      assert<VerifyEquation<Identity_Proof<'x'>>>,
      assert<VerifyEquation<Identity_Composition_Proof<'F', 'x'>>>,
    ]
  }

  // Associativity
  export type Associativity<F extends Op, G extends Op, H extends Op> = Rewrite<
    Comp<Comp<F, G>, H>,
    Comp<F, Comp<G, H>>
  >
  export namespace proof {
    export interface Assoc_Proof<F extends Op, G extends Op, H extends Op, x extends Op> {
      type: 'rewrite';
      left: Equation<Ap<Comp<Comp<F, G>, H>, x>, Ap<Comp<F, Comp<G, H>>, x>>;  // ((f . g) . h)(x) = (f . (g . h))(x)
      right: ChainRewrites<[
        Composition<Comp<F, G>, H, x>,       // (f . g)(h(x)) = (f . (g . h))(x)
        Composition<F, G, Ap<H, x>>,         // f(g(h(x))) = (f . (g . h))(x)
        Composition<F, Comp<G, H>, x>,       // f(g(h(x))) = f((g . h)(x))
        Composition<G, H, x>,                // f(g(h(x))) = f(g(h(x)))
        Refl,
      ], this['left']>;
    }
    export type associativity = [
      assert<VerifyEquation<Assoc_Proof<'F', 'G', 'H', 'x'>>>,
    ]
  }

  // Identity
  export type Transitivity<x extends Op, y extends Op, z extends Op> = Rewrite<Comp<Abs<y, z>, Abs<x, y>>, Abs<x, z>>;
  export namespace proof {
    export interface Transitivity_Proof<x extends Op, y extends Op, z extends Op> {
      type: 'rewrite';
      left: Equation<Ap<Comp<Abs<y, z>, Abs<x, y>>, x>, Ap<Abs<x, z>, x>>;  // ((\y -> z) . (\x -> y))(x) = (\x -> z)(x)
      right: ChainRewrites<[
        Composition<Abs<y, z>, Abs<x, y>, x>,        // (\y -> z) $ (\x -> y)(x) = (\x -> z)(x)
        Abstraction<x, y, x>,                        // (\y -> z) $ y = (\x -> z)(x)
        Abstraction<y, z, y>,                        // z = (\x -> z)(x)
        Abstraction<x, z, x>,                        // z = z
        Refl,
      ], this['left']>;
    }
    export type transitivity = [
      // OpToStr<Evaluate<Transitivity_Proof<'x', 'y', 'z'>>>,
      assert<VerifyEquation<Transitivity_Proof<'x', 'y', 'z'>>>,
    ]
  }

  // Inverse functions
  export type Inverse<x extends Op, y extends Op> = Rewrite<Inv<Abs<x, y>>, Abs<y, x>>;
  export namespace proof {
    export interface Composition_Inverse_Proof<F extends Op, G extends Op> {
      type: 'rewrite',
      known: {
        'f': Equation<F, Abs<'y', 'z'>>,
        'g': Equation<G, Abs<'x', 'y'>>,
      },
      left: Equation<Inv<Comp<F, G>>, Comp<Inv<G>, Inv<F>>>, // inv(f . g) = inv(g) . inv(f)
      right: ChainRewrites<[
        SubstEq<this['known']['f']>,
        SubstEq<this['known']['f']>,         // inv((\y -> z) . g) = inv(g) . inv(\y -> z)
        SubstEq<this['known']['g']>,
        SubstEq<this['known']['g']>,         // inv((\y -> z) . (\x -> y)) = inv(\x -> y) . inv(\y -> z)
        Inverse<'x', 'y'>,
        Inverse<'y', 'z'>,                   // inv((\x -> y) . (\y -> z)) = (\z -> y) . (\y -> x)
        Transitivity<'x', 'y', 'z'>,         // inv(\x -> z) = (\z -> y) . (\y -> x)
        Transitivity<'z', 'y', 'x'>,         // inv(\x -> z) = \z -> x
        Inverse<'x', 'z'>,                   // \z -> x = \z -> x
        Refl
      ], this['left']>,
    }
    export type inverse = [
      // OpToStr<Evaluate<Composition_Inverse_Proof<'F', 'G'>>>,
      assert<VerifyEquation<Composition_Inverse_Proof<'F', 'G'>>>,
    ]
  }
}

export namespace combinators {
  export type I<x extends Op = 'x'> = Abs<x, x>
  export type K<x extends Op = 'x', y extends Op = 'y'> = Abs<x, Abs<y, x>>
  export type S<x extends Op = 'x', y extends Op = 'y', z extends Op = 'z'> = Abs<x, Abs<y, Abs<z, Ap<Ap<x, z>, Ap<y, z>>>>>

  export type ApplyS<x extends Op, y extends Op, z extends Op> = Rewrite<Ap<Ap<Ap<S, x>, y>, z>, Ap<Ap<x, z>, Ap<y, z>>>
  export type ApplyK<x extends Op, y extends Op> = Rewrite<Ap<Ap<K, x>, y>, x>

  export namespace proof {
    export interface SKK_I_Proof<x extends Op> {
      type: 'rewrite',
      left: Equation<Ap<Ap<Ap<S, K>, K>, x>, Ap<I, x>>, // S(K(K(x))) = I(x)
      right: ChainRewrites<[
        ApplyS<K, K, x>,
        ApplyK<x, Ap<K, x>>,
        composition.Abstraction<x, x, x>,
        Refl
      ], this['left']>,
    }
    export type inverse = [
      // OpToStr<Evaluate<SKK_I_Proof<'x'>>>,
      assert<VerifyEquation<SKK_I_Proof<'x'>>>,
    ]
  }

  // SIIx = xx
  // Booleans
  // Y combinator
}
