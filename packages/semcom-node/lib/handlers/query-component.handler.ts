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

    let parsedBody: string;

    try {

      parsedBody = JSON.parse(context.request.body);

    } catch (error) {

      return throwError(new Error('error while parsing request body.'));

    }

    return this.components.query(parsedBody).pipe(
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
