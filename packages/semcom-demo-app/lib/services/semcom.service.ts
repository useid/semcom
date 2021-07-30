import { AbstractRegisterComponentService, QueryComponentService, ComponentMetadata } from '@digita-ai/semcom-core';
import { Observable, from } from 'rxjs';
import { QueryComponentRemoteService,  RegisterComponentService, resourceShape } from '@digita-ai/semcom-sdk';

import { fetch } from '@digita-ai/inrupt-solid-client';

export class SemComService {

  private registry: AbstractRegisterComponentService;
  private repo: QueryComponentService;

  constructor() {

    this.registry = new RegisterComponentService();
    this.repo = new QueryComponentRemoteService(process.env.VITE_SEMCOM_NODE_URI ?? 'http://localhost:3000');

  }

  detectShapes(uri: string): Observable<string[]> {

    return from(resourceShape(uri, fetch));

  }

  queryComponents(shapeId: string): Observable<ComponentMetadata[]> {

    const filter = { shapes: [ shapeId ], version: '^0.1.0' } as ComponentMetadata;

    return from(this.repo.query(filter));

  }

  registerComponent(metadata: ComponentMetadata): Observable<string> {

    return from(this.registry.register(metadata));

  }

}
