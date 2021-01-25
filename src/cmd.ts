import * as projet from './projet'

export async function link(file: string, linkName?: string) {
  const config = await projet.getConfig(file)
  return projet.assoc(config, file, linkName)
}
