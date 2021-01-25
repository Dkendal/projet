#!/bin/sh
exec >&2

redo-ifchange all
redo-ifchange rplugin/node/projet-vim.js

export NVIM_RPLUGIN_MANIFEST=tmp/rplugin.vim

nvim -V1 --headless -u vroom/test_helper.vim -es -c UpdateRemotePlugins

vroom -v --neovim -u vroom/test_helper.vim \
  --message-strictness STRICT \
  --system-strictness STRICT \
  --crawl vroom
