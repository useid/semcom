import { ComponentMetadata, LoggerService } from '@digita-ai/semcom-core';
import { BaseComponentService } from './base-component.service';
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
      path: '/component/save',
      method: 'post',
      execute: (request) => this.save(request),
    },
  ];

  constructor(
    private components: BaseComponentService,
    private logger: LoggerService,
  ) {}

  public async all(request: ServerRequest): Promise<ServerResponse> {
    this.logger.log('debug', 'Getting filtered components', request);

    let res = null;

    const components = await this.components.query();

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

  public async query(request: ServerRequest): Promise<ServerResponse> {
    this.logger.log('debug', 'Getting all components', request);

    let res = null;

    const components = await this.components.query(request.body);

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

  public async save(request: ServerRequest): Promise<ServerResponse> {
    this.logger.log('debug', 'Saving components', request);

    let res = null;

    const data: ComponentMetadata[] = request.body.map(
      (component: ComponentMetadata) =>
        new ComponentMetadata(
          component.uri,
          component.label,
          component.description,
          component.author,
          component.version,
          component.latest,
        ),
    );

    const components = await this.components.save(data);

    this.logger.log('debug', 'Saved components', components);

    res = {
      body: components,
      headers: {
        'content-type': 'application/json',
      },
      status: 200,
    };

    return res;
  }
}
