import { LoggerConsoleService } from '@useid/semcom-core';
import { QuadSerializationService } from './quad-serialization.service';

describe('QuadSerializationService', () => {

  let quads: QuadSerializationService = null;

  beforeEach(() => {

    quads = new QuadSerializationService(new LoggerConsoleService());

  });

  it('should be correctly instantiated', (() => {

    expect(quads).toBeTruthy();

  }));

});
