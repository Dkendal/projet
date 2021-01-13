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
          test: '{0}/{1}.test.ts',
        },
      },
    }

    expect(mod.assoc(config, 'test', 'src/index.ts')).toEqual(
      'src/index.test.ts',
    )
  })
})
