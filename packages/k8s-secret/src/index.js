const k8s = require('@kubernetes/client-node');
const { pathOr } = require('ramda');
const { createLogger, format, transports } = require('winston');
const fs = require('fs');

const namespace = process.argv[4] || 'default'
const filename = process.argv[3] || '.env'

try {
  if (fs.existsSync(filename))
      fs.unlinkSync(filename)
} catch(err) {
    console.error(err)
}

const transport = new transports.File({ filename });

const formatter = format.printf((info) => {
  return info.message
});

const logger = createLogger({
  format: formatter,
  json: false,
  transports: [
    transport
  ],
});

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const getSecret = async name => {
  const response = await k8sApi.readNamespacedSecret(name, namespace);
  const data = pathOr(null, ['body', 'data'], response);

  if(!data) return {};

  return decodes(data)
}

const getConfigMap = async name => {
  const response = await k8sApi.readNamespacedConfigMap(name, namespace);
  const data = pathOr(null, ['body', 'data'], response);

  if(!data) return {};

  return data
}

const decodes = datas => Object.keys(datas)
  .reduce((acc, key) => ({ ...acc, [key]: decode(datas[key])}), {});

const decode = data => {
  let buff = new Buffer(data, 'base64');
  return buff.toString('ascii');
}

const toTypeName = configName => {
  const [type, name] = configName.split('/');
  return { type, name }
}

const getConfig = ({ type, name }) => {
  const handler = {
      'secret': getSecret,
      'configmap': getConfigMap,
  }

  return handler[type](name);
}

const loadKubeConfig = async (configToLoad = []) => {
  const configNames = configToLoad.map(toTypeName);
  const configs = await Promise.all(configNames.map(getConfig))
  const config =  configs.reduce((acc, config) => ({ ...acc, ...config }), {});
  Object.keys(config).map(key => logger.info(`${key}=${config[key]}`));
}

const configToLoad = process.argv[2] && process.argv[2] != "false" && process.argv[2].split(',') || [];

loadKubeConfig(configToLoad);