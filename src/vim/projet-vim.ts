import { NvimPlugin } from 'neovim'
import { AutocmdOptions, CommandOptions, NvimFunctionOptions } from 'neovim/lib/host/NvimPlugin'
import path from 'path'
import util from 'util'
import { isNone } from '../guards'
import * as projet from '../projet'
import { getConfig } from '../projet'

const pluginOptions = {
  dev: ENV === 'dev',
  alwaysInit: ENV === 'dev',
}

function main(plugin: NvimPlugin) {
  // @ts-ignore
  logger = plugin.nvim.logger

  const api = plugin.nvim
  const cmd = api.command.bind(api)

  plugin.setOptions(pluginOptions)

  const dump = (x: any) => echomsg(util.inspect(x, false, null))
  const echoerr = (...msg: string[]) => api.errWriteLine(msg.join(' '))
  const echomsg = (...msg: string[]) => api.outWriteLine(msg.join(' '))

  /*
   * Loggers use winston, and are configured to write to NVIM_NODE_LOG_FILE
   */
  logger.dump = dump

  const debug = logger.debug.bind(logger)
  const info = logger.info.bind(logger)
  const error = logger.error.bind(logger)
  const warn = logger.warn.bind(logger)

  async function getcwd() {
    return await api.call('getcwd') as string
  }

  /**
   * Wrap `fn` with an error handling to print any errors as an error message
   * within Vim.
   */
  const catchErrors = (fn: Function) =>
    async (...args: any): Promise<void> => {
      try {
        return await fn(...args)
      } catch (e: unknown) {
        if (typeof e === 'string')
          return echoerr(e)
        else
          return echoerr(util.inspect(e))
      }
    }

  function defCmd(name: string, fn: Function, opts: CommandOptions | undefined) {
    const wrappedFunction = catchErrors(fn)
    return plugin.registerCommand(name, wrappedFunction, opts)
  }

  function defFn(
    name: string,
    fn: Function,
    opts: NvimFunctionOptions | undefined,
  ) {
    const wrappedFunction = catchErrors(fn)
    return plugin.registerFunction(name, wrappedFunction, opts)
  }

  function defAutocmd(name: string, fn: Function, opts: AutocmdOptions) {
    const wrappedFunction = catchErrors(fn)
    return plugin.registerAutocmd(name, wrappedFunction, opts)
  }

  /**
   * Decorator to register as a vim function.
   */
  function vimFunction(opts: NvimFunctionOptions) {
    return (_target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      defFn(propertyKey, descriptor.value, opts)
    }
  }

  /**
   * Decorator to register as a vim command.
   */
  function vimCommand(opts: CommandOptions) {
    return (_target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      defCmd(propertyKey, descriptor.value, opts)
    }
  }

  /****************************************************************************/
  /*                                                                          */
  /*                               Autocommands                               */
  /*                                                                          */
  /****************************************************************************/
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

  class Plugin {
    /**************************************************************************/
    /*                                                                        */
    /*                               Functions                                */
    /*                                                                        */
    /**************************************************************************/

    @vimFunction({ sync: true, eval: '[getcwd(), bufname()]' })
    async ProjetEditComplete(
      [_argLead, cmdLine, cursorPos]: [string, string, number],
      [cwd, bufname]: [string, string],
    ) {
      const config = await getConfig(bufname)

      const before = cmdLine.slice(0, cursorPos)

      const args = before.split(/\s+/)

      if (args.length === 2)
        return config.config.rules.map(x => x.name).join('\n')

      if (args.length == 3 && args[1]) {
        const ruleName = args[1]
        return projet.list(config, ruleName)
          .map(x => path.relative(cwd, x))
          .join('\n')
      }

      return '\n'
    }

    @vimFunction({ sync: true })
    async ProjetListRules(_argLead: string, _cmdLine: string, _cursorPos: number) {
      const file = await api.buffer.name
      const config = await getConfig(file)
      const match = projet.findMatch(config, file)
      const keys = match?.rule?.links?.map(x => x.name) ?? []
      return keys.join('\n')
    }

    @vimFunction({ sync: true })
    async ProjetGetConfig() {
      const file = await api.buffer.name
      return await getConfig(file)
    }

    @vimFunction({ sync: true })
    async ProjetRenderTemplate() {
      const file = await api.buffer.name
      const config = await getConfig(file)
      return projet.template(config, file)
    }

    @vimFunction({ sync: true })
    async ProjetList(ruleName: string) {
      const file = await api.buffer.name
      const cwd = await getcwd()
      const config = await getConfig(file)
      return projet.list(config, ruleName)
        .map(x => path.relative(cwd, x))
    }

    @vimFunction({ sync: true })
    async ProjetGetMatchConfig() {
      const file = await api.buffer.name
      const config = await getConfig(file)
      const match = projet.findMatch(config, file)

      if (!match) throw `No matches for ${file}`

      return match
    }

    /**************************************************************************/
    /*                                                                        */
    /*                                Commands                                */
    /*                                                                        */
    /**************************************************************************/

    @vimCommand({ sync: false, nargs: '?', complete: 'custom,ProjetListRules' })
    async ProjetLink([linkName]: string[]) {
      const file = await api.buffer.name
      const config = await projet.getConfig(file)
      let linkFile = projet.assoc(config, file, linkName)
      const cwd = await getcwd()
      linkFile = path.relative(cwd, linkFile)

      await cmd(`edit ${linkFile}`)
    }

    @vimCommand({ sync: true })
    async Cd() {
      const bname = await api.buffer.name
      const configFile = await projet.findConfig(bname)
      const dir = path.dirname(configFile)
      await cmd(`cd ${dir}`)
    }

    @vimCommand({ sync: false })
    async Lcd() {
      const bname = await api.buffer.name
      const configFile = await projet.findConfig(bname)
      const dir = path.dirname(configFile)
      await cmd(`lcd ${dir}`)
    }

    @vimCommand({ sync: false })
    async Tcd() {
      const bname = await api.buffer.name
      const configFile = await projet.findConfig(bname)
      const dir = path.dirname(configFile)
      await cmd(`tcd ${dir}`)
    }

    @vimCommand({ sync: false })
    async ProjetConfig() {
      const bname = await api.buffer.name
      const configFile = await projet.findConfig(bname)
      await cmd(`edit ${configFile}`)
    }

    @vimCommand({
      sync: false,
      nargs: '+',
      complete: 'custom,ProjetEditComplete',
    })
    async ProjetEdit([ruleName, localpath]:
      | [ruleName: string]
      | [ruleName: string, localpath: string])
    {
      const file = await api.buffer.name
      const config = await projet.getConfig(file)

      if (isNone(localpath)) {
        const cwd = await getcwd()
        const source = projet
          .list(config, ruleName)
          .map(x => path.relative(cwd, x))

        return api.callFunction('fzf#run', [{ source, sink: 'e' }])
      } else {
        const rule = projet.getRule(config, ruleName)

        if (!rule) throw `no rule matching ${ruleName}`

        const editpath = projet.joinBasePath(rule.pattern, localpath)

        await cmd(`edit ${editpath}`)
      }
    }
  }

  // Only called for side effects
  new Plugin()
}

export = main
