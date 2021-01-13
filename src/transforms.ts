const replaceForwardSlash = (replacement: string) => (source: string) =>
  source.replace(/\//g, replacement)

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
  camelcase: (s: string) =>
    s.replace(/[_-](.)/g, (_, _1: string) => _1.toUpperCase()),
  capitalize: (s: string) =>
    s.replace(/(?<=^|\/)(.)/g, (_, _1: string) => _1.toUpperCase()),
}

export type TransformerName = keyof typeof transforms

export const isTransformer = (s: string): s is TransformerName =>
  s in transforms
