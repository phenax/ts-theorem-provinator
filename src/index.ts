export type Op = string | { op: string; a: Op; b: Op };

export type Rewrite<left extends Op, right extends Op> = {
  type: 'rewrite';
  left: left;
  right: right;
};
export type RewriteKind = Rewrite<Op, Op>;

export type Flip<R extends RewriteKind> = Rewrite<R['right'], R['left']>;

export type ApplyRewrite<O extends Op, R extends RewriteKind> =
  O extends R['left'] ? R['right']
  : O extends string ? O
  : O extends { a: Op, b: Op, op: string } ? (
    ApplyRewrite<O['a'], R> extends O['a']
    ? Omit<O, 'b'> & { b: ApplyRewrite<O['b'], R> }
    : Omit<O, 'a'> & { a: ApplyRewrite<O['a'], R> }
  )
  : never;

export type Add<a extends Op, b extends Op> = { op: '+'; a: a; b: b };

export type Identity<A extends Op> = Rewrite<Add<A, '0'>, A>;
export type Commutativity<A extends Op, B extends Op> = Rewrite<Add<A, B>, Add<B, A>>;

// type _x = ApplyRewrite<Add<'A', '1'>, Identity<'0'>>;

// type Assoc<A extends Op, B extends Op> =

/*

Assoc: (a + b) + c = a + (b + c)

For a = 0,
(0 + b) + c
= b + c
= 0 + (b + c)

For a = succ(),

*/

