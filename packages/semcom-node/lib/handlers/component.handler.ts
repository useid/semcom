import { HttpHandler, HttpHandlerContext, HttpHandlerResponse } from '@digita-ai/handlersjs-http';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComponentService } from '../component/services/component.service';

export class ComponentHttpHandler extends HttpHandler {

  constructor(
    private components: ComponentService,
  ) {
    super();
  }

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

      return this.components.save(JSON.parse(context.request.body)).pipe(
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

  canHandle(context: HttpHandlerContext): Observable<boolean> {
    if ([ 'GET', 'POST' ].includes(context.request.method)) {
      return of(true);
    }
    return of(false);
  }
}
