import { LDTriple } from './triple.model';

export interface Invite {
  holder: string;
  purpose: string;
  state: 'not linked' | 'linking' | 'linked';
  created: string;
  expires: string;
  uri: string;
  connection?: string;
  accepted?: string;
  shape?: string;
  exchange?: string;
  triples?: LDTriple[];
}
