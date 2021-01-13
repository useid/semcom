import * as Koa from 'koa';
import * as Router from '@koa/router';
import { LoggerService } from '@digita-ai/semcom-core';
import { Server } from 'http';
import { ServerOptions } from '../models/server-options.model';
import { ServerService } from './server.service';

export class ServerKoaService extends ServerService {
  public app: Koa = new Koa();
  public router: Router = new Router();
  public server: Server = null;

  constructor(private logger: LoggerService) {
    super();
  }

  public async start(options: ServerOptions): Promise<void> {
    this.logger.log('debug', 'Starting server');

    const routes = options.controllers
      .map(controller => controller.routes)
      .reduce((acc, val) => acc.concat(val), []);

    this.logger.log('debug', 'Determined routes', routes);

    routes.forEach(route => this.router.register(route.path, [route.method], route.execute));

    this.logger.log('debug', 'Registered controllers');

    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());

    const port = options?.port || 3000;
    this.server = this.app.listen(port);

    this.logger.log('debug', `Server listening on port ${port}`);
  }
}
