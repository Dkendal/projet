import type { NvimPlugin } from 'neovim'
import { AutocmdOptions, CommandOptions, NvimFunctionOptions } from 'neovim/lib/host/NvimPlugin'
import path from 'path'
import util from 'util'
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

  const dump = (x: any) => echomsg(util.inspect(x, false, null))

  const echoerr = (...msg: string[]) => api.errWriteLine(msg.join(' '))

  const echomsg = (...msg: string[]) => api.outWriteLine(msg.join(' '))

  const catchErrors = (fn: Function) =>
    async (...args: any): Promise<void> => {
      try {
        return await fn(...args)
      } catch (e: unknown) {
        if (typeof e === 'string')
          return echoerr(e)
        // else if (e?.message)
        //   return echoerr(e.message)
        else
          return echoerr(util.inspect(e, 1))
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

  function defAutocmd(name: string, fn: Function, opts: AutocmdOptions) {
    const wrappedFunction = catchErrors(fn)
    return plugin.registerAutocmd(name, wrappedFunction, opts)
  }

  /*
   * Commands
   */

  /**
   * @since 0.1.0
   */
  defCmd('ProjetLink', async ([linkName]: string[]) => {
    const file = await api.buffer.name
    const config = await projet.getConfig(file)
    let linkFile = projet.assoc(config, file, linkName)
    const cwd = await api.call('getcwd')
    linkFile = path.relative(cwd, linkFile)

    await cmd(`edit ${linkFile}`)
  }, {
    sync: false,
    nargs: '?',
    complete: 'custom,ProjetListRules',
  })

  /**
   * @since 0.2.0
   */
  defCmd('Cd', async () => {
    const bname = await api.buffer.name
    const configFile = await projet.findConfig(bname)
    const dir = path.dirname(configFile)
    await cmd(`cd ${dir}`)
  }, { sync: false })

  /**
   * @since 0.2.0
   */
  defCmd('Lcd', async () => {
    const bname = await api.buffer.name
    const configFile = await projet.findConfig(bname)
    const dir = path.dirname(configFile)
    await cmd(`lcd ${dir}`)
  }, { sync: false })

  /**
   * @since 0.2.0
   */
  defCmd('Tcd', async () => {
    const bname = await api.buffer.name
    const configFile = await projet.findConfig(bname)
    const dir = path.dirname(configFile)
    await cmd(`tcd ${dir}`)
  }, { sync: false })

  /**
   * @since 0.1.0
   */
  defCmd('ProjetConfig', async () => {
    const bname = await api.buffer.name
    const configFile = await projet.findConfig(bname)
    await cmd(`edit ${configFile}`)
  }, { sync: false })

  /*
   * Functions
   */

  /**
   * @since 0.1.0
   */
  defFn('ProjetListRules', async (_argLead: string, _cmdLine: string, _cursorPos: number) => {
    const file = await api.buffer.name
    const config = await projet.getConfig(file)
    const match = projet.findMatch(config, file)
    const keys = match?.rule?.links?.map(x => x.name) ?? []
    return keys.join('\n')
  }, { sync: true })

  /**
   * @since 0.1.0
   */
  defFn('ProjetGetConfig', async () => {
    const file = await api.buffer.name
    return await projet.getConfig(file)
  }, { sync: true })

  /**
   * @since 0.2.0
   */
  defFn('ProjetRenderTemplate', async () => {
    const file = await api.buffer.name
    const config = await projet.getConfig(file)
    return projet.template(config, file)
  }, { sync: true })

  /**
   * @since 0.1.0
   */
  defFn('ProjetGetMatchConfig', async () => {
    const file = await api.buffer.name
    const config = await projet.getConfig(file)
    const match = projet.findMatch(config, file)

    if (!match) throw `No matches for ${file}`

    return match
  }, { sync: true })

  /*
   * Autocommands
   */

  /**
   * @since 0.2.0
   */
  defAutocmd('BufNewFile', async () => {
    // Apply template
    const file = await api.buffer.name
    const config = await projet.getConfig(file)
    const template = projet.template(config, file)
    const lines = template.split('\n')
    await api.buffer.setLines(lines, { start: 0, end: -1 })
  }, {
    pattern: '*',
    sync: false,
  })
}
