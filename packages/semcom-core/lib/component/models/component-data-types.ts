import { Quad } from 'rdf-js';

/**
 * An interface representing the possible data types for components.
 */
export interface ComponentDataTypes {
  quads: Quad[];
  text: string;
  json: any;
  blob: Blob;
  uint8array: ReadableStream<Uint8Array>;
}
