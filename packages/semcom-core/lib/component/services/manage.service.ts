export interface ManageService<T> {
  save(resources: T[]): Promise<T[]>;
}
