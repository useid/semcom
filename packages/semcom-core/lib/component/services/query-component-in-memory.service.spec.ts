import { ComponentMetadata } from '../models/component-metadata.model';
import { QueryComponentInMemoryService } from './query-component-in-memory.service';
import { initialComponents } from './../../mock/initial-components';

describe('QueryComponentInMemoryService', () => {
  let service: QueryComponentInMemoryService;
  const components: ComponentMetadata[] = initialComponents;

  beforeEach(() => {
    service = new QueryComponentInMemoryService(components);
  });

  it('should be correctly instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should filter correct components when filled in', () => {
    const result = service.query({ uri: components[0].uri });
    expect(result).resolves.toEqual([components[0]]);
  });

  it('should filter all components when filter is not filled in', () => {
    const result = service.query({});
    expect(result).resolves.toEqual(components);
  });

  it('should filter no components', () => {
    const result = service.query({ uri: '' });
    expect(result).resolves.toEqual([]);
  });

  it('should filter all latest components', () => {
    const result = service.query({ latest: true });
    expect(result).resolves.toEqual([components[0], components[2]]);
  });
});
