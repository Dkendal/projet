import yargs from 'yargs/yargs'
import {assoc, loadConfig} from './projet'

/**
 * Main CLI script entrypoint.
 */

yargs(process.argv.slice(2))
  .command({
    command: 'assoc <file> <relationship>',
    aliases: ['a'],
    describe: 'find a file with the matching relationship',
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

