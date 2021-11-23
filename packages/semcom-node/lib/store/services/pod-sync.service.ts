import { Handler, TypedKeyValueStore } from '@digita-ai/handlersjs-core';
import { Parser } from 'n3';
import fetch from 'node-fetch';
import { from, Observable, of } from 'rxjs';

/**
 * A { Handler<void, void> } that handles the synchronization of components between a local pod and a store.
 */
export class PodSyncService<S extends string, M extends { [s in S]: string[] }>
  extends Handler<void, void> {

  /**
   * Creates a { PodSyncService }.
   *
   * @param { S } storage - The key in which the storage is located.
   * @param { TypedKeyValueStore<M> } store - The given key value store.
   * @param { string } localPod - The URI of the local pod.
   */
  constructor(
    private readonly storage: S,
    private readonly store: TypedKeyValueStore<M>,
    private readonly localPod: string,
  ) { super(); }

  canHandle(): Observable<boolean> {

    return of(true);

  }

  /**
   * Fetches all components for the given pod uri and returns them in a set.
   *
   * @param { string } uri - The given pod.
   */
  private async componentsInPod(uri: string): Promise<Set<string>> {

    try {

      const response = await fetch(uri, { headers: { 'Accept': 'text/turtle' } });

      return new Set(
        response.status === 200
          ? new Parser({ format: 'Turtle' }).parse(await response.text())
            .filter((quad) => quad.object.value === 'http://www.w3.org/ns/ldp#Resource')
            .filter((quad) => quad.subject.value !== '')
            .map((quad) => quad.subject.value)
          : undefined
      );

    } catch (error) {

      return new Set();

    }

  }

  /**
   * Synchronizes the components of the local pod with the components of the store.
   */
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

  /**
   * Calls the synchronizeComponents method to synchronize the components.
   */
  handle(): Observable<void> {

    return from(this.synchronizeComponents());

  }

}
