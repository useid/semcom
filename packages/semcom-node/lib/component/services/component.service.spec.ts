import { ComponentMetadata, LoggerConsoleService } from '@useid/semcom-core';
import { ComponentInMemoryStore } from '../../store/services/component-in-memory-store.service';
import { initialComponents } from '../../mock/initial-components';
import { ComponentService } from './component.service';
import { ManageComponentStoreService } from './manage-component-store.service';
import { QueryComponentStoreService } from './query-component-store.service';

describe('ComponentService', () => {

  let compService: ComponentService;
  const components: ComponentMetadata[] = initialComponents;

  beforeEach(() => {

    const store = new ComponentInMemoryStore(initialComponents);

    compService = new ComponentService(
      new QueryComponentStoreService(store),
      new ManageComponentStoreService(store),
      new LoggerConsoleService(),
    );

  });

  it('should be correctly instantiated', () => {

    expect(compService).toBeTruthy();

  });

  describe('all()', () => {

    it('should return all components', async() => {

      const spy = jest.spyOn((compService as any).queryService, 'query');
      await expect(compService.all().toPromise()).resolves.toEqual(components);
      expect(spy).toHaveBeenCalledWith({});
      expect(spy).toHaveBeenCalledTimes(1);

    });

  });

  describe('query()', () => {

    it('should return filtered components', async() => {

      const spy = jest.spyOn((compService as any).queryService, 'query');
      const partial = { uri: components[0].uri };
      await expect(compService.query(partial).toPromise()).resolves.toEqual([ components[0] ]);
      expect(spy).toHaveBeenCalledWith(partial);
      expect(spy).toHaveBeenCalledTimes(1);

    });

  });

  describe('save()', () => {

    it('should save a component', async() => {

      const comp = {
        ...components[0],
        uri: 'newUri',
      };

      const spy = jest.spyOn((compService as any).manageService, 'save');
      await expect(compService.save(comp).toPromise()).resolves.toEqual([ comp ]);
      await expect(compService.all().toPromise()).resolves.toHaveLength(5);
      expect(spy).toHaveBeenCalledWith([ comp ]);
      expect(spy).toHaveBeenCalledTimes(1);

    });

  });

});
