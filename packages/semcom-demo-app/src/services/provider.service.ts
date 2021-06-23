import { Observable, of } from 'rxjs';
import { login } from '@inrupt/solid-client-authn-browser';
import { Provider } from '../models/provider.model';

export class ProviderService {

  getAll(): Observable<Provider[]> {

    return of([
      new Provider('Solid Community', 'https://solidcommunity.net'),
      new Provider('Inrupt Broker', 'https://broker.pod.inrupt.com'),
    ]);

  }

  connect(issuer: string): void {

    login({
      oidcIssuer: issuer,
      redirectUrl: window.location.origin + '/connect/callback',
    });

  }

}
