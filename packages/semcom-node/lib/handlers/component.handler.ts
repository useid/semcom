import { HttpHandler, HttpHandlerContext, HttpHandlerResponse } from '@useid/handlersjs-http';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComponentService } from '../component/services/component.service';

/**
 * A { HttpHandler } that retrieves or stores components based on the request.
 */
export class ComponentHttpHandler extends HttpHandler {

  /**
   * Creates a { ComponentHttpHandler }.
   *
   * @param { ComponentService } components - The component service used to manage and query components.
   */
  constructor(
    private components: ComponentService,
  ) {

    super();

  }

  /**
   * Returns or saves components based on the request.
   *
   * @param { HttpHandlerContext } context - The context of the http request.
   */
  handle(context: HttpHandlerContext): Observable<HttpHandlerResponse> {

    if (context.request.method === 'GET') {

      return this.components.all().pipe(
        map((components) => ({
          body: JSON.stringify(components),
          headers: {
            'content-type': 'application/json',
          },
          status: 200,
        })),
      );

    } else {

      if (context.request.headers['content-type'] !== 'application/json') {

        return of({
          body: 'Header \'Content-Type\' should be \'application/json\'.',
          headers: {},
          status: 400,
        });

      }

      if (!context.request.body) {

        return throwError(new Error('body of the request cannot be null or undefined.'));

      }

      return this.components.save(context.request.body).pipe(
        map((result) => ({
          response: {
            body: JSON.stringify(result),
            headers: {
              'content-type': 'application/json',
            },
            status: 201,
          },
          result,
        })),
        map((data) => {

          if (data.result.length > 1) {

            data.response.headers = Object.assign(
              data.response.headers,
              { location: data.result[0].uri },
            );

          }

          return data.response;

        }),
      );

    }

  }

  /**
   * Confirms if the handler can handle the request.
   *
   * @param { HttpHandlerContext } context - The context of the http request.
   * @returns Boolean confirming if the
   */
  canHandle(context: HttpHandlerContext): Observable<boolean> {

    if ([ 'GET', 'POST' ].includes(context.request.method)) {

      return of(true);

    }

    return of(false);

  }

}
