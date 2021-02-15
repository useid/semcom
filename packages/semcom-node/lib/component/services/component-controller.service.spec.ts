import {
  ComponentMetadata,
  LoggerConsoleService,
  ManageComponentInMemoryService,
  QueryComponentInMemoryService,
} from '@digita-ai/semcom-core';
import { BaseComponentService } from './base-component.service';
import { ComponentControllerService } from './component-controller.service';
import { ServerRequest } from '../../server/models/server-request.model';
import { initialComponents } from '../../mock/initial-components';

describe('ComponentControllerService', () => {
  let controller: ComponentControllerService = null;
  const components: ComponentMetadata[] = initialComponents;

  beforeEach(() => {
    controller = new ComponentControllerService(
      new BaseComponentService(
        new QueryComponentInMemoryService(components),
        new ManageComponentInMemoryService(components),
      ),
      new LoggerConsoleService(),
    );
  });

  it('should be correctly instantiated', () => {
    expect(controller).toBeTruthy();
  });

  it('should return Hello World', async () => {
    const request: ServerRequest = {
      method: 'GET',
      headers: { accept: '*/*' },
    };

    const response = await controller.all(request);

    expect(response.status).toBe(200);
  });
});
