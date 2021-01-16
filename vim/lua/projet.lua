local M = {}

local api = vim.api
local ex = api.nvim_command

ex(':echomsg "hello world from lua"')

function M.assoc()
end

return M
