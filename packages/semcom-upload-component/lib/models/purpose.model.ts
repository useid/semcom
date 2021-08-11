import { LDTriple } from './triple.model';

export interface Purpose {
  icon: string;
  description: string;
  predicates: string[];
  uri: string;
  label?: string;
  shape?: string;
  exchange?: string;
  triples?: LDTriple[];
}
