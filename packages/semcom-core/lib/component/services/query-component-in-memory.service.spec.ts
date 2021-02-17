import { ComponentMetadata } from '../models/component-metadata.model';
import { QueryComponentInMemoryService } from './query-component-in-memory.service';

describe('QueryComponentInMemoryService', () => {
  let service: QueryComponentInMemoryService;
  const components: ComponentMetadata[] = [
    new ComponentMetadata(
      'foo1/bar',
      'test1',
      'test1',
      'test1',
      'test1',
      false,
    ),
    new ComponentMetadata('foo2/bar', 'test2', 'test2', 'test2', 'test2', true),
    new ComponentMetadata(
      'foo3/bar',
      'test3',
      'test3',
      'test3',
      'test3',
      false,
    ),
    new ComponentMetadata('foo4/bar', 'test4', 'test4', 'test4', 'test4', true),
  ];

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
