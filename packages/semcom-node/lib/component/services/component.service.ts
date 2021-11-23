import { ComponentMetadata, LoggerService } from '@digita-ai/semcom-core';
import { Observable, from } from 'rxjs';
import { ManageComponentStoreService } from './manage-component-store.service';
import { QueryComponentStoreService } from './query-component-store.service';

/**
 * Service to manage the component store.
 */
export class ComponentService {

  /**
   * Creates a { ComponentService }.
   *
   * @param { QueryComponentStoreService } queryService - The service used to query components from the store.
   * @param { ManageComponentStoreService } manageService - The service used to manage components in the store.
   * @param { LoggerService } logger - Logger service used to log debug messages.
   */
  constructor(
    private queryService: QueryComponentStoreService,
    private manageService: ManageComponentStoreService,
    private logger: LoggerService,
  ) {}

  /**
   * Retrieves all components from the  store using the query service and returns its metadata.
   */
  all(): Observable<ComponentMetadata[]> {

    this.logger.log('debug', 'Getting all components');

    return from(this.queryService.query({}));

  }

  /**
   * Retrieves specific components from the store based on the query argument using the query service and returns its metadata.
   *
   * @param { any } query - The query used to filter components.
   */
  query(query: any): Observable<ComponentMetadata[]> {

    this.logger.log('debug', 'Getting filtered components', query);

    return from(this.queryService.query(query));

  }

  /**
   * Saves components in the store using the manage service based upon the provided body.
   *
   * @param { any } body - The body containing the components data to save.
   */
  save(body: any): Observable<any[]> {

    this.logger.log('debug', 'Saving components');

    return from(this.manageService.save([ body ]));

  }

}
