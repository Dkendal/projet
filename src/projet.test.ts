import type { Config } from './projet'
import * as mod from './projet'

import mm from 'micromatch'

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
          test: '{0}/{1}.test.ts',
        },
      },
    }

    expect(mod.assoc(config, 'test', 'src/index.ts')).toEqual(
      'src/index.test.ts',
    )
  })
})

describe('template/3', () => {
  test.skip('renders a parameterized version of the template configured', async () => {
    const config: Config = {
      lib: {
        pattern: 'src/**/*.ts',
        template: '{0 1 | camelcase | capitalize | dot}',
      },
    }

    expect(mod.template(config, 'src/foo/bar/baz.ts')).toEqual('Foo.Bar.Baz')
    expect(mod.template(config, 'src/foo.ts')).toEqual('Foo')
  })
})

describe('render/3', () => {
  test('does the thing', async () => {
    expect(mod.render('{ foo }', { foo: 'bar' })).toEqual('bar')
    expect(mod.render('{ $0 }', { $0: 'bar' })).toEqual('bar')
  })
})
