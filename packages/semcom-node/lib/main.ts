import * as path from 'path';
import { LauncherService } from './launcher/services/launcher.service';
import { Loader } from 'componentsjs';

const start = async () => {
    const mainModulePath = path.join(__dirname, '../');
    console.log('mainModulePath', mainModulePath);
    const loader = new Loader({
        mainModulePath
    });

    await loader.registerAvailableModuleResources();
    
    const configPath = path.join(__dirname, '../config/config-default.json');
    const launcher: LauncherService = await loader.instantiateFromUrl('urn:semcom-node:default:LauncherService', configPath);

    launcher.launch();
}

start();
