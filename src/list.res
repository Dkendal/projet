type link = {
  name: string,
  pattern: string,
}

type rule = {
  name: string,
  pattern: string,
  template: option<string>,
  links: option<array<link>>,
}

type config = {rules: array<rule>}

type configInstance = {
  path: string,
  config: config,
}

@bs.module("path") external dirname: string => string = "dirname"
@bs.module("micromatch") external parse: string => {} => {} = "parse"
@bs.module("./projet") external findRule: (configInstance, string) => option<rule> = "findRule"

type acc = {
  depth: int
}

export list = (config, ruleName) => {
  let rules = config.config.rules
  let rule = findRule(config, ruleName)

  let walk = (path, acc) => {
    path
  }

  switch rule {
  | None => "no_rule"

  | Some(rule) =>
    let pattern = rule.pattern
    let root = dirname(config.path)


    // let a = micromatch.parse(pattern, {cwd: root})
    // let b = micromatch.scan(pattern, {cwd: root})
    walk(root, {depth: 0})
  }
}
