import * as index from './index'

test('loadConfig/1 loads a file in the current directory', async () => {
  const config = await index.loadConfig('testdata/config.toml')

  expect(config).toEqual({
    lib: {
      pattern: '**/*.ts',
      relationships: {
        test: '{}_test.ts',
      },
      template: `export default function helloworld() {
  return \"helloworld\"
}`,
    },
  })
})
