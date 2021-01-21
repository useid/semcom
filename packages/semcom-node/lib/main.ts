import * as path from 'path';
import { ComponentsManager } from 'componentsjs';
import { LauncherService } from './launcher/services/launcher.service';

const start = async () => {
  const mainModulePath = path.join(__dirname, '../');
  const configPath = path.join(__dirname, '../config/config-default.json');

  const manager = await ComponentsManager.build({
    mainModulePath,
  });
  
  await manager.configRegistry.register(configPath);

  const launcher: LauncherService = await manager.instantiate(
    'urn:semcom-node:default:LauncherService',
  );

  launcher.launch();
};

start();
