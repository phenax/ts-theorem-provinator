export type Op = string | { op: string; a: Op; b: Op };

export type Rewrite<left extends Op, right extends Op> = {
  type: 'rewrite';
  left: left;
  right: right;
};

export type Flip<R extends Rewrite<Op, Op>> = Rewrite<R['right'], R['left']>;

export type ApplyRewrite<O extends Op, R extends Rewrite<Op, Op>> =
  O extends R['left'] ? R['right']
  : O extends string ? O
  : O extends { a: Op, b: Op, op: string } ? (
    ApplyRewrite<O['a'], R> extends O['a']
    ? (ApplyRewrite<O['b'], R> extends O['b'] ? O
      : Omit<O, 'b'> & { b: ApplyRewrite<O['b'], R> })
    : Omit<O, 'a'> & { a: ApplyRewrite<O['a'], R> }
  )
  : never;

export interface Kind<V = unknown, R = unknown> {
  _: V;
  return: R;
}
export type Ap<K extends Kind, V> = (K & { _: V })['return'];

export type ChainRewrites<Rws extends Rewrite<Op, Op>[], O extends Op> =
  Rws extends [] ? O
  : Rws extends [infer R extends Rewrite<Op, Op>, ...infer Rs extends Rewrite<Op, Op>[]]
  ? ChainRewrites<Rs, ApplyRewrite<O, R>>
  : never;

export type VerifyEquation<Eq extends Rewrite<Op, Op>> =
  Eq['right'] extends 'true' ? true : false & Eq['right'];

export type Evaluate<Eq extends Rewrite<Op, Op>> = ApplyRewrite<Eq['left'], Eq>;

export type assert<T extends true> = T;
export type Eq<a, b> = ([a] extends [b] ? ([b] extends [a] ? true : false & { lhs: a; rhs: b }) : false & { lhs: a; rhs: b });

export type Equation<A extends Op, B extends Op> = { op: '=', a: A, b: B };
export type Refl<A extends Op> = Rewrite<Equation<A, A>, 'true'>;
