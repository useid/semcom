import { ContentNegotiationHttpHandler, ComponentHttpHandler, QueryComponentHttpHandler } from '../../dist/public-api.js';
import { defaultQuadSerializationService } from './serializer.js';
import { defaultLoggerService } from './logger.js';
import { defaultComponentTransformerService, defaultComponentService } from './component.js';

export const defaultComponentHttpHandler = new ComponentHttpHandler(
  defaultComponentService,
);

export const defaultQueryComponentHttpHandler = new QueryComponentHttpHandler(
  defaultComponentService,
);

export const defaultContentNegotiationHttpHandler = new ContentNegotiationHttpHandler(
  defaultLoggerService,
  'application/ld+json',
  defaultComponentTransformerService,
  defaultQuadSerializationService,
);

