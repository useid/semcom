import * as path from 'path';
import { ComponentsManager } from 'componentsjs';
import { NodeHttpServer } from '@digita-ai/handlersjs-http';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Scheduler } from '@digita-ai/handlersjs-core';

/**
 * Instantiates a server from the passed configuration and starts it.
 *
 * @param {Record<string, any>} variables - a record of values for the variables left open in the configuration.
 */
export const launch: (variables: Record<string, any>) => Promise<void> = async (variables: Record<string, any>) => {

  const mainModulePath = variables['urn:semcom-node:variables:mainModulePath']
    ? path.join(process.cwd(), variables['urn:semcom-node:variables:mainModulePath'])
    : path.join(__dirname, '../');

  const configPath = variables['urn:semcom-node:variables:customConfigPath']
    ? path.join(process.cwd(), variables['urn:semcom-node:variables:customConfigPath'])
    : path.join(__dirname, '../config/config-default.json');

  const manager = await ComponentsManager.build({
    mainModulePath,
    logLevel: 'silly',
  });

  await manager.configRegistry.register(configPath);

  const server: NodeHttpServer = await manager.instantiate('urn:semcom-node:default:NodeHttpServer', { variables });
  const peerSyncScheduler: Scheduler  = await manager.instantiate('urn:semcom-node:default:PeerSyncScheduler', { variables });
  const storageSyncScheduler: Scheduler  = await manager.instantiate('urn:semcom-node:default:StorageSyncScheduler', { variables });
  const podSyncScheduler: Scheduler  = await manager.instantiate('urn:semcom-node:default:PodSyncScheduler', { variables });

  server.start();
  peerSyncScheduler.start();
  storageSyncScheduler.start();
  podSyncScheduler.start();

};

/**
 * Creates configuration variables from the passed cli arguments.
 *
 * @param { string[] } args - List of launch arguments passed to the cli.
 * @returns An object containing
 */
export const createVariables = (args: string[]): Record<string, any> => {

  const argv = yargs(hideBin(args))
    .usage('node ./dist/main.js [args]')
    .options({
      config: { type: 'string', alias: 'c' },
      port: { type: 'number', alias: 'p' },
      host: { type: 'string', alias: 'h' },
      schema: { type: 'string', alias: 's' },
      mainModulePath: { type: 'string', alias: 'm' },
    })
    .help().parseSync();

  return {
    'urn:semcom-node:variables:customConfigPath': argv.config,
    'urn:semcom-node:variables:mainModulePath': argv.mainModulePath,
    'urn:semcom-node:variables:schema': argv.schema,
    'urn:semcom-node:variables:host': argv.host ?? 'localhost',
    'urn:semcom-node:variables:port': argv.port ?? '3000',
  };

};
