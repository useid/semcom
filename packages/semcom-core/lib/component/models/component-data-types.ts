import { Quad } from 'rdf-js';

export interface ComponentDataTypes {
  quads: Quad[];
  string: string;
  json: any;
  blob: Blob;
  uint8array: ReadableStream<Uint8Array>;
}
