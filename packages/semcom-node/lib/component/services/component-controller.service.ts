import { ComponentService, LoggerService } from '@digita-ai/semcom-core';
import { DefaultContext, DefaultState, ParameterizedContext } from 'koa';
import { ServerController } from '../../server/models/server-controller.model';
import { ServerRoute } from '../../server/models/server-route.model';

export class ComponentControllerService implements ServerController {
  routes: ServerRoute[] = [
    {
      path: '/component',
      method: 'get',
      execute: (ctx) => this.all(ctx),
    }
  ];

  constructor(private components: ComponentService, private logger: LoggerService) { }

  public async all(context: ParameterizedContext<DefaultState, DefaultContext>): Promise<void> {
    this.logger.log('debug', 'Getting all components', context);
    
    const components = await this.components.all();
    
    this.logger.log('debug', 'Retrieved all components', components);

    context.body = components;
    context.status = 200;
  }
}
