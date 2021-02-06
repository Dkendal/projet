import * as micromatch from 'micromatch'
import * as path from 'path'
import * as ph from 'perf_hooks'
import * as util from 'util'
import type { Config } from './projet'
import * as mod from './projet'

// @ts-ignore
global.logger = console

const cwd = process.cwd()
const root = (a: string) => path.join(cwd, a)

const config: Config = {
  rules: [
    {
      name: 'test',
      pattern: 'test/**/*.test.ts',
      links: [
        { name: 'src', pattern: 'src/{$*}.ts' },
      ],
    },
    {
      name: 'lib',
      pattern: 'src/**/*.ts',
      links: [
        { name: 'test', pattern: 'test/{$*}.test.ts' },
      ],
    },
  ],
}

const config_i = {
  path: '.projet.toml',
  config: config,
}

const elixirConfig = {
  path: 'examples/elixir-phoenix/.projet.toml',
  config: {
    rules: [
      {
        name: 'test',
        pattern: 'test/**/*_test.exs',
        links: [{ name: 'lib', pattern: 'lib/{$*}.ex' }],
      },
      {
        name: 'lib',
        pattern: 'lib/**/*.ex',
        links: [{ name: 'test', pattern: 'test/{$*}_test.exs' }],
      },
    ],
  },
}

describe('.findConfig', () => {
  test('searchs upwards for a matching config', async () => {
    let configFile = await mod.findConfig('testdata/src/a/a')

    expect(configFile).toEqual(root('testdata/.projet.toml'))

    configFile = await mod.findConfig('./testdata/src/b/a')

    expect(configFile).toEqual(root('testdata/src/b/.projet.toml'))
  })
})

describe('.loadConfig', () => {
  test('decodes a TOML file to JSON', async () => {
    const config = await mod.loadConfig('.projet.toml')

    expect(config).toMatchObject({
      path: '.projet.toml',
      config: {
        rules: [
          expect.anything(),
          expect.anything(),
        ],
      },
    })
  })
})

describe('.assoc', () => {
  test('without a link name returns a match to the first link', async () => {
    const result = mod.assoc(config_i, 'src/index.ts')
    expect(result).toEqual('test/index.test.ts')
  })

  test('returns a file that satisfies the rule', async () => {
    const result = mod.assoc(config_i, 'src/index.ts', 'test')
    expect(result).toEqual('test/index.test.ts')
  })

  test('returns a path that relative to the config', async () => {
    const inst = { config, path: '/a/b/c/.projet.toml' }
    const result = mod.assoc(inst, '/a/b/c/src/index.ts', 'test')
    expect(result).toEqual('/a/b/c/test/index.test.ts')
  })
})

describe('.findMatch', () => {
  test('finds matching config entries', async () => {
    expect(mod.findMatch(config_i, 'src/index.ts')).toMatchObject({ category: 'lib' })

    expect(mod.findMatch(config_i, './src/index.ts')).toMatchObject({ category: 'lib' })

    expect(mod.findMatch(config_i, 'test/index.test.ts')).toMatchObject({ category: 'test' })
  })

  test('compares paths relative to the config file path', async () => {
    const config_ = { path: '/a/b/c/.projet.toml', config }

    expect(mod.findMatch(config_, '/a/b/c/src/index.ts'))
      .toMatchObject({ category: 'lib' })
  })
})

describe('.template', () => {
  test('glob captures are available as env like variables', async () => {
    const rule = { name: 'lib', pattern: 'src/**/*.ts', template: '{$0} {$1}' }
    const config = { path: './', config: { rules: [rule] } }

    expect(mod.template(config, 'src/foo/bar/baz.ts')).toEqual('foo/bar baz')
  })
})

describe('.list', () => {
  test("returns a list of paths with the base of the rule's pattern removed", async () => {
    const actual = mod.list(elixirConfig, 'lib')

    expect(actual).toEqual([
      'todo_mvc/application.ex',
      'todo_mvc/repo.ex',
      'todo_mvc/todos/todo.ex',
      'todo_mvc/todos.ex',
      'todo_mvc.ex',
      'todo_mvc_web/channels/user_socket.ex',
      'todo_mvc_web/controllers/page_controller.ex',
      'todo_mvc_web/controllers/todo_controller.ex',
      'todo_mvc_web/endpoint.ex',
      'todo_mvc_web/gettext.ex',
      'todo_mvc_web/router.ex',
      'todo_mvc_web/telemetry.ex',
      'todo_mvc_web/views/error_helpers.ex',
      'todo_mvc_web/views/error_view.ex',
      'todo_mvc_web/views/layout_view.ex',
      'todo_mvc_web/views/page_view.ex',
      'todo_mvc_web/views/todo_view.ex',
      'todo_mvc_web.ex',
    ])
  })
})

describe('getBasePath', () => {
  test('returns the base path of for the rule', async () => {
    const pattern = 'lib/**/*.ts'
    const actual = mod.getBasePath(pattern)
    expect(actual).toEqual('lib')
  })
})

// test.skip('returns a path by replacing the globs with the tokens', async () => {
//   // expect( mod.renderPath(config_i, './', 'lib', ['a/b/c', 'd.ts']) ).toEqual('src/a/b/c/d.ts')
//   const pattern = 'apps/*/lib/**/*.js'
//   const scaninfo = micromatch.scan(pattern)
//   require('util').log(scaninfo)
//   const { base } = scaninfo
//   const localpath = path.join(base, 'a/b/c/d.ts')
//   expect(localpath).toEqual('apps/a/b/c/d.ts')
// })

// test.skip('return matches in the cwd', async () => {
//   const obs = new ph.PerformanceObserver((list) => {
//     const entries: any = list.getEntries()
//     const dur = entries[0].duration
//     logger.info(dur)
//     // obs.disconnect()
//   })
//   // 1. Initial
//   // 462.292153 / 53398 = 0.008657

//   // 2. With matcher return
//   // 30 Jan 21:51:57 - 454.746907
//   // 30 Jan 21:51:57 - 395.094551
//   // 30 Jan 21:51:58 - 395.268168
//   // 30 Jan 21:51:58 - 410.138616
//   // 30 Jan 21:51:58 - 406.370451
//   obs.observe({ entryTypes: ['function'] })

//   // const list_ = ph.performance.timerify(mod.list)
//   const list_ = ph.performance.timerify(mod.list)

//   for (let index = 0; index < 1; index++)
//     require('util').log(list_(config_i, 'lib'))

//   const list = list_(config_i, 'lib')

//   // console.log(list.length, list.slice(0, 10))
// })
