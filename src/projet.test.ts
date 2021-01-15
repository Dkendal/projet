import type { Config } from './projet'
import * as mod from './projet'

describe('loadConfig/1', () => {
  test('decodes a TOML file to JSON', async () => {
    const config = await mod.loadConfig('testdata/config.toml')

    expect(config).toEqual({
      lib: {
        pattern: '**/*.ts',
        relationships: {
          test: '{}_test.ts',
        },
        template: `export default function helloworld() {
  return \"helloworld\"
}
`,
      },
    })
  })
})

describe('assoc/3', () => {
  test('supports replacement via globs', async () => {
    const config: Config = {
      lib: {
        pattern: '**/*.ts',
        relationships: {
          test: '{$0}/{$1}.test.ts',
        },
      },
    }

    expect(mod.assoc(config, 'test', 'src/index.ts')).toEqual(
      'src/index.test.ts',
    )
  })
})

describe('findMatch/2', () => {
  test('finds matching config entries', async () => {
    const config: Config = { lib: { pattern: '**/*.ts' } }
    const expected = {
      captures: ['src', 'index'],
      category: 'lib',
      config: { pattern: '**/*.ts' },
    }

    expect(mod.findMatch(config, 'src/index.ts')).toEqual(expected)
    expect(mod.findMatch(config, './src/index.ts')).toEqual(expected)
  })
})

describe('template/3', () => {
  test('glob captures are available as env like variables', async () => {
    const config: Config = {
      lib: {
        pattern: 'src/**/*.ts',
        template: '{$0} {$1}',
      },
    }

    expect(mod.template(config, 'src/foo/bar/baz.ts')).toEqual('foo/bar baz')
  })
})

describe('render/3', () => {
  test('does the thing', async () => {
    expect(mod.render('{ foo }', { foo: 'bar' })).toEqual('bar')
    expect(mod.render('{ $0 }', { $0: 'bar' })).toEqual('bar')
  })
})
