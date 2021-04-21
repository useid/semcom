import { ComponentInMemoryStore } from './component-in-memory-store.service';
import { ComponentMetadata } from '@digita-ai/semcom-core';
import { initialComponents } from './../../mock/initial-components';

describe('ComponentInMemoryStoreService', () => {
  let service: ComponentInMemoryStore;
  const components: ComponentMetadata[] = initialComponents;

  beforeEach(() => {
    service = new ComponentInMemoryStore(components);
  });

  it('should be correctly instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should save correct component', () => {
    const mockComponent = {
      uri: 'foo5/bar',
      description: 'test5',
      label: 'test5',
      author: 'test5',
      version: 'test5',
      latest: true,
    } as ComponentMetadata;
    const result = service.save([mockComponent]);
    expect(result).resolves.toContain(mockComponent);
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
    expect(result).resolves.toEqual([components[1], components[3]]);
  });
});
