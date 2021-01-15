import { ServerRoute } from './server-route.model';

export abstract class ServerController {
    constructor(public routes: ServerRoute[]) { }
}
