/**
 * Custom type guard functions.
 */

import { None, Option, Some } from './projet'

type TypeGuard<T> = (term: unknown) => term is T

type ObjectIndex = string | number

export function isNone<T>(term: Option<T>): term is None {
  return term === null || typeof term === 'undefined'
}

export function has3<K extends ObjectIndex, V extends string>(
  term: unknown,
  key: K,
  ...rest:
    | [valuetype: V]
    | [typeguard: ((term2: unknown) => term2 is V)]
): term is {
  [key in K]: V
} {
  if (typeof rest[0] === 'function') {
    const typeguard = rest[0]
    return has(term, key) && typeguard(term[key])
  }
  const valuetype = rest[0]
  return has(term, key) && typeof term[key] === valuetype
}

export function has<K extends ObjectIndex>(term: unknown, key: K): term is {
  [key in K]: unknown
} {
  return isObject(term) && key in term
}

export function isSome<T>(term: Option<T>): term is Some<T> {
  return !isNone(term)
}

export function isObject(term: unknown): term is Object {
  return isSome(term) && typeof term === 'object'
}

export function compact<A>(_term: A): _term is {
  [K in keyof A]: A[K]
} {
  return true
}

export function defGuard<T>(fn: (term: unknown) => false | T) {
  return (term: unknown): term is T => fn(term) !== false
}

export const isConfig = defGuard((term: unknown) =>
  isObject(term)
  && has3(term, 'config', 'object')
  && has3(term, 'path', 'string')
  && compact(term)
  && term
)

export function assertType<A extends AB, AB>(term: AB, guard: (t: AB) => t is A, msg?: string): term is A {
  if (guard(term)) return true
  throw new TypeError(msg)
}

// export function refuteType<A | B>(term: unknown, guard: (t: unknown) => t is A | B, msg?: string): term is T | never {
//   if (guard(term)) return false
//   throw new TypeError(msg)
// }
