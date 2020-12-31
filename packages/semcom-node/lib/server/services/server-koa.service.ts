import * as Koa from 'koa';
import * as Router from '@koa/router';
import { DefaultContext, DefaultState, ParameterizedContext } from 'koa';
import { LoggerService } from '@digita-ai/semcom-core';
import { Server } from 'http';
import { ServerHandlerService } from './server-handler.service';
import { ServerOptions } from '../models/server-options.model';
import { ServerRequest } from '../models/server-request.model';
import { ServerResponse } from '../models/server-response.model';
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

    if (!options) {
      throw new Error('Attribute options should be set');
    }

    const routes = options.controllers
      .map(controller => controller.routes)
      .reduce((acc, val) => acc.concat(val), []);

    this.logger.log('debug', 'Determined routes', routes);

    routes.forEach(route => this.router.register(route.path, [route.method], (ctx) => this.executeAndTransform(route, ctx, options.handlers)));

    this.logger.log('debug', 'Registered controllers');

    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());

    const port = options?.port || 3000;
    this.server = this.app.listen(port);

    this.logger.log('debug', `Server listening on port ${port}`);
  }

  private async executeHandlers(handlers: ServerHandlerService[], request: ServerRequest, response: ServerResponse): Promise<ServerResponse> {
    if (!handlers) {
      throw new Error('Argument handlers should be set.');
    }

    if (!request) {
      throw new Error('Argument request should be set.');
    }

    if (!response) {
      throw new Error('Argument response should be set.');
    }

    let handledResponse = { ...response };

    handlers.forEach(async (handler) => {
      handledResponse = await this.executeHandler(handler, request, response);
    })

    return handledResponse;
  }

  private async executeHandler(handler: ServerHandlerService, request: ServerRequest, response: ServerResponse): Promise<ServerResponse> {
    if (!handler) {
      throw new Error('Argument handler should be set.');
    }

    if (!request) {
      throw new Error('Argument request should be set.');
    }

    if (!response) {
      throw new Error('Argument response should be set.');
    }

    let handledResponse: ServerResponse = { ...response };

    const canHandle = await handler.canHandle(request, response);

    if (canHandle) {
      handledResponse = await handler.handle(request, response);
    }

    return handledResponse;
  }

  private async executeAndTransform(route: ServerRoute, ctx: ParameterizedContext<DefaultState, DefaultContext>, handlers: ServerHandlerService[]): Promise<void> {
    if (!route) {
      throw new Error('Attribute route should be set');
    }

    if (!ctx) {
      throw new Error('Attribute ctx should be set');
    }

    const request = this.generateRequest(ctx);
    const originalResponse = await route.execute(request);
    const handledResponse = await this.executeHandlers(handlers, request, originalResponse);

    ctx.body = handledResponse.body;
    ctx.status = handledResponse.status;
  }

  private generateRequest(ctx: ParameterizedContext<DefaultState, DefaultContext>): ServerRequest {
    if (!ctx) {
      throw new Error('Argument ctx should be set.');
    }

    return { method: ctx.req.method, headers: ctx.req.headers as { [key: string]: string } };
  }
}
