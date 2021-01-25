export NVIM_RPLUGIN_MANIFEST = ./vroom/rplugin.vim
.PHONY:
test:
	vroom -v --neovim -u vroom/test_helper.vim \
		--message-strictness STRICT \
		--system-strictness STRICT \
		--crawl vroom

.PHONY:
test.watch:
	fd | entr -c make test.vim
