import { AbstractRegisterComponentService, QueryComponentService, ComponentMetadata } from '@digita-ai/semcom-core';
import { Observable, from } from 'rxjs';
import { QueryComponentRemoteService,  RegisterComponentService, resourceShape } from '@digita-ai/semcom-sdk';

import { fetch } from '@digita-ai/inrupt-solid-client';

/**
 *
 */
export class SemComService {

  private registry: AbstractRegisterComponentService;
  private repo: QueryComponentService;

  /**
   * Creates a { SemComService }.
   */
  constructor() {

    this.registry = new RegisterComponentService();
    this.repo = new QueryComponentRemoteService(process.env.VITE_SEMCOM_NODE_URI ?? 'http://localhost:3000');

  }

  /**
   * Detects shapes from a given uri.
   *
   * @param { string } uri - The uri to detect shapes from.
   */
  detectShapes(uri: string): Observable<string[]> {

    return from(resourceShape(uri, fetch));

  }

  /**
   * Queries components from the QueryComponentService using a filter based on the provided shapeId.
   *
   * @param { string } shapeId - The shapeId to filter components by.
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
