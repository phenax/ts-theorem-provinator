import { addition } from '../natural-numbers';
import { Add, _0 } from '../utils/nat';
import { ApplyRewrite, ChainRewrites, Sym, Eq, VerifyEquation, Equation, assert, Evaluate } from '../utils/theorem';

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
