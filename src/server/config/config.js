import fs from 'fs'
import path from 'path'

const context = {}

const initPath = () => {
  if (process.env.NODE_ENV === 'production') {
    context.appPath = './'
  } else {
    context.appPath = './build/'
  }
}

const loadServerConfiguration = () => {
  const configPath = path.join(context.appPath, 'server.config.json')
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  if (!config) {
    throw new Error(`Could not find configuration file at path '${configPath}'`)
  }
  context.configuration = config
}

const loadCredentials = () => {
  const privateKey  = fs.readFileSync(path.join(context.appPath, 'certificates/localhost.key'), 'utf8')
  const certificate  = fs.readFileSync(path.join(context.appPath, 'certificates/localhost.cert'), 'utf8')

  context.credentials = {key: privateKey, cert: certificate};
}

export const loadContext = () => {
  initPath()
  loadServerConfiguration()
  loadCredentials()
  return context
}

export const getContext = () => context
