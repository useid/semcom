/**
 * Represents a store to query and save data.
 */
export interface Store<T> {
  query(filter: Partial<T>): Promise<T[]>;
  all(): Promise<T[]>;
  save(components: T[]): Promise<T[]>;
}
