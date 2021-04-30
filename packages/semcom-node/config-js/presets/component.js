import { QueryComponentStoreService, ManageComponentStoreService, ComponentService, ComponentTransformerService } from '../../dist/public-api.js';
import { defaultLoggerService } from './logger.js';
import { defaultComponentStore } from './store.js';

export const defaultQueryComponentService = new QueryComponentStoreService(defaultComponentStore);

export const defaultManageComponentService = new ManageComponentStoreService(defaultComponentStore);

export const defaultComponentService = new ComponentService(
  defaultQueryComponentService,
  defaultManageComponentService,
  defaultLoggerService,
);

export const defaultComponentTransformerService = new ComponentTransformerService(defaultLoggerService);
