import { AbstractRegisterComponentService, QueryComponentService, ComponentMetadata } from '@digita-ai/semcom-core';
import { Observable, from, of } from 'rxjs';
import { QueryComponentRemoteService,  RegisterComponentService, resourceShape } from '@digita-ai/semcom-sdk';

import { Injectable } from '@angular/core';
import { fetch as inruptFetch } from '@inrupt/solid-client-authn-browser';

@Injectable({ providedIn: 'root' })
export class SemComService {

  private registry: AbstractRegisterComponentService = new RegisterComponentService();
  // private repo: QueryComponentService = new QueryComponentRemoteService('http://localhost:3000');
  private repo: QueryComponentService = new QueryComponentRemoteService('https://node.semcom.digita.ai');

  detectShapes(uri: string): Observable<string[]> {

    return from(resourceShape(uri, inruptFetch));

  }

  queryComponents(shapeId: string): Observable<ComponentMetadata[]> {

    const filter = { shapes: [ shapeId ], version: '^0.1.0' } as ComponentMetadata;

    return from(this.repo.query(filter));

  }

  registerComponent(metadata: ComponentMetadata): Observable<string> {

    return from(this.registry.register(metadata));

  }

}
