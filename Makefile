.PHONY:
test.vim:
	vroom -v --neovim -u NONE --message-strictness STRICT --system-strictness STRICT ./vim/vroom/projet.vroom

.PHONY:
test.vim.watch:
	fd | entr -c make test.vim
