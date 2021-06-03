import { createVariables } from './main';

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
