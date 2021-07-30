import { Quad } from 'n3';
import { default as streamify } from 'streamify-array';
import { LoggerService } from '@digita-ai/semcom-core';
import serialize from 'rdf-serialize';

/**
 * Service for serializing types to different forms of linked data
 */
export class QuadSerializationService {

  constructor(
    private logger: LoggerService,
  ) { }

  /**
   * Converts quads to linked data (turtle, ld+json, rdf, ...)
   *
   * @param quads The quads to convert
   * @param contentType The content type to convert to
   */
  serialize(quads: Quad[], contentType: string): NodeJS.ReadableStream {

    this.logger.log('debug', 'serializing components', { quads, contentType });
    const parseStream = streamify(quads);

    return serialize.serialize(parseStream, { contentType });

  }

}
