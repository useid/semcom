import * as Koa from 'koa';
import * as Router from '@koa/router';
import { Server } from 'http';
import { ServerOptions } from '../models/server-options.model';
import { ServerService } from './server.service';

export class ServerKoaService extends ServerService {
  public app: Koa = new Koa();
  public router: Router = new Router();
  public server: Server = null;

  public async start(options: ServerOptions): Promise<void> {

    options.controllers
      .map(controller => controller.routes)
      .reduce((acc, val) => acc.concat(val), [])
      .forEach(route => this.router.register(route.path, [route.method], route.execute));

    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());

    const port = options?.port || 3000;
    this.server = this.app.listen(port);
    console.log('started');
  }
}
