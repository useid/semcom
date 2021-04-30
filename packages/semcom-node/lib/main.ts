import { NodeHttpServer } from '@digita-ai/handlersjs-http';
import { defaultNodeHttpServer } from '../config-js/presets/server.js';

const launch = async () => {
  // const mainModulePath = path.join(__dirname, '../');
  // const configPath = path.join(__dirname, '../config/config-default.json');

  // const manager = await ComponentsManager.build({
  //   mainModulePath,
  // });

  // await manager.configRegistry.register(configPath);

  // const server: NodeHttpServer = await manager.instantiate(
  //   'urn:handlersjs-http:default:NodeHttpServer',
  // );

  const server: NodeHttpServer = defaultNodeHttpServer;

  server.start();
};

launch();
