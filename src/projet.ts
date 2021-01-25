import * as toml from '@iarna/toml'
import { isLeft } from 'fp-ts/lib/Either'
import * as fs from 'fs'
import { promises as fsx } from 'fs'
import * as match from 'micromatch'
import * as path from 'path'
import { Config, Rule } from './config'
import { buildScope, render } from './template'

export type { Config, Rule }

interface ConfigInstance {
  path: string
  config: Config
}

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
 * Search upwards until the config file is found.
 */
export async function findConfig(startingDir: string): Promise<string> {
  let dir = startingDir

  while (true) {
    let filename = path.join(dir, '.projet.toml')

    if (fs.existsSync(filename))
      return path.resolve(filename)

    if (dir === '/')
      throw "couldn't find config file"

    dir = path.dirname(dir)
  }
}

/**
 * Load the config from the the provided path.
 */
export async function loadConfig(localpath: string) {
  const content = await fsx.readFile(localpath, { encoding: 'utf-8' })
  const json = toml.parse(content)
  const config = Config.decode(json)

  if (isLeft(config))
    throw config.left
  else
    return { path: localpath, config: config.right }
}

/**
 * Convenience function to find, and load the configuration.
 */
export async function getConfig(startingDir: string) {
  const configPath = await findConfig(startingDir)
  return loadConfig(configPath)
}

/**
 * Configuration for a file that matched the config's pattern. Includes the
 * category, which is what kind of "type" of file this is, the config for
 * this category, and the captures from the pattern for replacement.
 */
export interface RuleMatch {
  captures: RegExpMatchArray
  category: string
  rule: Rule
}

export function findMatch(config: ConfigInstance, filepath: string): RuleMatch | null {
  const to = path.dirname(config.path)
  const localpath = path.relative(to, filepath)

  const rules = config.config.rules

  for (const rule of rules) {
    const category = rule.name
    const pattern = rule.pattern
    const captures = match.capture(pattern, localpath)

    if (captures)
      return { captures, category, rule }
  }
  return null
}

/**
 * Return the name of the file in relation relationship `assocName` with file
 * at `path`.
 */
export function assoc(config: ConfigInstance, file: string, linkName?: string): string {
  const match = findMatch(config, file)

  if (!match) throw `No matching rule for ${file}`

  const rule = match.rule

  let link = findLink(rule, linkName)

  const pattern = link.pattern

  const binding = { file }
  const scope = buildScope(match, binding)
  let localpath = render(pattern, scope)
  const dir = path.dirname(config.path)
  localpath = path.join(dir, localpath)

  return path.normalize(localpath)
}

/**
 * Return the link that matches the name, or return the first link if not
 * specified
 */
function findLink(rule: Rule, linkName: string | undefined) {
  const ruleName = rule.name
  const links = rule.links ?? []

  if (!linkName) {
    const link = links[0]

    if (!link) throw `No links defined for ${ruleName}`

    return link
  }

  const link = links.find(({ name }) => name === linkName)

  if (!link) throw `No link named ${linkName} defined for ${ruleName}`

  return link
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
export function template(config: ConfigInstance, file: string): string {
  const match = findMatch(config, file)

  if (!match)
    throw `no match for: ${file}`

  const template = match.rule.template

  if (!template)
    throw new Error(`No template defined for ${match.category}`)

  const binding = { file }
  const scope = buildScope(match, binding)
  return render(template, scope)
}
