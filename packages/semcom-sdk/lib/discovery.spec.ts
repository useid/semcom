import { DataFactory, Quad_Object, Quad_Predicate, Quad_Subject } from 'n3';
import { resourceShapeFromQuads } from './discovery';

describe('resourceShapeFromQuads', () => {

  const quadPredicate = 'http://example.com/predicate';

  const quad = DataFactory.quad(
    DataFactory.namedNode('test') as Quad_Subject,
    DataFactory.namedNode(quadPredicate) as Quad_Predicate,
    DataFactory.namedNode('test') as Quad_Object
  );

  it('should discover shapes from a quad', () => {

    const shapes = resourceShapeFromQuads([ quad ]);
    expect(shapes).toContainEqual(quadPredicate);

  });

});
