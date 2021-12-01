/**
 * Represents a service to manage and safe components.
 */
export interface ManageService<T> {
  save(components: T[]): Promise<T[]>;
}
