import { Add, ApplyRewrite, Commutativity, Flip, Identity } from './index';

type Eq<a, b> = ([a] extends [b] ? ([b] extends [a] ? true : false) : false) & { a: a; b: b };
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
};
