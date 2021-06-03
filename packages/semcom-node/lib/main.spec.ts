import { ComponentsManager } from 'componentsjs';
import { createVariables, launch } from './main';

describe('launch', () => {

  afterEach(() => {

    jest.clearAllMocks();

  });

  it('should call ComponentManager.build', async () => {

    const buildSpy = jest.spyOn(ComponentsManager, 'build');

    await launch(createVariables([ ]));

    expect(buildSpy).toHaveBeenCalled();

  });

});

describe('createVariables', () => {

  it('should create default variables when no arguments are given', (() => {

    const variables = createVariables([ ]);

    expect(variables).toEqual({
      'urn:semcom-node:variables:customConfigPath': undefined,
      'urn:semcom-node:variables:mainModulePath': undefined,
      'urn:semcom-node:variables:schema': undefined,
      'urn:semcom-node:variables:host': 'localhost',
      'urn:semcom-node:variables:port': '3000',
    });

  }));

  it('should create variables based on given arguments', (() => {

    const variables = createVariables([
      'bin',
      'bin',
      '-c',
      'bla',
    ]);

    expect(variables).toEqual({
      'urn:semcom-node:variables:customConfigPath': 'bla',
      'urn:semcom-node:variables:mainModulePath': undefined,
      'urn:semcom-node:variables:schema': undefined,
      'urn:semcom-node:variables:host': 'localhost',
      'urn:semcom-node:variables:port': '3000',
    });

  }));

});
