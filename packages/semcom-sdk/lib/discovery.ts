import * as N3 from 'n3';

/**
 * Discovers the shape of a resource, given its uri and a (custom) fetch function.
 *
 * @param uri the uri of the resource for which to discover shapes.
 * @param fetch a custom fetch function through which the resource (and its children) can be reached.
 * @returns the uris of the discovered shapes.
 */
export const resourceShape = (
  uri: string,
  customFetch?: (
    input: RequestInfo,
    init?: RequestInit
  ) => Promise<Response>,
): Promise<string[]> => {

  const myFetch = customFetch ? customFetch : fetch;

  const result = () => myFetch(uri, { method: 'GET' }).then(async (response) => {

    const parser = new N3.Parser();

    return response.text().then((body) => {

      const classes = new N3.Store(parser.parse(body)).getQuads(null, N3.DataFactory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), null, null).map((quad) => quad.object.value);

      return classes;

    });

  });

  return uri ? result() : Promise.reject('invalid uri');

};
