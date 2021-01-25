import * as path from 'path'
import type { Config } from './projet'
import * as mod from './projet'

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

describe('findConfig/1', () => {
  test('searchs upwards for a matching config', async () => {
    let configFile = await mod.findConfig('testdata/src/a/a')

    expect(configFile).toEqual(root('testdata/.projet.toml'))

    configFile = await mod.findConfig('./testdata/src/b/a')

    expect(configFile).toEqual(root('testdata/src/b/.projet.toml'))
  })
})

describe('loadConfig/1', () => {
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


describe('assoc/3', () => {
  test('without a link name returns a match to the first link', async () => {
    const result = mod.assoc(config_i, 'src/index.ts')
    expect(result).toEqual('test/index.test.ts')
  })

  test('returns a file that satisfies the rule', async () => {
    const result = mod.assoc(config_i, 'src/index.ts', 'test')
    expect(result).toEqual('test/index.test.ts')
  })

  test("returns a path that relative to the config", async () => {
    const inst = {config, path: '/a/b/c/.projet.toml'}
    const result = mod.assoc(inst, '/a/b/c/src/index.ts', 'test')
    expect(result).toEqual('/a/b/c/test/index.test.ts')
  })
})

describe('findMatch/2', () => {
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

describe('template/3', () => {
  test('glob captures are available as env like variables', async () => {
    const rule = { name: 'lib', pattern: 'src/**/*.ts', template: '{$0} {$1}' }
    const config = { path: './', config: { rules: [rule] } }

    expect(mod.template(config, 'src/foo/bar/baz.ts')).toEqual('foo/bar baz')
  })
})
