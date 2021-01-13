import * as mod from './transforms'

// dot             / to .
// underscore      / to _
// backslash       / to \
// colons          / to ::
// hyphenate       _ to -
// blank           _ and - to space
// uppercase       uppercase
// camelcase       foo_bar/baz_quux to fooBar/bazQuux
// snakecase       FooBar/bazQuux to foo_bar/baz_quux
// capitalize      capitalize first letter and each letter after a slash
// dirname         remove last slash separated component
// basename        remove all but last slash separated component
// singular        singularize
// plural          pluralize
// file            absolute path to file
// project         absolute path to project
// open            literal {
// close           literal }
// nothing         empty string
// vim             no-op (include to specify other implementations should ignore)


test('transforms.capitalize/1', () => {
  expect(mod.transforms.capitalize('foo/bar/baz.ts')).toEqual('Foo/Bar/Baz.ts')
})

test('transforms.dot/1', () => {
  expect(mod.transforms.dot('foo/bar/baz.ts')).toEqual('foo.bar.baz.ts')
})

test('transforms.underscore/1', () => {
  expect(mod.transforms.underscore('foo/bar/baz.ts')).toEqual('foo_bar_baz.ts')
})

test('transforms.backslash/1', () => {
  expect(mod.transforms.backslash('foo/bar/baz.ts')).toEqual('foo\\bar\\baz.ts')
})

test('transforms.colons/1', () => {
  expect(mod.transforms.colons('foo/bar/baz.ts')).toEqual('foo::bar::baz.ts')
})

test('transforms.hyphenate/1', () => {
  expect(mod.transforms.hyphenate('foo_bar_baz.ts')).toEqual('foo-bar-baz.ts')
})

test('transforms.blank/1', () => {
  expect(mod.transforms.blank('foo_bar-baz.ts')).toEqual('foo bar baz.ts')
})

test('transforms.uppercase/1', () => {
  expect(mod.transforms.uppercase('foo/bar/baz.ts')).toEqual('FOO/BAR/BAZ.TS')
})

test('transforms.camelcase/1', () => {
  expect(mod.transforms.camelcase('foo_bar/baz_quux.ts')).toEqual('fooBar/bazQuux.ts')
})

test('transforms.lowercase/1', () => {
  expect(mod.transforms.lowercase('FOO/BAR/BAZ.ts')).toEqual('foo/bar/baz.ts')
})
