import { LDTriple } from './triple.model';

export interface Source {
  icon: string;
  description: string;
  type: string;
  configuration: unknown;
  uri: string;
  state?: 'prepared' | 'not prepared';
  exchange?: string;
  triples?: LDTriple[];
  shape?: string;
}
