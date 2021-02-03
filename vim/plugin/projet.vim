if exists('g:did_projet_loaded')
  finish

endif

if executable('node') ==# v:false
  echoerr "Can't find executable 'node' in path"
  finish
endif

let node_version = system('node -v')

let [str, maj, min, pat; rest] = matchlist(node_version, '\v(\d+)\.(\d+).(\d+)')

if str2nr(maj) < 12
  echoerr printf('Node version 12 or greater is required, got: %s', node_version)
  finish
endif

let g:did_projet_loaded = 1

noremap <silent> <plug>(ProjetLink) :ProjetLink<cr>
noremap <silent> <plug>(ProjetConfig) :ProjetConfig<cr>

if exists(':A') !=# 2
  command -nargs=? -complete=custom,ProjetLinkComplete A :ProjetLink <args>
endif
