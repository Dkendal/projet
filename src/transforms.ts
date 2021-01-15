import * as path from 'path'

const separatorPattern = new RegExp(path.sep, 'g')

const replaceForwardSlash = (replacement: string) => (source: string) =>
  source.replace(separatorPattern, replacement)

const replaceAll = (pattern: string, replacement: string) => (source: string) =>
  source.replace(new RegExp(pattern, 'g'), replacement)

export const transforms = {
  uppercase: (s: string) => s.toUpperCase(),

  lowercase: (s: string) => s.toLowerCase(),

  dot: replaceForwardSlash('.'),

  underscore: replaceForwardSlash('_'),

  backslash: replaceForwardSlash('\\'),

  colons: replaceForwardSlash('::'),

  hyphenate: replaceAll('_', '-'),

  blank: replaceAll('[_-]', ' '),

  camelcase: (s: string) => s.replace(/[_-](.)/g, (_, _1) => _1.toUpperCase()),

  capitalize: (s: string) =>
    s.replace(/(?<=^|\/)(.)/g, (_, _1) => _1.toUpperCase()),

  snakecase: (s: string) =>
    s
      .replace(/([A-Z]+)([A-Z][a-z])/g, (_, _1, _2) => `${_1}_${_2}`)
      .replace(/([a-z0-9])([A-Z])/g, (_, _1, _2) => `${_1}_${_2}`)
      .toLowerCase(),

  /**
   * Return the directory name of the path
   */
  dirname: path.dirname,

  /**
   * Return the last portion of the path
   */
  basename: path.basename,

  /**
   * Absolute path to file
   */
  absolute: path.resolve,

  /**
   * Return the file extension
   */
  extname: path.extname,
}

export type TransformerName = keyof typeof transforms

export const isTransformer = (s: string): s is TransformerName =>
  s in transforms
