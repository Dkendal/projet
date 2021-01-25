if exists('g:did_projet_loaded')
  finish
endif

noremap <unique> <silent> <plug>(ProjetLink) :ProjetLink<cr>
noremap <unique> <silent> <plug>(ProjetConfig) :ProjetConfig<cr>

if exists(':A') !=# 2
  command -nargs=? -complete=custom,ProjetLinkComplete A :ProjetLink <args>
endif
