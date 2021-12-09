import { Quad } from 'rdf-js';

/**
 * The possible data types SemCom components can read or write.
 */
export interface ComponentDataTypes {
  quads: Quad[];
  text: string;
  json: any;
  blob: Blob;
  uint8array: ReadableStream<Uint8Array>;
}
