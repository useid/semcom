import { ComponentMetadata } from '../models/component-metadata.model';
import { ManageComponentInMemoryService } from './manage-component-in-memory.service';
import { initialComponents } from './../../mock/initial-components';

describe('ManageComponentInMemoryService', () => {
  let service: ManageComponentInMemoryService;
  const components: ComponentMetadata[] = initialComponents;

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
      description: 'test4',
      label: 'test4',
      author: 'test4',
      version: 'test4',
      latest: true,
    } as ComponentMetadata;
    const result = service.save([mockComponent]);
    expect(result).resolves.toContain(mockComponent);
  });
});
