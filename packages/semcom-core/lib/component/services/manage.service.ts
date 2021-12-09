/**
 * A service to manage and save components.
 */
export interface ManageService<T> {
  save(components: T[]): Promise<T[]>;
}
