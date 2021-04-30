import { QuadSerializationService } from '../../dist/public-api.js';
import { defaultLoggerService } from './logger.js';

export const defaultQuadSerializationService = new QuadSerializationService(defaultLoggerService);
