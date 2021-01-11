import * as toml from 'https://deno.land/std@0.83.0/encoding/toml.ts'
import * as path from 'https://deno.land/std@0.83.0/path/mod.ts'
import yargs from 'https://deno.land/x/yargs@v16.2.0-deno/deno.ts'

const argv = yargs(Deno.args)
  .command({
    command: 'assoc <file> <relationship>',
    aliases: ['a'],
    desc: 'find a file with the matching relationship',
    handler: async ({
      file,
      relationship,
    }: {
      file: string
      relationship: string
    }) => {
      const config = await loadConfig('./testdata/config.toml')
      if (!config) {
        throw "Couldn't find config"
      }
      console.log(assoc(config, relationship, file))
    },
  })
  .demandCommand()
  .help()
  .wrap(72).argv

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
interface Config {
  [path: string]: MatchConfig
}

interface MatchConfig {
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
  const content = await Deno.readTextFile(file)
  const config = toml.parse(content)
  return config as Config
}

export function findMatch(
  config: Config,
  file: string,
): { capture: RegExpMatchArray; value: MatchConfig } | null {
  for (let key in config) {
    const value = config[key]
    const pattern = value.pattern

    const regexp = new RegExp(
      path
        .globToRegExp(pattern, {
          globstar: true,
          extended: true,
        })
        .source.replaceAll('[^/]*', '($&)'),
    )

    const capture = file.match(regexp)

    if (capture) {
      return { capture, value }
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
  let alternate = match.value.relationships[relationship]
  if (!alternate) {
    throw `no relationship: ${relationship}`
  }

  const captures = match.capture.slice(1)
  let capture: string | undefined

  while ((capture = captures.shift())) {
    const value = capture

    alternate = alternate.replace(
      /{[^}]*}/,
      (substring: string, ...args: []) => value,
    )
  }

  return alternate
}

/**
 * Return listing all files that match defined file groups.
 */
export function list(config: Config): string[] {
  return []
}

/**
 * Return a generated version of a file at the path `path`.
 */
export function template(config: Config, path: string): string {
  return ''
}
