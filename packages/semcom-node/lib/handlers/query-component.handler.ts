import { HttpHandler, HttpHandlerContext, HttpHandlerResponse } from '@digita-ai/handlersjs-http';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComponentService } from '../component/services/component.service';

export class QueryComponentHttpHandler extends HttpHandler {

  constructor(
    private components: ComponentService,
  ) {

    super();

  }

  handle(context: HttpHandlerContext): Observable<HttpHandlerResponse> {

    if (!context.request.body) {

      return throwError(new Error('body of the request should be set.'));

    }

    return this.components.query(context.request.body).pipe(
      map((result) => ({
        body: JSON.stringify(result),
        headers: {
          'content-type': 'application/json',
        },
        status: 200,
      })),
    );

  }

  canHandle(context: HttpHandlerContext): Observable<boolean> {

    if (context.request.method === 'POST') {

      return of(true);

    }

    return of(false);

  }

}
