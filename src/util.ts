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
    ? Omit<O, 'b'> & { b: ApplyRewrite<O['b'], R> }
    : Omit<O, 'a'> & { a: ApplyRewrite<O['a'], R> }
  )
  : never;

// interface Kind<V = unknown> {
//   _: V;
//   return: unknown;
// }
// type Ap<K extends Kind, V> = (K & { _: V })['return'];

export type ChainRewrites<Rws extends Rewrite<Op, Op>[], O extends Op> =
  Rws extends [] ? O
   : Rws extends [infer R extends Rewrite<Op, Op>, ...infer Rs extends Rewrite<Op, Op>[]]
   ? ChainRewrites<Rs, ApplyRewrite<O, R>>
   : never;
