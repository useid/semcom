import * as Koa from 'koa';
import * as Router from '@koa/router';
import { DefaultContext, DefaultState, ParameterizedContext } from 'koa';
import { LoggerService } from '@digita-ai/semcom-core';
import { Server } from 'http';
import { ServerOptions } from '../models/server-options.model';
import { ServerRequest } from '../models/server-request.model';
import { ServerRoute } from '../models/server-route.model';
import { ServerService } from './server.service';

export class ServerKoaService extends ServerService {
  public app: Koa = new Koa();
  public router: Router = new Router();
  public server: Server = null;

  constructor(private logger: LoggerService) {
    super();
  }

  public async start(options: ServerOptions): Promise<void> {
    this.logger.log('debug', 'Starting server with options', options);

    const routes = options.controllers
      .map(controller => controller.routes)
      .reduce((acc, val) => acc.concat(val), []);

    this.logger.log('debug', 'Determined routes', routes);

    routes.forEach(route => this.router.register(route.path, [route.method], (ctx) => this.executeAndTransform(route, ctx)));

    this.logger.log('debug', 'Registered controllers');

    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());

    const port = options?.port || 3000;
    this.server = this.app.listen(port);

    this.logger.log('debug', `Server listening on port ${port}`);
  }

  private async executeAndTransform(route: ServerRoute, ctx: ParameterizedContext<DefaultState, DefaultContext>): Promise<void> {
    // return async (context: ParameterizedContext<DefaultState, DefaultContext>) => {
    const request: ServerRequest = { method: ctx.req.method };
    const response = await route.execute(request);
    ctx.body = response.body;
    ctx.status = response.status;
    // }
  }
}
