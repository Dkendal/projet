import { NvimPlugin } from 'neovim'
import { AutocmdOptions, CommandOptions as CommandOptions_, NvimFunctionOptions } from 'neovim/lib/host/NvimPlugin'
import path from 'path'
import util from 'util'
import { isNone } from '../guards'
import * as projet from '../projet'
import { Failure, getConfig } from '../projet'
import {AutocmdEvents} from './types'

interface CommandOptions extends CommandOptions_ {
  nargs?:
    | '0'
    | '1'
    | '*'
    | '?'
    | '+'
}

const all = Promise.all.bind(Promise)

const pluginOptions = {
  dev: ENV === 'dev',
  alwaysInit: ENV === 'dev',
}

function main(plugin: NvimPlugin) {
  // @ts-ignore
  logger = plugin.nvim.logger

  const api = plugin.nvim
  const fn = api.call.bind(api)
  const cmd = api.command.bind(api)

  plugin.setOptions(pluginOptions)

  /****************************************************************************/
  /*                                                                          */
  /*                                 Logging                                  */
  /*                                                                          */
  /*  Loggers use winston, and are configured to write to NVIM_NODE_LOG_FILE  */
  /*                                                                          */
  /****************************************************************************/

  const dump = (x: any) => echomsg(util.inspect(x, false, null))
  const echoerr = (...msg: string[]) => api.errWriteLine(msg.join(' '))
  const echomsg = (...msg: string[]) => api.outWriteLine(msg.join(' '))

  logger.dump = dump

  async function getcwd() {
    return await api.call('getcwd') as string
  }

  interface FzfSpec {
    source: string | string[]
  }

  async function fzf(spec: FzfSpec) {
    // globpath(&rtp, 'bin/preview.sh')
    return fn('fzf#wrap', [spec])
      .then(spec => fn('fzf#run', [spec]))
  }

  /****************************************************************************/
  /*                                                                          */
  /*                    Neovim plugin registration helpers                    */
  /*                                                                          */
  /****************************************************************************/

  /**
   * Wrap `fn` with an error handling to print any errors as an error message
   * within Vim.
   */
  const catchErrors = (fn: Function) =>
    async (...args: any): Promise<void> => {
      try {
        return await fn(...args)
      } catch (e: unknown) {
        if (process.env.NVIM_NODE_HOST_DEBUG)
          throw e
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

  /**
   * Decorator to register as a vim autocmd.
   * The actual function name isn't important - `name` is the autocmd event that
   * it will be registered to.
   */
  function vimAutocmd(name: AutocmdEvents, opts: AutocmdOptions) {
    return (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
      return plugin.registerAutocmd(name, catchErrors(descriptor.value), opts)
    }
  }

  function failureMsg(failure: Failure<'no_config'>) {
    switch (failure.code) {
      case 'no_config':
        return "Couldn't find a config file"

      default:
        return failure.code
    }
  }

  /**
   * Get the config associated with the current buffer.
   */
  async function bufGetConfig() {
    const bname = await api.buffer.name
    const config = projet.getConfig(bname)

    if (config instanceof Failure) throw failureMsg(config)

    return config
  }


  class Plugin {
    /**************************************************************************/
    /*                                                                        */
    /*                               Functions                                */
    /*                                                                        */
    /**************************************************************************/

    @vimFunction({ sync: true })
    async ProjetEditComplete([_argLead, cmdLine, cursorPos]: [string, string, number]) {
      const [bufname, cwd] = await all([api.buffer.name, getcwd()])

      const config = getConfig(bufname)

      if (config instanceof Failure) throw failureMsg(config)

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
      const config = getConfig(file)

      if (config instanceof Failure) throw failureMsg(config)

      const match = projet.findMatch(config, file)
      const keys = match?.rule?.links?.map(x => x.name) ?? []
      return keys.join('\n')
    }

    @vimFunction({ sync: true })
    async ProjetGetConfig() {
      const file = await api.buffer.name
      return getConfig(file)
    }

    @vimFunction({ sync: true })
    async ProjetRenderTemplate() {
      const file = await api.buffer.name
      const config = getConfig(file)

      if (config instanceof Failure) throw failureMsg(config)

      return projet.template(config, file)
    }

    @vimFunction({ sync: true })
    async ProjetList(ruleName: string) {
      const file = await api.buffer.name
      const cwd = await getcwd()
      const config = getConfig(file)

      if (config instanceof Failure) throw failureMsg(config)

      return projet.list(config, ruleName)
        .map(x => path.relative(cwd, x))
    }

    @vimFunction({ sync: true })
    async ProjetGetMatchConfig() {
      const file = await api.buffer.name
      const config = projet.getConfig(file)

      if (config instanceof Failure) throw failureMsg(config)

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
      const config = projet.getConfig(file)

      if (config instanceof Failure) return

      let linkFile = projet.assoc(config, file, linkName)

      const cwd = await getcwd()

      linkFile = path.relative(cwd, linkFile)

      await cmd(`edit ${linkFile}`)
    }

    @vimCommand({ sync: true })
    async Cd() {
      const bname = await api.buffer.name
      const config = projet.findConfig(bname)
      if (config instanceof Failure) throw failureMsg(config)
      const dir = path.dirname(config)
      await cmd(`cd ${dir}`)
    }

    @vimCommand({ sync: false })
    async Lcd() {
      const bname = await api.buffer.name
      const config = projet.findConfig(bname)
      if (config instanceof Failure) throw failureMsg(config)
      const dir = path.dirname(config)
      await cmd(`lcd ${dir}`)
    }

    @vimCommand({ sync: false })
    async Tcd() {
      const bname = await api.buffer.name
      const config = projet.findConfig(bname)
      if (config instanceof Failure) throw failureMsg(config)
      const dir = path.dirname(config)
      await cmd(`tcd ${dir}`)
    }

    @vimCommand({ sync: false })
    async ProjetConfig() {
      const bname = await api.buffer.name
      const config = projet.findConfig(bname)
      if (config instanceof Failure) throw failureMsg(config)
      await cmd(`edit ${config}`)
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
      const config = projet.getConfig(file)

      if (config instanceof Failure) throw failureMsg(config)

      //
      // 1 arg
      //
      if (isNone(localpath)) {
        const cwd = await getcwd()
        const source = projet
          .list(config, ruleName)
          .map(x => path.relative(cwd, x))

        return fzf({ source })
      }

      //
      // 2 arg
      //
      const rule = projet.getRule(config, ruleName)

      if (!rule) throw `no rule matching ${ruleName}`

      const editpath = projet.joinBasePath(rule.pattern, localpath)

      await cmd(`edit ${editpath}`)
    }

    /**************************************************************************/
    /*                                                                        */
    /*                                Autocmds                                */
    /*                                                                        */
    /**************************************************************************/
    @vimAutocmd('BufNewFile', { pattern: '*', sync: false })
    async applyTemplate() {
      const file = await api.buffer.name

      const config = projet.getConfig(file)

      if (config instanceof Failure) throw failureMsg(config)

      const template = projet.template(config, file)
      const lines = template.split('\n')
      await api.buffer.setLines(lines, { start: 0, end: -1 })
    }
  }

  // Only called for side effects
  new Plugin()
}

export = main
