import fs from 'fs'
import path from 'path'
import toml from '@iarna/toml'
import match from 'micromatch'
import * as mustache from 'micromustache'

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
  relationships: {
    [name: string]: string
  }
}

/**
 * Load the config from the FS. For now just assume that it's in the current
 * directory.
 */
export async function loadConfig(file: string): Promise<Config | null> {
  console.log(file)
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

  let pathTemplate = match.config.relationships[relationship]

  if (!pathTemplate) {
    throw `no relationship: ${relationship}`
  }

  const variables = Object.assign({ file }, match.captures)

  return mustache.render(pathTemplate, variables, {
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
export function template(_config: Config, _path: string): string {
  return ''
}
