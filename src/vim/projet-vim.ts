import type { NvimPlugin } from 'neovim'
import { CommandOptions, NvimFunctionOptions } from 'neovim/lib/host/NvimPlugin'
import * as projet from '../projet'

const pluginOptions = {
  dev: ENV === 'dev',
  alwaysInit: ENV === 'dev',
}

export = (plugin: NvimPlugin) => {
  const api = plugin.nvim
  const cmd = api.command.bind(api)

  plugin.setOptions(pluginOptions)

  /*
   * Loggers use winston, and are configured to write to NVIM_NODE_LOG_FILE
   */
  const logger = plugin.nvim.logger
  const debug = logger.debug.bind(logger)
  const info = logger.info.bind(logger)
  const error = logger.error.bind(logger)
  const warn = logger.warn.bind(logger)

  const dump = (x: any) => echomsg(JSON.stringify(x))

  const echoerr = (...msg: string[]) => api.errWriteLine(msg.join(' '))

  const echomsg = (...msg: string[]) => api.outWriteLine(msg.join(' '))

  const catchErrors = (fn: Function) =>
    async (...args: any): Promise<void> => {
      try {
        return await fn(...args)
      } catch (e: unknown) {
        if (typeof e === 'string')
          return echoerr(e)
        else if (e instanceof Error)
          return echoerr(e.message)
        else
          return echoerr(JSON.stringify(e))
      }
    }

  function defCmd(name: string, fn: Function, opts: CommandOptions | undefined) {
    const wrappedFunction = catchErrors(fn)
    return plugin.registerCommand(name, wrappedFunction, opts)
  }

  function defFn(name: string, fn: Function, opts: NvimFunctionOptions | undefined) {
    const wrappedFunction = catchErrors(fn)
    return plugin.registerFunction(name, wrappedFunction, opts)
  }

  /*
   * Commands
   */
  defCmd('ProjetLink', async ([linkName]: string[]) => {
    const file = await api.buffer.name
    const config = await projet.getConfig(file)
    const linkFile = projet.assoc(config, file, linkName)

    await cmd(`edit ${linkFile}`)
  }, {
    sync: false,
    nargs: '?',
    complete: 'custom,ProjetLinkComplete',
  })

  defCmd('ProjetConfig', async () => {
    const bname = await api.buffer.name
    const configFile = await projet.findConfig(bname)
    await cmd(`edit ${configFile}`)
  }, { sync: false })

  /*
   * Functions
   */
  defFn('ProjetLinkComplete', async (_argLead: string, _cmdLine: string, _cursorPos: number) => {
    const file = await api.buffer.name
    const config = await projet.getConfig(file)
    const match = projet.findMatch(config, file)
    const keys = match?.rule?.links?.map(x => x.name) ?? []
    return keys.join('\n')
  }, { sync: true })

  defFn('ProjetGetConfig', async () => {
    const file = await api.buffer.name
    return await projet.getConfig(file)
  }, { sync: true })

  defFn('ProjetGetMatchConfig', async () => {
    const file = await api.buffer.name
    const config = await projet.getConfig(file)
    const match = projet.findMatch(config, file)

    if (!match) throw `No matches for ${file}`

    return match
  }, { sync: true })
}
