
export enum LDTermType {
  LITERAL = 'literal',
  REFERENCE = 'uri',
}

export enum LDDataType {
  DATETIME = 'http://www.w3.org/2001/XMLSchema#dateTime',
  STRING = 'http://www.w3.org/2001/XMLSchema#string',
  DECIMAL = 'http://www.w3.org/2001/XMLSchema#decimal',
}

export interface LDNode {
  dataType?: LDDataType;
  termType: LDTermType;
  value: any;
}
