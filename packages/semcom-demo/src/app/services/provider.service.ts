import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Provider } from '../models/provider.model';
import { login } from '@inrupt/solid-client-authn-browser';

@Injectable({ providedIn: 'root' })
export class ProviderService {

  getAll(): Observable<Provider[]> {
    return of([
      new Provider('Solid Community', 'https://solidcommunity.net'),
      new Provider('Inrupt Broker', 'https://broker.pod.inrupt.com')
    ]);

  }

  connect(issuer: string): void {
    login({ oidcIssuer: issuer, redirectUrl: window.location.origin + '/connect/callback' });
  }

}
