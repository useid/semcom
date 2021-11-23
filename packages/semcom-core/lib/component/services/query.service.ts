/**
 * Interface representing a query service.
 */
export interface QueryService<T> {
  query(filter: Partial<T>): Promise<T[]>;
}
