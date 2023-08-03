import { AbstractRegisterComponentService, QueryComponentService, ComponentMetadata } from '@useid/semcom-core';
import { Observable, from } from 'rxjs';
import { QueryComponentRemoteService,  RegisterComponentService, resourceShape } from '@useid/semcom-sdk';

import { fetch } from '@useid/inrupt-solid-client';

/**
 * A service providing methods to perform the whole SemCom application flow, from detection over querying to registration.
 */
export class SemComService {

  private registry: AbstractRegisterComponentService;
  private repo: QueryComponentService;

  /**
   * Creates a { SemComService }.
   */
  constructor() {

    this.registry = new RegisterComponentService();
    this.repo = new QueryComponentRemoteService(process.env.SEMCOM_NODE_URI ?? process.env.VITE_SEMCOM_NODE_URI ?? 'http://localhost:3000');

  }

  /**
   * Detects shapes from a given uri.
   *
   * @param { string } uri - The uri to detect shapes from.
   * @returns Observable that emits the uris of the discovered shapes.
   */
  detectShapes(uri: string): Observable<string[]> {

    return from(resourceShape(uri, fetch));

  }

  /**
   * Queries components from the QueryComponentService using a filter based on the provided shapeId.
   *
   * @param { string } shapeId - The shapeId to filter components by.
   * @returns list of components based on the filter.
   */
  queryComponents(shapeId: string): Observable<ComponentMetadata[]> {

    const filter = { shapes: [ shapeId ], version: '^0.1.0' } as ComponentMetadata;

    return from(this.repo.query(filter));

  }

  /**
   * Registers a component with the RegisterComponentService using the provided component metadata.
   *
   * @param { ComponentMetadata } component - The component metadata to register the component with.
   */
  registerComponent(metadata: ComponentMetadata): Observable<string> {

    return from(this.registry.register(metadata));

  }

}
