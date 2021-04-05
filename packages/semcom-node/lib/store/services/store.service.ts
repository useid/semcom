export interface Store<T> {
  query(filter: Partial<T>): Promise<T[]>;
  all(): Promise<T[]>;
  get(uri: string): Promise<T[]>;
  save(components: T[]): Promise<T[]>;
}
