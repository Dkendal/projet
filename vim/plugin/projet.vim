if exists('g:did_projet_loaded')
  finish
endif

noremap <unique> <silent> <plug>(ProjetLink) :ProjetLink<cr>
noremap <unique> <silent> <plug>(ProjetConfig) :ProjetConfig<cr>

" if !exists(':A')
"   command -args=? -complete=custom,ProjetLinkComplete A :ProjetLink <args><cr>
" endif
