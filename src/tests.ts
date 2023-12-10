import { Add, Assoc0, Commutativity, Identity } from './index';
import { ApplyRewrite, ChainRewrites, Flip } from './util';

type Eq<a, b> = ([a] extends [b] ? ([b] extends [a] ? true : false & { a: a; b: b }) : false & { a: a; b: b });
type assert<T extends true> = T;

export type _testCases = {
  Identity: [
    assert<Eq<
      ApplyRewrite<Add<'A', Add<'B', '0'>>, Identity<'B'>>,
      Add<'A', 'B'>
    >>,
    assert<Eq<
      ApplyRewrite<Add<Add<'A', 'B'>, '0'>, Identity<Add<'A', 'B'>>>,
      Add<'A', 'B'>
    >>,
    assert<Eq<
      ApplyRewrite<Add<'A', 'B'>, Flip<Identity<Add<'A', 'B'>>>>,
      Add<Add<'A', 'B'>, '0'>
    >>,
    assert<Eq<
      ApplyRewrite<Add<'A', Add<'B', Add<'C', '0'>>>, Identity<'C'>>,
      Add<'A', Add<'B', 'C'>>
    >>,
  ],

  Commutativity: [
    assert<Eq<
      ApplyRewrite<Add<'A', 'B'>, Commutativity<'A', 'B'>>,
      Add<'B', 'A'>
    >>,
    assert<Eq<
      ApplyRewrite<Add<Add<'A', 'B'>, 'C'>, Commutativity<'A', 'B'>>,
      Add<Add<'B', 'A'>, 'C'>
    >>,
    assert<Eq<
      ApplyRewrite<Add<'A', Add<'B', 'C'>>, Commutativity<'B', 'C'>>,
      Add<'A', Add<'C', 'B'>>
    >>,
  ],

  ChainRewrites: [
    assert<Eq<
      ChainRewrites<
        [
          Commutativity<'0', 'B'>,
          Identity<'B'>,
        ],
        Add<Add<'0', 'B'>, 'C'>
      >,
      Add<'B', 'C'>
    >>,
    assert<Eq<
      ChainRewrites<
        [
          Commutativity<'0', 'B'>,
          Identity<'B'>,
          Flip<Identity<Add<'B', 'C'>>>,
          Commutativity<Add<'B', 'C'>, '0'>,
        ],
        Add<Add<'0', 'B'>, 'C'>
      >,
      Add<'0', Add<'B', 'C'>>
    >>,
  ],

  Assoc0: [
    assert<Eq<
      ApplyRewrite<Add<Add<'0', 'B'>, 'C'>, Assoc0<'B', 'C'>>,
      Add<'0', Add<'B', 'C'>>
    >>,
    assert<Eq<
      ApplyRewrite<Add<Add<'0', Add<'A', 'B'>>, 'C'>, Assoc0<Add<'A', 'B'>, 'C'>>,
      Add<'0', Add<Add<'A', 'B'>, 'C'>>
    >>,
  ],
};
