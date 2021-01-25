filetype off
set cmdheight=99

let &runtimepath .= ',' . expand('<sfile>:h:h')
set nobackup
set noswapfile

filetype plugin indent on
syntax enable
