import { ComponentMetadata } from '@digita-ai/semcom-core';
import { RegisterComponentService } from './register-component.service';

describe('RegisterComponentService', () => {

  let service: RegisterComponentService;

  const addedUris = new Set();

  beforeEach(() => {

    service = new RegisterComponentService();

  });

  afterEach(() => {

    jest.resetAllMocks();
    addedUris.clear();

  });

  const mockEvalAndDefine = () => {

    global.eval = jest.fn(async (url) => ({ 'default': {} }));
    customElements.define = jest.fn((tag, html) => { addedUris.add(tag); });
    customElements.get = jest.fn((tag) => addedUris.has(tag) ? {} as CustomElementConstructor : undefined);

  };

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

    const mockComponent = {
      uri: './../../mock/non-working-component.ts',
      tag: 'app-component-4',
    } as ComponentMetadata;

    await expect(service.register(mockComponent)).rejects.toThrow();

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

    mockEvalAndDefine();

    const mockComponent = {
      uri: 'https://www.google.com/test.js',
      tag: 'component',
    } as ComponentMetadata;

    const tag = await service.register(mockComponent);
    expect(tag.startsWith('semcom-component-')).toBe(true);

  });

  it('should eval and define a component', async () => {

    mockEvalAndDefine();

    const mockComponent = {
      uri: 'https://www.google.com/test.js',
      tag: 'component',
    } as ComponentMetadata;

    await service.register(mockComponent);
    expect(global.eval).toBeCalledTimes(1);
    expect(service.isRegistered(mockComponent)).toBeTruthy();

  });

  it('should not reimport an existing component if it was already defined', async () => {

    mockEvalAndDefine();

    const mockComponent = {
      uri: 'https://www.google.com/test.js',
      tag: 'component',
    } as ComponentMetadata;

    await service.register(mockComponent);
    await service.register(mockComponent);

    expect(global.eval).toBeCalledTimes(1);
    expect(customElements.define).toBeCalledTimes(1);

  });

  it('should only define a tag once, if two are imported at the same time', async () => {

    mockEvalAndDefine();

    const mockComponent = {
      uri: 'https://www.google.com/test.js',
      tag: 'component',
    } as ComponentMetadata;

    await Promise.all([ service.register(mockComponent), service.register(mockComponent) ]);
    expect(customElements.define).toBeCalledTimes(1);

  });

  it('should return different html tags for components with different tags', async () => {

    mockEvalAndDefine();

    const mockComponent = {
      uri: 'https://www.google.com/test.js',
      tag: 'component',
    } as ComponentMetadata;

    const mockComponent2 = {
      uri: 'https://www.google.com/test2.js',
      tag: 'component2',
    } as ComponentMetadata;

    const tag = await service.register(mockComponent);
    await expect(service.register(mockComponent2)).resolves.not.toBe(tag);

  });

  it('should return a different html Tag for components with the same tag but a different URI', async () => {

    mockEvalAndDefine();

    const mockComponent = {
      uri: 'https://www.google.com/test.js',
      tag: 'component',
    } as ComponentMetadata;

    const mockComponent2 = {
      uri: 'https://www.google.com/test2.js',
      tag: 'component',
    } as ComponentMetadata;

    const tag = await service.register(mockComponent);
    await expect(service.register(mockComponent2)).resolves.not.toBe(tag);

  });

  it('should return the same tag if a component is imported twice', async () => {

    mockEvalAndDefine();

    const mockComponent = {
      uri: 'https://www.google.com/test.js',
      tag: 'component',
    } as ComponentMetadata;

    const tag = await service.register(mockComponent);
    await expect(service.register(mockComponent)).resolves.toBe(tag);

  });

});
