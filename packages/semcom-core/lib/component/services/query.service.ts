/**
 * A service to query components.
 */
export interface QueryService<T> {
  query(filter: Partial<T>): Promise<T[]>;
}
