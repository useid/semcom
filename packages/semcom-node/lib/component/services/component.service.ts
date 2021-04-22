import { ComponentMetadata, LoggerService } from '@digita-ai/semcom-core';
import { Observable, from } from 'rxjs';
import { ManageComponentStoreService } from './manage-component-store.service';
import { QueryComponentStoreService } from './query-component-store.service';

export class ComponentService {

  constructor(
    private queryService: QueryComponentStoreService,
    private manageService: ManageComponentStoreService,
    private logger: LoggerService,
  ) {}

  public all(): Observable<ComponentMetadata[]> {
    this.logger.log('debug', 'Getting all components');
    return from(this.queryService.query({}));
  }

  public query(query: any): Observable<ComponentMetadata[]> {
    this.logger.log('debug', 'Getting filtered components', query);
    return from(this.queryService.query(query));
  }

  public save(body: any): Observable<any[]> {
    this.logger.log('debug', 'Saving components');
    return from(this.manageService.save([body]));
  }
}
