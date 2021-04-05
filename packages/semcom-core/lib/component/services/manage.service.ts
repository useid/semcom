export interface ManageService<T> {
  save(components: T[]): Promise<T[]>;
}
