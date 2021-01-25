import * as mod from './template'

describe('exec/2 evaluates the expression', () => {
  test('no-op', async () => {
    const actual = () => mod.exec('', {})

    expect(actual).toThrowErrorMatchingInlineSnapshot(
      `"expected left hand side to reference one or more variables, like \\"{$0}\\""`,
    )
  })

  test('variable binding', async () => {
    const actual = mod.exec('$0', { $0: 'foo' })
    expect(actual).toEqual('foo')
  })

  test('multiple variable path join', async () => {
    let actual: string

    actual = mod.exec('$0 $1', { $0: 'foo', $1: 'bar' })
    expect(actual).toEqual('foo/bar')

    actual = mod.exec('$0 $1', { $0: 'foo////', $1: '//bar' })
    expect(actual).toEqual('foo/bar')
  })

  test('transform pipes', async () => {
    const actual = mod.exec('$0 $1 | uppercase', { $0: 'foo', $1: 'bar' })
    expect(actual).toEqual('FOO/BAR')
  })
})

describe('render/3', () => {
  test('replaces named variables', async () => {
    expect(mod.render('{ foo }', { foo: 'bar' })).toEqual('bar')
    expect(mod.render('{ $0 }', { $0: 'bar' })).toEqual('bar')
  })

  test('pipes the lhs through the rhs transform', async () => {
    const actual = mod.render('{ $0 | capitalize | colons | hyphenate }', {
      $0: 'a_b/c_d/e_f/g',
    })

    expect(actual).toEqual('A-b::C-d::E-f::G')
  })

  test('multiple tokens on the lhs are joined by path separators', async () => {
    const actual = mod.render('{ $0 $1 }', { $0: 'a/b/c', $1: 'd.js' })

    expect(actual).toEqual('a/b/c/d.js')
  })
})
