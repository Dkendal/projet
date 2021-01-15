import yargs = require('yargs/yargs')
import { assoc, loadConfig } from './projet'

/**
 * Main CLI script entrypoint.
 */

export default function () {
  yargs(process.argv.slice(2))
    .command({
      command: 'assoc <relationship> <file>',
      aliases: ['a'],
      describe: 'find a file with the matching relationship',
      handler: async ({
        file,
        relationship,
      }: {
        file: string
        relationship: string
      }) => {
        const config = await loadConfig('./.projet.toml')

        if (!config) {
          throw "Couldn't find config"
        }

        console.log(assoc(config, relationship, file))
      },
    })
    .demandCommand()
    .help()
    .wrap(72).argv
}
