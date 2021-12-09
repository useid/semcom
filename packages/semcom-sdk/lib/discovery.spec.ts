import { DataFactory } from 'n3';
import { resourceShapeFromQuads } from './discovery';

describe('resourceShapeFromQuads', () => {

  const quadPredicate = 'http://example.com/predicate';

  const quad = DataFactory.quad(
    DataFactory.namedNode('test'),
    DataFactory.namedNode(quadPredicate),
    DataFactory.namedNode('test')
  );

  it('should discover shapes from a quad', () => {

    const shapes = resourceShapeFromQuads([ quad ]);
    expect(shapes).toContainEqual(quadPredicate);

  });

});
