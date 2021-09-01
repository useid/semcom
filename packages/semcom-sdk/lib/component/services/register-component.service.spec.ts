import { ComponentMetadata } from '@digita-ai/semcom-core';
import { RegisterComponentService } from './register-component.service';

describe('RegisterComponentService', () => {

  const testComponent = {
    uri: 'https://www.google.com/test.js',
    tag: 'component',
  } as ComponentMetadata;

  let testComponent2: ComponentMetadata;

  let service: RegisterComponentService;

  const addedUris = new Set();

  beforeEach(() => {

    service = new RegisterComponentService();

    testComponent2 = {
      uri: 'https://www.google.com/test2.js',
      tag: 'component2',
    } as ComponentMetadata;

    global.eval = jest.fn(async (url) => ({ 'default': {} }));
    customElements.define = jest.fn((tag, html) => { addedUris.add(tag); });
    customElements.get = jest.fn((tag) => addedUris.has(tag) ? {} as CustomElementConstructor : undefined);

  });

  afterEach(() => {

    addedUris.clear();

  });

  it('should be correctly instantiated', () => {

    expect(service).toBeTruthy();

  });

  // it('should import and define correctly', async () => {
  //   const mockComponent = {
  //     uri: './../../../tests/mock/component.ts',
  //     tag: 'app-component-1',
  //   } as ComponentMetadata;

  //   const tag = await service.register(mockComponent);
  //   const isRegisterd = await service.isRegistered(mockComponent);
  //   const element = customElements.get(tag);

  //   expect(element).toBeTruthy();
  //   expect(isRegisterd).toBeTruthy();
  //   expect(tag).toBe(mockComponent.tag);
  // });

  it('should throw error when componentMetadata is null or undefined,', async () => {

    await expect(service.register(undefined)).rejects.toThrow(
      'Invalid componentMetadata',
    );

  });

  it('should throw error when componentMetadata uri attribute is null or undefined', async () => {

    const mockComponent = {
      tag: 'app-component-2',
    } as ComponentMetadata;

    await expect(service.register(mockComponent)).rejects.toThrow(
      'Invalid componentMetadata',
    );

  });

  it('should throw error when componentMetadata tag attribute is null or undefined', async () => {

    const mockComponent = {
      uri: './../../mock/component.ts',
    } as ComponentMetadata;

    await expect(service.register(mockComponent)).rejects.toThrow(
      'Invalid componentMetadata',
    );

  });

  it('should throw error when componentMetadata.uri is not found', async () => {

    global.eval = jest.fn(async (url) => { throw new Error('Not found'); });

    const mockComponent = {
      uri: './../../mock/non-working-component.ts',
      tag: 'app-component-4',
    } as ComponentMetadata;

    await expect(service.register(mockComponent)).rejects.toThrow('Failed to import or register componentMetadata: Error: Not found');

  });

  it('should return false when componentMetadata.uri is not found', async () => {

    const mockComponent = {
      uri: './../../mock/non-working-component.ts',
      tag: 'app-component-4',
    } as ComponentMetadata;

    await expect(service.isRegistered(mockComponent)).resolves.toBeFalsy();

  });

  it('should throw error when componentMetadata is not set', async () => {

    const mockComponent = {
      tag: 'app-component-4',
    } as ComponentMetadata;

    await expect(service.isRegistered(mockComponent)).rejects.toThrow();

  });

  it('should generate a correct tag', async () => {

    const tag = await service.register(testComponent);
    expect(tag.startsWith('semcom-component-')).toBe(true);

  });

  it('should eval and define a component', async () => {

    await service.register(testComponent);
    expect(global.eval).toBeCalledTimes(1);
    expect(service.isRegistered(testComponent)).toBeTruthy();

  });

  it('should not reimport an existing component if it was already defined', async () => {

    await service.register(testComponent);
    await service.register(testComponent);

    expect(global.eval).toBeCalledTimes(1);
    expect(customElements.define).toBeCalledTimes(1);

  });

  it('should only define a tag once, if two are imported at the same time', async () => {

    await Promise.all([ service.register(testComponent), service.register(testComponent) ]);
    expect(customElements.define).toBeCalledTimes(1);

  });

  it('should return different html tags for components with different tags', async () => {

    const tag = await service.register(testComponent);
    await expect(service.register(testComponent2)).resolves.not.toBe(tag);

  });

  it('should return a different html Tag for components with the same tag but a different URI', async () => {

    testComponent2.tag = 'component';

    const tag = await service.register(testComponent);
    await expect(service.register(testComponent2)).resolves.not.toBe(tag);

  });

  it('should return the same tag if a component is imported twice', async () => {

    const tag = await service.register(testComponent);
    await expect(service.register(testComponent)).resolves.toBe(tag);

  });

});
