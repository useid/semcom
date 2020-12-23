import { DefaultContext, DefaultState, ParameterizedContext } from 'koa';
import { ServerController } from '../../server/models/server-controller.model';
import { ServerRoute } from '../../server/models/server-route.model';

export class MetadataControllerService implements ServerController {
  routes: ServerRoute[] = [
    {
      path: '/metadata',
      method: 'get',
      execute: this.all,
    }
  ];

  public all(context: ParameterizedContext<DefaultState, DefaultContext>): void {
    context.body = 'Hello world';
    context.status = 200;
  }
}
