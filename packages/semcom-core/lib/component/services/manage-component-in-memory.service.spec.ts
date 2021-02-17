import { ComponentMetadata } from '../models/component-metadata.model';
import { ManageComponentInMemoryService } from './manage-component-in-memory.service';

describe('ManageComponentInMemoryService', () => {
  let service: ManageComponentInMemoryService;
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
    service = new ManageComponentInMemoryService(components);
  });

  it('should be correctly instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should save correct component', () => {
    const service = new ManageComponentInMemoryService(components);
    const mockComponent = new ComponentMetadata(
      'foo4/bar',
      'test4',
      'test4',
      'test4',
      'test4',
      true,
    );
    const result = service.save([mockComponent]);
    expect(result).resolves.toContain(mockComponent);
  });
});
