import { ComponentMetadata, LoggerConsoleService } from '@digita-ai/semcom-core';
import { ComponentControllerService } from './component-controller.service';
import { ComponentInMemoryStore } from '../../store/services/component-in-memory-store.service';
import { ManageComponentStoreService } from './manage-component-store.service';
import { QueryComponentStoreService } from './query-component-store.service';
import { ServerRequest } from '../../server/models/server-request.model';
import { initialComponents } from '../../mock/initial-components';

describe('ComponentControllerService', () => {
  let controller: ComponentControllerService = null;
  const components: ComponentMetadata[] = initialComponents;

  beforeEach(() => {
    const store = new ComponentInMemoryStore(components);

    controller = new ComponentControllerService(
      new QueryComponentStoreService(store),
      new ManageComponentStoreService(store),
      new LoggerConsoleService(),
    );
  });

  it('should be correctly instantiated', () => {
    expect(controller).toBeTruthy();
  });

  it('should return all components', async () => {
    const request: ServerRequest = {
      method: 'GET',
      headers: { accept: '*/*' },
    };

    const response = await controller.all(request);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(components);
  });

  it('should return filtered components', async () => {
    const request: ServerRequest = {
      method: 'POST',
      headers: { accept: '*/*' },
      body: { uri: components[0].uri },
    };

    const response = await controller.query(request);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([components[0]]);
  });
});
