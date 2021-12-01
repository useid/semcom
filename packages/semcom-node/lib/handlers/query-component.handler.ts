import { HttpHandler, HttpHandlerContext, HttpHandlerResponse } from '@digita-ai/handlersjs-http';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComponentService } from '../component/services/component.service';

/**
 * A { HttpHandler } implementation that queries components from the component service
 * and returns them as a HTTPHandlerResponse.
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
   * Queries the components specified in the request body and returns them as a JSON type body in a HTTPHandlerResponse.
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
