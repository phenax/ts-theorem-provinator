export type Op = string | { op: string; a: Op; b: Op };

type RwType = 'rewrite' | 'imperative';

export interface RewriteBase {
  type: RwType;
  left: Op;
  right: Op;
}

export interface Rewrite<left extends Op, right extends Op, Typ extends RwType = 'rewrite'> extends RewriteBase {
  type: Typ;
  left: left;
  right: right;
};

export type Sym<R extends RewriteBase> = Rewrite<R['right'], R['left'], R['type']>;

export type ApplyRewrite<O extends Op, R extends RewriteBase> =
  R['type'] extends 'imperative' ? (R & { left: O })['right']
  : O extends R['left'] ? R['right']
  : O extends string ? O
  : O extends { a: Op, b: Op, op: string } ? (
    ApplyRewrite<O['a'], R> extends O['a']
    ? (ApplyRewrite<O['b'], R> extends O['b'] ? O
      : Omit<O, 'b'> & { b: ApplyRewrite<O['b'], R> })
    : Omit<O, 'a'> & { a: ApplyRewrite<O['a'], R> }
  )
  : never;

export type ChainRewrites<Rws extends RewriteBase[], O extends Op> =
  Rws extends [] ? O
  : Rws extends [infer R extends RewriteBase, ...infer Rs extends RewriteBase[]]
  ? ChainRewrites<Rs, ApplyRewrite<O, R>>
  : never;

export type VerifyEquation<Eq extends RewriteBase> =
  Eq['right'] extends 'true' ? true : false & Eq['right'];

export type Evaluate<Eq extends RewriteBase> = ApplyRewrite<Eq['left'], Eq>;

export type assert<T extends true> = T;
export type Eq<a, b> = ([a] extends [b] ? ([b] extends [a] ? true : false & { lhs: a; rhs: b }) : false & { lhs: a; rhs: b });

export type Equation<A extends Op, B extends Op> = { op: '=', a: A, b: B };

export interface Refl extends RewriteBase {
  type: 'imperative';
  left: Op;
  right: this['left'] extends { op: '=', a: infer a, b: infer b }
  ? (Eq<a, b> extends true ? 'true' : this['left'])
  : this['left'];
};

// Like Refl, but you have to specify the sides of the equation and this one works recursively
export type ReflR<A extends Op> = Rewrite<Equation<A, A>, 'true'>;
