# Theorem prover in ts types
Experiment to use typescript's type system to make a shitty theorem prover.


### Commutativity of addition in ts types or something?

```typescript
export type Commutativity<A extends Op, B extends Op> = Rewrite<Add<A, B>, Add<B, A>>;

export interface Comm_Base_Proof<B extends Op> {
  type: 'rewrite',
  left: Equation<Add<_0, B>, Add<B, _0>>; // 0 + b = b + 0
  right: ChainRewrites<[
    IdentityR<B>,         // b = b + 0
    Sym<Identity<B>>,     // b + 0 = b + 0
    Refl<Add<B, _0>>,     // true
  ], this['left']>;
};

export interface Comm_Inductive_Proof<A extends Op, B extends Op> {
  type: 'rewrite',
  left: Equation<Add<Succ<A>, B>, Add<B, Succ<A>>>;  // succ(a) + b = b + succ(a)
  right: ChainRewrites<[
    SumSucc<A, B>,          // succ(a + b) = b + succ(a)
    Commutativity<A, B>,    // succ(b + a) = b + succ(a)
    SumSuccR<B, A>,         // succ(b + a) = succ(b + a)
    Refl<Succ<Add<B, A>>>,  // true
  ], this['left']>;
};

export namespace spec {
  export type commutativity = [
    assert<VerifyEquation<Comm_Base_Proof<'B'>>>,
    assert<VerifyEquation<Comm_Inductive_Proof<'A', 'B'>>>,
  ]
}
```
