#!/bin/sh
set -e

exec >&2

PATH=./node_modules/.bin:$PATH

esbuild src/esbuild-jest.ts \
  --platform=node --target=node12 \
  --format=cjs \
  --summary \
  --sourcemap=inline \
  --outfile=lib/esbuild-jest.js

redo-ifchange vim
# shellcheck disable=SC2046
redo-ifchange $(find src)

esbuild src/bin/projet.ts \
  --platform=node --target=node12 \
  --format=iife \
  --bundle \
  --summary \
  --outfile=bin/projet

chmod u+x bin/projet
