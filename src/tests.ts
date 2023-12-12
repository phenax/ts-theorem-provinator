import { addition, multiplication } from './index';
import { Add, Multiply, Succ, _0 } from './nat';
import { ApplyRewrite, ChainRewrites, Sym, Eq, VerifyEquation, Equation, assert, Evaluate } from './util';

export type specChainRewrites = [
  assert<Eq<
    ChainRewrites<
      [
        addition.Commutativity<_0, 'B'>,
        addition.Identity<'B'>,
      ],
      Add<Add<_0, 'B'>, 'C'>
    >,
    Add<'B', 'C'>
  >>,
  assert<Eq<
    ChainRewrites<
      [
        addition.Commutativity<_0, 'B'>,
        addition.Identity<'B'>,
        Sym<addition.Identity<Add<'B', 'C'>>>,
        addition.Commutativity<Add<'B', 'C'>, _0>,
      ],
      Add<Add<_0, 'B'>, 'C'>
    >,
    Add<_0, Add<'B', 'C'>>
  >>,
]

export namespace spec_addition {
  export type specIdentity = [
    assert<Eq<
      ApplyRewrite<Add<'A', Add<'B', _0>>, addition.Identity<'B'>>,
      Add<'A', 'B'>
    >>,
    assert<Eq<
      ApplyRewrite<Add<Add<'A', 'B'>, _0>, addition.Identity<Add<'A', 'B'>>>,
      Add<'A', 'B'>
    >>,
    assert<Eq<
      ApplyRewrite<Add<'A', 'B'>, Sym<addition.Identity<Add<'A', 'B'>>>>,
      Add<Add<'A', 'B'>, _0>
    >>,
    assert<Eq<
      ApplyRewrite<Add<'A', Add<'B', Add<'C', _0>>>, addition.Identity<'C'>>,
      Add<'A', Add<'B', 'C'>>
    >>,
  ]

  export type specCommutativity = [
    assert<Eq<
      ApplyRewrite<Add<'A', 'B'>, addition.Commutativity<'A', 'B'>>,
      Add<'B', 'A'>
    >>,
    assert<Eq<
      ApplyRewrite<Add<Add<'A', 'B'>, 'C'>, addition.Commutativity<'A', 'B'>>,
      Add<Add<'B', 'A'>, 'C'>
    >>,
    assert<Eq<
      ApplyRewrite<Add<'A', Add<'B', 'C'>>, addition.Commutativity<'B', 'C'>>,
      Add<'A', Add<'C', 'B'>>
    >>,
  ]
}

export namespace multiplication_spec {
  export type specCommutativity = [
    assert<Eq<
      ApplyRewrite<Multiply<Multiply<'A', 'B'>, 'C'>, multiplication.Commutativity<'A', 'B'>>,
      Multiply<Multiply<'B', 'A'>, 'C'>
    >>,
  ]
  export type specDistributivity = [
    assert<Eq<
      Evaluate<multiplication.Distributivity<'A', 'B', 'C'>>,
      Add<Multiply<'A', 'C'>, Multiply<'B', 'C'>>
    >>,
  ]
  export type specAssociativity = [
    assert<Eq<
      Evaluate<multiplication.Associativity<'A', 'B', 'C'>>,
      Multiply<'A', Multiply<'B', 'C'>>
    >>,
  ]
}
