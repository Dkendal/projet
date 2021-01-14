import toml from '@iarna/toml'
import fs from 'fs'
import match from 'micromatch'
import * as mustache from 'micromustache'
import { isTransformer, transforms } from './transforms'

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

  const binding = { file }
  const scope = buildScope(match, binding)
  return render(template, scope)
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

  const template = match.config.template

  if (!template) {
    return ''
  }

  const binding = { file }
  const scope = buildScope(match, binding)
  return render(template, scope)
}

type ICompileOptions = mustache.ICompileOptions
type Scope = mustache.Scope

function buildScope(match: CategoryMatch, bindings: {}) {
  const entries = match.captures.map((value, idx) => [`$${idx}`, value])
  const captures = Object.fromEntries(entries)
  const scope = Object.assign(bindings, captures)
  return scope
}

function get(scope: Scope, pathExpr: string | string[]) {
  return mustache.get(scope, pathExpr, { propsExist: true })
}

function pipeReducer(acc: string, transformName: string) {
  transformName = transformName.trim()

  if (!isTransformer(transformName)) {
    throw `error: ${transformName} is not a valid transform`
  }

  return transforms[transformName](acc)
}

/**
 * Called by mustache with the contents of a tag, used to provide our own
 * grammar.
 */
function resolveFn(path: string, scope?: Scope) {
  if (!scope) {
    throw new Error('expected scope to be non-null')
  }

  const [pathExpr, ...pipes] = path.split('|')

  if (!pathExpr) {
    throw new Error(`expected a path expression, got: ${pathExpr}`)
  }

  const value = get(scope, pathExpr)

  if (typeof value !== 'string') {
    throw new Error('expected value to be a string')
  }

  return pipes.reduce(pipeReducer, value)
}

/**
 * Render a mustache template.
 */
export function render(template: string, scope: {}): string {
  const opts: ICompileOptions = {
    tags: ['{', '}'],
    propsExist: true,
    validateVarNames: true,
  }

  try {
    return mustache.renderFn(template, resolveFn, scope, opts)
  } catch (e) {
    if (e instanceof ReferenceError) {
      const br = '\n'
      const message = e.message
      const stack = e.stack

      const reraised = new ReferenceError(
        [
          message,
          br,
          `Available assigns: ${Object.keys(scope).join(', ')}`,
          br,
        ].join(''),
      )

      reraised.stack = stack?.split('\n').slice(2).join('\n')

      throw reraised
    }
    throw e
  }
}
