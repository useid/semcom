import * as Koa from 'koa';
import * as Router from '@koa/router';
import { MetadataController } from '../../controllers/metadata.controller';
import { Server } from 'http';
import { ServerOptions } from '../models/server-options.model';

export class ServerService {
  public app: Koa = new Koa();
  public router: Router = new Router();
  public server: Server = null;

  constructor(private options?: ServerOptions) { }

  public start(): void {
    const metadata = new MetadataController();

    this.router.get('/metadata', metadata.all);

    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());

    const port = this.options?.port || 3000;
    this.server = this.app.listen(port);
  }
}
