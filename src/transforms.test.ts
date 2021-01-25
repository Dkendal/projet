import * as mod from './transforms'

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

test('transforms.snakecase/1', () => {
  expect(mod.transforms.snakecase('FooBar/bazQuux foo-bar')).toEqual('foo_bar/baz_quux foo-bar')
})

test('transforms.dirname/1', () => {
  expect(mod.transforms.dirname('foo/bar/baz')).toEqual('foo/bar')
})

test('transforms.basename/1', () => {
  expect(mod.transforms.basename('foo/bar/baz.a.b.c')).toEqual('baz.a.b.c')
})

test('transforms.extname/1', () => {
  expect(mod.transforms.extname('foo/bar/baz.a.b.c')).toEqual('.c')
})

test('transforms.absolute/1', () => {
  expect(mod.transforms.absolute('package.json')).toMatch(/^\/.+\/package.json$/)
})

test('transforms.lowercase/1', () => {
  expect(mod.transforms.lowercase('FOO/BAR/BAZ.ts')).toEqual('foo/bar/baz.ts')
})

// TODO singular        singularize
// TODO plural          pluralize
//
// Add these as variables
//
// file            absolute path to file
// project         absolute path to project
// open            literal {
// close           literal }
// nothing         empty string
// vim             no-op (include to specify other implementations should ignore)
