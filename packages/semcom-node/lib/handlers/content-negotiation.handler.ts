import { ComponentMetadata, LoggerService } from '@digita-ai/semcom-core';
import { HttpHandler, HttpHandlerContext, HttpHandlerResponse } from '@digita-ai/handlersjs-http';
import { Observable, Subject, from, of, throwError } from 'rxjs';
import { map, switchMap, tap, toArray } from 'rxjs/operators';
import serialize from 'rdf-serialize';
import { ComponentTransformerService } from '../component/services/component-transformer.service';
import { QuadSerializationService } from '../quad/services/quad-serialization.service';

export class ContentNegotiationHttpHandler extends HttpHandler {

  constructor(
    private logger: LoggerService,
    private defaultContentType: string,
    private transformer: ComponentTransformerService,
    private serializer: QuadSerializationService,
  ) {

    super();

  }

  canHandle(context: HttpHandlerContext): Observable<boolean> {

    this.logger.log('debug', 'Checking content negotiation handler', { context });

    return of(context.request.headers.accept !== 'application/json');

  }

  handle(context: HttpHandlerContext, response: HttpHandlerResponse): Observable<HttpHandlerResponse> {

    this.logger.log('debug', 'Running content negotiation handler', {
      context,
      response,
    });

    if (!context.request) {

      return throwError(new Error('Argument request should be set.'));

    }

    if (!response) {

      return throwError(new Error('Argument response should be set.'));

    }

    const request = context.request;

    const contentType =
      !request.headers.accept || request.headers.accept === '*/*'
        ? this.defaultContentType
        : request.headers.accept;

    return this.isContentTypeSupported(contentType).pipe(
      switchMap((isContentTypeSupported) => {

        if (isContentTypeSupported) {

          const components: ComponentMetadata[] = JSON.parse(response.body);

          const quads = this.transformer.toQuads(components);

          const resultStream = this.serializer.serialize(quads, contentType);

          this.logger.log('debug', 'Mapped to rdf', { request, response });

          const buffer = new Subject<any>();
          resultStream.on('data', (chunk) => buffer.next(chunk));
          resultStream.on('end', () => buffer.complete());

          return buffer.pipe(
            toArray(),
            map((chunks: string[]) => chunks.join('')),
            map((body) => ({
              ...response,
              body,
              headers: { ...response.headers, 'content-type': contentType },
            })),
          );

        } else {

          return of({
            ...response,
            status: 406,
            body: '',
          });

        }

      }),
    );

  }

  private isContentTypeSupported(contentType: string): Observable<boolean> {

    if (!contentType) {

      return throwError(new Error('Argument contentType should be set.'));

    }

    return from(serialize.getContentTypes()).pipe(
      tap((contentTypes) => {

        if (!contentTypes) {

          return throwError(new Error('contentTypes should be set.'));

        }

      }),
      map((contentTypes) => contentTypes.some((c) => c === contentType)),
    );

  }

}
