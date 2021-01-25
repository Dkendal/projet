/**
 * JSON decoder for .projet.toml files
 */

import * as t from 'io-ts'

const Link = t.type({
  name: t.string,
  pattern: t.string,
})

const Rule = t.intersection([
  t.type({
    name: t.string,
    pattern: t.string,
  }),
  t.partial({
    template: t.string,
    links: t.array(Link),
  }),
])

export const Config = t.type({
  rules: t.array(Rule),
})

export interface Link extends t.TypeOf<typeof Link> {}
export interface Rule extends t.TypeOf<typeof Rule> {}
export interface Config extends t.TypeOf<typeof Config> {}
