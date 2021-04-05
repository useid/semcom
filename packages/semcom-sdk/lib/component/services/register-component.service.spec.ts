import { ComponentMetadata } from '@digita-ai/semcom-core';
import { RegisterComponentService } from './register-component.service';

describe('RegisterComponentService', () => {
  let service: RegisterComponentService;

  beforeEach(() => {
    service = new RegisterComponentService();
  });

  it('should be correctly instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should import and define correctly', async () => {
    const mockComponent = {
      uri: './../../mock/component.ts',
      tag: 'app-component-1',
    } as ComponentMetadata;

    const tag = await service.register(mockComponent);
    const isRegisterd = await service.isRegistered(mockComponent);
    const element = customElements.get(tag);

    expect(element).toBeTruthy();
    expect(isRegisterd).toBeTruthy();
    expect(tag).toBe(mockComponent.tag);
  });

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

  it('should throw error when componentMetadata.tag is invalid', async () => {
    const mockComponent = {
      uri: './../../mock/component.ts',
      tag: 'font-face',
    } as ComponentMetadata;
    await expect(service.register(mockComponent)).rejects.toThrow('Failed to register componentMetadata');
  });

  it('should throw error when componentMetadata.uri is not found', async () => {
    const mockComponent = {
      uri: './../../mock/non-working-component.ts',
      tag: 'app-component-4',
    } as ComponentMetadata;

    await expect(service.register(mockComponent)).rejects.toThrow();
  });

  it('should throw error when componentMetadata.uri is found, but does not contain Web Component', async () => {
    const mockComponent = {
      uri: './../../mock/not-a-component.ts',
      tag: 'app-component-5',
    } as ComponentMetadata;

    await expect(service.register(mockComponent)).rejects.toThrow('Failed to register componentMetadata');
  });
});
