import { ICompileOptions, Scope } from 'micromustache'
import * as mustache from 'micromustache'
import * as path from 'path'
import { RuleMatch } from './projet'
import { isTransformer, transforms } from './transforms'

const br = '\n'

export function buildScope(match: RuleMatch, bindings: {}) {
  const entries = match.captures.map((value, idx) => [`$${idx}`, value])
  const star = path.join(...match.captures)

  const captures = Object.fromEntries(entries)
  const scope = Object.assign(bindings, captures)
  scope['$*'] = star
  return scope
}

function get(scope: Scope, pathExpr: string | string[]) {
  return mustache.get(scope, pathExpr, { propsExist: true })
}

class TransformNameError extends Error {
  constructor(transform: string) {
    super(
      `TransformNameError: "${transform}" is not a known transform.`
        + br
        + 'Available transforms: '
        + Object.keys(transforms).join(', '),
    )
  }
}

function pipeReducer(acc: string, transformName: string) {
  transformName = transformName.trim()

  if (!isTransformer(transformName)) throw new TransformNameError(transformName)

  return transforms[transformName](acc)
}

/**
 * Called by mustache with the contents of a tag, used to provide our own
 * grammar.
 */
export function exec(expr: string, scope: Scope = {}) {
  const [lhs, ...pipes] = expr.split('|')

  if (!lhs)
    throw new Error(`expected left hand side to reference one or more variables, like "{$0}"`)

  const values = lhs.trim().split(/\s+/).map(token => {
    const value = get(scope, token)

    if (typeof value !== 'string') {
      throw new TypeError(
        `expected "${token}" to be a string,
        got: ${JSON.stringify(value, null, 2)}`,
      )
    }

    return value
  })

  const value = path.join(...values)

  return pipes.reduce(pipeReducer, value)
}

/**
 * Render a mustache template.
 */
export function render(template: string, scope: {}): string {
  const opts: ICompileOptions = { tags: ['{', '}'], propsExist: true, validateVarNames: true }

  try {
    return path.normalize(mustache.renderFn(template, exec, scope, opts))
  } catch (e) {
    if (e instanceof ReferenceError) formatError(e, scope)
    throw e
  }
}

function formatError(e: ReferenceError, scope: {}) {
  const message = e.message
  const stack = e.stack

  const reraised = new ReferenceError(
    [
      message,
      br,
      `Available assigns: ${Object.keys(scope).join(', ')}`,
      br,
    ].join(''),
  )

  reraised.stack = stack?.split('\n').slice(2).join('\n')

  throw reraised
}
