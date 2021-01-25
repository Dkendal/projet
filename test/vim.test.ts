import assert from 'assert'
import cp from 'child_process'
import fs from 'fs'
import * as nvim from 'neovim'
import path from 'path'

const vimrc = path.resolve('vim/test/vimrc')
const manifest = path.resolve('tmp/rplugin.vim')
let proc: cp.ChildProcessWithoutNullStreams
let api: nvim.NeovimClient

expect(fs.existsSync(vimrc)).toBe(true)

beforeEach(() => {
  proc = cp.spawn(
    'nvim',
    ['-u', vimrc, '-n', '--embed', '--headless'],
    {
      env: { ...process.env, NVIM_RPLUGIN_MANIFEST: manifest },
      cwd: process.cwd(),
    },
  )

  api = nvim.attach({ proc: proc })
})

afterEach(() => {
  api.quit()
})

test.skip('does something', async () => {
  // Check that the file was sourced
  expect(await api.eval("exists(':ProjetConfig')")).toBeGreaterThan(0)

  await api.command(':cd examples/elixir-phoenix')
  await api.command(':e test/todo_mvc/todos_test.exs')
  await api.command(':ProjetAssoc')
  console.log(await api.commandOutput(':messages'))
  console.log(await api.buffer.name)
})
