import { ComponentService, LoggerService } from '@digita-ai/semcom-core';
import { ServerController } from '../../server/models/server-controller.model';
import { ServerRequest } from '../../server/models/server-request.model';
import { ServerResponse } from '../../server/models/server-response.model';
import { ServerRoute } from '../../server/models/server-route.model';

export class ComponentControllerService implements ServerController {
  routes: ServerRoute[] = [
    {
      path: '/component',
      method: 'get',
      execute: (request) => this.all(request),
    }
  ];

  constructor(private components: ComponentService, private logger: LoggerService) { }

  public async all(request: ServerRequest): Promise<ServerResponse> {
    this.logger.log('debug', 'Getting all components', request);

    let res = null;

    const components = await this.components.all();

    this.logger.log('debug', 'Retrieved all components', components);

    res = {
      body: components,
      headers: {
        'content-type': 'application/json'
      },
      status: 200
    };

    return res;
  }
}
