import { ComponentMetadata } from '../../models/component-metadata.model';
import { QueryComponentInMemoryService } from './query-component-in-memory.service';

describe('QueryComponentInMemoryService', () => {
  let service: QueryComponentInMemoryService;
  const components: ComponentMetadata[] = [
    {
      uri: 'foo1/bar',
      label: 'test1',
      description: 'test1',
      author: 'test1',
      version: 'test1',
      latest: true,
    } as ComponentMetadata,
    {
      uri: 'foo2/bar',
      label: 'test2',
      description: 'test2',
      author: 'test2',
      version: 'test2',
      latest: false,
    } as ComponentMetadata,
    {
      uri: 'foo3/bar',
      label: 'test3',
      description: 'test3',
      author: 'test3',
      version: 'test3',
      latest: true,
    } as ComponentMetadata,
  ] as ComponentMetadata[];

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
