import { ComponentMetadata } from '../../models/component-metadata.model';
import { ManageComponentInMemoryService } from './manage-component-in-memory.service';

describe('ManageComponentInMemoryService', () => {
  let service: ManageComponentInMemoryService;
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
    service = new ManageComponentInMemoryService(components);
  });

  it('should be correctly instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should save correct component', () => {
    const service = new ManageComponentInMemoryService(components);
    const mockComponent = {
      uri: 'foo4/bar',
      label: 'test4',
      description: 'test4',
      author: 'test4',
      version: 'test4',
      latest: true,
    };
    const result = service.save([mockComponent]);
    expect(result).resolves.toContain(mockComponent);
  });
});
