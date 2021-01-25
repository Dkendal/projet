import type { NvimPlugin } from 'neovim'
import * as projet from '../projet'

const pluginOptions = {
  dev: ENV === 'dev',
  alwaysInit: ENV === 'dev',
}

export = (plugin: NvimPlugin) => {
  plugin.setOptions(pluginOptions)

  const logger = plugin.nvim.logger
  const debug = logger.debug.bind(logger)
  const info = logger.info.bind(logger)
  const error = logger.error.bind(logger)
  const warn = logger.warn.bind(logger)

  const dump = (x: any) => debug(JSON.stringify(x))

  const api = plugin.nvim
  const cmd = api.command.bind(api)

  const defCmd = plugin.registerCommand.bind(plugin)
  const defFn = plugin.registerFunction.bind(plugin)

  const echoerr = (msg: string) => api.errWriteLine(msg)
  const echomsg = (msg: string) => api.outWriteLine(msg)

  async function reportError<T>(fun: () => Promise<T>) {
    try {
      return fun()
    } catch (e: unknown) {
      if (e instanceof Error) {
        echoerr(e.message)
        return
      }
      echoerr(JSON.stringify(e))
      return
    }
  }

  /*
   * Commands
   */
  defCmd('ProjetLink', async ([linkName]: string[]) => {
    reportError(async () => {
      const file = await api.buffer.name
      const config = await projet.getConfig(file)
      const linkFile = projet.assoc(config, file, linkName)
      await cmd(`edit ${linkFile}`)
    })
  }, {
    sync: false,
    nargs: '?',
    complete: 'custom,ProjetAssocComplete',
  })

  defCmd('ProjetConfig', async () => {
    reportError(async () => {
      const bname = await api.buffer.name
      const configFile = await projet.findConfig(bname)
      await cmd(`edit ${configFile}`)
    })
  }, { sync: false })

  /*
   * Functions
   */
  defFn('ProjetAssocComplete', async (_argLead: string, _cmdLine: string, _cursorPos: number) => {
    return await reportError(async () => {
      const file = await api.buffer.name
      const config = await projet.getConfig(file)
      const match = projet.findMatch(config, file)
      const keys = match?.rule?.links?.map(x => x.name) ?? []
      return keys.join('\n')
    })
  }, { sync: true })

  defFn('ProjetGetConfig', async () => {
    return await reportError(async () => {
      const file = await api.buffer.name
      return await projet.getConfig(file)
    })
  }, { sync: true })

  defFn('ProjetGetMatchConfig', async () => {
    return await reportError(async () => {
      const file = await api.buffer.name
      const config = await projet.getConfig(file)
      const match = projet.findMatch(config, file)

      if (!match) throw `No matches for ${file}`

      return match
    })
  }, { sync: true })
}
