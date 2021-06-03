import { ComponentMetadata } from './component-metadata.model';

describe('ComponentMetadata', () => {

  it('should be correctly instantiated', (() => {

    const service = new ComponentMetadata(
      'foo',
      'bar',
      'This is foo',
      'author of foo',
      'lorem',
      '0.0.1',
      false,
      [ 'https://digita.ai/voc/foo' ]
    );

    expect(service).toBeTruthy();

  }));

});
