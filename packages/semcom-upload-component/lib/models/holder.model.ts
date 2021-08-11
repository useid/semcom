import { LDTriple } from './triple.model';

export interface Holder {
  uri: string;
  exchange?: string;
  triples?: LDTriple[];
  shape?: string;
}
