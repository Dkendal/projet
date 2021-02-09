import * as toml from '@iarna/toml'
import * as Either from 'fp-ts/lib/Either'
import * as fs from 'fs'
import { promises as fsx } from 'fs'
import * as match from 'micromatch'
import * as micromatch from 'micromatch'
import * as path from 'path'
import { Config, Rule } from './config'
import {isNone} from './guards'
import { buildScope, render } from './template'

export type { Config, Rule }

export type None = undefined | null
export type Some<T> = T
export type Option<T> = Some<T> | None

interface ConfigInstance {
  path: string
  config: Config
}

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

  if (Either.isLeft(config))
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

/**
 * Return the rule with name `ruleName`.
 */
export function getRule(config: ConfigInstance, ruleName: string): Option<Rule> {
  const rules = config.config.rules

  for (const rule of rules) {
    const name = rule.name
    if (name == ruleName) return rule
  }

  return null
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

// TODO return base from line 202
//
/**
 * Return listing all files that match defined file groups.
 */
export function list(config: ConfigInstance, ruleName: string): string[] {
  const rule = getRule(config, ruleName)

  if (isNone(rule)) throw `No rule named ${ruleName}`

  const root = path.dirname(config.path)
  const pattern = path.join(root, rule.pattern)

  const opts = { cwd: root }

  const isMatch = micromatch.matcher(pattern, opts)

  const scan = micromatch.scan(pattern, opts)
  const base = scan.base

  // Depth first traversal of the directory, starting at the "base" (the part
  // preceding any wildcards) of the glob pattern.
  function walk(localpath: string): string[] {
    const stats = fs.statSync(localpath)

    // Leaf nodes
    if (stats.isFile()) {
      if (isMatch(localpath)) {
        const shortPath = path.relative(base, localpath)
        return [shortPath]
      }

      return []
    }

    if (stats.isDirectory()) {
      const list = fs.readdirSync(localpath)

      return list.flatMap((filename) => {
        const child = path.join(localpath, filename)
        return walk(child)
      })
    }

    return []
  }

  return walk(base)
}
/**
 * Given a glob pattern, return it's "base".
 *
 * @example
 *
 *     getBasePath("src\/**\/*.ts")
 *     "src/"
 *
 */
export function getBasePath(pattern: string) {
  return micromatch.scan(pattern).base
}

export function joinBasePath(pattern: string, localpath: string) {
  return path.join(getBasePath(pattern), localpath)
}

/**
 * Return a generated version of a file at the path `path`.
 */
export function template(config: ConfigInstance, file: string): string {
  const match = findMatch(config, file)

  if (!match) throw `no match for: ${file}`

  const template = match.rule.template

  if (!template)
    throw new Error(`No template defined for ${match.category}`)

  const binding = { file }
  const scope = buildScope(match, binding)
  return render(template, scope)
}
