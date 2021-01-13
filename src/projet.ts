import toml from '@iarna/toml'
import fs from 'fs'
import match from 'micromatch'
import * as mustache from 'micromustache'
import {isTransformer, transforms} from './transforms'

/*
 * Basic premise of what I want v1 to be
 *
 * Load a config file, probably toml - special fallbacks can come later,
 * assume same directory for now. hand at least what projections can do
 *
 * Add basic CLI interface, will have to find a library for this, i've used
 * yargs before and liked it.
 *
 * For any given file path
 * - find its match in the config
 * - return its alternate (later any other arbitrary relationship)
 * - return a template for it
 * - return some other KV for it
 *
 * Later I can generate a graph based on the relationships, but for now
 * focus on doing what projectionist can do.
 *
 *
 * For templating, if possible reuse the same * {foo:bar} syntax, otherwise
 * find something that already exists. Implement basic transforms.
 *
 */

/**
 * The file config. Defines acceptable input.
 */
export interface Config {
  [path: string]: MatchConfig
}

export interface MatchConfig {
  pattern: string
  template?: string
  relationships?: {
    [name: string]: string
  }
}

/**
 * Load the config from the FS. For now just assume that it's in the current
 * directory.
 */
export async function loadConfig(file: string): Promise<Config | null> {
  const content = await new Promise((res, rej) =>
    fs.readFile(file, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        rej(err)
      }
      res(data)
    }),
  )

  if (typeof content !== 'string') {
    throw 'expected a string'
  }

  const config = toml.parse(content)

  return (config as unknown) as Config
}

/**
 * Configuration for a file that matched the config's pattern. Includes the
 * category, which is what kind of "type" of file this is, the config for
 * this category, and the captures from the pattern for replacement.
 */
interface CategoryMatch {
  captures: RegExpMatchArray
  category: string
  config: MatchConfig
}

export function findMatch(config: Config, file: string): CategoryMatch | null {
  for (const [category, categoryConfig] of Object.entries(config)) {
    const captures = match.capture(categoryConfig.pattern, file)

    if (captures) {
      return { captures, category, config: categoryConfig }
    }
  }
  return null
}

/**
 * Return the name of the file in relation relationship `assocName` with file
 * at `path`.
 */
export function assoc(
  config: Config,
  relationship: string,
  file: string,
): string {
  const match = findMatch(config, file)

  if (!match) {
    throw `no match for: ${file}`
  }

  const relationships = match.config.relationships ?? {}
  const template = relationships[relationship]

  if (!template) {
    throw `no relationship: ${relationship}`
  }

  const variables = Object.assign({ file }, match.captures)

  return mustache.render(template, variables, {
    tags: ['{', '}'],
    propsExist: true,
    validateVarNames: true,
  })
}

/**
 * Return listing all files that match defined file groups.
 */
export function list(_config: Config): string[] {
  return []
}

/**
 * Return a generated version of a file at the path `path`.
 */
export function template(config: Config, file: string): string {
  const match = findMatch(config, file)

  if (!match) {
    throw `no match for: ${file}`
  }

  const template = match.config.template ?? ''

  const scope = Object.assign({ file }, match.captures)

  return mustache.renderFn(
    template,
    (path, scope) => {
      if (!scope) {
        throw "error: expected scope to be non-null"
      }

      const [varName, ...transformNames] = path.split('|')

      if (!varName) {
        throw "error: expected varName to be non-null"
      }

      const value = mustache.get(scope, varName)

      return transformNames.reduce((acc, transform) => {
        transform = transform.trim()

        if (!isTransformer(transform)) {
          throw `error: ${transform} is not a valid transform`
        }

        return transforms[transform](acc)
      }, value)
    },
    scope,
    {
      tags: ['{', '}'],
      propsExist: true,
      validateVarNames: true,
    },
  )
}
