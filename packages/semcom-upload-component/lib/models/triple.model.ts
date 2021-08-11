import { LDNode } from './node.model';

export interface LDTriple {
  predicate: string;
  subject: LDNode;
  object: LDNode;
}
