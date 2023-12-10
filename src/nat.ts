declare const prev: unique symbol

export type _nat = number & { [prev]: _nat | null }
export type Succ<n extends _nat> = number & { [prev]: n }
export type Pred<n extends _nat> = n extends _0 ? n : n[typeof prev]
export type Nat = _0 | Succ<_nat>

export type _0 = 0 & { [prev]: null }
export type _1 = Succ<_0>
export type _2 = Succ<_1>
export type _3 = Succ<_2>
export type _4 = Succ<_3>
export type _5 = Succ<_4>
export type _6 = Succ<_5>
export type _7 = Succ<_6>
export type _8 = Succ<_7>
