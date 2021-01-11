import { assertEquals } from 'https://deno.land/std/testing/asserts.ts'
import * as index from "./index.ts";

Deno.test('loadConfig/1 loads a file in the current directory', async () => {
  await index.loadConfig("testdata/config.toml")
  assertEquals(1, 1)
})

Deno.test('does the thing', () => {
  assertEquals(1, 1)
})
