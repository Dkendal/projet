import * as toml from '@iarna/toml'
import {right} from 'fp-ts/lib/Either'
import * as mod from './config'

const config = `
[[rules]]
name="test"
pattern="src/**/*.test.ts"

[[rules.links]]
name="src"
pattern="src/{$1}.ts"

[[rules]]
name="lib"
pattern="src/**/*.ts"
template='''
export default function helloworld() {
  return "helloworld"
}
'''

[[rules.links]]
name="test"
pattern="src/{$1}.test.ts"
`

describe('decode/1', () => {
  test('decodes and validates a string into a configuration', async () => {
    const json = toml.parse(config)
    const result = mod.Config.decode(json)

    const expected = {
      'rules': [
        { 'name': 'test', 'pattern': 'src/**/*.test.ts', 'links': [{ 'name': 'src', 'pattern': 'src/{$1}.ts' }] },
        {
          'name': 'lib',
          'pattern': 'src/**/*.ts',
          'template': 'export default function helloworld() {\n  return "helloworld"\n}\n',
          'links': [{ 'name': 'test', 'pattern': 'src/{$1}.test.ts' }],
        },
      ],
    }

    expect(result).toEqual(right(expected))
  })
})
