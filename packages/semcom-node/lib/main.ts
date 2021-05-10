import * as path from 'path';
import { ComponentsManager } from 'componentsjs';
import { NodeHttpServer } from '@digita-ai/handlersjs-http';

const launch = async () => {

  const mainModulePath = path.join(__dirname, '../');
  const configPath = path.join(__dirname, '../config/config-default.json');

  const manager = await ComponentsManager.build({
    mainModulePath,
  });

  await manager.configRegistry.register(configPath);

  const server: NodeHttpServer = await manager.instantiate(
    'urn:semcom-node:default:NodeHttpServer',
  );

  server.start();

};

launch();
