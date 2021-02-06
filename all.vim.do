#!/bin/sh
exec >&2
PATH=../node_modules/.bin:$PATH

# shellcheck disable=SC2046
redo-ifchange $(find src)

esbuild src/vim/projet-vim.ts \
  --define:ENV="'dev'" \
  --platform=node \
  --target=node12 \
  --bundle \
  --summary \
  --sourcemap=inline \
  --outfile="vim/rplugin/node/projet-vim.js"
