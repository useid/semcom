import { Handler, TypedKeyValueStore } from '@digita-ai/handlersjs-core';
import { Parser } from 'n3';
import fetch from 'node-fetch';
import { from, Observable, of } from 'rxjs';

export class PodSyncService<S extends string, M extends { [s in S]: string[] }>
  extends Handler<void, void> {

  /**
   *
   * @param storage - key in which the storage is located
   * @param store - the given store
   * @param localPod - the URI of the local pod
   */
  constructor(
    private readonly storage: S,
    private readonly store: TypedKeyValueStore<M>,
    private readonly localPod: string,
  ) { super(); }

  canHandle(): Observable<boolean> {

    return of(true);

  }

  private async componentsInPod(uri: string): Promise<Set<string>> {

    try {

      const response = await fetch(uri, { headers: { 'Accept': 'text/turtle' } });
      const body = await response.text();

      return new Set(
        response.status === 200
          ? new Parser({ format: 'Turtle' }).parse(body)
            .filter((quad) => quad.object.value === 'http://www.w3.org/ns/ldp#Resource')
            .filter((quad) => quad.subject.value !== '')
            .map((quad) => quad.subject.value)
          : undefined
      );

    } catch (error) {

      return new Set();

    }

  }

  private async synchronizeComponents(): Promise<void> {

    const existingComponents = await this.componentsInPod(this.localPod);

    const pods: string[] = await this.store.get(this.storage) ?? [];

    // map of components to be fetched, mapped to a node which has the component metadata
    const componentToFetch: Map<string, string> = new Map();

    await Promise.all(pods.map(async (pod) => {

      [ ...await this.componentsInPod(pod) ]
        .filter((component) => !existingComponents.has(component))
        .forEach((component) => componentToFetch.set(component, pod));

    }));

    await Promise.all([ ... componentToFetch.entries() ].map(async ([ component, node ]) => {

      const httpResponse = await fetch(`${node}${component}`, {
        headers: { 'Accept': 'text/turtle' },
      });

      if (httpResponse.status === 200) {

        const metadata = await httpResponse.text();

        await fetch(this.localPod, {
          method: 'post',
          body: metadata,
          headers: {
            'Content-Type': 'text/turtle',
            'Slug': component, // this is actually an encoded version of the component
          },
        });

      }

    }));

  }

  handle(): Observable<void> {

    return from(this.synchronizeComponents());

  }

}
