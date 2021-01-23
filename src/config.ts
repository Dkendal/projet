/**
 * JSON decoder for .projet.toml files
 */

import * as t from 'io-ts'

// dprint-ignore
const Link = t.type({
  name: t.string,
  pattern: t.string
})

// dprint-ignore
const Rule = t.union([
  t.type({
    name: t.string,
    pattern: t.string
  }),
  t.partial({
    template: t.string,
    links: t.array(Link)
  })
])

// dprint-ignore
export const Config = t.type({
  rules: t.array(Rule)
})

export type Link = t.TypeOf<typeof Link>
export type Rule = t.TypeOf<typeof Rule>
export type Config = t.TypeOf<typeof Config>
