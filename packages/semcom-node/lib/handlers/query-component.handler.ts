import { HttpHandler, HttpHandlerContext, HttpHandlerResponse } from '@useid/handlersjs-http';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComponentService } from '../component/services/component.service';

/**
 * A { HttpHandler } retrieving components based on a query.
 */
export class QueryComponentHttpHandler extends HttpHandler {

  /**
   * Creates a { QueryComponentHttpHandler }.
   *
   * @param { ComponentService } components - The component service used to manage and query components.
   */
  constructor(
    private components: ComponentService,
  ) {

    super();

  }

  /**
   * Retrieves components based on the query specified in the request,
   * and returns them as a JSON response.
   *
   * @param { HttpHandlerContext } context - The context of the request.
   */
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

  /**
   * Confirms if the handler can handle the request by checking the HTTP method.
   *
   * @param { HttpHandlerContext } context - The context of the http request.
   * @returns Boolean confirming if the handler can handle the request based on the HTTP method.
   */
  canHandle(context: HttpHandlerContext): Observable<boolean> {

    if (context.request.method === 'POST') {

      return of(true);

    }

    return of(false);

  }

}
