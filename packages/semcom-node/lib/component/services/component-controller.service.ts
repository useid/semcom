import { LoggerService } from '@digita-ai/semcom-core';
import { ManageComponentStoreService } from './manage-component-store.service';
import { QueryComponentStoreService } from './query-component-store.service';
import { ServerBadRequestError } from '../../server/models/server-bad-request-error.model';
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
    },
    {
      path: '/component/query',
      method: 'post',
      execute: (request) => this.query(request),
    },
    {
      path: '/component',
      method: 'post',
      execute: (request) => this.save(request),
    },
  ];

  constructor(private queryService: QueryComponentStoreService, private manageService: ManageComponentStoreService, private logger: LoggerService) {}

  public async all(request: ServerRequest): Promise<ServerResponse> {
    this.logger.log('debug', 'Getting all components', request);

    let res = null;

    const components = await this.queryService.query({});

    this.logger.log('debug', 'Retrieved all components', components);

    res = {
      body: components,
      headers: {
        'content-type': 'application/json',
      },
      status: 200,
    };

    return res;
  }

  public async query(request: ServerRequest): Promise<ServerResponse> {
    this.logger.log('debug', 'Getting filtered components', request);

    let res = null;

    const components = await this.queryService.query(request.body);

    this.logger.log('debug', 'Retrieved filtered components', components);

    res = {
      body: components,
      headers: {
        'content-type': 'application/json',
      },
      status: 200,
    };

    return res;
  }

  public async save(request: ServerRequest): Promise<ServerResponse> {
    this.logger.log('debug', 'Saving components', request);

    let res: ServerResponse = null;

    const contentType = request.headers['content-type'];

    if (contentType !== 'application/json') {
      throw new ServerBadRequestError('Content type is not supported.');
    }

    const components = await this.manageService.save([request.body]);

    this.logger.log('debug', 'Saved components', components);

    res = {
      body: components,
      headers: {
        'content-type': 'application/json',
      },
      status: 201,
    };

    if (components.length === 1) {
      this.logger.log('debug', 'Setting location', components);
      const component = components[0];

      res.headers['Location'] = component.uri;
    }

    return res;
  }
}
